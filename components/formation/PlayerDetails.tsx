"use client";

import { Player } from "@/lib/players";

interface Props {
  player: Player | null;
  onCaptain: (player: Player) => void;
  onViceCaptain: (player: Player) => void;
}

function StatBar({
  label,
  value,
  suffix = "",
}: {
  label: string;
  value: number;
  suffix?: string;
}) {
  return (
    <div className="rounded-xl bg-white/5 px-3 py-2.5">
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-gray-300">{label}</span>
        <span className="font-bold text-cyan-300">
          {value}
          {suffix}
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-black/40">
        <div
          className="h-full rounded-full bg-cyan-400 transition-all"
          style={{
            width: `${suffix === "/10" ? value * 10 : value}%`,
          }}
        />
      </div>
    </div>
  );
}

export default function PlayerDetails({
  player,
  onCaptain,
  onViceCaptain,
}: Props) {
  if (!player) {
    return (
      <div className="rounded-3xl border border-cyan-500/20 bg-[#111827]/90 p-5">
        <h2 className="text-xl font-bold text-cyan-400">
          Player Intelligence
        </h2>

        <div className="flex h-80 items-center justify-center text-sm text-gray-500">
          Select a player
        </div>
      </div>
    );
  }

  const form = player.form ?? [];

  return (
    <div className="rounded-3xl border border-cyan-500/20 bg-[#111827]/90 p-5">

      {/* Header */}
      <h2 className="mb-4 text-xl font-bold text-cyan-400">
        Player Intelligence
      </h2>

      {/* Player */}
      <div className="flex flex-col items-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-3xl font-black shadow-xl">
          {player.name.charAt(0)}
        </div>

        <h1 className="mt-2 text-xl font-black uppercase">
          {player.name}
        </h1>

        <p className="text-sm text-cyan-300">
          #{player.jersey} • {player.primaryPosition}
        </p>

        {player.captain && (
          <span className="mt-2 rounded-full bg-yellow-500 px-3 py-1 text-xs font-bold text-black">
            ⭐ Captain
          </span>
        )}

        {player.viceCaptain && (
          <span className="mt-2 rounded-full bg-gray-300 px-3 py-1 text-xs font-bold text-black">
            🥈 Vice Captain
          </span>
        )}
      </div>

      {/* Core Intelligence */}
      <div className="mt-5 space-y-2">

        <StatBar
          label="⭐ Rating"
          value={player.rating ?? 0}
          suffix="/10"
        />

        <StatBar
          label="💪 Fitness"
          value={player.fitness ?? 0}
          suffix="%"
        />

        <StatBar
          label="📅 Attendance"
          value={player.attendance ?? 0}
          suffix="%"
        />

      </div>

      {/* Recent Form */}
      <div className="mt-3 rounded-xl bg-white/5 p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-gray-300">
            🔥 Recent Form
          </span>

          <span className="font-bold text-orange-400">
            {form.length
              ? form[form.length - 1].toFixed(1)
              : "—"}
          </span>
        </div>

        <div className="flex h-10 items-end gap-1.5">
          {form.map((value, index) => (
            <div
              key={index}
              className="flex-1 rounded-t bg-orange-500 transition-all"
              style={{
                height: `${Math.max(value * 10, 10)}%`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Match Statistics */}
      <div className="mt-3">
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">
          Match Statistics
        </p>

        <div className="grid grid-cols-4 gap-1.5">
          <div className="rounded-lg bg-white/5 p-2 text-center">
            <p className="text-lg font-black">
              {player.matches ?? 0}
            </p>
            <p className="text-[10px] text-gray-500">
              Matches
            </p>
          </div>

          <div className="rounded-lg bg-white/5 p-2 text-center">
            <p className="text-lg font-black text-green-400">
              {player.goals ?? 0}
            </p>
            <p className="text-[10px] text-gray-500">
              Goals
            </p>
          </div>

          <div className="rounded-lg bg-white/5 p-2 text-center">
            <p className="text-lg font-black text-blue-400">
              {player.assists ?? 0}
            </p>
            <p className="text-[10px] text-gray-500">
              Assists
            </p>
          </div>

          <div className="rounded-lg bg-white/5 p-2 text-center">
            <p className="text-lg font-black text-purple-400">
              {player.minutes ?? 0}
            </p>
            <p className="text-[10px] text-gray-500">
              Minutes
            </p>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="mt-3 flex items-center justify-between rounded-xl bg-white/5 px-3 py-2.5">
        <span className="text-sm text-gray-300">
          Current Status
        </span>

        <span
          className={`
            rounded-full px-2.5 py-1 text-xs font-bold
            ${
              player.status === "Match Fit"
                ? "bg-green-500/20 text-green-400"
                : player.status === "Knock"
                ? "bg-yellow-500/20 text-yellow-400"
                : player.status === "Recovering"
                ? "bg-orange-500/20 text-orange-400"
                : "bg-red-500/20 text-red-400"
            }
          `}
        >
          {player.status ?? "Unknown"}
        </span>
      </div>

      {/* Actions */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          onClick={() => onCaptain(player)}
          className="rounded-xl bg-yellow-500 px-3 py-2.5 text-sm font-bold text-black transition hover:scale-[1.02] hover:bg-yellow-400"
        >
          ⭐ Captain
        </button>

        <button
          onClick={() => onViceCaptain(player)}
          className="rounded-xl bg-gray-700 px-3 py-2.5 text-sm font-bold text-white transition hover:scale-[1.02] hover:bg-gray-600"
        >
          🥈 Vice
        </button>
      </div>

    </div>
  );
}