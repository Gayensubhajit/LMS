import { motion } from "framer-motion";

const logos = [
  "Code 2021",
  "MANIV",
  "WEGLOT",
  "intenseye",
  "YPO",
  "insecteye",
  "Code 2021",
  "MANIV",
  "WEGLOT",
  "intenseye",
  "YPO",
  "insecteye",
];

export default function TrustedBySection() {
  return (
    <section className="relative py-10 overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(8,8,15,0.0) 0%, rgba(8,8,15,1) 45%, rgba(8,8,15,1) 100%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center text-xs sm:text-sm text-gray-500 tracking-wide mb-6 opacity-90">
          Preferred by individuals from 20+ forward thinking companies
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent" />

          <motion.div
            className="flex gap-14 whitespace-nowrap"
            animate={{ x: [0, -50] }}
            transition={{ repeat: Infinity, duration: 26, ease: "linear" }}
            style={{ willChange: "transform" }}
          >
            {logos.map((label, i) => (
              <div
                key={`${label}-${i}`}
                className="flex items-center justify-center min-w-[120px]"
              >
                <span className="text-white/55 font-semibold tracking-wider text-sm">
                  {label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

