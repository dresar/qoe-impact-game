import { useEffect, useState } from 'react';
import { fetchGameSessions } from '@/api/client';
import { Button } from '@/components/ui/button';
import { LATENCY_OPTIONS } from '@/types/game';
import { RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

const LATENCY_COLORS: Record<number, string> = {
  20: '#22c55e', 50: '#84cc16', 100: '#eab308', 150: '#f97316', 200: '#ef4444',
};

const PAGE_SIZE = 15;

interface Row {
  id: string;
  user_id: string;
  latency_level: number;
  avg_reaction_time: number;
  accuracy: number;
  score: number;
  hits: number;
  total_targets: number;
  mos_score: number;
  comment: string | null;
  created_at: string;
}

const DataSessions = () => {
  const [data, setData] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<number | null>(null);
  const [page, setPage] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    const rows = await fetchGameSessions({ latency: filter ?? undefined, notNullMos: true });
    setData(rows.map(r => ({
      id: r.id!,
      user_id: r.user_id,
      latency_level: r.latency_level,
      avg_reaction_time: Number(r.avg_reaction_time ?? 0),
      accuracy: Number(r.accuracy ?? 0),
      score: Number(r.score ?? 0),
      hits: Number(r.hits ?? 0),
      total_targets: Number(r.total_targets ?? 0),
      mos_score: Number(r.mos_score ?? 0),
      comment: r.comment ?? null,
      created_at: r.created_at!,
    })));
    setLoading(false);
    setPage(0);
  };

  useEffect(() => { fetchData(); }, [filter]);

  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  const paged = data.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-foreground">Data Game Sessions</h2>
        <Button variant="ghost" size="sm" onClick={fetchData}><RefreshCw className="w-4 h-4" /></Button>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm text-muted-foreground">Filter Latency:</span>
        <Button variant={filter === null ? 'default' : 'outline'} size="sm" onClick={() => setFilter(null)}>Semua</Button>
        {LATENCY_OPTIONS.map((l) => (
          <Button key={l} variant={filter === l ? 'default' : 'outline'} size="sm" onClick={() => setFilter(l)}>{l}ms</Button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left p-3 text-muted-foreground">User ID</th>
                <th className="text-center p-3 text-muted-foreground">Latency</th>
                <th className="text-center p-3 text-muted-foreground">Score</th>
                <th className="text-center p-3 text-muted-foreground">Accuracy</th>
                <th className="text-center p-3 text-muted-foreground">Avg RT</th>
                <th className="text-center p-3 text-muted-foreground">MOS</th>
                <th className="text-left p-3 text-muted-foreground">Komentar</th>
                <th className="text-left p-3 text-muted-foreground">Waktu</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={8} className="text-center p-8 text-muted-foreground">Memuat...</td></tr>}
              {!loading && paged.length === 0 && <tr><td colSpan={8} className="text-center p-8 text-muted-foreground">Belum ada data</td></tr>}
              {paged.map((row) => (
                <tr key={row.id} className="border-b border-border hover:bg-muted/20">
                  <td className="p-3 font-mono text-xs text-foreground">{row.user_id}</td>
                  <td className="p-3 text-center">
                    <span className="px-2 py-0.5 rounded text-xs font-bold" style={{ backgroundColor: LATENCY_COLORS[row.latency_level] + '20', color: LATENCY_COLORS[row.latency_level] }}>
                      {row.latency_level}ms
                    </span>
                  </td>
                  <td className="p-3 text-center text-foreground">{row.score}</td>
                  <td className="p-3 text-center text-foreground">{row.accuracy?.toFixed(1)}%</td>
                  <td className="p-3 text-center text-foreground">{row.avg_reaction_time?.toFixed(0)}ms</td>
                  <td className="p-3 text-center font-bold text-foreground">{row.mos_score}/5</td>
                  <td className="p-3 text-xs text-muted-foreground max-w-[150px] truncate">{row.comment || '—'}</td>
                  <td className="p-3 text-xs text-muted-foreground">{new Date(row.created_at).toLocaleString('id-ID')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-3 border-t border-border">
            <span className="text-xs text-muted-foreground">{data.length} total records</span>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-foreground">{page + 1} / {totalPages}</span>
              <Button variant="ghost" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataSessions;
