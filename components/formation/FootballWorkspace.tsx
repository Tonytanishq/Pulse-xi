"use client";

import FootballPitch from "./FootballPitch";
import FormationToolbar from "./FormationToolbar";
import PlayerBench from "./PlayerBench";
import { players } from "@/lib/players";
import { useFormation } from "@/hooks/useFormation";
import { LayoutGroup } from "framer-motion";
import PlayerDetails from "./PlayerDetails";
import { analyzeFormation } from "@/lib/formationIntelligence";
import { getFormationRecommendations } from "@/lib/formationRecommendations";
import FormationIntelligencePanel from "./FormationIntelligencePanel";
import { buildRecommendedXI } from "@/lib/recommendedXI";

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

const intelligence = analyzeFormation(lineup, formation);

const recommendations = getFormationRecommendations(
  lineup,
  formation,
  players
);

const recommendedXI = buildRecommendedXI(
  formation,
  players
);

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

            selectedPlayer={selectedPlayer}

            assignPlayer={assignPlayer}
            assignDraggedPlayer={assignDraggedPlayer}
            removePlayer={removePlayer}
            onPlayerSelect={setSelectedPlayer}
          />
        </LayoutGroup>


        <div className="flex flex-col gap-6">

  <button
    type="button"
    onClick={() => {
      recommendedXI.players.forEach((selection) => {
        assignDraggedPlayer(
          selection.position,
          selection.player
        );
      });
    }}
    className="
      w-full
      rounded-2xl
      border
      border-cyan-400/30
      bg-cyan-500/10
      px-5
      py-4
      text-sm
      font-black
      tracking-wide
      text-cyan-300
      shadow-lg
      transition-all
      hover:scale-[1.02]
      hover:bg-cyan-500/20
      hover:text-white
    "
  >
    🧠 BUILD BEST XI
  </button>

  <PlayerDetails
    player={
      selectedPlayer
        ? Object.values(lineup).find(
            (p) => p?.id === selectedPlayer.id
          ) ?? selectedPlayer
        : null
    }
    onCaptain={setCaptain}
    onViceCaptain={setViceCaptain}
  />

  <FormationIntelligencePanel
  intelligence={intelligence}
  recommendations={recommendations.recommendations}
  onAssignRecommendation={(position, player) => {
    assignDraggedPlayer(position, player);
  }}
/>

</div>

      </div>

    </div>
  );
}