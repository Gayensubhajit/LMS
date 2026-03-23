"use client";

import { motion } from "framer-motion";

type TrustedLogo = {
  name: string;
  abbr: string;
  gradient: string; // tailwind gradient class string
  glow: string; // rgba string
};

const trustedLogos: TrustedLogo[] = [
  {
    name: "Code 2021",
    abbr: "C21",
    gradient: "from-violet-500/30 to-purple-600/10",
    glow: "rgba(124,58,237,0.55)",
  },
  {
    name: "MANIV",
    abbr: "MNV",
    gradient: "from-amber-500/25 to-orange-600/10",
    glow: "rgba(245,158,11,0.45)",
  },
  {
    name: "WEGLOT",
    abbr: "WG",
    gradient: "from-cyan-500/25 to-blue-600/10",
    glow: "rgba(59,130,246,0.45)",
  },
  {
    name: "intenseeye",
    abbr: "IE",
    gradient: "from-pink-500/25 to-rose-600/10",
    glow: "rgba(232,121,249,0.45)",
  },
  {
    name: "YPO",
    abbr: "YPO",
    gradient: "from-emerald-500/25 to-teal-600/10",
    glow: "rgba(16,185,129,0.4)",
  },
  {
    name: "insecteye",
    abbr: "SE",
    gradient: "from-indigo-500/25 to-violet-600/10",
    glow: "rgba(99,102,241,0.45)",
  },
];

export default function TrustedBySectionPremium() {
  // Duplicate so the marquee can loop smoothly.
  const marqueeItems = [...trustedLogos, ...trustedLogos, ...trustedLogos];

  return (
    <section className="relative py-10 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(8,8,15,0.0) 0%, rgba(8,8,15,0.98) 55%, rgba(8,8,15,0.98) 100%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center text-xs sm:text-sm text-gray-500 tracking-wide mb-6 opacity-90">
          Preferred by individuals from 20+ forward thinking companies
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[var(--background)] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[var(--background)] to-transparent" />

          {/* Continuous marquee */}
          <motion.div
            className="flex gap-10 whitespace-nowrap items-center"
            style={{ width: "max-content" }}
            animate={{ x: ["0%", "-33%"] }}
            transition={{ repeat: Infinity, duration: 32, ease: "linear" }}
          >
            {marqueeItems.map((l, i) => (
              <motion.div
                key={`${l.name}-${i}`}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-sm"
                initial={{ opacity: 0.55, y: 8, rotate: -0.8 }}
                animate={{
                  opacity: [0.55, 1, 0.65],
                  y: [0, -6, 0],
                  rotate: [-0.8, 0.8, -0.8],
                }}
                transition={{
                  duration: 2.9,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.05,
                }}
                style={{ boxShadow: `0 0 30px ${l.glow}` }}
              >
                {/* Monogram "logo" badge */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/10"
                  style={{
                    background:
                      `linear-gradient(135deg, rgba(124,58,237,0.0) 0%, rgba(124,58,237,0.12) 100%),` +
                      `linear-gradient(135deg, ${l.gradient
                        .replace("/30", "")
                        .replace("/25", "")} 0%, rgba(0,0,0,0) 100%)`,
                  }}
                >
                  <span className="text-white/85 font-bold text-[11px] tracking-wide">
                    {l.abbr}
                  </span>
                </div>

                <span className="text-white/75 font-semibold tracking-wide text-sm">
                  {l.name}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

