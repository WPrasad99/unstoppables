"use client";

import { motion } from "framer-motion";
import { Shield, TrendingUp, AlertTriangle } from "lucide-react";

interface BiasSummaryCardProps {
  fairnessPercentage: number;
  biasScore: number;
  biasLevel: "Low" | "Medium" | "High";
  totalDecisions: number;
}

export default function BiasSummaryCard({
  fairnessPercentage,
  biasScore,
  biasLevel,
  totalDecisions,
}: BiasSummaryCardProps) {
  const getLevelConfig = (level: string) => {
    switch (level) {
      case "Low":
        return {
          color: "text-emerald-400",
          bg: "bg-emerald-400/10",
          border: "border-emerald-400/20",
          ringColor: "#10b981",
        };
      case "Medium":
        return {
          color: "text-amber-400",
          bg: "bg-amber-400/10",
          border: "border-amber-400/20",
          ringColor: "#f59e0b",
        };
      case "High":
        return {
          color: "text-rose-400",
          bg: "bg-rose-400/10",
          border: "border-rose-400/20",
          ringColor: "#ef4444",
        };
      default:
        return {
          color: "text-slate-400",
          bg: "bg-slate-400/10",
          border: "border-slate-400/20",
          ringColor: "#64748b",
        };
    }
  };

  const config = getLevelConfig(biasLevel);

  // SVG ring progress
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const progress = (fairnessPercentage / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-10 col-span-1 md:col-span-2 lg:col-span-1 border-white/5"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
          <Shield className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em]">
            Fairness Pulse
          </h2>
          <p className="text-xs text-gray-500">Real-time health index</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-10">
        {/* Fairness Ring */}
        <div className="relative flex-shrink-0 group">
          <svg width="160" height="160" className="-rotate-90 filter drop-shadow-[0_0_15px_rgba(139,92,246,0.1)]">
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.03)"
              strokeWidth="12"
            />
            <motion.circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke={config.ringColor}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: circumference - progress }}
              transition={{ duration: 2, ease: "circOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              key={fairnessPercentage}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl font-extrabold tracking-tighter"
            >
              {fairnessPercentage}%
            </motion.span>
            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mt-1">Health</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 flex flex-col justify-center space-y-5">
          <div className="space-y-1 relative">
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
              <span>Bias Intensity</span>
              <TrendingUp className="w-3 h-3 text-white/20" />
            </div>
            <div className="flex items-baseline gap-1">
              <motion.span
                key={biasScore}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-black tracking-tighter text-white"
              >
                {biasScore}
              </motion.span>
              <span className="text-gray-500 font-bold text-base">%</span>
            </div>
          </div>

          <div className="space-y-2 relative">
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">
              <span>Risk Rating</span>
              <AlertTriangle className="w-3 h-3 text-white/20" />
            </div>
            <div className="flex">
              <div
                className={`inline-flex items-center px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${config.bg} ${config.color} border ${config.border} backdrop-blur-md`}
              >
                {biasLevel} Priority
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 text-[11px] font-medium text-zinc-500 italic">
            Computed from {totalDecisions.toLocaleString()} audited events
          </div>
        </div>
      </div>
    </motion.div>
  );
}

