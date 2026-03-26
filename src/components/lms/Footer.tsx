<<<<<<< HEAD
"use client";

import {
  BookOpen,
  Twitter,
  Github,
  Linkedin,
  Instagram,
  Youtube,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"] });

const footerLinks = {
  Platform: ["Courses", "Roadmaps", "AI Mentor", "Community", "Certifications"],
  Company: ["About Us", "Careers", "Blog", "Press", "Partners"],
  Resources: [
    "Documentation",
    "Help Center",
    "Webinars",
    "Newsletter",
    "Affiliate",
  ],
  Legal: [
    "Privacy Policy",
    "Terms of Service",
    "Cookie Policy",
    "Refund Policy",
  ],
};

const socials = [
  {
    icon: Twitter,
    label: "Twitter",
    color: "hover:text-sky-400",
    href: "https://twitter.com",
  },
  {
    icon: Github,
    label: "GitHub",
    color: "hover:text-gray-300",
    href: "https://github.com",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    color: "hover:text-blue-500",
    href: "https://linkedin.com",
  },
  {
    icon: Instagram,
    label: "Instagram",
    color: "hover:text-pink-500",
    href: "https://instagram.com",
  },
  {
    icon: Youtube,
    label: "YouTube",
    color: "hover:text-red-500",
    href: "https://youtube.com",
  },
];

const footerRouteMap: Record<string, string> = {
  Courses: "/courses",
  Roadmaps: "/roadmap",
  "AI Mentor": "/support",
  Community: "/features",
  Certifications: "/features",
  "About Us": "/features",
  Careers: "/features",
  Blog: "/features",
  Press: "/features",
  Partners: "/features",
  Documentation: "/features",
  "Help Center": "/support",
  Webinars: "/features",
  Newsletter: "/auth/sign-up",
  Affiliate: "/features",
  "Privacy Policy": "/legal/privacy",
  "Terms of Service": "/legal/terms",
  "Cookie Policy": "/legal/cookies",
  "Refund Policy": "/legal/terms",
};

export default function Footer() {
  return (
    <footer
      className={`${montserrat.className} relative border-t border-violet-500/10 pt-16 pb-8 overflow-hidden`}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 30% at 50% 100%, rgba(124,58,237,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Newsletter bar */}
        <div className="glass-card rounded-2xl p-6 mb-14 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">
              Stay ahead of the curve
            </h3>
            <p className="text-sm text-gray-400">
              Weekly insights, new courses, and career tips straight to your
              inbox.
            </p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 sm:w-64 bg-white/5 border border-violet-500/20 text-white placeholder-gray-500 text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:border-violet-500/60 transition-colors"
            />
            <Link
              href="/auth/sign-up"
              className="flex items-center gap-1.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl whitespace-nowrap hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-shadow"
            >
              Subscribe <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Main footer grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand column */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.4)]">
                <BookOpen size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold gradient-text-purple">
                EduNova
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-4 max-w-xs">
              The AI-powered learning platform where ambitious professionals
              master in-demand skills and launch transformative careers.
            </p>
            {/* Socials */}
            <div className="flex gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className={`w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 ${social.color} transition-colors hover:border-violet-500/30`}
                >
                  <social.icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-widest mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href={footerRouteMap[link] ?? "/features"}
                      className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-violet-500/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            © 2026 EduNova, Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-xs text-gray-600">
            <Link
              href="/legal/privacy"
              className="hover:text-gray-400 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/legal/terms"
              className="hover:text-gray-400 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/legal/cookies"
              className="hover:text-gray-400 transition-colors"
            >
              Cookies
            </Link>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span>All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
=======
"use client";

import {
  BookOpen,
  Twitter,
  Github,
  Linkedin,
  Instagram,
  Youtube,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"] });

const footerLinks = {
  Platform: ["Courses", "Roadmaps", "AI Mentor", "Community", "Certifications"],
  Company: ["About Us", "Careers", "Blog", "Press", "Partners"],
  Resources: [
    "Documentation",
    "Help Center",
    "Webinars",
    "Newsletter",
    "Affiliate",
  ],
  Legal: [
    "Privacy Policy",
    "Terms of Service",
    "Cookie Policy",
    "Refund Policy",
  ],
};

const socials = [
  {
    icon: Twitter,
    label: "Twitter",
    color: "hover:text-sky-400",
    href: "https://twitter.com",
  },
  {
    icon: Github,
    label: "GitHub",
    color: "hover:text-gray-300",
    href: "https://github.com",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    color: "hover:text-blue-500",
    href: "https://linkedin.com",
  },
  {
    icon: Instagram,
    label: "Instagram",
    color: "hover:text-pink-500",
    href: "https://instagram.com",
  },
  {
    icon: Youtube,
    label: "YouTube",
    color: "hover:text-red-500",
    href: "https://youtube.com",
  },
];

const footerRouteMap: Record<string, string> = {
  Courses: "/courses",
  Roadmaps: "/roadmap",
  "AI Mentor": "/support",
  Community: "/features",
  Certifications: "/features",
  "About Us": "/features",
  Careers: "/features",
  Blog: "/features",
  Press: "/features",
  Partners: "/features",
  Documentation: "/features",
  "Help Center": "/support",
  Webinars: "/features",
  Newsletter: "/auth/sign-up",
  Affiliate: "/features",
  "Privacy Policy": "/legal/privacy",
  "Terms of Service": "/legal/terms",
  "Cookie Policy": "/legal/cookies",
  "Refund Policy": "/legal/terms",
};

export default function Footer() {
  return (
    <footer
      className={`${montserrat.className} relative border-t border-violet-500/10 pt-16 pb-8 overflow-hidden`}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 30% at 50% 100%, rgba(124,58,237,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Newsletter bar */}
        <div className="glass-card rounded-2xl p-6 mb-14 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-5xl mx-auto">
          <div className="">
            <h3 className="text-lg font-bold whitespace-nowrap text-white mb-1">
              Stay ahead of the curve
            </h3>
            <p className="text-sm text-gray-400">
              Weekly insights, new courses, and career tips straight to your
              inbox.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 sm:w-64 bg-white/5 border border-violet-500/20 text-white placeholder-gray-500 text-sm px-4 py-2.5 rounded-xl focus:outline-none focus:border-violet-500/60 transition-colors"
            />
            <Link
              href="/auth/sign-up"
              className="flex w-full md:w-auto justify-center items-center gap-1.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl whitespace-nowrap hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-shadow"
            >
              Subscribe <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Main footer grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand column */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.4)]">
                <BookOpen size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold gradient-text-purple">
                EduNova
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-4 max-w-xs">
              The AI-powered learning platform where ambitious professionals
              master in-demand skills and launch transformative careers.
            </p>
            {/* Socials */}
            <div className="flex gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className={`w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 ${social.color} transition-colors hover:border-violet-500/30`}
                >
                  <social.icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-widest mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href={footerRouteMap[link] ?? "/features"}
                      className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-violet-500/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs md:text-sm">
          <div className="text-sm text-gray-600">
            © 2026 EduNova, Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-6 text-xs text-gray-600">
            <Link
              href="/legal/privacy"
              className="hover:text-gray-400 transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/legal/terms"
              className="hover:text-gray-400 transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/legal/cookies"
              className="hover:text-gray-400 transition-colors"
            >
              Cookies
            </Link>
            <div className="flex justify-center items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs">All systems fine</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
>>>>>>> a8b60c7f2ca8f1fe0745ab58e92f3238ef5dc25b
