"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import CountUp from "./CountUp";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  suffix?: string;
  decimals?: number;
  accent?: string; // hex
  hint?: string;
  delay?: number;
}

export default function StatCard({
  label,
  value,
  icon: Icon,
  suffix = "",
  decimals = 0,
  accent = "#22d3ee",
  hint,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass glass-hover relative overflow-hidden rounded-3xl p-6"
    >
      <div
        className="absolute -right-8 -top-8 h-28 w-28 rounded-full blur-2xl"
        style={{ background: `${accent}22` }}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
            {label}
          </p>
          <div className="mt-3 text-4xl font-black tracking-tight md:text-5xl">
            <CountUp
              to={value}
              suffix={suffix}
              decimals={decimals}
              className="text-white"
            />
          </div>
          {hint && <p className="mt-2 text-xs text-gray-500">{hint}</p>}
        </div>
        <div
          className="flex h-11 w-11 items-center justify-center rounded-2xl border"
          style={{
            color: accent,
            borderColor: `${accent}40`,
            background: `${accent}14`,
          }}
        >
          <Icon size={22} />
        </div>
      </div>
    </motion.div>
  );
}
