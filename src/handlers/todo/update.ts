import { Context } from "hono";
import { Bindings, Variables } from "../../types";
import { drizzle } from "drizzle-orm/d1";
import { todos } from "../../schema";
import { and, eq } from "drizzle-orm";

export const updateTodoHandler = async (
  c: Context<{ Bindings: Bindings; Variables: Variables }>
) => {
  try {
    const user = c.get("user");
    const id = parseInt(c.req.param("id"));
    const { title, description, is_completed, due_date, priority } =
      await c.req.json<{
        title?: string;
        description?: string;
        is_completed?: number;
        due_date?: string;
        priority?: number;
      }>();

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

    // 更新
    const result = await db
      .update(todos)
      .set({
        title: title || existingTodo[0].title,
        description: description ?? existingTodo[0].description,
        is_completed: is_completed ?? existingTodo[0].is_completed,
        due_date: due_date ?? existingTodo[0].due_date,
        priority: priority ?? existingTodo[0].priority,
        updated_at: new Date().toISOString(),
      })
      .where(eq(todos.id, id))
      .returning();

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
