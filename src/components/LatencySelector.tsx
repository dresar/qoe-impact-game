import { LATENCY_OPTIONS } from '@/types/game';
import { getLatencyColor } from '@/lib/gameUtils';
import { cn } from '@/lib/utils';

interface LatencySelectorProps {
  selected: number | null;
  onSelect: (latency: number) => void;
}

const LatencySelector = ({ selected, onSelect }: LatencySelectorProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Pilih Level Latency</h3>
      <div className="grid grid-cols-5 gap-2">
        {LATENCY_OPTIONS.map((ms) => (
          <button
            key={ms}
            onClick={() => onSelect(ms)}
            className={cn(
              'rounded-lg py-3 px-2 text-center font-bold transition-all border-2',
              selected === ms
                ? `${getLatencyColor(ms)} border-foreground text-primary-foreground scale-105 shadow-lg`
                : 'bg-card border-border text-foreground hover:border-primary'
            )}
          >
            <div className="text-lg">{ms}</div>
            <div className="text-xs opacity-80">ms</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LatencySelector;
