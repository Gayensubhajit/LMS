"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  Star,
  Users,
  BookOpen,
  Twitter,
  Linkedin,
  ArrowRight,
} from "lucide-react";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"] });

const instructors = [
  {
    id: 1,
    name: "Jessica Willis",
    role: "Lead UX Designer",
    company: "Ex-Apple",
    initials: "JW",
    color: "from-violet-500 to-purple-700",
    bgColor: "from-violet-900/30 to-purple-900/20",
    rating: 4.9,
    students: "12.4K",
    courses: 8,
    expertise: ["UI/UX", "Figma", "Design Systems"],
    bio: "10+ years designing award-winning products at Apple and startups.",
  },
  {
    id: 2,
    name: "Alex Chen",
    role: "Senior Engineer",
    company: "Ex-Meta",
    initials: "AC",
    color: "from-blue-500 to-cyan-600",
    bgColor: "from-blue-900/30 to-cyan-900/20",
    rating: 4.8,
    students: "18.2K",
    courses: 12,
    expertise: ["React", "Node.js", "AWS"],
    bio: "Built features used by 3 billion people at Meta. Full-stack expert.",
  },
  {
    id: 3,
    name: "Dr. Sarah Park",
    role: "AI Research Lead",
    company: "Ex-DeepMind",
    initials: "SP",
    color: "from-emerald-500 to-teal-600",
    bgColor: "from-emerald-900/30 to-teal-900/20",
    rating: 4.9,
    students: "9.7K",
    courses: 6,
    expertise: ["ML/AI", "Python", "LLMs"],
    bio: "PhD in AI from MIT. 5 published research papers. Former DeepMind researcher.",
  },
  {
    id: 4,
    name: "Marcus Lee",
    role: "Product Designer",
    company: "Ex-Airbnb",
    initials: "ML",
    color: "from-pink-500 to-rose-600",
    bgColor: "from-pink-900/30 to-rose-900/20",
    rating: 4.7,
    students: "7.3K",
    courses: 5,
    expertise: ["Mobile Design", "Branding", "Motion"],
    bio: "Helped redesign Airbnb's mobile app. Speaker at Design+.",
  },
];

export default function InstructorsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="relative py-28 overflow-hidden" id="instructors">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(124,58,237,0.04) 50%, transparent 100%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 tag-purple mb-4">
            World-Class Mentors
          </div>
          <h2 className="font-serif text-4xl md:text-6xl font-black text-white mb-4">
            Learn from Industry Leaders
            <br />
            <span className={`${montserrat.className} gradient-text`}>&amp; Top Creators</span>
          </h2>
          <p className={`${montserrat.className} text-gray-400 text-lg max-w-xl mx-auto`}>
            Our instructors aren&apos;t just teachers — they&apos;re
            practitioners actively working at the world&apos;s best companies.
          </p>
        </motion.div>

        {/* Instructors grid */}
        <div className={`${montserrat.className} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6`}>
          {instructors.map((inst, i) => (
            <motion.div
              key={inst.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="group glass-card rounded-2xl overflow-hidden cursor-pointer"
              style={{
                transition: "all 0.3s ease",
                transform: hovered === i ? "translateY(-8px)" : "translateY(0)",
                boxShadow:
                  hovered === i ? "0 20px 50px rgba(124,58,237,0.25)" : "none",
              }}
            >
              {/* Avatar area */}
              <div
                className={`relative h-36 bg-gradient-to-br ${inst.bgColor} flex items-center justify-center overflow-hidden`}
              >
                {/* Animated rings */}
                <motion.div
                  animate={
                    hovered === i
                      ? { scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }
                      : {}
                  }
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute w-24 h-24 rounded-full border border-violet-500/20"
                />
                <motion.div
                  animate={
                    hovered === i
                      ? { scale: [1, 2, 1], opacity: [0.2, 0.05, 0.2] }
                      : {}
                  }
                  transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                  className="absolute w-24 h-24 rounded-full border border-violet-500/20"
                />

                {/* Avatar */}
                <motion.div
                  animate={hovered === i ? { scale: 1.05 } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${inst.color} flex items-center justify-center text-white text-2xl font-black shadow-xl relative z-10`}
                  style={{
                    boxShadow:
                      hovered === i ? "0 10px 40px rgba(124,58,237,0.5)" : "",
                  }}
                >
                  {inst.initials}
                </motion.div>

                {/* Company badge */}
                <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm text-xs text-gray-300 px-2 py-0.5 rounded-lg border border-white/10">
                  {inst.company}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-base font-bold text-white">{inst.name}</h3>
                <p className="text-xs text-violet-400 mb-3">{inst.role}</p>

                <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                  {inst.bio}
                </p>

                {/* Expertise tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {inst.expertise.map((tag, j) => (
                    <span
                      key={j}
                      className="text-xs bg-violet-600/15 border border-violet-500/20 text-violet-300 px-2 py-0.5 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-gray-400 mb-4 pb-4 border-b border-white/5">
                  <span className="flex items-center gap-1">
                    <Star
                      size={10}
                      fill="#facc15"
                      className="text-yellow-400"
                    />
                    <span className="font-semibold text-white">
                      {inst.rating}
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={10} />
                    {inst.students}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen size={10} />
                    {inst.courses} courses
                  </span>
                </div>

                {/* Social + View */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <a
                      href={`https://twitter.com/search?q=${encodeURIComponent(inst.name)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-blue-400 hover:border-blue-500/30 transition-colors"
                    >
                      <Twitter size={12} />
                    </a>
                    <a
                      href={`https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(inst.name)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-500/30 transition-colors"
                    >
                      <Linkedin size={12} />
                    </a>
                  </div>
                  <a
                    href={`/instructors?profile=${encodeURIComponent(inst.name)}`}
                    className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 font-medium"
                  >
                    View Profile <ArrowRight size={11} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-center mt-12 backdrop-blur"
        >
          <a
            href="/instructors"
            className="inline-flex items-center gap-2 border border-violet-500/30 text-violet-300 px-8 py-3.5 rounded-2xl text-sm font-semibold hover:bg-violet-600/10 transition-colors"
          >
            Meet All 50+ Instructors <ArrowRight size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
