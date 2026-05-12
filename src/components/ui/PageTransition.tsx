"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type TransitionVariant = "default" | "slide" | "scale" | "fade";

interface PageTransitionProps {
  children: ReactNode;
  variant?: TransitionVariant;
  duration?: number;
}

const variants: Record<
  TransitionVariant,
  { initial: object; animate: object; exit: object }
> = {
  default: {
    initial: { opacity: 0, y: 20, scale: 0.98, filter: "blur(10px)" },
    animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
    exit: { opacity: 0, y: -20, scale: 1.02, filter: "blur(10px)" },
  },
  slide: {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.92 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.08 },
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
};

export function PageTransition({
  children,
  variant = "default",
  duration = 0.6,
}: PageTransitionProps) {
  const v = variants[variant];
  return (
    <motion.div
      initial={v.initial}
      animate={v.animate}
      exit={v.exit}
      transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
