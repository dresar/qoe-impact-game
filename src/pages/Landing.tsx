import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Crosshair, BarChart3, Clock, Target, Zap, Brain, ChevronRight, BookOpen } from 'lucide-react';
import heroBanner from '@/assets/hero-banner.jpg';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crosshair className="w-6 h-6 text-primary" />
            <span className="font-bold text-foreground text-lg">QoE Simulator</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#about" className="hover:text-foreground transition-colors">Tentang</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">Cara Kerja</a>
            <a href="#latency" className="hover:text-foreground transition-colors">Latency</a>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate('/tutorial')}>Tutorial</Button>
            <Button size="sm" onClick={() => navigate('/game')}>Mulai Game</Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-16 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBanner} alt="FPS Game" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>
        <div className="relative container mx-auto px-4 py-24 md:py-36 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/15 rounded-full px-4 py-1.5 mb-6 border border-primary/20">
            <Crosshair className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Penelitian Skripsi — Simulasi QoE</span>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight max-w-4xl mx-auto">
            Analisis Pengaruh
            <span className="text-primary"> Latensi </span>
            terhadap
            <span className="text-accent"> Quality of Experience </span>
            pada Game FPS
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Mainkan game target shooting dengan simulasi latency, lalu berikan penilaian pengalaman Anda 
            untuk mendukung penelitian ilmiah tentang jaringan dan user experience.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6 gap-2" onClick={() => navigate('/game')}>
              <Crosshair className="w-5 h-5" /> Mulai Simulasi
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 gap-2" onClick={() => navigate('/dashboard')}>
              <BarChart3 className="w-5 h-5" /> Dashboard Analitik
            </Button>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">Tentang Penelitian</h2>
            <p className="text-muted-foreground text-lg">
              Penelitian ini bertujuan menganalisis bagaimana latensi jaringan memengaruhi 
              pengalaman pengguna (Quality of Experience) saat bermain game First-Person Shooter berbasis web.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <InfoCard
              icon={<Clock className="w-8 h-8 text-primary" />}
              title="Apa itu Latency?"
              description="Latency adalah waktu tunda antara input pengguna dan respons sistem. Dalam gaming, latency yang tinggi menyebabkan delay antara aksi pemain dan hasilnya di layar, yang secara langsung memengaruhi gameplay dan kepuasan pengguna."
            />
            <InfoCard
              icon={<Brain className="w-8 h-8 text-accent" />}
              title="Apa itu QoE?"
              description="Quality of Experience (QoE) adalah ukuran subjektif dari kepuasan pengguna terhadap suatu layanan. Dalam konteks gaming, QoE diukur menggunakan Mean Opinion Score (MOS) dengan skala 1-5, dari 'Sangat Buruk' hingga 'Sangat Baik'."
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-center text-foreground mb-12">Fitur Simulasi</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Target className="w-8 h-8 text-primary" />}
              title="FPS Target Shooting"
              description="Game simulasi FPS dengan musuh bergerak, crosshair, headshot & body zones, HUD real-time, dan fire rate system."
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-accent" />}
              title="5 Level Latency"
              description="Simulasi delay 20ms hingga 200ms yang diterapkan pada setiap tembakan. Rasakan perbedaan pengalaman di setiap level."
            />
            <FeatureCard
              icon={<BarChart3 className="w-8 h-8 text-destructive" />}
              title="Dashboard Analitik"
              description="Visualisasi data lengkap: scatter plot, bar chart, tabel data, dan analisis statistik hubungan latency-QoE."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-center text-foreground mb-12">Cara Kerja Sistem</h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { step: '1', title: 'Pilih Latency', desc: 'Pilih level delay (20ms - 200ms) yang akan disimulasikan', icon: '⚙️' },
              { step: '2', title: 'Mainkan Game', desc: 'Tembak musuh yang muncul selama 60 detik dengan crosshair', icon: '🎮' },
              { step: '3', title: 'Beri Penilaian', desc: 'Isi form QoE dengan skala MOS 1-5 dan komentar', icon: '📝' },
              { step: '4', title: 'Analisis Data', desc: 'Data divisualisasikan di dashboard untuk analisis penelitian', icon: '📊' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mx-auto mb-3">
                  <span className="text-primary-foreground font-bold">{item.step}</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latency explanation */}
      <section id="latency" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-center text-foreground mb-12">Level Latency yang Diuji</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-3xl mx-auto">
            {[
              { ms: 20, label: 'Sangat Rendah', color: 'bg-latency-20', desc: 'Koneksi fiber optimal' },
              { ms: 50, label: 'Rendah', color: 'bg-latency-50', desc: 'Broadband standar' },
              { ms: 100, label: 'Sedang', color: 'bg-latency-100', desc: 'WiFi umum' },
              { ms: 150, label: 'Tinggi', color: 'bg-latency-150', desc: 'Koneksi mobile' },
              { ms: 200, label: 'Sangat Tinggi', color: 'bg-latency-200', desc: 'Koneksi buruk' },
            ].map((l) => (
              <div key={l.ms} className="bg-card rounded-xl border border-border p-4 text-center">
                <div className={`w-12 h-12 rounded-full ${l.color} mx-auto mb-2 flex items-center justify-center`}>
                  <span className="text-primary-foreground font-bold text-sm">{l.ms}</span>
                </div>
                <div className="font-semibold text-foreground text-sm">{l.label}</div>
                <div className="text-xs text-muted-foreground mt-1">{l.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-card border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Siap Berkontribusi dalam Penelitian?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Setiap sesi permainan Anda akan membantu menghasilkan data yang berharga untuk analisis ilmiah tentang hubungan latency dan Quality of Experience.
          </p>
          <Button size="lg" className="text-lg px-8 py-6 gap-2" onClick={() => navigate('/game')}>
            <Crosshair className="w-5 h-5" /> Mulai Simulasi Sekarang
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2024 QoE Latency Simulator — Penelitian Skripsi</p>
          <div className="flex justify-center gap-4 mt-3">
            <button onClick={() => navigate('/about')} className="hover:text-foreground transition-colors">About</button>
            <button onClick={() => navigate('/tutorial')} className="hover:text-foreground transition-colors">Tutorial</button>
            <button onClick={() => navigate('/dashboard')} className="hover:text-foreground transition-colors">Dashboard</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="bg-card rounded-xl border border-border p-6 hover:shadow-lg hover:border-primary/30 transition-all">
    <div className="mb-4">{icon}</div>
    <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
    <p className="text-muted-foreground text-sm">{description}</p>
  </div>
);

const InfoCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="bg-background rounded-xl border border-border p-6">
    <div className="flex items-center gap-3 mb-3">
      {icon}
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
    </div>
    <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
  </div>
);

export default Landing;
