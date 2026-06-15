import { Droplets, Thermometer, FlaskConical, Zap } from "lucide-react";
import type { Zone } from "@/lib/mockData";

const STATUS_STYLE: Record<string, { dot: string; badge: string; label: string }> = {
  optimal:    { dot: 'bg-emerald-400', badge: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', label: 'Optimal'      },
  low:        { dot: 'bg-amber-400 animate-pulse', badge: 'text-amber-400 bg-amber-400/10 border-amber-400/20', label: 'Low Moisture' },
  wet:        { dot: 'bg-blue-400',   badge: 'text-blue-400 bg-blue-400/10 border-blue-400/20',     label: 'Overwatered'  },
  irrigating: { dot: 'bg-cyan-400 animate-pulse', badge: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',  label: 'Irrigating'   },
};

interface Props { zone: Zone; onIrrigate?: (id: string) => void; compact?: boolean; }

export default function ZoneCard({ zone, onIrrigate, compact = false }: Props) {
  const s = STATUS_STYLE[zone.status];
  const moisturePct = zone.moisture;
  const barColor = zone.status === 'low' ? '#eab308' : zone.status === 'wet' ? '#60a5fa' : '#34d399';

  return (
    <div className={`p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors flex flex-col gap-3 ${zone.status === 'low' ? 'border-amber-400/20' : ''}`}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] text-white/40 uppercase tracking-widest font-semibold">{zone.name} · {zone.area}</p>
          <h3 className="text-base font-semibold text-white mt-0.5">{zone.crop}</h3>
        </div>
        <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${s.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
          {s.label}
        </span>
      </div>

      {/* Moisture bar */}
      <div>
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-white/40">Soil Moisture</span>
          <span className="text-white font-semibold">{moisturePct.toFixed(0)}%</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${moisturePct}%`, backgroundColor: barColor }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-white/20 mt-1">
          <span>Low {zone.threshold.low}%</span>
          <span>High {zone.threshold.high}%</span>
        </div>
      </div>

      {!compact && (
        <>
          {/* Sensor readings grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-xl bg-white/5 flex flex-col gap-1">
              <Thermometer className="w-3.5 h-3.5 text-white/30" />
              <p className="text-xs font-semibold text-white">{zone.temperature.toFixed(1)}°C</p>
              <p className="text-[10px] text-white/30">Temp</p>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 flex flex-col gap-1">
              <FlaskConical className="w-3.5 h-3.5 text-white/30" />
              <p className="text-xs font-semibold text-white">{zone.ph}</p>
              <p className="text-[10px] text-white/30">pH</p>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 flex flex-col gap-1">
              <Zap className="w-3.5 h-3.5 text-white/30" />
              <p className="text-xs font-semibold text-white">{zone.ec}</p>
              <p className="text-[10px] text-white/30">EC</p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-1 border-t border-white/5">
            <p className="text-[11px] text-white/30">Last irrigated {zone.lastIrrigated}</p>
            {onIrrigate && (
              <button
                onClick={() => onIrrigate(zone.id)}
                disabled={zone.status === 'wet' || zone.status === 'irrigating'}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-[#eab308]/10 text-[#eab308] border border-[#eab308]/20 hover:bg-[#eab308]/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <Droplets className="w-3 h-3" /> Irrigate
              </button>
            )}
          </div>
        </>
      )}

      {compact && (
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-white/30">Temp {zone.temperature.toFixed(1)}°C · pH {zone.ph}</p>
          <p className="text-[11px] text-white/30">{zone.lastIrrigated}</p>
        </div>
      )}
    </div>
  );
}
