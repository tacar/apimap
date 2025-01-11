import { Hono } from "hono";

const router = new Hono();

// すべてのルートを表示
router.get("/routes", (c) => {
  return c.json([
    // ユーザー関連
    "POST /api/users/add",
    "POST /api/users/login",
    "POST /api/users/gmail-login",
    "GET /api/users/list",
    "POST /api/users/search",
    "PUT /api/users/lastlogin",

    // UI関連
    "GET /api/ui/dashboard",
    "GET /api/ui/profile",
    "GET /api/ui/settings",

    // API関連
    "POST /api/analyze",
    "POST /api/chat",
    "POST /api/ai",

    // Deepseek関連
    "POST /api/deepseek/analyze",
    "GET /api/deepseek/status",

    // Words関連
    "GET /api/words",
    "POST /api/words/add",
    "PUT /api/words/:id",
    "DELETE /api/words/:id",

    // Images関連
    "GET /api/images",
    "POST /api/images/upload",

    // Todo関連
    "GET /api/todos",
    "POST /api/todos/add",
    "PUT /api/todos/:id",
    "DELETE /api/todos/:id",

    // システム関連
    "GET /health",
    "GET /doc",
    "GET /doc/routes",
  ]);
});

// APIドキュメントのルート
router.get("/", (c) => {
  return c.json({
    message: "API Documentation",
    version: "1.0.0",
    endpoints: {
      // ユーザー関連
      users: {
        add: "POST /api/users/add - ユーザー登録",
        login: "POST /api/users/login - ログイン",
        "gmail-login":
          "POST /api/users/gmail-login - Gmailアカウントでログイン",
        list: "GET /api/users/list - ユーザー一覧",
        search: "POST /api/users/search - ユーザー検索",
        lastlogin: "PUT /api/users/lastlogin - 最終ログイン更新",
      },
      // UI関連
      ui: {
        dashboard: "GET /api/ui/dashboard - ダッシュボード",
        profile: "GET /api/ui/profile - プロフィール",
        settings: "GET /api/ui/settings - 設定",
      },
      // API関連
      api: {
        analyze: "POST /api/analyze - テキスト分析",
        chat: "POST /api/chat - チャット",
        ai: "POST /api/ai - AI処理",
      },
      // Deepseek関連
      deepseek: {
        analyze: "POST /api/deepseek/analyze - テキスト分析",
        status: "GET /api/deepseek/status - 分析状態確認",
      },
      // Words関連
      words: {
        list: "GET /api/words - 単語一覧",
        add: "POST /api/words/add - 単語追加",
        update: "PUT /api/words/:id - 単語更新",
        delete: "DELETE /api/words/:id - 単語削除",
      },
      // Images関連
      images: {
        list: "GET /api/images - 画像一覧",
        upload: "POST /api/images/upload - 画像アップロード",
      },
      // Todo関連
      todos: {
        list: "GET /api/todos - Todo一覧",
        add: "POST /api/todos/add - Todo追加",
        update: "PUT /api/todos/:id - Todo更新",
        delete: "DELETE /api/todos/:id - Todo削除",
      },
      // システム関連
      system: {
        health: "GET /health - ヘルスチェック",
        docs: "GET /doc - APIドキュメント",
      },
    },
  });
});

export default router;
