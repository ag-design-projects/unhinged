import assert from "node:assert/strict";
import { createServer } from "node:http";
import test from "node:test";
import { Server } from "socket.io";
import { io as createClient, type Socket as ClientSocket } from "socket.io-client";
import { attachGameSocket } from "./socket";

type State = {
  roomCode: string;
  phase: string;
  round: number;
  players: Array<{ id: string; name: string }>;
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
  attachGameSocket(io);
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

test("three clients complete all rounds, a deadline transition, powers, final results, and rematch", async () => {
  const httpServer = createServer();
  const io = new Server(httpServer);
  attachGameSocket(io, { timeoutMs: 500 });
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
  } finally {
    for (const client of clients) client.disconnect();
    await io.close();
    await new Promise<void>(resolve => httpServer.close(() => resolve()));
  }
});