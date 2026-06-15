"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Droplets, Zap, Bell, Cloud, AlertTriangle, CheckCircle,
  Info, Power, CloudRain, Sun, CloudSun, Wind, Battery,
  Thermometer, RefreshCw, ChevronRight, TrendingDown,
} from "lucide-react";
import DashSidebar, { type DashTab } from "./_components/DashSidebar";
import ZoneCard from "./_components/ZoneCard";
import TankGauge from "./_components/TankGauge";
import ConsumptionChart from "./_components/ConsumptionChart";
import {
  mockZones, mockTank, mockWeather, mockAlerts, mockSolar, mockConsumption,
  clamp, type Zone, type Alert, type TankData,
} from "@/lib/mockData";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function deriveStatus(z: Zone): Zone["status"] {
  if (z.moisture < z.threshold.low) return "low";
  if (z.moisture > z.threshold.high) return "wet";
  return z.status === "irrigating" ? "irrigating" : "optimal";
}

const ALERT_ICON: Record<Alert["type"], React.ElementType> = {
  warning: AlertTriangle, info: Info, success: CheckCircle, error: AlertTriangle,
};
const ALERT_COLOR: Record<Alert["type"], string> = {
  warning: "text-amber-400 bg-amber-400/10 border-amber-400/15",
  info:    "text-blue-400 bg-blue-400/10 border-blue-400/15",
  success: "text-emerald-400 bg-emerald-400/10 border-emerald-400/15",
  error:   "text-red-400 bg-red-400/10 border-red-400/15",
};
const WEATHER_ICON: Record<string, React.ElementType> = {
  sunny: Sun, cloudy: Cloud, rain: CloudRain, partly: CloudSun,
};

function SectionHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      {sub && <p className="text-sm text-white/40 mt-1">{sub}</p>}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [tab, setTab]     = useState<DashTab>("overview");
  const [zones, setZones] = useState(mockZones.map(z => ({ ...z })));
  const [tank, setTank]   = useState<TankData>({ ...mockTank });
  const [pump, setPump]   = useState(false);
  const [alerts, setAlerts]     = useState(mockAlerts.map(a => ({ ...a })));
  const [lastSync, setLastSync] = useState("Just now");
  const [irrigating, setIrrigating] = useState<Record<string, boolean>>({});

  // ── Live data simulation ──────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => {
      setZones(prev => prev.map(z => {
        const newMoisture = clamp(z.moisture + (Math.random() - 0.48) * 1.6, 5, 98);
        const newTemp     = parseFloat(clamp(z.temperature + (Math.random() - 0.5) * 0.3, 20, 40).toFixed(1));
        return { ...z, moisture: parseFloat(newMoisture.toFixed(1)), temperature: newTemp, status: deriveStatus({ ...z, moisture: newMoisture }) };
      }));
      setTank(prev => ({ ...prev, level: clamp(prev.level + (Math.random() - 0.45) * 0.8, 5, 100) }));
      setLastSync("Just now");
    }, 4000);
    return () => clearInterval(id);
  }, []);

  // ── Actions ───────────────────────────────────────────────────────
  const triggerIrrigate = useCallback((zoneId: string) => {
    setIrrigating(prev => ({ ...prev, [zoneId]: true }));
    setZones(prev => prev.map(z => z.id === zoneId ? { ...z, status: "irrigating" as const } : z));
    setTimeout(() => {
      setIrrigating(prev => ({ ...prev, [zoneId]: false }));
      setZones(prev => prev.map(z => z.id === zoneId ? { ...z, status: "optimal" as const, lastIrrigated: "Just now" } : z));
    }, 5000);
  }, []);

  const markAllRead = () => setAlerts(prev => prev.map(a => ({ ...a, read: true })));
  const markRead    = (id: string) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));

  const unread = alerts.filter(a => !a.read).length;
  const weather = mockWeather;
  const solar   = mockSolar;
  const today   = mockConsumption[mockConsumption.length - 1];

  // ─── Sections ─────────────────────────────────────────────────────

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Crop Zones",     value: `${zones.length}`,                             sub: `${zones.filter(z => z.status === "low").length} need attention`,   icon: TrendingDown,  color: "text-[#eab308]" },
          { label: "Active Alerts",  value: `${unread}`,                                   sub: `${alerts.length} total today`,                                     icon: Bell,          color: unread > 0 ? "text-amber-400" : "text-emerald-400" },
          { label: "Tank Level",     value: `${tank.level.toFixed(0)}%`,                   sub: `${Math.round(tank.level / 100 * tank.capacityL).toLocaleString()} L available`, icon: Droplets, color: tank.level < 30 ? "text-orange-400" : "text-blue-400" },
          { label: "Pump Runs Saved",value: `${weather.suppressedToday}`,                  sub: "by weather suppression today",                                     icon: CloudRain,     color: "text-cyan-400"  },
        ].map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-white/40 uppercase tracking-widest font-semibold">{label}</p>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-[11px] text-white/30 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Zone grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white/70 uppercase tracking-widest">Zone Status</h3>
          <button onClick={() => setTab("zones")} className="text-xs text-[#eab308] hover:text-[#fbbf24] flex items-center gap-1">View all <ChevronRight className="w-3 h-3" /></button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {zones.map(z => <ZoneCard key={z.id} zone={z} compact />)}
        </div>
      </div>

      {/* Weather + Alerts row */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Weather summary */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white/70 uppercase tracking-widest">Weather</h3>
            <button onClick={() => setTab("weather")} className="text-xs text-[#eab308] flex items-center gap-1">Full forecast <ChevronRight className="w-3 h-3" /></button>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#eab308]/10 border border-[#eab308]/20 flex items-center justify-center">
              <CloudSun className="w-6 h-6 text-[#eab308]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{weather.temp}°C</p>
              <p className="text-sm text-white/50">{weather.condition}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-sm font-semibold text-white">{weather.humidity}%</p>
              <p className="text-[11px] text-white/30">Humidity</p>
            </div>
          </div>
          <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm ${weather.rainProb2h >= 65 ? "bg-blue-400/10 border border-blue-400/20 text-blue-300" : "bg-white/5 border border-white/5 text-white/50"}`}>
            <CloudRain className="w-4 h-4 shrink-0" />
            <span>{weather.rainProb2h}% rain probability next 2h</span>
            {weather.rainProb2h >= 65 && <span className="ml-auto text-xs font-semibold text-blue-300">Irrigation suppressed</span>}
          </div>
          {weather.suppressedToday > 0 && (
            <p className="text-[11px] text-white/30 mt-2">{weather.suppressedToday} pump runs suppressed today · last at {weather.lastSuppressed}</p>
          )}
        </div>

        {/* Recent alerts */}
        <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white/70 uppercase tracking-widest">Recent Alerts</h3>
            <button onClick={() => setTab("alerts")} className="text-xs text-[#eab308] flex items-center gap-1">All alerts <ChevronRight className="w-3 h-3" /></button>
          </div>
          <div className="space-y-2">
            {alerts.slice(0, 4).map(a => {
              const Icon = ALERT_ICON[a.type];
              return (
                <div key={a.id} className={`flex items-start gap-3 px-3 py-2.5 rounded-xl border text-sm ${ALERT_COLOR[a.type]} ${a.read ? "opacity-50" : ""}`}>
                  <Icon className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{a.title}</p>
                    <p className="text-[11px] opacity-60 mt-0.5">{a.time}</p>
                  </div>
                  {!a.read && <span className="w-2 h-2 rounded-full bg-current shrink-0 mt-1.5" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Solar strip */}
      <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#eab308]/10 border border-[#eab308]/20 flex items-center justify-center">
            <Battery className="w-5 h-5 text-[#eab308]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">{solar.batteryPct}% Battery</p>
            <p className="text-[11px] text-white/30">{solar.chargingStatus === "charging" ? "Charging" : "Discharging"} · est. {solar.estimatedRuntime}</p>
          </div>
        </div>
        <div className="h-8 w-px bg-white/5 hidden sm:block" />
        <div>
          <p className="text-sm font-semibold text-white">{solar.solarInputW}W</p>
          <p className="text-[11px] text-white/30">Current solar input</p>
        </div>
        <div className="h-8 w-px bg-white/5 hidden sm:block" />
        <div>
          <p className="text-sm font-semibold text-white">{solar.totalTodayWh.toLocaleString()} Wh</p>
          <p className="text-[11px] text-white/30">Generated today</p>
        </div>
        <div className="h-8 w-px bg-white/5 hidden sm:block" />
        <div>
          <p className="text-sm font-semibold text-emerald-400">{today.pumpMinutes} min</p>
          <p className="text-[11px] text-white/30">Pump runtime today</p>
        </div>
        <button onClick={() => setTab("solar")} className="ml-auto text-xs text-[#eab308] flex items-center gap-1">Details <ChevronRight className="w-3 h-3" /></button>
      </div>
    </div>
  );

  const renderZones = () => (
    <div>
      <SectionHeader title="Crop Zones" sub="Real-time soil data across all monitored zones. Readings update every 4 seconds." />
      <div className="grid sm:grid-cols-2 gap-5">
        {zones.map(z => (
          <ZoneCard key={z.id} zone={z} onIrrigate={triggerIrrigate} />
        ))}
      </div>
    </div>
  );

  const renderWater = () => (
    <div>
      <SectionHeader title="Tank & Pump Control" sub="Monitor and manage your overhead tank and pump system." />
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Tank visual */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center gap-4">
          <h3 className="text-sm font-semibold text-white/60 uppercase tracking-widest self-start">Water Level</h3>
          <TankGauge level={tank.level} capacityL={tank.capacityL} />
          <div className="w-full space-y-2 text-sm">
            {[
              ["Capacity",    `${tank.capacityL.toLocaleString()} L`],
              ["Last Refill", tank.lastRefilled],
              ["Used Today",  `${tank.dailyUsageL.toLocaleString()} L`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-2 border-b border-white/5">
                <span className="text-white/40">{k}</span>
                <span className="text-white font-medium">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pump control */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-5">
          <h3 className="text-sm font-semibold text-white/60 uppercase tracking-widest">Pump Control</h3>
          {/* Main pump toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${pump ? "bg-emerald-400/10 border-emerald-400/20 text-emerald-400" : "bg-white/5 border-white/10 text-white/30"}`}>
                <Power className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Main Pump</p>
                <p className={`text-xs ${pump ? "text-emerald-400" : "text-white/30"}`}>{pump ? "Running" : "Standby"}</p>
              </div>
            </div>
            <button
              onClick={() => setPump(p => !p)}
              className={`relative w-12 h-6 rounded-full transition-colors ${pump ? "bg-emerald-500" : "bg-white/10"}`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${pump ? "left-6" : "left-0.5"}`} />
            </button>
          </div>

          {/* Per-zone triggers */}
          <div className="space-y-2">
            <p className="text-xs text-white/30 uppercase tracking-widest font-semibold">Zone Irrigation</p>
            {zones.map(z => (
              <div key={z.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                <div>
                  <p className="text-sm font-medium text-white">{z.name} — {z.crop}</p>
                  <p className="text-xs text-white/30">{z.moisture.toFixed(0)}% moisture</p>
                </div>
                <button
                  onClick={() => triggerIrrigate(z.id)}
                  disabled={z.status === "wet" || z.status === "irrigating"}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    z.status === "irrigating"
                      ? "bg-cyan-400/10 text-cyan-400 border border-cyan-400/20 cursor-not-allowed"
                      : z.status === "wet"
                      ? "bg-white/5 text-white/20 cursor-not-allowed"
                      : "bg-[#eab308]/10 text-[#eab308] border border-[#eab308]/20 hover:bg-[#eab308]/20"
                  }`}
                >
                  {z.status === "irrigating" ? "Irrigating…" : z.status === "wet" ? "Wet" : "Start"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Daily stats */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-white/60 uppercase tracking-widest">Today&apos;s Stats</h3>
          <div className="space-y-4">
            {[
              { label: "Water Used",          value: `${tank.dailyUsageL.toLocaleString()} L`,      color: "text-blue-400"    },
              { label: "Pump Runtime",         value: `${today.pumpMinutes} min`,                    color: "text-[#eab308]"  },
              { label: "Suppressed Pump Runs", value: `${today.suppressedEvents}`,                   color: "text-cyan-400"   },
              { label: "Estimated Fuel Saved", value: today.suppressedEvents > 0 ? `~₦${today.suppressedEvents * 800}` : "₦0", color: "text-emerald-400" },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-sm text-white/50">{label}</span>
                <span className={`text-base font-bold ${color}`}>{value}</span>
              </div>
            ))}
          </div>
          <div className="mt-auto p-4 rounded-xl bg-emerald-400/5 border border-emerald-400/10">
            <p className="text-xs text-emerald-400 font-semibold mb-1">Fuel ROI This Month</p>
            <p className="text-2xl font-bold text-emerald-400">₦{(today.suppressedEvents * 800 * 30).toLocaleString()}</p>
            <p className="text-[11px] text-white/30 mt-1">Estimated savings vs. schedule-based pumping</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWeather = () => (
    <div>
      <SectionHeader title="Weather Intelligence" sub="Hourly rain forecasts auto-suppress irrigation when probability exceeds 65%." />
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Current + rain */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#eab308]/10 border border-[#eab308]/20 flex items-center justify-center">
              <CloudSun className="w-8 h-8 text-[#eab308]" />
            </div>
            <div>
              <p className="text-4xl font-bold text-white">{weather.temp}°C</p>
              <p className="text-white/50">{weather.condition}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Humidity",  value: `${weather.humidity}%`,    icon: Droplets },
              { label: "Wind",      value: "12 km/h",                 icon: Wind     },
              { label: "Rain (2h)", value: `${weather.rainProb2h}%`,  icon: CloudRain},
              { label: "UV Index",  value: "7 High",                  icon: Sun      },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
                <Icon className="w-4 h-4 text-white/30" />
                <div>
                  <p className="text-sm font-semibold text-white">{value}</p>
                  <p className="text-[11px] text-white/30">{label}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Threshold indicator */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-white/50">Rain probability</span>
              <span className={weather.rainProb2h >= 65 ? "text-blue-400 font-semibold" : "text-white/50"}>{weather.rainProb2h}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-blue-400 transition-all" style={{ width: `${weather.rainProb2h}%` }} />
            </div>
            <div className="flex justify-between text-[10px] text-white/20 mt-1">
              <span>0%</span>
              <span className="text-amber-400">65% threshold</span>
              <span>100%</span>
            </div>
            <p className={`text-xs mt-2 font-medium ${weather.rainProb2h >= 65 ? "text-blue-400" : "text-white/30"}`}>
              {weather.rainProb2h >= 65 ? "Irrigation is currently suppressed" : "Below threshold — irrigation allowed"}
            </p>
          </div>
        </div>

        {/* 6-hour forecast + suppression log */}
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-4">6-Hour Forecast</h3>
            <div className="grid grid-cols-3 gap-3">
              {weather.forecast.map(h => {
                const Icon = WEATHER_ICON[h.icon] ?? CloudSun;
                const suppress = h.rainProb >= 65;
                return (
                  <div key={h.time} className={`p-3 rounded-xl flex flex-col items-center gap-1.5 border ${suppress ? "bg-blue-400/5 border-blue-400/15" : "bg-white/5 border-white/5"}`}>
                    <p className="text-xs text-white/40">{h.time}</p>
                    <Icon className={`w-5 h-5 ${suppress ? "text-blue-400" : "text-white/50"}`} />
                    <p className="text-sm font-semibold text-white">{h.temp}°</p>
                    <p className={`text-[11px] font-semibold ${h.rainProb >= 65 ? "text-blue-400" : "text-white/30"}`}>{h.rainProb}%</p>
                    {suppress && <span className="text-[9px] text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded-full">Suppressed</span>}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-4">Today&apos;s Suppression Log</h3>
            <div className="space-y-3">
              {[
                { time: "6:12 AM", zone: "Zone C", saved: "~₦800", reason: "72% rain probability" },
                { time: "6:00 AM", zone: "Zone A", saved: "~₦800", reason: "68% rain probability" },
              ].map(({ time, zone, saved, reason }) => (
                <div key={time} className="flex items-start gap-3 p-3 rounded-xl bg-blue-400/5 border border-blue-400/10">
                  <CloudRain className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-white">{zone} irrigation skipped at {time}</p>
                    <p className="text-[11px] text-white/30">{reason} · {saved} fuel saved</p>
                  </div>
                </div>
              ))}
              <p className="text-xs text-white/30 text-center pt-1">{weather.suppressedToday} pump runs saved today</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAlerts = () => (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Alerts</h2>
          <p className="text-sm text-white/40 mt-1">{unread} unread · {alerts.length} total</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="text-xs font-semibold text-[#eab308] hover:text-[#fbbf24] border border-[#eab308]/20 px-3 py-1.5 rounded-lg hover:bg-[#eab308]/5 transition-colors">
            Mark all read
          </button>
        )}
      </div>
      <div className="space-y-3">
        {alerts.map(a => {
          const Icon = ALERT_ICON[a.type];
          return (
            <div key={a.id} onClick={() => markRead(a.id)} className={`flex gap-4 p-5 rounded-2xl border cursor-pointer transition-all ${ALERT_COLOR[a.type]} ${a.read ? "opacity-50 hover:opacity-70" : "hover:opacity-90"}`}>
              <div className="w-10 h-10 rounded-full bg-current/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-sm">{a.title}</p>
                  {!a.read && <span className="w-2 h-2 rounded-full bg-current shrink-0 mt-1.5" />}
                </div>
                <p className="text-sm opacity-70 mt-1 leading-relaxed">{a.message}</p>
                <div className="flex items-center gap-3 mt-2">
                  <p className="text-xs opacity-50">{a.time}</p>
                  {a.zone && <span className="text-xs bg-current/10 px-2 py-0.5 rounded-full">{a.zone}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderHistory = () => {
    const totalWeek  = mockConsumption.reduce((s, d) => s + d.litersUsed, 0);
    const avgDay     = Math.round(totalWeek / mockConsumption.length);
    const peakDay    = mockConsumption.reduce((max, d) => d.litersUsed > max.litersUsed ? d : max);
    const totalSaved = mockConsumption.reduce((s, d) => s + d.suppressedEvents, 0);
    return (
      <div>
        <SectionHeader title="Consumption History" sub="Last 7 days of water usage, pump runtime, and weather-suppressed events." />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total This Week",  value: `${totalWeek.toLocaleString()} L`,  color: "text-blue-400"    },
            { label: "Daily Average",    value: `${avgDay.toLocaleString()} L`,     color: "text-[#eab308]"  },
            { label: "Peak Day",         value: peakDay.date,                       color: "text-white"      },
            { label: "Pump Runs Saved",  value: `${totalSaved}`,                    color: "text-cyan-400"   },
          ].map(({ label, value, color }) => (
            <div key={label} className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <p className="text-[11px] text-white/30 uppercase tracking-widest font-semibold mb-2">{label}</p>
              <p className={`text-xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>
        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 mb-6">
          <h3 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-4">Daily Water Consumption</h3>
          <ConsumptionChart data={mockConsumption} height={140} />
        </div>
        <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
          <h3 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-4">Daily Breakdown</h3>
          <div className="space-y-2">
            {[...mockConsumption].reverse().map((d, i) => (
              <div key={d.date} className={`grid grid-cols-4 gap-4 py-3 text-sm border-b border-white/5 ${i === 0 ? "text-white" : "text-white/60"}`}>
                <span className="font-medium">{i === 0 ? `${d.date} (Today)` : d.date}</span>
                <span className="text-right">{d.litersUsed.toLocaleString()} L</span>
                <span className="text-right">{d.pumpMinutes} min pump</span>
                <span className={`text-right text-xs ${d.suppressedEvents > 0 ? "text-cyan-400" : "text-white/20"}`}>{d.suppressedEvents > 0 ? `${d.suppressedEvents} suppressed` : "—"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderSolar = () => (
    <div>
      <SectionHeader title="Solar & Power" sub="System power status, battery state, and energy generation overview." />
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Battery gauge */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center gap-4">
          <h3 className="text-sm font-semibold text-white/60 uppercase tracking-widest self-start">Battery Status</h3>
          {/* Arc gauge */}
          <div className="relative w-40 h-20 overflow-hidden">
            <svg viewBox="0 0 160 80" className="w-full">
              <path d="M 10 80 A 70 70 0 0 1 150 80" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" strokeLinecap="round" />
              <path d="M 10 80 A 70 70 0 0 1 150 80" fill="none"
                stroke={solar.batteryPct > 50 ? "#34d399" : solar.batteryPct > 20 ? "#eab308" : "#f97316"}
                strokeWidth="12" strokeLinecap="round"
                strokeDasharray={`${(solar.batteryPct / 100) * 219} 219`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
              <p className="text-3xl font-bold text-white">{solar.batteryPct}%</p>
            </div>
          </div>
          <div className={`text-sm font-semibold px-3 py-1.5 rounded-full border ${
            solar.chargingStatus === "charging" ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" : "text-amber-400 bg-amber-400/10 border-amber-400/20"
          }`}>
            {solar.chargingStatus === "charging" ? "⚡ Charging" : "🔋 Discharging"}
          </div>
          <div className="w-full space-y-3">
            {[
              ["Estimated Runtime",  solar.estimatedRuntime],
              ["Generated Today",    `${solar.totalTodayWh.toLocaleString()} Wh`],
              ["Solar Input",        `${solar.solarInputW} W`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-2 border-b border-white/5 text-sm">
                <span className="text-white/40">{k}</span>
                <span className="text-white font-medium">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Solar input gauge */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-5">
          <h3 className="text-sm font-semibold text-white/60 uppercase tracking-widest">Solar Input</h3>
          <div className="flex items-end gap-3">
            <p className="text-5xl font-bold text-[#eab308]">{solar.solarInputW}</p>
            <p className="text-xl text-white/40 mb-1">W</p>
          </div>
          <div>
            <div className="h-3 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-[#eab308] transition-all" style={{ width: `${(solar.solarInputW / 400) * 100}%` }} />
            </div>
            <div className="flex justify-between text-[11px] text-white/20 mt-1">
              <span>0W</span>
              <span>Max 400W</span>
            </div>
          </div>
          <div className="mt-auto space-y-3">
            {[
              { label: "Submersible Pump",  power: "0W (standby)", active: false },
              { label: "Booster Pump",      power: "0W (standby)", active: false },
              { label: "Control System",    power: "8W",           active: true  },
              { label: "Sensor Nodes",      power: "2W each × 4",  active: true  },
            ].map(({ label, power, active }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-white/5 text-sm">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${active ? "bg-emerald-400" : "bg-white/10"}`} />
                  <span className="text-white/60">{label}</span>
                </div>
                <span className={`text-xs font-medium ${active ? "text-white" : "text-white/20"}`}>{power}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Energy today */}
        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-white/60 uppercase tracking-widest">Today&apos;s Energy</h3>
          <div className="p-5 rounded-xl bg-[#eab308]/5 border border-[#eab308]/10">
            <p className="text-xs text-[#eab308] font-semibold uppercase tracking-widest mb-2">Total Generated</p>
            <p className="text-4xl font-bold text-[#eab308]">{solar.totalTodayWh.toLocaleString()}</p>
            <p className="text-white/40 text-sm mt-1">Watt-hours</p>
          </div>
          <div className="space-y-3">
            {[
              { label: "Used for pumping",       wh: today.pumpMinutes * 40, pct: 42 },
              { label: "Control & sensors",      wh: 120,                    pct: 7  },
              { label: "Stored in battery",      wh: 980,                    pct: 51 },
            ].map(({ label, wh, pct }) => (
              <div key={label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/50">{label}</span>
                  <span className="text-white/70">{wh} Wh ({pct}%)</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#eab308] rounded-full" style={{ width: `${pct}%`, opacity: 0.6 }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-auto p-4 rounded-xl bg-emerald-400/5 border border-emerald-400/10">
            <p className="text-xs text-emerald-400 font-semibold mb-1">CO₂ Avoided</p>
            <p className="text-2xl font-bold text-emerald-400">{(solar.totalTodayWh / 1000 * 0.5).toFixed(2)} kg</p>
            <p className="text-[11px] text-white/30 mt-1">vs. equivalent petrol generator output</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div>
      <SectionHeader title="Settings" sub="Configure thresholds, notifications, and system preferences." />
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-5">
          <h3 className="text-sm font-semibold text-white/60 uppercase tracking-widest">Irrigation Thresholds</h3>
          {zones.map(z => (
            <div key={z.id}>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/70">{z.name} — {z.crop}</span>
                <span className="text-white/40">{z.threshold.low}% – {z.threshold.high}%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-[#eab308]/30 relative" style={{ marginLeft: `${z.threshold.low}%`, width: `${z.threshold.high - z.threshold.low}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
          <h3 className="text-sm font-semibold text-white/60 uppercase tracking-widest">Notifications</h3>
          {[
            ["SMS Alerts",                   true ],
            ["Push Notifications",           true ],
            ["Daily Summary",                true ],
            ["Irrigation Suppression Alerts",true ],
            ["Low Tank Alerts",              true ],
            ["Weekly Report Email",          false],
          ].map(([label, on]) => (
            <div key={label as string} className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-sm text-white/70">{label as string}</span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${on ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" : "text-white/20 bg-white/5 border-white/5"}`}>{on ? "On" : "Off"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const SECTIONS: Record<DashTab, React.ReactNode> = {
    overview: renderOverview(),
    zones:    renderZones(),
    water:    renderWater(),
    weather:  renderWeather(),
    alerts:   renderAlerts(),
    history:  renderHistory(),
    solar:    renderSolar(),
    settings: renderSettings(),
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#06120b]">
      <DashSidebar active={tab} onSelect={setTab} alertCount={unread} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <div className="shrink-0 h-14 md:h-12 border-b border-white/5 bg-[#06120b]/80 backdrop-blur flex items-center px-6 gap-4 mt-14 md:mt-0">
          <p className="text-xs text-white/30 uppercase tracking-widest font-semibold flex-1">
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-white/20">
            <RefreshCw className="w-3 h-3" />
            {lastSync}
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {SECTIONS[tab]}
        </main>
      </div>
    </div>
  );
}
