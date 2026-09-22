import { useCallback, useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";
import type { PowerType, Results, Snapshot } from "./types";

export function useGameSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [lastResults, setLastResults] = useState<Results | null>(null);
  const [error, setError] = useState("");
  const [disconnected, setDisconnected] = useState(false);
  useEffect(() => {
    const client = io({ path: "/socket.io", reconnection: false });
    client.on("game:state", (state: Snapshot) => { setSnapshot(state); if (state.results) setLastResults(state.results); setError(""); });
    client.on("game:error", (data: { message?: string }) => setError(data.message || "Game action failed"));
    client.on("connect_error", () => setError("Connection lost. Please try again."));
    client.on("disconnect", reason => {
      if (reason === "io client disconnect") return;
      setDisconnected(true);
      setSnapshot(null);
      setError("Connection lost. Refresh to rejoin.");
    });
    setSocket(client);
    return () => { client.disconnect(); };
  }, []);
  const emit = useCallback((event: string, ...args: unknown[]) => {
    if (!socket) setError("Connecting to game server…");
    else socket.emit(event, ...args);
  }, [socket]);
  const create = useCallback((name: string) => {
    if (!socket) return setError("Connecting to game server…");
    socket.emit("room:create", { name });
  }, [socket]);
  const join = useCallback((roomCode: string, name: string) => {
    if (!socket) return setError("Connecting to game server…");
    socket.emit("room:join", { roomCode: roomCode.toUpperCase(), name });
  }, [socket]);
  return {
    snapshot, lastResults, error, disconnected, clearError: () => setError(""),
    create, join,
    start: () => emit("room:start", snapshot?.roomCode),
    answer: (input: { text: string; pairId?: string; question?: number }) => emit("game:answer", snapshot?.roomCode, input),
    vote: (answerId: string) => emit("game:vote", snapshot?.roomCode, { answerId }),
    next: () => emit("game:next", snapshot?.roomCode),
    power: (type: PowerType, targetPlayerId: string) => emit("game:power", snapshot?.roomCode, { type, targetPlayerId }),
    rematch: () => emit("room:rematch", snapshot?.roomCode),
  };
}