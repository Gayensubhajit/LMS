"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  CreditCard,
  ShieldCheck,
  Lock,
  Zap,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useAuth, useUser } from "@clerk/nextjs";
import { backendRequest } from "@/lib/backend-client";
import { formatLocalPrice, formatINR } from "@/lib/utils/currency";
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
    badge: "14-Day Free Trial",
    emoji: "🚀"
  },
  "annual": {
    title: "Plus Annual",
    description: "Save big on a full year of accelerated learning and premium features.",
    price: 19999,
    period: "Annually",
    category: "Individual Plan",
    badge: "14-Day Free Trial",
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

export default function CheckoutClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isSignedIn, isLoaded } = useUser();
  const { userId } = useAuth();

  const slug = searchParams.get("slug");
  const plan = searchParams.get("plan");

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [course, setCourse] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);

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

    setLoading(false);

    // Load Razorpay Script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, [slug, plan, router]);

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
      toast.error("Information is missing. Please refresh.");
      return;
    }

    setProcessing(true);

    const targetSlug = course ? course.slug : "plus-membership";
    const targetTitle = course ? course.title : subscription.title;
    const targetPlan = plan || (subscription ? plan : "1month") || "plus";

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
        toast.success(`Welcome back! You have instant access to ${targetTitle}.`);
        setTimeout(() => router.push(`/checkout/success?slug=${course.slug}`), 1500);
        return;
      }

      const enrollmentId = enrollRes.item.id;

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
          enrollmentId, 
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
          : `Payment for ${targetTitle}`,
        image: "https://cdn-icons-png.flaticon.com/512/3413/3413535.png",
        order_id: orderId,
        handler: async function (response: any) {
          try {
            const verifyRes = await backendRequest<{ ok: boolean; message: string }>("/payments/verify", {
              method: "POST",
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                enrollmentId,
              },
              clerkUserId: userId!,
            });

            if (verifyRes.ok) {
              toast.success("Payment verified! Your membership is now active.");
              setTimeout(() => router.push(course ? `/checkout/success?slug=${course.slug}` : `/checkout/success?plan=${plan || "plus"}`), 1500);
            } else {
              toast.error("Payment received but verification failed. Please contact support.");
            }
          } catch (err) {
            toast.error("Payment received but could not activate enrollment. Please contact support.");
          }
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
      toast.error(err.message || "Something went wrong during checkout.");
      setProcessing(false);
    }
  };

  if (!isLoaded || loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f8ff] dark:bg-[#030712] transition-colors duration-700">
        <Loader2 className="w-10 h-10 text-blue-600 dark:text-blue-500 animate-spin" />
      </div>
    );

  if (!course && !subscription) return null;

  const finalPrice = getPrice();

  return (
    <div className="min-h-screen bg-[#f6f8ff] dark:bg-[#030712] relative overflow-hidden transition-colors duration-700">
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-600/5 dark:bg-blue-900/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-indigo-600/5 dark:bg-indigo-900/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-6xl mx-auto px-6 py-12 lg:py-24 relative z-10">
        <Link
          href={course ? `/courses/${course.slug}` : "/pricing"}
          className="inline-flex items-center gap-2 text-slate-400 dark:text-gray-500 hover:text-slate-900 dark:hover:text-white transition-colors group mb-12"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Exit Checkout</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-7 space-y-12">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                Complete your <span className="text-blue-600 dark:text-blue-500">Enrollment</span>
              </h1>
              <p className="text-slate-500 dark:text-gray-400 font-bold uppercase tracking-widest text-[11px] leading-relaxed max-w-lg">
                Join 10,000+ students mastering {course ? course.category : subscription.category} with EduNova.
              </p>
            </div>

            <div className="p-8 lg:p-10 rounded-[48px] bg-white dark:bg-white/3 border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-xl transition-all">
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <div className="w-24 h-24 rounded-3xl bg-blue-600/10 flex items-center justify-center shrink-0 border border-blue-500/10">
                  <span className="text-4xl">{course ? course.emoji : subscription.emoji}</span>
                </div>
                <div className="space-y-2 text-center sm:text-left">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">{course ? course.title : subscription.title}</h2>
                  <p className="text-slate-400 dark:text-gray-500 font-bold text-sm">{course ? `Instructor: ${course.instructor}` : subscription.description}</p>
                </div>
              </div>

              <div className="h-px bg-slate-100 dark:bg-white/10 my-8" />
              
              <div className="space-y-6">
                <div className="flex justify-between items-center text-sm font-bold">
                  <span className="text-slate-900 dark:text-white">{subscription ? subscription.title : `${getDurationLabel()} Plan`}</span>
                  <span className="text-slate-900 dark:text-white">{isTrialPlan ? "14-Day Free Trial" : formatPriceForDisplay(finalPrice)}</span>
                </div>
                
                <div className="h-px bg-slate-100 dark:bg-white/10 mt-8" />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-black text-slate-900 dark:text-white">Today's Total:</span>
                  <span className="text-3xl font-black text-slate-900 dark:text-white">{isTrialPlan ? "₹1" : formatPriceForDisplay(finalPrice)}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center gap-3 p-4 rounded-3xl bg-white/5 border border-white/5">
                <ShieldCheck className="text-emerald-500" size={20} />
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Lifetime Access*</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-3xl bg-white/5 border border-white/5">
                <Zap className="text-amber-500" size={20} />
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Verified Cert.</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-12 xl:col-span-5 space-y-8">
            <div className="p-8 lg:p-10 rounded-[40px] bg-white dark:bg-[#0a0a20] border border-slate-200 dark:border-white/10 relative shadow-2xl">
              <div className="space-y-6 mb-10">
                <div className="flex items-center gap-3">
                  <Lock className="text-blue-600" size={20} />
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Secure Checkout</h3>
                </div>
              </div>

              <button
                onClick={handleRazorpayPayment}
                disabled={processing}
                className="w-full bg-[#0056D2] hover:bg-[#0041a3] text-white font-black py-4 rounded-2xl tracking-[0.1em] uppercase text-[12px] transition-all flex items-center justify-center gap-3 active:scale-95"
              >
                {processing ? <Loader2 className="animate-spin" size={18} /> : <CreditCard size={18} />}
                {processing ? "Processing..." : isTrialPlan ? "Start Trial" : "Pay Now"}
              </button>
              
              <div className="mt-12 pt-8 border-t border-slate-100 dark:border-white/5 flex items-start gap-4">
                <AlertCircle size={18} className="text-gray-400 shrink-0 mt-1" />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Secure Payment via Razorpay</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
