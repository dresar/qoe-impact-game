import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';

const app = express();
const PORT = process.env.PORT ? Number(process.env.PORT) : 5174;
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL is not set. Please set it in .env');
  process.exit(1);
}

const pool = new Pool({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });

app.use(cors());
app.use(express.json({ limit: '1mb' }));

async function initDb() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('CREATE EXTENSION IF NOT EXISTS pgcrypto');
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.game_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT NOT NULL,
        latency_level INTEGER NOT NULL,
        reaction_times JSONB DEFAULT '[]',
        avg_reaction_time NUMERIC,
        accuracy NUMERIC,
        score INTEGER NOT NULL DEFAULT 0,
        total_targets INTEGER NOT NULL DEFAULT 0,
        hits INTEGER NOT NULL DEFAULT 0,
        mos_score INTEGER,
        comment TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);
    await client.query('CREATE INDEX IF NOT EXISTS idx_game_sessions_created_at ON public.game_sessions(created_at DESC)');
    await client.query('COMMIT');
    console.log('Database initialized');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('DB init error:', e);
    throw e;
  } finally {
    client.release();
  }
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.get('/api/game_sessions', async (req, res) => {
  const onlyNotNull = (req.query.notNullMos ?? '1') === '1';
  const latency = req.query.latency ? Number(req.query.latency) : undefined;
  const params = [];
  let where = [];
  if (onlyNotNull) where.push('mos_score IS NOT NULL');
  if (typeof latency === 'number' && !isNaN(latency)) {
    params.push(latency);
    where.push(`latency_level = $${params.length}`);
  }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const sql = `SELECT id, user_id, latency_level, reaction_times, avg_reaction_time, accuracy, score, total_targets, hits, mos_score, comment, created_at
               FROM public.game_sessions ${whereSql}
               ORDER BY created_at DESC`;
  try {
    const { rows } = await pool.query(sql, params);
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

app.post('/api/game_sessions', async (req, res) => {
  const p = req.body ?? {};
  const required = ['user_id', 'latency_level', 'score', 'total_targets', 'hits'];
  for (const k of required) {
    if (p[k] === undefined || p[k] === null) {
      return res.status(400).json({ error: `Missing field: ${k}` });
    }
  }
  const sql = `
    INSERT INTO public.game_sessions
      (user_id, latency_level, reaction_times, avg_reaction_time, accuracy, score, total_targets, hits, mos_score, comment)
    VALUES
      ($1, $2, $3::jsonb, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *
  `;
  const params = [
    p.user_id,
    p.latency_level,
    JSON.stringify(p.reaction_times ?? []),
    p.avg_reaction_time ?? null,
    p.accuracy ?? null,
    p.score,
    p.total_targets,
    p.hits,
    p.mos_score ?? null,
    p.comment ?? null,
  ];
  try {
    const { rows } = await pool.query(sql, params);
    res.status(201).json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to save session' });
  }
});

initDb()
  .then(() => {
    app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
  })
  .catch((e) => {
    console.error('Initialization failed', e);
    process.exit(1);
  });

