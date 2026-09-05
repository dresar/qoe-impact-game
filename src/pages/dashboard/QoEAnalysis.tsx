import { useEffect, useState } from 'react';
import { fetchGameSessions } from '@/api/client';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell, Legend,
} from 'recharts';
import { LATENCY_OPTIONS } from '@/types/game';

const LATENCY_COLORS: Record<number, string> = {
  20: '#22c55e', 50: '#84cc16', 100: '#eab308', 150: '#f97316', 200: '#ef4444',
};

interface Row {
  latency_level: number;
  mos_score: number;
  avg_reaction_time: number;
  accuracy: number;
}

const QoEAnalysis = () => {
  const [data, setData] = useState<Row[]>([]);

  useEffect(() => {
    (async () => {
      const rows = await fetchGameSessions({ notNullMos: true });
      setData(
        rows.map((r) => ({
          latency_level: r.latency_level,
          mos_score: Number(r.mos_score ?? 0),
          avg_reaction_time: Number(r.avg_reaction_time ?? 0),
          accuracy: Number(r.accuracy ?? 0),
        }))
      );
    })();
  }, []);

  const avgByLatency = LATENCY_OPTIONS.map((lat) => {
    const items = data.filter((d) => d.latency_level === lat);
    return {
      latency: `${lat}ms`,
      avgMOS: items.length ? +(items.reduce((s, d) => s + d.mos_score, 0) / items.length).toFixed(2) : 0,
      avgRT: items.length ? +(items.reduce((s, d) => s + (d.avg_reaction_time || 0), 0) / items.length).toFixed(0) : 0,
      avgAcc: items.length ? +(items.reduce((s, d) => s + (d.accuracy || 0), 0) / items.length).toFixed(1) : 0,
      count: items.length,
    };
  });

  // MOS distribution
  const mosDistribution = [1, 2, 3, 4, 5].map((mos) => ({
    mos: `MOS ${mos}`,
    count: data.filter((d) => d.mos_score === mos).length,
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Analisis QoE</h2>

      {/* Insight */}
      {data.length > 0 && (
        <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 space-y-2">
          <h3 className="font-semibold text-primary text-sm">💡 Insight</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            {avgByLatency[0].count > 0 && avgByLatency[4].count > 0 && (
              <li>• MOS pada latency 20ms ({avgByLatency[0].avgMOS}) vs 200ms ({avgByLatency[4].avgMOS}) — 
                penurunan {(avgByLatency[0].avgMOS - avgByLatency[4].avgMOS).toFixed(2)} poin</li>
            )}
            <li>• Total {data.length} sesi data terkumpul</li>
            <li>• Distribusi MOS menunjukkan tren penurunan QoE seiring peningkatan latency</li>
          </ul>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Scatter plot: Latency vs MOS */}
        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="font-semibold text-foreground mb-4">Scatter: Latency vs MOS</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="latency_level" name="Latency" unit="ms" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis dataKey="mos_score" name="MOS" domain={[0, 5]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip />
              <Scatter name="Sessions" data={data} fill="hsl(var(--primary))" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Bar chart: Avg MOS per latency */}
        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="font-semibold text-foreground mb-4">Average MOS per Latency</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={avgByLatency}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="latency" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis domain={[0, 5]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip />
              <Bar dataKey="avgMOS" name="Avg MOS" radius={[6, 6, 0, 0]}>
                {avgByLatency.map((_, i) => <Cell key={i} fill={LATENCY_COLORS[LATENCY_OPTIONS[i]]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* MOS Distribution */}
        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="font-semibold text-foreground mb-4">Distribusi MOS</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mosDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="mos" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip />
              <Bar dataKey="count" name="Jumlah" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Accuracy vs Latency */}
        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="font-semibold text-foreground mb-4">Average Accuracy per Latency</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={avgByLatency}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="latency" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip />
              <Bar dataKey="avgAcc" name="Avg Accuracy (%)" radius={[6, 6, 0, 0]}>
                {avgByLatency.map((_, i) => <Cell key={i} fill={LATENCY_COLORS[LATENCY_OPTIONS[i]]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default QoEAnalysis;
