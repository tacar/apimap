// schema.ts
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// usersテーブル
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  firebase_uid: text("firebase_uid").unique(),
  is_admin: integer("is_admin").default(0),
  avater: integer("avater"),
  gid: text("gid"),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  email_verified_at: text("email_verified_at"),
  password: text("password"),
  remember_token: text("remember_token"),
  avatar: text("avatar"),
  token: text("token"),
  nickname: integer("nickname"),
  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("updated_at"),
  last_login_at: text("last_login_at"),
});

// todosテーブル
export const todos = sqliteTable("todos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  user_id: integer("user_id")
    .notNull()
    .references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  is_completed: integer("is_completed").default(0),
  due_date: text("due_date"),
  priority: integer("priority"),
  deleted_at: text("deleted_at"),
  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("updated_at"),
});

// imagesテーブル
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

// wordsテーブル
export const words = sqliteTable("words", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  word: text("word").notNull(),
  reading: text("reading"),
  meaning: text("meaning").notNull(),
  example: text("example"),
  category: text("category"),
  created_at: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updated_at: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
  deleted_at: text("deleted_at"),
});

// 型定義のエクスポート
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type Todo = typeof todos.$inferSelect;
export type InsertTodo = typeof todos.$inferInsert;

export type Image = typeof images.$inferSelect;
export type InsertImage = typeof images.$inferInsert;

export type Word = typeof words.$inferSelect;
export type InsertWord = typeof words.$inferInsert;
