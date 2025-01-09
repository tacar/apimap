import { Context } from "hono";
import { Bindings, Variables } from "../../types";
import { drizzle } from "drizzle-orm/d1";
import { users } from "../../schema";
import { eq } from "drizzle-orm";

export const updateLastLoginHandler = async (
  c: Context<{ Bindings: Bindings; Variables: Variables }>
) => {
  try {
    const { email } = await c.req.json<{ email: string }>();

    if (!email) {
      return c.json(
        {
          success: false,
          message: "メールアドレスは必須です",
        },
        422
      );
    }

    const db = drizzle(c.env.DB);
    const now = new Date().toISOString();

    // ユーザーの存在確認と更新
    const result = await db
      .update(users)
      .set({ last_login_at: now })
      .where(eq(users.email, email))
      .returning();

    if (result.length === 0) {
      return c.json(
        {
          success: false,
          message: "ユーザーが見つかりません",
        },
        404
      );
    }

    return c.json({
      success: true,
      message: "最終ログイン時間を更新しました",
      data: {
        email,
        last_login_at: now,
      },
    });
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
