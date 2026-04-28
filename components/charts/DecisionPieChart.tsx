"use client";

import { motion } from "framer-motion";
import { PieChart as PieIcon } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface DecisionPieChartProps {
  totalSelected: number;
  totalRejected: number;
}

export default function DecisionPieChart({
  totalSelected,
  totalRejected,
}: DecisionPieChartProps) {
  const data = [
    { name: "Selected", value: totalSelected, fill: "#00d97e" },
    { name: "Rejected", value: totalRejected, fill: "#ef4444" },
  ];

  const total = totalSelected + totalRejected;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const pct = total > 0 ? ((payload[0].value / total) * 100).toFixed(1) : 0;
      return (
        <div className="glass-card px-3 py-2 text-sm">
          <p className="text-white font-medium">{payload[0].name}</p>
          <p className="text-gray-400">
            Count:{" "}
            <span className="text-white font-bold">{payload[0].value}</span>
          </p>
          <p className="text-gray-400">
            Share: <span className="text-white font-bold">{pct}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex justify-center gap-6 mt-2">
        {payload.map((entry: any, index: number) => (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-gray-400">
              {entry.value}: {data[index].value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card p-10 col-span-1 border-white/5"
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
          <PieIcon className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-[0.2em]">
            System Output
          </h2>
          <p className="text-xs text-gray-500">Distribution of choices</p>
        </div>
      </div>

      {total === 0 ? (
        <div className="flex flex-col items-center justify-center h-[260px] text-zinc-600 gap-2">
          <PieIcon className="w-10 h-10 opacity-20" />
          <p className="text-xs font-bold uppercase tracking-widest">Awaiting Analysis</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={6}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.fill} 
                  className={`filter drop-shadow-[0_0_12px_${entry.fill}40]`}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={renderLegend} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
}
