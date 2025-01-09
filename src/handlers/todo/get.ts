import { Context } from "hono";
import { Bindings, Variables } from "../../types";
import { drizzle } from "drizzle-orm/d1";
import { todos } from "../../schema";
import { and, eq } from "drizzle-orm";

export const getTodoHandler = async (
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
    const result = await db
      .select()
      .from(todos)
      .where(
        and(
          eq(todos.id, id),
          eq(todos.user_id, user.uid),
          eq(todos.deleted_at, null)
        )
      );

    if (result.length === 0) {
      return c.json(
        {
          success: false,
          message: "Todoが見つかりません",
        },
        404
      );
    }

    return c.json({
      success: true,
      data: result[0],
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
