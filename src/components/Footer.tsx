import { Zap } from "lucide-react";

export const Footer = () => (
  <footer className="border-t border-border/50 py-12 mt-24">
    <div className="container mx-auto px-6">
      <div className="grid md:grid-cols-4 gap-8 mb-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-electric flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" fill="currentColor" />
            </div>
            <span className="font-display font-bold">VOLT.</span>
          </div>
          <p className="text-xs text-muted-foreground">Le réseau de Superchargers Tesla en Tunisie. Réservez en 30 secondes.</p>
        </div>
        <FooterCol title="Réseau" links={["Stations", "Couverture", "Bornes V3", "Capacités"]} />
        <FooterCol title="Compte" links={["Mes réservations", "Historique", "Paiement", "Support"]} />
        <FooterCol title="Légal" links={["CGU", "Confidentialité", "Cookies", "Mentions"]} />
      </div>
      <div className="pt-6 border-t border-border/50 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
        <div>© 2025 VOLT Charging Network · Projet académique INSAT</div>
        <div className="font-mono">Méthodologies d'analyse · Design Patterns · MOO</div>
      </div>
    </div>
  </footer>
);

const FooterCol = ({ title, links }: { title: string; links: string[] }) => (
  <div>
    <div className="text-xs font-mono uppercase tracking-wider text-foreground mb-3">{title}</div>
    <ul className="space-y-2 text-sm">
      {links.map(l => (
        <li key={l}><a href="#" className="text-muted-foreground hover:text-primary-glow transition-colors">{l}</a></li>
      ))}
    </ul>
  </div>
);
