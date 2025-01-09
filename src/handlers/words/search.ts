import { Context } from "hono";
import { Bindings, Variables } from "../../types";
import { drizzle } from "drizzle-orm/d1";
import { words } from "../../schema";
import { and, eq, isNull } from "drizzle-orm";

export const searchWordHandler = async (
  c: Context<{ Bindings: Bindings; Variables: Variables }>
) => {
  try {
    const { word } = await c.req.json<{ word: string }>();

    if (!word) {
      return c.json(
        {
          success: false,
          message: "単語は必須です",
        },
        422
      );
    }

    const db = drizzle(c.env.DB);

    // デバッグ用にクエリを出力
    console.log("Searching for word:", word);

    const result = await db
      .select()
      .from(words)
      .where(and(eq(words.word, word), isNull(words.deleted_at))); // eq を isNull に変更

    // デバッグ用に結果を出力
    console.log("Search result:", result);

    return c.json({
      success: true,
      exists: result.length > 0,
      data: result.length > 0 ? result[0] : null,
      debug: { word, resultCount: result.length }, // デバッグ情報を追加
    });
  } catch (error) {
    console.error("Error in searchWordHandler:", error);
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
