import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-auto bg-[#040c07]">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <Image
          src="/logo.png"
          alt="Blume"
          width={100}
          height={33}
          className="object-contain"
        />

        <div className="flex items-center gap-6 text-xs text-zinc-500">
          {["Privacy", "Terms", "Contact", "LinkedIn"].map((link) => (
            <a
              key={link}
              href="#"
              className="hover:text-[#eab308] transition-colors"
            >
              {link}
            </a>
          ))}
        </div>

        <p className="text-xs text-zinc-600">
          © 2026 Blume Technologies. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
