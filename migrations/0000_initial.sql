DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  firebase_uid TEXT UNIQUE,
  is_admin INTEGER DEFAULT 0,
  avater INTEGER DEFAULT NULL,
  gid TEXT DEFAULT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  email_verified_at DATETIME DEFAULT NULL,
  password TEXT DEFAULT NULL,
  remember_token TEXT DEFAULT NULL,
  avatar TEXT DEFAULT NULL,
  token TEXT DEFAULT NULL,
  nickname INTEGER DEFAULT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT NULL,
  last_login_at DATETIME DEFAULT NULL
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);

CREATE TABLE IF NOT EXISTS todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  is_completed INTEGER DEFAULT 0,
  due_date TEXT,
  priority INTEGER,
  deleted_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  deleted_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);