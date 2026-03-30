"use client";
import SimplePage from "@/components/lms/SimplePage";
import { useUser } from "@clerk/nextjs";
import { SignIn } from "@clerk/react";
import { dark } from "@clerk/ui/themes";

export default function SupportPage() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#0a0a16] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-[#080a10] text-white flex items-center justify-center pt-20">
        <SignIn
          appearance={{
            theme: dark,
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
