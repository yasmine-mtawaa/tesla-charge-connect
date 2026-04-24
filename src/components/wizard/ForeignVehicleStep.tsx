import { useState } from "react";
import { ArrowLeft, Globe, Mail, Phone, Hash } from "lucide-react";

interface ForeignVehicleStepProps {
  onComplete: (data: ForeignData) => void;
  onBack: () => void;
}

export interface ForeignData {
  immatriculation: string;
  numChassis: string;
  email: string;
  telephone: string;
  paysOrigine: string;
}

const COUNTRIES = ["France", "Italie", "Allemagne", "Espagne", "Belgique", "Algérie", "Maroc", "Libye", "Autre"];

export const ForeignVehicleStep = ({ onComplete, onBack }: ForeignVehicleStepProps) => {
  const [data, setData] = useState<ForeignData>({
    immatriculation: "",
    numChassis: "",
    email: "",
    telephone: "",
    paysOrigine: "France",
  });

  const canSubmit = data.immatriculation && data.numChassis && data.email && data.telephone;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour à l'identification standard
      </button>

      <div className="glass border-gradient rounded-2xl p-8 space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center shrink-0">
            <Globe className="w-6 h-6 text-warning" />
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-warning mb-1">Procédure véhicule étranger</div>
            <h3 className="font-display text-2xl font-bold">Enregistrement temporaire</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Pour les véhicules immatriculés hors Tunisie, nous avons besoin de quelques informations supplémentaires.
            </p>
          </div>
        </div>

        <div className="border-t border-border pt-6 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <FieldWithIcon
              icon={Hash}
              label="Immatriculation"
              value={data.immatriculation}
              onChange={v => setData({ ...data, immatriculation: v })}
              placeholder="AA-123-BB"
            />
            <FieldWithIcon
              icon={Hash}
              label="N° de châssis (VIN)"
              value={data.numChassis}
              onChange={v => setData({ ...data, numChassis: v })}
              placeholder="17 caractères"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Pays d'origine</label>
            <select
              value={data.paysOrigine}
              onChange={e => setData({ ...data, paysOrigine: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-input/60 border border-border focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            >
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <FieldWithIcon
              icon={Mail}
              type="email"
              label="Email"
              value={data.email}
              onChange={v => setData({ ...data, email: v })}
              placeholder="contact@email.com"
            />
            <FieldWithIcon
              icon={Phone}
              type="tel"
              label="Téléphone"
              value={data.telephone}
              onChange={v => setData({ ...data, telephone: v })}
              placeholder="+33 6 12 34 56 78"
            />
          </div>

          <div className="glass rounded-xl p-4 text-xs text-muted-foreground border border-primary/20">
            <strong className="text-foreground">ℹ️ Vérification requise.</strong> Un code de vérification sera envoyé à votre email ou téléphone pour confirmer votre identité avant la réservation.
          </div>

          <button
            disabled={!canSubmit}
            onClick={() => onComplete(data)}
            className="w-full py-3.5 rounded-xl bg-gradient-electric text-primary-foreground font-semibold shadow-electric disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed hover:scale-[1.01] transition-transform"
          >
            Envoyer · Continuer vers la vérification →
          </button>
        </div>
      </div>
    </div>
  );
};

interface FieldWithIconProps {
  icon: React.ElementType;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}

const FieldWithIcon = ({ icon: Icon, label, value, onChange, placeholder, type = "text" }: FieldWithIconProps) => (
  <div className="space-y-1.5">
    <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</label>
    <div className="relative">
      <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 rounded-xl bg-input/60 border border-border focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/40"
      />
    </div>
  </div>
);
