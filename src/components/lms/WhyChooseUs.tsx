"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Brain, Briefcase, Users, Rocket, Shield, Clock } from "lucide-react";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"] });

const features = [
  {
    icon: Briefcase,
    title: "Real-World Projects",
    description:
      "Build portfolio-ready projects guided by industry professionals with hands-on experience.",
    iconBg: "from-blue-500 to-indigo-600",
    iconGlow: "rgba(99,102,241,0.5)",
    borderHover: "hover:border-indigo-500/40",
    delay: 0,
  },
  {
    icon: Brain,
    title: "AI-Powered Learning Paths",
    description:
      "Personalized roadmaps that adapt to your pace, skill level, and career goals in real time.",
    iconBg: "from-violet-500 to-purple-600",
    iconGlow: "rgba(139,92,246,0.5)",
    borderHover: "hover:border-violet-500/40",
    delay: 0.1,
  },
  {
    icon: Rocket,
    title: "Fast-Track Certification",
    description:
      "Earn industry-recognized certificates in weeks, not years. Accelerated learning methodology.",
    iconBg: "from-cyan-500 to-blue-600",
    iconGlow: "rgba(6,182,212,0.5)",
    borderHover: "hover:border-cyan-500/40",
    delay: 0.2,
  },
  {
    icon: Users,
    title: "Peer Learning Community",
    description:
      "Connect with 25,000+ learners worldwide. Collaborate, share, and grow together.",
    iconBg: "from-emerald-500 to-teal-600",
    iconGlow: "rgba(16,185,129,0.5)",
    borderHover: "hover:border-emerald-500/40",
    delay: 0.3,
  },
  {
    icon: Shield,
    title: "Expert Instructors",
    description:
      "Learn from vetted professionals with 10+ years of industry experience at top companies.",
    iconBg: "from-rose-500 to-pink-600",
    iconGlow: "rgba(244,63,94,0.5)",
    borderHover: "hover:border-rose-500/40",
    delay: 0.4,
  },
  {
    icon: Clock,
    title: "Learn at Your Own Pace",
    description:
      "Lifetime access to all content. Start, pause, resume anytime from any device.",
    iconBg: "from-amber-500 to-orange-600",
    iconGlow: "rgba(245,158,11,0.5)",
    borderHover: "hover:border-amber-500/40",
    delay: 0.5,
  },
];

export default function WhyChooseUs() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      className="relative py-28 overflow-hidden bg-white dark:bg-[#030712]"
      id="why-us"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="aurora-blob w-[500px] h-[500px] bg-blue-600/10 -top-20 -left-20" />
        <div
          className="aurora-blob w-[400px] h-[400px] bg-indigo-600/10 bottom-20 right-20"
          style={{ animationDelay: "-5s" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(59,130,246,0.05) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span
            className={`${montserrat.className} inline-flex items-center gap-2 px-2 py-1 border border-gray-900/50 dark:border-violet-500/50 rounded-lg text-xs font-black tracking-[0.25em] text-black dark:text-violet-400 uppercase mb-4`}
          >
            Why Choose Us
          </span>
          <h2 className="font-serif font-black text-4xl md:text-6xl text-slate-900 dark:text-white mb-6 leading-tight tracking-tight">
            The Learning Platform
            <br />
            <span
              className={`${montserrat.className} text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-zinc-800 to-indigo-600 dark:from-blue-400 dark:via-white dark:to-indigo-400 animate-pulse-slow`}
            >
              Built for Your Success
            </span>
          </h2>
          <p
            className={`${montserrat.className} text-slate-600 dark:text-gray-400 text-lg max-w-2xl mx-auto`}
          >
            We combine cutting-edge AI technology with proven learning science
            to deliver results that matter for your career.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: feature.delay }}
              className={`group relative rounded-2xl p-6 cursor-default overflow-hidden border transition-all duration-300
                bg-white dark:bg-[#111827]
                border-black/[0.06] dark:border-white/[0.06]
                shadow-lg dark:shadow-black/40
                hover:-translate-y-1.5 ${feature.borderHover}
              `}
              style={{ transition: "all 0.3s ease" }}
            >
              {/* Hover bg glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
                style={{
                  background: `radial-gradient(circle at top left, ${feature.iconGlow.replace("0.5", "0.07")} 0%, transparent 60%)`,
                }}
              />

              {/* Icon */}
              <div
                className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${feature.iconBg} flex items-center justify-center mb-4 shadow-lg`}
                style={{ boxShadow: `0 8px 25px ${feature.iconGlow}` }}
              >
                <feature.icon size={22} className="text-white" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 relative z-10">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-gray-400 leading-relaxed relative z-10">
                {feature.description}
              </p>

              {/* Bottom border glow on hover */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${feature.iconBg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />
            </motion.div>
          ))}
        </div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14 mb-0"
        >
          {[
            { value: "25K+", label: "Active Learners", color: "text-blue-600 dark:text-blue-400" },
            { value: "180+", label: "Expert Courses", color: "text-violet-600 dark:text-violet-400" },
            { value: "4.9★", label: "Average Rating", color: "text-amber-500 dark:text-amber-400" },
            { value: "94%", label: "Job Placement", color: "text-emerald-600 dark:text-emerald-400" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white dark:bg-[#111827] border border-black/[0.06] dark:border-white/[0.06] shadow-sm"
            >
              <span className={`text-3xl font-black tracking-tight ${stat.color}`}>{stat.value}</span>
              <span className="text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest mt-1">{stat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center mt-14"
        >
          <motion.a
            href="/features"
            whileHover={{
              scale: 1.04,
              boxShadow: "0 0 50px rgba(59,130,246,0.5)",
            }}
            whileTap={{ scale: 0.97 }}
            className="group relative inline-block bg-linear-to-r from-blue-600 via-indigo-600 to-blue-500 text-white font-black px-12 py-5 rounded-2xl text-[10px] uppercase tracking-[0.2em] transition-all overflow-hidden shadow-2xl"
          >
            <div className="shimmer-effect after:animation-[shimmer_2s_infinite]" />
            <span className="relative z-10 flex items-center gap-2">
              Explore All Features{" "}
              <Rocket
                size={14}
                className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
              />
            </span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
