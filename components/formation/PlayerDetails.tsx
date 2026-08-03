"use client";

import { Player } from "@/lib/players";

interface Props {
  player: Player | null;

  onCaptain: (player: Player) => void;

  onViceCaptain: (player: Player) => void;
}

export default function PlayerDetails({
  player,
  onCaptain,
  onViceCaptain,
}: Props) {
  if (!player) {
    return (
      <div className="rounded-3xl border border-cyan-500/20 bg-[#111827]/90 p-6">
        <h2 className="mb-6 text-2xl font-bold text-cyan-400">
          Player Details
        </h2>

        <div className="flex h-96 items-center justify-center text-gray-500">
          Select a player to view details
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-cyan-500/20 bg-[#111827]/90 p-6">
      <h2 className="mb-6 text-2xl font-bold text-cyan-400">
        Player Details
      </h2>

      <div className="flex flex-col items-center">
        <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-4xl font-black text-white shadow-xl">
          {player.name.charAt(0)}
        </div>

        <h1 className="text-2xl font-black uppercase">
          {player.name}
        </h1>

        <p className="text-cyan-300">
          #{player.jersey} • {player.position}
        </p>

        {player.captain && (
          <span className="mt-3 rounded-full bg-yellow-500 px-3 py-1 text-sm font-bold text-black">
            ⭐ Captain
          </span>
        )}

        {player.viceCaptain && (
          <span className="mt-2 rounded-full bg-gray-300 px-3 py-1 text-sm font-bold text-black">
            🥈 Vice Captain
          </span>
        )}
      </div>

      {/* Buttons + Stats */}
      <div className="mt-6 flex flex-col gap-3">

        <button
          onClick={() => onCaptain(player)}
          className="
            rounded-xl
            bg-yellow-500
            px-4
            py-3
            font-bold
            text-black
            transition
            hover:scale-105
            hover:bg-yellow-400
          "
        >
          ⭐ Make Captain
        </button>

        <button
          onClick={() => onViceCaptain(player)}
          className="
            rounded-xl
            bg-gray-700
            px-4
            py-3
            font-bold
            text-white
            transition
            hover:scale-105
            hover:bg-gray-600
          "
        >
          🥈 Make Vice Captain
        </button>

        <div className="flex justify-between rounded-xl bg-white/5 p-3">
          <span>Position</span>
          <span className="font-bold">{player.position}</span>
        </div>

        <div className="flex justify-between rounded-xl bg-white/5 p-3">
          <span>Jersey</span>
          <span className="font-bold">#{player.jersey}</span>
        </div>

        <div className="flex justify-between rounded-xl bg-white/5 p-3">
          <span>Captain</span>
          <span className="font-bold">
            {player.captain ? "Yes" : "No"}
          </span>
        </div>

        <div className="flex justify-between rounded-xl bg-white/5 p-3">
          <span>Vice Captain</span>
          <span className="font-bold">
            {player.viceCaptain ? "Yes" : "No"}
          </span>
        </div>

      </div>
    </div>
  );
}