import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Crosshair, Mouse, Target, Star, Clock } from 'lucide-react';

const Tutorial = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-3 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Kembali
          </Button>
          <h1 className="font-semibold text-foreground">Tutorial Bermain</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-3xl space-y-8">
        <div className="text-center space-y-4">
          <Crosshair className="w-12 h-12 text-primary mx-auto" />
          <h1 className="text-3xl font-bold text-foreground">Cara Bermain</h1>
          <p className="text-muted-foreground">Panduan lengkap untuk bermain FPS Latency Simulator</p>
        </div>

        <Step number="1" title="Pilih Level Latency" icon={<Clock className="w-6 h-6 text-primary" />}>
          <p>Sebelum memulai game, pilih salah satu dari 5 level latency yang tersedia (20ms, 50ms, 100ms, 150ms, 200ms). 
          Latency ini akan mensimulasikan delay antara klik tembakan dan registrasi hit.</p>
        </Step>

        <Step number="2" title="Kontrol Game" icon={<Mouse className="w-6 h-6 text-primary" />}>
          <ul className="space-y-2">
            <li><strong className="text-foreground">🖱️ Gerakkan Mouse:</strong> Arahkan crosshair ke target musuh</li>
            <li><strong className="text-foreground">🖱️ Klik Kiri:</strong> Menembak (fire rate: 300ms antar tembakan)</li>
            <li><strong className="text-foreground">📱 Mobile:</strong> Sentuh layar untuk mengarahkan dan menembak</li>
          </ul>
        </Step>

        <Step number="3" title="Target & Scoring" icon={<Target className="w-6 h-6 text-accent" />}>
          <ul className="space-y-2">
            <li><strong className="text-destructive">💀 Headshot:</strong> Tembak bagian kepala musuh = +10 poin</li>
            <li><strong className="text-primary">🎯 Body Hit:</strong> Tembak bagian badan musuh = +5 poin</li>
            <li><strong className="text-muted-foreground">❌ Miss:</strong> Tembakan meleset = 0 poin</li>
          </ul>
          <p className="mt-3 text-sm">Musuh akan bergerak secara horizontal dan menghilang setelah beberapa detik. 
          Tembak secepat mungkin untuk mendapat skor tinggi!</p>
        </Step>

        <Step number="4" title="Durasi & HUD" icon={<Clock className="w-6 h-6 text-primary" />}>
          <p>Permainan berlangsung selama <strong className="text-foreground">60 detik</strong>. 
          HUD di layar menampilkan Score, Timer, Accuracy, dan Latency indicator secara real-time.</p>
        </Step>

        <Step number="5" title="Penilaian QoE" icon={<Star className="w-6 h-6 text-accent" />}>
          <p>Setelah game selesai, berikan penilaian pengalaman bermain Anda menggunakan skala MOS (Mean Opinion Score) 
          dari 1 (Sangat Buruk) hingga 5 (Sangat Baik). Anda juga bisa memberikan komentar opsional.</p>
        </Step>

        <div className="text-center pt-8">
          <Button onClick={() => navigate('/game')} size="lg" className="gap-2">
            <Crosshair className="w-5 h-5" /> Mulai Bermain
          </Button>
        </div>
      </main>
    </div>
  );
};

const Step = ({ number, title, icon, children }: { number: string; title: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <div className="bg-card rounded-xl border border-border p-6 flex gap-4">
    <div className="flex-shrink-0">
      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
        <span className="text-primary-foreground font-bold">{number}</span>
      </div>
    </div>
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">{icon} {title}</h3>
      <div className="text-muted-foreground text-sm leading-relaxed">{children}</div>
    </div>
  </div>
);

export default Tutorial;
