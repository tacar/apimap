import { Hono } from "hono";
import { cors } from "hono/cors";
import { zValidator } from "@hono/zod-validator";
import { drizzle } from "drizzle-orm/d1";
import { users } from "./schema";
import { UsersResponseSchema, QuerySchema, Bindings, Context } from "./types";
import {
  VerifyFirebaseAuthConfig,
  VerifyFirebaseAuthEnv,
  verifyFirebaseAuth,
  getFirebaseToken,
} from "@hono/firebase-auth";
import { HTTPException } from "hono/http-exception";
type AppEnv = VerifyFirebaseAuthEnv & {
  DB: D1Database;
  FIREBASE_PROJECT_ID: string;
};
const app = new Hono<{ Bindings: AppEnv }>();
const firebaseConfig: VerifyFirebaseAuthConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID ?? "", // 空文字列をデフォルト値として設定
};
const authMiddleware = verifyFirebaseAuth(firebaseConfig);
app.get("/", (c: Context) => c.text("Hello Hono!"));
// CORS を適用
app.use(
  "/api/",
  cors({ origin: "", allowMethods: ["GET", "POST", "OPTIONS"] })
);
app.get(
  "/api/listuser",
  // 認証ミドルウェアを適用
  authMiddleware,
  async (c) => {
    console.log("認証ミドルウェアを通過");
    // FIREBASE_PROJECT_ID を出力
    console.log("FIREBASE_PROJECT_ID:", process.env.FIREBASE_PROJECT_ID);
    const token = await getFirebaseToken(c);
    console.log("取得したトークン:", token);
    if (!token) {
      throw new HTTPException(401, { message: "Unauthorized" });
    }
    // 管理者権限のチェック
    if (!token.claims.admin) {
      throw new HTTPException(403, { message: "Admin privileges required" });
    }
    // データベースからユーザーリストを取得
    const db = drizzle(c.env.DB);
    try {
      const result = await db.select().from(users);
      return c.json({ success: true, users: result });
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new HTTPException(500, { message: "Failed to fetch users" });
    }
  }
);
export default app;
