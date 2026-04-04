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

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background overflow-x-hidden">
      {/* Content */}
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
    </main>
  );
}
