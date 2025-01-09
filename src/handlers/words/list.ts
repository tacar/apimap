import { Context } from "hono";
import { Bindings, Variables } from "../../types";
import { drizzle } from "drizzle-orm/d1";
import { words } from "../../schema";
import { eq, isNull } from "drizzle-orm";

export const listWordsHandler = async (
  c: Context<{ Bindings: Bindings; Variables: Variables }>
) => {
  try {
    const db = drizzle(c.env.DB);

    // デバッグ用にクエリを出力
    console.log("Fetching words...");

    const result = await db
      .select()
      .from(words)
      .where(isNull(words.deleted_at));

    // デバッグ用に結果を出力
    console.log("Query result:", result);

    return c.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error in listWordsHandler:", error);
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
