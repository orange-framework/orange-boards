export * from "./auth-schema";

import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const board = sqliteTable("board", {
  id: text("id").primaryKey(),
  creator: text("creator").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

export type Board = typeof board.$inferSelect;