"use client";

import Link from "next/link";
import {
  Home,
  ClipboardCheck,
  Trophy,
  Users,
  BarChart3,
  Settings,
} from "lucide-react";

export default function Sidebar() {
  const menuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      name: "Attendance",
      href: "/attendance",
      icon: ClipboardCheck,
    },
    {
      name: "Leaderboard",
      href: "/leaderboard",
      icon: Trophy,
    },
    {
      name: "Players",
      href: "/admin",
      icon: Users,
    },
    {
      name: "Analytics",
      href: "#",
      icon: BarChart3,
    },
    {
      name: "Settings",
      href: "#",
      icon: Settings,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-cyan-500/20 bg-[#0B1120] backdrop-blur-xl">
      <div className="flex h-20 items-center justify-center border-b border-cyan-500/20">
        <h1 className="text-3xl font-black tracking-widest text-cyan-400">
          PULSE XI
        </h1>
      </div>

      <nav className="p-5 space-y-3">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-4 rounded-xl px-4 py-3 text-gray-300 transition-all duration-300 hover:bg-cyan-500/10 hover:text-cyan-400"
            >
              <Icon size={22} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 w-full border-t border-cyan-500/20 p-5">
        <p className="text-center text-sm text-gray-500">
          Captain Dashboard
        </p>
      </div>
    </aside>
  );
}