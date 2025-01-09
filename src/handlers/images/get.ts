import { Context } from "hono";
import { Bindings, Variables } from "../../types";
import { drizzle } from "drizzle-orm/d1";
import { images } from "../../schema";
import { eq } from "drizzle-orm";

export const getImageHandler = async (
  c: Context<{ Bindings: Bindings; Variables: Variables }>
) => {
  try {
    const imageId = parseInt(c.req.param("id"));
    const db = drizzle(c.env.DB);

    // DBから画像情報を取得
    const imageData = await db
      .select()
      .from(images)
      .where(eq(images.id, imageId))
      .limit(1);

    if (!imageData.length) {
      return c.json({ success: false, message: "画像が見つかりません" }, 404);
    }

    // R2から画像を取得
    const image = await c.env.R2.get(imageData[0].file_path);
    if (!image) {
      return c.json(
        { success: false, message: "画像ファイルが見つかりません" },
        404
      );
    }

    // レスポンスヘッダーの設定
    c.header("Content-Type", imageData[0].mime_type);
    c.header("Content-Length", imageData[0].size.toString());
    c.header("Cache-Control", "public, max-age=31536000");

    return c.body(image.body);
  } catch (error) {
    console.error("Error:", error);
    return c.json({ success: false, message: "Internal server error" }, 500);
  }
};
