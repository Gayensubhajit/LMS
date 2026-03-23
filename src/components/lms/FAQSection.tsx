"use client";

import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "How does the AI learning path work?",
    a: "Our AI analyzes your current skill level, career goals, and learning pace through a short onboarding assessment. It then generates a personalized roadmap with curated courses, projects, and milestones — continuously adapting as you progress.",
  },
  {
    q: "Can I learn at my own pace?",
    a: "Absolutely. All courses are fully self-paced with lifetime access. Whether you can dedicate 1 hour a day or 8 hours a week, EduNova adapts to your schedule. You can start, pause, and resume at any time from any device.",
  },
  {
    q: "Are the certificates recognized by employers?",
    a: "Yes! Our certificates are recognized by 500+ partner companies including Google, Meta, Stripe, and Airbnb. They're shareable directly to LinkedIn and your resume. Many of our graduates have landed jobs using EduNova certifications.",
  },
  {
    q: "What's included in the free trial?",
    a: "Your 7-day free trial gives you full access to your selected plan — including all courses, the AI assistant, and community features. No credit card required. You'll only be billed after the trial ends, and you can cancel anytime.",
  },
  {
    q: "Do you offer group or team plans?",
    a: "Yes, we have custom Team Plans for organizations of 5+ people. This includes centralized billing, progress dashboards, custom learning paths for your team's needs, and dedicated account management.",
  },
  {
    q: "How are instructors vetted?",
    a: "Every instructor goes through a rigorous 3-stage vetting process: portfolio review, teaching quality assessment, and industry experience verification. Less than 5% of applicants are accepted, ensuring you always learn from the best.",
  },
];

export default function FAQSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="relative py-28 overflow-hidden" id="faq">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(124,58,237,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 tag-purple mb-4">Platform Exclusive</div>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Frequently Asked
            <br />
            <span className="gradient-text">Questions</span>
          </h2>
          <p className="text-gray-400">
            Everything you need to know before you begin your learning journey.
          </p>
        </motion.div>

        {/* FAQ items */}
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="glass-card rounded-2xl overflow-hidden"
              style={{
                borderColor: openIndex === i ? "rgba(124,58,237,0.5)" : "rgba(124,58,237,0.2)",
                boxShadow: openIndex === i ? "0 0 25px rgba(124,58,237,0.15)" : "none",
                transition: "all 0.3s ease",
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left group"
              >
                <span
                  className={`text-base font-semibold transition-colors duration-200 ${
                    openIndex === i ? "text-white" : "text-gray-300 group-hover:text-white"
                  }`}
                >
                  {faq.q}
                </span>
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                    openIndex === i
                      ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white"
                      : "bg-white/5 text-gray-400 group-hover:bg-violet-600/20 group-hover:text-violet-400"
                  }`}
                >
                  {openIndex === i ? <Minus size={16} /> : <Plus size={16} />}
                </div>
              </button>

              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-6 pb-6 text-gray-400 text-sm leading-relaxed border-t border-violet-500/10 pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Still have questions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-center mt-12 glass-card rounded-2xl p-8"
        >
          <div className="text-2xl mb-2">🤔</div>
          <h3 className="text-lg font-bold text-white mb-2">Still have questions?</h3>
          <p className="text-gray-400 text-sm mb-4">Our team is here to help 24/7.</p>
          <div className="flex items-center justify-center gap-3">
            <button className="bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:shadow-[0_0_25px_rgba(124,58,237,0.5)] transition-shadow">
              Chat with Us
            </button>
            <button className="border border-violet-500/30 text-violet-300 text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-violet-600/10 transition-colors">
              Email Support
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
