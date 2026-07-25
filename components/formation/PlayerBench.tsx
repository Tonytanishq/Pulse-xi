"use client";

import { Player } from "@/lib/players";

interface PlayerBenchProps {
  players: Player[];
  selectedPlayer: Player | null;
  onSelect: (player: Player) => void;
}

export default function PlayerBench({
  players,
  selectedPlayer,
  onSelect,
}: PlayerBenchProps) {
  return (
    <div className="rounded-3xl border border-cyan-500/30 bg-[#08101d] p-6">
      <h2 className="mb-6 text-2xl font-bold text-cyan-400">
        Bench Players
      </h2>

      <div className="grid gap-3">
        {players.map((player) => (
          <button
            key={player.id}
            onClick={() => onSelect(player)}
            className={`rounded-2xl border p-4 text-left transition ${
              selectedPlayer?.id === player.id
                ? "border-cyan-400 bg-cyan-500/20"
                : "border-white/10 bg-white/5 hover:border-cyan-500 hover:bg-cyan-500/10"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold">{player.name}</h3>
                <p className="text-sm text-gray-400">
                  #{player.jersey} • {player.position}
                </p>
              </div>

              {player.captain && (
                <span className="rounded-full bg-yellow-400 px-2 py-1 text-xs font-bold text-black">
                  ⭐
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}