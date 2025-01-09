import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { swaggerUI } from "@hono/swagger-ui";
import { Bindings, Variables } from "./types";

// ルートのインポート
import userRoutes from "./routes/user";
import todoRoutes from "./routes/todo";
import imagesRoutes from "./routes/images";
import deepseekRoutes from "./routes/deepseek";
import wordsRoutes from "./routes/words";

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// ミドルウェアの設定
app.use(
  "*",
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:8080",
      "https://yourdomain.com",
      "https://oboete.pages.dev",
    ],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);

app.use("*", logger());
app.use("*", prettyJSON());

// Swagger UIのセットアップ
app.get("/ui", swaggerUI({ url: "/doc" }));

// APIルートのマウント
app.route("/api/users", userRoutes);
app.route("/api/todos", todoRoutes);
app.route("/api/images", imagesRoutes);
app.route("/api/deepseek", deepseekRoutes);
app.route("/api/words", wordsRoutes);

// ヘルスチェック
app.get("/health", (c) => c.json({ status: "ok" }));

export default app;
