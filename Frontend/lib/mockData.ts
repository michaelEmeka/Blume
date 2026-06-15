// ─── Types ────────────────────────────────────────────────────────────────────

export type ZoneStatus = 'irrigating' | 'optimal' | 'low' | 'wet';
export type AlertType  = 'warning' | 'info' | 'success' | 'error';
export type FarmTier   = 'Basic' | 'Standard' | 'Enterprise';
export type DeviceStatus = 'online' | 'offline' | 'warning';

export interface Zone {
  id: string;
  name: string;
  crop: string;
  moisture: number;
  temperature: number;
  threshold: { low: number; high: number };
  status: ZoneStatus;
  lastIrrigated: string;
  area: string;
  ph: number;
  ec: number;
}

export interface TankData {
  level: number;
  capacityL: number;
  pumpActive: boolean;
  lastRefilled: string;
  dailyUsageL: number;
}

export interface WeatherHour {
  time: string;
  rainProb: number;
  temp: number;
  icon: 'sunny' | 'cloudy' | 'rain' | 'partly';
}

export interface WeatherData {
  condition: string;
  temp: number;
  humidity: number;
  rainProb2h: number;
  forecast: WeatherHour[];
  suppressedToday: number;
  lastSuppressed: string | null;
}

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  zone?: string;
}

export interface SolarData {
  batteryPct: number;
  solarInputW: number;
  estimatedRuntime: string;
  totalTodayWh: number;
  chargingStatus: 'charging' | 'discharging' | 'full';
}

export interface ConsumptionDay {
  date: string;
  litersUsed: number;
  pumpMinutes: number;
  suppressedEvents: number;
}

export interface FarmDevice {
  id: string;
  farmName: string;
  owner: string;
  tier: FarmTier;
  zones: number;
  status: DeviceStatus;
  location: string;
  lastSeen: string;
  installedDate: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  farmName: string;
  tier: FarmTier;
  joined: string;
  status: 'active' | 'inactive';
  lastLogin: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

export const mockZones: Zone[] = [
  {
    id: 'zone-a', name: 'Zone A', crop: 'Tomato',
    moisture: 42, temperature: 28.4,
    threshold: { low: 40, high: 80 }, status: 'optimal',
    lastIrrigated: '2h ago', area: '0.5 ha', ph: 6.4, ec: 1.8,
  },
  {
    id: 'zone-b', name: 'Zone B', crop: 'Maize',
    moisture: 27, temperature: 29.1,
    threshold: { low: 35, high: 80 }, status: 'low',
    lastIrrigated: '8h ago', area: '0.8 ha', ph: 6.1, ec: 1.4,
  },
  {
    id: 'zone-c', name: 'Zone C', crop: 'Pepper',
    moisture: 61, temperature: 27.8,
    threshold: { low: 50, high: 85 }, status: 'optimal',
    lastIrrigated: '45m ago', area: '0.3 ha', ph: 6.7, ec: 2.1,
  },
  {
    id: 'zone-d', name: 'Zone D', crop: 'Leafy Veg',
    moisture: 88, temperature: 26.5,
    threshold: { low: 60, high: 85 }, status: 'wet',
    lastIrrigated: '12h ago', area: '0.2 ha', ph: 6.9, ec: 1.6,
  },
];

export const mockTank: TankData = {
  level: 67, capacityL: 5000,
  pumpActive: false, lastRefilled: '3h ago', dailyUsageL: 1840,
};

export const mockWeather: WeatherData = {
  condition: 'Partly Cloudy', temp: 31, humidity: 68, rainProb2h: 18,
  forecast: [
    { time: 'Now',  rainProb: 18, temp: 31, icon: 'partly' },
    { time: '2pm',  rainProb: 12, temp: 33, icon: 'sunny'  },
    { time: '4pm',  rainProb: 35, temp: 31, icon: 'partly' },
    { time: '6pm',  rainProb: 70, temp: 28, icon: 'rain'   },
    { time: '8pm',  rainProb: 55, temp: 26, icon: 'rain'   },
    { time: '10pm', rainProb: 20, temp: 24, icon: 'cloudy' },
  ],
  suppressedToday: 2,
  lastSuppressed: '6:12 AM',
};

export const mockAlerts: Alert[] = [
  { id: 'a1', type: 'warning', title: 'Low Moisture — Zone B', message: 'Soil moisture in Zone B (Maize) dropped to 27%, below the 35% threshold. Irrigation pending weather check.', time: '14 min ago', read: false, zone: 'Zone B' },
  { id: 'a2', type: 'info',    title: 'Irrigation Suppressed', message: 'Zone C irrigation was suppressed at 6:12 AM — rain probability was 72%. Pump run avoided, water preserved.', time: '4h ago', read: false, zone: 'Zone C' },
  { id: 'a3', type: 'success', title: 'Tank Refilled', message: 'Overhead tank reached 100% capacity at 9:45 AM. Solar pump deactivated automatically.', time: '3h ago', read: true },
  { id: 'a4', type: 'info',    title: 'Irrigation Suppressed', message: 'Zone A irrigation suppressed at 6:00 AM — rain probability was 68%.', time: '6h ago', read: true, zone: 'Zone A' },
  { id: 'a5', type: 'success', title: 'Zone C Irrigation Complete', message: 'Zone C reached target moisture (61%). Pump deactivated after 18 minutes.', time: '45m ago', read: false, zone: 'Zone C' },
];

export const mockSolar: SolarData = {
  batteryPct: 87, solarInputW: 245,
  estimatedRuntime: '14h 20m', totalTodayWh: 1840, chargingStatus: 'charging',
};

export const mockConsumption: ConsumptionDay[] = [
  { date: 'Jun 5',  litersUsed: 2100, pumpMinutes: 42, suppressedEvents: 1 },
  { date: 'Jun 6',  litersUsed: 1950, pumpMinutes: 38, suppressedEvents: 0 },
  { date: 'Jun 7',  litersUsed: 800,  pumpMinutes: 16, suppressedEvents: 3 },
  { date: 'Jun 8',  litersUsed: 2300, pumpMinutes: 46, suppressedEvents: 0 },
  { date: 'Jun 9',  litersUsed: 1600, pumpMinutes: 32, suppressedEvents: 2 },
  { date: 'Jun 10', litersUsed: 1200, pumpMinutes: 24, suppressedEvents: 1 },
  { date: 'Jun 11', litersUsed: 1840, pumpMinutes: 37, suppressedEvents: 2 },
];

export const mockFarms: FarmDevice[] = [
  { id: 'f1', farmName: 'Adeyemi Farm',   owner: 'Chukwudi Adeyemi', tier: 'Standard',   zones: 4,  status: 'online',  location: 'Kaduna, North-West',  lastSeen: 'Just now', installedDate: 'Jan 2026' },
  { id: 'f2', farmName: 'Green Valley',   owner: 'Fatima Musa',      tier: 'Enterprise', zones: 8,  status: 'online',  location: 'Kano, North-West',    lastSeen: '5m ago',   installedDate: 'Feb 2026' },
  { id: 'f3', farmName: 'Okafor Poultry', owner: 'Emmanuel Okafor',  tier: 'Basic',      zones: 2,  status: 'warning', location: 'Enugu, South-East',   lastSeen: '1h ago',   installedDate: 'Mar 2026' },
  { id: 'f4', farmName: 'Sahel Farm',     owner: 'Ibrahim Garba',    tier: 'Standard',   zones: 5,  status: 'online',  location: 'Sokoto, North-West',  lastSeen: '2m ago',   installedDate: 'Feb 2026' },
  { id: 'f5', farmName: 'Delta Farms',    owner: 'Ngozi Eze',        tier: 'Enterprise', zones: 12, status: 'online',  location: 'Delta, South-South',  lastSeen: 'Just now', installedDate: 'Jan 2026' },
  { id: 'f6', farmName: 'Benue Agro',     owner: 'Terkimbi Iorver',  tier: 'Basic',      zones: 2,  status: 'offline', location: 'Benue, Middle Belt',  lastSeen: '2d ago',   installedDate: 'Apr 2026' },
];

export const mockAdminUsers: AdminUser[] = [
  { id: 'u1', name: 'Chukwudi Adeyemi', email: 'c.adeyemi@gmail.com', farmName: 'Adeyemi Farm',   tier: 'Standard',   joined: 'Jan 2026', status: 'active',   lastLogin: '2h ago'   },
  { id: 'u2', name: 'Fatima Musa',      email: 'f.musa@yahoo.com',    farmName: 'Green Valley',   tier: 'Enterprise', joined: 'Feb 2026', status: 'active',   lastLogin: '5m ago'   },
  { id: 'u3', name: 'Emmanuel Okafor',  email: 'e.okafor@gmail.com',  farmName: 'Okafor Poultry', tier: 'Basic',      joined: 'Mar 2026', status: 'active',   lastLogin: '3h ago'   },
  { id: 'u4', name: 'Ibrahim Garba',    email: 'i.garba@gmail.com',   farmName: 'Sahel Farm',     tier: 'Standard',   joined: 'Feb 2026', status: 'active',   lastLogin: '30m ago'  },
  { id: 'u5', name: 'Ngozi Eze',        email: 'n.eze@farm.ng',       farmName: 'Delta Farms',    tier: 'Enterprise', joined: 'Jan 2026', status: 'active',   lastLogin: 'Just now' },
  { id: 'u6', name: 'Terkimbi Iorver',  email: 't.iorver@gmail.com',  farmName: 'Benue Agro',     tier: 'Basic',      joined: 'Apr 2026', status: 'inactive', lastLogin: '2d ago'   },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function zoneStatusLabel(status: ZoneStatus) {
  return { optimal: 'Optimal', low: 'Low Moisture', wet: 'Overwatered', irrigating: 'Irrigating' }[status];
}

export function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}
