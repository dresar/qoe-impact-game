import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Target, Brain, BarChart3, BookOpen } from 'lucide-react';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-3 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Kembali
          </Button>
          <h1 className="font-semibold text-foreground">Tentang Penelitian</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-3xl space-y-8">
        <div className="text-center space-y-4">
          <BookOpen className="w-12 h-12 text-primary mx-auto" />
          <h1 className="text-3xl font-bold text-foreground">Tentang Penelitian Ini</h1>
        </div>

        <Section title="Judul Penelitian">
          <p className="text-muted-foreground leading-relaxed">
            "Pengembangan dan Analisis Simulasi Latensi terhadap Quality of Experience (QoE) 
            pada Game FPS Berbasis Web"
          </p>
        </Section>

        <Section title="Latar Belakang" icon={<Brain className="w-5 h-5 text-primary" />}>
          <p className="text-muted-foreground leading-relaxed">
            Perkembangan game online yang pesat membawa tantangan baru dalam memastikan kualitas 
            pengalaman pengguna. Latensi jaringan merupakan salah satu faktor kunci yang memengaruhi 
            pengalaman bermain, terutama pada game yang memerlukan respons cepat seperti First-Person 
            Shooter (FPS). Penelitian ini bertujuan untuk mengukur dan menganalisis secara kuantitatif 
            pengaruh berbagai level latensi terhadap Quality of Experience pengguna.
          </p>
        </Section>

        <Section title="Tujuan Penelitian" icon={<Target className="w-5 h-5 text-accent" />}>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex gap-2"><span className="text-primary font-bold">1.</span> Membangun simulasi game FPS berbasis web yang dapat mensimulasikan berbagai level latensi</li>
            <li className="flex gap-2"><span className="text-primary font-bold">2.</span> Mengumpulkan data objektif (reaction time, accuracy, score) dan subjektif (MOS) dari pengguna</li>
            <li className="flex gap-2"><span className="text-primary font-bold">3.</span> Menganalisis korelasi antara latensi dan Quality of Experience</li>
            <li className="flex gap-2"><span className="text-primary font-bold">4.</span> Memberikan rekomendasi threshold latensi yang dapat diterima untuk game FPS</li>
          </ul>
        </Section>

        <Section title="Metodologi" icon={<BarChart3 className="w-5 h-5 text-destructive" />}>
          <p className="text-muted-foreground leading-relaxed mb-3">
            Penelitian menggunakan metode eksperimental dengan variabel:
          </p>
          <ul className="space-y-1 text-muted-foreground text-sm">
            <li>• <strong className="text-foreground">Variabel Independen:</strong> Level latensi (20ms, 50ms, 100ms, 150ms, 200ms)</li>
            <li>• <strong className="text-foreground">Variabel Dependen:</strong> Quality of Experience (MOS 1-5)</li>
            <li>• <strong className="text-foreground">Data Objektif:</strong> Reaction time, accuracy, score, headshots</li>
            <li>• <strong className="text-foreground">Data Subjektif:</strong> Mean Opinion Score dan komentar pengguna</li>
          </ul>
        </Section>

        <div className="text-center pt-8">
          <Button onClick={() => navigate('/game')} size="lg">
            Mulai Berkontribusi
          </Button>
        </div>
      </main>
    </div>
  );
};

const Section = ({ title, children, icon }: { title: string; children: React.ReactNode; icon?: React.ReactNode }) => (
  <div className="bg-card rounded-xl border border-border p-6">
    <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
      {icon} {title}
    </h2>
    {children}
  </div>
);

export default About;
