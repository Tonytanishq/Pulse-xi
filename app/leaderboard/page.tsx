"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Goal, Handshake, CalendarCheck, Trophy, Star } from "lucide-react";

import AppShell from "@/components/app/AppShell";
import { players, GROUP_ACCENT, type Player } from "@/lib/players";

type Metric = "goals" | "assists" | "attendance" | "matches" | "rating";

const CATEGORIES: {
  key: Metric;
  label: string;
  icon: typeof Goal;
  unit?: string;
  decimals?: number;
}[] = [
  { key: "goals", label: "Top Scorers", icon: Goal },
  { key: "assists", label: "Top Assists", icon: Handshake },
  { key: "attendance", label: "Attendance", icon: CalendarCheck, unit: "%" },
  { key: "matches", label: "Most Matches", icon: Trophy },
  { key: "rating", label: "Most Consistent", icon: Star, decimals: 1 },
];

function titleCase(name: string) {
  return name
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const PODIUM_ORDER = [1, 0, 2]; // left=silver, center=gold, right=bronze
// Indexed by finishing position (0=gold,1=silver,2=bronze): gold is tallest.
const PODIUM_HEIGHT = ["h-40", "h-28", "h-20"];
const MEDAL = ["🥇", "🥈", "🥉"];

export default function LeaderboardPage() {
  const [metric, setMetric] = useState<Metric>("goals");
  const cat = CATEGORIES.find((c) => c.key === metric)!;

  const ranked = useMemo(
    () => [...players].sort((a, b) => (b[metric] ?? 0) - (a[metric] ?? 0)),
    [metric],
  );

  const podium = ranked.slice(0, 3);
  const rest = ranked.slice(3, 12);

  const fmt = (p: Player) => {
    const v = p[metric] ?? 0;
    return `${cat.decimals ? v.toFixed(cat.decimals) : v}${cat.unit ?? ""}`;
  };

  return (
    <AppShell title="Leaderboard" subtitle="Who's carrying the club this season">
      {/* Category tabs */}
      <div className="mb-8 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => {
          const Icon = c.icon;
          const active = c.key === metric;
          return (
            <button
              key={c.key}
              onClick={() => setMetric(c.key)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                active
                  ? "bg-cyan-400 text-[#04121a]"
                  : "border border-white/10 bg-white/5 text-gray-300 hover:text-cyan-200"
              }`}
            >
              <Icon size={16} />
              {c.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={metric}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35 }}
        >
          {/* Podium */}
          <div className="mb-8 grid grid-cols-3 items-end gap-3 sm:gap-6">
            {PODIUM_ORDER.map((idx, col) => {
              const p = podium[idx];
              if (!p) return <div key={col} />;
              const accent = GROUP_ACCENT[p.group ?? "MID"];
              return (
                <div key={p.id} className="flex flex-col items-center">
                  <div className="mb-3 text-3xl">{MEDAL[idx]}</div>
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-black"
                    style={{ background: `${accent}22`, color: accent }}
                  >
                    {p.jersey}
                  </div>
                  <p className="mt-2 text-center text-sm font-bold leading-tight">
                    {titleCase(p.name)}
                  </p>
                  <p className="text-xs text-cyan-300">{fmt(p)}</p>
                  <div
                    className={`glass mt-3 w-full ${PODIUM_HEIGHT[idx]} rounded-t-2xl`}
                    style={{
                      background: `linear-gradient(180deg, ${accent}22, transparent)`,
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Rest of the ranking */}
          <div className="glass overflow-hidden rounded-3xl">
            {rest.map((p, i) => {
              const accent = GROUP_ACCENT[p.group ?? "MID"];
              return (
                <div
                  key={p.id}
                  className="flex items-center gap-4 border-b border-white/5 px-5 py-3.5 transition last:border-0 hover:bg-white/5"
                >
                  <span className="w-6 text-center font-bold text-gray-500">
                    {i + 4}
                  </span>
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black"
                    style={{ background: `${accent}1f`, color: accent }}
                  >
                    {p.jersey}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 truncate font-semibold">
                      {titleCase(p.name)}
                      {p.captain && (
                        <Star size={12} className="fill-amber-400 text-amber-400" />
                      )}
                    </p>
                    <p className="text-xs text-gray-500">{p.primaryPosition}</p>
                  </div>
                  <span className="text-lg font-black text-white">{fmt(p)}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </AppShell>
  );
}
