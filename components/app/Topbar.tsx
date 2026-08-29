"use client";

import { Bell, Menu, Search } from "lucide-react";
import { players } from "@/lib/players";

const captain = players.find((player) => player.captain);

interface TopbarProps {
  title: string;
  subtitle?: string;
  onMenu: () => void;
}

export default function Topbar({ title, subtitle, onMenu }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 -mx-5 mb-8 flex items-center justify-between gap-4 border-b border-white/5 bg-[#050816]/70 px-5 py-4 backdrop-blur-xl sm:-mx-8 sm:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenu}
          className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-gray-300 lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="text-xl font-black tracking-tight sm:text-2xl">{title}</h1>
          {subtitle && (
            <p className="text-xs text-gray-400 sm:text-sm">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 md:flex">
          <Search size={16} className="text-gray-500" />
          <input
            placeholder="Search squad…"
            className="w-36 bg-transparent text-sm outline-none placeholder:text-gray-500"
          />
        </div>

        <button className="relative rounded-xl border border-white/10 bg-white/5 p-2.5 text-gray-300 transition hover:text-cyan-300">
          <Bell size={19} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-cyan-400 animate-pulse-ring" />
        </button>

        <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 py-1.5 pl-1.5 pr-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 text-sm font-bold text-[#04121a]">
            {captain?.name?.charAt(0) ?? "C"}
          </span>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold leading-tight">
              Capt. {captain?.name ? captain.name.charAt(0) + captain.name.slice(1).toLowerCase() : "Tony"}
            </p>
            <p className="text-[11px] text-gray-400">Captain</p>
          </div>
        </div>
      </div>
    </header>
  );
}
