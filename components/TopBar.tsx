"use client";

import { motion } from "framer-motion";
import { Activity, Radio, Hash } from "lucide-react";

interface TopBarProps {
  companyName?: string;
  totalDecisions: number;
  lastUpdated: Date | null;
  isConnected: boolean;
}

export default function TopBar({
  companyName,
  totalDecisions,
  lastUpdated,
  isConnected,
}: TopBarProps) {
  const getTimeAgo = (date: Date | null) => {
    if (!date) return "Never";
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 5) return "Just now";
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ago`;
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card px-6 py-4 mb-6 flex items-center justify-between flex-wrap gap-4"
    >
      {/* Left: Title + Company */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Activity className="w-6 h-6 text-purple-400" />
          <h1 className="text-xl font-bold gradient-text">
            AI Bias Monitoring System
          </h1>
        </div>
        {companyName && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5">
            <span className="text-xs text-gray-400">Monitoring:</span>
            <span className="text-sm font-semibold text-cyan-400">
              {companyName}
            </span>
          </div>
        )}
      </div>

      {/* Right: Live indicators */}
      <div className="flex items-center gap-5">
        {/* Events processed counter */}
        <div className="flex items-center gap-2">
          <Hash className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-400">Events processed:</span>
          <motion.span
            key={totalDecisions}
            initial={{ scale: 1.3, color: "#00d97e" }}
            animate={{ scale: 1, color: "#f5f5f5" }}
            transition={{ duration: 0.4 }}
            className="text-sm font-bold"
          >
            {totalDecisions.toLocaleString()}
          </motion.span>
        </div>

        {/* Live status */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <div
              className={`w-2.5 h-2.5 rounded-full ${isConnected ? "bg-green-400 live-pulse" : "bg-red-400"}`}
            />
          </div>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Radio className="w-3 h-3" />
            {isConnected ? "Receiving live decisions…" : "Disconnected"}
          </span>
        </div>

        {/* Last updated */}
        <span className="text-xs text-gray-500 hidden md:block">
          Updated {getTimeAgo(lastUpdated)}
        </span>
      </div>
    </motion.header>
  );
}
