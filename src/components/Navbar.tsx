import { Zap } from "lucide-react";

interface NavbarProps {
  onStart?: () => void;
}

export const Navbar = ({ onStart }: NavbarProps) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-border/50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-electric flex items-center justify-center shadow-electric">
              <Zap className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} fill="currentColor" />
            </div>
            <div className="absolute inset-0 rounded-xl bg-gradient-electric blur-md opacity-50 -z-10" />
          </div>
          <div>
            <div className="font-display font-bold text-lg leading-none tracking-tight">VOLT<span className="text-primary-glow">.</span></div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-0.5">Tesla Charging Network</div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm">
          <a href="#stations" className="text-muted-foreground hover:text-foreground transition-colors">Stations</a>
          <a href="#how" className="text-muted-foreground hover:text-foreground transition-colors">Comment ça marche</a>
          <a href="#tarifs" className="text-muted-foreground hover:text-foreground transition-colors">Tarifs</a>
          <a href="#support" className="text-muted-foreground hover:text-foreground transition-colors">Support</a>
        </div>

        <button
          onClick={onStart}
          className="text-sm font-medium px-5 py-2 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/10 transition-all"
        >
          Se connecter
        </button>
      </div>
    </nav>
  );
};
