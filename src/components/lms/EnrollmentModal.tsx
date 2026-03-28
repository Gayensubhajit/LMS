"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, X, Loader2 } from "lucide-react";
import type { Course } from "@/lib/courses-data";
import { formatLocalPrice, getMonthlyPrice } from "@/lib/utils/currency";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

interface EnrollmentModalProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
}

type Duration = "1month" | "3month" | "6month";

const durationConfig = [
  { value: "1month" as Duration, label: "1 month" },
  { value: "3month" as Duration, label: "3 months" },
  { value: "6month" as Duration, label: "6 months", hasFreeUpgrade: true },
];

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

export default function EnrollmentModal({ course, isOpen, onClose }: EnrollmentModalProps) {
  const { getToken, userId } = useAuth();
  const router = useRouter();
  const [selectedDuration, setSelectedDuration] = useState<Duration>("3month");
  const [enrolling, setEnrolling] = useState(false);

  const handleEnrollFree = async () => {
    if (!userId) {
      router.push(`/auth/sign-in?redirect_url=/courses/${course.slug}`);
      return;
    }

    try {
      setEnrolling(true);
      const token = await getToken();
      const res = await fetch(`${BACKEND_URL}/enrollments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "x-clerk-user-id": userId
        },
        body: JSON.stringify({ courseSlug: course.slug })
      });

      const data = await res.json();
      if (data.ok) {
        onClose();
        router.push(`/learn/${course.slug}`);
      } else {
        alert(data.error || "Enrollment failed");
      }
    } catch (err) {
      console.error("Enrollment error:", err);
      alert("Something went wrong during enrollment.");
    } finally {
      setEnrolling(false);
    }
  };

  if (!isOpen) return null;

  const getPrice = (duration: Duration) => {
    switch (duration) {
      case "1month": return course.price.oneMonth;
      case "3month": return course.price.threeMonth;
      case "6month": return course.price.sixMonth;
      default: return course.price.oneMonth;
    }
  };

  const selectedPrice = getPrice(selectedDuration);
  const months = parseInt(selectedDuration.replace("month", ""));
  const monthlyPriceFormatted = getMonthlyPrice(selectedPrice, months);
  const totalPriceFormatted = formatLocalPrice(selectedPrice);

  const benefits = [
    "Unlimited access to all courses",
    "EMI payment options",
    "Certificate upon completion",
    "7-day refund period",
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-slide-up"
        style={{
          background: "rgba(15,15,30,0.97)",
          border: "1px solid rgba(124,58,237,0.35)",
          boxShadow: "0 0 60px rgba(124,58,237,0.25), 0 25px 50px rgba(0,0,0,0.6)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient top edge */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, #7c3aed, #a855f7, transparent)" }}
        />

        {/* Header */}
        <div
          className="px-7 pt-7 pb-5 relative"
          style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.25) 0%, rgba(168,85,247,0.1) 100%)" }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors rounded-lg p-1 hover:bg-white/10"
            aria-label="Close"
          >
            <X size={18} />
          </button>
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-2xl">{course.emoji}</span>
            <span className="tag-purple text-xs">4-Course Specialization</span>
          </div>
          <h2 className="text-white text-xl font-bold leading-tight mb-1">
            Enroll in this Specialization
          </h2>
          <p className="text-gray-400 text-sm">{course.title}</p>
        </div>

        {/* Body */}
        <div className="px-7 py-6">
          {/* Benefits */}
          <p className="text-gray-300 font-semibold text-xs uppercase tracking-widest mb-3">
            What&apos;s included
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mb-6">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex items-start gap-2">
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: "rgba(124,58,237,0.3)", border: "1px solid rgba(124,58,237,0.5)" }}
                >
                  <Check size={10} className="text-violet-300" />
                </div>
                <span className="text-gray-300 text-sm leading-snug">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Duration picker */}
          <p className="text-gray-300 font-semibold text-xs uppercase tracking-widest mb-3">
            How long do you need?
          </p>
          <div className="flex gap-2 mb-5">
            {durationConfig.map((d) => {
              const selected = selectedDuration === d.value;
              return (
                <label key={d.value} className="relative flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="duration"
                    value={d.value}
                    checked={selected}
                    onChange={() => setSelectedDuration(d.value)}
                    className="sr-only"
                  />
                  <div
                    className="flex flex-col items-center px-2 py-3 rounded-xl text-sm font-medium transition-all"
                    style={{
                      border: selected
                        ? "1px solid rgba(168,85,247,0.7)"
                        : "1px solid rgba(124,58,237,0.2)",
                      background: selected
                        ? "rgba(124,58,237,0.2)"
                        : "rgba(255,255,255,0.03)",
                      color: selected ? "#c084fc" : "#9ca3af",
                      boxShadow: selected ? "0 0 16px rgba(124,58,237,0.3)" : "none",
                    }}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border-2 mb-1.5 flex items-center justify-center"
                      style={{ borderColor: selected ? "#a855f7" : "#4b5563" }}
                    >
                      {selected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                      )}
                    </span>
                    {d.label}
                  </div>
                  {d.hasFreeUpgrade && (
                    <div
                      className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-white text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap"
                      style={{ background: "linear-gradient(90deg, #7c3aed, #a855f7)" }}
                    >
                      FREE UPGRADE
                    </div>
                  )}
                </label>
              );
            })}
          </div>

          {/* Pricing bar */}
          <div
            className="flex items-center justify-between py-3.5 px-4 rounded-xl mb-5"
            style={{
              background: "rgba(124,58,237,0.1)",
              border: "1px solid rgba(124,58,237,0.2)",
            }}
          >
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Estimated Study Time</p>
              <p className="text-white font-semibold text-sm">5 hours/week</p>
            </div>
            <div className="text-right">
              <p className="text-violet-300 font-bold text-base">{monthlyPriceFormatted}<span className="text-gray-400 font-normal text-xs">/mo</span></p>
              <p className="text-gray-500 text-xs">Total {totalPriceFormatted}</p>
            </div>
          </div>

          {/* Continue button */}
          {course.isFree ? (
            <button
              onClick={handleEnrollFree}
              disabled={enrolling}
              className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2"
              style={{
                background: "linear-gradient(135deg, #059669, #10b981)",
                boxShadow: "0 0 20px rgba(16,185,129,0.4)",
              }}
            >
              {enrolling ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Enrolling...
                </>
              ) : (
                "Enroll Free Now →"
              )}
            </button>
          ) : (
            <Link
              href={`/checkout?slug=${encodeURIComponent(course.slug)}&plan=${selectedDuration}`}
              onClick={onClose}
              className="block w-full text-center py-3 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                boxShadow: "0 0 20px rgba(124,58,237,0.4)",
              }}
            >
              Continue to Checkout →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
