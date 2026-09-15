"use client";

import { Player } from "@/lib/players";

interface Props {
  players: Player[];
  startingXI: Player[];
  substitutes: Player[];
  selectedPlayer: Player | null;
  onSelect: (player: Player) => void;
  onToggleSubstitute: (player: Player) => void;
}

export default function PlayerBench({
  players,
  startingXI,
  substitutes,
  selectedPlayer,
  onSelect,
  onToggleSubstitute,
}: Props) {
  const startingXIIds = new Set(
    startingXI.map((player) => player.id)
  );

  const substituteIds = new Set(
    substitutes.map((player) => player.id)
  );

  const benchPlayers = players.filter(
    (player) => !startingXIIds.has(player.id)
  );

  return (
    <div className="flex h-full flex-col rounded-3xl border border-cyan-500/20 bg-[#111827]/90 p-5">
      {/* HEADER */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-cyan-400">
            Bench Players
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Select players for the matchday bench
          </p>
        </div>

        <div className="rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1">
          <span className="text-xs font-black text-cyan-300">
            {substitutes.length} / 7
          </span>
        </div>
      </div>

      {/* PLAYERS */}
      <div className="grid max-h-[760px] grid-cols-2 gap-3 overflow-y-auto pr-2">
        {benchPlayers.map((player) => {
          const selected =
            selectedPlayer?.id === player.id;

          const isSubstitute =
            substituteIds.has(player.id);

          return (
            <div
              key={player.id}
              className={`
                relative
                rounded-xl
                border
                p-3
                transition-all
                duration-300
                ${
                  isSubstitute
                    ? "border-emerald-400/50 bg-emerald-500/10 shadow-lg shadow-emerald-500/10"
                    : selected
                      ? "border-cyan-400 bg-cyan-500/20 shadow-lg shadow-cyan-500/20"
                      : "border-white/10 bg-white/5"
                }
              `}
            >
              {/* PLAYER SELECT */}
              <button
                type="button"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData(
                    "playerId",
                    String(player.id)
                  );
                }}
                onClick={() => onSelect(player)}
                className="w-full text-left"
              >
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-bold text-white">
                      {player.name}
                    </h3>

                    <p className="text-sm text-gray-400">
                      #{player.jersey} •{" "}
                      {player.primaryPosition}
                    </p>
                  </div>

                  <div
                    className={`
                      ml-2
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      text-base
                      font-bold
                      ${
                        isSubstitute
                          ? "bg-emerald-400 text-black"
                          : "bg-cyan-500 text-black"
                      }
                    `}
                  >
                    {player.name[0]}
                  </div>
                </div>
              </button>

              {/* SUBSTITUTE BUTTON */}
              <button
                type="button"
                onClick={() =>
                  onToggleSubstitute(player)
                }
                disabled={
                  !isSubstitute &&
                  substitutes.length >= 7
                }
                className={`
                  mt-3
                  w-full
                  rounded-lg
                  border
                  px-2
                  py-2
                  text-[10px]
                  font-black
                  tracking-wider
                  transition-all
                  ${
                    isSubstitute
                      ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25"
                      : substitutes.length >= 7
                        ? "cursor-not-allowed border-white/5 bg-white/5 text-gray-600"
                        : "border-cyan-400/20 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 hover:text-white"
                  }
                `}
              >
                {isSubstitute
                  ? "✓ SUBSTITUTE"
                  : substitutes.length >= 7
                    ? "BENCH FULL"
                    : "+ ADD SUBSTITUTE"}
              </button>
            </div>
          );
        })}

        {benchPlayers.length === 0 && (
          <div className="col-span-2 rounded-xl border border-white/10 bg-white/5 p-6 text-center">
            <p className="text-sm font-bold text-gray-400">
              All squad players are in the Starting XI.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}