import { Context } from "hono";
import { Bindings } from "../../types";
import { drizzle } from "drizzle-orm/d1";
import { users } from "../../schema";

export const addUserHandler = async (c: Context<{ Bindings: Bindings }>) => {
  try {
    const { email, password, name } = await c.req.json<{
      email: string;
      password: string;
      name: string;
    }>();

    // バリデーション
    if (!email || !password || !name) {
      return c.json(
        {
          success: false,
          message: "メールアドレス、パスワード、名前は必須です",
        },
        422
      );
    }

    // Firebase Authenticationでユーザーを作成
    const apiKey = c.env.FIREBASE_API_KEY;
    const response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      if (data.error?.message === "EMAIL_EXISTS") {
        return c.json(
          {
            success: false,
            message: "このメールアドレスは既に使用されています",
          },
          409
        );
      }
      throw new Error(data.error?.message || "Unknown error");
    }

    // D1データベースにユーザー情報を保存
    const db = drizzle(c.env.DB);
    const result = await db
      .insert(users)
      .values({
        firebase_uid: data.localId,
        email,
        name,
        created_at: new Date().toISOString(),
      })
      .returning();

    return c.json(
      {
        success: true,
        data: {
          id: result[0].id,
          email: result[0].email,
          name: result[0].name,
          last_login_at: result[0].last_login_at,
        },
      },
      201
    );
  } catch (error) {
    console.error(
      "エラー:",
      error instanceof Error ? error.message : String(error)
    );
    return c.json(
      {
        success: false,
        message: "Internal server error",
      },
      500
    );
  }
};
