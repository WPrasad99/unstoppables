"use client";

import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";

interface RecommendationsPanelProps {
  recommendations: string[];
}

export default function RecommendationsPanel({
  recommendations,
}: RecommendationsPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      whileHover={{ scale: 1.02 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-cyan-400" />
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
          Recommendations
        </h2>
      </div>

      {recommendations.length === 0 ? (
        <div className="text-sm text-gray-600 py-4 text-center">
          No recommendations at this time.
        </div>
      ) : (
        <div className="space-y-3">
          {recommendations.map((rec, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-cyan-400/5 border border-cyan-400/10"
            >
              <span className="text-cyan-400 font-bold text-sm mt-0.5 flex-shrink-0">
                {i + 1}.
              </span>
              <p className="text-sm text-gray-300 leading-relaxed">{rec}</p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
