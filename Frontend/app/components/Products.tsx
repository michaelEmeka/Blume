import { Droplets, Battery, Thermometer, Cpu, Wifi, BarChart3, Package, Sprout, Building2 } from "lucide-react";

const coreComponents = [
  { icon: Thermometer,  title: "Soil Moisture Sensors",    desc: "Capacitive sensors at root-zone depth per crop zone. Trigger irrigation only when moisture drops below threshold,no schedule, no guesswork." },
  { icon: Droplets,     title: "Water Level Sensors",      desc: "Ultrasonic sensors on overhead storage tanks and livestock troughs. Automate refill cycles and trigger low-water and overflow alerts." },
  { icon: Cpu,          title: "ESP32 Controller",         desc: "Microcontroller running all automation logic locally. Sensor reading, pump relay control, threshold logic, and cloud sync when connectivity is available." },
  { icon: Battery,      title: "Pump Relay + Solar Power", desc: "Safe relay interface for petrol or electric pump control with dry-run protection. 12V solar panel and battery for off-grid and NEPA-unreliable environments." },
  { icon: BarChart3,    title: "Cloud Data Logging",       desc: "Periodic sync of sensor readings, pump runtime, and water consumption to cloud storage. Historical analytics, trend monitoring, and remote farm data access." },
  { icon: Wifi,         title: "Mobile Dashboard + GSM",   desc: "Lightweight web app on any smartphone,real-time sensors, pump status, threshold config, remote control. GSM module for SMS alerts to any basic phone." },
];

const kits = [
  {
    icon: Package,
    title: "Blume Basic",
    tag: "Rural Farmers",
    desc: "Core smart irrigation and water storage management with SMS alerts. Designed for rural farmers who need reliable automation without a smartphone or stable internet.",
    features: ["Smart water storage management", "Sensor-driven irrigation", "SMS alerts & remote commands", "Fully offline autonomous operation"],
    recurring: "Optional: Monthly SMS subscription",
  },
  {
    icon: Sprout,
    title: "Blume Standard",
    tag: "Micro–Medium Farms",
    desc: "Everything in Basic plus IoT enablement, a mobile dashboard, and weather-aware scheduling. For farms that want maximum yield and data visibility.",
    features: ["IoT enabled + mobile dashboard", "Weather intelligence (rain suppression)", "Cloud data logging & history", "Irrigation insights per crop zone"],
    recurring: "Optional: ISP data + Cloud subscription",
    highlighted: true,
  },
  {
    icon: Building2,
    title: "Blume Enterprise",
    tag: "Enterprise & Medium Farms",
    desc: "Full soil telemetry suite with advanced cloud analytics, yield probability forecasting, and topological farm data mapping for data-driven decision making.",
    features: ["Soil moisture, temp, pH & EC sensors", "Advanced soil data analysis", "Yield forecasting & trend analytics", "GCP BigQuery cloud integration"],
    recurring: "Optional: ISP data + Soil Insights subscription",
  },
];

function ProductCard({ icon: Icon, title, desc }: { icon: typeof Droplets; title: string; desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md hover:border-[#eab308]/20 hover:bg-white/8 transition-colors">
      <div className="w-10 h-10 rounded-full bg-[#102418] flex items-center justify-center text-[#eab308] mb-4">
        <Icon className="w-4 h-4" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-[#a3b8ad]">{desc}</p>
    </div>
  );
}

export default function Products() {
  return (
    <>
      {/* Core components section */}
      <section id="technology" className="relative w-full py-24 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[#06120b]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#1B3022]/40 rounded-full blur-[120px] animate-breathe" />
        </div>
        {/* Fade edges */}
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#06120b] to-transparent z-0 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#06120b] to-transparent z-0 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-[#eab308] mb-4">
              Core System Components
            </h2>
            <p className="text-[#a3b8ad] max-w-2xl mx-auto text-lg">
              Every Blume installation is built from these components,wrapping around
              your existing borehole-pump-tank infrastructure.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreComponents.map((p) => <ProductCard key={p.title} {...p} />)}
          </div>
        </div>
      </section>

      {/* Tiers section */}
      <section id="tiers" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <div className="text-[#eab308] text-xs font-bold uppercase tracking-widest mb-4">Tailored for every farmer</div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4">
            Choose your <span className="text-[#eab308]">Blume tier</span>
          </h2>
          <p className="text-[#a3b8ad] max-w-2xl mx-auto text-lg">
            From rural SMS-only deployments to full enterprise soil analytics — every tier runs offline autonomously and scales as your farm grows.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {kits.map(({ icon: Icon, title, tag, desc, features, recurring, highlighted }) => (
            <div
              key={title}
              className={`relative p-8 rounded-[2rem] flex flex-col border transition-colors ${
                highlighted
                  ? "bg-gradient-to-b from-[#eab308]/10 to-transparent border-[#eab308]/30"
                  : "bg-white/5 border-white/5 hover:border-white/10"
              }`}
            >
              {highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#eab308] text-black text-[10px] font-bold uppercase tracking-widest rounded-full">
                  Most Popular
                </div>
              )}
              <div className="w-12 h-12 rounded-full bg-[#102418] flex items-center justify-center text-[#eab308] mb-4 border border-[#eab308]/20">
                <Icon className="w-5 h-5" />
              </div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#eab308]/70 mb-1">{tag}</div>
              <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
              <p className="text-sm text-[#a3b8ad] mb-6 leading-relaxed flex-grow">{desc}</p>
              <ul className="space-y-2 mb-6">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-white/70">
                    <span className="text-[#eab308] mt-0.5 shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <p className="text-[11px] text-white/30 border-t border-white/5 pt-4">{recurring}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
