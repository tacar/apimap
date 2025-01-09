import { Context } from "hono";
import { Bindings, Variables } from "../../types";
import { drizzle } from "drizzle-orm/d1";
import { images } from "../../schema";

export const uploadImageHandler = async (
  c: Context<{ Bindings: Bindings; Variables: Variables }>
) => {
  try {
    const userId = c.get("userId");
    const formData = await c.req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return c.json({ success: false, message: "ファイルが必要です" }, 400);
    }

    // ファイル名とパスの生成
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const filePath = `images/${userId}/${fileName}`;

    // R2にアップロード
    await c.env.R2.put(filePath, file.stream(), {
      httpMetadata: {
        contentType: file.type,
      },
    });

    // DBに記録
    const db = drizzle(c.env.DB);
    const result = await db
      .insert(images)
      .values({
        user_id: userId,
        file_name: fileName,
        file_path: filePath,
        mime_type: file.type,
        size: file.size,
      })
      .returning();

    return c.json({
      success: true,
      data: result[0],
    });
  } catch (error) {
    console.error("Error:", error);
    return c.json({ success: false, message: "Internal server error" }, 500);
  }
};
