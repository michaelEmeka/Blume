import { Droplets, Cpu, DollarSign, Sprout, Zap, Activity } from "lucide-react";

const paths = [
  {
    title: "Crop & Field Irrigation",
    desc: "For smallholder farms managing maize, vegetables, cassava, tomatoes, and other crops across 1–10 hectares. Borehole-dependent, petrol pump users.",
    accent: "#00A8E8",
    accentBg: "bg-[#00A8E8]/10",
    accentBorder: "border-[#00A8E8]/20",
    accentText: "text-[#00A8E8]",
    hoverBorder: "hover:border-[#00A8E8]/40",
    hoverShadow: "hover:shadow-[0_0_40px_rgba(0,168,232,0.08)]",
    topBar: "bg-gradient-to-r from-transparent via-[#00A8E8] to-transparent",
    cta: "Deploy Crop Irrigation",
    items: [
      {
        icon: Zap,
        title: "Soil Moisture Sensing",
        desc: "Capacitive sensors at root-zone depth trigger irrigation only when actual moisture drops below threshold,no schedule, no guesswork, no wasted fuel.",
      },
      {
        icon: Droplets,
        title: "Automated Pump Control",
        desc: "ESP32 controller activates the pump for exactly as long as the soil needs. Dry-run protection prevents pump damage when tank or borehole is low.",
      },
      {
        icon: DollarSign,
        title: "30–45% Fuel Savings",
        desc: "Demand-driven pump operation replaces fixed daily schedules. A farmer spending ₦25,000/month on fuel sees payback within one growing season.",
      },
    ],
  },
  {
    title: "Livestock & Poultry Water",
    desc: "For farms managing poultry, goats, or cattle alongside crops. Automated trough management that prevents dehydration, heat stress, and animal losses.",
    accent: "#D4AF37",
    accentBg: "bg-[#D4AF37]/10",
    accentBorder: "border-[#D4AF37]/20",
    accentText: "text-[#D4AF37]",
    hoverBorder: "hover:border-[#D4AF37]/40",
    hoverShadow: "hover:shadow-[0_0_40px_rgba(212,175,55,0.08)]",
    topBar: "bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent",
    cta: "Deploy Livestock Water",
    items: [
      {
        icon: Activity,
        title: "Trough Level Monitoring",
        desc: "Ultrasonic sensors continuously monitor each trough. Refill activates automatically,animals never face a dry trough during peak afternoon heat.",
      },
      {
        icon: Cpu,
        title: "Anomaly Detection",
        desc: "When a trough depletes faster than baseline,signalling a leak, broken float, or unusual behaviour,the system alerts via dashboard and SMS instantly.",
      },
      {
        icon: DollarSign,
        title: "Near-Zero Animal Losses",
        desc: "Livestock consumption baselines track drinking behaviour over time. Early health indicators surface before losses in weight, milk, eggs, or animal deaths.",
      },
    ],
  },
];

export default function Ecosystem() {
  return (
    <section
      id="ecosystem"
      className="relative w-full bg-[#1B3022] py-24 overflow-hidden border-y border-[#D4AF37]/20"
    >
      {/* Grid dots */}
      <div className="absolute inset-0 dots-bg pointer-events-none" />
      {/* Glow blobs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#00A8E8]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#D4AF37]/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00A8E8]/10 border border-[#00A8E8]/20 text-xs font-bold text-[#00A8E8] tracking-widest mb-6">
            Choose your Blume ecosystem
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-[#E5E5E5] mb-6 leading-tight">
            The tailored path for{" "}
            <br />
            <span className="text-[#D4AF37]">your agricultural operation</span>
          </h2>
          <p className="text-[#E5E5E5]/80 text-lg leading-relaxed max-w-2xl mx-auto">
            Every farm has different challenges. Blume guides you toward the most
            appropriate path,crop irrigation, livestock water management, or both
            from one controller and one dashboard.
          </p>
        </div>

        {/* Two path cards */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {paths.map((path) => (
            <div
              key={path.title}
              className={`group relative p-8 md:p-10 rounded-[2rem] bg-[#0a140f] border border-white/10 ${path.hoverBorder} ${path.hoverShadow} transition-all duration-500 flex flex-col hover:-translate-y-2`}
            >
              {/* Top accent bar */}
              <div
                className={`absolute top-0 left-0 w-full h-1 ${path.topBar} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-[2rem]`}
              />
              <h3 className="text-2xl font-semibold text-[#E5E5E5] mb-3">{path.title}</h3>
              <p className="text-[#E5E5E5]/70 text-sm mb-8 leading-relaxed">{path.desc}</p>

              <div className="space-y-6 flex-grow mb-10">
                {path.items.map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex gap-4">
                    <div
                      className={`w-10 h-10 rounded-full ${path.accentBg} flex items-center justify-center ${path.accentText} shrink-0 mt-0.5 border ${path.accentBorder}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-[#E5E5E5] mb-1">{title}</h4>
                      <p className="text-[#E5E5E5]/60 text-sm leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <a
                href="#contact"
                className={`inline-flex items-center gap-2 text-sm font-semibold ${path.accentText} hover:gap-3 transition-all`}
              >
                {path.cta} →
              </a>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="grid md:grid-cols-3 gap-6 border-t border-white/5 pt-12">
          {[
            { icon: Droplets, text: "Works offline,core automation runs locally on the embedded controller, no internet required" },
            { icon: Cpu, text: "GSM fallback for rural farmers without smartphones,SMS alerts to any basic phone" },
            { icon: Sprout, text: "One controller, one dashboard, one installation for both crop and livestock water management" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#eab308]/10 border border-[#eab308]/20 flex items-center justify-center text-[#eab308] shrink-0 mt-0.5">
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-sm text-[#E5E5E5]/60 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
