import { useState, useRef } from "react";
import { Upload, FileText, Loader2, CheckCircle2, Globe } from "lucide-react";
import carteGriseImg from "@/assets/carte-grise-sample.jpg";

interface IdentificationStepProps {
  onComplete: (data: VehicleData) => void;
  onForeign: () => void;
}

export interface VehicleData {
  immatriculation: string;
  numChassis: string;
  marque: string;
  modele: string;
  proprietaire: string;
}

type ScanStatus = "idle" | "scanning" | "extracting" | "done";

export const IdentificationStep = ({ onComplete, onForeign }: IdentificationStepProps) => {
  const [status, setStatus] = useState<ScanStatus>("idle");
  const [data, setData] = useState<VehicleData>({
    immatriculation: "",
    numChassis: "",
    marque: "Tesla",
    modele: "",
    proprietaire: "",
  });
  const fileRef = useRef<HTMLInputElement>(null);

  const simulateOCR = () => {
    setStatus("scanning");
    setTimeout(() => setStatus("extracting"), 1800);
    setTimeout(() => {
      setStatus("done");
      setData({
        immatriculation: "245 TUN 7821",
        numChassis: "5YJ3E1EA8KF317452",
        marque: "Tesla",
        modele: "Model 3 Long Range",
        proprietaire: "Mohamed Ben Ali",
      });
    }, 3500);
  };

  const canSubmit = data.immatriculation && data.numChassis && data.modele;

  return (
    <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
      {/* Left - OCR Scanner */}
      <div className="lg:col-span-2 space-y-4">
        <div className="space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-primary-glow">01 · Scanner OCR</div>
          <h3 className="font-display text-2xl font-bold">Carte grise</h3>
          <p className="text-sm text-muted-foreground">Numérisez votre carte grise pour remplissage automatique des champs.</p>
        </div>

        <div
          onClick={() => status === "idle" && simulateOCR()}
          className={`relative aspect-[4/3] rounded-2xl glass border-2 border-dashed overflow-hidden cursor-pointer transition-all ${
            status === "idle"
              ? "border-border hover:border-primary/50 hover:bg-primary/5"
              : "border-primary/60"
          } ${status === "scanning" ? "scan-overlay" : ""}`}
        >
          {status === "idle" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center p-6">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-6 h-6 text-primary-glow" />
              </div>
              <div>
                <div className="font-medium">Cliquez pour scanner</div>
                <div className="text-xs text-muted-foreground mt-1">JPG, PNG, PDF · max 10 MB</div>
              </div>
              <button className="text-xs font-mono uppercase tracking-wider text-primary-glow border border-primary/30 rounded-full px-3 py-1 mt-2">
                Démo OCR
              </button>
            </div>
          )}

          {status !== "idle" && (
            <>
              <img src={carteGriseImg} alt="Carte grise" className="absolute inset-0 w-full h-full object-cover" loading="lazy" width={800} height={600} />
              <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px]" />
              {status === "extracting" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="glass-strong rounded-xl px-4 py-3 flex items-center gap-3">
                    <Loader2 className="w-5 h-5 text-primary-glow animate-spin" />
                    <span className="text-sm font-mono">Extraction des données...</span>
                  </div>
                </div>
              )}
              {status === "done" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="glass-strong rounded-xl px-4 py-3 flex items-center gap-3 border border-success/40">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    <span className="text-sm font-mono">Données extraites</span>
                  </div>
                </div>
              )}
              {/* Corner brackets */}
              {status === "scanning" && (
                <>
                  <span className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-primary-glow" />
                  <span className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-primary-glow" />
                  <span className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-primary-glow" />
                  <span className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-primary-glow" />
                </>
              )}
            </>
          )}
          <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden" />
        </div>

        <button
          onClick={onForeign}
          className="w-full glass border border-border rounded-xl p-4 flex items-center gap-3 hover:border-primary/50 hover:bg-primary/5 transition-all text-left group"
        >
          <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5 text-warning" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-sm">Voiture étrangère</div>
            <div className="text-xs text-muted-foreground">Pas de carte grise tunisienne ? Procédure dédiée.</div>
          </div>
          <span className="text-primary-glow group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>

      {/* Right - Form */}
      <div className="lg:col-span-3 space-y-4">
        <div className="space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-primary-glow">02 · Informations véhicule</div>
          <h3 className="font-display text-2xl font-bold">Identifiez votre Tesla</h3>
          <p className="text-sm text-muted-foreground">Vérifiez les informations extraites ou remplissez-les manuellement.</p>
        </div>

        <div className="glass border-gradient rounded-2xl p-6 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Immatriculation" value={data.immatriculation} onChange={v => setData({ ...data, immatriculation: v })} placeholder="123 TUN 4567" mono />
            <Field label="N° de châssis (VIN)" value={data.numChassis} onChange={v => setData({ ...data, numChassis: v })} placeholder="5YJ..." mono />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Marque" value={data.marque} onChange={v => setData({ ...data, marque: v })} placeholder="Tesla" />
            <Field label="Modèle" value={data.modele} onChange={v => setData({ ...data, modele: v })} placeholder="Model 3 / S / X / Y" />
          </div>
          <Field label="Propriétaire (titulaire)" value={data.proprietaire} onChange={v => setData({ ...data, proprietaire: v })} placeholder="Nom complet" />

          {status === "done" && (
            <div className="flex items-center gap-2 text-xs text-success font-mono animate-fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>OCR confidence: 98.4% · Vehicle verified in DGTT database</span>
            </div>
          )}

          <button
            disabled={!canSubmit}
            onClick={() => onComplete(data)}
            className="w-full py-3.5 rounded-xl bg-gradient-electric text-primary-foreground font-semibold shadow-electric disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed hover:scale-[1.01] transition-transform"
          >
            Continuer vers la vérification →
          </button>
        </div>
      </div>
    </div>
  );
};

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  mono?: boolean;
}

const Field = ({ label, value, onChange, placeholder, mono }: FieldProps) => (
  <div className="space-y-1.5">
    <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</label>
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-4 py-3 rounded-xl bg-input/60 border border-border focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/40 ${mono ? 'font-mono' : ''}`}
    />
  </div>
);
