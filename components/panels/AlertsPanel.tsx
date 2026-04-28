"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface AlertsPanelProps {
  alerts: string[];
}

export default function AlertsPanel({ alerts }: AlertsPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-amber-400" />
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
          Alerts
        </h2>
        {alerts.length > 0 && (
          <span className="ml-auto bg-amber-400/10 text-amber-400 text-xs font-bold px-2 py-0.5 rounded-full border border-amber-400/20">
            {alerts.length}
          </span>
        )}
      </div>

      {alerts.length === 0 ? (
        <div className="text-sm text-gray-600 py-4 text-center">
          ✅ No active alerts — system is operating normally.
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-amber-400/5 border border-amber-400/10"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
              <p className="text-sm text-gray-300 leading-relaxed">{alert}</p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
