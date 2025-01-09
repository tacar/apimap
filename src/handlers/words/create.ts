import { Context } from "hono";
import { Bindings, Variables } from "../../types";
import { drizzle } from "drizzle-orm/d1";
import { words } from "../../schema";
import { and, eq, isNull } from "drizzle-orm";

export const createWordHandler = async (
  c: Context<{ Bindings: Bindings; Variables: Variables }>
) => {
  try {
    const { word, reading, meaning, example, category } = await c.req.json<{
      word: string;
      reading?: string;
      meaning: string;
      example?: string;
      category?: string;
    }>();

    // バリデーション
    if (!word || !meaning) {
      return c.json(
        {
          success: false,
          message: "単語と意味は必須です",
        },
        422
      );
    }

    const db = drizzle(c.env.DB);

    // 既存の単語をチェック
    const existing = await db
      .select()
      .from(words)
      .where(and(eq(words.word, word), isNull(words.deleted_at)));

    if (existing.length > 0) {
      return c.json(
        {
          success: false,
          message: "この単語は既に登録されています",
          data: existing[0],
        },
        409 // Conflict
      );
    }

    // 新規登録
    const result = await db
      .insert(words)
      .values({
        word,
        reading,
        meaning,
        example,
        category,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
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
    console.error("Error in createWordHandler:", error);
    return c.json(
      {
        success: false,
        message: "Internal server error",
        debug: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
};
