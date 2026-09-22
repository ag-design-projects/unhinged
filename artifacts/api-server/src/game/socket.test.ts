import assert from "node:assert/strict";
import { createServer } from "node:http";
import test from "node:test";
import { Server } from "socket.io";
import { io as createClient, type Socket as ClientSocket } from "socket.io-client";
import { attachGameSocket } from "./socket";

type State = {
  roomCode: string;
  phase: string;
  players: Array<{ id: string; name: string }>;
  assignments?: Array<{ assignmentId: string; prompt: string; answer: string | null }>;
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
    const created = await emitWithAck<{ roomCode: string }>(clients[0], "room:create", { name: "Host" });
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