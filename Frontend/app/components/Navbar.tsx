"use client";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";

const navLinks = [
  { label: "Solution", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Ecosystem", href: "#ecosystem" },
  { label: "Technology", href: "#technology" },
  { label: "Tiers", href: "#tiers" },
  { label: "Team", href: "#team" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while overlay is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const close = () => setMenuOpen(false);

  return (
    <>
      {/* ── Header bar — always on top of the overlay ──────────── */}
      <header
        className={`fixed top-0 w-full border-b z-[110] transition-all duration-300 ${
          scrolled
            ? "border-white/5 bg-[#06120b]/80 backdrop-blur-md"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <a href="#" onClick={close} className="flex items-center">
            <Image
              src="/logo.png"
              alt="Blume"
              width={100}
              height={33}
              className="object-contain"
              priority
            />
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-white/80 hover:text-[#eab308] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA — spinning beam border button */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="/dashboard"
              className="text-sm text-white/70 hover:text-[#eab308] transition-colors font-medium"
            >
              Dashboard
            </a>
            <a
              href="#contact"
              className="group relative flex items-center justify-center uppercase transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_40px_-10px_rgba(234,179,8,0.5)] focus:outline-none text-[11px] font-semibold text-white tracking-widest rounded-full px-5 py-2.5"
            >
              <span
                aria-hidden
                className="absolute inset-0 rounded-full overflow-hidden"
                style={{ padding: "1px" }}
              >
                <span
                  aria-hidden
                  className="animate-beam-spin"
                  style={{
                    position: "absolute",
                    width: "400%",
                    height: "400%",
                    top: "-150%",
                    left: "-150%",
                    background:
                      "conic-gradient(from 0deg, transparent 0deg 300deg, #eab308 300deg 360deg)",
                  }}
                />
                <span
                  aria-hidden
                  className="absolute rounded-full bg-[#06120b]"
                  style={{ inset: "1px" }}
                />
              </span>
              <span
                aria-hidden
                className="absolute rounded-full bg-[#06120b] overflow-hidden"
                style={{ inset: "2px", zIndex: -1 }}
              >
                <span className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-1/2 bg-[#eab308]/10 blur-2xl rounded-full transition-colors duration-500 group-hover:bg-[#eab308]/30" />
              </span>
              <span className="relative text-white/90 group-hover:text-white transition-colors">
                Get a Quote
              </span>
            </a>
          </div>

          {/* Mobile burger / close — stays accessible above overlay */}
          <button
            className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            <span
              className="block transition-all duration-300"
              style={{ transform: menuOpen ? "rotate(90deg)" : "rotate(0deg)" }}
            >
              {menuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </span>
          </button>
        </div>
      </header>

      {/* ── Full-screen mobile overlay ───────────────────────────── */}
      <div
        className="md:hidden fixed inset-0 z-[100] bg-[#06120b] flex flex-col overflow-hidden"
        style={{
          transform: menuOpen ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 520ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {/* Subtle dot grid */}
        <div className="absolute inset-0 dots-bg pointer-events-none opacity-40" />

        {/* Accent glow in corner */}
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#eab308]/8 rounded-full blur-[120px] pointer-events-none" />

        {/* Nav links — vertically centred, below the header bar */}
        <nav className="flex-1 flex flex-col items-center justify-center gap-1 pt-14">
          {navLinks.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={close}
              className="text-[2.6rem] leading-tight font-extrabold text-white hover:text-[#eab308] tracking-tight py-2 transition-colors duration-200"
              style={{
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "translateY(0)" : "translateY(28px)",
                transition: `opacity 420ms ${i * 65 + 180}ms cubic-bezier(0.22,1,0.36,1),
                             transform 420ms ${i * 65 + 180}ms cubic-bezier(0.22,1,0.36,1),
                             color 200ms`,
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Bottom CTA */}
        <div
          className="px-8 pb-14"
          style={{
            opacity: menuOpen ? 1 : 0,
            transform: menuOpen ? "translateY(0)" : "translateY(20px)",
            transition: `opacity 420ms 520ms cubic-bezier(0.22,1,0.36,1),
                         transform 420ms 520ms cubic-bezier(0.22,1,0.36,1)`,
          }}
        >
          <a
            href="#contact"
            onClick={close}
            className="block w-full py-4 bg-[#eab308] text-black text-sm font-extrabold rounded-full text-center uppercase tracking-widest hover:bg-[#fbbf24] transition-colors"
          >
            Get a Quote
          </a>
        </div>
      </div>
    </>
  );
}
