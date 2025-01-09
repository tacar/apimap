import { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import { verifyFirebaseAuth } from "@hono/firebase-auth";
import { bearerAuth } from "hono/bearer-auth";

// Firebase認証ミドルウェア
export const firebaseAuthMiddleware = async (c: Context, next: Next) => {
  console.log("Firebase認証プロセスを開始");
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("認証トークンが提供されていません");
    return c.json({ error: "No token provided" }, 401);
  }

  const token = authHeader.split(" ")[1];
  const tokenPreview = `${token.substring(0, 10)}...${token.slice(-5)}`;
  console.log("受信したトークン:", tokenPreview);

  const firebaseConfig = {
    projectId: c.env.FIREBASE_PROJECT_ID,
    clientEmail: c.env.FIREBASE_CLIENT_EMAIL,
    privateKey: c.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  };

  try {
    console.log("トークンの検証を開始");
    const decodedToken = await verifyFirebaseAuth(token, firebaseConfig);
    console.log("トークンの検証に成功。ユーザーID:", decodedToken.uid);
    c.set("user", decodedToken);
    await next();
  } catch (error) {
    console.error("Firebase認証エラー:", error);
    return c.json({ error: "Invalid token" }, 401);
  }
};

// 開発用の簡易認証ミドルウェア
const devAuthMiddleware = bearerAuth({ token: "dev-token" });

// 環境に応じた認証ミドルウェアを選択
export const authMiddleware =
  process.env.NODE_ENV === "development"
    ? async (c: Context, next: Next) => {
        console.log("開発モード: 簡易認証を使用");
        console.log("開発用トークン: dev-token");
        await devAuthMiddleware(c, next);
      }
    : firebaseAuthMiddleware;
