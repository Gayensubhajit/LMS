"use client";

import { useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import Navbar from "@/components/lms/Navbar";
import Footer from "@/components/lms/Footer";
import CommunityLeaderboard from "@/components/lms/CommunityLeaderboard";
import ResourceVault from "@/components/lms/ResourceVault";
import {
  Brain,
  Briefcase,
  Users,
  Rocket,
  Shield,
  Clock,
  Sparkles,
  BarChart3,
  BookOpen,
  GraduationCap,
  Globe,
  Zap,
  Star,
  CheckCircle2,
  ArrowRight,
  FlaskConical,
  Bot,
  MonitorPlay,
  FolderOpen,
  HandshakeIcon,
  UserCheck,
  MessageSquare,
  Map,
  LibraryBig,
} from "lucide-react";

const heroBadges = [
  { icon: Star, label: "50,000+ Pioneers" },
  { icon: CheckCircle2, label: "Expert Instructors" },
  { icon: Globe, label: "Learn Anywhere" },
];

const featureCards = [
  {
    icon: FlaskConical,
    title: "Interactive Labs",
    desc: "Hyper-realistic virtual environments to practise complete, lifelike real-time scenarios.",
    cta: "Initiate Lab",
    href: "/courses",
    color: "from-violet-600 to-purple-700",
    glow: "rgba(124,58,237,0.35)",
  },
  {
    icon: Bot,
    title: "AI Tutoring",
    desc: "A 24/7 neural navigator that adapts its teaching style to your unique cognitive patterns.",
    cta: "Summon Tutor",
    href: "/courses",
    color: "from-pink-500 to-rose-600",
    glow: "rgba(236,72,153,0.3)",
  },
  {
    icon: MonitorPlay,
    title: "Live Classes",
    desc: "Synchronous knowledge transmissions including labs, featuring real-time collaborative whiteboard.",
    cta: "Join Stream",
    href: "/courses",
    color: "from-amber-500 to-orange-500",
    glow: "rgba(245,158,11,0.3)",
  },
  {
    icon: FolderOpen,
    title: "Portfolio Builder",
    desc: "Automatically curate your best work into an immersive 3D presentation for recruiters.",
    cta: "Craft Now",
    href: "/courses",
    color: "from-emerald-500 to-teal-600",
    glow: "rgba(16,185,129,0.3)",
  },
  {
    icon: HandshakeIcon,
    title: "Job Match",
    desc: "Our proprietary algorithm bridges the gap between your skills and global industry demands.",
    cta: "View Openings",
    href: "/courses",
    color: "from-blue-500 to-cyan-600",
    glow: "rgba(59,130,246,0.3)",
  },
  {
    icon: UserCheck,
    title: "Mentorship",
    desc: "Access to certified field experts who provide tailored career blueprints and feedback.",
    cta: "Find Mentor",
    href: "/instructors",
    color: "from-purple-500 to-indigo-600",
    glow: "rgba(139,92,246,0.3)",
  },
  {
    icon: MessageSquare,
    title: "Discussion Forums",
    desc: "Domain-specific creature spaces to collaborate on projects and solve complex challenges together.",
    cta: "Enter Hub",
    href: "/courses",
    color: "from-rose-500 to-pink-600",
    glow: "rgba(244,63,94,0.3)",
  },
  {
    icon: Map,
    title: "Roadmap Builder",
    desc: "Customize optimal learning paths from novice to master with dynamic milestones.",
    cta: "Plan Path",
    href: "/courses",
    color: "from-teal-500 to-green-600",
    glow: "rgba(20,184,166,0.3)",
  },
  {
    icon: LibraryBig,
    title: "Resource Library",
    desc: "Gain access to free whitepapers, source code, and assets to fuel your development.",
    cta: "Open Vault",
    href: "#",
    color: "from-sky-500 to-blue-600",
    glow: "rgba(14,165,233,0.3)",
  },
];

const featureSections = [
  {
    tag: "Learning Intelligence",
    title: "AI-Powered Pathways",
    subtitle: "Your roadmap, personalized by machine intelligence",
    description:
      "Our AI engine analyzes your goals, pace, and learning style to build a dynamic curriculum that evolves with you. No two journeys are the same.",
    features: [
      { icon: Brain, title: "Adaptive Curriculum", desc: "Courses that evolve based on your strengths and gaps." },
      { icon: Sparkles, title: "AI Study Assistant", desc: "Get instant explanations, hints, and summaries on any topic." },
      { icon: BarChart3, title: "Progress Analytics", desc: "Deep insights into your learning trajectory and skill mastery." },
      { icon: Zap, title: "Smart Reminders", desc: "Never lose momentum with AI-driven nudges and goals." },
    ],
    gradient: "from-violet-600/20 to-purple-900/10",
    accentGlow: "rgba(124,58,237,0.2)",
    iconGradient: "from-violet-600 to-purple-600",
    tag_color: "text-violet-400",
    border: "border-violet-500/20",
    flip: false,
  },
  {
    tag: "Education Network",
    title: "World-Class Mentors",
    subtitle: "Learn from the people who built what you want to build",
    description:
      "Every instructor is a vetted professional with 10+ years of industry experience. Access mentor sessions, code reviews, and career advice on demand.",
    features: [
      { icon: GraduationCap, title: "Vetted Experts", desc: "Instructors from Google, Meta, Amazon, and more." },
      { icon: Users, title: "Live Sessions", desc: "Weekly Q&As, workshops, and 1-on-1 mentor slots." },
      { icon: BookOpen, title: "Structured Curriculum", desc: "Battle-tested courses built by domain experts." },
      { icon: Shield, title: "Quality Guarantee", desc: "100% satisfaction guarantee on all courses." },
    ],
    gradient: "from-blue-600/20 to-cyan-900/10",
    accentGlow: "rgba(59,130,246,0.15)",
    iconGradient: "from-blue-500 to-cyan-500",
    tag_color: "text-blue-400",
    border: "border-blue-500/20",
    flip: true,
  },
  {
    tag: "Career Acceleration",
    title: "Launch Your Career",
    subtitle: "From learner to professional, the fastest path forward",
    description:
      "Real-world projects, industry certifications, and a hiring network that connects you with top employers. We don't just teach—we help you land the job.",
    features: [
      { icon: Briefcase, title: "Portfolio Projects", desc: "Build work that impresses hiring managers." },
      { icon: Rocket, title: "Fast-Track Certs", desc: "Earn recognized credentials in weeks, not years." },
      { icon: Globe, title: "Global Hiring Network", desc: "Access 2,000+ partner companies seeking EduNova grads." },
      { icon: Clock, title: "Flexible Pace", desc: "Lifetime access. Learn on your schedule, always." },
    ],
    gradient: "from-emerald-600/20 to-teal-900/10",
    accentGlow: "rgba(16,185,129,0.15)",
    iconGradient: "from-emerald-500 to-teal-500",
    tag_color: "text-emerald-400",
    border: "border-emerald-500/20",
    flip: false,
  },
];

const stats = [
  { value: "50K+", label: "Active Learners" },
  { value: "500+", label: "Expert Courses" },
  { value: "95%", label: "Completion Rate" },
  { value: "2K+", label: "Hiring Partners" },
];

function FeatureCard({ card, i, onClick }: { card: typeof featureCards[0]; i: number; onClick?: () => void }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const maskImage = useTransform(
    [mouseX, mouseY],
    ([x, y]) => `radial-gradient(350px circle at ${x}px ${y}px, white, transparent)`
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: i * 0.07 }}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      className={`group relative rounded-3xl p-8 border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl overflow-hidden ${onClick ? 'cursor-pointer' : 'cursor-default'} transition-colors hover:border-white/[0.15]`}
    >
      {/* Interactive spotlight effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px circle at ${mouseX}px ${mouseY}px, ${card.glow.replace("0.3", "0.1").replace("0.35", "0.15")}, transparent 40%)`,
          WebkitMaskImage: maskImage,
          maskImage: maskImage,
        }}
      />

      {/* Particle field (Subtle stars) */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none">
        {[...Array(6)].map((_, j) => (
          <motion.div
            key={j}
            className="absolute w-1 h-1 bg-white rounded-full"
            animate={{
              x: [Math.random() * 300, Math.random() * 300],
              y: [Math.random() * 300, Math.random() * 300],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          />
        ))}
      </div>

      {/* Icon with magnetic effect */}
      <motion.div
        title={card.title}
        className={`relative w-12 h-12 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-6 shadow-2xl transition-transform duration-300 group-hover:scale-110`}
        style={{ 
          boxShadow: `0 10px 30px ${card.glow}`,
        }}
      >
        <card.icon size={24} className="text-white relative z-10" />
      </motion.div>

      {/* Content */}
      <h3 className="text-xl font-bold text-white mb-3 relative z-10 tracking-tight group-hover:text-violet-400 transition-colors">
        {card.title}
      </h3>
      <p className="text-sm text-gray-400 leading-relaxed mb-6 relative z-10 opacity-70 group-hover:opacity-100 transition-opacity">
        {card.desc}
      </p>

      {/* CTA link */}
      {onClick ? (
        <div
          className={`relative z-10 inline-flex items-center gap-2 text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r ${card.color} opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0`}
        >
          {card.cta}
          <ArrowRight size={16} className="text-violet-500" />
        </div>
      ) : (
        <a
          href={card.href}
          className={`relative z-10 inline-flex items-center gap-2 text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r ${card.color} opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0`}
        >
          {card.cta}
          <ArrowRight size={16} className="text-violet-500" />
        </a>
      )}

      {/* Bottom accent glow */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${card.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
    </motion.div>
  );
}

function FeatureSection({ section, index }: { section: (typeof featureSections)[number]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className="relative py-24 overflow-hidden"
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 60% at ${section.flip ? "80%" : "20%"} 50%, ${section.accentGlow} 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div
          className={`flex flex-col ${section.flip ? "lg:flex-row-reverse" : "lg:flex-row"} gap-16 items-center`}
        >
          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: section.flip ? 40 : -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="flex-1"
          >
            <span className={`text-sm font-bold uppercase tracking-widest ${section.tag_color} mb-3 block`}>
              {section.tag}
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
              {section.title}
            </h2>
            <p className="text-lg text-gray-400 font-medium mb-4">
              {section.subtitle}
            </p>
            <p className="text-gray-500 text-base leading-relaxed mb-10">
              {section.description}
            </p>
            <a
              href="/courses"
              className={`inline-flex items-center gap-2 bg-gradient-to-r ${section.iconGradient} text-white font-bold px-7 py-3.5 rounded-2xl hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-lg`}
            >
              Get Started
              <ArrowRight size={18} />
            </a>
          </motion.div>

          {/* Feature cards grid */}
          <motion.div
            initial={{ opacity: 0, x: section.flip ? -40 : 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="flex-1 grid grid-cols-2 gap-4"
          >
            {section.features.map((feat, fi) => (
              <motion.div
                key={fi}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.15 + fi * 0.08 }}
                className={`group relative rounded-2xl p-5 border ${section.border}`}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  backdropFilter: "blur(12px)",
                }}
                whileHover={{ y: -4, boxShadow: `0 16px 40px ${section.accentGlow}` }}
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${section.iconGradient} flex items-center justify-center mb-3 shadow-lg`}
                >
                  <feat.icon size={18} className="text-white" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">{feat.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function FeaturesPage() {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-80px" });
  const [isVaultOpen, setIsVaultOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#080a10] selection:bg-violet-500/30">
      <Navbar />
      {/* Hero */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center py-32 px-6 overflow-hidden pt-36"
      >
        {/* Cosmic background glows */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(124,58,237,0.15) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        {/* Floating orbs */}
        <div
          className="absolute top-20 left-20 w-40 h-40 rounded-full pointer-events-none animate-pulse"
          style={{ background: "rgba(124,58,237,0.1)", filter: "blur(50px)" }}
        />
        <div
          className="absolute bottom-20 right-20 w-56 h-56 rounded-full pointer-events-none animate-pulse"
          style={{
            background: "rgba(167,139,250,0.08)",
            filter: "blur(70px)",
            animationDelay: "1s",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-violet-500/30"
            style={{ background: "rgba(124,58,237,0.1)" }}
          >
            <Sparkles size={14} className="text-violet-400" />
            <span className="text-sm text-violet-300 font-semibold tracking-wide">
              Next-Generation Learning Platform
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-white leading-tight mb-6"
          >
            Ready to{" "}
            <span
              className="inline-block"
              style={{
                background: "linear-gradient(135deg, #a78bfa, #c084fc, #f472b6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              transcend
            </span>
            <br />
            traditional learning?
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10"
          >
            Join 50,000+ pioneers already shaping the future of education with
            EduNova's celestial toolset — AI curricula, expert mentors, and
            career-launching projects.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center justify-center gap-4 mb-14 flex-wrap"
          >
            <motion.a
              href="/courses"
              whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(167,139,250,0.5)" }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-4 rounded-2xl font-bold text-white text-base"
              style={{
                background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                boxShadow: "0 0 30px rgba(124,58,237,0.35)",
              }}
            >
              Start Exploration
            </motion.a>

            <motion.a
              href="/instructors"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-4 rounded-2xl font-bold text-gray-300 text-base border border-white/10 hover:border-violet-500/50 transition-colors"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              Schedule Demo
            </motion.a>
          </motion.div>

          {/* Social proof badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex items-center justify-center gap-6 flex-wrap"
          >
            {heroBadges.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 text-sm text-gray-500"
              >
                <Icon size={15} className="text-violet-400" />
                <span>{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section
        ref={statsRef}
        className="relative py-16 border-y border-white/5"
        style={{ background: "rgba(124,58,237,0.04)" }}
      >
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div
                  className="text-4xl font-black mb-1"
                  style={{
                    background: "linear-gradient(135deg,#a78bfa,#c084fc)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 9-Card Feature Grid */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-3 block">Everything You Need</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">The building blocks<br />of your success.</h2>
            <p className="text-gray-500 max-w-xl mx-auto">From AI tutoring to live classes, every tool you need to go from beginner to expert.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.map((card, i) => (
              <FeatureCard 
                key={i} 
                card={card} 
                i={i} 
                onClick={card.title === "Resource Library" ? () => setIsVaultOpen(true) : undefined}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Community Pioneer Leaderboard */}
      <CommunityLeaderboard />

      {/* Feature deep-dives */}
      {featureSections.map((section, i) => (
        <FeatureSection key={i} section={section} index={i} />
      ))}

      {/* Final CTA */}
      <section className="relative py-32 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(124,58,237,0.18) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div
            className="rounded-3xl p-12 md:p-16 border border-violet-500/20"
            style={{
              background: "rgba(124,58,237,0.07)",
              backdropFilter: "blur(20px)",
            }}
          >
            <Sparkles className="w-10 h-10 text-violet-400 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Begin your journey today
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
              Join a community of 50,000+ pioneers shaping the future of
              education with EduNova's celestial toolset.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/auth/sign-up"
                whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(124,58,237,0.5)" }}
                whileTap={{ scale: 0.97 }}
                className="px-10 py-4 rounded-2xl font-bold text-white text-base"
                style={{
                  background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                  boxShadow: "0 0 25px rgba(124,58,237,0.3)",
                }}
              >
                Start Free Trial
              </motion.a>
              <motion.a
                href="/courses"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="px-10 py-4 rounded-2xl font-bold text-gray-300 text-base border border-white/10 hover:border-violet-500/50 transition-colors"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                Browse Courses
              </motion.a>
            </div>
          </div>
        </div>
      </section>
      {/* Resource Vault Modal */}
      <ResourceVault isOpen={isVaultOpen} onClose={() => setIsVaultOpen(false)} />

      <Footer />
    </main>
  );
}
