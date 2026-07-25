"use client";

import { motion } from "framer-motion";
import { ACTIVITY } from "@/lib/club";

const DOT: Record<string, string> = {
  pulse: "bg-cyan-400",
  win: "bg-emerald-400",
  caution: "bg-amber-400",
  electric: "bg-blue-400",
};

export default function ActivityFeed() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="glass rounded-3xl p-6"
    >
      <h3 className="font-bold">Recent Activity</h3>
      <ol className="mt-5 space-y-5">
        {ACTIVITY.map((a, i) => (
          <li key={i} className="relative flex gap-4 pl-1">
            {i !== ACTIVITY.length - 1 && (
              <span className="absolute left-[7px] top-5 h-full w-px bg-white/10" />
            )}
            <span
              className={`relative mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full ${DOT[a.tone]} shadow-[0_0_10px] shadow-cyan-400/40`}
            />
            <div className="flex-1">
              <p className="text-sm text-gray-200">
                <span className="mr-1.5">{a.icon}</span>
                {a.text}
              </p>
              <p className="mt-0.5 text-xs text-gray-500">{a.time}</p>
            </div>
          </li>
        ))}
      </ol>
    </motion.div>
  );
}
