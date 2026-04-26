import { Suspense } from "react";
import CoursesClient from "./CoursesClient";
import Navbar from "@/components/lms/Navbar";

export default function CoursesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f6f8ff] dark:bg-[#030712] pt-20 px-6">
        <Navbar />
        <div className="max-w-7xl mx-auto py-20 flex flex-col items-center gap-4">
          <div className="h-6 w-48 bg-slate-200 dark:bg-white/5 animate-pulse rounded-lg" />
          <div className="h-16 w-3/4 bg-slate-200 dark:bg-white/5 animate-pulse rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mt-12">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-80 bg-slate-200 dark:bg-white/5 animate-pulse rounded-3xl" />
            ))}
          </div>
        </div>
      </div>
    }>
      <CoursesClient />
    </Suspense>
  );
}
