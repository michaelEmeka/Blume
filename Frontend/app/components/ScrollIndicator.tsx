"use client";
import { useEffect, useState } from "react";

export default function ScrollIndicator() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop || document.body.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <aside className="fixed right-6 lg:right-10 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-6 mix-blend-difference pointer-events-none">
      <span className="text-[10px] font-bold text-white tracking-widest">01</span>
      <div className="w-[1px] h-32 bg-white/20 relative overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full bg-[#eab308] transition-all duration-100 ease-out"
          style={{ height: `${progress}%` }}
        />
      </div>
      <span className="text-[10px] font-bold text-white tracking-widest">02</span>
    </aside>
  );
}
