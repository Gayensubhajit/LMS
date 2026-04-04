"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"] });

const trustedLogos = [
  { href: "/marquee_images/colored/ibm.svg" },
  { href: "/marquee_images/colored/logitech.svg" },
  { href: "/marquee_images/colored/netflix.svg" },
  { href: "/marquee_images/colored/spotify.svg" },
  { href: "/marquee_images/colored/tmobile.svg" },
  { href: "/marquee_images/colored/tibco.svg" },
  { href: "/marquee_images/colored/booking.svg" },
  { href: "/marquee_images/colored/fortinet.svg" },
];

export default function TrustedBySectionPremium() {
  const marqueeItems = [...trustedLogos, ...trustedLogos, ...trustedLogos];

  return (
    <section className="relative py-10 overflow-hidden mt-6 md:mt-32 backdrop-blur">
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* Label */}
        <p
          className={`${montserrat.className} text-gray-500 dark:text-gray-400 tracking-wide mb-16 text-sm font-medium`}
        >
          Preferred by individuals from 20+ forward thinking companies
        </p>

        {/* Marquee */}
        <div className="relative">
          {/* Edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10 bg-linear-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10 bg-linear-to-l from-background to-transparent" />

          <div className="overflow-x-clip">
            <motion.div
              className="flex items-center gap-16 whitespace-nowrap shrink-0"
              style={{ width: "max-content" }}
              animate={{ x: ["0%", "-100%"] }}
              transition={{ repeat: Infinity, duration: 300, ease: "linear" }}
            >
              {marqueeItems.map((items, idx) => (
                <Image
                  key={idx}
                  src={items.href}
                  alt={`Marquee_Logo_Image_${idx}`}
                  width={200}
                  height={200}
                  className="object-contain transition-all hover:scale-105"
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
