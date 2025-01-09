import { Hono } from "hono";
import { Bindings, Variables } from "../types";
import { authMiddleware } from "../middleware/auth";
import { listTodosHandler } from "../handlers/todo/list";
import { createTodoHandler } from "../handlers/todo/create";
import { getTodoHandler } from "../handlers/todo/get";
import { updateTodoHandler } from "../handlers/todo/update";
import { deleteTodoHandler } from "../handlers/todo/delete";

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Todo一覧取得
app.get("/", authMiddleware, listTodosHandler);

// Todo作成
app.post("/", authMiddleware, createTodoHandler);

// Todo取得
app.get("/:id", authMiddleware, getTodoHandler);

// Todo更新
app.put("/:id", authMiddleware, updateTodoHandler);

// Todo削除
app.delete("/:id", authMiddleware, deleteTodoHandler);

export default app;
