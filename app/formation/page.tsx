"use client";

import { useState } from "react";

import Pitch from "@/components/formation/Pitch";
import PlayerBench from "@/components/formation/PlayerBench";

import { Player, players } from "@/lib/players";

export default function FormationPage() {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

  return (
    <main className="min-h-screen bg-[#050816] p-10 text-white">

      <h1 className="mb-10 text-center text-5xl font-black">
        ⚽ Formation Builder
      </h1>

      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">

        <PlayerBench
          players={players}
          selectedPlayer={selectedPlayer}
          onSelect={setSelectedPlayer}
        />

        <div className="space-y-6">

          <Pitch />

          <div className="rounded-2xl border border-cyan-500/30 bg-[#08101d] p-5">

            <h2 className="text-xl font-bold text-cyan-400">
              Selected Player
            </h2>

            {selectedPlayer ? (
              <div className="mt-4">

                <h3 className="text-3xl font-black">
                  {selectedPlayer.name}
                </h3>

                <p className="mt-2 text-gray-300">
                  #{selectedPlayer.jersey}
                </p>

                <p className="text-cyan-300">
                  {selectedPlayer.position}
                </p>

                {selectedPlayer.captain && (
                  <div className="mt-3 inline-block rounded-full bg-yellow-400 px-3 py-1 font-bold text-black">
                    ⭐ Captain
                  </div>
                )}

              </div>
            ) : (
              <p className="mt-4 text-gray-400">
                Select a player from the bench.
              </p>
            )}

          </div>

        </div>

      </div>

    </main>
  );
}