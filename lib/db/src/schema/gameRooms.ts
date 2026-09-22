import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const gameRoomsTable = pgTable("game_rooms", {
  code: text("code").primaryKey(),
  state: jsonb("state").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type GameRoomRecord = typeof gameRoomsTable.$inferSelect;