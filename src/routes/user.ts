import { Hono } from "hono";
import { z } from "zod";
import {
  createUser,
  signInUser,
  searchUser,
  updateLastLogin,
  listUsers,
} from "../services/auth";
import { Bindings } from "../types";

const router = new Hono<{ Bindings: Bindings }>();

// スキーマ定義
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const searchSchema = z.object({
  email: z.string().email(),
});

const lastLoginSchema = z.object({
  email: z.string().email(),
});

// ユーザー登録
router.post("/add", async (c) => {
  try {
    const body = await c.req.json();
    const data = registerSchema.parse(body);
    const result = await createUser(data, c);
    return c.json(result, 201);
  } catch (error) {
    console.error("Register error:", error);
    if (error instanceof z.ZodError) {
      return c.json({ success: false, error: error.errors }, 400);
    }
    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      500
    );
  }
});

// ログイン
router.post("/login", async (c) => {
  try {
    const body = await c.req.json();
    const data = loginSchema.parse(body);
    const result = await signInUser(data, c);
    return c.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ success: false, error: error.errors }, 400);
    }
    return c.json({ success: false, error: "Invalid credentials" }, 401);
  }
});

// ユーザー一覧取得
router.get("/list", async (c) => {
  try {
    const result = await listUsers(c);
    return c.json(result);
  } catch (error) {
    return c.json({ success: false, error: "Failed to fetch users" }, 500);
  }
});

// ユーザー検索
router.post("/search", async (c) => {
  try {
    const body = await c.req.json();
    const data = searchSchema.parse(body);
    const result = await searchUser(data.email, c);
    return c.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ success: false, error: error.errors }, 400);
    }
    return c.json({ success: false, error: "Search failed" }, 500);
  }
});

// 最終ログイン時間の更新
router.put("/lastlogin", async (c) => {
  try {
    const body = await c.req.json();
    const data = lastLoginSchema.parse(body);
    const result = await updateLastLogin(data.email, c);
    return c.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ success: false, error: error.errors }, 400);
    }
    if (error instanceof Error && error.message === "User not found") {
      return c.json({ success: false, error: "User not found" }, 404);
    }
    return c.json({ success: false, error: "Update failed" }, 500);
  }
});

// Gmailログイン
router.post("/gmail-login", async (c) => {
  try {
    const body = await c.req.json();
    const { idToken } = body;

    if (!idToken) {
      return c.json({ success: false, error: "IDトークンが必要です" }, 400);
    }

    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key=${c.env.FIREBASE_API_KEY}`;
    const response = (await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postBody: `id_token=${idToken}&providerId=google.com`,
        requestUri: "http://localhost",
        returnIdpCredential: true,
        returnSecureToken: true,
      }),
    }).then((res) => res.json())) as {
      error?: { message: string };
      idToken?: string;
      email?: string;
      displayName?: string;
      photoUrl?: string;
    };

    if (response.error) {
      return c.json({ success: false, error: response.error.message }, 400);
    }

    return c.json({
      success: true,
      token: response.idToken,
      user: {
        email: response.email,
        name: response.displayName,
        picture: response.photoUrl,
      },
    });
  } catch (error) {
    console.error("Gmail login error:", error);
    return c.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      500
    );
  }
});

export default router;
