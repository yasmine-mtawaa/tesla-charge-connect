import { useState, useRef, useEffect } from "react";
import { Mail, Phone, MessageCircle, ShieldCheck, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";

interface VerificationStepProps {
  defaultEmail?: string;
  defaultPhone?: string;
  ownerName?: string;
  onComplete: () => void;
  onBack?: () => void;
}

type Channel = "email" | "sms" | "whatsapp";
type Phase = "select" | "code" | "verified";

const SENDER_EMAIL = "ineshajali1910@gmail.com";

export const VerificationStep = ({
  defaultEmail = "",
  defaultPhone = "",
  ownerName = "Titulaire",
  onComplete,
  onBack,
}: VerificationStepProps) => {
  const [channel, setChannel] = useState<Channel>("email");
  const [phase, setPhase] = useState<Phase>("select");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [phone, setPhone] = useState(defaultPhone);
  const [email, setEmail] = useState(defaultEmail);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  const sendCode = () => {
    setSending(true);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(otp);
    setTimeout(() => {
      setSending(false);
      setPhase("code");
      setCountdown(45);
      setTimeout(() => inputsRef.current[0]?.focus(), 100);
    }, 1200);
  };

  const handleCodeChange = (i: number, val: string) => {
    if (val.length > 1) return;
    const newCode = [...code];
    newCode[i] = val;
    setCode(newCode);
    if (val && i < 5) inputsRef.current[i + 1]?.focus();
    if (newCode.every(c => c) && newCode.join('').length === 6) {
      verifyCode();
    }
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[i] && i > 0) inputsRef.current[i - 1]?.focus();
  };

  const verifyCode = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setPhase("verified");
      setTimeout(() => onComplete(), 1500);
    }, 1500);
  };

  const target = channel === "email" ? defaultEmail : defaultPhone;
  const channelLabel = channel === "email" ? "email" : channel === "sms" ? "SMS" : "WhatsApp";

  if (phase === "verified") {
    return (
      <div className="max-w-md mx-auto text-center py-12 space-y-6 animate-scale-in">
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-full bg-gradient-electric flex items-center justify-center shadow-electric mx-auto">
            <CheckCircle2 className="w-12 h-12 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div className="absolute inset-0 rounded-full bg-gradient-electric blur-2xl opacity-50 -z-10 animate-pulse-glow" />
        </div>
        <div>
          <h3 className="font-display text-3xl font-bold mb-2">Identité vérifiée</h3>
          <p className="text-muted-foreground">Bienvenue {ownerName}. Redirection vers la réservation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Retour à l'identification
        </button>
      )}

      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-primary/30">
          <ShieldCheck className="w-4 h-4 text-primary-glow" />
          <span className="text-xs font-mono uppercase tracking-wider text-primary-glow">Vérification client Tesla</span>
        </div>
        <h3 className="font-display text-3xl font-bold">Sécurisons votre compte</h3>
        <p className="text-muted-foreground">Pour confirmer que vous êtes bien le titulaire, nous allons vous envoyer un code OTP.</p>
      </div>

      {phase === "select" && (
        <div className="glass border-gradient rounded-2xl p-6 space-y-4 animate-fade-in">
          <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Choisissez le canal d'envoi</div>

          <ChannelOption
            active={channel === "email"}
            onClick={() => setChannel("email")}
            icon={Mail}
            label="Email"
            value={defaultEmail}
            badge="Recommandé"
            hint={`Envoyé depuis ${SENDER_EMAIL}`}
          />
          <ChannelOption
            active={channel === "sms"}
            onClick={() => setChannel("sms")}
            icon={Phone}
            label="SMS"
            value={defaultPhone}
          />
          <ChannelOption
            active={channel === "whatsapp"}
            onClick={() => setChannel("whatsapp")}
            icon={MessageCircle}
            label="WhatsApp"
            value={defaultPhone}
          />

          <button
            onClick={sendCode}
            disabled={sending}
            className="w-full py-3.5 rounded-xl bg-gradient-electric text-primary-foreground font-semibold shadow-electric disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed hover:scale-[1.01] transition-transform flex items-center justify-center gap-2"
          >
            {sending ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Envoi en cours...</>
            ) : (
              <>Envoyer le code par {channelLabel}</>
            )}
          </button>
        </div>
      )}

      {phase === "code" && (
        <div className="glass border-gradient rounded-2xl p-8 space-y-6 animate-fade-in">
          <div className="text-center space-y-2">
            <div className="text-sm text-muted-foreground">Code envoyé par {channelLabel} à</div>
            <div className="font-mono text-lg text-primary-glow">{target}</div>
            {channel === "email" && (
              <div className="text-xs text-muted-foreground font-mono">
                Expéditeur : <span className="text-foreground">{SENDER_EMAIL}</span>
              </div>
            )}
          </div>

          {/* Démo : afficher le code généré */}
          <div className="glass rounded-xl p-3 border border-warning/30 text-center">
            <div className="text-[10px] font-mono uppercase tracking-wider text-warning mb-1">Mode démo · Code généré</div>
            <div className="font-mono text-2xl font-bold text-primary-glow tracking-[0.3em]">{generatedCode}</div>
          </div>

          <div className="flex justify-center gap-2">
            {code.map((c, i) => (
              <input
                key={i}
                ref={el => (inputsRef.current[i] = el)}
                value={c}
                onChange={e => handleCodeChange(i, e.target.value.replace(/\D/g, ''))}
                onKeyDown={e => handleKeyDown(i, e)}
                maxLength={1}
                inputMode="numeric"
                className={`w-12 h-14 sm:w-14 sm:h-16 text-center font-mono text-2xl font-bold rounded-xl bg-input/60 border-2 transition-all focus:outline-none ${
                  c ? 'border-primary text-primary-glow shadow-electric' : 'border-border focus:border-primary/60'
                }`}
              />
            ))}
          </div>

          {verifying && (
            <div className="flex items-center justify-center gap-2 text-primary-glow text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="font-mono">Vérification du code...</span>
            </div>
          )}

          <div className="text-center text-sm">
            {countdown > 0 ? (
              <span className="text-muted-foreground">Renvoyer le code dans <span className="font-mono text-foreground">{countdown}s</span></span>
            ) : (
              <button onClick={sendCode} className="text-primary-glow hover:underline">Renvoyer le code</button>
            )}
          </div>

          <button
            onClick={() => { setPhase("select"); setCode(["","","","","",""]); }}
            className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Changer de méthode d'envoi
          </button>
        </div>
      )}
    </div>
  );
};

interface ChannelOptionProps {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
  value: string;
  badge?: string;
  hint?: string;
}

const ChannelOption = ({ active, onClick, icon: Icon, label, value, badge, hint }: ChannelOptionProps) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
      active
        ? 'border-primary bg-primary/10 shadow-electric'
        : 'border-border bg-card/30 hover:border-primary/40 hover:bg-primary/5'
    }`}
  >
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
      active ? 'bg-gradient-electric text-primary-foreground' : 'bg-muted text-muted-foreground'
    }`}>
      <Icon className="w-5 h-5" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <span className="font-medium text-sm">{label}</span>
        {badge && <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-success/20 text-success">{badge}</span>}
      </div>
      <div className="text-xs text-muted-foreground truncate font-mono">{value}</div>
      {hint && <div className="text-[10px] text-muted-foreground/70 mt-0.5">{hint}</div>}
    </div>
    <div className={`w-5 h-5 rounded-full border-2 transition-all shrink-0 ${
      active ? 'border-primary bg-primary' : 'border-border'
    }`}>
      {active && <div className="w-full h-full rounded-full bg-primary-foreground scale-50" />}
    </div>
  </button>
);
