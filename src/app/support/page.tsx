"use client";
import SimplePage from "@/components/lms/SimplePage";
import { useUser } from "@clerk/nextjs";
import { SignIn } from "@clerk/react";
import { dark } from "@clerk/ui/themes";

export default function SupportPage() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#f6f8ff] dark:bg-[#0a0a16] flex items-center justify-center transition-colors duration-700">
        <div className="w-12 h-12 border-4 border-blue-500/20 dark:border-violet-500/20 border-t-blue-600 dark:border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-[#f6f8ff] dark:bg-[#080a10] text-slate-900 dark:text-white flex items-center justify-center pt-20 transition-colors duration-700">
        <SignIn
          appearance={{
            theme: undefined, // Let clerk handle based on its state or conditionally pass dark
          }}
        />
      </div>
    );
  }

  return (
    <SimplePage
      title="Support"
      description="Need help with billing, plans, or your learning roadmap? Our support team is available 24/7 to assist you."
      ctaLabel="Go to FAQ"
      ctaHref="/#faq"
    />
  );
}
