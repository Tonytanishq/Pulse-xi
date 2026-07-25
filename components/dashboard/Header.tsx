"use client";

import { Bell, Search } from "lucide-react";

export default function Header() {
  return (
    <header className="flex items-center justify-between mb-10">

      <div>
        <h1 className="text-5xl font-black">
          Welcome Back 👋
        </h1>

        <p className="text-gray-400 mt-2">
          Captain Dashboard
        </p>
      </div>

      <div className="flex items-center gap-5">

        {/* Search */}

        <div className="flex items-center gap-3 rounded-xl border border-cyan-500/20 bg-white/5 px-4 py-3">
          <Search size={18} className="text-gray-400" />

          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none placeholder:text-gray-500"
          />
        </div>

        {/* Notification */}

        <button className="rounded-xl border border-cyan-500/20 bg-white/5 p-3 transition hover:bg-cyan-500/20">
          <Bell />
        </button>

        {/* Profile */}

        <div className="flex items-center gap-3 rounded-xl border border-cyan-500/20 bg-white/5 px-4 py-2">

          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500 text-xl font-bold">
            T
          </div>

          <div>
            <p className="font-semibold">
              Captain Tony
            </p>

            <p className="text-sm text-gray-400">
              BVRIT FC
            </p>
          </div>

        </div>

      </div>

    </header>
  );
}