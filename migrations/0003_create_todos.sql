CREATE TABLE todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  is_completed INTEGER DEFAULT 0,
  due_date TEXT,
  priority INTEGER,
  deleted_at TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_todos_user_id ON todos(user_id);