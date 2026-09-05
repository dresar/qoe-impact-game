export type GameSession = {
  id?: string;
  user_id: string;
  latency_level: number;
  reaction_times?: number[];
  avg_reaction_time?: number | null;
  accuracy?: number | null;
  score: number;
  total_targets: number;
  hits: number;
  mos_score?: number | null;
  comment?: string | null;
  created_at?: string;
};

const API_BASE = import.meta.env.VITE_API_BASE || '';

function buildUrl(path: string, params?: Record<string, string | number | undefined>) {
  const base = API_BASE.endsWith('/') ? API_BASE.slice(0, -1) : API_BASE;
  const url = new URL(path, base || window.location.origin);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined) url.searchParams.set(k, String(v));
    });
  }
  return url.toString();
}

export async function fetchGameSessions(opts?: { latency?: number; notNullMos?: boolean }) {
  const url = buildUrl('/api/game_sessions', {
    latency: opts?.latency,
    notNullMos: opts?.notNullMos === false ? '0' : '1',
  });
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch game sessions');
  return (await res.json()) as GameSession[];
}

export async function createGameSession(payload: GameSession) {
  const url = buildUrl('/api/game_sessions');
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to create session');
  }
  return (await res.json()) as GameSession;
}

