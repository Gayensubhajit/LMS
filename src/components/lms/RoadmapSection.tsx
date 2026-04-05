"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useInView,
} from "framer-motion";
import {
  Search,
  Map,
  Code2,
  Palette,
  Layers,
  Award,
  Sparkles,
} from "lucide-react";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"] });

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Discover Your Path",
    description:
      "Complete a quick skill assessment. Our AI analyzes your background and crafts a personalized roadmap.",
    tags: ["AI Assessment", "Personalization"],
    color: "from-blue-500 to-indigo-700",
    glow: "rgba(59,130,246,0.5)",
  },
  {
    number: "02",
    icon: Map,
    title: "Follow Your Roadmap",
    description:
      "Get a step-by-step curated learning path. Each module builds on the last for deep mastery.",
    tags: ["Structured Learning", "Milestones"],
    color: "from-blue-600 to-indigo-700",
    glow: "rgba(59,130,246,0.5)",
  },
  {
    number: "03",
    icon: Palette,
    title: "Master Core Skills",
    description:
      "Dive into hands-on projects and design challenges. Learn by doing, not just watching.",
    tags: ["Hands-on", "Design Practice"],
    color: "from-blue-500 to-cyan-600",
    glow: "rgba(59,130,246,0.5)",
  },
  {
    number: "04",
    icon: Code2,
    title: "Build Real Projects",
    description:
      "Create portfolio-worthy projects under mentor guidance. Solve real-world company problems.",
    tags: ["Portfolio", "Mentorship"],
    color: "from-blue-600 to-cyan-500",
    glow: "rgba(59,130,246,0.5)",
  },
  {
    number: "05",
    icon: Layers,
    title: "Join the Community",
    description:
      "Collaborate with peers, participate in challenges, and get feedback from global experts.",
    tags: ["Peer Review", "Networking"],
    color: "from-indigo-600 to-blue-700",
    glow: "rgba(79,70,229,0.5)",
  },
  {
    number: "06",
    icon: Award,
    title: "Get Certified & Hired",
    description:
      "Earn recognized certificates and connect with 500+ hiring partners ready to recruit.",
    tags: ["Certification", "500+ Partners"],
    color: "from-blue-600 to-indigo-800",
    glow: "rgba(37,99,235,0.5)",
  },
];

export default function RoadmapSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end end"],
  });

  const pathLength = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section
      ref={containerRef}
      className="relative py-32 overflow-hidden bg-transparent"
      id="roadmap"
    >
      {/* Background ambient glows & Auroras */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-600/10 blur-[120px] pointer-events-none aurora-blob" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-600/10 blur-[120px] pointer-events-none aurora-blob" style={{ animationDelay: '-8s' }} />

      {/* Stardust Particles - Enhanced Twinkle */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(35)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -60, 0],
              opacity: [0.1, 0.8, 0.1],
              scale: [1, 2, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div ref={headerRef} className="text-center mb-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={headerInView ? { opacity: 1, scale: 1 } : {}}
            className={`${montserrat.className} inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-black/10 dark:border-blue-500/20 bg-black/5 dark:bg-blue-500/5 text-black dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-6`}
          >
            <Sparkles size={12} />
            The Mastery Protocol
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1 }}
            className="font-serif font-black text-4xl md:text-6xl text-black dark:text-white mb-6 leading-tight"
          >
            Your celestial path
            <br />
            <span
              className={`${montserrat.className} text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-purple-600 to-cyan-500 dark:from-indigo-400 dark:via-purple-400 dark:to-cyan-400 font-black`}
            >
              to industry mastery.
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className={`${montserrat.className} text-gray-600 dark:text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed`}
          >
            A high-fidelity learning journey designed to transform beginners
            into world-class pioneers through a structured, interactive roadmap.
          </motion.p>
        </div>

        {/* The Roadmap Path */}
        <div className="relative min-h-300">
          {/* SVG Path Background */}
          <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-1 lg:w-2 transform -translate-x-1/2 opacity-20">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 2 1000"
              preserveAspectRatio="none"
            >
              <line
                x1="1"
                y1="0"
                x2="1"
                y2="1000"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="10 10"
                className="text-black/30 dark:text-white/20"
              />
            </svg>
          </div>

          {/* Animated SVG Path */}
          <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-1 lg:w-2 transform -translate-x-1/2">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 2 1000"
              preserveAspectRatio="none"
              className="overflow-visible"
            >
              <motion.line
                x1="1"
                y1="0"
                x2="1"
                y2="1000"
                stroke="url(#roadmap-gradient)"
                strokeWidth="4"
                style={{
                  pathLength,
                  filter: "drop-shadow(0 0 12px rgba(59,130,246,0.8))",
                }}
              />
              <defs>
                <linearGradient
                  id="roadmap-gradient"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="25%" stopColor="#60a5fa" />
                  <stop offset="75%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Steps */}
          <div className="relative">
            {steps.map((step, i) => (
              <RoadmapStep
                key={i}
                step={step}
                index={i}
                total={steps.length}
                scrollProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function RoadmapStep({
  step,
  index,
  total,
  scrollProgress,
}: {
  step: (typeof steps)[0];
  index: number;
  total: number;
  scrollProgress: any;
}) {
  const isEven = index % 2 === 0;

  // Calculate if this node should be "active" based on scroll progress
  const stepThreshold = index / (total - 1);
  const isActive = useTransform(
    scrollProgress,
    (val: number) => val >= stepThreshold,
  );

  return (
    <div
      className={`relative w-full flex items-center mb-24 lg:mb-32 last:mb-0`}
    >
      {/* Node (Center/Left) */}
      <div className="absolute left-8 lg:left-1/2 transform -translate-x-1/2 z-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 1 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true, amount: 0 }}
          className={`relative w-10 h-10 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl bg-white dark:bg-[#0d1117] border-2 transition-all duration-500 flex items-center justify-center shadow-md dark:shadow-[0_0_30px_rgba(59,130,246,0.2)]`}
          style={{
            borderColor: "rgba(0,0,0,0.1)",
          }}
        >
          {/* Glassy border instead of colored glow */}
          <div
            className="absolute -inset-[1px] rounded-3xl lg:rounded-4xl bg-black/5 dark:bg-white/10 transition-opacity duration-500"
          />

          <div
            className="relative z-10 w-full h-full rounded-lg lg:rounded-xl bg-white dark:bg-[#080a10] flex items-center justify-center overflow-hidden group"
          >
            
            <step.icon
              size={18}
              className="text-black dark:text-white relative z-20 lg:hidden shadow-sm"
            />
            <step.icon
              size={22}
              className="text-black dark:text-white relative z-20 hidden lg:block"
            />

            {/* Subtle neutral background fill on active */}
            <motion.div
              style={{ opacity: isActive ? 0.05 : 0 }}
              className="absolute inset-0 bg-black dark:bg-white transition-opacity duration-700"
            />
          </div>

          {/* Step Number Tag */}
          <div className="absolute -top-2 -right-2 lg:-top-3 lg:-right-3 px-1.5 py-0.5 rounded-md bg-slate-900 dark:bg-white text-white dark:text-black text-[8px] lg:text-[10px] font-black z-30 shadow-lg">
            {step.number}
          </div>
        </motion.div>
      </div>

      {/* Content Card (Left or Right) */}
      <div className={`w-full grid grid-cols-1 lg:grid-cols-2 items-center`}>
        <div
          className={`pl-20 pr-4 lg:px-12 ${isEven ? "lg:col-start-1" : "lg:col-start-2 lg:text-right"} z-10`}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ 
              duration: 0.5,
              ease: "easeOut",
              delay: index * 0.05
            }}
            className="group relative will-change-transform"
          >
            <div
              className={`relative p-6 lg:p-8 rounded-2xl lg:rounded-3xl border border-black/10 dark:border-white/10 bg-white/80 dark:bg-white/5 backdrop-blur-xl hover:bg-white dark:hover:bg-white/10 transition-colors duration-500 overflow-hidden ${!isEven ? "lg:flex lg:flex-col lg:items-end" : ""}`}
            >
              {/* SVG Border Beam Effect - Colors travelling through border */}
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <svg className="absolute inset-0 w-full h-full rounded-[inherit]" style={{ filter: 'drop-shadow(0 0 8px #3b82f6)' }}>
                  <rect
                    x="0.5"
                    y="0.5"
                    width="calc(100% - 1px)"
                    height="calc(100% - 1px)"
                    fill="none"
                    stroke="url(#beam-gradient)"
                    strokeWidth="2"
                    strokeDasharray="100, 1000"
                    rx="inherit"
                    ry="inherit"
                    className="beam-animation"
                  />
                  <defs>
                    <linearGradient id="beam-gradient" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#818cf8" />
                    </linearGradient>
                  </defs>
                </svg>
                <style jsx>{`
                  @keyframes beam-travel {
                    0% { stroke-dashoffset: 1100; }
                    100% { stroke-dashoffset: 0; }
                  }
                  .beam-animation {
                    animation: beam-travel 4s linear infinite;
                  }
                `}</style>
              </div>

              <h3
                className={`${montserrat.className} text-lg lg:text-xl font-bold text-black dark:text-white mb-2 lg:mb-3 group-hover:text-blue-500 transition-all uppercase tracking-tight`}
              >
                {step.title}
              </h3>
              <p
                className={`${montserrat.className} text-xs lg:text-sm text-slate-600 dark:text-gray-400 leading-relaxed mb-4 lg:mb-5 max-w-sm`}
              >
                {step.description}
              </p>
              <div
                className={`flex flex-wrap gap-2 ${!isEven ? "lg:justify-end" : ""}`}
              >
                {step.tags.map((tag, j) => (
                  <span
                    key={j}
                    className={`${montserrat.className} px-2 py-0.5 lg:px-3 lg:py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[8px] lg:text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase tracking-tighter transition-colors group-hover:border-blue-500/30 group-hover:text-blue-500`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
