-- Cuentas de Google: perfil, personaje elegido y progreso guardado.
-- Aplicar con: npx wrangler d1 execute clevergy-game-db --remote --file=migrations/0003_users.sql
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,          -- "sub" de Google
  email TEXT NOT NULL,
  name TEXT,
  nick TEXT,                    -- nombre que sale en el ranking
  picture TEXT,
  character TEXT,               -- el personaje que es "suyo"
  progress TEXT,                -- JSON { completed, highScores, ranks }
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_login DATETIME DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE leaderboard ADD COLUMN user_id TEXT;
CREATE INDEX IF NOT EXISTS idx_lb_user ON leaderboard(user_id);
