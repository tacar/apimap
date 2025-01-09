import { Hono } from "hono";
import { Bindings, Variables } from "../types";
import { authMiddleware } from "../middleware/auth";
import { listWordsHandler } from "../handlers/words/list";
import { createWordHandler } from "../handlers/words/create";
import { getWordHandler } from "../handlers/words/get";
import { updateWordHandler } from "../handlers/words/update";
import { deleteWordHandler } from "../handlers/words/delete";
import { searchWordHandler } from "../handlers/words/search";

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// 単語の存在確認
app.post("/search", searchWordHandler);

// 単語一覧取得
app.get("/", listWordsHandler);

// 単語作成（要認証）
app.post("/", authMiddleware, createWordHandler);

// 単語取得
app.get("/:id", getWordHandler);

// 単語更新（要認証）
app.put("/:id", authMiddleware, updateWordHandler);

// 単語削除（要認証）
app.delete("/:id", authMiddleware, deleteWordHandler);

export default app;
