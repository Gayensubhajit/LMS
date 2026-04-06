"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, X, Loader2, Sparkles } from "lucide-react";
import type { Course } from "@/lib/courses-data";
import { formatINR, convertToLocalCurrency } from "@/lib/utils/currency";
import { useAuth } from "@clerk/nextjs";
import { backendRequest } from "@/lib/backend-client";
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
 
export default function EnrollmentModal({ course, isOpen, onClose }: EnrollmentModalProps) {
  const { getToken, userId, isLoaded } = useAuth();
  const router = useRouter();
  const [selectedDuration, setSelectedDuration] = useState<Duration>("3month");
  const [enrolling, setEnrolling] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [checkingMember, setCheckingMember] = useState(true);
 
  useEffect(() => {
    if (!userId || !isOpen) {
      setCheckingMember(false);
      return;
    }
 
    const checkStatus = async () => {
      try {
        const data = await backendRequest<{ ok: boolean; enrolled: boolean }>("/enrollments/check/plus-membership", {
          clerkUserId: userId
        });
        
        if (data.ok && data.enrolled) {
          setIsMember(true);
        } else {
          // Robust check: check full enrollment list
          const meData = await backendRequest<{ ok: boolean; items: any[] }>("/enrollments/me", {
            clerkUserId: userId
          });
          if (meData.ok && meData.items) {
            const hasPlus = meData.items.some((e: any) => 
              e.course.slug === "plus-membership" && 
              (e.status === "ACTIVE" || e.status === "TRIALING")
            );
            if (hasPlus) setIsMember(true);
          }
        }
      } catch (err) {
        console.error("Enrollment modal status check error:", err);
      } finally {
        setCheckingMember(false);
      }
    };
 
    checkStatus();
  }, [userId, isOpen, getToken]);
 
  const handleEnrollFree = async () => {
    if (!userId) {
      router.push(`/auth/sign-in?redirect_url=/courses/${course.slug}`);
      return;
    }
 
    try {
      setEnrolling(true);
      const data = await backendRequest<{ ok: boolean; error?: string }>("/enrollments", {
        method: "POST",
        clerkUserId: userId,
        body: { courseSlug: course.slug }
      });
 
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
    let usdPrice = 0;
    switch (duration) {
      case "1month": usdPrice = course.price.oneMonth; break;
      case "3month": usdPrice = course.price.threeMonth; break;
      case "6month": usdPrice = course.price.sixMonth; break;
      default: usdPrice = course.price.oneMonth;
    }
    return convertToLocalCurrency(usdPrice);
  };

  const selectedPrice = getPrice(selectedDuration);
  const months = parseInt(selectedDuration.replace("month", ""));
  const monthlyPriceFormatted = `₹${Math.round(selectedPrice / months).toLocaleString('en-IN')}`;
  const totalPriceFormatted = formatINR(selectedPrice);

  const benefits = [
    "Unlimited access to all courses",
    "EMI payment options",
    "Certificate upon completion",
    "7-day refund period",
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 dark:bg-black/75 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-[2rem] overflow-hidden shadow-2xl animate-slide-up bg-white dark:bg-[#0f0f1e]/95 border border-slate-200 dark:border-blue-500/35 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] dark:shadow-[0_0_60px_rgba(59,130,246,0.25),_0_25px_50px_rgba(0,0,0,0.6)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient top edge */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, #3b82f6, #6366f1, transparent)" }}
        />

        {/* Header */}
        <div className="px-7 pt-7 pb-5 relative bg-slate-50 dark:bg-transparent border-b border-slate-100 dark:border-transparent">
          <div className="absolute inset-0 bg-transparent dark:bg-linear-to-br dark:from-blue-500/25 dark:to-indigo-500/10 pointer-events-none" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors rounded-lg p-1 hover:bg-slate-200 dark:hover:bg-white/10 z-10"
            aria-label="Close"
          >
            <X size={18} />
          </button>
          
          <div className="relative z-10 inline-flex items-center gap-2 mb-3">
            <span className="text-2xl">{course.emoji}</span>
            <span className="bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 text-[10px] font-black px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-500/30 uppercase tracking-widest">
              {isMember ? "Membership Access" : "Specialization"}
            </span>
          </div>
          <h2 className="relative z-10 text-slate-900 dark:text-white text-xl font-black leading-tight mb-1 tracking-tight">
            {isMember ? "Claim Your Access" : "Enroll in this Specialization"}
          </h2>
          <p className="relative z-10 text-slate-500 dark:text-gray-400 text-sm font-medium">{course.title}</p>
        </div>

        {/* Body */}
        <div className="px-7 py-6">
          {isMember ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                <Sparkles className="text-emerald-500" size={24} />
              </div>
              <p className="text-slate-900 dark:text-white font-black text-lg mb-2">Member Benefit Unlocked</p>
              <p className="text-slate-500 dark:text-gray-400 text-sm mb-10 leading-relaxed">
                As an EduNova Plus member, you can enroll in any course for free. Starting now...
              </p>
              
              <button
                onClick={handleEnrollFree}
                disabled={enrolling}
                className="w-full py-5 rounded-2xl text-white font-black text-xs uppercase tracking-widest transition-all hover:scale-[1.03] active:scale-95 shadow-[0_15px_30px_rgba(16,185,129,0.3)] bg-gradient-to-r from-emerald-600 to-teal-600 flex items-center justify-center gap-3"
              >
                {enrolling ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                Join Course Now →
              </button>
            </div>
          ) : (
            <>
              {/* Benefits */}
              <p className="text-slate-400 dark:text-gray-300 font-black text-[10px] uppercase tracking-widest mb-3">
                What&apos;s included
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mb-6">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 bg-blue-100 dark:bg-blue-500/30 border border-blue-200 dark:border-blue-500/50">
                      <Check size={10} className="text-blue-600 dark:text-blue-300" />
                    </div>
                    <span className="text-slate-600 dark:text-gray-300 text-sm leading-snug font-medium">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* Duration picker */}
              <p className="text-slate-400 dark:text-gray-300 font-black text-[10px] uppercase tracking-widest mb-3">
                How long do you need?
              </p>
              <div className="flex gap-2 mb-6">
                {durationConfig.map((d) => {
                  const selected = selectedDuration === d.value;
                  return (
                    <label key={d.value} className="relative flex-1 cursor-pointer group">
                      <input
                        type="radio"
                        name="duration"
                        value={d.value}
                        checked={selected}
                        onChange={() => setSelectedDuration(d.value)}
                        className="sr-only"
                      />
                      <div
                        className={`flex flex-col items-center px-2 py-3.5 rounded-2xl text-xs font-bold transition-all border ${
                          selected
                            ? "border-blue-400 dark:border-indigo-500/70 bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)] dark:shadow-[0_0_16px_rgba(59,130,246,0.3)]"
                            : "border-slate-200 dark:border-blue-500/20 bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-gray-400 hover:border-slate-300 hover:bg-slate-100 dark:hover:border-blue-500/40"
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full border-2 mb-2 flex items-center justify-center transition-colors ${
                            selected ? "border-blue-600 dark:border-blue-500" : "border-slate-300 dark:border-gray-600"
                          }`}
                        >
                          {selected && (
                            <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-in zoom-in" />
                          )}
                        </span>
                        <div className="text-center">
                          <div className="text-[10px] sm:text-xs">{d.label}</div>
                          <div className={`mt-0.5 font-black ${selected ? "text-blue-800 dark:text-blue-300" : "text-slate-400 dark:text-gray-500"}`}>
                            {formatINR(getPrice(d.value))}
                          </div>
                        </div>
                      </div>
                      {d.hasFreeUpgrade && (
                        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-white text-[9px] font-black px-2.5 py-0.5 rounded-full whitespace-nowrap bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-600 dark:to-indigo-500 shadow-md">
                          SAVINGS UPGRADE
                        </div>
                      )}
                    </label>
                  );
                })}
              </div>

              {/* Pricing bar */}
              <div className="flex items-center justify-between py-4 px-5 rounded-2xl mb-6 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 shadow-sm">
                <div>
                  <p className="text-slate-500 dark:text-gray-400 text-xs font-bold mb-0.5">Estimated Study Time</p>
                  <p className="text-slate-900 dark:text-white font-black text-sm">5 hours/week</p>
                </div>
                <div className="text-right">
                  <p className="text-blue-700 dark:text-blue-300 font-black text-lg leading-tight">{monthlyPriceFormatted}<span className="text-slate-500 dark:text-gray-400 font-bold text-xs">/mo</span></p>
                  <p className="text-slate-500 dark:text-gray-500 text-xs font-bold leading-tight">Total {totalPriceFormatted}</p>
                </div>
              </div>

              {/* Continue button */}
              <Link
                href={`/checkout?slug=${encodeURIComponent(course.slug)}&plan=${selectedDuration}`}
                onClick={onClose}
                className="block w-full text-center py-4 rounded-2xl text-white font-black text-xs uppercase tracking-widest transition-all hover:scale-[1.03] active:scale-95 shadow-[0_15px_35px_rgba(0,86,210,0.25)] dark:shadow-[0_15px_35px_rgba(37,99,235,0.4)] bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-600 dark:to-indigo-600"
              >
                Continue to Checkout →
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
