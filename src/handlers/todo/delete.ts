import { Context } from "hono";
import { Bindings, Variables } from "../../types";
import { drizzle } from "drizzle-orm/d1";
import { todos } from "../../schema";
import { and, eq } from "drizzle-orm";

export const deleteTodoHandler = async (
  c: Context<{ Bindings: Bindings; Variables: Variables }>
) => {
  try {
    const user = c.get("user");
    const id = parseInt(c.req.param("id"));

    if (isNaN(id)) {
      return c.json(
        {
          success: false,
          message: "無効なIDです",
        },
        422
      );
    }

    const db = drizzle(c.env.DB);

    // Todoの存在確認
    const existingTodo = await db
      .select()
      .from(todos)
      .where(
        and(
          eq(todos.id, id),
          eq(todos.user_id, user.uid),
          eq(todos.deleted_at, null)
        )
      );

    if (existingTodo.length === 0) {
      return c.json(
        {
          success: false,
          message: "Todoが見つかりません",
        },
        404
      );
    }

    // 論理削除
    const now = new Date().toISOString();
    const result = await db
      .update(todos)
      .set({
        deleted_at: now,
        updated_at: now,
      })
      .where(eq(todos.id, id))
      .returning();

    return c.json({
      success: true,
      message: "Todoを削除しました",
      data: {
        id: result[0].id,
        deleted_at: result[0].deleted_at,
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
