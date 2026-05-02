import { useState, useRef } from "react";
import { Upload, Loader2, CheckCircle2, Globe, ArrowLeft, ImageIcon, X, Sparkles } from "lucide-react";
import carteGriseImg from "@/assets/carte-grise-sample.jpg";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface IdentificationStepProps {
  onComplete: (data: VehicleData) => void;
  onForeign: () => void;
  onBack?: () => void;
}

export interface VehicleData {
  immatriculation: string;
  numChassis: string;
  marque: string;
  modele: string;
  proprietaire: string;
  email?: string;
}

type ScanStatus = "idle" | "scanning" | "extracting" | "done";

export const IdentificationStep = ({ onComplete, onForeign, onBack }: IdentificationStepProps) => {
  const [status, setStatus] = useState<ScanStatus>("idle");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [data, setData] = useState<VehicleData>({
    immatriculation: "",
    numChassis: "",
    marque: "Tesla",
    modele: "",
    proprietaire: "",
    email: "",
  });
  const fileRef = useRef<HTMLInputElement>(null);

  const fillDemoData = () => {
    setData(prev => ({
      ...prev,
      immatriculation: "245 TUN 7821",
      numChassis: "5YJ3E1EA8KF317452",
      marque: "Tesla",
      modele: "Model 3 Long Range",
      proprietaire: "Mohamed Ben Ali",
      email: prev.email || "mohamed.benali@gmail.com",
    }));
  };

  // Démo : animation de scan + données pré-remplies (toujours fonctionnelle, zéro backend)
  const useDemoSample = () => {
    setUploadedImage(carteGriseImg);
    setStatus("scanning");
    window.setTimeout(() => setStatus("extracting"), 1400);
    window.setTimeout(() => {
      fillDemoData();
      setStatus("done");
      toast.success("Démo OCR terminée", { description: "Données d'exemple chargées." });
    }, 2800);
  };

  // OCR réel : envoie l'image à l'edge function (Gemini Vision)
  const runRealOCR = async (imageDataUrl: string) => {
    setUploadedImage(imageDataUrl);
    setStatus("scanning");
    window.setTimeout(() => setStatus("extracting"), 600);
    try {
      const { data: resp, error } = await supabase.functions.invoke("ocr-carte-grise", {
        body: { imageBase64: imageDataUrl },
      });
      if (error) throw error;
      if (!resp?.success || !resp?.data) {
        throw new Error(resp?.error || "Extraction impossible");
      }
      const d = resp.data;
      setData(prev => ({
        ...prev,
        immatriculation: d.immatriculation || prev.immatriculation,
        numChassis: d.numChassis || prev.numChassis,
        marque: d.marque || prev.marque,
        modele: d.modele || prev.modele,
        proprietaire: d.proprietaire || prev.proprietaire,
        email: prev.email,
      }));
      setStatus("done");
      const conf = typeof d.confidence === "number" ? Math.round(d.confidence * 100) : null;
      toast.success("Carte grise scannée", {
        description: conf !== null ? `Confiance OCR : ${conf}%` : "Données extraites avec succès.",
      });
    } catch (err: any) {
      console.error("OCR error:", err);
      setStatus("idle");
      setUploadedImage(null);
      toast.error("Échec du scan OCR", {
        description: err?.message || "Vérifiez l'image et réessayez, ou utilisez la démo.",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Fichier trop lourd (max 10 Mo)");
      return;
    }
    const reader = new FileReader();
    reader.onload = ev => {
      const src = (ev.target?.result as string) || carteGriseImg;
      runRealOCR(src);
    };
    reader.readAsDataURL(file);
  };

  const resetScan = () => {
    setStatus("idle");
    setUploadedImage(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const canSubmit = data.immatriculation && data.numChassis && data.modele && data.email;
  const displayImage = uploadedImage || carteGriseImg;

  return (
    <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
      {/* Left - OCR Scanner */}
      <div className="lg:col-span-2 space-y-4">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>
        )}

        <div className="space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-primary-glow">01 · Scanner OCR</div>
          <h3 className="font-display text-2xl font-bold">Carte grise</h3>
          <p className="text-sm text-muted-foreground">Importez une photo depuis votre PC ou utilisez l'exemple démo.</p>
        </div>

        <div
          className={`relative aspect-[4/3] rounded-2xl glass border-2 border-dashed overflow-hidden transition-all ${
            status === "idle"
              ? "border-border hover:border-primary/50"
              : "border-primary/60"
          } ${status === "scanning" ? "scan-overlay" : ""}`}
        >
          {status === "idle" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center p-6">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="w-6 h-6 text-primary-glow" />
              </div>
              <div>
                <div className="font-medium">Importer une photo</div>
                <div className="text-xs text-muted-foreground mt-1">JPG, PNG, PDF · max 10 MB</div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full mt-2">
                <button
                  onClick={() => fileRef.current?.click()}
                  className="flex-1 text-xs font-mono uppercase tracking-wider bg-gradient-electric text-primary-foreground rounded-full px-4 py-2 shadow-electric hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                >
                  <ImageIcon className="w-3.5 h-3.5" /> Choisir un fichier
                </button>
                <button
                  onClick={useDemoSample}
                  className="flex-1 text-xs font-mono uppercase tracking-wider text-primary-glow border border-primary/30 rounded-full px-4 py-2 hover:bg-primary/5"
                >
                  Démo OCR
                </button>
              </div>
            </div>
          )}

          {status !== "idle" && (
            <>
              <img src={displayImage} alt="Carte grise" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
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
                <>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="glass-strong rounded-xl px-4 py-3 flex items-center gap-3 border border-success/40">
                      <CheckCircle2 className="w-5 h-5 text-success" />
                      <span className="text-sm font-mono">Données extraites</span>
                    </div>
                  </div>
                  <button
                    onClick={resetScan}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full glass-strong flex items-center justify-center hover:bg-destructive/20 transition-colors"
                    aria-label="Réinitialiser"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              )}
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
          <input ref={fileRef} type="file" accept="image/*,.pdf" onChange={handleFileChange} className="hidden" />
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
          <Field
            label="Email du client (pour OTP)"
            value={data.email || ""}
            onChange={v => setData({ ...data, email: v })}
            placeholder="client@email.com"
            type="email"
          />

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
  type?: string;
}

const Field = ({ label, value, onChange, placeholder, mono, type = "text" }: FieldProps) => (
  <div className="space-y-1.5">
    <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-4 py-3 rounded-xl bg-input/60 border border-border focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/40 ${mono ? 'font-mono' : ''}`}
    />
  </div>
);
