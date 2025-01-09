CREATE TABLE words (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  word TEXT NOT NULL,              -- 単語
  reading TEXT,                    -- 読み方（かな）
  meaning TEXT NOT NULL,           -- 意味・説明
  example TEXT,                    -- 使用例
  category TEXT,                   -- カテゴリ（技術用語、一般用語など）
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  deleted_at TEXT
);

-- インデックスの作成
CREATE INDEX idx_words_word ON words(word);
CREATE INDEX idx_words_category ON words(category); 