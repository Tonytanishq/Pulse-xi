"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Calendar, Shield, Trophy, CircleDot } from "lucide-react";
import { Player } from "@/lib/players";

interface PlayerModalProps {
  player: Player | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PlayerModal({
  player,
  isOpen,
  onClose,
}: PlayerModalProps) {
  if (!player) return null;

  const stats = [
    { title: "Attendance", value: "98%", icon: <Calendar size={18} /> },
    { title: "Practices", value: "41", icon: <Shield size={18} /> },
    { title: "Matches", value: "19", icon: <Trophy size={18} /> },
    { title: "Goals", value: "1", icon: <CircleDot size={18} /> },
    { title: "Assists", value: "0", icon: <CircleDot size={18} /> },
    { title: "Yellow Cards", value: "2", icon: <CircleDot size={18} /> },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed left-1/2 top-1/2 z-50 w-[92%] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-cyan-500/30 bg-[#08101d] p-8 shadow-[0_0_60px_rgba(34,211,238,0.25)]"
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ duration: 0.25 }}
          >
            <button
              onClick={onClose}
              className="absolute right-5 top-5 rounded-full bg-white/10 p-2 transition hover:bg-red-500"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col items-center">
              <div className="mb-5 flex h-32 w-32 items-center justify-center rounded-full border-4 border-cyan-400 bg-cyan-500/10 text-6xl">
                ⚽
              </div>

              <h1 className="text-4xl font-black">{player.name}</h1>

              {player.captain && (
                <span className="mt-3 rounded-full bg-yellow-400 px-4 py-1 font-bold text-black">
                  ⭐ Captain
                </span>
              )}

              <p className="mt-3 text-xl text-cyan-300">
                #{player.jersey} • {player.primaryPosition}
              </p>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-5">
              {stats.map((stat) => (
                <div
                  key={stat.title}
                  className="rounded-2xl border border-cyan-500/20 bg-white/5 p-5"
                >
                  <div className="mb-2 flex items-center gap-2 text-cyan-300">
                    {stat.icon}
                    <span>{stat.title}</span>
                  </div>

                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}