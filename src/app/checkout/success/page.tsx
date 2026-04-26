import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import SuccessClient from "./SuccessClient";

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#f8faff] dark:bg-[#030712]">
         <Loader2 className="w-10 h-10 text-blue-600 dark:text-blue-500 animate-spin" />
      </div>
    }>
      <SuccessClient />
    </Suspense>
  );
}
