"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Loader2 } from "lucide-react";
import { Montserrat } from "next/font/google";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

const montserrat = Montserrat({ subsets: ["latin"] });

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

export default function CTASection() {
  const { getToken, userId, isLoaded } = useAuth();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !userId) {
      setLoading(false);
      return;
    }

    const checkMembership = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${BACKEND_URL}/enrollments/check/plus-membership`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-clerk-user-id": userId
          }
        });
        const data = await res.json();
        if (data.ok && data.enrolled) {
          setIsMember(true);
        }
      } catch (err) {
        console.error("CTA membership check error:", err);
      } finally {
        setLoading(false);
      }
    };

    checkMembership();
  }, [userId, isLoaded, getToken]);

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
              "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)",
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
              "radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)",
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
            <span
              className={`${montserrat.className} inline-flex items-center gap-2 px-2 py-1 border border-gray-900/50 dark:border-violet-500/50 rounded-lg text-xs font-black tracking-[0.25em] text-black dark:text-violet-400 uppercase mb-4`}
            >
              <Sparkles size={14} className="animate-pulse" />
              {isMember ? "Membership Active" : "Limited Time Offer"}
            </span>

            {/* Headline */}
            <h2 className="font-serif text-5xl md:text-6xl font-black text-black dark:text-white mb-6 leading-tight tracking-tight">
              {isMember ? "Ready for Your" : "Start Learning"}
              <br />
              <span
                className={`${montserrat.className} text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-indigo-600 to-blue-700 dark:from-blue-400 dark:via-indigo-400 dark:to-blue-300 dark:gradient-text`}
              >
                {isMember ? "Next Lesson?" : "Today"}

              </span>
            </h2>

            <p
              className={`${montserrat.className} text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed`}
            >
              {isMember 
                ? "You have full access to our catalog of 7,000+ courses. Continue your expert journey now."
                : "Join 25,000+ learners already transforming their careers. Unlock it all for ₹1."}
            </p>

            {/* CTAs */}
            <div
              className={`${montserrat.className} flex flex-col sm:flex-row items-center justify-center gap-4`}
            >
              {loading ? (
                <div className="bg-slate-100 dark:bg-white/5 w-64 h-16 rounded-2xl animate-pulse flex items-center justify-center">
                  <Loader2 className="animate-spin text-slate-400" />
                </div>
              ) : (
                <motion.div
                  whileHover={{
                    scale: 1.05,
                    boxShadow:
                      "0 0 40px rgba(0,0,0,0.1), 0 0 60px rgba(0,0,0,0.05)",
                  }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto"
                >
                  <Link
                    href={isMember ? "/courses" : "/auth/sign-up?plan=plus"}
                    className="group relative flex items-center justify-center gap-3 bg-black dark:bg-linear-to-r dark:from-blue-600 dark:via-indigo-600 dark:to-blue-600 background-size-200 text-white font-black px-12 py-5 rounded-2xl text-base md:text-lg overflow-hidden transition-all shadow-xl shadow-blue-500/20"
                  >
                    <span className="relative z-10 flex items-center gap-2 uppercase tracking-widest text-xs md:text-sm">
                      {isMember ? <Sparkles size={18} /> : <Zap size={18} className="text-yellow-400 fill-current" />}
                      {isMember ? "Continue Learning" : "Start Free Trial Now"}
                      <ArrowRight
                        size={18}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </span>
                    <div className="absolute z-0 inset-0 bg-black/80 dark:bg-linear-to-r dark:from-blue-500 dark:to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                </motion.div>
              )}

              <Link
                href="/courses"
                className="flex items-center gap-2 border border-black/10 dark:border-blue-500/40 text-black dark:text-blue-500 font-black px-10 py-5 rounded-2xl hover:bg-black/5 dark:hover:bg-blue-600/10 transition-all text-xs md:text-sm uppercase tracking-widest"
              >
                Browse Catalog
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-6 mt-12 flex-wrap">
              {[
                { icon: "🛡️", text: "Verified courses" },
                { icon: "⚡", text: "Instant access" },
                { icon: "🎓", text: "Pro certificates" },
                { icon: "❌", text: "Trial inclusive" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-500"
                >
                  <span className="filter grayscale opacity-70">{item.icon}</span>
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
