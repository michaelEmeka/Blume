const members = [
  {
    name: "Michael",
    role: "Team Lead — Embedded Systems & Electronics",
    desc: "Hardware design of the ESP32-based solar-powered water level monitoring and automatic refill control system. Firmware and IoT Backend Development.",
    initials: "M",
  },
  {
    name: "Thomas",
    role: "DevOps & Cloud Engineering",
    desc: "Cloud infrastructure, data pipeline architecture, remote monitoring backend, and scalable system deployment.",
    initials: "T",
  },
  {
    name: "Hillary",
    role: "Full Stack Development",
    desc: "Web app, mobile app, and backend API development including Opay payment gateway integration and UI/UX design.",
    initials: "H",
  },
  {
    name: "Sharon",
    role: "Data Analysis & Project Management",
    desc: "Market research, impact quantification, consumption data analysis, and cross-team execution.",
    initials: "S",
  },
  {
    name: "Karisto",
    role: "Mechanical Design & Fluid Mechanics",
    desc: "Physical enclosure design, weatherproofing, pipe and fluid integration, and on-farm installation planning.",
    initials: "K",
  },
];

export default function Team() {
  return (
    <section id="team" className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5">
      <div className="text-center mb-16">
        <div className="text-[#eab308] text-xs font-bold uppercase tracking-widest mb-4">
          Meet the team
        </div>
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-4">
          Built by Nigerians,{" "}
          <span className="text-[#eab308]">for Nigerian farms</span>
        </h2>
        <p className="text-[#a3b8ad] max-w-2xl mx-auto text-lg">
          Five-person team with end-to-end capability — embedded firmware, cloud infrastructure,
          full-stack software, data engineering, and mechanical design, all in-house.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {members.map(({ name, role, desc, initials }) => (
          <div
            key={name}
            className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-[#eab308]/20 hover:bg-white/8 transition-colors flex flex-col"
          >
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-[#102418] border border-[#eab308]/20 flex items-center justify-center text-[#eab308] font-bold text-lg mb-4 shrink-0">
              {initials}
            </div>
            <h3 className="text-base font-semibold text-white mb-1">{name}</h3>
            <p className="text-[11px] font-semibold text-[#eab308]/80 uppercase tracking-wide mb-3 leading-snug">
              {role}
            </p>
            <p className="text-sm text-[#a3b8ad] leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
