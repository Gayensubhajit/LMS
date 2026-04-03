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
    description: "Build portfolio-ready projects guided by industry professionals with hands-on experience.",
    color: "from-blue-600 to-indigo-700",
    glow: "rgba(59,130,246,0.5)",
    delay: 0,
  },
  {
    icon: Brain,
    title: "AI-Powered Learning Paths",
    description: "Personalized roadmaps that adapt to your pace, skill level, and career goals in real time.",
    color: "from-blue-500 to-indigo-600",
    glow: "rgba(59,130,246,0.4)",
    delay: 0.1,
  },
  {
    icon: Rocket,
    title: "Fast-Track Certification",
    description: "Earn industry-recognized certificates in weeks, not years. Accelerated learning methodology.",
    color: "from-blue-600 to-cyan-600",
    glow: "rgba(59,130,246,0.4)",
    delay: 0.2,
  },
  {
    icon: Users,
    title: "Peer Learning Community",
    description: "Connect with 25,000+ learners worldwide. Collaborate, share, and grow together.",
    color: "from-indigo-600 to-blue-500",
    glow: "rgba(59,130,246,0.4)",
    delay: 0.3,
  },
  {
    icon: Shield,
    title: "Expert Instructors",
    description: "Learn from vetted professionals with 10+ years of industry experience at top companies.",
    color: "from-blue-700 to-indigo-800",
    glow: "rgba(37,99,235,0.4)",
    delay: 0.4,
  },
  {
    icon: Clock,
    title: "Learn at Your Own Pace",
    description: "Lifetime access to all content. Start, pause, resume anytime from any device.",
    color: "from-blue-500 to-indigo-600",
    glow: "rgba(59,130,246,0.4)",
    delay: 0.5,
  },
];

export default function WhyChooseUs() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-28 overflow-hidden" id="why-us">
      {/* Background decoration with Aurora Highlights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="aurora-blob w-[500px] h-[500px] bg-blue-600/10 -top-20 -left-20" />
        <div className="aurora-blob w-[400px] h-[400px] bg-indigo-600/10 bottom-20 right-20" style={{ animationDelay: '-5s' }} />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(59,130,246,0.06) 0%, transparent 70%)",
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
          <div className="inline-flex items-center gap-2 tag-blue mb-4">
            Why Choose Us
          </div>
          <h2 className="font-black text-4xl md:text-6xl text-slate-900 dark:text-white mb-6 leading-tight tracking-tight">
            The Learning Platform
            <br />
            <span className={`${montserrat.className} text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-zinc-800 to-indigo-600 dark:from-blue-400 dark:via-white dark:to-indigo-400 animate-pulse-slow`}>
              Built for Your Success
            </span>
          </h2>
          <p className={`${montserrat.className} text-slate-600 dark:text-gray-400 text-lg max-w-2xl mx-auto`}>
            We combine cutting-edge AI technology with proven learning science to
            deliver results that matter for your career.
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
              className="group relative glass-card rounded-2xl p-6 cursor-default overflow-hidden"
              style={{ transition: "all 0.3s ease" }}
              whileHover={{
                y: -6,
                boxShadow: `0 20px 60px ${feature.glow}`,
                borderColor: "rgba(59,130,246,0.5)",
              }}
            >
              {/* Hover bg glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                style={{
                  background: `radial-gradient(circle at top left, ${feature.glow.replace("0.4", "0.08")} 0%, transparent 60%)`,
                }}
              />

              {/* Icon */}
              <div
                className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}
                style={{ boxShadow: `0 8px 25px ${feature.glow}` }}
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

              {/* Shimmer Effect on hover */}
              <div className="shimmer-effect" />

              {/* Bottom border glow on hover */}
              <div
                className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center mt-14"
        >
          <motion.a
            href="/features"
            whileHover={{ scale: 1.04, boxShadow: "0 0 50px rgba(59,130,246,0.5)" }}
            whileTap={{ scale: 0.97 }}
            className="group relative inline-block bg-linear-to-r from-blue-600 via-indigo-600 to-blue-500 text-white font-black px-12 py-5 rounded-2xl text-[10px] uppercase tracking-[0.2em] transition-all overflow-hidden shadow-2xl"
          >
            {/* Shimmer Light Streak */}
            <div className="shimmer-effect after:animation-[shimmer_2s_infinite]" />
            
            <span className="relative z-10 flex items-center gap-2">
              Explore All Features <Rocket size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
