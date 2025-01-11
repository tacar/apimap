-- 既存のテーブルを削除
DROP TABLE IF EXISTS users;

-- 新しいテーブルを作成
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  firebase_uid TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  is_admin INTEGER DEFAULT 0,
  avatar INTEGER DEFAULT NULL,
  gid TEXT DEFAULT NULL,
  email_verified_at DATETIME DEFAULT NULL,
  remember_token TEXT DEFAULT NULL,
  token TEXT DEFAULT NULL,
  nickname TEXT DEFAULT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL
);

-- インデックスを作成
CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX idx_users_email ON users(email);

-- 管理者ユーザーを作成（必要な場合）
-- INSERT INTO users (
--   firebase_uid,
--   name,
--   email,
--   password,
--   is_admin,
--   created_at,
--   updated_at
-- ) VALUES (
--   'admin_firebase_uid',
--   'Admin User',
--   'admin@example.com',
--   'hashed_password',
--   1,
--   datetime('now'),
--   datetime('now')
-- );
