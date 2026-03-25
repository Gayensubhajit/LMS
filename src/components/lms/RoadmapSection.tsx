"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Search, Map, Code2, Palette, Layers, Award } from "lucide-react";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"] });

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Discover Your Path",
    description: "Complete a quick skill assessment. Our AI analyzes your background and crafts a personalized learning roadmap aligned with your goals.",
    tags: ["AI Assessment", "Goal Setting", "Personalization"],
    color: "from-violet-500 to-purple-700",
    glow: "rgba(124,58,237,0.5)",
  },
  {
    number: "02",
    icon: Map,
    title: "Follow Your Roadmap",
    description: "Get a step-by-step curated learning path. Each module builds on the last, ensuring deep, lasting knowledge retention.",
    tags: ["Structured Learning", "Progress Tracking", "Milestones"],
    color: "from-pink-500 to-rose-600",
    glow: "rgba(236,72,153,0.5)",
  },
  {
    number: "03",
    icon: Palette,
    title: "Master Core Skills",
    description: "Dive into hands-on projects, coding exercises, and design challenges. Learn by doing, not just watching.",
    tags: ["Hands-on Projects", "Live Coding", "Design Practice"],
    color: "from-blue-500 to-cyan-600",
    glow: "rgba(59,130,246,0.5)",
  },
  {
    number: "04",
    icon: Code2,
    title: "Build Real Projects",
    description: "Create portfolio-worthy projects under mentor guidance. Solve real-world problems used by actual companies.",
    tags: ["Portfolio Building", "Mentorship", "Industry Standards"],
    color: "from-emerald-500 to-teal-600",
    glow: "rgba(16,185,129,0.5)",
  },
  {
    number: "05",
    icon: Layers,
    title: "Join the Community",
    description: "Collaborate with peers, participate in challenges, and get feedback from experts and fellow learners worldwide.",
    tags: ["Peer Review", "Challenges", "Networking"],
    color: "from-amber-500 to-orange-600",
    glow: "rgba(245,158,11,0.5)",
  },
  {
    number: "06",
    icon: Award,
    title: "Get Certified & Hired",
    description: "Earn recognized certificates, build your portfolio, and connect with 500+ hiring partners ready to recruit top talent.",
    tags: ["Certification", "Job Board", "500+ Partners"],
    color: "from-purple-500 to-indigo-600",
    glow: "rgba(139,92,246,0.5)",
  },
];

export default function RoadmapSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="relative py-28 overflow-hidden" id="roadmap">
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, transparent 0%, rgba(124,58,237,0.04) 50%, transparent 100%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6" ref={ref}>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 tag-purple mb-4">
            Your Learning Journey
          </div>
          <h2 className="font-serif text-4xl md:text-6xl font-black text-white mb-4">
            From Beginner to Pro:
            <br />
            <span className={`${montserrat.className} gradient-text`}>Your Step-by-Step Roadmap</span>
          </h2>
          <p className={`${montserrat.className} text-gray-400 text-lg max-w-xl mx-auto`}>
            A proven, structured path designed to take you from zero to job-ready in the shortest time possible.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-violet-500/30 to-transparent hidden lg:block transform -translate-x-1/2" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40, y: 20 }}
                animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group relative"
              >
                <div
                  className="glass-card rounded-2xl p-6 h-full overflow-hidden"
                  style={{ transition: "all 0.3s ease" }}
                >
                  {/* Hover glow */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at top left, ${step.glow.replace("0.5", "0.07")} 0%, transparent 60%)`,
                    }}
                  />

                  <div className="flex items-start gap-4 relative z-10">
                    {/* Number + Icon */}
                    <div className="flex-shrink-0">
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center relative`}
                        style={{ boxShadow: `0 8px 25px ${step.glow}` }}
                      >
                        <step.icon size={22} className="text-white" />
                        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#08080f] border border-violet-500/40 flex items-center justify-center">
                          <span className="text-[10px] font-black gradient-text-purple">{step.number}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                      <p className="text-sm text-gray-400 leading-relaxed mb-3">{step.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {step.tags.map((tag, j) => (
                          <span key={j} className="tag-purple text-xs">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom accent */}
                  <div
                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${step.color} opacity-0 group-hover:opacity-80 transition-opacity duration-300`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
