"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { backendRequest } from "@/lib/backend-client";
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  BarChart3, 
  Settings, 
  PlusCircle,
  GraduationCap,
  Globe
} from "lucide-react";
import { motion } from "framer-motion";

const SIDEBAR_LINKS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/courses", label: "My Courses", icon: BookOpen },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/users", label: "User Mgmt", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar({ 
  isOpen, 
  setIsOpen 
}: { 
  isOpen?: boolean; 
  setIsOpen?: (open: boolean) => void 
}) {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !user?.id) return;
    backendRequest<{ ok: boolean; item: { role: string } }>("/users/me", {
      clerkUserId: user.id,
    })
      .then((res) => {
        if (res.ok) setUserRole(res.item.role);
      })
      .catch(() => setUserRole(null));
  }, [isLoaded, user?.id]);

  const filteredLinks = SIDEBAR_LINKS.filter((link) => {
    if (link.label === "User Mgmt") return userRole === "ADMIN" || userRole === "SUPER_ADMIN";
    return true;
  });

  return (
    <div className={`
      fixed lg:sticky top-0 left-0 z-50
      w-64 h-screen bg-white dark:bg-[#080a12] border-r border-slate-200 dark:border-white/5 flex flex-col overflow-hidden transition-transform duration-300 ease-in-out
      ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
    `}>
      {/* Brand */}
      <div className="p-6 border-b border-slate-200 dark:border-white/5 bg-linear-to-br from-violet-600/5 to-transparent">
        <Link href="/admin" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center shadow-[0_0_20px_rgba(124,58,237,0.4)] group-hover:scale-110 transition-transform duration-300">
            <GraduationCap className="text-white size-5 fill-white" />
          </div>
          <span className="font-black text-slate-900 dark:text-white tracking-widest text-sm uppercase">
            EduNova <span className="text-violet-600 dark:text-violet-500">Pro</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto no-scrollbar">
        <p className="text-[10px] font-black text-slate-500 dark:text-gray-500 uppercase tracking-widest mb-4 px-3">
          Instructor Panel
        </p>
        
        {filteredLinks.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link 
              key={link.href} 
              href={link.href} 
              className="block relative"
              onClick={() => setIsOpen?.(false)}
            >
              <div
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 group
                  ${isActive 
                    ? "text-slate-900 dark:text-white bg-violet-600/10 dark:bg-violet-600/20 shadow-[inset_0_0_20px_rgba(124,58,237,0.05)] dark:shadow-[inset_0_0_20px_rgba(124,58,237,0.1)]" 
                    : "text-slate-500 dark:text-gray-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"}
                `}
              >
                <div className={`
                  p-1.5 rounded-lg transition-all 
                  ${isActive ? "bg-violet-600 text-white" : "bg-slate-100 dark:bg-white/5 group-hover:bg-violet-600/15 dark:group-hover:bg-violet-600/20 text-slate-500 dark:text-gray-400 group-hover:text-violet-600 dark:group-hover:text-violet-400"}
                `}>
                  <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                {link.label}
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active"
                    className="absolute right-2 w-1 h-4 bg-violet-600 rounded-full"
                  />
                )}
              </div>
            </Link>
          );
        })}

        <div className="pt-6">
          <Link href="/admin/courses/create">
            <button className="w-full bg-slate-900 dark:bg-white text-white dark:text-black flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/10 dark:shadow-white/5">
              <PlusCircle size={16} />
              Create Course
            </button>
          </Link>
        </div>
      </nav>

      {/* Footer info */}
      <div className="p-4 border-t border-slate-200 dark:border-white/5 bg-violet-600/5 space-y-3">
        <Link 
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-black text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-all uppercase tracking-widest group"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-emerald-500/20 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            <Globe size={14} className="text-slate-500 dark:text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400" />
          </div>
          View Website
        </Link>
        <div className="flex items-center gap-3 px-3">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse border border-emerald-400/50" />
          <p className="text-[10px] font-bold text-slate-500 dark:text-gray-500 uppercase tracking-widest">
            System Live
          </p>
        </div>
      </div>
    </div>
  );
}
