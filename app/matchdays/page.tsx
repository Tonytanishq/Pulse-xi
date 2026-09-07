"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/app/AppShell";

import {
  CalendarDays,
  Clock3,
  MapPin,
  Shield,
  Users,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  LockKeyhole,
  Activity,
} from "lucide-react";

import { loadMatchday, Matchday } from "@/lib/matchday";

export default function MatchdaysPage() {
  const [matchday, setMatchday] = useState<Matchday | null>(null);

  useEffect(() => {
    setMatchday(loadMatchday());
  }, []);

  const assignedPlayers = matchday
    ? Object.values(matchday.lineup).filter(
        (player) => player !== null
      ).length
    : 0;

  const hasMatchDetails =
    !!matchday &&
    !!matchday.opponent &&
    !!matchday.date &&
    !!matchday.kickoff &&
    !!matchday.venue;

  const hasFormation = !!matchday?.formation;

  const hasConfirmedXI = !!matchday?.confirmed;

  const readinessChecks = [
    hasMatchDetails,
    hasFormation,
    hasConfirmedXI,
    assignedPlayers >= 11,
  ];

  const completedChecks = readinessChecks.filter(Boolean).length;

  const readinessPercentage =
    Math.round(
      (completedChecks / readinessChecks.length) * 100
    );

  const isReady = readinessPercentage === 100;

  return (
    <AppShell
      title="Matchdays"
      subtitle="Match center · fixtures, results & history"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {/* ============================================================
            MATCH CENTER
        ============================================================ */}

        <section className="rounded-3xl border border-cyan-500/20 bg-[#0B1120]/80 p-6 backdrop-blur-xl lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
                Match Center
              </p>

              <h2 className="mt-2 text-2xl font-black text-white">
                {matchday
                  ? "Upcoming Match"
                  : "Upcoming Matches"}
              </h2>
            </div>

            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300">
              {matchday ? "1 FIXTURE" : "0 FIXTURES"}
            </span>
          </div>

          {matchday ? (
            <div className="overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-black/10 to-blue-500/10">
              {/* ========================================================
                  MATCH HEADER
              ======================================================== */}

              <div className="border-b border-white/5 p-6">
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                      matchday.status === "UPCOMING"
                        ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
                        : matchday.status === "LIVE"
                        ? "border-red-400/20 bg-red-400/10 text-red-300"
                        : "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                    }`}
                  >
                    {matchday.status}
                  </span>

                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    {matchday.venue}
                  </span>
                </div>

                <div className="mt-8 grid items-center gap-6 sm:grid-cols-[1fr_auto_1fr]">
                  {/* HOME */}

                  <div className="text-center sm:text-left">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                      Home
                    </p>

                    <h3 className="mt-2 text-2xl font-black text-white">
                      BVRIT FC
                    </h3>
                  </div>

                  {/* VS */}

                  <div className="text-center">
                    <div className="text-sm font-black uppercase tracking-[0.3em] text-cyan-400">
                      VS
                    </div>
                  </div>

                  {/* OPPONENT */}

                  <div className="text-center sm:text-right">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                      Opponent
                    </p>

                    <h3 className="mt-2 text-2xl font-black text-white">
                      {matchday.opponent || "TBD"}
                    </h3>
                  </div>
                </div>
              </div>

              {/* ========================================================
                  MATCH DETAILS
              ======================================================== */}

              <div className="grid gap-px bg-white/5 sm:grid-cols-3">
                {/* DATE */}

                <div className="bg-[#0B1120]/80 p-4">
                  <div className="flex items-center gap-2 text-gray-500">
                    <CalendarDays size={16} />

                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Date
                    </span>
                  </div>

                  <p className="mt-2 font-bold text-white">
                    {matchday.date}
                  </p>
                </div>

                {/* KICKOFF */}

                <div className="bg-[#0B1120]/80 p-4">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Clock3 size={16} />

                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Kickoff
                    </span>
                  </div>

                  <p className="mt-2 font-bold text-white">
                    {matchday.kickoff}
                  </p>
                </div>

                {/* VENUE */}

                <div className="bg-[#0B1120]/80 p-4">
                  <div className="flex items-center gap-2 text-gray-500">
                    <MapPin size={16} />

                    <span className="text-xs font-semibold uppercase tracking-wider">
                      Venue
                    </span>
                  </div>

                  <p className="mt-2 font-bold text-white">
                    {matchday.venue}
                  </p>
                </div>
              </div>

              {/* ========================================================
                  FORMATION + PLAYER COUNT
              ======================================================== */}

              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/5 p-5">
                <div className="flex flex-wrap items-center gap-3">
                  {/* FORMATION */}

                  <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
                    <Shield
                      size={16}
                      className="text-cyan-400"
                    />

                    <span className="text-sm font-semibold text-gray-300">
                      {matchday.formation}
                    </span>
                  </div>

                  {/* PLAYER COUNT */}

                  <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
                    <Users
                      size={16}
                      className="text-cyan-400"
                    />

                    <span className="text-sm font-semibold text-gray-300">
                      {assignedPlayers} players
                    </span>
                  </div>
                </div>

                <Link
                  href="/formation"
                  className="flex items-center gap-2 rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-bold text-[#04121a] transition hover:bg-cyan-300"
                >
                  View Formation

                  <ArrowRight size={16} />
                </Link>
              </div>

              {/* ========================================================
                  MATCHDAY READINESS
              ======================================================== */}

              <div className="border-t border-white/5 p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Activity
                        size={16}
                        className="text-cyan-400"
                      />

                      <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
                        Matchday Readiness
                      </p>
                    </div>

                    <h3 className="mt-2 text-xl font-black text-white">
                      {isReady
                        ? "Ready for Match"
                        : "Matchday Preparation"}
                    </h3>
                  </div>

                  <div
                    className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wider ${
                      isReady
                        ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                        : "border-yellow-400/20 bg-yellow-400/10 text-yellow-300"
                    }`}
                  >
                    {readinessPercentage}% READY
                  </div>
                </div>

                {/* PROGRESS BAR */}

                <div className="mt-5">
                  <div className="h-2 overflow-hidden rounded-full bg-white/5">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isReady
                          ? "bg-emerald-400"
                          : "bg-cyan-400"
                      }`}
                      style={{
                        width: `${readinessPercentage}%`,
                      }}
                    />
                  </div>
                </div>

                {/* READINESS CHECKS */}

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {/* MATCH DETAILS */}

                  <div
                    className={`flex items-center gap-3 rounded-2xl border p-4 ${
                      hasMatchDetails
                        ? "border-emerald-400/10 bg-emerald-400/[0.04]"
                        : "border-yellow-400/10 bg-yellow-400/[0.04]"
                    }`}
                  >
                    {hasMatchDetails ? (
                      <CheckCircle2
                        size={18}
                        className="text-emerald-400"
                      />
                    ) : (
                      <AlertTriangle
                        size={18}
                        className="text-yellow-400"
                      />
                    )}

                    <div>
                      <p className="text-sm font-bold text-white">
                        Match details
                      </p>

                      <p className="text-xs text-gray-500">
                        {hasMatchDetails
                          ? "Opponent, date, kickoff & venue set"
                          : "Match information incomplete"}
                      </p>
                    </div>
                  </div>

                  {/* FORMATION */}

                  <div
                    className={`flex items-center gap-3 rounded-2xl border p-4 ${
                      hasFormation
                        ? "border-emerald-400/10 bg-emerald-400/[0.04]"
                        : "border-yellow-400/10 bg-yellow-400/[0.04]"
                    }`}
                  >
                    {hasFormation ? (
                      <CheckCircle2
                        size={18}
                        className="text-emerald-400"
                      />
                    ) : (
                      <AlertTriangle
                        size={18}
                        className="text-yellow-400"
                      />
                    )}

                    <div>
                      <p className="text-sm font-bold text-white">
                        Formation selected
                      </p>

                      <p className="text-xs text-gray-500">
                        {hasFormation
                          ? matchday.formation
                          : "No formation selected"}
                      </p>
                    </div>
                  </div>

                  {/* STARTING XI */}

                  <div
                    className={`flex items-center gap-3 rounded-2xl border p-4 ${
                      hasConfirmedXI
                        ? "border-emerald-400/10 bg-emerald-400/[0.04]"
                        : "border-yellow-400/10 bg-yellow-400/[0.04]"
                    }`}
                  >
                    {hasConfirmedXI ? (
                      <LockKeyhole
                        size={18}
                        className="text-emerald-400"
                      />
                    ) : (
                      <AlertTriangle
                        size={18}
                        className="text-yellow-400"
                      />
                    )}

                    <div>
                      <p className="text-sm font-bold text-white">
                        Starting XI
                      </p>

                      <p className="text-xs text-gray-500">
                        {hasConfirmedXI
                          ? "XI confirmed & locked"
                          : "Starting XI not confirmed"}
                      </p>
                    </div>
                  </div>

                  {/* PLAYERS */}

                  <div
                    className={`flex items-center gap-3 rounded-2xl border p-4 ${
                      assignedPlayers >= 11
                        ? "border-emerald-400/10 bg-emerald-400/[0.04]"
                        : "border-yellow-400/10 bg-yellow-400/[0.04]"
                    }`}
                  >
                    {assignedPlayers >= 11 ? (
                      <CheckCircle2
                        size={18}
                        className="text-emerald-400"
                      />
                    ) : (
                      <AlertTriangle
                        size={18}
                        className="text-yellow-400"
                      />
                    )}

                    <div>
                      <p className="text-sm font-bold text-white">
                        Squad assignment
                      </p>

                      <p className="text-xs text-gray-500">
                        {assignedPlayers >= 11
                          ? "11+ players assigned"
                          : `${assignedPlayers}/11 players assigned`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* READY MESSAGE */}

                <div
                  className={`mt-5 flex items-center gap-3 rounded-2xl border p-4 ${
                    isReady
                      ? "border-emerald-400/20 bg-emerald-400/[0.06]"
                      : "border-yellow-400/20 bg-yellow-400/[0.06]"
                  }`}
                >
                  {isReady ? (
                    <CheckCircle2
                      size={20}
                      className="text-emerald-400"
                    />
                  ) : (
                    <AlertTriangle
                      size={20}
                      className="text-yellow-400"
                    />
                  )}

                  <div>
                    <p
                      className={`text-sm font-black ${
                        isReady
                          ? "text-emerald-300"
                          : "text-yellow-300"
                      }`}
                    >
                      {isReady
                        ? "MATCHDAY READY"
                        : "MATCHDAY NOT READY"}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {isReady
                        ? "Your fixture, formation and Starting XI are locked in."
                        : "Complete the remaining preparation steps from Formation."}
                    </p>
                  </div>
                </div>
              </div>

              {/* ========================================================
                  CONFIRMED STARTING XI
              ======================================================== */}

              {matchday.confirmed && (
                <div className="border-t border-white/5 p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-400">
                        Matchday Squad
                      </p>

                      <h3 className="mt-2 text-xl font-black text-white">
                        Confirmed Starting XI
                      </h3>
                    </div>

                    <span className="shrink-0 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-300">
                      🔒 LOCKED
                    </span>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {Object.entries(matchday.lineup)
                      .filter(
                        ([, player]) => player !== null
                      )
                      .map(([position, player]) => {
                        if (!player) {
                          return null;
                        }

                        return (
                          <div
                            key={`${position}-${player.id}`}
                            className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-4 transition-all hover:border-cyan-400/20 hover:bg-cyan-400/[0.04]"
                          >
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-sm font-black text-cyan-300">
                              #{player.number}
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="truncate font-black text-white">
                                {player.name}
                              </p>

                              <div className="mt-1 flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                                  {position}
                                </span>

                                <span className="text-[10px] text-gray-600">
                                  •
                                </span>

                                <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                                  Starting XI
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ============================================================
               NO MATCHDAY
            ============================================================ */

            <div className="flex min-h-48 items-center justify-center rounded-2xl border border-dashed border-cyan-500/20 bg-black/10">
              <div className="text-center">
                <div className="text-4xl">
                  ⚽
                </div>

                <p className="mt-3 font-semibold text-gray-300">
                  No upcoming matches
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Create your next matchday from Formation.
                </p>

                <Link
                  href="/formation"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/20"
                >
                  Open Formation

                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* ==============================================================
            SEASON OVERVIEW
        ============================================================== */}

        <section className="rounded-3xl border border-cyan-500/20 bg-[#0B1120]/80 p-6 backdrop-blur-xl">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
            Season Overview
          </p>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
              <p className="text-sm text-gray-500">
                Matches Played
              </p>

              <p className="mt-1 text-3xl font-black text-white">
                0
              </p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
              <p className="text-sm text-gray-500">
                Wins
              </p>

              <p className="mt-1 text-3xl font-black text-emerald-400">
                0
              </p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
              <p className="text-sm text-gray-500">
                Win Rate
              </p>

              <p className="mt-1 text-3xl font-black text-cyan-400">
                0%
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* ================================================================
          MATCH HISTORY
      ================================================================ */}

      <section className="mt-6 rounded-3xl border border-cyan-500/20 bg-[#0B1120]/80 p-6 backdrop-blur-xl">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
          Match History
        </p>

        <h2 className="mt-2 text-2xl font-black text-white">
          Results & History
        </h2>

        <div className="mt-6 flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-cyan-500/20 bg-black/10">
          <p className="text-sm text-gray-500">
            Completed matchdays will appear here.
          </p>
        </div>
      </section>
    </AppShell>
  );
}