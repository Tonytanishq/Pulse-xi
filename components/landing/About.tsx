"use client";

import { motion } from "framer-motion";
import { Award, Users, CalendarDays, Target } from "lucide-react";
import { CLUB } from "@/lib/club";

const ACHIEVEMENTS = [
  { icon: Award, title: "Premier Cup Finalists", meta: "2025 Season" },
  { icon: Target, title: "Top Scoring Side", meta: "Inter-College League" },
  { icon: Users, title: "28 Registered Players", meta: "Deepest squad on campus" },
  { icon: CalendarDays, title: "Founded", meta: `${CLUB.founded} · ${CLUB.short}` },
];

export default function About() {
  return (
    <section id="about" className="relative z-10 mx-auto max-w-7xl px-6 py-28">
      <div className="grid items-center gap-14 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-xs font-semibold tracking-[0.2em] text-cyan-300">
            ABOUT THE CLUB
          </span>
          <h2 className="mt-6 text-4xl font-black tracking-tight md:text-5xl">
            Built for the club, <br />
            <span className="gradient-text">by the club.</span>
          </h2>
          <p className="mt-6 max-w-lg text-gray-400">
            {CLUB.name} plays with intent — high press, quick transitions and a squad
            that shows up. PULSE XI is our home base: every session logged, every lineup
            planned, every stat that matters, in one place. Designed to scale from a
            college side to any club that takes the game seriously.
          </p>
          <div className="mt-8 flex flex-wrap gap-6">
            <div>
              <div className="text-3xl font-black text-cyan-300">100%</div>
              <div className="text-xs uppercase tracking-widest text-gray-500">
                Digital matchday
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-cyan-300">0</div>
              <div className="text-xs uppercase tracking-widest text-gray-500">
                Spreadsheets left
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-cyan-300">24/7</div>
              <div className="text-xs uppercase tracking-widest text-gray-500">
                Squad access
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="grid gap-4 sm:grid-cols-2"
        >
          {ACHIEVEMENTS.map((a) => {
            const Icon = a.icon;
            return (
              <div key={a.title} className="glass glass-hover rounded-3xl p-6">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
                  <Icon size={22} />
                </div>
                <h3 className="font-bold leading-snug">{a.title}</h3>
                <p className="mt-1 text-xs text-gray-400">{a.meta}</p>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
