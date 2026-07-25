"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { GROUP_ACCENT, type Player } from "@/lib/players";

const STATUS_TONE: Record<string, string> = {
  "Match Fit": "text-emerald-300 bg-emerald-500/15 border-emerald-400/25",
  Knock: "text-amber-300 bg-amber-500/15 border-amber-400/25",
  Recovering: "text-sky-300 bg-sky-500/15 border-sky-400/25",
  Injured: "text-rose-300 bg-rose-500/15 border-rose-400/25",
};

function titleCase(name: string) {
  return name
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function SquadCard({ player, index }: { player: Player; index: number }) {
  const accent = GROUP_ACCENT[player.group ?? "MID"];

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.03, 0.3) }}
      className="glass glass-hover group relative overflow-hidden rounded-3xl p-5"
    >
      <div
        className="absolute -right-10 -top-10 h-28 w-28 rounded-full blur-2xl"
        style={{ background: `${accent}26` }}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <div
            className="text-4xl font-black leading-none"
            style={{ color: accent }}
          >
            {player.jersey}
          </div>
          <h3 className="mt-2 flex items-center gap-1.5 text-lg font-bold">
            {titleCase(player.name)}
            {player.captain && (
              <Star size={14} className="fill-amber-400 text-amber-400" />
            )}
          </h3>
          <p className="text-xs uppercase tracking-widest text-gray-400">
            {player.position} · {player.foot}-footed
          </p>
        </div>
        <span
          className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${
            STATUS_TONE[player.status ?? "Match Fit"]
          }`}
        >
          {player.status}
        </span>
      </div>

      <div className="relative mt-5 grid grid-cols-3 gap-2 border-t border-white/10 pt-4">
        {[
          { label: "Goals", value: player.goals },
          { label: "Assists", value: player.assists },
          { label: "Apps", value: player.matches },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-xl font-black">{s.value}</div>
            <div className="text-[10px] uppercase tracking-wide text-gray-500">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Attendance bar */}
      <div className="relative mt-4">
        <div className="flex items-center justify-between text-[11px] text-gray-400">
          <span>Attendance</span>
          <span className="font-semibold text-white">{player.attendance}%</span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full"
            style={{
              width: `${player.attendance}%`,
              background: `linear-gradient(90deg, ${accent}, #67e8f9)`,
            }}
          />
        </div>
      </div>
    </motion.article>
  );
}
