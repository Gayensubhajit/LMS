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
  // ... (rest of logic)
