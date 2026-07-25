"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ClipboardCheck, LayoutGrid, Users, Trophy } from "lucide-react";

const ACTIONS = [
  {
    label: "Take Attendance",
    href: "/attendance",
    icon: ClipboardCheck,
    primary: true,
  },
  { label: "Build Formation", href: "/formation", icon: LayoutGrid },
  { label: "View Squad", href: "/admin", icon: Users },
  { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
];

export default function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.05 }}
    >
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.14em] text-gray-400">
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {ACTIONS.map((a) => {
          const Icon = a.icon;
          return (
            <Link
              key={a.label}
              href={a.href}
              className={`glass glass-hover flex flex-col gap-3 rounded-2xl p-5 ${
                a.primary ? "glow-ring" : ""
              }`}
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                  a.primary
                    ? "bg-gradient-to-br from-cyan-400 to-blue-500 text-[#04121a]"
                    : "border border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
                }`}
              >
                <Icon size={22} />
              </span>
              <span className="text-sm font-semibold">{a.label}</span>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}
