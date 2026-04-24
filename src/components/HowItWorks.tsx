import { Scan, ShieldCheck, MapPin, Zap } from "lucide-react";

const STEPS = [
  { icon: Scan, title: "Scannez votre carte grise", desc: "Notre OCR extrait automatiquement immatriculation et n° de châssis en 2 secondes." },
  { icon: ShieldCheck, title: "Vérifiez votre identité", desc: "Code OTP envoyé sur votre téléphone ou email pour sécuriser l'accès." },
  { icon: MapPin, title: "Choisissez votre borne", desc: "Carte interactive avec disponibilité temps réel sur tout le territoire." },
  { icon: Zap, title: "Branchez & roulez", desc: "Réservation confirmée. Votre borne vous attend, prête à charger." },
];

export const HowItWorks = () => (
  <section id="how" className="py-24 relative">
    <div className="container mx-auto px-6">
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-primary/30">
          <span className="text-xs font-mono uppercase tracking-wider text-primary-glow">Process</span>
        </div>
        <h2 className="font-display text-4xl md:text-5xl font-bold">
          Quatre étapes. <span className="text-gradient">Zéro friction.</span>
        </h2>
        <p className="text-muted-foreground">De l'identification à la charge, tout est pensé pour aller vite.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {STEPS.map((step, i) => (
          <div
            key={i}
            className="relative glass border-gradient rounded-2xl p-6 hover:shadow-electric transition-all duration-500 group animate-fade-in-up"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="absolute top-4 right-4 font-mono text-xs text-muted-foreground/40">0{i + 1}</div>
            <div className="w-12 h-12 rounded-xl bg-gradient-electric flex items-center justify-center mb-4 shadow-electric group-hover:scale-110 transition-transform">
              <step.icon className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="font-display font-bold text-lg mb-2">{step.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
