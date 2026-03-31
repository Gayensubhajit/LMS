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
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useAuth, useUser } from "@clerk/nextjs";
import { backendRequest } from "@/lib/backend-client";
import { formatLocalPrice } from "@/lib/utils/currency";
import { toast } from "sonner";
import { coursesData } from "@/lib/courses-data";

// Add Razorpay type for TS
declare global {
  interface Window {
    Razorpay: any;
  }
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useUser();
  const { getToken, userId } = useAuth();
  
  const slug = searchParams.get("slug");
  const plan = searchParams.get("plan");
  
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [course, setCourse] = useState<any>(null);
  
  useEffect(() => {
    if (!slug) {
      router.push("/courses");
      return;
    }
    const found = coursesData.find(c => c.slug === slug);
    if (found) {
      setCourse(found);
    }
    setLoading(false);

    // Load Razorpay Script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, [slug, router]);

  const getPrice = () => {
    if (!course) return 0;
    if (plan === "1month") return course.price.oneMonth;
    if (plan === "3month") return course.price.threeMonth;
    if (plan === "6month") return course.price.sixMonth;
    return course.price.oneMonth;
  };

  const getDurationLabel = () => {
    if (plan === "1month") return "1 Month Access";
    if (plan === "3month") return "3 Months Access";
    if (plan === "6month") return "6 Months Access";
    return "Course Access";
  };

  const handleRazorpayPayment = async () => {
    if (!userId || !course) return;
    setProcessing(true);

    try {
      // 1. Create/Check Enrollment (it will be PENDING)
      const enrollRes = await backendRequest<{ ok: boolean; item: { id: string } }>("/enrollments", {
        method: "POST",
        body: { courseSlug: course.slug, plan },
        clerkUserId: userId
      });

      if (!enrollRes.ok) {
        throw new Error("Failed to initialize enrollment");
      }

      // 2. Create Razorpay Order
      const orderRes = await backendRequest<{ 
        ok: boolean; 
        item: { orderId: string; amount: number; keyId: string; currency: string } 
      }>("/payments/create-order", {
        method: "POST",
        body: { enrollmentId: enrollRes.item.id, provider: "razorpay" },
        clerkUserId: userId
      });

      if (!orderRes.ok) {
        throw new Error("Failed to create provider order");
      }

      const { orderId, amount, keyId, currency } = orderRes.item;

      // 3. Trigger Razorpay Modal
      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: "EduNova LMS",
        description: `Enrollment for ${course.title} (${getDurationLabel()})`,
        image: "https://cdn-icons-png.flaticon.com/512/3413/3413535.png",
        order_id: orderId,
        handler: function (response: any) {
          // Success Callback (The webhook will also handle this for security)
          toast.success("Payment successful! Redirecting...");
          router.push(`/checkout/success?slug=${course.slug}`);
        },
        prefill: {
          name: user?.fullName || "",
          email: user?.primaryEmailAddress?.emailAddress || "",
        },
        theme: {
          color: "#7c3aed",
        },
        modal: {
          ondismiss: function() {
            setProcessing(false);
          }
        }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();

    } catch (err: any) {
      toast.error(err.message || "Something went wrong during checkout");
      setProcessing(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#050510]">
       <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
    </div>
  );

  if (!course) return null;

  const finalPrice = getPrice();

  return (
    <div className="min-h-screen bg-[#050510] relative overflow-hidden">
      {/* Abstract Background Glows */}
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-violet-900/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-blue-900/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-6xl mx-auto px-6 py-12 lg:py-24 relative z-10">
        <Link href={`/courses/${course.slug}`} className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors group mb-12">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Exit Checkout</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Order Summary (Left) */}
          <div className="lg:col-span-7 space-y-12">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight">Complete your <span className="text-violet-500">Enrollment</span></h1>
              <p className="text-gray-400 font-bold uppercase tracking-widest text-[11px] leading-relaxed max-w-lg">
                Join 10,000+ students mastering {course.category} with EduNova&apos;s premium learning paths.
              </p>
            </div>

            <div className="p-8 lg:p-10 rounded-[48px] bg-white/[0.03] border border-white/10 backdrop-blur-md relative overflow-hidden group">
               {/* Course Image Preview */}
               <div className="flex flex-col sm:flex-row items-center gap-8">
                  <div className="w-32 h-32 rounded-3xl bg-violet-600/20 flex items-center justify-center shrink-0 border border-violet-500/20">
                     <span className="text-5xl">{course.emoji}</span>
                  </div>
                  <div className="space-y-2 text-center sm:text-left">
                    <span className="text-[10px] font-black bg-violet-600/10 text-violet-400 px-3 py-1 rounded-full uppercase tracking-widest border border-violet-500/20">
                      {course.category}
                    </span>
                    <h2 className="text-2xl font-black text-white">{course.title}</h2>
                    <p className="text-gray-500 font-bold text-sm">Instructor: {course.instructor}</p>
                  </div>
               </div>

               <div className="h-px bg-white/5 my-10" />

               <div className="space-y-6">
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-gray-400">{getDurationLabel()} Plan</span>
                    <span className="text-white">{formatLocalPrice(finalPrice)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-gray-400">Processing Fee</span>
                    <span className="text-emerald-500">₹0.00 (Waived)</span>
                  </div>
                  <div className="h-px bg-white/10 pt-4" />
                  <div className="flex justify-between items-end">
                    <span className="text-xs font-black text-white uppercase tracking-widest">Total Amount</span>
                    <span className="text-3xl font-black text-violet-500 tracking-tight">{formatLocalPrice(finalPrice)}</span>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center gap-3 p-4 rounded-3xl bg-white/[0.01] border border-white/5">
                <ShieldCheck className="text-emerald-500 shrink-0" size={20} />
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Lifetime Access*</span>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-3xl bg-white/[0.01] border border-white/5">
                <Zap className="text-amber-500 shrink-0" size={20} />
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Verified Cert.</span>
              </div>
            </div>
          </div>

          {/* Payment Section (Right) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-10 rounded-[56px] bg-white/[0.05] border-2 border-white/10 relative shadow-[0_40px_100px_rgba(0,0,0,0.4)]">
              <div className="space-y-6 mb-12">
                <div className="flex items-center gap-3">
                  <Lock className="text-violet-500" size={20} />
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">Secure Checkout</h3>
                </div>
                <p className="text-xs font-bold text-gray-500 leading-relaxed italic">
                  Powered by <span className="text-gray-300">Razorpay</span>. Your payment is protected by industry-standard encryption.
                </p>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={handleRazorpayPayment}
                  disabled={processing}
                  className="w-full bg-violet-600 hover:bg-violet-500 disabled:bg-violet-900/50 disabled:text-gray-500 text-white font-black py-6 rounded-[2.5rem] tracking-[0.2em] uppercase text-[11px] transition-all shadow-[0_20px_60px_rgba(124,58,237,0.3)] hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-4"
                >
                  {processing ? <Loader2 className="animate-spin" size={20} /> : <CreditCard size={20} />}
                  {processing ? "Processing Order..." : "Continue to Payment"}
                </button>
                <div className="flex items-center justify-center gap-6 pt-4 opacity-40">
                  <span className="text-[10px] font-black text-white">UPI</span>
                  <span className="text-[10px] font-black text-white">CARDS</span>
                  <span className="text-[10px] font-black text-white">NETBANKING</span>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-white/5">
                <div className="flex items-start gap-4">
                  <AlertCircle size={18} className="text-gray-600 shrink-0 mt-1" />
                  <p className="text-[10px] font-bold text-gray-600 leading-relaxed uppercase tracking-wider">
                    By clicking pay, you agree to EduNova&apos;s Terms of Service and refund policy.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.3em]">EduNova Security Level V.2.0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#050510]">
           <Loader2 className="w-10 h-10 text-violet-500 animate-spin" />
        </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
