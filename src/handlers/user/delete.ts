import { Context } from "hono";
import { Bindings, Variables } from "../../types";
import { drizzle } from "drizzle-orm/d1";
import { users } from "../../schema";
import { eq } from "drizzle-orm";

export const deleteUserHandler = async (
  c: Context<{ Bindings: Bindings; Variables: Variables }>
) => {
  try {
    const email = c.req.param("email");
    const authenticatedUser = c.get("user");

    // 認証ユーザーの権限チェック
    const db = drizzle(c.env.DB);
    const adminCheck = await db
      .select({ is_admin: users.is_admin })
      .from(users)
      .where(eq(users.firebase_uid, authenticatedUser.uid));

    if (!adminCheck[0]?.is_admin) {
      return c.json(
        {
          success: false,
          message: "この操作を実行する権限がありません",
        },
        403
      );
    }

    // 削除対象ユーザーの存在確認
    const targetUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (targetUser.length === 0) {
      return c.json(
        {
          success: false,
          message: "指定されたユーザーが見つかりません",
        },
        404
      );
    }

    // ユーザー削除
    await db.delete(users).where(eq(users.email, email));

    return c.json({
      message: "ユーザーを削除しました",
      data: {
        email,
        deleted_at: new Date().toISOString(),
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
