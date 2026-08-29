"use client";

import PositionSlot from "./PositionSlot";
import { Lineup, Formation } from "@/hooks/useFormation";
import { FORMATION_POSITIONS } from "@/lib/formations";
import { Player } from "@/lib/players";

interface FootballPitchProps {
  formation: Formation;

  lineup: Lineup;

  selectedPlayer: Player | null;

  assignPlayer: (position: keyof Lineup) => void;

  assignDraggedPlayer: (
    position: keyof Lineup,
    player: Player
  ) => void;

  removePlayer: (position: keyof Lineup) => void;

  onPlayerSelect: (player: Player) => void;
}

export default function FootballPitch({
  formation,
  lineup,

  selectedPlayer,
  assignPlayer,
  
  assignDraggedPlayer,
  removePlayer,
  onPlayerSelect,
}: FootballPitchProps) {

const positions = Object.entries(FORMATION_POSITIONS[formation] ?? {}).map(
  ([key, value]) => ({
    key,
    top: value.top,
    left: value.left,
  })
);

  return (
    <div className="relative h-[900px] w-full overflow-visible rounded-[36px] border border-green-500/20 bg-[#0b5d26] shadow-2xl">

      {/* Grass */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#16753b] via-[#126b34] to-[#0d5b2d]" />

      {/* Grass Stripes */}
      {Array.from({ length: 18 }).map((_, i) => (
        <div
          key={i}
          className="absolute left-0 w-full"
          style={{
            top: `${i * 5.5}%`,
            height: "5.5%",
            background:
              i % 2 === 0
                ? "rgba(255,255,255,.05)"
                : "rgba(0,0,0,.05)",
          }}
        />
      ))}

      {/* Outer Border */}
      <div className="absolute inset-8 rounded-[28px] border-[4px] border-white/60" />

      {/* Halfway Line */}
      <div className="absolute left-8 right-8 top-1/2 h-[4px] -translate-y-1/2 bg-white/60" />

      {/* Centre Circle */}
      <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border-[4px] border-white/60" />

      {/* Centre Spot */}
      <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />

      {/* Top Penalty Area */}
      <div className="absolute left-1/2 top-8 h-40 w-80 -translate-x-1/2 border-[4px] border-white/60" />

      {/* Top Goal Box */}
      <div className="absolute left-1/2 top-8 h-18 w-36 -translate-x-1/2 border-[4px] border-white/60" />

      {/* Bottom Penalty Area */}
      <div className="absolute bottom-8 left-1/2 h-40 w-80 -translate-x-1/2 border-[4px] border-white/60" />

      {/* Bottom Goal Box */}
      <div className="absolute bottom-8 left-1/2 h-18 w-36 -translate-x-1/2 border-[4px] border-white/60" />

      {/* Top Penalty Spot */}
      <div className="absolute left-1/2 top-[155px] h-3 w-3 -translate-x-1/2 rounded-full bg-white" />

      {/* Bottom Penalty Spot */}
      <div className="absolute bottom-[155px] left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-white" />

      {/* Players */}
      {positions.map((slot) => (
        <PositionSlot
          key={`${slot.key}-${lineup[slot.key as keyof Lineup]?.id ?? "empty"}`}
          position={slot.key as keyof Lineup}
          player={lineup[slot.key as keyof Lineup]}
          selectedPlayer={selectedPlayer}
          top={slot.top}
          left={slot.left}
          onClick={() => assignPlayer(slot.key as keyof Lineup)}
          assignDraggedPlayer={assignDraggedPlayer}
          onPlayerSelect={onPlayerSelect}
          removePlayer={removePlayer}
        />
      ))}
    </div>
  );
}