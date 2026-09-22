import { db, gameRoomsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import type { Room } from "./engine";

export interface RoomStore {
  loadAll(): Promise<Room[]>;
  save(room: Room): Promise<void>;
  delete(code: string): Promise<void>;
}

const durableRoom = (room: Room): Room => ({
  ...room,
  players: room.players.map(({ socketId: _socketId, ...player }) => player),
});

export class PostgresRoomStore implements RoomStore {
  async loadAll() {
    const rows = await db.select({ state: gameRoomsTable.state }).from(gameRoomsTable);
    return rows.map(row => row.state as Room);
  }

  async save(room: Room) {
    const state = durableRoom(room);
    await db.insert(gameRoomsTable).values({ code: room.code, state })
      .onConflictDoUpdate({
        target: gameRoomsTable.code,
        set: { state, updatedAt: new Date() },
      });
  }

  async delete(code: string) {
    await db.delete(gameRoomsTable).where(eq(gameRoomsTable.code, code));
  }
}

export class MemoryRoomStore implements RoomStore {
  private readonly rooms = new Map<string, Room>();

  async loadAll() {
    return [...this.rooms.values()].map(room => structuredClone(room));
  }

  async save(room: Room) {
    this.rooms.set(room.code, structuredClone(durableRoom(room)));
  }

  async delete(code: string) {
    this.rooms.delete(code);
  }
}