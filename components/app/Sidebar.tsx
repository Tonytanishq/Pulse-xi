"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV, CLUB } from "@/lib/club";

interface SidebarProps {
  mobileOpen: boolean;
  onNavigate: () => void;
}

export default function Sidebar({ mobileOpen, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <button
          aria-label="Close menu"
          onClick={onNavigate}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-cyan-500/15 bg-[#080e1c]/95 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center gap-3 border-b border-cyan-500/15 px-6">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 text-lg">
            ⚽
          </span>
          <div>
            <div className="text-lg font-black tracking-widest text-cyan-400">
              PULSE XI
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500">
              {CLUB.short}
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto p-4">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.soon ? "#" : item.href}
                onClick={onNavigate}
                aria-disabled={item.soon}
                className={`group flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm transition-all duration-300 ${
                  active
                    ? "bg-cyan-400/15 text-cyan-300 shadow-[inset_0_0_0_1px_rgba(34,211,238,0.35)]"
                    : "text-gray-400 hover:bg-white/5 hover:text-cyan-200"
                } ${item.soon ? "cursor-not-allowed opacity-55" : ""}`}
              >
                <Icon size={19} />
                <span className="font-medium">{item.name}</span>
                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-300" />
                )}
                {item.soon && (
                  <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-gray-400">
                    Soon
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-cyan-500/15 p-4">
          <Link
            href="/"
            onClick={onNavigate}
            className="block rounded-xl bg-white/5 px-4 py-3 text-center text-xs font-medium text-gray-400 transition hover:text-cyan-300"
          >
            ← Back to site
          </Link>
        </div>
      </aside>
    </>
  );
}
