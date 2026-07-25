"use client";

import { motion } from "framer-motion";
import { RECENT_RESULTS, matchResult } from "@/lib/club";

const TONE: Record<string, string> = {
  W: "bg-emerald-500/20 text-emerald-300 border-emerald-400/30",
  D: "bg-amber-500/20 text-amber-300 border-amber-400/30",
  L: "bg-rose-500/20 text-rose-300 border-rose-400/30",
};

export default function FormGuide() {
  const wins = RECENT_RESULTS.filter((r) => matchResult(r) === "W").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="glass rounded-3xl p-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-bold">Recent Form</h3>
        <span className="text-xs text-gray-400">
          {wins}W · {RECENT_RESULTS.length} games
        </span>
      </div>

      <div className="mt-4 flex gap-2">
        {RECENT_RESULTS.map((r, i) => {
          const res = matchResult(r);
          return (
            <span
              key={i}
              title={`${r.opponent} ${r.scored}-${r.conceded}`}
              className={`flex h-9 w-9 items-center justify-center rounded-xl border text-sm font-bold ${TONE[res]}`}
            >
              {res}
            </span>
          );
        })}
      </div>

      <ul className="mt-5 space-y-2.5">
        {RECENT_RESULTS.slice(0, 3).map((r, i) => {
          const res = matchResult(r);
          return (
            <li
              key={i}
              className="flex items-center justify-between text-sm text-gray-300"
            >
              <span className="truncate">vs {r.opponent}</span>
              <span className="font-mono font-semibold text-white">
                {r.scored}–{r.conceded}
                <span
                  className={`ml-2 ${
                    res === "W"
                      ? "text-emerald-400"
                      : res === "D"
                        ? "text-amber-400"
                        : "text-rose-400"
                  }`}
                >
                  {res}
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}
