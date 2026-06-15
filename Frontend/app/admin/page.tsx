"use client";
import { useState } from "react";
import {
  LayoutDashboard,
  MapPin,
  Users,
  CreditCard,
  Activity,
  Bell,
  ChevronLeft,
  Droplets,
  Search,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Package,
  Sprout,
  Building2,
} from "lucide-react";
import Image from "next/image";
import {
  mockFarms,
  mockAdminUsers,
  type FarmDevice,
  type AdminUser,
  type FarmTier,
  type DeviceStatus,
} from "@/lib/mockData";

// ─── Types ────────────────────────────────────────────────────────────────────

type AdminTab = "overview" | "farms" | "users" | "subscriptions" | "health";

// ─── Style maps ───────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<DeviceStatus, string> = {
  online: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  offline: "text-red-400 bg-red-400/10 border-red-400/20",
  warning: "text-amber-400 bg-amber-400/10 border-amber-400/20",
};
const STATUS_DOT: Record<DeviceStatus, string> = {
  online: "bg-emerald-400",
  offline: "bg-red-400",
  warning: "bg-amber-400 animate-pulse",
};
const TIER_STYLE: Record<FarmTier, string> = {
  Basic: "text-white/50 bg-white/5 border-white/10",
  Standard: "text-[#eab308] bg-[#eab308]/10 border-[#eab308]/20",
  Enterprise: "text-purple-400 bg-purple-400/10 border-purple-400/20",
};
const TIER_ICON: Record<FarmTier, React.ElementType> = {
  Basic: Package,
  Standard: Sprout,
  Enterprise: Building2,
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const navItems: { id: AdminTab; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "farms", label: "Farms", icon: MapPin },
  { id: "users", label: "Users", icon: Users },
  { id: "subscriptions", label: "Subscriptions", icon: CreditCard },
  { id: "health", label: "System Health", icon: Activity },
];

function AdminSidebar({
  active,
  onSelect,
}: {
  active: AdminTab;
  onSelect: (t: AdminTab) => void;
}) {
  return (
    <aside className="hidden md:flex w-56 shrink-0 flex-col h-screen bg-[#040c07] border-r border-white/5">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-white/5 flex items-center gap-2 shrink-0">
        <Image
          src="/logo.png"
          alt="Blume"
          width={100}
          height={33}
          className="object-contain"
          priority
        />{" "}
        <span className="text-[10px] text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
          Admin
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              active === id
                ? "bg-purple-500/10 text-purple-300 border border-purple-500/20"
                : "text-white/50 hover:text-white/90 hover:bg-white/5"
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-white/5 space-y-1 shrink-0">
        <a
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-white/80 hover:bg-white/5 transition-all"
        >
          <Droplets className="w-4 h-4" />
          <span>Farmer View</span>
        </a>
        <a
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-white/80 hover:bg-white/5 transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Site</span>
        </a>
      </div>
    </aside>
  );
}

// ─── Shared UI ────────────────────────────────────────────────────────────────

function TierBadge({ tier }: { tier: FarmTier }) {
  const Icon = TIER_ICON[tier];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${TIER_STYLE[tier]}`}
    >
      <Icon className="w-3 h-3" /> {tier}
    </span>
  );
}

function StatusBadge({ status }: { status: DeviceStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${STATUS_STYLE[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status]}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// ─── Sections ────────────────────────────────────────────────────────────────

function OverviewSection({
  farms,
  users,
}: {
  farms: FarmDevice[];
  users: AdminUser[];
}) {
  const online = farms.filter((f) => f.status === "online").length;
  const warning = farms.filter((f) => f.status === "warning").length;
  const offline = farms.filter((f) => f.status === "offline").length;
  const active = users.filter((u) => u.status === "active").length;
  const enterprise = farms.filter((f) => f.tier === "Enterprise").length;
  const standard = farms.filter((f) => f.tier === "Standard").length;
  const basic = farms.filter((f) => f.tier === "Basic").length;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Farms",
            value: farms.length,
            sub: `${online} online`,
            icon: MapPin,
            color: "text-purple-400",
          },
          {
            label: "Active Users",
            value: active,
            sub: `${users.length} total`,
            icon: Users,
            color: "text-[#eab308]",
          },
          {
            label: "Online Devices",
            value: online,
            sub: `${warning} warning`,
            icon: Wifi,
            color: "text-emerald-400",
          },
          {
            label: "Offline",
            value: offline,
            sub: "need attention",
            icon: WifiOff,
            color: offline > 0 ? "text-red-400" : "text-white/20",
          },
        ].map(({ label, value, sub, icon: Icon, color }) => (
          <div
            key={label}
            className="p-5 rounded-2xl bg-white/5 border border-white/5"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-white/40 uppercase tracking-widest font-semibold">
                {label}
              </p>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-[11px] text-white/30 mt-1">{sub}</p>
          </div>
        ))}
      </div>

      {/* Tier breakdown */}
      <div className="grid lg:grid-cols-3 gap-4">
        {[
          {
            tier: "Enterprise" as FarmTier,
            count: enterprise,
            rev: enterprise * 15000,
            icon: Building2,
            color: "text-purple-400",
            bg: "bg-purple-400/5 border-purple-400/10",
          },
          {
            tier: "Standard" as FarmTier,
            count: standard,
            rev: standard * 3000,
            icon: Sprout,
            color: "text-[#eab308]",
            bg: "bg-[#eab308]/5 border-[#eab308]/10",
          },
          {
            tier: "Basic" as FarmTier,
            count: basic,
            rev: 0,
            icon: Package,
            color: "text-white/40",
            bg: "bg-white/5 border-white/5",
          },
        ].map(({ tier, count, rev, icon: Icon, color, bg }) => (
          <div
            key={tier}
            className={`p-5 rounded-2xl border ${bg} flex items-center gap-4`}
          >
            <div
              className={`w-12 h-12 rounded-full bg-current/10 flex items-center justify-center border border-current/20 ${color}`}
            >
              <Icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className={`text-base font-bold ${color}`}>{tier}</p>
              <p className="text-white/40 text-sm">
                {count} active farm{count !== 1 ? "s" : ""}
              </p>
            </div>
            <div className="text-right">
              <p className={`text-sm font-bold ${color}`}>
                {rev > 0 ? `₦${rev.toLocaleString()}` : "—"}
              </p>
              <p className="text-[10px] text-white/20">MRR</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent farms */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white/60 uppercase tracking-widest">
            Recent Farms
          </h3>
          <span className="text-xs text-white/30">{farms.length} total</span>
        </div>
        <div className="space-y-3">
          {farms.slice(0, 4).map((f) => (
            <div
              key={f.id}
              className="flex items-center gap-4 py-2.5 border-b border-white/5"
            >
              <StatusBadge status={f.status} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {f.farmName}
                </p>
                <p className="text-xs text-white/30">
                  {f.owner} · {f.location}
                </p>
              </div>
              <TierBadge tier={f.tier} />
              <p className="text-xs text-white/30 hidden sm:block">
                {f.lastSeen}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FarmsSection({ farms }: { farms: FarmDevice[] }) {
  const [search, setSearch] = useState("");
  const filtered = farms.filter(
    (f) =>
      f.farmName.toLowerCase().includes(search.toLowerCase()) ||
      f.owner.toLowerCase().includes(search.toLowerCase()) ||
      f.location.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Farms</h2>
          <p className="text-sm text-white/40 mt-1">
            {farms.length} registered devices
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search farms..."
            className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/20 w-48"
          />
        </div>
      </div>
      <div className="rounded-2xl bg-white/5 border border-white/5 overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[1fr_1fr_auto_auto_auto_auto] gap-4 px-5 py-3 border-b border-white/5 text-[11px] text-white/30 uppercase tracking-widest font-semibold">
          <span>Farm</span>
          <span>Location</span>
          <span>Zones</span>
          <span>Tier</span>
          <span>Status</span>
          <span>Last Seen</span>
        </div>
        {filtered.map((f, i) => (
          <div
            key={f.id}
            className={`grid grid-cols-[1fr_1fr_auto_auto_auto_auto] gap-4 items-center px-5 py-4 text-sm border-b border-white/5 hover:bg-white/3 transition-colors ${i === filtered.length - 1 ? "border-none" : ""}`}
          >
            <div>
              <p className="font-medium text-white">{f.farmName}</p>
              <p className="text-xs text-white/30">{f.owner}</p>
            </div>
            <p className="text-white/60 truncate">{f.location}</p>
            <p className="text-white/60 text-center">{f.zones}</p>
            <TierBadge tier={f.tier} />
            <StatusBadge status={f.status} />
            <p className="text-white/30 text-xs">{f.lastSeen}</p>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="px-5 py-8 text-center text-sm text-white/30">
            No farms match your search.
          </div>
        )}
      </div>
    </div>
  );
}

function UsersSection({ users }: { users: AdminUser[] }) {
  const [search, setSearch] = useState("");
  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.farmName.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Users</h2>
          <p className="text-sm text-white/40 mt-1">
            {users.filter((u) => u.status === "active").length} active ·{" "}
            {users.length} total
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/20 w-48"
          />
        </div>
      </div>
      <div className="rounded-2xl bg-white/5 border border-white/5 overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-white/5 text-[11px] text-white/30 uppercase tracking-widest font-semibold">
          <span>User</span>
          <span>Farm</span>
          <span>Tier</span>
          <span>Status</span>
          <span>Last Login</span>
        </div>
        {filtered.map((u, i) => (
          <div
            key={u.id}
            className={`grid grid-cols-[1fr_1fr_auto_auto_auto] gap-4 items-center px-5 py-4 text-sm border-b border-white/5 hover:bg-white/3 transition-colors ${i === filtered.length - 1 ? "border-none" : ""}`}
          >
            <div>
              <p className="font-medium text-white">{u.name}</p>
              <p className="text-xs text-white/30">{u.email}</p>
            </div>
            <p className="text-white/60 truncate">{u.farmName}</p>
            <TierBadge tier={u.tier} />
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${u.status === "active" ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" : "text-white/30 bg-white/5 border-white/10"}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${u.status === "active" ? "bg-emerald-400" : "bg-white/20"}`}
              />
              {u.status.charAt(0).toUpperCase() + u.status.slice(1)}
            </span>
            <p className="text-white/30 text-xs">{u.lastLogin}</p>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="px-5 py-8 text-center text-sm text-white/30">
            No users match your search.
          </div>
        )}
      </div>
    </div>
  );
}

function SubscriptionsSection({ farms }: { farms: FarmDevice[] }) {
  const tiers: FarmTier[] = ["Enterprise", "Standard", "Basic"];
  const tierDetails: Record<
    FarmTier,
    { mrr: number; features: string[]; color: string }
  > = {
    Enterprise: {
      mrr: 15000,
      features: [
        "Soil telemetry sensing",
        "Advanced analytics",
        "Yield forecasting",
        "Data insights",
      ],
      color: "border-purple-400/20 bg-purple-400/5",
    },
    Standard: {
      mrr: 3000,
      features: [
        "IoT enabled",
        "Mobile dashboard",
        "Weather intelligence",
        "Cloud subscription",
      ],
      color: "border-[#eab308]/20 bg-[#eab308]/5",
    },
    Basic: {
      mrr: 0,
      features: [
        "Water storage management",
        "Sensor-driven irrigation",
        "SMS alerts",
        "Offline operation",
      ],
      color: "border-white/10 bg-white/5",
    },
  };

  const totalMRR = farms.reduce((sum, f) => {
    return sum + (tierDetails[f.tier]?.mrr ?? 0);
  }, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Subscriptions</h2>
          <p className="text-sm text-white/40 mt-1">
            Monthly recurring revenue across all active cloud subscribers.
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-emerald-400">
            ₦{totalMRR.toLocaleString()}
          </p>
          <p className="text-xs text-white/30">Total MRR</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {tiers.map((tier) => {
          const count = farms.filter((f) => f.tier === tier).length;
          const details = tierDetails[tier];
          const Icon = TIER_ICON[tier];
          return (
            <div
              key={tier}
              className={`p-6 rounded-2xl border ${details.color} flex flex-col gap-4`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-5 h-5 ${TIER_STYLE[tier].split(" ")[0]}`} />
                <h3 className="font-semibold text-white">{tier}</h3>
                <span className="ml-auto text-2xl font-bold text-white">
                  {count}
                </span>
              </div>
              <div>
                <p className="text-xs text-white/30 mb-1">Monthly per farm</p>
                <p
                  className={`text-xl font-bold ${TIER_STYLE[tier].split(" ")[0]}`}
                >
                  {details.mrr > 0
                    ? `₦${details.mrr.toLocaleString()}`
                    : "Free"}
                </p>
              </div>
              <div>
                <p className="text-xs text-white/30 mb-2">Total MRR</p>
                <p className="text-base font-semibold text-white">
                  {details.mrr > 0
                    ? `₦${(count * details.mrr).toLocaleString()}`
                    : "—"}
                </p>
              </div>
              <ul className="space-y-1.5">
                {details.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2 text-xs text-white/50"
                  >
                    <CheckCircle className="w-3 h-3 text-emerald-400/60 shrink-0" />{" "}
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Revenue chart */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
        <h3 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-4">
          Revenue Projection (12 months)
        </h3>
        <div className="flex items-end gap-3 h-24">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => {
            const growth = 1 + (m - 1) * 0.15;
            const h = Math.min(
              100,
              ((totalMRR * growth) / (totalMRR * 2.7)) * 100,
            );
            const isNow = m === 6;
            return (
              <div key={m} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t-sm transition-all ${isNow ? "bg-[#eab308]" : "bg-white/10"}`}
                  style={{ height: `${h}%` }}
                />
                <p className="text-[9px] text-white/20">{m}</p>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-white/30 mt-2">
          Projected at 15% MoM growth with current installation rate
        </p>
      </div>
    </div>
  );
}

function HealthSection({ farms }: { farms: FarmDevice[] }) {
  const checks = [
    { name: "Cloud API", status: "ok", latency: "42ms", uptime: "99.98%" },
    { name: "MQTT Broker", status: "ok", latency: "12ms", uptime: "99.95%" },
    { name: "Weather API", status: "ok", latency: "180ms", uptime: "99.80%" },
    { name: "SMS Gateway", status: "ok", latency: "—", uptime: "99.90%" },
    {
      name: "Opay Payment Gateway",
      status: "ok",
      latency: "95ms",
      uptime: "99.85%",
    },
    {
      name: "BigQuery Pipeline",
      status: "warn",
      latency: "320ms",
      uptime: "98.20%",
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">System Health</h2>
        <p className="text-sm text-white/40 mt-1">
          Real-time status of all Blume cloud services and integrations.
        </p>
      </div>

      {/* Services */}
      <div className="rounded-2xl bg-white/5 border border-white/5 overflow-hidden mb-6">
        <div className="px-5 py-3 border-b border-white/5 text-[11px] text-white/30 uppercase tracking-widest font-semibold grid grid-cols-[1fr_auto_auto_auto]">
          <span>Service</span>
          <span>Latency</span>
          <span>Uptime</span>
          <span>Status</span>
        </div>
        {checks.map((c, i) => (
          <div
            key={c.name}
            className={`grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-5 py-4 text-sm border-b border-white/5 ${i === checks.length - 1 ? "border-none" : ""}`}
          >
            <div className="flex items-center gap-2">
              {c.status === "ok" ? (
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              )}
              <span className="text-white font-medium">{c.name}</span>
            </div>
            <span className="text-white/40 text-xs">{c.latency}</span>
            <span
              className={`text-xs font-semibold ${c.status === "ok" ? "text-emerald-400" : "text-amber-400"}`}
            >
              {c.uptime}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${c.status === "ok" ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" : "text-amber-400 bg-amber-400/10 border-amber-400/20"}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${c.status === "ok" ? "bg-emerald-400" : "bg-amber-400 animate-pulse"}`}
              />
              {c.status === "ok" ? "Operational" : "Degraded"}
            </span>
          </div>
        ))}
      </div>

      {/* Device health */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/5">
        <h3 className="text-sm font-semibold text-white/60 uppercase tracking-widest mb-4">
          Device Fleet
        </h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {[
            {
              label: "Online",
              count: farms.filter((f) => f.status === "online").length,
              color: "text-emerald-400",
              bg: "bg-emerald-400/10 border-emerald-400/15",
            },
            {
              label: "Warning",
              count: farms.filter((f) => f.status === "warning").length,
              color: "text-amber-400",
              bg: "bg-amber-400/10 border-amber-400/15",
            },
            {
              label: "Offline",
              count: farms.filter((f) => f.status === "offline").length,
              color: "text-red-400",
              bg: "bg-red-400/10 border-red-400/15",
            },
          ].map(({ label, count, color, bg }) => (
            <div
              key={label}
              className={`p-4 rounded-xl border ${bg} text-center`}
            >
              <p className={`text-2xl font-bold ${color}`}>{count}</p>
              <p className="text-xs text-white/40 mt-1">{label}</p>
            </div>
          ))}
        </div>
        <div className="h-3 bg-white/5 rounded-full overflow-hidden flex">
          {[
            {
              pct:
                (farms.filter((f) => f.status === "online").length /
                  farms.length) *
                100,
              color: "#34d399",
            },
            {
              pct:
                (farms.filter((f) => f.status === "warning").length /
                  farms.length) *
                100,
              color: "#eab308",
            },
            {
              pct:
                (farms.filter((f) => f.status === "offline").length /
                  farms.length) *
                100,
              color: "#f87171",
            },
          ].map(({ pct, color }, i) => (
            <div
              key={i}
              className="h-full transition-all"
              style={{ width: `${pct}%`, backgroundColor: color }}
            />
          ))}
        </div>
        <p className="text-[11px] text-white/30 mt-2">
          {farms.filter((f) => f.status === "online").length}/{farms.length}{" "}
          devices online
        </p>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [tab, setTab] = useState<AdminTab>("overview");
  const farms = mockFarms;
  const users = mockAdminUsers;

  const SECTIONS: Record<AdminTab, React.ReactNode> = {
    overview: <OverviewSection farms={farms} users={users} />,
    farms: <FarmsSection farms={farms} />,
    users: <UsersSection users={users} />,
    subscriptions: <SubscriptionsSection farms={farms} />,
    health: <HealthSection farms={farms} />,
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#06120b]">
      <AdminSidebar active={tab} onSelect={setTab} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <div className="shrink-0 h-12 border-b border-white/5 bg-[#06120b]/80 backdrop-blur flex items-center px-6 gap-4">
          <div className="flex items-center gap-2 flex-1">
            <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
            <p className="text-xs text-white/30 uppercase tracking-widest font-semibold">
              Admin · {tab}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-white/20" />
            <div className="w-7 h-7 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-[11px] font-semibold text-purple-300">
              A
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">{SECTIONS[tab]}</main>
      </div>
    </div>
  );
}
