import type { Metadata, Viewport } from "next";
import { Poppins, Geist_Mono } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#06120b",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Blume – Smart Water Management for African Agriculture",
  description: "Sensor-driven irrigation and livestock water automation for Nigerian smallholder farms. Works offline, runs on solar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="bg-[#06120b] text-[#a3b8ad] antialiased selection:bg-[#eab308]/30 selection:text-white flex flex-col min-h-screen">
        {children}
      </body>
    </html>
  );
}
