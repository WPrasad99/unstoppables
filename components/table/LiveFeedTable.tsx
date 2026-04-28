"use client";

import { motion, AnimatePresence } from "framer-motion";
import { List, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface DecisionRecord {
  id: string;
  gender: string;
  decision: string;
  timestamp: string | Date;
}

interface LiveFeedTableProps {
  decisions: DecisionRecord[];
}

export default function LiveFeedTable({ decisions }: LiveFeedTableProps) {
  const formatTime = (ts: string | Date) => {
    const date = new Date(ts);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (ts: string | Date) => {
    const date = new Date(ts);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-card p-6 col-span-1 md:col-span-2"
    >
      <div className="flex items-center gap-2 mb-5">
        <List className="w-5 h-5 text-cyan-400" />
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
          Live Decision Feed
        </h2>
        <span className="ml-auto text-xs text-gray-600">
          Last {decisions.length} entries
        </span>
      </div>

      {decisions.length === 0 ? (
        <div className="flex items-center justify-center h-[200px] text-gray-600 text-sm">
          Waiting for incoming decisions…
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider font-medium">
                  Gender
                </th>
                <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider font-medium">
                  Decision
                </th>
                <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider font-medium">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-xs text-gray-500 uppercase tracking-wider font-medium">
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {decisions.map((d, i) => (
                  <motion.tr
                    key={d.id}
                    initial={{ opacity: 0, x: -20, backgroundColor: "rgba(0,217,126,0.1)" }}
                    animate={{ opacity: 1, x: 0, backgroundColor: "rgba(0,0,0,0)" }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.03 }}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          d.gender === "male"
                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                            : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                        }`}
                      >
                        {d.gender === "male" ? "♂" : "♀"} {d.gender}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-semibold ${
                          d.decision === "selected"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {d.decision === "selected" ? (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowDownRight className="w-3.5 h-3.5" />
                        )}
                        {d.decision}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500">
                      {formatDate(d.timestamp)}
                    </td>
                    <td className="py-3 px-4 text-gray-500 font-mono text-xs">
                      {formatTime(d.timestamp)}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
