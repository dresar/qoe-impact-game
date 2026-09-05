import { useEffect, useState } from 'react';
import { fetchGameSessions } from '@/api/client';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie,
} from 'recharts';
import { LATENCY_OPTIONS } from '@/types/game';
import { Users, TrendingUp, Clock, Target } from 'lucide-react';

const LATENCY_COLORS: Record<number, string> = {
  20: '#22c55e', 50: '#84cc16', 100: '#eab308', 150: '#f97316', 200: '#ef4444',
};

interface Row {
  latency_level: number;
  mos_score: number;
  avg_reaction_time: number;
  accuracy: number;
  score: number;
}

const DashboardOverview = () => {
  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const rows = await fetchGameSessions({ notNullMos: true });
      setData(
        rows.map((r) => ({
          latency_level: r.latency_level,
          mos_score: Number(r.mos_score ?? 0),
          avg_reaction_time: Number(r.avg_reaction_time ?? 0),
          accuracy: Number(r.accuracy ?? 0),
          score: Number(r.score ?? 0),
        }))
      );
      setLoading(false);
    })();
  }, []);

  const totalUsers = data.length;
  const avgMOS = totalUsers > 0 ? (data.reduce((s, d) => s + d.mos_score, 0) / totalUsers).toFixed(2) : '—';
  const avgRT = totalUsers > 0 ? `${(data.reduce((s, d) => s + (d.avg_reaction_time || 0), 0) / totalUsers).toFixed(0)}ms` : '—';
  const avgAcc = totalUsers > 0 ? `${(data.reduce((s, d) => s + (d.accuracy || 0), 0) / totalUsers).toFixed(1)}%` : '—';

  const avgByLatency = LATENCY_OPTIONS.map((lat) => {
    const items = data.filter((d) => d.latency_level === lat);
    return {
      latency: `${lat}ms`,
      avgMOS: items.length ? +(items.reduce((s, d) => s + d.mos_score, 0) / items.length).toFixed(2) : 0,
      count: items.length,
    };
  });

  const pieData = LATENCY_OPTIONS.map((lat) => ({
    name: `${lat}ms`,
    value: data.filter((d) => d.latency_level === lat).length,
    fill: LATENCY_COLORS[lat],
  })).filter((d) => d.value > 0);

  if (loading) return <div className="text-muted-foreground text-center py-12">Memuat data...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Dashboard Overview</h2>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<Users className="w-5 h-5 text-primary" />} label="Total Sesi" value={totalUsers} />
        <StatCard icon={<TrendingUp className="w-5 h-5 text-accent" />} label="Rata-rata MOS" value={avgMOS} />
        <StatCard icon={<Clock className="w-5 h-5 text-destructive" />} label="Avg Reaction Time" value={avgRT} />
        <StatCard icon={<Target className="w-5 h-5 text-primary" />} label="Avg Accuracy" value={avgAcc} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Average MOS */}
        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="font-semibold text-foreground mb-4">Average MOS per Latency</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={avgByLatency}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="latency" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis domain={[0, 5]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip />
              <Bar dataKey="avgMOS" name="Avg MOS" radius={[6, 6, 0, 0]}>
                {avgByLatency.map((_, i) => (
                  <Cell key={i} fill={LATENCY_COLORS[LATENCY_OPTIONS[i]]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Distribution pie */}
        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="font-semibold text-foreground mb-4">Distribusi Sesi per Latency</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[280px] text-muted-foreground">Belum ada data</div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) => (
  <div className="bg-card rounded-xl border border-border p-4">
    <div className="flex items-center gap-2 mb-2">{icon}<span className="text-xs text-muted-foreground">{label}</span></div>
    <div className="text-2xl font-bold text-foreground">{value}</div>
  </div>
);

export default DashboardOverview;
