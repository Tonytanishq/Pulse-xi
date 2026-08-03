"use client";

import { Player } from "@/lib/players";
import { players } from "@/lib/players";
import FormationPlayerCard from "./FormationPlayerCard";
import { Lineup } from "@/hooks/useFormation";
import { motion } from "framer-motion";

interface Props {
  position: keyof Lineup;
  player: Player | null;
  top: string;
  left: string;
  onClick: () => void;

  assignDraggedPlayer: (
    position: keyof Lineup,
    player: Player
  ) => void;

  onPlayerSelect: (player: Player) => void;

  removePlayer: (position: keyof Lineup) => void;
}

export default function PositionSlot({
  position,
  player,
  top,
  left,
  onClick,
  assignDraggedPlayer,
  onPlayerSelect,
  removePlayer,
}: Props) {
  return (
    <motion.div
      layout
      layoutRoot
      transition={{
        type: "spring",
        stiffness: 140,
        damping: 18,
      }}
      className="
        absolute
        -translate-x-1/2
        -translate-y-1/2
      "
      style={{
        top,
        left,
      }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
            e.preventDefault();

            const playerId = Number(
                e.dataTransfer.getData("playerId")
            );

            const draggedPlayer = players.find(
                (p) => p.id === playerId
            );

            if (!draggedPlayer) return;

            assignDraggedPlayer(position, draggedPlayer);
        }}
    >
      {player ? (
        <div
            className="
                relative
                group

                transition-transform
                duration-300
                ease-out

                hover:-translate-y-2
                hover:scale-110
            "
        >

        <div
          onClick={() => {
            onPlayerSelect(player);
          }}
          className="transition cursor-pointer"
          >
          <FormationPlayerCard player={player} />
        </div>

          {/* Remove Button */}
          <button
            onClick={() => removePlayer(position)}
            className="
              absolute
              -top-3
              -right-3
              h-8
              w-8
              rounded-full
              bg-red-600
              text-white
              font-bold
              shadow-lg
              opacity-0
              group-hover:opacity-100
              transition
              hover:bg-red-700
            "
          >
            ✕
          </button>

        </div>
      ) : (
        <button
            onClick={onClick}
            className="
                flex
                h-20
                w-20
                flex-col
                items-center
                justify-center
                rounded-full
                border-2
                border-dashed
                border-cyan-400
                bg-black/30
                text-cyan-300
                transition
                hover:border-cyan-300
                hover:scale-110
                "
            >
                <span className="text-2xl font-bold">+</span>
                <span className="text-xs">{position}</span>
            </button>
      )}
    </motion.div>
  );
}