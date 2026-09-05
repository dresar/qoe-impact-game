export interface GameSession {
  id?: string;
  user_id: string;
  latency_level: number;
  reaction_times: number[];
  avg_reaction_time: number | null;
  accuracy: number | null;
  score: number;
  total_targets: number;
  hits: number;
  headshots: number;
  bodyshots: number;
  misses: number;
  mos_score: number | null;
  comment: string | null;
  created_at?: string;
}

export interface GameState {
  phase: 'menu' | 'countdown' | 'playing' | 'qoe' | 'done';
  latency: number;
  score: number;
  hits: number;
  headshots: number;
  bodyshots: number;
  misses: number;
  totalShots: number;
  reactionTimes: number[];
  userId: string;
}

export const LATENCY_OPTIONS = [20, 50, 100, 150, 200] as const;
export const MOS_LABELS: Record<number, string> = {
  1: 'Sangat Buruk',
  2: 'Buruk',
  3: 'Cukup',
  4: 'Baik',
  5: 'Sangat Baik',
};
