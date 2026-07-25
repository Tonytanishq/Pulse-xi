"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Crown, Megaphone, User, Shield, ArrowRight } from "lucide-react";

const ROLES = [
  { key: "captain", label: "Captain", icon: Crown, desc: "Manage team, attendance & formations" },
  { key: "coach", label: "Coach", icon: Megaphone, desc: "Reports, approvals & match analysis" },
  { key: "player", label: "Player", icon: User, desc: "Profile, schedule & personal stats" },
  { key: "admin", label: "Admin", icon: Shield, desc: "Full platform access" },
];

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState("captain");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push("/dashboard");
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050816] px-5 py-10 text-white">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" />
      <div className="pointer-events-none absolute -left-32 top-0 h-[520px] w-[520px] rounded-full bg-cyan-500/15 blur-[150px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-[520px] w-[520px] rounded-full bg-blue-700/15 blur-[150px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass relative z-10 w-full max-w-md rounded-3xl p-8 sm:p-10"
      >
        <Link
          href="/"
          className="mb-8 inline-block text-2xl font-black tracking-[0.2em] text-cyan-400"
        >
          PULSE XI
        </Link>

        <h1 className="text-3xl font-black tracking-tight">Welcome back</h1>
        <p className="mt-2 text-sm text-gray-400">
          Sign in to your club's operating system.
        </p>

        {/* Role selection */}
        <div className="mt-7">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
            Select your role
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {ROLES.map((r) => {
              const Icon = r.icon;
              const active = r.key === role;
              return (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => setRole(r.key)}
                  className={`group flex flex-col gap-2 rounded-2xl border p-3.5 text-left transition ${
                    active
                      ? "border-cyan-400/60 bg-cyan-400/10 shadow-[0_0_0_1px_rgba(34,211,238,0.4)]"
                      : "border-white/10 bg-white/5 hover:border-cyan-400/30"
                  }`}
                >
                  <Icon
                    size={20}
                    className={active ? "text-cyan-300" : "text-gray-400"}
                  />
                  <span className="text-sm font-bold">{r.label}</span>
                  <span className="text-[11px] leading-snug text-gray-500">
                    {r.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-400">
              Email
            </label>
            <input
              type="email"
              required
              defaultValue="captain@bvritfc.in"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-cyan-400/60"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-gray-400">
              Password
            </label>
            <input
              type="password"
              required
              defaultValue="password"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition focus:border-cyan-400/60"
            />
          </div>

          <button type="submit" className="btn-pulse w-full">
            Enter the Club <ArrowRight size={18} />
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-500">
          Demo build · any credentials work. Signing in as{" "}
          <span className="font-semibold text-cyan-300">
            {ROLES.find((r) => r.key === role)?.label}
          </span>
          .
        </p>
      </motion.div>
    </main>
  );
}
