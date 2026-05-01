import { useState } from "react";
import { StationsMap, Station } from "@/components/StationsMap";
import { Calendar, Clock, Zap, Check, Battery } from "lucide-react";

interface ReservationStepProps {
  vehicleInfo: string;
  onConfirm: () => void;
  onBack?: () => void;
}

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00", "18:00", "19:00",
];

const DURATIONS = [
  { label: "30 min", minutes: 30, kwh: 30 },
  { label: "45 min", minutes: 45, kwh: 50 },
  { label: "60 min", minutes: 60, kwh: 75 },
  { label: "90 min", minutes: 90, kwh: 100 },
];

export const ReservationStep = ({ vehicleInfo, onConfirm, onBack }: ReservationStepProps) => {
  const [station, setStation] = useState<Station | null>(null);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [slot, setSlot] = useState<string | null>(null);
  const [duration, setDuration] = useState(DURATIONS[1]);
  const [confirmed, setConfirmed] = useState(false);

  const canBook = station && slot;
  const totalPrice = (duration.kwh * 0.45).toFixed(2);

  if (confirmed) {
    return (
      <div className="max-w-md mx-auto text-center py-12 space-y-6 animate-scale-in">
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-full bg-gradient-electric flex items-center justify-center shadow-electric mx-auto">
            <Check className="w-14 h-14 text-primary-foreground" strokeWidth={3} />
          </div>
          <div className="absolute inset-0 rounded-full bg-gradient-electric blur-2xl opacity-50 -z-10 animate-pulse-glow" />
        </div>
        <div className="space-y-2">
          <h3 className="font-display text-3xl font-bold">Réservation confirmée</h3>
          <p className="text-muted-foreground">Votre borne vous attend à {station?.name}.</p>
        </div>
        <div className="glass border-gradient rounded-2xl p-6 text-left space-y-3 font-mono text-sm">
          <Row label="Référence" value={`#TES-${Date.now().toString().slice(-6)}`} />
          <Row label="Station" value={station!.name} />
          <Row label="Date" value={date} />
          <Row label="Créneau" value={`${slot} · ${duration.label}`} />
          <Row label="Énergie" value={`${duration.kwh} kWh`} />
          <Row label="Total" value={`${totalPrice} TND`} highlight />
        </div>
        <button onClick={onConfirm} className="text-sm text-primary-glow hover:underline">
          Nouvelle réservation
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>←</span> Retour à la vérification
        </button>
      )}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-success/30">
          <Check className="w-4 h-4 text-success" />
          <span className="text-xs font-mono uppercase tracking-wider text-success">{vehicleInfo}</span>
        </div>
        <h3 className="font-display text-3xl font-bold">Choisissez votre <span className="text-gradient">borne</span></h3>
        <p className="text-muted-foreground">Sélectionnez une station, un créneau et la durée de charge.</p>
      </div>

      <StationsMap selected={station} onSelect={setStation} />

      {station && (
        <div className="glass border-gradient rounded-2xl p-6 space-y-6 animate-fade-in">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-primary-glow mb-1">Station sélectionnée</div>
              <div className="font-display text-xl font-bold">{station.name}</div>
              <div className="text-sm text-muted-foreground">{station.city} · {station.power} kW · {station.available} bornes libres</div>
            </div>
            <div className="flex items-center gap-2 text-xs text-success font-mono">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse-glow" /> ONLINE
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" /> Date
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 rounded-xl bg-input/60 border border-border focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Battery className="w-3.5 h-3.5" /> Durée de charge
              </label>
              <div className="grid grid-cols-4 gap-2">
                {DURATIONS.map(d => (
                  <button
                    key={d.minutes}
                    onClick={() => setDuration(d)}
                    className={`py-3 rounded-xl text-sm font-mono transition-all ${
                      duration.minutes === d.minutes
                        ? 'bg-gradient-electric text-primary-foreground shadow-electric'
                        : 'bg-input/60 border border-border hover:border-primary/40'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" /> Créneau horaire
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {TIME_SLOTS.map((s, i) => {
                const isBooked = i === 2 || i === 5 || i === 8;
                return (
                  <button
                    key={s}
                    disabled={isBooked}
                    onClick={() => setSlot(s)}
                    className={`py-2.5 rounded-lg text-sm font-mono transition-all ${
                      slot === s
                        ? 'bg-gradient-electric text-primary-foreground shadow-electric'
                        : isBooked
                        ? 'bg-muted/30 text-muted-foreground/40 line-through cursor-not-allowed'
                        : 'bg-input/60 border border-border hover:border-primary/40'
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border flex-wrap gap-4">
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Total estimé</div>
              <div className="font-display text-3xl font-bold text-gradient">{totalPrice} <span className="text-base">TND</span></div>
              <div className="text-xs text-muted-foreground font-mono mt-1">{duration.kwh} kWh · 0.45 TND/kWh</div>
            </div>
            <button
              disabled={!canBook}
              onClick={() => setConfirmed(true)}
              className="px-8 py-3.5 rounded-xl bg-gradient-electric text-primary-foreground font-semibold shadow-electric disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed hover:scale-[1.02] transition-transform flex items-center gap-2"
            >
              <Zap className="w-4 h-4" fill="currentColor" />
              Confirmer la réservation
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Row = ({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) => (
  <div className="flex items-center justify-between">
    <span className="text-muted-foreground text-xs uppercase tracking-wider">{label}</span>
    <span className={highlight ? "text-primary-glow font-bold text-base" : ""}>{value}</span>
  </div>
);
