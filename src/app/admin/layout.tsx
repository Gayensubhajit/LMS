"use client";

import AdminGuard from "@/components/admin/AdminGuard";
import AdminSidebar from "@/components/admin/Sidebar";
import { useState } from "react";
import { Menu, X, GraduationCap } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-[#f6f8ff] dark:bg-[#030712] text-slate-500 dark:text-gray-400 overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-[#080a12] border-b border-slate-200 dark:border-white/5 z-40 flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
              <GraduationCap className="text-white size-4" />
            </div>
            <span className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-widest">EduNova <span className="text-violet-500 text-violet-600 dark:text-violet-500">Pro</span></span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        
        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-slate-900/20 dark:bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <main className="flex-1 p-6 pt-24 lg:pt-12 sm:p-10 lg:p-12 overflow-y-auto no-scrollbar max-h-screen relative">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </AdminGuard>
  );
}
