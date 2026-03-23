"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Brain, Briefcase, Users, Rocket, Shield, Clock } from "lucide-react";

const features = [
  {
    icon: Briefcase,
    title: "Real-World Projects",
    description: "Build portfolio-ready projects guided by industry professionals with hands-on experience.",
    color: "from-violet-500 to-purple-700",
    glow: "rgba(124,58,237,0.4)",
    delay: 0,
  },
  {
    icon: Brain,
    title: "AI-Powered Learning Paths",
    description: "Personalized roadmaps that adapt to your pace, skill level, and career goals in real time.",
    color: "from-pink-500 to-rose-600",
    glow: "rgba(236,72,153,0.4)",
    delay: 0.1,
  },
  {
    icon: Rocket,
    title: "Fast-Track Certification",
    description: "Earn industry-recognized certificates in weeks, not years. Accelerated learning methodology.",
    color: "from-blue-500 to-cyan-600",
    glow: "rgba(59,130,246,0.4)",
    delay: 0.2,
  },
  {
    icon: Users,
    title: "Peer Learning Community",
    description: "Connect with 25,000+ learners worldwide. Collaborate, share, and grow together.",
    color: "from-emerald-500 to-teal-600",
    glow: "rgba(16,185,129,0.4)",
    delay: 0.3,
  },
  {
    icon: Shield,
    title: "Expert Instructors",
    description: "Learn from vetted professionals with 10+ years of industry experience at top companies.",
    color: "from-amber-500 to-orange-600",
    glow: "rgba(245,158,11,0.4)",
    delay: 0.4,
  },
  {
    icon: Clock,
    title: "Learn at Your Own Pace",
    description: "Lifetime access to all content. Start, pause, resume anytime from any device.",
    color: "from-purple-500 to-indigo-600",
    glow: "rgba(139,92,246,0.4)",
    delay: 0.5,
  },
];

export default function WhyChooseUs() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-28 overflow-hidden" id="why-us">
      {/* Background decoration */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(124,58,237,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 tag-purple mb-4">
            Why Choose Us
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            The Learning Platform
            <br />
            <span className="gradient-text">Built for Your Success</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
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
                borderColor: "rgba(124,58,237,0.5)",
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
              <h3 className="text-lg font-bold text-white mb-2 relative z-10">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed relative z-10">
                {feature.description}
              </p>

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
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(124,58,237,0.5)" }}
            whileTap={{ scale: 0.97 }}
            className="bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold px-10 py-4 rounded-2xl text-base"
          >
            Explore All Features →
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
