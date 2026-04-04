"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  CreditCard,
  ShieldCheck,
  Lock,
  Zap,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth, useUser } from "@clerk/nextjs";
import { backendRequest } from "@/lib/backend-client";
import { formatLocalPrice, formatINR, formatDisplayPrice } from "@/lib/utils/currency";
import { toast } from "sonner";
import { coursesData } from "@/lib/courses-data";

// Add Razorpay type for TS
declare global {
  interface Window {
    Razorpay: any;
  }
}

const SUBSCRIPTION_PLANS: Record<string, { title: string, description: string, price: number, period: string, category: string, badge: string, emoji: string }> = {
  "plus": {
    title: "EduNova Plus",
    description: "Unlimited access to 7,000+ courses, AI paths, and dedicated mentorship.",
    price: 2099,
    period: "Monthly",
    category: "Individual Plan",
    badge: "7-Day Free Trial",
    emoji: "🚀"
  },
  "annual": {
    title: "Plus Annual",
    description: "Save big on a full year of accelerated learning and premium features.",
    price: 19999,
    period: "Annually",
    category: "Individual Plan",
    badge: "Save 33%",
    emoji: "🌟"
  },
  "teams": {
    title: "Teams Starter",
    description: "Simple team learning for growing companies. Up to 25 seats.",
    price: 1999,
    period: "Per Seat / Month",
    category: "Business Plan",
    badge: "For Startups",
    emoji: "👥"
  },
  "teams-pro": {
    title: "Teams Pro",
    description: "Volume pricing with dedicated account management and advanced analytics.",
    price: 1499,
    period: "Per Seat / Month",
    category: "Enterprise Plan",
    badge: "Dedicated Support",
    emoji: "🏢"
  }
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isSignedIn, isLoaded } = useUser();
  const { getToken, userId } = useAuth();

  const slug = searchParams.get("slug");
  const plan = searchParams.get("plan");

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [course, setCourse] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);

  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    if (slug) {
      const found = coursesData.find((c) => c.slug === slug);
      if (found) {
        setCourse(found);
      } else {
        router.push("/courses");
        return;
      }
    } else if (plan && SUBSCRIPTION_PLANS[plan]) {
      setSubscription(SUBSCRIPTION_PLANS[plan]);
    } else {
      router.push("/courses");
      return;
    }

    // CHECK FOR ACTIVE MEMBERSHIP
    const checkMembership = async () => {
      try {
        const res = await backendRequest<{ ok: boolean, enrolled: boolean }>("/enrollments/check/plus-membership", {
          clerkUserId: userId!,
        });
        if (res.ok && res.enrolled) {
          setIsMember(true);
        }
      } catch (err) {
        console.error("Failed to check membership:", err);
      }
    };
    if (userId) checkMembership();

    setLoading(false);

    // Load Razorpay Script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, [slug, plan, router, userId]);

  const isTrialPlan = subscription && (plan === "plus" || plan === "annual");

  const getPrice = () => {
    if (course) {
      if (plan === "1month") return course.price.oneMonth;
      if (plan === "3month") return course.price.threeMonth;
      if (plan === "6month") return course.price.sixMonth;
      return course.price.oneMonth;
    }
    if (subscription) {
      if (isTrialPlan) return 1;
      return subscription.price;
    }
    return 0;
  };

  const formatPriceForDisplay = (price: number) => {
    if (subscription) return formatINR(price);
    return formatLocalPrice(price);
  };

  const getDurationLabel = () => {
    if (course) {
      if (plan === "1month") return "1 Month Access";
      if (plan === "3month") return "3 Months Access";
      if (plan === "6month") return "6 Months Access";
      return "Course Access";
    }
    if (subscription) {
      return subscription.period;
    }
    return "Access";
  };

  const handleRazorpayPayment = async () => {
    if (!userId || (!course && !subscription)) {
      console.error("Payment failed: Missing state", { userId, course, subscription });
      toast.error("Information is missing. Please refresh.");
      return;
    }

    setProcessing(true);

    const targetSlug = course ? course.slug : "plus-membership";
    const targetTitle = course ? course.title : subscription.title;
    const targetPlan = plan || (subscription ? plan : "1month") || "plus";

    console.log(`💳 Initializing enrollment for: ${targetTitle} (Target: ${targetSlug}, Plan: ${targetPlan}, isTrial: ${isTrialPlan})`);

    try {
      const enrollRes = await backendRequest<{
        ok: boolean;
        item: { id: string, status: string };
      }>("/enrollments", {
        method: "POST",
        body: { courseSlug: targetSlug, plan: targetPlan },
        clerkUserId: userId,
      });

      if (!enrollRes.ok) {
        throw new Error("Failed to initialize enrollment records on the server.");
      }

      if (enrollRes.item.status === "ACTIVE" && targetSlug !== "plus-membership") {
        toast.success(`Welcome back! You have instant access to ${targetTitle} via your Plus Membership.`);
        setTimeout(() => router.push(`/checkout/success?slug=${course.slug}`), 1500);
        return;
      }

      const orderRes = await backendRequest<{
        ok: boolean;
        item: {
          orderId: string;
          amount: number;
          keyId: string;
          currency: string;
        };
      }>("/payments/create-order", {
        method: "POST",
        body: { 
          enrollmentId: enrollRes.item.id, 
          provider: "razorpay",
          isTrial: !!isTrialPlan 
        },
        clerkUserId: userId,
      });

      if (!orderRes.ok) throw new Error("The payment server rejected the order creation.");

      const { orderId, amount, keyId, currency } = orderRes.item;
      if (!window.Razorpay) throw new Error("Razorpay SDK failed to load.");

      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: "EduNova LMS",
        description: isTrialPlan 
          ? `Authorization for ${subscription.title} (Trial)`
          : `Payment for ${targetTitle} (${getDurationLabel()})`,
        image: "https://cdn-icons-png.flaticon.com/512/3413/3413535.png",
        order_id: orderId,
        handler: function (response: any) {
          toast.success("Payment successful! Redirecting...");
          setTimeout(() => router.push(course ? `/checkout/success?slug=${course.slug}` : "/dashboard"), 1500);
        },
        prefill: {
          name: user?.fullName || "",
          email: user?.primaryEmailAddress?.emailAddress || "",
        },
        theme: { color: "#0056D2" },
        modal: {
          ondismiss: () => setProcessing(false),
          escape: true,
          backdropclose: false,
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (err: any) {
      console.error("❌ Checkout Error:", err);
      toast.error(err.message || "Something went wrong during checkout.");
      setProcessing(false);
    }
  };

  if(!isSignedIn){
    
  }

  if (!isLoaded || loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f8ff] dark:bg-[#030712] transition-colors duration-700">
        <Loader2 className="w-10 h-10 text-blue-600 dark:text-blue-500 animate-spin" />
      </div>
    );

  if (!course && !subscription) return null;

  const finalPrice = getPrice();
  const futureChargeDate = new Date();
  futureChargeDate.setDate(futureChargeDate.getDate() + 14);
  const dateString = futureChargeDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <div className="min-h-screen bg-[#f6f8ff] dark:bg-[#030712] relative overflow-hidden transition-colors duration-700">
      {/* Abstract Background Glows */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-600/5 dark:bg-blue-900/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-indigo-600/5 dark:bg-indigo-900/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-6xl mx-auto px-6 py-12 lg:py-24 relative z-10">
        <Link
          href={course ? `/courses/${course.slug}` : "/pricing"}
          className="inline-flex items-center gap-2 text-slate-400 dark:text-gray-500 hover:text-slate-900 dark:hover:text-white transition-colors group mb-12"
        >
          <ChevronLeft
            size={16}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
            Exit Checkout
          </span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Order Summary (Left) */}
          <div className="lg:col-span-7 space-y-12">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                Complete your <span className="text-blue-600 dark:text-blue-500">Enrollment</span>
              </h1>
              <p className="text-slate-500 dark:text-gray-400 font-bold uppercase tracking-widest text-[11px] leading-relaxed max-w-lg">
                Join 10,000+ students mastering {course ? course.category : subscription.category} with
                EduNova&apos;s premium learning paths.
              </p>
            </div>

            <div className="p-8 lg:p-10 rounded-[48px] bg-white dark:bg-white/3 border border-slate-200 dark:border-white/10 backdrop-blur-md relative overflow-hidden group shadow-xl shadow-slate-200/50 dark:shadow-none">
              {/* Course Image Preview */}
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <div className="w-32 h-32 rounded-3xl bg-blue-600/10 dark:bg-blue-600/20 flex items-center justify-center shrink-0 border border-blue-500/10 dark:border-blue-500/20">
                  <span className="text-5xl">{course ? course.emoji : subscription.emoji}</span>
                </div>
                <div className="space-y-2 text-center sm:text-left">
                  <span className="text-[10px] font-black bg-blue-600/10 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full uppercase tracking-widest border border-blue-500/20">
                    {course ? course.category : subscription.category}
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                    {course ? course.title : subscription.title}
                  </h2>
                  <p className="text-slate-400 dark:text-gray-500 font-bold text-sm">
                    {course ? `Instructor: ${course.instructor}` : subscription.description}
                  </p>
                </div>
              </div>

              <div className="h-px bg-white/5 my-10" />

              <div className="space-y-6">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-800 dark:text-white mb-2">No commitment. Cancel anytime.</p>
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-slate-900 dark:text-white">
                      {subscription ? "Monthly subscription" : `${getDurationLabel()} Plan`}
                    </span>
                    <span className="text-slate-900 dark:text-white">
                      {isTrialPlan ? "7-Day Free Trial" : formatPriceForDisplay(finalPrice)}
                    </span>
                  </div>
                  {isTrialPlan && (
                    <div className="flex justify-end">
                      <span className="text-[11px] text-slate-500 font-medium">then ₹{subscription.price.toLocaleString("en-IN")}/mo</span>
                    </div>
                  )}
                </div>
                
                {isTrialPlan && (
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-sm font-bold">
                      <span className="text-slate-900 dark:text-white font-medium">Temporary charge</span>
                      <span className="text-slate-900 dark:text-white font-black">₹1</span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium">Authorization hold will be refunded within 48 hours</p>
                  </div>
                )}

                {!isTrialPlan && (
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-slate-500 dark:text-gray-400">Processing Fee</span>
                    <span className="text-emerald-600 dark:text-emerald-500">₹0.00 (Waived)</span>
                  </div>
                )}

                <div className="h-px bg-slate-100 dark:bg-white/10 mt-8" />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    Today&apos;s Total:
                  </span>
                  <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    {isTrialPlan ? "₹1" : formatPriceForDisplay(finalPrice)}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center gap-3 p-4 rounded-3xl bg-white/[0.01] border border-white/5">
                <ShieldCheck className="text-emerald-500 shrink-0" size={20} />
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Lifetime Access*
                </span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-3xl bg-white/[0.01] border border-white/5">
                <Zap className="text-amber-500 shrink-0" size={20} />
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Verified Cert.
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-12 xl:col-span-5 space-y-8">
            <div className="p-8 lg:p-10 rounded-[40px] bg-white dark:bg-[#0a0a20] border border-slate-200 dark:border-white/10 relative shadow-2xl shadow-slate-200/50 dark:shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
              <div className="space-y-6 mb-10">
                <div className="flex items-center gap-3">
                  <Lock className="text-blue-600 dark:text-blue-500" size={20} />
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">
                    Secure Checkout
                  </h3>
                </div>
                <p className="text-xs font-bold text-slate-400 dark:text-gray-500 leading-relaxed italic">
                  Powered by <span className="text-slate-600 dark:text-gray-300">Razorpay</span>.
                  Your payment is protected by industry-standard encryption.
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleRazorpayPayment}
                  disabled={processing}
                  className="w-full bg-[#0056D2] hover:bg-[#0041a3] disabled:bg-blue-200 dark:disabled:bg-blue-900/50 disabled:text-slate-400 dark:disabled:text-gray-500 text-white font-black py-4 rounded-2xl tracking-[0.1em] uppercase text-[12px] transition-all shadow-xl shadow-blue-500/20 dark:shadow-[0_15px_40px_rgba(0,86,210,0.25)] hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-3"
                >
                  {processing ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <CreditCard size={18} />
                  )}
                  {processing ? "Processing Order..." : isTrialPlan ? "Authorize & Start Trial" : "Pay Now"}
                </button>
                <div className="flex items-center justify-center gap-6 pt-4 opacity-70 dark:opacity-40 grayscale group-hover:grayscale-0 transition-all">
                  <span className="text-[10px] font-black text-slate-400 dark:text-white">UPI</span>
                  <span className="text-[10px] font-black text-slate-400 dark:text-white">
                    CARDS
                  </span>
                  <span className="text-[10px] font-black text-slate-400 dark:text-white">
                    NETBANKING
                  </span>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-white/5">
                <div className="flex items-start gap-4">
                  <AlertCircle
                    size={18}
                    className="text-gray-600 shrink-0 mt-1"
                  />
                  <p className="text-[10px] font-bold text-gray-600 leading-relaxed uppercase tracking-wider">
                    By clicking pay, you agree to EduNova&apos;s Terms of
                    Service and refund policy.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.3em]">
                EduNova Security Level V.2.0
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#030712]">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
