-- Detalle de cada récord (monedas, disquetes, oleada, KOs, posición…) en JSON.
-- Aplicar con: npx wrangler d1 execute clevergy-game-db --remote --file=migrations/0004_stats.sql
ALTER TABLE leaderboard ADD COLUMN stats TEXT;
