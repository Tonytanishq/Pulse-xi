"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const QUOTES = [
  {
    text: "PULSE XI turned our messy WhatsApp roll-calls into a proper matchday operation. It genuinely feels like a pro club's system.",
    name: "Tony",
    role: "Captain · BVRIT FC",
    initials: "T",
  },
  {
    text: "The formation builder and fitness flags let me pick the XI in minutes. I can finally coach instead of doing admin.",
    name: "Coach R.",
    role: "Head Coach",
    initials: "R",
  },
  {
    text: "Seeing my goals, assists and attendance in one profile is addictive. Everyone wants to climb the leaderboard now.",
    name: "Siddhu",
    role: "Striker · #11",
    initials: "S",
  },
];

export default function Testimonials() {
  return (
    <section className="relative z-10 mx-auto max-w-7xl px-6 py-28">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-2xl text-center"
      >
        <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1 text-xs font-semibold tracking-[0.2em] text-cyan-300">
          FROM THE DRESSING ROOM
        </span>
        <h2 className="mt-6 text-4xl font-black tracking-tight md:text-5xl">
          Loved by players &amp; staff
        </h2>
      </motion.div>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {QUOTES.map((q, i) => (
          <motion.figure
            key={q.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass flex flex-col rounded-3xl p-7"
          >
            <Quote className="text-cyan-400/60" size={28} />
            <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-gray-300">
              &ldquo;{q.text}&rdquo;
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 font-bold text-[#04121a]">
                {q.initials}
              </span>
              <span>
                <span className="block font-semibold">{q.name}</span>
                <span className="block text-xs text-gray-400">{q.role}</span>
              </span>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
