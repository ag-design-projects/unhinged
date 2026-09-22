import type { Server, Socket } from "socket.io";
import { randomBytes } from "node:crypto";
import { GameEngine, snapshot, type Player, type PowerType } from "./engine";

const rooms = new Map<string, GameEngine>();
const code = () => randomBytes(2).toString("hex").toUpperCase();
const emitRoom = (io: Server, roomCode: string) => {
  const game = rooms.get(roomCode); if (!game) return;
  for (const player of game.room.players) io.to(player.socketId ?? "").emit("game:state", snapshot(game.room, player.id));
};
const fail = (socket: Socket, error: unknown) => socket.emit("game:error", { message: error instanceof Error ? error.message : "Game action failed" });
const findPlayer = (game: GameEngine, socket: Socket) => game.room.players.find(p => p.socketId === socket.id);
const scheduleTimeout = (io: Server, game: GameEngine) => {
  const round = game.room.round;
  const phase = game.room.phase;
  const deadline = game.room.deadline;
  const timer = setTimeout(() => {
    if (game.room.round === round && game.room.phase === phase && game.room.deadline === deadline) {
      game.timeout();
      emitRoom(io, game.room.code);
      if (game.room.phase === "voting") scheduleTimeout(io, game);
    }
  }, 45_000);
  timer.unref();
};

export function attachGameSocket(io: Server) {
  io.on("connection", socket => {
    socket.on("room:create", ({ name }: { name: string }, done?: (result: unknown) => void) => {
      try {
        const id = socket.id;
        const player: Player = { id, socketId: socket.id, name: String(name).trim().slice(0, 32), score: 0, abilityPoints: 0 };
        if (!player.name) throw new Error("Name is required");
        const roomCode = code(); const game = new GameEngine(roomCode, player); rooms.set(roomCode, game); socket.join(roomCode);
        done?.({ roomCode, playerId: id }); emitRoom(io, roomCode);
      } catch (e) { fail(socket, e); }
    });
    socket.on("room:join", ({ roomCode, name }: { roomCode: string; name: string }, done?: (result: unknown) => void) => {
      try {
        const game = rooms.get(String(roomCode).toUpperCase()); if (!game) throw new Error("Room not found");
        const player: Player = { id: socket.id, socketId: socket.id, name: String(name).trim().slice(0, 32), score: 0, abilityPoints: 0 };
        if (!player.name) throw new Error("Name is required"); game.addPlayer(player); socket.join(game.room.code);
        done?.({ roomCode: game.room.code, playerId: player.id }); emitRoom(io, game.room.code);
      } catch (e) { fail(socket, e); }
    });
    const action = (fn: (game: GameEngine, player: Player, ...args: any[]) => void) => {
      return (...args: unknown[]) => {
        try {
          const roomCode = String(args[0]); const game = rooms.get(roomCode); if (!game) throw new Error("Room not found");
          const player = findPlayer(game, socket); if (!player) throw new Error("You are not in this room");
          fn(game, player, ...args.slice(1)); emitRoom(io, roomCode);
        } catch (e) { fail(socket, e); }
      };
    };
    socket.on("room:start", action((g, p) => { g.start(p.id); scheduleTimeout(io, g); }));
    socket.on("game:answer", action((g, p, input: { text: string; pairId?: string; question?: number }) => { g.answer(p.id, input.text, input.pairId, input.question ?? 0); if (g.room.phase === "voting") scheduleTimeout(io, g); }));
    socket.on("game:vote", action((g, p, input: { answerId: string }) => { g.vote(p.id, input.answerId); if (g.room.phase === "results") setTimeout(() => { g.setRoast(); emitRoom(io, g.room.code); }, 250); }));
    socket.on("game:next", action((g, p) => { if (p.id !== g.room.hostId && p.id !== g.room.powerChooserId) throw new Error("Only the host or winner can continue"); g.next(); if (g.room.phase === "answering") scheduleTimeout(io, g); }));
    socket.on("game:power", action((g, p, input: { type: PowerType; targetPlayerId: string }) => g.choosePower(p.id, input.type, input.targetPlayerId)));
    socket.on("room:rematch", action((g, p) => g.rematch(p.id)));
    socket.on("disconnect", () => {
      for (const game of rooms.values()) if (game.room.players.some(p => p.socketId === socket.id)) emitRoom(io, game.room.code);
    });
  });
  return rooms;
}