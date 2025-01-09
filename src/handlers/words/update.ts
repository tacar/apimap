import { Context } from "hono";
import { Bindings, Variables } from "../../types";
import { drizzle } from "drizzle-orm/d1";
import { words } from "../../schema";
import { and, eq } from "drizzle-orm";

export const updateWordHandler = async (
  c: Context<{ Bindings: Bindings; Variables: Variables }>
) => {
  try {
    const id = parseInt(c.req.param("id"));
    const { word, reading, meaning, example, category } = await c.req.json<{
      word?: string;
      reading?: string;
      meaning?: string;
      example?: string;
      category?: string;
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
    const result = await db
      .update(words)
      .set({
        word,
        reading,
        meaning,
        example,
        category,
        updated_at: new Date().toISOString(),
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
      data: result[0],
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
