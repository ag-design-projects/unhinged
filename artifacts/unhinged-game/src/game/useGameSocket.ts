import { useCallback, useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";
import type { PowerType, Results, Snapshot } from "./types";

export function useGameSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [lastResults, setLastResults] = useState<Results | null>(null);
  const [error, setError] = useState("");
  const [disconnected, setDisconnected] = useState(false);
  const [reconnecting, setReconnecting] = useState(false);
  useEffect(() => {
    const client = io({ path: "/socket.io", reconnection: true, reconnectionAttempts: 10, reconnectionDelay: 500, reconnectionDelayMax: 3_000 });
    const resume = () => {
      const roomCode = new URLSearchParams(window.location.search).get("room")?.toUpperCase();
      const token = roomCode ? window.localStorage.getItem(`unhinged-session:${roomCode}`) : null;
      if (!roomCode || !token) return;
      setReconnecting(true);
      client.emit("room:resume", { roomCode, sessionToken: token }, (result: { error?: string }) => {
        if (!result?.error) return;
        setReconnecting(false);
        setDisconnected(true);
        setSnapshot(null);
        setError(result.error);
      });
    };
    client.on("connect", resume);
    client.on("game:state", (state: Snapshot) => {
      setSnapshot(state);
      if (state.results) setLastResults(state.results);
      setError("");
      setReconnecting(false);
      setDisconnected(false);
    });
    client.on("game:error", (data: { message?: string }) => setError(data.message || "Game action failed"));
    client.on("connect_error", () => setError("Connection lost. Please try again."));
    client.on("disconnect", reason => {
      if (reason === "io client disconnect") return;
      setReconnecting(true);
      setError("Connection lost. Reconnecting…");
    });
    client.io.on("reconnect_failed", () => {
      setReconnecting(false);
      setDisconnected(true);
      setSnapshot(null);
      setError("Unable to reconnect. Refresh to rejoin.");
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
    socket.emit("room:create", { name }, (result: { roomCode: string; sessionToken: string }) => {
      if (!result?.roomCode || !result.sessionToken) return;
      window.localStorage.setItem(`unhinged-session:${result.roomCode}`, result.sessionToken);
      window.history.replaceState({}, "", `?room=${result.roomCode}`);
    });
  }, [socket]);
  const join = useCallback((roomCode: string, name: string) => {
    if (!socket) return setError("Connecting to game server…");
    socket.emit("room:join", { roomCode: roomCode.toUpperCase(), name }, (result: { roomCode: string; sessionToken: string }) => {
      if (!result?.roomCode || !result.sessionToken) return;
      window.localStorage.setItem(`unhinged-session:${result.roomCode}`, result.sessionToken);
      window.history.replaceState({}, "", `?room=${result.roomCode}`);
    });
  }, [socket]);
  return {
    snapshot, lastResults, error, disconnected, reconnecting, clearError: () => setError(""),
    create, join,
    start: () => emit("room:start", snapshot?.roomCode),
    setAvoidRecentPrompts: (enabled: boolean) => emit("room:prompt-setting", snapshot?.roomCode, enabled),
    answer: (input: { text: string; pairId?: string; question?: number }) => emit("game:answer", snapshot?.roomCode, input),
    vote: (answerId: string) => emit("game:vote", snapshot?.roomCode, { answerId }),
    next: () => emit("game:next", snapshot?.roomCode),
    power: (type: PowerType, targetPlayerId: string) => emit("game:power", snapshot?.roomCode, { type, targetPlayerId }),
    rematch: () => emit("room:rematch", snapshot?.roomCode),
  };
}