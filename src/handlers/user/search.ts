import { Context } from "hono";
import { Bindings, Variables } from "../../types";
import { drizzle } from "drizzle-orm/d1";
import { users } from "../../schema";
import { eq, sql } from "drizzle-orm";

export const searchUserHandler = async (
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
    const result = await db
      .select({
        exists: sql<number>`CASE WHEN COUNT(*) > 0 THEN 1 ELSE 0 END`,
      })
      .from(users)
      .where(eq(users.email, email));

    return c.json({
      success: true,
      exists: result[0].exists === 1,
      message:
        result[0].exists === 1
          ? "ユーザーが存在します"
          : "ユーザーは登録されていません",
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
