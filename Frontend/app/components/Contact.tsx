"use client";
import { useState } from "react";
import { MapPin, Mail, Phone } from "lucide-react";

/** Scattered star dots — pure CSS via multiple tiny radial-gradients */
function StarField() {
  // Deterministic positions (no Math.random so no hydration mismatch)
  const stars = [
    { x: 8,  y: 12 }, { x: 15, y: 45 }, { x: 22, y: 78 }, { x: 31, y: 23 },
    { x: 38, y: 61 }, { x: 45, y: 88 }, { x: 52, y: 34 }, { x: 59, y: 67 },
    { x: 66, y: 15 }, { x: 73, y: 51 }, { x: 80, y: 82 }, { x: 87, y: 28 },
    { x: 93, y: 70 }, { x: 12, y: 90 }, { x: 26, y: 55 }, { x: 41, y: 8  },
    { x: 55, y: 42 }, { x: 69, y: 95 }, { x: 78, y: 38 }, { x: 91, y: 58 },
    { x: 5,  y: 33 }, { x: 18, y: 72 }, { x: 34, y: 18 }, { x: 48, y: 85 },
    { x: 63, y: 26 }, { x: 75, y: 63 }, { x: 84, y: 10 }, { x: 96, y: 44 },
    { x: 10, y: 52 }, { x: 29, y: 38 }, { x: 43, y: 74 }, { x: 57, y: 5  },
    { x: 71, y: 80 }, { x: 88, y: 19 }, { x: 4,  y: 65 }, { x: 20, y: 30 },
  ];

  const gradients = stars
    .map(({ x, y }) => `radial-gradient(circle, rgba(255,255,255,0.55) 0px, transparent 1.2px) ${x}% ${y}%`)
    .join(", ");

  return (
    <div
      className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen"
      style={{ background: gradients, backgroundSize: "100% 100%" }}
    />
  );
}

export default function Contact() {
  const [form, setForm] = useState({
    firstName: "",
    lastName:  "",
    email:     "",
    message:   "",
  });

  const inputCls =
    "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/30 transition-colors";

  return (
    <section id="contact" className="max-w-7xl mx-auto px-6 py-24">
      <div className="bg-[#102418] rounded-[2rem] border border-white/5 p-8 md:p-16 relative overflow-hidden">

        {/* Scattered star / circuit dots */}
        <StarField />

        <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-start">

          {/* ── Left: heading + form ──────────────────────────── */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-snug">
              Deploy Blume on
              <br />
              your farm
            </h2>
            <p className="text-[#a3b8ad] text-sm leading-relaxed mb-8">
              Request a site survey and installation quote. Our team will assess
              your existing borehole-pump-tank setup and design a tailored Blume
              deployment for your crops and livestock.
            </p>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              {/* Row 1: first + last name */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  placeholder="First name"
                  className={inputCls}
                />
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  placeholder="Last name"
                  className={inputCls}
                />
              </div>

              {/* Row 2: business email */}
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Business email"
                className={inputCls}
              />

              {/* Row 3: message */}
              <textarea
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Tell us about your farm..."
                className={`${inputCls} resize-none`}
              />

              {/* Submit — outlined small button matching template */}
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-white/20 text-white text-xs font-semibold uppercase tracking-widest rounded-full hover:bg-white/5 transition-colors"
              >
                Send Request <span className="text-white/60">→</span>
              </button>
            </form>
          </div>

          {/* ── Right: office info ────────────────────────────── */}
          <div>
            <h3 className="text-base font-semibold text-white mb-6">Get in touch</h3>
            <div className="space-y-5">
              {[
                {
                  icon: MapPin,
                  value: "Nigeria,Middle Belt, Southeast\nand South-South deployments",
                },
                { icon: Mail,  value: "hello@blume.ng"           },
                { icon: Phone, value: "+234 (0) 800 BLUME NG"    },
              ].map(({ icon: Icon, value }) => (
                <div key={value} className="flex items-start gap-3">
                  <Icon className="w-4 h-4 text-white/40 mt-0.5 shrink-0" />
                  <p className="text-sm text-white/70 whitespace-pre-line leading-relaxed">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
