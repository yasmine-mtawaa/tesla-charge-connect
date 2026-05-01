import { Mail, Phone, MessageCircle, HelpCircle } from "lucide-react";

const FAQ = [
  { q: "Comment fonctionne la lecture OCR de la carte grise ?", a: "Importez une photo claire depuis votre PC. Notre OCR extrait l'immatriculation, le numéro de châssis, la marque et le modèle en quelques secondes." },
  { q: "Puis-je utiliser une voiture étrangère ?", a: "Oui. Une procédure dédiée vous permet d'enregistrer manuellement votre véhicule et de recevoir un OTP par email ou SMS." },
  { q: "Comment recevoir le code OTP ?", a: "Au choix : email (envoyé depuis yassmine.mtawa@gmail.com), SMS ou WhatsApp sur le numéro du titulaire." },
  { q: "Puis-je annuler une réservation ?", a: "Oui, jusqu'à 30 minutes avant le créneau réservé, sans frais." },
];

export const Support = () => (
  <section id="support" className="py-20 relative scroll-mt-20">
    <div className="absolute inset-0 grid-bg opacity-10" />
    <div className="container mx-auto px-6 relative">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-primary/30">
          <HelpCircle className="w-3.5 h-3.5 text-primary-glow" />
          <span className="text-xs font-mono uppercase tracking-wider text-primary-glow">Support</span>
        </div>
        <h2 className="font-display text-4xl md:text-5xl font-bold">
          On est <span className="text-gradient">là pour vous</span>
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-12">
        <ContactCard icon={Mail} label="Email" value="support@volt.tn" href="mailto:support@volt.tn" />
        <ContactCard icon={Phone} label="Téléphone" value="+216 71 000 000" href="tel:+21671000000" />
        <ContactCard icon={MessageCircle} label="WhatsApp" value="+216 22 000 000" href="https://wa.me/21622000000" />
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground text-center mb-4">Questions fréquentes</div>
        {FAQ.map((item, i) => (
          <details key={i} className="glass border border-border rounded-xl p-5 group hover:border-primary/40 transition-colors">
            <summary className="cursor-pointer font-medium text-sm flex items-center justify-between list-none">
              <span>{item.q}</span>
              <span className="text-primary-glow text-xl group-open:rotate-45 transition-transform">+</span>
            </summary>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  </section>
);

const ContactCard = ({ icon: Icon, label, value, href }: { icon: React.ElementType; label: string; value: string; href: string }) => (
  <a href={href} className="glass border border-border rounded-2xl p-5 flex items-center gap-4 hover:border-primary/50 hover:bg-primary/5 transition-all group">
    <div className="w-12 h-12 rounded-xl bg-gradient-electric flex items-center justify-center shadow-electric shrink-0">
      <Icon className="w-5 h-5 text-primary-foreground" />
    </div>
    <div>
      <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-medium text-sm group-hover:text-primary-glow transition-colors">{value}</div>
    </div>
  </a>
);
