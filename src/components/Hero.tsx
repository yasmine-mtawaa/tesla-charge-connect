import teslaHero from "@/assets/tesla-hero.jpg";
import { ArrowRight, Battery, MapPin, ShieldCheck } from "lucide-react";

interface HeroProps {
  onStart: () => void;
}

export const Hero = ({ onStart }: HeroProps) => {
  return (
    <section className="relative pt-24 pb-16 overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-gradient-glow opacity-60 pointer-events-none" />

      <div className="container mx-auto px-6 relative">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Left content */}
          <div className="lg:col-span-6 space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-primary/30">
              <span className="w-2 h-2 rounded-full bg-primary-glow animate-pulse-glow" />
              <span className="text-xs font-mono uppercase tracking-wider text-primary-glow">Network online · 247 stations</span>
            </div>

            <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight">
              Réservez votre <br />
              <span className="text-gradient">borne Tesla</span><br />
              en 30 secondes.
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Identification automatique par OCR de carte grise, vérification sécurisée, et accès instantané au plus grand réseau de Superchargers en Tunisie.
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={onStart}
                className="group relative px-7 py-3.5 rounded-xl bg-gradient-electric text-primary-foreground font-semibold shadow-electric hover:scale-[1.02] transition-transform"
              >
                <span className="flex items-center gap-2">
                  Commencer la réservation
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <button className="px-7 py-3.5 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 font-medium transition-all">
                Voir la carte
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50">
              {[
                { icon: MapPin, label: "Stations", value: "247" },
                { icon: Battery, label: "Bornes actives", value: "1.4k" },
                { icon: ShieldCheck, label: "Uptime", value: "99.9%" },
              ].map((stat, i) => (
                <div key={i} className="space-y-1">
                  <stat.icon className="w-4 h-4 text-primary-glow mb-1" />
                  <div className="font-display text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Tesla 3D scene */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[16/10] animate-float">
              <img
                src={teslaHero}
                alt="Tesla électrique avec aura énergie"
                className="w-full h-full object-contain relative z-10"
                width={1600}
                height={900}
              />
              {/* Floating data badges */}
              <div className="absolute top-8 right-4 glass border-gradient rounded-xl px-4 py-3 animate-slide-in-right" style={{ animationDelay: '0.4s' }}>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Battery</div>
                <div className="font-mono text-2xl font-bold text-primary-glow">87%</div>
              </div>
              <div className="absolute bottom-12 left-0 glass border-gradient rounded-xl px-4 py-3 animate-slide-in-right" style={{ animationDelay: '0.6s' }}>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Range</div>
                <div className="font-mono text-2xl font-bold text-primary-glow">412 km</div>
              </div>
              <div className="absolute top-1/2 -right-2 glass border-gradient rounded-xl px-4 py-3 animate-slide-in-right" style={{ animationDelay: '0.8s' }}>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-success animate-pulse-glow" />
                  <span className="text-xs font-mono">CHARGING READY</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
