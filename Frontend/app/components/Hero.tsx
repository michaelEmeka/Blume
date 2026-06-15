"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

/* ─── Collage card data ──────────────────────────────────────────── */
const CARDS = [
  {
    label: "Solar Irrigation",
    img: "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=600&q=80",
    /* desktop: top-left */
    finalStyle:       { left: "2%",  top: "10%", width: "27%", height: "38%" },
    /* mobile:  top-left of 2×2 grid */
    finalStyleMobile: { left: "2%",  top: "4%",  width: "47%", height: "27%" },
    dir: [-1, -1] as [number, number],
  },
  {
    label: "IoT Technology",
    img: "https://images.unsplash.com/photo-1611735341450-74d61e660ad2?w=600&q=80",
    /* desktop: bottom-left */
    finalStyle:       { left: "2%",  top: "53%", width: "27%", height: "37%" },
    /* mobile:  bottom-left */
    finalStyleMobile: { left: "2%",  top: "68%", width: "47%", height: "27%" },
    dir: [-1, 1] as [number, number],
  },
  {
    label: "Agriculture 4.0",
    img: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&q=80",
    /* desktop: top-right */
    finalStyle:       { right: "2%", top: "10%", width: "27%", height: "38%" },
    /* mobile:  top-right */
    finalStyleMobile: { right: "2%", top: "4%",  width: "47%", height: "27%" },
    dir: [1, -1] as [number, number],
  },
  {
    label: "Sustainability",
    img: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&q=80",
    /* desktop: bottom-right */
    finalStyle:       { right: "2%", top: "53%", width: "27%", height: "37%" },
    /* mobile:  bottom-right */
    finalStyleMobile: { right: "2%", top: "68%", width: "47%", height: "27%" },
    dir: [1, 1] as [number, number],
  },
];

/* Background hero image (centre card in final state) */
const BG_IMG = "/blume-hero.jpg";

/* ─── Helpers ────────────────────────────────────────────────────── */
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function clamp01(t: number) {
  return Math.max(0, Math.min(1, t));
}
function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current) return;
      const top   = -sectionRef.current.getBoundingClientRect().top;
      const total = sectionRef.current.offsetHeight - window.innerHeight;
      setProgress(clamp01(top / total));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Derived animation values ────────────────────────────────── */

  // Text: visible at 0, gone by progress 0.35
  const textP       = clamp01(progress / 0.35);
  const textOpacity = 1 - textP;
  const textY       = lerp(0, -40, textP);

  // Background card: fullscreen → centre strip (different target for mobile)
  const bgP = easeInOut(clamp01(progress / 0.7));

  const bgLeft   = isMobile ? lerp(0,   2,  bgP) : lerp(0,   30, bgP);
  const bgTop    = isMobile ? lerp(0,  33,  bgP) : lerp(0,    8, bgP);
  const bgWidth  = isMobile ? lerp(100, 96, bgP) : lerp(100, 40, bgP);
  const bgHeight = isMobile ? lerp(100, 32, bgP) : lerp(100, 82, bgP);
  const bgRadius = lerp(0, 18, bgP);

  // Overlay: starts dark for text legibility, lifts as card shrinks into collage
  const overlayOpacity = lerp(0.82, 0.35, bgP);

  // Collage cards: fly in 0.2 → 0.75 (staggered per card)
  const cardAnimations = CARDS.map((_, i) => {
    const delay = i * 0.06;
    return easeInOut(clamp01((progress - 0.2 - delay) / 0.55));
  });

  return (
    <section
      ref={sectionRef}
      className="relative bg-[#06120b]"
      style={{ height: "250vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Dark base */}
        <div className="absolute inset-0 bg-[#06120b]" />

        {/* ── Background / centre card ─────────────────────────── */}
        <div
          className="absolute will-change-transform overflow-hidden"
          style={{
            left:         `${bgLeft}%`,
            top:          `${bgTop}%`,
            width:        `${bgWidth}%`,
            height:       `${bgHeight}%`,
            borderRadius: `${bgRadius}px`,
          }}
        >
          <img
            src={BG_IMG}
            alt="Blume Hero"
            className="absolute inset-0 w-full h-full object-cover animate-breathe"
          />
          {/* Bottom-up gradient — heavy at start, lifts as card shrinks */}
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{
              opacity: overlayOpacity,
              background:
                "linear-gradient(to top, #06120b 0%, #06120bcc 30%, #06120b66 60%, transparent 100%)",
            }}
          />
          {/* Persistent top-down tint so headline area stays readable */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-transparent" />
        </div>

        {/* ── Collage cards (desktop + mobile) ─────────────────── */}
        {CARDS.map((card, i) => {
          const p = cardAnimations[i];
          const fs = isMobile ? card.finalStyleMobile : card.finalStyle;
          return (
            <article
              key={card.label}
              className="collage-card absolute rounded-2xl overflow-hidden shadow-2xl border border-white/10"
              style={{
                ...fs,
                opacity:   p,
                transform: `translate3d(${card.dir[0] * (1 - p) * 60}px, ${card.dir[1] * (1 - p) * 35}px, 0) scale(${lerp(0.85, 1, p)})`,
              }}
            >
              <img
                src={card.img}
                alt={card.label}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 md:bottom-5 md:left-5 md:right-5">
                <p className="text-[9px] md:text-xs uppercase tracking-widest text-white/90 font-semibold">
                  {card.label}
                </p>
              </div>
            </article>
          );
        })}

        {/* ── Centre text overlay ───────────────────────────────── */}
        <div
          className="absolute inset-0 flex flex-col will-change-transform z-10"
          style={{
            opacity:       textOpacity,
            transform:     `translateY(${textY}px)`,
            pointerEvents: progress > 0.25 ? "none" : "auto",
          }}
        >
          <div className="flex-1 flex px-6 items-center justify-center pt-24 md:pt-32">
            <div className="text-center max-w-5xl mx-auto">

              {/* Tag */}
              <div className="animate-fade-up opacity-0 flex items-center justify-center gap-3 mb-8">
                <span className="block h-px w-8 bg-[#eab308]/60" />
                <span className="text-[10px] md:text-xs font-bold text-[#eab308] uppercase tracking-[0.25em]">
                  Smart Water Solutions for African Agriculture
                </span>
                <span className="block h-px w-8 bg-[#eab308]/60" />
              </div>

              {/* Headline */}
              <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold tracking-tight text-white mb-6 leading-[1.02] animate-fade-up animation-delay-300 opacity-0">
                The intelligent ecosystem
                <br />
                for{" "}
                <span className="text-[#eab308]">water independence</span>
              </h1>

              {/* Sub */}
              <p className="text-base md:text-lg text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up animation-delay-500 opacity-0">
                Blume wraps around your existing borehole-pump-tank infrastructure
                and adds the intelligence layer that has always been missing —
                sensor-driven automation that keeps working when the internet cuts
                and NEPA takes the light.
              </p>

              {/* CTAs */}
              <div className="animate-fade-up animation-delay-700 opacity-0 flex flex-col sm:flex-row items-center justify-center gap-5">
                <a
                  href="#contact"
                  className="group inline-flex items-center gap-3 overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 text-sm font-bold text-black rounded-full pt-3.5 pr-5 pb-3.5 pl-7 relative shadow-[0_0_30px_rgba(234,179,8,0.35)] tracking-widest uppercase bg-[#eab308]"
                >
                  <span className="z-10 relative">Deploy Blume</span>
                  <span className="relative z-10 inline-flex items-center justify-center w-8 h-8 bg-black/10 rounded-full transition-transform duration-300 group-hover:translate-x-1">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </a>
                <a
                  href="#services"
                  className="text-sm font-bold tracking-widest uppercase text-white hover:text-[#eab308] transition-colors"
                >
                  Discover Services
                </a>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="border-t border-white/10 bg-black/30 backdrop-blur-md animate-fade-up animation-delay-1000 opacity-0">
            <div className="grid grid-cols-3 divide-x divide-white/10 max-w-7xl mx-auto w-full">
              {[
                { value: "14M+", label: "Smallholder Farms in Nigeria" },
                { value: "70%+", label: "Still Using Manual Irrigation" },
                { value: "30–45%", label: "Fuel Cost Reduction Per Farm" },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="py-5 px-2 md:py-6 md:px-4 text-center hover:bg-white/5 transition-colors flex flex-col items-center justify-center"
                >
                  <div className="text-xl md:text-3xl font-extrabold text-[#eab308] mb-1 tracking-tight">
                    {value}
                  </div>
                  <p className="uppercase text-[9px] md:text-[10px] text-white/60 tracking-widest font-semibold leading-tight">
                    {label}
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
