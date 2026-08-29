"use client";

import { motion } from "framer-motion";
import { players } from "@/lib/players";

const top = [...players]
  .sort((a, b) => (b.goals ?? 0) + (b.assists ?? 0) * 0.5 - ((a.goals ?? 0) + (a.assists ?? 0) * 0.5))
  .slice(0, 5);

export default function TopPerformers() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass rounded-3xl p-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-bold">Top Performers</h3>
        <span className="text-xs text-gray-400">G + A</span>
      </div>

      <ul className="mt-4 space-y-1.5">
        {top.map((p, i) => (
          <li
            key={p.id}
            className="flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-white/5"
          >
            <span
              className={`w-5 text-center text-sm font-bold ${
                i === 0 ? "text-cyan-300" : "text-gray-500"
              }`}
            >
              {i + 1}
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-xs font-bold text-cyan-200">
              {p.jersey}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {p.name.charAt(0) + p.name.slice(1).toLowerCase()}
              </p>
              <p className="text-[11px] text-gray-500">{p.primaryPosition}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-white">{p.goals}</p>
              <p className="text-[10px] uppercase tracking-wide text-gray-500">
                {p.assists} ast
              </p>
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
