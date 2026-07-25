"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { players, teamStats } from "@/lib/players";

const CHIPS = [
  { label: "Squad", value: `${players.length}` },
  { label: "Avg Attendance", value: `${teamStats.avgAttendance}%` },
  { label: "Goals", value: `${teamStats.goals}` },
];

export default function Hero() {
  return (
    <section className="relative z-10 flex min-h-screen items-center justify-center px-6 pt-28">
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-cyan-300"
        >
          <Sparkles size={14} /> BVRIT FOOTBALL CLUB
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="text-[18vw] font-black leading-[0.85] tracking-tighter sm:text-8xl md:text-9xl"
        >
          <span className="gradient-text">PULSE</span>
          <span className="text-white"> XI</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mx-auto mt-6 max-w-xl text-lg text-gray-300 md:text-xl"
        >
          The Digital Operating System for Modern Football Clubs — attendance,
          formations, analytics and player management, all in one premium platform.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <Link href="/login" className="btn-pulse">
            Enter the Club <ArrowRight size={18} />
          </Link>
          <Link href="#features" className="btn-ghost">
            Explore Features
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-4"
        >
          {CHIPS.map((c) => (
            <div
              key={c.label}
              className="glass flex items-center gap-3 rounded-2xl px-5 py-3"
            >
              <span className="text-2xl font-black text-cyan-300">{c.value}</span>
              <span className="text-xs uppercase tracking-widest text-gray-400">
                {c.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
