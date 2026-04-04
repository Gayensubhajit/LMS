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
    name: "Gunjan Basak",
    role: "Senior Software Engineer",
    company: "Ex-Google",
    initials: "GB",
    color: "from-violet-500 to-purple-700",
    bgColor: "from-violet-900/30 to-purple-900/20",
    rating: 4.9,
    students: "12.4K",
    courses: 8,
    expertise: ["Cloud Native", "React", "Node.js"],
    bio: "Passionate about building scalable cloud-native applications and teaching modern web technologies.",
    image: "/images/instructors/gunjan_real.jpg",
  },
  {
    id: 2,
    name: "Chirantan Biswas",
    role: "Full-stack Developer",
    company: "Ex-Stripe",
    initials: "CB",
    color: "from-blue-500 to-cyan-600",
    bgColor: "from-blue-900/30 to-cyan-900/20",
    rating: 4.8,
    students: "18.2K",
    courses: 12,
    expertise: ["Next.js", "TypeScript", "Tailwind"],
    bio: "Focused on creating fluid, user-centric interfaces and robust backend architectures.",
    image: "/images/instructors/chirantan_real.jpg",
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
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop&q=60",
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
    image: "https://images.unsplash.com/photo-1531891437562-4301cf35b7e4?w=500&auto=format&fit=crop&q=60",
  },
];

export default function InstructorsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="relative py-28 overflow-hidden bg-white dark:bg-[#030712]" id="instructors">
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
          <h2 className="font-serif text-4xl md:text-6xl font-black text-black dark:text-white mb-4">
            Learn from Industry Leaders
            <br />
            <span className={`${montserrat.className} dark:gradient-text`}>
              &amp; Top Creators
            </span>
          </h2>
          <p
            className={`${montserrat.className} text-gray-600 dark:text-gray-400 text-lg max-w-xl mx-auto`}
          >
            Our instructors aren&apos;t just teachers — they&apos;re
            practitioners actively working at the world&apos;s best companies.
          </p>
        </motion.div>

        {/* Instructors grid */}
        <div
          className={`${montserrat.className} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6`}
        >
          {instructors.map((inst, i) => (
            <motion.div
              key={inst.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="group relative rounded-2xl overflow-hidden cursor-pointer bg-white dark:bg-[#111827] border border-black/[0.06] dark:border-white/[0.06] shadow-lg dark:shadow-black/40"
            >
              {/* Full Image Area */}
              <div
                className={`relative h-48 overflow-hidden`}
              >
                {inst.image ? (
                  <img 
                    src={inst.image} 
                    alt={inst.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                ) : (
                  <div className={`w-full h-full bg-linear-to-br ${inst.color} flex items-center justify-center text-white text-4xl font-black`}>
                    {inst.initials}
                  </div>
                )}
                
                {/* Gradient Overlay for better contrast with the badge */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                {/* Company badge */}
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-xs text-white font-medium px-2.5 py-1 rounded-lg border border-white/20 shadow-lg">
                  {inst.company}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-base font-bold text-black dark:text-white">{inst.name}</h3>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-3">{inst.role}</p>

                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 leading-relaxed">
                  {inst.bio}
                </p>

                {/* Expertise tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {inst.expertise.map((tag, j) => (
                    <span
                      key={j}
                      className="text-[10px] bg-black/5 dark:bg-blue-500/10 border border-black/10 dark:border-blue-500/20 text-slate-700 dark:text-blue-300 px-2 py-0.5 rounded-md font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4 pb-4 border-b border-black/5 dark:border-white/5">
                  <span className="flex items-center gap-1">
                    <Star
                      size={10}
                      fill="#facc15"
                      className="text-yellow-400"
                    />
                    <span className="font-semibold text-black dark:text-white">
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
                      href={inst.id === 1 ? "https://x.com/GunjanBasak" : inst.id === 2 ? "https://x.com/Chirantan2002" : `https://twitter.com/search?q=${encodeURIComponent(inst.name)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-blue-400 hover:border-blue-500/30 transition-colors"
                    >
                      <Twitter size={12} />
                    </a>
                    <a
                      href={inst.id === 1 ? "https://www.linkedin.com/in/gunjan-basak-2a7440338" : inst.id === 2 ? "https://www.linkedin.com/in/chirantan2002/" : `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(inst.name)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-500/30 transition-colors"
                    >
                      <Linkedin size={12} />
                    </a>
                  </div>
                  <a
                    href={`/instructors?profile=${encodeURIComponent(inst.name)}`}
                    className="flex items-center gap-1 text-xs text-black dark:text-blue-400 hover:opacity-70 dark:hover:text-blue-300 font-bold transition-opacity"
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
            className="inline-flex items-center gap-2 border border-black/10 dark:border-blue-500/30 text-black dark:text-blue-400 px-8 py-3.5 rounded-2xl text-sm font-bold hover:bg-black/5 dark:hover:bg-blue-600/10 transition-colors"
          >
            Meet All 50+ Instructors <ArrowRight size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
