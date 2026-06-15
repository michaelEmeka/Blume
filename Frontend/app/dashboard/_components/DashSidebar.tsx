"use client";
import { useState } from "react";
import {
  LayoutDashboard,
  Sprout,
  Droplets,
  Cloud,
  Bell,
  BarChart2,
  Zap,
  Settings,
  ChevronLeft,
  Menu,
  X,
  Shield,
} from "lucide-react";
import Image from "next/image";

export type DashTab =
  | "overview"
  | "zones"
  | "water"
  | "weather"
  | "alerts"
  | "history"
  | "solar"
  | "settings";

interface Props {
  active: DashTab;
  onSelect: (t: DashTab) => void;
  alertCount: number;
}

const items: { id: DashTab; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "zones", label: "Crop Zones", icon: Sprout },
  { id: "water", label: "Tank & Pump", icon: Droplets },
  { id: "weather", label: "Weather", icon: Cloud },
  { id: "alerts", label: "Alerts", icon: Bell },
  { id: "history", label: "History", icon: BarChart2 },
  { id: "solar", label: "Solar & Power", icon: Zap },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function DashSidebar({ active, onSelect, alertCount }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-white/5 flex items-center gap-2 shrink-0">
        <Image
          src="/logo.png"
          alt="Blume"
          width={100}
          height={33}
          className="object-contain"
          priority
        />
        <span className="ml-auto text-[10px] text-[#eab308] bg-[#eab308]/10 border border-[#eab308]/20 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
          Live
        </span>
      </div>

      {/* Farm name */}
      <div className="px-5 py-3 border-b border-white/5 shrink-0">
        <p className="text-[11px] text-white/30 uppercase tracking-widest font-semibold">
          Farm
        </p>
        <p className="text-sm text-white/80 font-medium mt-0.5">Adeyemi Farm</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {items.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          const badge = id === "alerts" && alertCount > 0 ? alertCount : null;
          return (
            <button
              key={id}
              onClick={() => {
                onSelect(id);
                setMobileOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-[#eab308]/10 text-[#eab308] border border-[#eab308]/20"
                  : "text-white/50 hover:text-white/90 hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{label}</span>
              {badge && (
                <span className="ml-auto text-[10px] bg-orange-500/20 text-orange-400 border border-orange-500/20 px-1.5 py-0.5 rounded-full font-bold">
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom links */}
      <div className="px-3 py-4 border-t border-white/5 space-y-1 shrink-0">
        <a
          href="/admin"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-white/80 hover:bg-white/5 transition-all"
        >
          <Shield className="w-4 h-4" />
          <span>Admin Panel</span>
        </a>
        <a
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-white/80 hover:bg-white/5 transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Site</span>
        </a>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 shrink-0 flex-col h-screen bg-[#040c07] border-r border-white/5">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-[#040c07]/95 backdrop-blur border-b border-white/5 flex items-center px-4 gap-3">
        <div className="flex items-center flex-1">
          <Image
            src="/blume-logo.png"
            alt="Blume"
            width={84}
            height={26}
            className="object-contain"
            priority
          />
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 text-white/60 hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-[#040c07] border-r border-white/5 flex flex-col">
            <div className="flex items-center justify-between px-4 py-4 border-b border-white/5">
              <Image
                src="/blume-logo.png"
                alt="Blume"
                width={84}
                height={26}
                className="object-contain"
              />
              <button
                onClick={() => setMobileOpen(false)}
                className="text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <SidebarContent />
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
