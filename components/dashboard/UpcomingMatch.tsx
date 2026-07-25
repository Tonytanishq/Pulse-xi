"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Trophy, CalendarClock } from "lucide-react";
import { CLUB, UPCOMING_MATCH } from "@/lib/club";

function useCountdown(iso: string) {
  const [left, setLeft] = useState<{ d: number; h: number; m: number } | null>(
    null,
  );
  useEffect(() => {
    const tick = () => {
      const diff = new Date(iso).getTime() - Date.now();
      const clamped = Math.max(diff, 0);
      setLeft({
        d: Math.floor(clamped / 86400000),
        h: Math.floor((clamped / 3600000) % 24),
        m: Math.floor((clamped / 60000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, [iso]);
  return left;
}

export default function UpcomingMatch() {
  const left = useCountdown(UPCOMING_MATCH.kickoff);
  const date = new Date(UPCOMING_MATCH.kickoff);

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass relative overflow-hidden rounded-3xl p-7"
    >
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-cyan-500/20 blur-[90px]" />

      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-300">
            <CalendarClock size={13} /> Next Match
          </span>
          <span className="text-xs text-gray-400">
            {date.toLocaleDateString("en-GB", {
              weekday: "short",
              day: "numeric",
              month: "short",
            })}{" "}
            ·{" "}
            {date.toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 text-2xl font-black text-[#04121a]">
              {CLUB.short.split(" ")[0].charAt(0)}
            </div>
            <p className="mt-2 text-sm font-bold">{CLUB.short}</p>
            <p className="text-[11px] text-gray-500">
              {UPCOMING_MATCH.home ? "Home" : "Away"}
            </p>
          </div>

          <div className="text-center">
            <div className="text-3xl font-black text-gray-600">VS</div>
            {left && (
              <div className="mt-2 flex gap-1.5 text-cyan-300">
                {[
                  { v: left.d, l: "D" },
                  { v: left.h, l: "H" },
                  { v: left.m, l: "M" },
                ].map((t) => (
                  <div
                    key={t.l}
                    className="rounded-lg border border-white/10 bg-white/5 px-2 py-1"
                  >
                    <span className="text-base font-bold">
                      {String(t.v).padStart(2, "0")}
                    </span>
                    <span className="ml-0.5 text-[10px] text-gray-500">{t.l}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-2xl font-black text-gray-300">
              {UPCOMING_MATCH.opponent.charAt(0)}
            </div>
            <p className="mt-2 text-sm font-bold">{UPCOMING_MATCH.opponent}</p>
            <p className="text-[11px] text-gray-500">Opponent</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/10 pt-4 text-xs text-gray-400">
          <span className="inline-flex items-center gap-1.5">
            <Trophy size={13} className="text-cyan-400" />
            {UPCOMING_MATCH.competition}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={13} className="text-cyan-400" />
            {UPCOMING_MATCH.venue}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
