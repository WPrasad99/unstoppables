"use client";

import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface SelectionBarChartProps {
  maleSelectionRate: number;
  femaleSelectionRate: number;
}

export default function SelectionBarChart({
  maleSelectionRate,
  femaleSelectionRate,
}: SelectionBarChartProps) {
  const data = [
    { name: "Male", rate: maleSelectionRate, fill: "#3b82f6" },
    { name: "Female", rate: femaleSelectionRate, fill: "#a78bfa" },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card px-3 py-2 text-sm">
          <p className="text-white font-medium">{payload[0].payload.name}</p>
          <p className="text-gray-400">
            Selection Rate:{" "}
            <span className="text-white font-bold">{payload[0].value}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card p-10 col-span-1 border-white/5"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <BarChart3 className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em]">
            Selection Parity
          </h2>
          <p className="text-xs text-gray-500">Gender parity analysis</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} barCategoryGap="25%">
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.03)"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            tick={{ fill: "#71717a", fontSize: 13, fontWeight: 600 }}
            axisLine={{ stroke: "rgba(255,255,255,0.05)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#3f3f46", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip content={<CustomTooltip />} cursor={false} />
          <Bar dataKey="rate" radius={[12, 12, 0, 0]} maxBarSize={70}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.fill} 
                className="filter drop-shadow-[0_0_10px_rgba(59,130,246,0.2)]"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
