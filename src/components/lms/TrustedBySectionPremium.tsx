"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"] });

const trustedLogos = [
  { href: "/marquee_images/colored/docker-ar21.svg" },
  { href: "/marquee_images/colored/dropbox-ar21.svg" },
  { href: "/marquee_images/colored/ebay-ar21.svg" },
  { href: "/marquee_images/colored/gitlab-ar21.svg" },
  { href: "/marquee_images/colored/google-ar21.svg" },
  { href: "/marquee_images/colored/ibm-ar21.svg" },
  { href: "/marquee_images/colored/microsoft-ar21.svg" },
  { href: "/marquee_images/colored/netflix-ar21.svg" },
  { href: "/marquee_images/colored/paypal-ar21.svg" },
  { href: "/marquee_images/colored/salesforce-ar21.svg" },
  { href: "/marquee_images/colored/spotify-ar21.svg" },
  { href: "/marquee_images/colored/stripe-ar21.svg" },
];

const DURATION = 180;

export default function TrustedBySectionPremium() {
  const marqueeItems = [...trustedLogos, ...trustedLogos, ...trustedLogos];

  return (
    <section className="relative py-10 overflow-hidden mt-6 md:mt-32 backdrop-blur">
      <div className="relative z-10 w-full mx-auto px-4 md:px-8 max-w-6xl">
        {/* Label */}
        <p
          className={`${montserrat.className} text-gray-500 dark:text-gray-400 tracking-wide mb-16 text-base md:text-lg font-medium text-center`}
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
              className="flex items-center gap-8 whitespace-nowrap shrink-0"
              style={{ width: "max-content" }}
              animate={{ x: ["0%", "-100%"] }}
              transition={{
                repeat: Infinity,
                duration: DURATION,
                ease: "linear",
              }}
            >
              {marqueeItems.map((items, idx) => (
                <img
                  key={idx}
                  src={items.href}
                  alt={`Marquee_Logo_Image_${idx}`}
                  style={{ width: 150, height: 60 }}
                  className="object-contain opacity-80 hover:opacity-100 transition-opacity duration-300 ease-in-out"
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
