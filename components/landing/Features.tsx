"use client";

import { motion } from "framer-motion";
import {
  ClipboardCheck,
  LayoutGrid,
  BarChart3,
  Users,
  Trophy,
  Radio,
} from "lucide-react";

const FEATURES = [
  {
    icon: ClipboardCheck,
    title: "Smart Attendance",
    desc: "Mark, search and track availability in seconds. Live present / absent stats and one-tap bulk actions.",
    accent: "from-cyan-400/20 to-cyan-500/5",
  },
  {
    icon: LayoutGrid,
    title: "Formation Builder",
    desc: "Craft the perfect XI on an interactive pitch. 4-3-3, 4-2-3-1, 3-5-2 and more, with a live bench.",
    accent: "from-blue-400/20 to-blue-500/5",
  },
  {
    icon: Users,
    title: "Player Database",
    desc: "Pro-grade profiles — goals, assists, fitness, cards, medical status and performance history.",
    accent: "from-emerald-400/20 to-emerald-500/5",
  },
  {
    icon: BarChart3,
    title: "Deep Analytics",
    desc: "Attendance trends, win rate, position distribution and form curves rendered beautifully.",
    accent: "from-violet-400/20 to-violet-500/5",
  },
  {
    icon: Trophy,
    title: "Leaderboards",
    desc: "Top scorers, most consistent, training MVP and Player of the Month — ranked automatically.",
    accent: "from-amber-400/20 to-amber-500/5",
  },
  {
    icon: Radio,
    title: "Team Hub",
    desc: "Announcements, training calendar, polls and coach messages — the club's nerve centre.",
    accent: "from-pink-400/20 to-pink-500/5",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative z-10 mx-auto max-w-7xl px-6 py-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-2xl text-center"
      >
        <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-xs font-semibold tracking-[0.2em] text-cyan-300">
          EVERYTHING IN ONE PLACE
        </span>
        <h2 className="mt-6 text-4xl font-black tracking-tight md:text-5xl">
          Run your club like a <span className="gradient-text">pro academy</span>
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-gray-400">
          PULSE XI replaces spreadsheets and group chats with one premium platform
          built for the way football clubs actually work.
        </p>
      </motion.div>

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f, i) => {
          const Icon = f.icon;
          return (
            <motion.article
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="glass glass-hover group relative overflow-hidden rounded-3xl p-7"
            >
              <div
                className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${f.accent} blur-2xl transition-opacity duration-500 group-hover:opacity-100`}
              />
              <div className="relative">
                <div className="mb-5 inline-flex h-13 w-13 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-cyan-300">
                  <Icon size={26} />
                </div>
                <h3 className="text-xl font-bold">{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-400">{f.desc}</p>
              </div>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
