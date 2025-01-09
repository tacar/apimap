import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const images = sqliteTable("images", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  user_id: integer("user_id").notNull(),
  file_name: text("file_name").notNull(),
  file_path: text("file_path").notNull(),
  mime_type: text("mime_type").notNull(),
  size: integer("size").notNull(),
  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
  deleted_at: text("deleted_at"),
});

export type Image = typeof images.$inferSelect;
export type InsertImage = typeof images.$inferInsert;
