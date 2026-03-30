"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function CTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="relative py-28 overflow-hidden" ref={ref}>
      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(124,58,237,0.2) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.3, 0.15] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute top-1/3 left-1/3 w-80 h-80 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(232,121,249,0.15) 0%, transparent 70%)",
            filter: "blur(50px)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Floating elements */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 tag-purple mb-6">
              <Sparkles size={14} className="animate-pulse" />
              Limited Time Offer
            </div>

            {/* Headline */}
            <h2 className="font-serif text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
              Start Learning
              <br />
              <span className={`${montserrat.className} gradient-text`}>
                Today
              </span>
            </h2>

            <p
              className={`${montserrat.className} text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed`}
            >
              Join 25,000+ learners already transforming their careers. Get 7
              days free — no credit card required.
            </p>

            {/* CTAs */}
            <div
              className={`${montserrat.className} flex flex-col sm:flex-row items-center justify-center gap-4`}
            >
              <motion.a
                href="/auth/sign-up"
                whileHover={{
                  scale: 1.05,
                  boxShadow:
                    "0 0 60px rgba(124,58,237,0.7), 0 0 100px rgba(124,58,237,0.3)",
                }}
                whileTap={{ scale: 0.97 }}
                className="group relative flex items-center gap-2 bg-linear-to-r from-violet-600 via-purple-600 to-violet-600 background-size-200 text-white font-bold px-10 py-4 rounded-2xl text-lg overflow-hidden"
                style={{
                  backgroundSize: "200% 100%",
                  backgroundPosition: "0% 0%",
                  transition: "all 0.3s ease",
                  boxShadow: "0 0 30px rgba(124,58,237,0.4)",
                }}
              >
                <span className="realtive z-10 flex items-center text-sm md:text-lg">
                  <Zap size={20} className="text-yellow-300" />
                  Start Free Trial Now
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </span>
                <div className="absolute z-0 inset-0 bg-linear-to-r from-violet-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.a>

              <motion.a
                href="/courses"
                whileHover={{ scale: 1.04 }}
                className="flex items-center gap-2 border border-violet-500/40 text-violet-300 font-semibold px-8 py-4 rounded-2xl hover:bg-violet-600/10 transition-colors text-sm md:text-lg"
              >
                Browse Courses
              </motion.a>
            </div>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-6 mt-10 flex-wrap">
              {[
                { icon: "🛡️", text: "30-day guarantee" },
                { icon: "⚡", text: "Instant access" },
                { icon: "🎓", text: "Recognized certificates" },
                { icon: "❌", text: "Cancel anytime" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-2 text-sm text-gray-400"
                >
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Floating avatar group */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="flex items-center justify-center gap-3 mt-8"
            >
              <div className="flex -space-x-2">
                {[
                  "from-violet-500 to-purple-700",
                  "from-pink-500 to-rose-600",
                  "from-blue-500 to-cyan-600",
                  "from-emerald-500 to-teal-600",
                  "from-amber-500 to-orange-600",
                ].map((g, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${g} border-2 border-[#08080f] flex items-center justify-center text-xs font-bold text-white`}
                  >
                    {["A", "S", "M", "R", "J"][i]}
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-400">
                <span className="text-white font-semibold">2,400+</span> joined
                this week
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
