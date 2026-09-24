import assert from "node:assert/strict";
import { createHash, randomUUID } from "node:crypto";
import { createServer } from "node:http";
import test from "node:test";
import { Server } from "socket.io";
import { io as createClient, type Socket as ClientSocket } from "socket.io-client";
import { attachGameSocket } from "./socket";
import { MemoryRoomStore } from "./persistence";

type State = {
  roomCode: string;
  hostId: string;
  phase: string;
  round: number;
  players: Array<{ id: string; name: string }>;
  me?: { id: string; name: string };
  assignments?: Array<{ assignmentId: string; prompt: string; answer: string | null }>;
  voteGroups?: Array<{ matchupId: string; question: number; answers: Array<{ id: string; text: string }>; voted: boolean }>;
  winnerId?: string;
  powerChooserId?: string;
  powerTargets?: Array<{ id: string; name: string }>;
  modifier?: { type: string; value: string; targetPlayerId: string };
  results?: {
    winnerId: string;
    answers: Array<{ id: string; authorId: string; text: string; votes: number }>;
    leaderboard: Array<{ id: string; name: string; score: number; abilityPoints: number }>;
  };
};

function waitForState(client: ClientSocket, predicate: (state: State) => boolean) {
  return new Promise<State>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Timed out waiting for game state")), 3_000);
    const onState = (state: State) => {
      if (!predicate(state)) return;
      clearTimeout(timer);
      client.off("game:state", onState);
      resolve(state);
    };
    client.on("game:state", onState);
  });
}

function emitWithAck<T>(client: ClientSocket, event: string, payload: unknown) {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Timed out waiting for ${event}`)), 3_000);
    client.emit(event, payload, (result: T) => {
      clearTimeout(timer);
      resolve(result);
    });
  });
}

function waitForGameError(client: ClientSocket) {
  return new Promise<string>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Timed out waiting for game error")), 3_000);
    client.once("game:error", (result: { message: string }) => {
      clearTimeout(timer);
      resolve(result.message);
    });
  });
}

test("three clients create, join, and receive private assignments", async () => {
  const httpServer = createServer();
  const io = new Server(httpServer);
  attachGameSocket(io, { store: new MemoryRoomStore() });
  await new Promise<void>(resolve => httpServer.listen(0, "127.0.0.1", resolve));
  const address = httpServer.address();
  assert.ok(address && typeof address === "object");
  const url = `http://127.0.0.1:${address.port}`;
  const clients = ["Host", "Priya", "Rahul"].map(() => createClient(url, { transports: ["websocket"] }));

  try {
    await Promise.all(clients.map(client => new Promise<void>(resolve => client.on("connect", () => resolve()))));
    for (const payload of [null, [], {}, { name: null }]) {
      const error = waitForGameError(clients[0]);
      clients[0].emit("room:create", payload);
      assert.match(await error, /Invalid room request|Name is required/);
    }
    const created = await emitWithAck<{ roomCode: string }>(clients[0], "room:create", { name: "Host" });
    assert.match(created.roomCode, /^[A-F0-9]{8}$/);
    await emitWithAck(clients[1], "room:join", { roomCode: created.roomCode, name: "Priya" });
    const lobbyReady = waitForState(clients[0], state => state.phase === "lobby" && state.players.length === 3);
    await emitWithAck(clients[2], "room:join", { roomCode: created.roomCode, name: "Rahul" });
    assert.equal((await lobbyReady).players.length, 3);

    const answering = clients.map(client => waitForState(client, state => state.phase === "answering"));
    clients[0].emit("room:start", created.roomCode);
    const states = await Promise.all(answering);
    for (const state of states) {
      assert.equal(state.assignments?.length, 4);
      assert.equal(state.assignments?.every(assignment => assignment.answer === null), true);
    }
    assert.notDeepEqual(states[0].assignments?.map(item => item.assignmentId), states[1].assignments?.map(item => item.assignmentId));
  } finally {
    for (const client of clients) client.disconnect();
    await io.close();
    await new Promise<void>(resolve => httpServer.close(() => resolve()));
  }
});

test("preserves submitted votes when the voting deadline expires", async () => {
  const httpServer = createServer();
  const io = new Server(httpServer);
  attachGameSocket(io, { timeoutMs: 250, store: new MemoryRoomStore() });
  await new Promise<void>(resolve => httpServer.listen(0, "127.0.0.1", resolve));
  const address = httpServer.address();
  assert.ok(address && typeof address === "object");
  const url = `http://127.0.0.1:${address.port}`;
  const clients = ["Host", "Priya", "Rahul"].map(() => createClient(url, { transports: ["websocket"] }));

  try {
    await Promise.all(clients.map(client => new Promise<void>(resolve => client.on("connect", resolve))));
    const created = await emitWithAck<{ roomCode: string }>(clients[0], "room:create", { name: "Host" });
    await Promise.all([
      emitWithAck(clients[1], "room:join", { roomCode: created.roomCode, name: "Priya" }),
      emitWithAck(clients[2], "room:join", { roomCode: created.roomCode, name: "Rahul" }),
    ]);

    const answering = clients.map(client => waitForState(client, state => state.phase === "answering" && state.round === 1));
    clients[0].emit("room:start", created.roomCode);
    const answeringStates = await Promise.all(answering);
    const voting = clients.map(client => waitForState(client, state => state.phase === "voting" && state.round === 1));
    answeringStates.forEach((state, clientIndex) => {
      for (const [answerIndex, assignment] of (state.assignments ?? []).entries()) {
        const [pairId, question] = assignment.assignmentId.split(":");
        clients[clientIndex].emit("game:answer", created.roomCode, {
          pairId,
          question: Number(question),
          text: `p${clientIndex}-answer-${answerIndex}`,
        });
      }
    });
    const votingStates = await Promise.all(voting);
    const selectedAnswerId = votingStates[0].voteGroups?.[0]?.answers[0]?.id;
    assert.ok(selectedAnswerId);

    const results = clients.map(client => waitForState(client, state => state.phase === "results" && state.round === 1));
    clients[0].emit("game:vote", created.roomCode, { answerId: selectedAnswerId });
    const resultStates = await Promise.all(results);

    for (const state of resultStates) {
      assert.equal(state.results?.answers.reduce((sum, answer) => sum + answer.votes, 0), 1);
      assert.equal(state.results?.answers.find(answer => answer.id === selectedAnswerId)?.votes, 1);
      assert.equal(state.results?.leaderboard.reduce((sum, player) => sum + player.score, 0), 100);
      assert.deepEqual(
        state.results?.leaderboard.map(player => ({ id: player.id, score: player.score })),
        resultStates[0].results?.leaderboard.map(player => ({ id: player.id, score: player.score })),
      );
    }
  } finally {
    for (const client of clients) client.disconnect();
    await io.close();
    await new Promise<void>(resolve => httpServer.close(() => resolve()));
  }
});

test("eight clients complete a full round with the expected assignments, votes, and scores", async () => {
  const httpServer = createServer();
  const io = new Server(httpServer);
  attachGameSocket(io, { store: new MemoryRoomStore() });
  await new Promise<void>(resolve => httpServer.listen(0, "127.0.0.1", resolve));
  const address = httpServer.address();
  assert.ok(address && typeof address === "object");
  const url = `http://127.0.0.1:${address.port}`;
  const clients = Array.from({ length: 8 }, (_, index) => createClient(url, { transports: ["websocket"], auth: { testPlayer: index } }));

  try {
    await Promise.all(clients.map(client => new Promise<void>(resolve => client.on("connect", resolve))));
    const created = await emitWithAck<{ roomCode: string }>(clients[0], "room:create", { name: "Player 1" });
    await Promise.all(clients.slice(1).map((client, index) =>
      emitWithAck(client, "room:join", { roomCode: created.roomCode, name: `Player ${index + 2}` }),
    ));

    const answering = clients.map(client => waitForState(client, state => state.phase === "answering" && state.round === 1));
    clients[0].emit("room:start", created.roomCode);
    const answeringStates = await Promise.all(answering);
    for (const state of answeringStates) {
      assert.equal(state.players.length, 8);
      assert.equal(state.assignments?.length, 4);
      assert.equal(new Set(state.assignments?.map(assignment => assignment.assignmentId)).size, 4);
      assert.equal(new Set(state.assignments?.map(assignment => assignment.prompt)).size, 4);
    }
    assert.equal(new Set(answeringStates.flatMap(state => state.assignments?.map(a => a.prompt))).size, 16);

    const voting = clients.map(client => waitForState(client, state => state.phase === "voting" && state.round === 1));
    answeringStates.forEach((state, clientIndex) => {
      for (const [answerIndex, assignment] of (state.assignments ?? []).entries()) {
        const [pairId, question] = assignment.assignmentId.split(":");
        clients[clientIndex].emit("game:answer", created.roomCode, {
          pairId,
          question: Number(question),
          text: `p${clientIndex + 1}-a${answerIndex + 1}`,
        });
      }
    });
    const votingStates = await Promise.all(voting);
    for (const state of votingStates) {
      assert.equal(state.voteGroups?.length, 12);
      assert.equal(state.voteGroups?.every(group => group.answers.length === 2), true);
    }

    const results = clients.map(client => waitForState(client, state => state.phase === "results" && state.round === 1));
    votingStates.forEach((state, clientIndex) => {
      for (const group of state.voteGroups ?? []) {
        clients[clientIndex].emit("game:vote", created.roomCode, { answerId: group.answers[0].id });
      }
    });
    const resultStates = await Promise.all(results);
    for (const state of resultStates) {
      assert.equal(state.results?.answers.length, 32);
      assert.equal(state.results?.answers.reduce((sum, answer) => sum + answer.votes, 0), 96);
      assert.equal(state.results?.leaderboard.reduce((sum, player) => sum + player.score, 0), 9_600);
      assert.deepEqual(
        state.results?.leaderboard.map(player => ({ id: player.id, score: player.score })),
        resultStates[0].results?.leaderboard.map(player => ({ id: player.id, score: player.score })),
      );
    }
  } finally {
    for (const client of clients) client.disconnect();
    await io.close();
    await new Promise<void>(resolve => httpServer.close(() => resolve()));
  }
});

test("restores a persisted room and resumes the same private player identity", async () => {
  const store = new MemoryRoomStore();
  const token = "stable-successor-session-token";
  const hostId = randomUUID();
  const playerId = randomUUID();
  await store.save({
    code: "RESTORED",
    hostId,
    players: [{
      id: hostId,
      name: "Absent host",
      score: 0,
      abilityPoints: 0,
      sessionTokenHash: createHash("sha256").update("absent-host-token").digest("hex"),
    }, {
      id: playerId,
      name: "Successor",
      score: 400,
      abilityPoints: 2,
      sessionTokenHash: createHash("sha256").update(token).digest("hex"),
    }],
    phase: "lobby",
    round: 0,
    pairs: [],
    answers: [],
    votes: {},
    modifier: null,
    roastLine: null,
  });
  const httpServer = createServer();
  const io = new Server(httpServer);
  attachGameSocket(io, { store, reconnectGraceMs: 20, abandonedRoomTtlMs: 5_000 });
  await new Promise<void>(resolve => httpServer.listen(0, "127.0.0.1", resolve));
  const address = httpServer.address();
  assert.ok(address && typeof address === "object");
  const client = createClient(`http://127.0.0.1:${address.port}`, { transports: ["websocket"] });
  try {
    await new Promise<void>(resolve => client.on("connect", resolve));
    const resumed = waitForState(client, state => state.roomCode === "RESTORED" && state.me?.id === playerId && state.hostId === playerId);
    const ack = await emitWithAck<{ playerId: string }>(client, "room:resume", { roomCode: "RESTORED", sessionToken: token });
    assert.equal(ack.playerId, playerId);
    const state = await resumed;
    assert.equal(state.me?.id, playerId);
    assert.equal(state.hostId, playerId);
    assert.equal((state.me as { score?: number }).score, 400);
  } finally {
    client.disconnect();
    await io.close();
    await new Promise<void>(resolve => httpServer.close(() => resolve()));
  }
});

test("migrates the host after the reconnect grace period and deletes abandoned rooms", async () => {
  const store = new MemoryRoomStore();
  const httpServer = createServer();
  const io = new Server(httpServer);
  attachGameSocket(io, { store, reconnectGraceMs: 20, abandonedRoomTtlMs: 40 });
  await new Promise<void>(resolve => httpServer.listen(0, "127.0.0.1", resolve));
  const address = httpServer.address();
  assert.ok(address && typeof address === "object");
  const url = `http://127.0.0.1:${address.port}`;
  const host = createClient(url, { transports: ["websocket"] });
  const successor = createClient(url, { transports: ["websocket"] });
  try {
    await Promise.all([host, successor].map(client => new Promise<void>(resolve => client.on("connect", resolve))));
    const created = await emitWithAck<{ roomCode: string; playerId: string }>(host, "room:create", { name: "Host" });
    const joined = await emitWithAck<{ playerId: string }>(successor, "room:join", { roomCode: created.roomCode, name: "Successor" });
    const migrated = waitForState(successor, state => state.hostId === joined.playerId);
    host.disconnect();
    assert.equal((await migrated).hostId, joined.playerId);
    successor.disconnect();
    await new Promise(resolve => setTimeout(resolve, 80));
    assert.equal((await store.loadAll()).length, 0);
  } finally {
    host.disconnect();
    successor.disconnect();
    await io.close();
    await new Promise<void>(resolve => httpServer.close(() => resolve()));
  }
});

test("three clients complete all rounds, a deadline transition, powers, final results, and rematch", async () => {
  const httpServer = createServer();
  const io = new Server(httpServer);
  attachGameSocket(io, { timeoutMs: 500, store: new MemoryRoomStore() });
  await new Promise<void>(resolve => httpServer.listen(0, "127.0.0.1", resolve));
  const address = httpServer.address();
  assert.ok(address && typeof address === "object");
  const url = `http://127.0.0.1:${address.port}`;
  const clients = ["Host", "Priya", "Rahul"].map(() => createClient(url, { transports: ["websocket"] }));

  const waitForAll = (phase: string, round: number) =>
    Promise.all(clients.map(client => waitForState(client, state => state.phase === phase && state.round === round)));

  const submitAnswers = async (states: State[], round: number) => {
    const voting = waitForAll("voting", round);
    states.forEach((state, clientIndex) => {
      for (const [answerIndex, assignment] of (state.assignments ?? []).entries()) {
        const parts = assignment.assignmentId.split(":");
        const payload = round < 3
          ? { pairId: parts[0], question: Number(parts[1]), text: `r${round}p${clientIndex}a${answerIndex}` }
          : { question: 0, text: `final-${clientIndex}` };
        clients[clientIndex].emit("game:answer", state.roomCode, payload);
      }
    });
    return voting;
  };

  const submitVotes = async (states: State[], round: number) => {
    const results = waitForAll("results", round);
    states.forEach((state, clientIndex) => {
      assert.equal(state.voteGroups?.every(group => group.answers.every(answer => !answer.id.startsWith(`${state.players[clientIndex].id}:`))), true);
      for (const group of state.voteGroups ?? []) {
        assert.equal(group.answers.length, 2);
        clients[clientIndex].emit("game:vote", state.roomCode, { answerId: group.answers[0].id });
      }
    });
    return results;
  };

  try {
    await Promise.all(clients.map(client => new Promise<void>(resolve => client.on("connect", resolve))));
    const created = await emitWithAck<{ roomCode: string; playerId: string }>(clients[0], "room:create", { name: "Host" });
    const joined = await Promise.all([
      emitWithAck<{ playerId: string }>(clients[1], "room:join", { roomCode: created.roomCode, name: "Priya" }),
      emitWithAck<{ playerId: string }>(clients[2], "room:join", { roomCode: created.roomCode, name: "Rahul" }),
    ]);
    const playerIds = [created.playerId, ...joined.map(result => result.playerId)];

    const round1Answering = waitForAll("answering", 1);
    clients[0].emit("room:start", created.roomCode);
    let answeringStates = await round1Answering;
    const seenPrompts = new Set<string>();
    const checkPrompts = (states: State[]) => {
      const prompts = new Set(states.flatMap(state => state.assignments?.map(a => a.prompt) ?? []));
      for (const prompt of prompts) assert.equal(seenPrompts.has(prompt), false);
      for (const prompt of prompts) seenPrompts.add(prompt);
    };
    checkPrompts(answeringStates);
    let votingStates = await submitAnswers(answeringStates, 1);
    let resultStates = await submitVotes(votingStates, 1);
    assert.equal(resultStates[0].results?.leaderboard.reduce((sum, player) => sum + player.score, 0), 600);

    const usePowerAndContinue = async (round: number, states: State[]) => {
      const chooserId = states[0].powerChooserId;
      assert.ok(chooserId);
      const chooserIndex = playerIds.indexOf(chooserId);
      assert.notEqual(chooserIndex, -1);
      const powerSelect = waitForState(clients[chooserIndex], state => state.phase === "powerSelect" && state.round === round);
      clients[0].emit("game:next", created.roomCode);
      const chooserState = await powerSelect;
      assert.equal(chooserState.powerTargets?.length, 2);
      const targetId = chooserState.powerTargets?.[0].id;
      assert.ok(targetId);
      const targetIndex = playerIds.indexOf(targetId);
      const reveal = waitForAll("powerReveal", round);
      clients[chooserIndex].emit("game:power", created.roomCode, { type: "emoji", targetPlayerId: targetId });
      const revealStates = await reveal;
      assert.equal(revealStates[chooserIndex].modifier?.targetPlayerId, targetId);
      assert.equal(revealStates[targetIndex].modifier?.type, "emoji");
      const uninvolvedIndex = [0, 1, 2].find(index => index !== chooserIndex && index !== targetIndex);
      assert.notEqual(uninvolvedIndex, undefined);
      assert.equal(revealStates[uninvolvedIndex!].modifier, undefined);
      const nextAnswering = waitForAll("answering", round + 1);
      clients[chooserIndex].emit("game:next", created.roomCode);
      return nextAnswering;
    };

    answeringStates = await usePowerAndContinue(1, resultStates);
    checkPrompts(answeringStates);

    const round2Voting = waitForAll("voting", 2);
    clients[0].emit("game:answer", created.roomCode, {
      pairId: answeringStates[0].assignments?.[0].assignmentId.split(":")[0],
      question: 0,
      text: "before-timeout",
    });
    votingStates = await round2Voting;
    assert.equal(votingStates[0].voteGroups?.flatMap(group => group.answers).some(answer => answer.text === "No comment."), true);
    resultStates = await submitVotes(votingStates, 2);
    assert.equal(resultStates[0].results?.leaderboard.reduce((sum, player) => sum + player.score, 0), 1_500);

    answeringStates = await usePowerAndContinue(2, resultStates);
    checkPrompts(answeringStates);
    assert.equal(seenPrompts.size, 13);
    votingStates = await submitAnswers(answeringStates, 3);
    resultStates = await submitVotes(votingStates, 3);
    const finalLeaderboard = resultStates[0].results?.leaderboard;
    assert.ok(finalLeaderboard);
    assert.equal(finalLeaderboard.reduce((sum, player) => sum + player.score, 0), 2_100);
    assert.deepEqual(finalLeaderboard.map(player => player.id), resultStates[1].results?.leaderboard.map(player => player.id));
    assert.equal(finalLeaderboard.every((player, index) => index === 0 || finalLeaderboard[index - 1].score >= player.score), true);

    const gameOver = waitForAll("gameOver", 3);
    clients[0].emit("game:next", created.roomCode);
    const gameOverStates = await gameOver;
    assert.deepEqual(gameOverStates[0].results?.leaderboard, finalLeaderboard);

    const rematched = waitForAll("lobby", 0);
    clients[0].emit("room:rematch", created.roomCode);
    const lobbyStates = await rematched;
    for (const state of lobbyStates) {
      assert.equal(state.players.every(player => (player as { score?: number }).score === 0), true);
      assert.equal(state.players.every(player => (player as { abilityPoints?: number }).abilityPoints === 0), true);
      assert.equal(state.results, undefined);
      assert.equal(state.assignments, undefined);
      assert.equal(state.modifier, undefined);
    }
    const replay = waitForAll("answering", 1);
    clients[0].emit("room:start", created.roomCode);
    const replayStates = await replay;
    assert.equal(new Set(replayStates.flatMap(state => state.assignments?.map(a => a.prompt))).size, 6);
  } finally {
    for (const client of clients) client.disconnect();
    await io.close();
    await new Promise<void>(resolve => httpServer.close(() => resolve()));
  }
});