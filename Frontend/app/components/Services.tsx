import { Droplets, Cpu, Wifi, CloudRain } from "lucide-react";

const services = [
  {
    icon: Droplets,
    title: "Sense",
    desc: "Capacitive soil moisture sensors at root-zone depth per crop zone, ultrasonic level sensors on overhead tanks and livestock troughs. The farm gets real-time feedback for the first time — no guesswork, no schedule-based waste.",
    highlighted: false,
  },
  {
    icon: Cpu,
    title: "Automate",
    desc: "An ESP32 edge controller runs all automation logic locally. Moisture thresholds trigger zone-specific irrigation. Tanks refill on solar power. Troughs top up automatically. Dry-run protection fires before the pump takes damage. Internet outage changes nothing.",
    highlighted: true,
  },
  {
    icon: CloudRain,
    title: "Predict",
    desc: "Hourly rain probability forecasts via weather API. When rainfall is above 65% within 2 hours, irrigation is suppressed automatically — saving the pump run and preserving water. This alone eliminates 20–35% of wet-season pump cycles.",
    highlighted: false,
  },
  {
    icon: Wifi,
    title: "Monitor",
    desc: "A lightweight mobile dashboard shows every sensor, trough, tank, pump status, and daily consumption history from any smartphone. GSM module delivers SMS alerts and basic remote commands to rural farmers without reliable internet.",
    highlighted: false,
  },
];

export default function Services() {
  return (
    <section id="services" className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
      <div className="text-center mb-16">
        <div className="text-[#eab308] text-xs font-bold uppercase tracking-widest mb-4">
          How It Works
        </div>
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-6">
          Blume wraps around your existing
          <span className="text-[#eab308]">
            {" "}borehole-pump-tank
            <br />
            infrastructure
          </span>{" "}
          and adds the intelligence
          <br />
          layer that has always been missing
        </h2>
        <p className="text-[#a3b8ad] max-w-2xl mx-auto text-lg">
          No ripping out what you have. Blume makes your existing infrastructure
          intelligent,and keeps it working even when NEPA takes the light.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map(({ icon: Icon, title, desc, highlighted }) => (
          <div
            key={title}
            className={`p-8 rounded-[2rem] flex flex-col items-start ${
              highlighted
                ? "bg-gradient-to-b from-[#eab308]/10 to-transparent border border-[#eab308]/20"
                : "bg-gradient-to-b from-white/5 to-transparent border border-white/5"
            }`}
          >
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center text-[#eab308] mb-6 ${
                highlighted
                  ? "bg-[#eab308]/20 border border-[#eab308]/40"
                  : "bg-[#102418] border border-[#eab308]/20"
              }`}
            >
              <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
            <p className="text-sm text-[#a3b8ad] leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
