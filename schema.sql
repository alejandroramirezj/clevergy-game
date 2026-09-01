CREATE TABLE IF NOT EXISTS leaderboard (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  score INTEGER NOT NULL,
  character TEXT NOT NULL,
  char_name TEXT,
  time_seconds REAL NOT NULL,
  rank TEXT,
  deaths INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_score ON leaderboard(score DESC);
