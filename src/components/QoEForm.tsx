import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MOS_LABELS } from '@/types/game';
import { cn } from '@/lib/utils';
import { Star, Target, Crosshair, Zap } from 'lucide-react';

interface QoEFormProps {
  onSubmit: (mos: number, comment: string) => void;
  score: number;
  hits: number;
  total: number;
  avgReactionTime: number;
  accuracy: number;
  latency: number;
  headshots: number;
  bodyshots: number;
  misses: number;
}

const QoEForm = ({ onSubmit, score, hits, total, avgReactionTime, accuracy, latency, headshots, bodyshots, misses }: QoEFormProps) => {
  const [mos, setMos] = useState<number | null>(null);
  const [comment, setComment] = useState('');

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="bg-card rounded-xl border border-border p-6 space-y-4">
        <h3 className="text-xl font-bold text-foreground text-center flex items-center justify-center gap-2">
          <Target className="w-5 h-5 text-primary" /> Hasil Misi
        </h3>
        <div className="grid grid-cols-3 gap-3 text-center">
          <StatBox label="Score" value={score.toString()} icon={<Zap className="w-4 h-4 text-primary" />} />
          <StatBox label="Latency" value={`${latency}ms`} icon={<span className="text-sm">⏱️</span>} />
          <StatBox label="Akurasi" value={`${accuracy.toFixed(1)}%`} icon={<Crosshair className="w-4 h-4 text-accent" />} />
          <StatBox label="Headshot" value={headshots.toString()} highlight />
          <StatBox label="Body Hit" value={bodyshots.toString()} />
          <StatBox label="Miss" value={misses.toString()} />
          <StatBox label="Total Shots" value={total.toString()} />
          <StatBox label="Avg RT" value={`${avgReactionTime.toFixed(0)}ms`} />
          <StatBox label="Hits" value={`${hits}/${total}`} />
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Bagaimana pengalaman bermain Anda?</h3>
        <p className="text-sm text-muted-foreground">Berikan penilaian Mean Opinion Score (MOS):</p>
        <div className="flex gap-2 justify-center flex-wrap">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => setMos(value)}
              className={cn(
                'flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all min-w-[64px]',
                mos === value
                  ? 'border-primary bg-primary/10 scale-105'
                  : 'border-border hover:border-primary/50'
              )}
            >
              <Star className={cn('w-6 h-6', mos !== null && value <= mos ? 'text-primary fill-primary' : 'text-muted-foreground')} />
              <span className="text-xs font-medium text-foreground">{value}</span>
              <span className="text-[10px] text-muted-foreground leading-tight">{MOS_LABELS[value]}</span>
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Komentar (opsional)</label>
          <Textarea
            placeholder="Bagikan pengalaman bermain Anda..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={500}
          />
        </div>

        <Button className="w-full" size="lg" disabled={mos === null} onClick={() => mos && onSubmit(mos, comment)}>
          Kirim Penilaian
        </Button>
      </div>
    </div>
  );
};

const StatBox = ({ label, value, icon, highlight }: { label: string; value: string; icon?: React.ReactNode; highlight?: boolean }) => (
  <div className={cn('rounded-lg p-2 border border-border', highlight && 'border-destructive/50 bg-destructive/5')}>
    {icon && <div className="mb-1 flex justify-center">{icon}</div>}
    <div className={cn('text-lg font-bold', highlight ? 'text-destructive' : 'text-primary')}>{value}</div>
    <div className="text-[10px] text-muted-foreground">{label}</div>
  </div>
);

export default QoEForm;
