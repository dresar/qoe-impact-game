import { useEffect, useState } from 'react';
import { fetchGameSessions } from '@/api/client';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LineChart, Line,
} from 'recharts';
import { LATENCY_OPTIONS } from '@/types/game';

const LATENCY_COLORS: Record<number, string> = {
  20: '#22c55e', 50: '#84cc16', 100: '#eab308', 150: '#f97316', 200: '#ef4444',
};

interface Row {
  latency_level: number;
  avg_reaction_time: number;
  accuracy: number;
  score: number;
  mos_score: number;
}

const LatencyStats = () => {
  const [data, setData] = useState<Row[]>([]);

  useEffect(() => {
    (async () => {
      const rows = await fetchGameSessions({ notNullMos: true });
      setData(
        rows.map((r) => ({
          latency_level: r.latency_level,
          avg_reaction_time: Number(r.avg_reaction_time ?? 0),
          accuracy: Number(r.accuracy ?? 0),
          score: Number(r.score ?? 0),
          mos_score: Number(r.mos_score ?? 0),
        }))
      );
    })();
  }, []);

  const statsByLatency = LATENCY_OPTIONS.map((lat) => {
    const items = data.filter((d) => d.latency_level === lat);
    const n = items.length;
    return {
      latency: `${lat}ms`,
      latencyNum: lat,
      count: n,
      avgRT: n ? +(items.reduce((s, d) => s + (d.avg_reaction_time || 0), 0) / n).toFixed(0) : 0,
      avgScore: n ? +(items.reduce((s, d) => s + d.score, 0) / n).toFixed(0) : 0,
      avgAcc: n ? +(items.reduce((s, d) => s + (d.accuracy || 0), 0) / n).toFixed(1) : 0,
      avgMOS: n ? +(items.reduce((s, d) => s + d.mos_score, 0) / n).toFixed(2) : 0,
    };
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Statistik Latency</h2>

      {/* Summary table */}
      <div className="bg-card rounded-xl border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left p-3 text-muted-foreground">Latency</th>
              <th className="text-center p-3 text-muted-foreground">Sesi</th>
              <th className="text-center p-3 text-muted-foreground">Avg RT</th>
              <th className="text-center p-3 text-muted-foreground">Avg Score</th>
              <th className="text-center p-3 text-muted-foreground">Avg Accuracy</th>
              <th className="text-center p-3 text-muted-foreground">Avg MOS</th>
            </tr>
          </thead>
          <tbody>
            {statsByLatency.map((s) => (
              <tr key={s.latency} className="border-b border-border">
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ backgroundColor: LATENCY_COLORS[s.latencyNum] + '20', color: LATENCY_COLORS[s.latencyNum] }}>
                    {s.latency}
                  </span>
                </td>
                <td className="p-3 text-center text-foreground">{s.count}</td>
                <td className="p-3 text-center text-foreground">{s.avgRT}ms</td>
                <td className="p-3 text-center text-foreground">{s.avgScore}</td>
                <td className="p-3 text-center text-foreground">{s.avgAcc}%</td>
                <td className="p-3 text-center font-bold text-foreground">{s.avgMOS}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* RT per latency */}
        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="font-semibold text-foreground mb-4">Avg Reaction Time per Latency</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statsByLatency}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="latency" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip />
              <Bar dataKey="avgRT" name="Avg RT (ms)" radius={[6, 6, 0, 0]}>
                {statsByLatency.map((_, i) => <Cell key={i} fill={LATENCY_COLORS[LATENCY_OPTIONS[i]]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Score per latency */}
        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="font-semibold text-foreground mb-4">Avg Score per Latency</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statsByLatency}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="latency" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip />
              <Bar dataKey="avgScore" name="Avg Score" radius={[6, 6, 0, 0]}>
                {statsByLatency.map((_, i) => <Cell key={i} fill={LATENCY_COLORS[LATENCY_OPTIONS[i]]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line chart: Trend */}
        <div className="bg-card rounded-xl border border-border p-4 md:col-span-2">
          <h3 className="font-semibold text-foreground mb-4">Tren: Latency vs Performa</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={statsByLatency}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="latency" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="avgMOS" name="MOS" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="avgAcc" name="Accuracy (%)" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default LatencyStats;
