"use client";

import FootballPitch from "./FootballPitch";
import FormationToolbar from "./FormationToolbar";
import PlayerBench from "./PlayerBench";
import { players } from "@/lib/players";
import { useFormation } from "@/hooks/useFormation";
import { LayoutGroup } from "framer-motion";
import PlayerDetails from "./PlayerDetails";

export default function FootballWorkspace() {
  const {
  selectedPlayer,
  setSelectedPlayer,

  lineup,
  assignPlayer,
  assignDraggedPlayer,
  removePlayer,

  formation,
  setFormation,

  setCaptain,
  setViceCaptain,

  resetFormation,
} = useFormation();

  return (
    <div className="min-h-screen bg-[#050816] text-white">

      {/* Header */}
      <div className="border-b border-cyan-500/20 px-8 py-6">
        <h1 className="text-4xl font-black tracking-wide">
          ⚽ Pulse XI
        </h1>

        <p className="mt-2 text-gray-400">
          Professional Football Management Platform
        </p>
      </div>

      <FormationToolbar
        formation={formation}
        onFormationChange={setFormation}
        onReset={resetFormation}
      />

      <div className="grid grid-cols-[360px_1fr_320px] gap-6 p-6">

        <PlayerBench
          players={players}
          selectedPlayer={selectedPlayer}
          onSelect={setSelectedPlayer}
        />

        <LayoutGroup>
          <FootballPitch
            formation={formation}
            lineup={lineup}
            assignPlayer={assignPlayer}
            assignDraggedPlayer={assignDraggedPlayer}
            removePlayer={removePlayer}
            onPlayerSelect={setSelectedPlayer}
          />
        </LayoutGroup>


        <PlayerDetails
          player={selectedPlayer}
          onCaptain={setCaptain}
          onViceCaptain={setViceCaptain}
        />

      </div>

    </div>
  );
}