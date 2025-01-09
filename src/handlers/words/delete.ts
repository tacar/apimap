import { Context } from "hono";
import { Bindings, Variables } from "../../types";
import { drizzle } from "drizzle-orm/d1";
import { words } from "../../schema";
import { and, eq } from "drizzle-orm";

export const deleteWordHandler = async (
  c: Context<{ Bindings: Bindings; Variables: Variables }>
) => {
  try {
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
    const now = new Date().toISOString();
    const result = await db
      .update(words)
      .set({
        deleted_at: now,
        updated_at: now,
      })
      .where(and(eq(words.id, id), eq(words.deleted_at, null)))
      .returning();

    if (result.length === 0) {
      return c.json(
        {
          success: false,
          message: "単語が見つかりません",
        },
        404
      );
    }

    return c.json({
      success: true,
      message: "単語を削除しました",
      data: {
        id: result[0].id,
        deleted_at: result[0].deleted_at,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return c.json(
      {
        success: false,
        message: "Internal server error",
      },
      500
    );
  }
};
