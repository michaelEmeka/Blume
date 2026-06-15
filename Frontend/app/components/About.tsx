import { Fuel, TrendingUp, Shield } from "lucide-react";

const advantages = [
  {
    icon: Fuel,
    title: "30–45% Fuel Cost Reduction",
    desc: "Demand-driven pump operation replaces fixed daily schedules. A farmer running a 2HP pump daily spends ₦15,000–25,000/month on fuel,a significant portion of which Blume eliminates.",
  },
  {
    icon: TrendingUp,
    title: "15–25% Crop Yield Improvement",
    desc: "Precisely timed, sensor-driven irrigation across growth stages. No more overwatering causing root disease, no more underwatering during flowering and fruiting,the damage that can't be undone.",
  },
  {
    icon: Shield,
    title: "Near-Zero Livestock Water Losses",
    desc: "Automated trough management and anomaly alerting eliminates dehydration, heat stress, and production drops. 5–8 hours of manual pump and trough checking saved per farm every week.",
  },
];

export default function About() {
  return (
    <section id="about" className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center mb-16">
        <div className="text-[#eab308] text-xs font-bold uppercase tracking-widest mb-4">
          Why Blume
        </div>
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
          Your farm, finally working
          <br />
          <span className="text-[#eab308]">with real data,not guesswork</span>
        </h2>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Visual side — animated gradient panel */}
        <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-white/5 h-80 lg:h-auto lg:min-h-[420px]">
          <div className="absolute inset-0 bg-[#0d2416]" />
          <div className="absolute inset-0 dots-bg" />
          {/* Animated orbs */}
          <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-[#eab308]/10 rounded-full blur-3xl animate-breathe" />
          <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-[#00A8E8]/10 rounded-full blur-2xl animate-float" />
          {/* Center badge */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#eab308]/10 border border-[#eab308]/20 mb-4 animate-float">
                <TrendingUp className="w-10 h-10 text-[#eab308]" />
              </div>
              <p className="text-[#eab308] text-2xl font-bold">1 season</p>
              <p className="text-white/50 text-sm mt-1">Hardware Payback</p>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#06120b] to-transparent opacity-80" />
        </div>

        {/* Cards side */}
        <div className="space-y-4">
          {advantages.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex gap-4 p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-[#102418] flex items-center justify-center text-[#eab308] shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-[#a3b8ad]">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
