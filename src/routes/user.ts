import { Hono } from "hono";
import { Bindings, Variables } from "../types";
import { authMiddleware } from "../middleware/auth";
import { loginHandler } from "../handlers/user/login";
import { listUsersHandler } from "../handlers/user/list";
import { searchUserHandler } from "../handlers/user/search";
import { deleteUserHandler } from "../handlers/user/delete";
import { addUserHandler } from "../handlers/user/add";
import { updateLastLoginHandler } from "../handlers/user/lastLogin";

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// ユーザー登録
app.post("/add", addUserHandler);

// ログインエンドポイント
app.post("/login", loginHandler);

// ユーザー検索（認証不要）
app.post("/search", searchUserHandler);

// ユーザー一覧取得（認証必要）
app.get("/list", authMiddleware, listUsersHandler);

// ユーザー削除
app.delete("/:email", authMiddleware, deleteUserHandler);

// 最終ログイン時間更新
app.put("/lastlogin", authMiddleware, updateLastLoginHandler);

export default app;
