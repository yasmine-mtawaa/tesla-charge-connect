import { useState } from "react";
import { MapPin, Zap, Clock, Battery, Navigation } from "lucide-react";

export interface Station {
  id: string;
  name: string;
  city: string;
  available: number;
  total: number;
  power: number; // kW
  distance: number; // km
  x: number; // % position on map
  y: number;
  status: "available" | "busy" | "offline";
}

export const STATIONS: Station[] = [
  { id: "TUN-01", name: "Tunis City Mall",     city: "Tunis",      available: 6, total: 8,  power: 250, distance: 2.4,  x: 52, y: 22, status: "available" },
  { id: "TUN-02", name: "Lac 2 Supercharger",  city: "Tunis",      available: 2, total: 6,  power: 250, distance: 5.1,  x: 56, y: 28, status: "busy" },
  { id: "SOU-01", name: "Sousse Marina",       city: "Sousse",     available: 4, total: 4,  power: 150, distance: 142,  x: 64, y: 50, status: "available" },
  { id: "SFA-01", name: "Sfax Centrale",       city: "Sfax",       available: 0, total: 6,  power: 250, distance: 270,  x: 70, y: 70, status: "busy" },
  { id: "MON-01", name: "Monastir Aéroport",   city: "Monastir",   available: 3, total: 4,  power: 150, distance: 162,  x: 67, y: 55, status: "available" },
  { id: "BIZ-01", name: "Bizerte Port",        city: "Bizerte",    available: 0, total: 2,  power: 100, distance: 65,   x: 48, y: 12, status: "offline" },
  { id: "DJE-01", name: "Djerba Resort",       city: "Djerba",     available: 5, total: 6,  power: 250, distance: 510,  x: 78, y: 88, status: "available" },
  { id: "HAM-01", name: "Hammamet Yasmine",    city: "Hammamet",   available: 1, total: 4,  power: 150, distance: 65,   x: 58, y: 38, status: "busy" },
];

interface StationsMapProps {
  selected: Station | null;
  onSelect: (station: Station) => void;
}

export const StationsMap = ({ selected, onSelect }: StationsMapProps) => {
  return (
    <div className="grid lg:grid-cols-5 gap-6">
      {/* Map */}
      <div className="lg:col-span-3">
        <div className="relative aspect-[4/5] rounded-2xl glass border-gradient overflow-hidden">
          {/* Tunisia stylized SVG map */}
          <svg viewBox="0 0 100 120" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="mapGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary) / 0.15)" />
                <stop offset="100%" stopColor="hsl(var(--accent) / 0.05)" />
              </linearGradient>
              <pattern id="mapGrid" width="5" height="5" patternUnits="userSpaceOnUse">
                <path d="M 5 0 L 0 0 0 5" fill="none" stroke="hsl(var(--border) / 0.3)" strokeWidth="0.2" />
              </pattern>
            </defs>
            <rect width="100" height="120" fill="url(#mapGrid)" />
            {/* Approximate Tunisia shape */}
            <path
              d="M 45 8 Q 50 6, 55 9 L 60 14 Q 62 20, 60 26 L 65 32 Q 68 40, 66 48 L 70 55 Q 73 65, 70 72 L 72 80 Q 75 88, 73 95 L 76 105 Q 75 112, 70 110 L 60 105 Q 55 95, 56 88 L 52 78 Q 48 70, 50 60 L 46 50 Q 44 40, 47 32 L 44 22 Q 42 14, 45 8 Z"
              fill="url(#mapGrad)"
              stroke="hsl(var(--primary) / 0.5)"
              strokeWidth="0.3"
            />
          </svg>

          {/* Station pins */}
          {STATIONS.map(station => {
            const isSelected = selected?.id === station.id;
            const colorClass = station.status === "available" ? "bg-success" : station.status === "busy" ? "bg-warning" : "bg-destructive";
            return (
              <button
                key={station.id}
                onClick={() => onSelect(station)}
                style={{ left: `${station.x}%`, top: `${station.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-all ${isSelected ? 'z-20 scale-125' : 'z-10 hover:scale-110'}`}
              >
                <div className="relative">
                  {station.status === "available" && (
                    <span className={`absolute inset-0 rounded-full ${colorClass} animate-ping opacity-60`} />
                  )}
                  <span className={`relative block w-3.5 h-3.5 rounded-full ${colorClass} ring-2 ring-background shadow-lg`} />
                  {isSelected && (
                    <span className="absolute inset-0 -m-2 rounded-full border-2 border-primary-glow animate-pulse-glow" />
                  )}
                </div>
                <div className={`absolute left-1/2 -translate-x-1/2 top-5 whitespace-nowrap text-[10px] font-mono px-2 py-0.5 rounded glass border border-border transition-opacity ${
                  isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}>
                  {station.city}
                </div>
              </button>
            );
          })}

          {/* Legend */}
          <div className="absolute bottom-4 left-4 glass rounded-lg p-3 space-y-1.5 border border-border text-xs">
            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-success" /> Disponible</div>
            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-warning" /> Occupée</div>
            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-destructive" /> Hors-ligne</div>
          </div>
        </div>
      </div>

      {/* Station list */}
      <div className="lg:col-span-2 space-y-3 max-h-[600px] overflow-y-auto pr-2">
        <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground px-1 sticky top-0 glass-strong py-2 -mx-1">
          {STATIONS.length} stations · triées par distance
        </div>
        {STATIONS.sort((a, b) => a.distance - b.distance).map(station => {
          const isSelected = selected?.id === station.id;
          const isAvailable = station.status === "available";
          return (
            <button
              key={station.id}
              onClick={() => onSelect(station)}
              disabled={station.status === "offline"}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                isSelected
                  ? 'border-primary bg-primary/10 shadow-electric'
                  : 'border-border bg-card/40 hover:border-primary/40 hover:bg-primary/5'
              } ${station.status === "offline" ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-medium">{station.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" /> {station.city} · {station.distance} km
                  </div>
                </div>
                <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
                  isAvailable ? 'bg-success/20 text-success' :
                  station.status === "busy" ? 'bg-warning/20 text-warning' :
                  'bg-destructive/20 text-destructive'
                }`}>
                  {station.status}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-primary-glow" /> {station.power} kW</span>
                <span className="flex items-center gap-1"><Battery className="w-3 h-3 text-primary-glow" /> {station.available}/{station.total} libres</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
