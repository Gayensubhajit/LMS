"use client";
import Navbar from "@/components/lms/Navbar";
import HeroSection from "@/components/lms/HeroSection";
import TrustedBySectionPremium from "@/components/lms/TrustedBySectionPremium";
import WhyChooseUs from "@/components/lms/WhyChooseUs";
import RoadmapSection from "@/components/lms/RoadmapSection";
import CoursesSection from "@/components/lms/CoursesSection";
import TestimonialsSection from "@/components/lms/TestimonialsSection";
import InstructorsSection from "@/components/lms/InstructorsSection";
import PricingSection from "@/components/lms/PricingSection";
import FAQSection from "@/components/lms/FAQSection";
import CTASection from "@/components/lms/CTASection";
import Footer from "@/components/lms/Footer";
import ShaderBackground from "@/components/ui/shader-background";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { PageTransition } from "@/components/ui/PageTransition";

export default function Home() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Fix hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="relative min-h-screen bg-background overflow-x-hidden">
      {mounted && resolvedTheme === "dark" && <ShaderBackground />}
      {/* Content */}
      <PageTransition>
        <div className="relative z-10">
          <Navbar />
          <HeroSection />
          <TrustedBySectionPremium />
          <WhyChooseUs />
          <RoadmapSection />
          <CoursesSection />
          <TestimonialsSection />
          <InstructorsSection />
          <PricingSection />
          <FAQSection />
          <CTASection />
          <Footer />
        </div>
      </PageTransition>
    </main>
  );
}
