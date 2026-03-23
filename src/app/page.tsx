"use client";

import dynamic from "next/dynamic";
import Navbar from "@/components/lms/Navbar";
import HeroSection from "@/components/lms/HeroSection";
import WhyChooseUs from "@/components/lms/WhyChooseUs";
import RoadmapSection from "@/components/lms/RoadmapSection";
import CoursesSection from "@/components/lms/CoursesSection";
import TestimonialsSection from "@/components/lms/TestimonialsSection";
import InstructorsSection from "@/components/lms/InstructorsSection";
import PricingSection from "@/components/lms/PricingSection";
import FAQSection from "@/components/lms/FAQSection";
import CTASection from "@/components/lms/CTASection";
import Footer from "@/components/lms/Footer";

const ParticleBackground = dynamic(
  () => import("@/components/lms/ParticleBackground"),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#08080f] overflow-x-hidden">
      {/* Particle background */}
      <ParticleBackground />

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
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
