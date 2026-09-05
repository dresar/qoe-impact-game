import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LATENCY_OPTIONS } from '@/types/game';
import { toast } from 'sonner';
import { Settings as SettingsIcon, Trash2, RefreshCw } from 'lucide-react';

const DashboardSettings = () => {
  const [defaultLatency, setDefaultLatency] = useState(100);

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-bold text-foreground">Pengaturan</h2>

      {/* Default Latency */}
      <div className="bg-card rounded-xl border border-border p-6 space-y-4">
        <div className="flex items-center gap-2">
          <SettingsIcon className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Latency Default</h3>
        </div>
        <p className="text-sm text-muted-foreground">Pilih level latency yang akan dipilih secara default saat user memulai game.</p>
        <div className="flex flex-wrap gap-2">
          {LATENCY_OPTIONS.map((l) => (
            <Button key={l} variant={defaultLatency === l ? 'default' : 'outline'} size="sm" onClick={() => {
              setDefaultLatency(l);
              toast.success(`Default latency diset ke ${l}ms`);
            }}>
              {l}ms
            </Button>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="bg-card rounded-xl border border-border p-6 space-y-4">
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-accent" />
          <h3 className="font-semibold text-foreground">Informasi Sistem</h3>
        </div>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>• Database: Lovable Cloud (PostgreSQL)</p>
          <p>• Game Engine: Phaser.js 3</p>
          <p>• Frontend: React + TailwindCSS</p>
          <p>• Charting: Recharts</p>
          <p>• Data disimpan secara anonim untuk penelitian</p>
        </div>
      </div>

      {/* Reset warning */}
      <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Trash2 className="w-5 h-5 text-destructive" />
          <h3 className="font-semibold text-destructive">Reset Data</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Fitur reset data memerlukan akses admin. Hubungi administrator database untuk menghapus data sesi permainan.
        </p>
        <Button variant="outline" disabled className="border-destructive/30 text-destructive">
          <Trash2 className="w-4 h-4 mr-2" /> Reset Semua Data (Disabled)
        </Button>
      </div>
    </div>
  );
};

export default DashboardSettings;
