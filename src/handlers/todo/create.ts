import { Context } from "hono";
import { Bindings, Variables } from "../../types";
import { drizzle } from "drizzle-orm/d1";
import { todos } from "../../schema";

export const createTodoHandler = async (
  c: Context<{ Bindings: Bindings; Variables: Variables }>
) => {
  try {
    const user = c.get("user");
    const { title, description, due_date, priority } = await c.req.json<{
      title: string;
      description?: string;
      due_date?: string;
      priority?: number;
    }>();

    // バリデーション
    if (!title) {
      return c.json(
        {
          success: false,
          message: "タイトルは必須です",
        },
        422
      );
    }

    const db = drizzle(c.env.DB);
    const result = await db
      .insert(todos)
      .values({
        user_id: user.uid,
        title,
        description,
        due_date,
        priority,
        created_at: new Date().toISOString(),
      })
      .returning();

    return c.json(
      {
        success: true,
        data: result[0],
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
