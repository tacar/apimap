import { Hono } from "hono";
import { Bindings } from "../types";
import OpenAI from "openai";

const app = new Hono<{ Bindings: Bindings }>();

// OpenAIクライアントの初期化
const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: "sk-7fae1e19c2304f14b7e67ccc7f63a22f",
});

// チャット完了エンドポイント
app.post("/v1/chat/completions", async (c) => {
  try {
    const body = await c.req.json();
    const completion = await openai.chat.completions.create({
      messages: body.messages || [
        { role: "system", content: "You are a helpful assistant." },
      ],
      model: "deepseek-chat",
      ...body,
    });

    return c.json(completion);
  } catch (error) {
    console.error("Deepseek API Error:", error);
    return c.json(
      {
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
});

export default app;
