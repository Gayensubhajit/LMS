"use client";

import React, { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, Loader2, RefreshCw, Bookmark, History } from "lucide-react";
import Navbar from "@/components/lms/Navbar";
import Footer from "@/components/lms/Footer";
import RoadmapTimeline from "@/components/lms/RoadmapTimeline";
import { backendRequest } from "@/lib/backend-client";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function AIRoadmapBuilder() {
  const { user, isLoaded } = useUser();
  const searchParams = useSearchParams();
  // ... (rest of the component)
