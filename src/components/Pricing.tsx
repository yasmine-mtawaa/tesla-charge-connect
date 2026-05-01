import { Zap, Clock, Battery, Sparkles } from "lucide-react";

const PLANS = [
  {
    name: "Standard",
    price: "0.45",
    unit: "TND/kWh",
    icon: Battery,
    features: ["Bornes V2 jusqu'à 150 kW", "Réservation à l'avance", "Paiement à l'usage", "Support email"],
    highlight: false,
  },
  {
    name: "Supercharger V3",
    price: "0.55",
    unit: "TND/kWh",
    icon: Zap,
    features: ["Bornes V3 jusqu'à 250 kW", "Priorité de réservation", "0-80% en ~25 min", "Support 24/7"],
    highlight: true,
  },
  {
    name: "Pass Annuel",
    price: "299",
    unit: "TND/an",
    icon: Sparkles,
    features: ["-15% sur tous les kWh", "Créneaux premium", "Bornes V3 illimitées", "Concierge dédié"],
    highlight: false,
  },
];

export const Pricing = () => (
  <section id="tarifs" className="py-20 relative scroll-mt-20">
    <div className="container mx-auto px-6">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-primary/30">
          <span className="text-xs font-mono uppercase tracking-wider text-primary-glow">Tarification</span>
        </div>
        <h2 className="font-display text-4xl md:text-5xl font-bold">
          Des prix <span className="text-gradient">transparents</span>
        </h2>
        <p className="text-muted-foreground">Pas d'abonnement obligatoire. Payez uniquement ce que vous chargez.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {PLANS.map(plan => {
          const Icon = plan.icon;
          return (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-6 space-y-5 transition-all ${
                plan.highlight
                  ? "glass-strong border-2 border-primary shadow-electric scale-[1.02]"
                  : "glass border border-border hover:border-primary/40"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-gradient-electric text-primary-foreground shadow-electric">
                  Populaire
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  plan.highlight ? "bg-gradient-electric text-primary-foreground" : "bg-primary/10 text-primary-glow"
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="font-display text-xl font-bold">{plan.name}</div>
              </div>
              <div>
                <div className="font-display text-4xl font-bold text-gradient">{plan.price}</div>
                <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mt-1">{plan.unit}</div>
              </div>
              <ul className="space-y-2 text-sm">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2">
                    <Clock className="w-3.5 h-3.5 text-primary-glow mt-1 shrink-0" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);
