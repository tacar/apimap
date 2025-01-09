import { Context } from "hono";
import { Bindings, Variables } from "../../types";
import { drizzle } from "drizzle-orm/d1";
import { todos } from "../../schema";
import { eq } from "drizzle-orm";

export const listTodosHandler = async (
  c: Context<{ Bindings: Bindings; Variables: Variables }>
) => {
  try {
    const user = c.get("user");
    const db = drizzle(c.env.DB);

    // ユーザーのTodo一覧を取得
    const result = await db
      .select()
      .from(todos)
      .where(eq(todos.user_id, user.uid))
      .where(eq(todos.deleted_at, null));

    if (result.length === 0) {
      return c.json({
        success: true,
        message: "Todoが見つかりません",
        data: [],
      });
    }

    return c.json({
      success: true,
      data: result,
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
