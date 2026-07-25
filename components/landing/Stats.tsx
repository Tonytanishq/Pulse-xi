"use client";

import { motion } from "framer-motion";
import CountUp from "@/components/ui/CountUp";
import { players, teamStats } from "@/lib/players";

const STATS = [
  { label: "Squad Members", to: players.length, suffix: "" },
  { label: "Goals This Season", to: teamStats.goals, suffix: "" },
  { label: "Avg. Attendance", to: teamStats.avgAttendance, suffix: "%" },
  { label: "Assists Created", to: teamStats.assists, suffix: "" },
];

export default function Stats() {
  return (
    <section id="stats" className="relative z-10 mx-auto max-w-7xl px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="glass grid grid-cols-2 gap-y-10 rounded-3xl px-6 py-12 lg:grid-cols-4"
      >
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className={`flex flex-col items-center text-center ${
              i !== STATS.length - 1 ? "lg:border-r lg:border-white/10" : ""
            }`}
          >
            <div className="text-5xl font-black tracking-tight md:text-6xl">
              <CountUp to={s.to} suffix={s.suffix} className="gradient-text" />
            </div>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
              {s.label}
            </p>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
