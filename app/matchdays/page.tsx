"use client";

import { useEffect, useMemo, useState } from "react";
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
  Trash2,
  Armchair,
  Trophy,
  Target,
  X,
  Pencil,
} from "lucide-react";

import {
  getMatchdays,
  Matchday,
  MatchResult,
  deleteMatchday,
  updateMatchdayResult,
} from "@/lib/matchday";

export default function MatchdaysPage() {
  const [matchdays, setMatchdays] = useState<Matchday[]>([]);

  const [resultEditorId, setResultEditorId] =
    useState<string | null>(null);

  const [bvritScoreInput, setBvritScoreInput] =
    useState("");

  const [opponentScoreInput, setOpponentScoreInput] =
    useState("");

  useEffect(() => {
    setMatchdays(getMatchdays());
  }, []);

  const sortedMatchdays = useMemo(() => {
    return [...matchdays].sort((a, b) => {
      const dateA = new Date(
        `${a.date}T${a.kickoff || "00:00"}`
      ).getTime();

      const dateB = new Date(
        `${b.date}T${b.kickoff || "00:00"}`
      ).getTime();

      return dateA - dateB;
    });
  }, [matchdays]);

  const activeMatchdays = sortedMatchdays.filter(
    (matchday) =>
      matchday.status === "UPCOMING" ||
      matchday.status === "LIVE"
  );

  const completedMatchdays = sortedMatchdays.filter(
    (matchday) =>
      matchday.status === "COMPLETED"
  );

  const totalMatches = matchdays.length;

  const completedMatches =
    completedMatchdays.length;

  const upcomingMatches =
    activeMatchdays.length;

  const wins = completedMatchdays.filter(
    (matchday) =>
      matchday.result === "WIN"
  ).length;

  const draws = completedMatchdays.filter(
    (matchday) =>
      matchday.result === "DRAW"
  ).length;

  const losses = completedMatchdays.filter(
    (matchday) =>
      matchday.result === "LOSS"
  ).length;

  const matchesWithResults =
    completedMatchdays.filter(
      (matchday) =>
        typeof matchday.bvritScore ===
          "number" &&
        typeof matchday.opponentScore ===
          "number"
    );

  const goalsFor =
    matchesWithResults.reduce(
      (total, matchday) =>
        total +
        (matchday.bvritScore ?? 0),
      0
    );

  const goalsAgainst =
    matchesWithResults.reduce(
      (total, matchday) =>
        total +
        (matchday.opponentScore ?? 0),
      0
    );

  const goalDifference =
    goalsFor - goalsAgainst;

  const winRate =
    matchesWithResults.length > 0
      ? Math.round(
          (wins /
            matchesWithResults.length) *
            100
        )
      : 0;

  function handleDeleteMatchday(
    matchday: Matchday
  ) {
    const confirmed =
      window.confirm(
        `Delete the match against ${matchday.opponent}?`
      );

    if (!confirmed) {
      return;
    }

    deleteMatchday(matchday.id);

    setMatchdays(
      (currentMatchdays) =>
        currentMatchdays.filter(
          (currentMatchday) =>
            currentMatchday.id !==
            matchday.id
        )
    );
  }

  function handleOpenResultEditor(
    matchday: Matchday
  ) {
    setResultEditorId(matchday.id);

    setBvritScoreInput(
      typeof matchday.bvritScore ===
        "number"
        ? String(matchday.bvritScore)
        : ""
    );

    setOpponentScoreInput(
      typeof matchday.opponentScore ===
        "number"
        ? String(matchday.opponentScore)
        : ""
    );
  }

  function handleCloseResultEditor() {
    setResultEditorId(null);
    setBvritScoreInput("");
    setOpponentScoreInput("");
  }

  function handleSaveResult() {
    if (!resultEditorId) {
      return;
    }

    if (
      bvritScoreInput.trim() === "" ||
      opponentScoreInput.trim() === ""
    ) {
      window.alert(
        "⚠️ Please enter both scores."
      );

      return;
    }

    const bvritScore =
      Number(bvritScoreInput);

    const opponentScore =
      Number(opponentScoreInput);

    if (
      !Number.isInteger(bvritScore) ||
      !Number.isInteger(opponentScore) ||
      bvritScore < 0 ||
      opponentScore < 0
    ) {
      window.alert(
        "⚠️ Scores must be whole numbers greater than or equal to 0."
      );

      return;
    }

    const updatedMatchday =
      updateMatchdayResult(
        resultEditorId,
        bvritScore,
        opponentScore
      );

    if (!updatedMatchday) {
      window.alert(
        "❌ Unable to save the match result."
      );

      return;
    }

    setMatchdays(
      (currentMatchdays) =>
        currentMatchdays.map(
          (matchday) =>
            matchday.id ===
            updatedMatchday.id
              ? updatedMatchday
              : matchday
        )
    );

    handleCloseResultEditor();
  }

  function getResultLabel(
    result?: MatchResult
  ) {
    if (result === "WIN") {
      return "WIN";
    }

    if (result === "DRAW") {
      return "DRAW";
    }

    if (result === "LOSS") {
      return "LOSS";
    }

    return "RESULT PENDING";
  }

  function getResultClasses(
    result?: MatchResult
  ) {
    if (result === "WIN") {
      return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
    }

    if (result === "DRAW") {
      return "border-yellow-400/20 bg-yellow-400/10 text-yellow-300";
    }

    if (result === "LOSS") {
      return "border-red-400/20 bg-red-400/10 text-red-300";
    }

    return "border-white/10 bg-white/5 text-gray-400";
  }

  function renderMatchdayCard(
    matchday: Matchday
  ) {
    const assignedPlayers =
      Object.values(matchday.lineup).filter(
        (player) => player !== null
      ).length;

    const substituteCount =
      matchday.substitutes?.length ?? 0;

    const hasMatchDetails =
      !!matchday.opponent &&
      !!matchday.date &&
      !!matchday.kickoff &&
      !!matchday.venue;

    const hasFormation =
      !!matchday.formation;

    const hasConfirmedXI =
      !!matchday.confirmed;

    const hasResult =
      typeof matchday.bvritScore ===
        "number" &&
      typeof matchday.opponentScore ===
        "number" &&
      !!matchday.result;

    const readinessChecks = [
      hasMatchDetails,
      hasFormation,
      hasConfirmedXI,
      assignedPlayers === 11,
    ];

    const completedChecks =
      readinessChecks.filter(
        Boolean
      ).length;

    const readinessPercentage =
      Math.round(
        (completedChecks /
          readinessChecks.length) *
          100
      );

    const isReady =
      readinessPercentage === 100;

    const statusClasses =
      matchday.status === "UPCOMING"
        ? "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
        : matchday.status === "LIVE"
          ? "border-red-400/20 bg-red-400/10 text-red-300"
          : "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";

    return (
      <div
        key={matchday.id}
        className="overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 via-black/10 to-blue-500/10"
      >
        <div className="border-b border-white/5 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span
              className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider ${statusClasses}`}
            >
              {matchday.status}
            </span>

            <button
              type="button"
              onClick={() =>
                handleDeleteMatchday(
                  matchday
                )
              }
              className="flex items-center gap-2 rounded-lg border border-red-400/10 bg-red-500/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-red-300 transition hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-200"
            >
              <Trash2 size={13} />
              Delete
            </button>
          </div>

          <div className="mt-8 grid items-center gap-6 sm:grid-cols-[1fr_auto_1fr]">
            <div className="text-center sm:text-left">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                Home
              </p>

              <h3 className="mt-2 text-2xl font-black text-white">
                BVRIT FC
              </h3>
            </div>

            <div className="text-center">
              {hasResult ? (
                <div>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-4xl font-black text-white">
                      {matchday.bvritScore}
                    </span>

                    <span className="text-xl font-black text-gray-600">
                      —
                    </span>

                    <span className="text-4xl font-black text-white">
                      {matchday.opponentScore}
                    </span>
                  </div>

                  <div
                    className={`mt-3 inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wider ${getResultClasses(
                      matchday.result
                    )}`}
                  >
                    {getResultLabel(
                      matchday.result
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-sm font-black uppercase tracking-[0.3em] text-cyan-400">
                  VS
                </div>
              )}
            </div>

            <div className="text-center sm:text-right">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500">
                Opponent
              </p>

              <h3 className="mt-2 text-2xl font-black text-white">
                {matchday.opponent ||
                  "TBD"}
              </h3>
            </div>
          </div>
        </div>

        <div className="grid gap-px bg-white/5 sm:grid-cols-3">
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

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/5 p-5">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
              <Shield
                size={16}
                className="text-cyan-400"
              />

              <span className="text-sm font-semibold text-gray-300">
                {matchday.formation}
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
              <Users
                size={16}
                className="text-cyan-400"
              />

              <span className="text-sm font-semibold text-gray-300">
                {assignedPlayers}/11
                players
              </span>
            </div>

            <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
              <Armchair
                size={16}
                className="text-cyan-400"
              />

              <span className="text-sm font-semibold text-gray-300">
                {substituteCount}/7
                bench
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

        {matchday.status ===
          "COMPLETED" && (
          <div className="border-t border-white/5 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Trophy
                    size={16}
                    className={
                      hasResult
                        ? matchday.result ===
                          "WIN"
                          ? "text-emerald-400"
                          : matchday.result ===
                              "DRAW"
                            ? "text-yellow-400"
                            : "text-red-400"
                        : "text-gray-500"
                    }
                  />

                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
                    Match Result
                  </p>
                </div>

                <h3 className="mt-2 text-xl font-black text-white">
                  {hasResult
                    ? `${matchday.bvritScore} — ${matchday.opponentScore}`
                    : "Result Pending"}
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  {hasResult
                    ? `BVRIT FC ${getResultLabel(
                        matchday.result
                      ).toLowerCase()} against ${matchday.opponent}.`
                    : "Enter the final score to record the result."}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {hasResult && (
                  <div
                    className={`rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wider ${getResultClasses(
                      matchday.result
                    )}`}
                  >
                    {getResultLabel(
                      matchday.result
                    )}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() =>
                    handleOpenResultEditor(
                      matchday
                    )
                  }
                  className="flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2.5 text-xs font-black uppercase tracking-wider text-cyan-300 transition hover:border-cyan-400/40 hover:bg-cyan-400/20 hover:text-white"
                >
                  {hasResult ? (
                    <Pencil size={14} />
                  ) : (
                    <Target size={14} />
                  )}

                  {hasResult
                    ? "Edit Result"
                    : "Record Result"}
                </button>
              </div>
            </div>

            {hasResult && (
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                  <p className="text-xs uppercase tracking-wider text-gray-500">
                    Goals For
                  </p>

                  <p className="mt-2 text-2xl font-black text-emerald-400">
                    {matchday.bvritScore}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                  <p className="text-xs uppercase tracking-wider text-gray-500">
                    Goals Against
                  </p>

                  <p className="mt-2 text-2xl font-black text-red-400">
                    {matchday.opponentScore}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                  <p className="text-xs uppercase tracking-wider text-gray-500">
                    Goal Difference
                  </p>

                  <p
                    className={`mt-2 text-2xl font-black ${
                      (matchday.bvritScore ??
                        0) -
                        (matchday.opponentScore ??
                          0) >
                      0
                        ? "text-emerald-400"
                        : (matchday.bvritScore ??
                              0) -
                              (matchday.opponentScore ??
                                0) <
                            0
                          ? "text-red-400"
                          : "text-yellow-400"
                    }`}
                  >
                    {(
                      (matchday.bvritScore ??
                        0) -
                      (matchday.opponentScore ??
                        0)
                    ) > 0
                      ? "+"
                      : ""}
                    {(matchday.bvritScore ??
                      0) -
                      (matchday.opponentScore ??
                        0)}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

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
              {readinessPercentage}%
              READY
            </div>
          </div>

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

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
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

            <div
              className={`flex items-center gap-3 rounded-2xl border p-4 ${
                assignedPlayers === 11
                  ? "border-emerald-400/10 bg-emerald-400/[0.04]"
                  : "border-yellow-400/10 bg-yellow-400/[0.04]"
              }`}
            >
              {assignedPlayers === 11 ? (
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
                  {assignedPlayers === 11
                    ? "Exactly 11 players assigned"
                    : `${assignedPlayers}/11 players assigned`}
                </p>
              </div>
            </div>
          </div>

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

          {matchday.confirmed && (
            <div className="mt-6 border-t border-white/5 pt-6">
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
                {Object.entries(
                  matchday.lineup
                )
                  .filter(
                    ([, player]) =>
                      player !== null
                  )
                  .map(
                    ([
                      position,
                      player,
                    ]) => {
                      if (!player) {
                        return null;
                      }

                      return (
                        <div
                          key={`${position}-${player.id}`}
                          className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-white/[0.03] p-4 transition-all hover:border-cyan-400/20 hover:bg-cyan-400/[0.04]"
                        >
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-sm font-black text-cyan-300">
                            #{player.jersey}
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
                    }
                  )}
              </div>

              {substituteCount > 0 && (
                <div className="mt-6 border-t border-white/5 pt-6">
                  <div className="flex items-center gap-2">
                    <Armchair
                      size={16}
                      className="text-cyan-400"
                    />

                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
                      Bench
                    </p>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {matchday.substitutes.map(
                      (player) => (
                        <div
                          key={player.id}
                          className="flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-3"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-400/10 text-xs font-black text-emerald-300">
                            #{player.jersey}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-white">
                              {player.name}
                            </p>

                            <p className="text-[10px] uppercase tracking-wider text-gray-500">
                              Substitute
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <AppShell
      title="Matchdays"
      subtitle="Match center · fixtures, results & history"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-3xl border border-cyan-500/20 bg-[#0B1120]/80 p-6 backdrop-blur-xl lg:col-span-2">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
                Match Center
              </p>

              <h2 className="mt-2 text-2xl font-black text-white">
                Upcoming Matches
              </h2>
            </div>

            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300">
              {activeMatchdays.length}{" "}
              {activeMatchdays.length ===
              1
                ? "FIXTURE"
                : "FIXTURES"}
            </span>
          </div>

          {activeMatchdays.length >
          0 ? (
            <div className="space-y-5">
              {activeMatchdays.map(
                renderMatchdayCard
              )}
            </div>
          ) : (
            <div className="flex min-h-56 items-center justify-center rounded-2xl border border-dashed border-cyan-500/20 bg-black/10">
              <div className="text-center">
                <div className="text-4xl">
                  ⚽
                </div>

                <p className="mt-3 font-semibold text-gray-300">
                  No upcoming matches
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Create your next matchday
                  from Formation.
                </p>

                <Link
                  href="/formation"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/20"
                >
                  Open Formation
                  <ArrowRight
                    size={16}
                  />
                </Link>
              </div>
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-cyan-500/20 bg-[#0B1120]/80 p-6 backdrop-blur-xl">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
            Season Overview
          </p>

          <h2 className="mt-2 text-xl font-black text-white">
            Match Statistics
          </h2>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
              <p className="text-sm text-gray-500">
                Total Matches
              </p>

              <p className="mt-1 text-3xl font-black text-white">
                {totalMatches}
              </p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
              <p className="text-sm text-gray-500">
                Upcoming
              </p>

              <p className="mt-1 text-3xl font-black text-cyan-400">
                {upcomingMatches}
              </p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
              <p className="text-sm text-gray-500">
                Matches Played
              </p>

              <p className="mt-1 text-3xl font-black text-emerald-400">
                {completedMatches}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-emerald-400/10 bg-emerald-400/[0.04] p-4">
                <p className="text-xs text-gray-500">
                  Wins
                </p>

                <p className="mt-1 text-2xl font-black text-emerald-400">
                  {wins}
                </p>
              </div>

              <div className="rounded-2xl border border-yellow-400/10 bg-yellow-400/[0.04] p-4">
                <p className="text-xs text-gray-500">
                  Draws
                </p>

                <p className="mt-1 text-2xl font-black text-yellow-400">
                  {draws}
                </p>
              </div>

              <div className="rounded-2xl border border-red-400/10 bg-red-400/[0.04] p-4">
                <p className="text-xs text-gray-500">
                  Losses
                </p>

                <p className="mt-1 text-2xl font-black text-red-400">
                  {losses}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
              <p className="text-sm text-gray-500">
                Win Rate
              </p>

              <p className="mt-1 text-3xl font-black text-cyan-400">
                {winRate}%
              </p>

              {matchesWithResults.length ===
                0 && (
                <p className="mt-1 text-[10px] text-gray-600">
                  Add match results to calculate.
                </p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                <p className="text-[10px] uppercase tracking-wider text-gray-500">
                  GF
                </p>

                <p className="mt-1 text-2xl font-black text-emerald-400">
                  {goalsFor}
                </p>

                <p className="text-[9px] text-gray-600">
                  Goals For
                </p>
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                <p className="text-[10px] uppercase tracking-wider text-gray-500">
                  GA
                </p>

                <p className="mt-1 text-2xl font-black text-red-400">
                  {goalsAgainst}
                </p>

                <p className="text-[9px] text-gray-600">
                  Goals Against
                </p>
              </div>

              <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-4">
                <p className="text-[10px] uppercase tracking-wider text-gray-500">
                  GD
                </p>

                <p
                  className={`mt-1 text-2xl font-black ${
                    goalDifference > 0
                      ? "text-emerald-400"
                      : goalDifference < 0
                        ? "text-red-400"
                        : "text-yellow-400"
                  }`}
                >
                  {goalDifference > 0
                    ? "+"
                    : ""}
                  {goalDifference}
                </p>

                <p className="text-[9px] text-gray-600">
                  Difference
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-3xl border border-cyan-500/20 bg-[#0B1120]/80 p-6 backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
              Match History
            </p>

            <h2 className="mt-2 text-2xl font-black text-white">
              Results & History
            </h2>
          </div>

          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-gray-400">
            {completedMatches} COMPLETED
          </span>
        </div>

        {completedMatchdays.length >
        0 ? (
          <div className="mt-6 space-y-5">
            {completedMatchdays.map(
              renderMatchdayCard
            )}
          </div>
        ) : (
          <div className="mt-6 flex min-h-40 items-center justify-center rounded-2xl border border-dashed border-cyan-500/20 bg-black/10">
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-400">
                No completed matches yet.
              </p>

              <p className="mt-1 text-xs text-gray-600">
                Completed matchdays and
                results will appear here.
              </p>
            </div>
          </div>
        )}
      </section>

      {resultEditorId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5 backdrop-blur-md">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-cyan-400/20 bg-[#0B1120] shadow-2xl shadow-cyan-500/10">
            <div className="flex items-center justify-between border-b border-white/5 p-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-cyan-400">
                  Match Result
                </p>

                <h2 className="mt-2 text-2xl font-black text-white">
                  Record Final Score
                </h2>
              </div>

              <button
                type="button"
                onClick={
                  handleCloseResultEditor
                }
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-400 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-4">
                <div>
                  <label
                    htmlFor="bvrit-score"
                    className="mb-2 block text-center text-xs font-black uppercase tracking-wider text-cyan-400"
                  >
                    BVRIT FC
                  </label>

                  <input
                    id="bvrit-score"
                    type="number"
                    min="0"
                    step="1"
                    inputMode="numeric"
                    value={bvritScoreInput}
                    onChange={(event) =>
                      setBvritScoreInput(
                        event.target.value
                      )
                    }
                    className="w-full rounded-2xl border border-cyan-400/20 bg-white/5 px-4 py-5 text-center text-4xl font-black text-white outline-none transition focus:border-cyan-400/60 focus:bg-cyan-400/5"
                  />
                </div>

                <div className="pb-5 text-2xl font-black text-gray-600">
                  —
                </div>

                <div>
                  <label
                    htmlFor="opponent-score"
                    className="mb-2 block text-center text-xs font-black uppercase tracking-wider text-gray-400"
                  >
                    Opponent
                  </label>

                  <input
                    id="opponent-score"
                    type="number"
                    min="0"
                    step="1"
                    inputMode="numeric"
                    value={
                      opponentScoreInput
                    }
                    onChange={(event) =>
                      setOpponentScoreInput(
                        event.target.value
                      )
                    }
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-5 text-center text-4xl font-black text-white outline-none transition focus:border-cyan-400/60 focus:bg-cyan-400/5"
                  />
                </div>
              </div>

              {bvritScoreInput !== "" &&
                opponentScoreInput !== "" &&
                Number.isInteger(
                  Number(bvritScoreInput)
                ) &&
                Number.isInteger(
                  Number(
                    opponentScoreInput
                  )
                ) &&
                Number(bvritScoreInput) >=
                  0 &&
                Number(
                  opponentScoreInput
                ) >= 0 && (
                  <div className="mt-6 text-center">
                    <span
                      className={`inline-flex rounded-full border px-4 py-2 text-xs font-black uppercase tracking-wider ${getResultClasses(
                        Number(
                          bvritScoreInput
                        ) >
                          Number(
                            opponentScoreInput
                          )
                          ? "WIN"
                          : Number(
                                bvritScoreInput
                              ) <
                              Number(
                                opponentScoreInput
                              )
                            ? "LOSS"
                            : "DRAW"
                      )}`}
                    >
                      {Number(
                        bvritScoreInput
                      ) >
                      Number(
                        opponentScoreInput
                      )
                        ? "🟢 BVRIT FC WIN"
                        : Number(
                              bvritScoreInput
                            ) <
                            Number(
                              opponentScoreInput
                            )
                          ? "🔴 BVRIT FC LOSS"
                          : "🟡 DRAW"}
                    </span>
                  </div>
                )}

              <div className="mt-6 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.04] p-4">
                <p className="text-xs leading-relaxed text-gray-500">
                  The result will automatically be
                  calculated from the final score and
                  saved to this matchday.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={
                    handleCloseResultEditor
                  }
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-black text-gray-400 transition hover:bg-white/10 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSaveResult}
                  className="rounded-xl bg-cyan-400 px-4 py-3 text-sm font-black text-[#04121a] transition hover:bg-cyan-300"
                >
                  Save Result
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}