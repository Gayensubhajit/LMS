"use client";

import { motion } from "framer-motion";

const trustedLogos = [
  { name: "Google" },
  { name: "Meta" },
  { name: "Microsoft" },
  { name: "Netflix" },
  { name: "Spotify" },
  { name: "Stripe" },
  { name: "Airbnb" },
  { name: "Notion" },
  { name: "OpenAI" },
  { name: "Figma" },
  { name: "Vercel" },
  { name: "Shopify" },
];

export default function TrustedBySectionPremium() {
  const marqueeItems = [...trustedLogos, ...trustedLogos, ...trustedLogos];

  return (
    <section className="relative py-10 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Label */}
        <p className="text-xs text-gray-500 tracking-wide mb-8">
          Preferred by individuals from 20+ forward thinking companies
        </p>

        {/* Marquee */}
        <div className="relative">
          {/* Edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-background to-transparent" />

          <div className="overflow-hidden">
            <motion.div
              className="flex items-center gap-16 whitespace-nowrap"
              style={{ width: "max-content" }}
              animate={{ x: ["0%", "-33.333%"] }}
              transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
            >
              {marqueeItems.map((l, i) => (
                <span
                  key={`${l.name}-${i}`}
                  className="text-white/25 hover:text-white/55 transition-colors duration-300 font-semibold text-lg tracking-widest uppercase select-none cursor-default"
                >
                  {l.name}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
