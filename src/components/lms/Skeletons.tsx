"use client";
import { motion } from "framer-motion";

const shimmer = {
  initial: { opacity: 0.5 },
  animate: { 
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export function Skeleton({ className }: { className: string }) {
  return (
    <motion.div
      variants={shimmer}
      initial="initial"
      animate="animate"
      className={`bg-slate-200 dark:bg-white/5 rounded-xl ${className}`}
    />
  );
}

export function CourseCardSkeleton() {
  return (
    <div className="rounded-3xl border border-slate-200 dark:border-blue-500/10 bg-white dark:bg-black/20 overflow-hidden shadow-sm">
      <Skeleton className="aspect-video rounded-none" />
      <div className="p-6 space-y-4">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-8 w-3/4" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex justify-between">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-20" />
        </div>
      </div>
    </div>
  );
}

export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white dark:bg-white/[0.04] rounded-3xl p-6 border border-slate-200 dark:border-white/5 shadow-sm space-y-4">
          <Skeleton className="w-12 h-12 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-8 w-12" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EnrollmentCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.06] p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row gap-6">
        <Skeleton className="sm:w-56 h-40 sm:h-32 shrink-0" />
        <div className="flex-1 space-y-4">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-6 w-2/3" />
          <div className="flex gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
      <Skeleton className="h-1.5 w-full rounded-full" />
      <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-white/5">
        <div className="flex gap-3 items-center">
          <Skeleton className="w-8 h-8 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-2 w-16" />
          </div>
        </div>
        <Skeleton className="h-10 w-28 rounded-xl" />
      </div>
    </div>
  );
}

export function LessonPageSkeleton() {
  return (
    <div className="h-screen bg-[#f6f8ff] dark:bg-background flex flex-col overflow-hidden">
      {/* Header Skeleton */}
      <div className="h-14 border-b border-slate-200 dark:border-violet-500/18 flex items-center justify-between px-6">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-48 hidden md:block" />
        <Skeleton className="h-8 w-24" />
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Skeleton */}
        <div className="w-80 border-r border-slate-200 dark:border-violet-500/15 p-4 space-y-4 hidden lg:block">
          <Skeleton className="h-10 w-full" />
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <div className="pl-4 space-y-1">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          ))}
        </div>
        
        {/* Main Content Skeleton */}
        <div className="flex-1 p-8 space-y-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto space-y-8">
            <Skeleton className="aspect-video w-full rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-24" />
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
            <div className="flex gap-4 border-b border-slate-200 dark:border-white/5 pb-4">
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
