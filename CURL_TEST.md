# API テスト用 cURLコマンド集

## 1. ユーザー関連 API

### ユーザー登録

```bash
curl -X POST "http://localhost:8010/api/users/add" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### ユーザー検索（メールアドレス存在確認）

```bash
curl -X POST "http://localhost:8010/api/users/search" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

### ログイン

```bash
curl -X POST "http://localhost:8010/api/users/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### ユーザー一覧取得（要認証）

```bash
curl -X GET "http://localhost:8010/api/users/list" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 最終ログイン時間更新（要認証）

```bash
curl -X PUT "http://localhost:8010/api/users/lastlogin" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

### ユーザー削除（要認証）

```bash
curl -X DELETE "http://localhost:8010/api/users/test@example.com" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 2. Todo関連 API

### Todo一覧取得（要認証）

```bash
curl -X GET "http://localhost:8010/api/todos" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Todo作成（要認証）

```bash
curl -X POST "http://localhost:8010/api/todos" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "テストTodo",
    "description": "これはテスト用のTodoです",
    "due_date": "2024-03-31T23:59:59Z",
    "priority": 1
  }'
```

### Todo取得（要認証）

```bash
curl -X GET "http://localhost:8010/api/todos/1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Todo更新（要認証）

```bash
curl -X PUT "http://localhost:8010/api/todos/1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "更新されたTodo",
    "description": "これは更新後のTodoです",
    "is_completed": 1,
    "due_date": "2024-04-01T23:59:59Z",
    "priority": 2
  }'
```

### Todo削除（要認証）

```bash
curl -X DELETE "http://localhost:8010/api/todos/1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 3. 画像関連 API

### 画像アップロード（要認証）

```bash
curl -X POST "http://localhost:8010/api/images/upload" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/image.jpg"
```

### 画像取得（要認証）

```bash
curl -X GET "http://localhost:8010/api/images/1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  --output downloaded.jpg
```

## 注意事項

1. `YOUR_JWT_TOKEN`は、ログインAPI呼び出し後に返される実際のJWTトークンに置き換えてください
2. ローカル開発環境のポート番号が異なる場合は、URLを適宜変更してください
3. 本番環境でテストする場合は、`localhost:8010`を`apiwalk.tacarz.workers.dev`に変更してください

## レスポンス確認用オプション

詳細なレスポンス情報を表示するには、以下のオプションを追加してください：

```bash
-v # 詳細な情報を表示
-i # レスポンスヘッダーを表示
```

例：

```bash
curl -v -X POST "http://localhost:8010/api/users/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```
