-- Guarda en qué mundo se hizo cada puntuación (ranking por mundo).
-- Aplicar con: npx wrangler d1 execute clevergy-game-db --remote --file=migrations/0002_add_world.sql
ALTER TABLE leaderboard ADD COLUMN world INTEGER DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_world_score ON leaderboard(world, score DESC);
