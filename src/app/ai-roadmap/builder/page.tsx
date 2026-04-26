import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import AIRoadmapBuilder from "./BuilderClient";

export default function AIRoadmapBuilderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#030712]">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
      </div>
    }>
      <AIRoadmapBuilder />
    </Suspense>
  );
}
