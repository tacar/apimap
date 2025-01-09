# APIサーバーセットアップガイド

## 1. 初期セットアップ

### 依存関係のインストール

```bash
npm install
```

### 環境変数の設定

1. テンプレートファイルをコピー

```bash
cp templates/.dev.vars.example .dev.vars
cp templates/.env.example .env
```

2. 環境変数ファイルを編集

- `.dev.vars`: 開発環境用
- `.env`: 本番環境用

### Cloudflare環境変数の設定

```bash
wrangler secret put FIREBASE_PROJECT_ID
wrangler secret put FIREBASE_CLIENT_EMAIL
wrangler secret put FIREBASE_PRIVATE_KEY
wrangler secret put FIREBASE_API_KEY
wrangler secret put ALLOWED_ORIGINS
```

## 2. 開発手順

### ローカル開発サーバーの起動

```bash
npm run dev
```

利用可能なエンドポイント:

- API: http://localhost:8010
- Swagger UI: http://localhost:8010/ui
- OpenAPI仕様書: http://localhost:8010/doc

### OpenAPI仕様書の生成

```bash
npm run gen
```

- `openapi.yaml`がプロジェクトルートに生成されます

## 3. デプロイ手順

### 本番環境へのデプロイ

```bash
npm run deploy
```

デプロイ後の確認:

- API: https://apiwalk.tacarz.workers.dev
- Swagger UI: https://apiwalk.tacarz.workers.dev/ui
- OpenAPI仕様書: https://apiwalk.tacarz.workers.dev/doc

## 4. トラブルシューティング

### Wranglerのキャッシュクリア

```bash
rm -rf .wrangler
```

### 環境変数の再設定

```bash
wrangler secret put [KEY]
```

## 5. 環境変数リファレンス

### 開発環境 (.dev.vars)

```plaintext
# Firebase設定
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email@example.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key Here\n-----END PRIVATE KEY-----"
FIREBASE_API_KEY=your_api_key

# D1データベース設定
DATABASE_URL=file:./local.db
DATABASE_AUTH_TOKEN=your_auth_token

# CORS設定
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com

# 環境設定
NODE_ENV=development
```

### 本番環境 (.env)

```plaintext
# Firebase設定
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email@example.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour Private Key Here\n-----END PRIVATE KEY-----"

# CORS設定
ALLOWED_ORIGINS=https://yourdomain.com

# 環境設定
NODE_ENV=production
```

## 6. 注意事項

- 実際の環境変数ファイル（`.env`, `.dev.vars`）は決してGitにコミットしないでください
- 機密情報は必ず環境変数として設定してください
- 本番環境の環境変数は慎重に管理してください

## 7. GitHub Actions

- `main`ブランチへのプッシュ時に自動でOpenAPI仕様書が更新されます
- 更新対象: `src/openapi/**`配下のファイル
