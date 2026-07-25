"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, Trophy, Calendar, Goal, BadgeAlert } from "lucide-react";

type Player = {
  name: string;
  number: number;
  position: string;
  captain?: boolean;
};

type Props = {
  player: Player | null;
  onClose: () => void;
};

export default function PlayerModal({ player, onClose }: Props) {
  return (
    <AnimatePresence>
      {player && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.25 }}
            className="fixed left-1/2 top-1/2 z-50 w-[95%] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-cyan-500/40 bg-[#0B1220]/95 p-8 shadow-[0_0_50px_rgba(0,255,255,0.25)]"
          >
            <button
              onClick={onClose}
              className="absolute right-5 top-5 rounded-full bg-white/10 p-2 hover:bg-red-500 transition"
            >
              <X size={18} />
            </button>

            <div className="flex flex-col items-center">

              <div className="mb-4 flex h-28 w-28 items-center justify-center rounded-full border-4 border-cyan-400 bg-cyan-500/10 text-5xl">
                ⚽
              </div>

              <h2 className="text-4xl font-bold">
                {player.name}
              </h2>

              {player.captain && (
                <span className="mt-2 rounded-full bg-yellow-400 px-4 py-1 text-black font-bold">
                  🏆 CAPTAIN
                </span>
              )}

              <p className="mt-3 text-cyan-300 text-xl">
                #{player.number} • {player.position}
              </p>

            </div>

            <div className="mt-8 grid grid-cols-2 gap-5">

              <StatCard
                icon={<Calendar size={18} />}
                title="Attendance"
                value="98%"
              />

              <StatCard
                icon={<Shield size={18} />}
                title="Practices"
                value="41"
              />

              <StatCard
                icon={<Trophy size={18} />}
                title="Matches"
                value="19"
              />

              <StatCard
                icon={<Goal size={18} />}
                title="Goals"
                value="1"
              />

              <StatCard
                icon={<Goal size={18} />}
                title="Assists"
                value="0"
              />

              <StatCard
                icon={<BadgeAlert size={18} />}
                title="Yellow Cards"
                value="2"
              />

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function StatCard({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-cyan-500/20 bg-white/5 p-4">
      <div className="mb-2 flex items-center gap-2 text-cyan-300">
        {icon}
        <span>{title}</span>
      </div>

      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}