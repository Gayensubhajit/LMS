"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    role: "UX Designer @ Google",
    initials: "PS",
    color: "from-violet-500 to-purple-700",
    rating: 5,
    text: "EduNova completely transformed my career. The AI-powered roadmap was spot-on for my goals, and within 6 months I landed a UX role at Google. The quality of instruction is unmatched.",
    outcome: "Got hired at Google",
    outcomeBg: "bg-violet-500/20 text-violet-300",
  },
  {
    id: 2,
    name: "James Callahan",
    role: "Frontend Dev @ Stripe",
    initials: "JC",
    color: "from-blue-500 to-cyan-600",
    rating: 5,
    text: "The React & Next.js course is absolutely world-class. Real-world projects, expert mentors, and a community that actually helps each other. I went from zero to senior dev in 8 months.",
    outcome: "250% salary increase",
    outcomeBg: "bg-blue-500/20 text-blue-300",
  },
  {
    id: 3,
    name: "Amara Okonkwo",
    role: "Product Manager @ Meta",
    initials: "AO",
    color: "from-pink-500 to-rose-600",
    rating: 5,
    text: "I was skeptical at first, but EduNova delivered beyond my expectations. The personalized learning path adapted to my busy schedule perfectly. Best investment I've made in my career.",
    outcome: "Promoted in 4 months",
    outcomeBg: "bg-pink-500/20 text-pink-300",
  },
  {
    id: 4,
    name: "Luca Ferrari",
    role: "AI Engineer @ OpenAI",
    initials: "LF",
    color: "from-emerald-500 to-teal-600",
    rating: 5,
    text: "The AI/ML course is simply the best I've encountered. Practical, up-to-date, and taught by people who actually work in the field. The certificate opened so many doors for me.",
    outcome: "Joined OpenAI team",
    outcomeBg: "bg-emerald-500/20 text-emerald-300",
  },
  {
    id: 5,
    name: "Sofia Marte",
    role: "Freelance Designer",
    initials: "SM",
    color: "from-amber-500 to-orange-600",
    rating: 5,
    text: "From complete beginner to landing my first $5,000 freelance project in 3 months! The community and mentors are incredibly supportive. EduNova is the real deal.",
    outcome: "First $5K freelance project",
    outcomeBg: "bg-amber-500/20 text-amber-300",
  },
];

export default function TestimonialsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  return (
    <section className="relative py-28 overflow-hidden" id="community">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(124,58,237,0.06) 0%, transparent 70%)",
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
          <div className="inline-flex items-center gap-2 tag-purple mb-4">Community Stories</div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Success Stories from Our
            <br />
            <span className="gradient-text">Growing Community</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Join thousands of learners who have transformed their careers with EduNova.
          </p>

          {/* Trust bar */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={20} fill="#facc15" className="text-yellow-400" />
            ))}
            <span className="text-white font-bold ml-2">4.9/5</span>
            <span className="text-gray-400 text-sm ml-1">from 25,000+ reviews</span>
          </div>
        </motion.div>

        {/* Featured testimonial */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto mb-12"
        >
          <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
            {/* Bg glow */}
            <div className="absolute inset-0 opacity-5 rounded-3xl"
              style={{ background: "linear-gradient(135deg, #7c3aed, #ec4899)" }}
            />

            <Quote className="text-violet-500/30 mb-4" size={48} />

            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <p className="text-xl text-gray-200 leading-relaxed mb-8 italic">
                  &ldquo;{testimonials[current].text}&rdquo;
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${testimonials[current].color} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                      {testimonials[current].initials}
                    </div>
                    <div>
                      <div className="text-white font-bold">{testimonials[current].name}</div>
                      <div className="text-sm text-gray-400">{testimonials[current].role}</div>
                    </div>
                  </div>
                  <div className={`hidden sm:inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl ${testimonials[current].outcomeBg}`}>
                    🎯 {testimonials[current].outcome}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Stars */}
            <div className="flex items-center gap-1 mt-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="#facc15" className="text-yellow-400" />
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full glass-card border-violet-500/30 flex items-center justify-center text-gray-400 hover:text-white hover:border-violet-500/60 transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === current ? "bg-violet-500 w-8" : "bg-white/20 w-4"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full glass-card border-violet-500/30 flex items-center justify-center text-gray-400 hover:text-white hover:border-violet-500/60 transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>

        {/* Mini testimonial cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.08 }}
              onClick={() => setCurrent(i)}
              className={`glass-card rounded-2xl p-4 cursor-pointer transition-all duration-300 ${
                i === current ? "border-violet-500/60 shadow-[0_0_20px_rgba(124,58,237,0.3)]" : ""
              }`}
              whileHover={{ scale: 1.04 }}
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm mb-3`}>
                {t.initials}
              </div>
              <div className="text-sm font-bold text-white leading-tight">{t.name}</div>
              <div className="text-xs text-gray-400 mt-0.5 leading-tight">{t.role}</div>
              <div className="flex gap-0.5 mt-2">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={9} fill="#facc15" className="text-yellow-400" />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
