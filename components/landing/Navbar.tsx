"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Features", href: "#features" },
  { label: "Stats", href: "#stats" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed left-0 top-0 z-50 w-full px-4 py-4 sm:px-8">
      <div className="glass mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-6 py-3.5">
        <Link
          href="/"
          className="text-xl font-black tracking-[0.2em] text-cyan-400 sm:text-2xl"
        >
          PULSE&nbsp;XI
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-8 text-sm font-medium text-gray-300 md:flex">
          {LINKS.map((l) => (
            <Link key={l.label} href={l.href} className="transition hover:text-cyan-300">
              {l.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="rounded-full border border-cyan-400/70 px-6 py-2 text-cyan-300 transition-all duration-300 hover:bg-cyan-400 hover:text-[#04121a] hover:shadow-lg hover:shadow-cyan-400/40"
          >
            Login
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-gray-200 md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass mx-auto mt-3 max-w-7xl overflow-hidden rounded-2xl p-4 md:hidden"
          >
            <div className="flex flex-col gap-1 text-sm">
              {LINKS.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-gray-300 transition hover:bg-cyan-400/10 hover:text-cyan-300"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="mt-1 rounded-xl bg-cyan-400 px-4 py-3 text-center font-bold text-[#04121a]"
              >
                Login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
