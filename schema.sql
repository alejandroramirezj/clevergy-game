CREATE TABLE IF NOT EXISTS leaderboard (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  score INTEGER NOT NULL,
  character TEXT NOT NULL,
  char_name TEXT,
  time_seconds REAL NOT NULL,
  rank TEXT,
  deaths INTEGER DEFAULT 0,
  world INTEGER DEFAULT 0,
  user_id TEXT,
  stats TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_score ON leaderboard(score DESC);
CREATE INDEX IF NOT EXISTS idx_world_score ON leaderboard(world, score DESC);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  nick TEXT,
  picture TEXT,
  character TEXT,
  progress TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_lb_user ON leaderboard(user_id);
