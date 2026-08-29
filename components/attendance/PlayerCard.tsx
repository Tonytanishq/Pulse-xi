"use client";

import { motion } from "framer-motion";
import { Star, Check, X } from "lucide-react";
import { GROUP_ACCENT, positionGroup, type Player } from "@/lib/players";

interface PlayerCardProps {
  player: Player;
  status: "present" | "absent";
  onToggle: (status: "present" | "absent") => void;
  onViewProfile: () => void;
  index?: number;
}

function titleCase(name: string) {
  return name
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function PlayerCard({
  player,
  status,
  onToggle,
  onViewProfile,
  index = 0,
}: PlayerCardProps) {
  const accent = GROUP_ACCENT[player.group ?? positionGroup(player.primaryPosition)];
  const present = status === "present";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.02, 0.25) }}
      onClick={onViewProfile}
      className={`glass glass-hover group relative cursor-pointer overflow-hidden rounded-3xl p-5 ${
        present
          ? "shadow-[inset_0_0_0_1px_rgba(52,211,153,0.35)]"
          : "shadow-[inset_0_0_0_1px_rgba(244,63,94,0.35)]"
      }`}
    >
      <span
        className={`absolute left-0 top-0 h-full w-1 ${
          present ? "bg-emerald-400" : "bg-rose-400"
        }`}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div
            className="text-3xl font-black leading-none"
            style={{ color: accent }}
          >
            #{player.jersey}
          </div>
          <h3 className="mt-2 flex items-center gap-1.5 truncate text-lg font-bold">
            {titleCase(player.name)}
            {player.captain && (
              <Star size={13} className="fill-amber-400 text-amber-400" />
            )}
          </h3>
          <p className="text-xs uppercase tracking-widest text-gray-400">
            {player.primaryPosition}
          </p>
        </div>

        <div
          className="flex flex-col gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onToggle("present")}
            aria-label="Mark present"
            className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
              present
                ? "bg-emerald-500 text-white"
                : "bg-white/5 text-gray-400 hover:bg-emerald-500/30 hover:text-emerald-200"
            }`}
          >
            <Check size={18} />
          </button>
          <button
            onClick={() => onToggle("absent")}
            aria-label="Mark absent"
            className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
              !present
                ? "bg-rose-500 text-white"
                : "bg-white/5 text-gray-400 hover:bg-rose-500/30 hover:text-rose-200"
            }`}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
        <span
          className={`text-xs font-semibold ${
            present ? "text-emerald-300" : "text-rose-300"
          }`}
        >
          {present ? "Present" : "Absent"}
        </span>
        <span className="text-[11px] text-gray-500 opacity-0 transition group-hover:opacity-100">
          View profile →
        </span>
      </div>
    </motion.div>
  );
}
