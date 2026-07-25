"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CLUB } from "@/lib/club";

const COLUMNS = [
  {
    title: "Platform",
    links: [
      { label: "Attendance", href: "/attendance" },
      { label: "Formation", href: "/formation" },
      { label: "Squad", href: "/admin" },
      { label: "Leaderboard", href: "/leaderboard" },
    ],
  },
  {
    title: "Club",
    links: [
      { label: "About", href: "#about" },
      { label: "Features", href: "#features" },
      { label: "Stats", href: "#stats" },
      { label: "Contact", href: "#contact" },
    ],
  },
];

export default function Footer() {
  return (
    <footer id="contact" className="relative z-10 mt-16 px-6 pb-10">
      <div className="mx-auto max-w-7xl">
        {/* CTA band */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="glass relative overflow-hidden rounded-3xl px-8 py-14 text-center"
        >
          <div className="absolute -left-20 top-0 h-56 w-56 rounded-full bg-cyan-500/20 blur-[120px]" />
          <div className="absolute -right-20 bottom-0 h-56 w-56 rounded-full bg-blue-600/20 blur-[120px]" />
          <h2 className="relative text-3xl font-black tracking-tight md:text-4xl">
            Ready to run your club with <span className="gradient-text">PULSE XI</span>?
          </h2>
          <p className="relative mx-auto mt-4 max-w-lg text-gray-400">
            Step inside the operating system built for modern football clubs.
          </p>
          <Link href="/login" className="btn-pulse relative mt-8">
            Enter the Club <ArrowRight size={18} />
          </Link>
        </motion.div>

        {/* Links */}
        <div className="mt-14 grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <div className="text-2xl font-black tracking-widest text-cyan-400">
              {CLUB.product}
            </div>
            <p className="mt-3 max-w-xs text-sm text-gray-400">{CLUB.tagline}</p>
            <p className="mt-4 text-xs text-gray-600">
              {CLUB.name} · Season {CLUB.season}
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-300">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-3 text-sm text-gray-400">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="transition hover:text-cyan-300">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-gray-500 sm:flex-row">
          <p>© {new Date().getFullYear()} {CLUB.product}. Crafted for {CLUB.short}.</p>
          <p>Built with Next.js · Designed like a matchday.</p>
        </div>
      </div>
    </footer>
  );
}
