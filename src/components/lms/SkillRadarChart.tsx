"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "next-themes";

interface SkillRadarChartProps {
  data?: { subject: string; A: number; fullMark: number }[];
}

const defaultData = [
  { subject: "Engineering", A: 92, fullMark: 100 },
  { subject: "Strategy", A: 85, fullMark: 100 },
  { subject: "Design", A: 78, fullMark: 100 },
  { subject: "Communication", A: 88, fullMark: 100 },
  { subject: "Leadership", A: 75, fullMark: 100 },
  { subject: "Innovation", A: 95, fullMark: 100 },
];

export default function SkillRadarChart({ data = defaultData }: SkillRadarChartProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.7, ease: [0.21, 0.45, 0.32, 0.9] }}
      className="w-full h-full min-h-[300px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid 
            stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} 
            gridType="polygon"
          />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: isDark ? "#94a3b8" : "#64748b", fontSize: 10, fontWeight: 900 }}
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]} 
            tick={false} 
            axisLine={false} 
          />
          <Radar
            name="Skills"
            dataKey="A"
            stroke="#6366f1"
            strokeWidth={2}
            fill="url(#radarGradient)"
            fillOpacity={0.6}
            animationDuration={1500}
            animationEasing="ease-out"
          />
          <defs>
            <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0.2} />
            </linearGradient>
          </defs>
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
