DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `firebase_uid` TEXT UNIQUE,
  `is_admin` INTEGER NOT NULL DEFAULT 0,
  `avatar` INTEGER,
  `gid` TEXT,
  `name` TEXT NOT NULL,
  `email` TEXT NOT NULL UNIQUE,
  `email_verified_at` TEXT,
  `password` TEXT NOT NULL,
  `remember_token` TEXT,
  `token` TEXT,
  `nickname` TEXT,
  `created_at` TEXT,
  `updated_at` TEXT
);

-- インデックスの作成（必要に応じて）
CREATE INDEX idx_firebase_uid ON users(firebase_uid);
CREATE INDEX idx_email ON users(email);

-- サンプルデータの挿入
INSERT INTO `users` (firebase_uid, is_admin, avatar, gid, name, email, email_verified_at, password, remember_token, token, nickname, created_at, updated_at)
VALUES
  ('fuid1', 1, 1, 'gid1', 'Admin User', 'admin@example.com', '2024-09-28 10:00:00', 'hashed_password', NULL, NULL, 'AdminNick', '2024-09-28 10:00:00', '2024-09-28 10:00:00'),
  ('fuid2', 0, 2, 'gid2', 'John Doe', 'john@example.com', '2024-09-28 10:01:00', 'hashed_password', NULL, NULL, 'JohnD', '2024-09-28 10:01:00', '2024-09-28 10:01:00'),
  ('fuid3', 0, 3, 'gid3', 'Jane Smith', 'jane@example.com', '2024-09-28 10:02:00', 'hashed_password', NULL, NULL, 'JaneS', '2024-09-28 10:02:00', '2024-09-28 10:02:00'),
  ('fuid4', 0, 4, 'gid4', 'Alice Johnson', 'alice@example.com', '2024-09-28 10:03:00', 'hashed_password', NULL, NULL, 'AliceJ', '2024-09-28 10:03:00', '2024-09-28 10:03:00'),
  ('fuid5', 0, 5, 'gid5', 'Bob Williams', 'bob@example.com', '2024-09-28 10:04:00', 'hashed_password', NULL, NULL, 'BobW', '2024-09-28 10:04:00', '2024-09-28 10:04:00'),
  ('fuid6', 0, 6, 'gid6', 'Carol Brown', 'carol@example.com', '2024-09-28 10:05:00', 'hashed_password', NULL, NULL, 'CarolB', '2024-09-28 10:05:00', '2024-09-28 10:05:00'),
  ('fuid7', 0, 7, 'gid7', 'David Lee', 'david@example.com', '2024-09-28 10:06:00', 'hashed_password', NULL, NULL, 'DavidL', '2024-09-28 10:06:00', '2024-09-28 10:06:00'),
  ('fuid8', 0, 8, 'gid8', 'Eva Garcia', 'eva@example.com', '2024-09-28 10:07:00', 'hashed_password', NULL, NULL, 'EvaG', '2024-09-28 10:07:00', '2024-09-28 10:07:00'),
  ('fuid9', 0, 9, 'gid9', 'Frank Miller', 'frank@example.com', '2024-09-28 10:08:00', 'hashed_password', NULL, NULL, 'FrankM', '2024-09-28 10:08:00', '2024-09-28 10:08:00'),
  ('fuid10', 0, 10, 'gid10', 'Grace Wilson', 'grace@example.com', '2024-09-28 10:09:00', 'hashed_password', NULL, NULL, 'GraceW', '2024-09-28 10:09:00', '2024-09-28 10:09:00');
