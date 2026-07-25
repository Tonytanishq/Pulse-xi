"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import AppShell from "@/components/app/AppShell";
import SquadCard from "@/components/squad/SquadCard";
import { players, GROUP_LABEL, type PositionGroup } from "@/lib/players";

type Filter = "ALL" | PositionGroup;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "ALL", label: "All" },
  { key: "GK", label: GROUP_LABEL.GK },
  { key: "DEF", label: GROUP_LABEL.DEF },
  { key: "MID", label: GROUP_LABEL.MID },
  { key: "FWD", label: GROUP_LABEL.FWD },
];

export default function SquadPage() {
  const [filter, setFilter] = useState<Filter>("ALL");
  const [search, setSearch] = useState("");

  const visible = useMemo(() => {
    return players.filter((p) => {
      const byGroup = filter === "ALL" || p.group === filter;
      const bySearch = p.name.toLowerCase().includes(search.toLowerCase());
      return byGroup && bySearch;
    });
  }, [filter, search]);

  return (
    <AppShell title="Squad" subtitle={`${players.length} registered players · Season 2025/26`}>
      {/* Controls */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                filter === f.key
                  ? "bg-cyan-400 text-[#04121a]"
                  : "border border-white/10 bg-white/5 text-gray-300 hover:text-cyan-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 lg:w-72">
          <Search size={16} className="text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search players…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* Grid */}
      {visible.length ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((p, i) => (
            <SquadCard key={p.id} player={p} index={i} />
          ))}
        </div>
      ) : (
        <div className="glass rounded-3xl p-16 text-center text-gray-400">
          No players match “{search}”.
        </div>
      )}
    </AppShell>
  );
}
