import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import LatencySelector from '@/components/LatencySelector';
import PhaserGame from '@/components/PhaserGame';
import QoEForm from '@/components/QoEForm';
import { createGameSession } from '@/api/client';
import { generateUserId } from '@/lib/gameUtils';
import { ArrowLeft, Play, Crosshair } from 'lucide-react';
import { toast } from 'sonner';
import type { GameState } from '@/types/game';

const GamePage = () => {
  const navigate = useNavigate();
  const [state, setState] = useState<GameState>({
    phase: 'menu',
    latency: 0,
    score: 0,
    hits: 0,
    headshots: 0,
    bodyshots: 0,
    misses: 0,
    totalShots: 0,
    reactionTimes: [],
    userId: generateUserId(),
  });

  const [selectedLatency, setSelectedLatency] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(3);

  // Countdown logic
  useEffect(() => {
    if (state.phase !== 'countdown') return;
    if (countdown <= 0) {
      setState((s) => ({ ...s, phase: 'playing' }));
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [state.phase, countdown]);

  const startGame = () => {
    if (!selectedLatency) return;
    setCountdown(3);
    setState((s) => ({ ...s, phase: 'countdown', latency: selectedLatency }));
  };

  const handleGameEnd = (results: {
    hits: number;
    total: number;
    reactionTimes: number[];
    score: number;
    headshots: number;
    bodyshots: number;
    misses: number;
  }) => {
    setState((s) => ({
      ...s,
      phase: 'qoe',
      hits: results.hits,
      totalShots: results.total,
      headshots: results.headshots,
      bodyshots: results.bodyshots,
      misses: results.misses,
      reactionTimes: results.reactionTimes,
      score: results.score,
    }));
  };

  const handleQoESubmit = async (mos: number, comment: string) => {
    const avgRT = state.reactionTimes.length > 0
      ? state.reactionTimes.reduce((a, b) => a + b, 0) / state.reactionTimes.length
      : 0;
    const accuracy = state.totalShots > 0 ? (state.hits / state.totalShots) * 100 : 0;

    try {
      await createGameSession({
        user_id: state.userId,
        latency_level: state.latency,
        reaction_times: state.reactionTimes,
        avg_reaction_time: avgRT,
        accuracy,
        score: state.score,
        total_targets: state.totalShots,
        hits: state.hits,
        mos_score: mos,
        comment: comment || null,
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      toast.error('Gagal menyimpan data: ' + msg);
      return;
    }

    toast.success('Data berhasil disimpan!');
    setState((s) => ({ ...s, phase: 'done' }));
  };

  const avgReactionTime = state.reactionTimes.length > 0
    ? state.reactionTimes.reduce((a, b) => a + b, 0) / state.reactionTimes.length
    : 0;
  const accuracy = state.totalShots > 0 ? (state.hits / state.totalShots) * 100 : 0;

  return (
    <div className="min-h-screen bg-game-bg">
      <header className="border-b border-border bg-game-surface">
        <div className="container mx-auto px-4 py-3 flex items-center gap-4">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Kembali
          </Button>
          <div className="flex items-center gap-2">
            <Crosshair className="w-5 h-5 text-primary" />
            <h1 className="font-semibold text-primary-foreground">FPS Latency Simulator</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {state.phase === 'menu' && (
          <div className="max-w-md mx-auto space-y-6">
            <div className="text-center space-y-2">
              <Crosshair className="w-12 h-12 text-primary mx-auto" />
              <h2 className="text-2xl font-bold text-primary-foreground">Pengaturan Misi</h2>
              <p className="text-muted-foreground">Pilih level latency untuk simulasi</p>
            </div>
            <LatencySelector selected={selectedLatency} onSelect={setSelectedLatency} />
            {selectedLatency && (
              <div className="bg-game-surface rounded-xl border border-border p-4 text-sm text-muted-foreground space-y-2">
                <p>⏱️ Delay <strong className="text-primary">{selectedLatency}ms</strong> akan diterapkan pada setiap tembakan.</p>
                <p>🎯 Tembak musuh yang muncul selama <strong className="text-primary">60 detik</strong>.</p>
                <p>💀 Headshot: <strong className="text-destructive">+10</strong> | Body: <strong className="text-primary">+5</strong></p>
              </div>
            )}
            <Button className="w-full" size="lg" disabled={!selectedLatency} onClick={startGame}>
              <Play className="w-5 h-5 mr-2" /> Mulai Misi
            </Button>
          </div>
        )}

        {state.phase === 'countdown' && (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <div className="text-8xl font-bold text-primary animate-pulse">{countdown || 'GO!'}</div>
            <p className="text-muted-foreground">Bersiap-siap...</p>
          </div>
        )}

        {state.phase === 'playing' && (
          <div className="space-y-3 text-center">
            <PhaserGame latency={state.latency} onGameEnd={handleGameEnd} />
            <p className="text-xs text-muted-foreground">Klik target musuh secepat mungkin. Headshot = +10, Body = +5</p>
          </div>
        )}

        {state.phase === 'qoe' && (
          <QoEForm
            onSubmit={handleQoESubmit}
            score={state.score}
            hits={state.hits}
            total={state.totalShots}
            avgReactionTime={avgReactionTime}
            accuracy={accuracy}
            latency={state.latency}
            headshots={state.headshots}
            bodyshots={state.bodyshots}
            misses={state.misses}
          />
        )}

        {state.phase === 'done' && (
          <div className="max-w-md mx-auto text-center space-y-6">
            <div className="text-6xl">🎯</div>
            <h2 className="text-2xl font-bold text-primary-foreground">Misi Selesai!</h2>
            <p className="text-muted-foreground">
              Data Anda telah disimpan dan akan digunakan untuk analisis penelitian QoE.
            </p>
            <div className="flex flex-col gap-3">
              <Button onClick={() => {
                setState({
                  phase: 'menu', latency: 0, score: 0, hits: 0, headshots: 0,
                  bodyshots: 0, misses: 0, totalShots: 0, reactionTimes: [], userId: generateUserId(),
                });
                setSelectedLatency(null);
              }}>
                Main Lagi
              </Button>
              <Button variant="outline" onClick={() => navigate('/dashboard')}>
                Lihat Dashboard
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default GamePage;
