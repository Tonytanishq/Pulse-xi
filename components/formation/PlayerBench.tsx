"use client";

import { Player } from "@/lib/players";

interface Props {
  players: Player[];
  selectedPlayer: Player | null;
  onSelect: (player: Player) => void;
}

export default function PlayerBench({
  players,
  selectedPlayer,
  onSelect,
}: Props) {
  return (
    <div className="flex h-full flex-col rounded-3xl border border-cyan-500/20 bg-[#111827]/90 p-5">

      <h2 className="mb-5 text-2xl font-bold text-cyan-400">
        Bench Players
      </h2>

      <div className="grid max-h-[760px] grid-cols-2 gap-3 overflow-y-auto pr-2">

        {players.map((player) => {

          const active =
            selectedPlayer?.id === player.id;

          return (
            <button
              key={player.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("playerId", String(player.id));
              }}
              onClick={() => onSelect(player)}
              className={`w-full rounded-xl border p-3 text-left transition-all duration-300 ${
                active
                  ? "border-cyan-400 bg-cyan-500/20 shadow-lg shadow-cyan-500/30"
                  : "border-white/10 bg-white/5 hover:border-cyan-500/50 hover:bg-white/10"
              }`}
            >
              <div className="flex items-center justify-between">

                <div>

                  <h3 className="text-base font-bold">
                    {player.name}
                  </h3>

                  <p className="text-sm text-gray-400">
                    #{player.jersey} • {player.position}
                  </p>

                </div>

                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500 text-base font-bold text-black"
                >
                  {player.name[0]}
                </div>

              </div>
            </button>
          );
        })}

      </div>
    </div>
  );
}