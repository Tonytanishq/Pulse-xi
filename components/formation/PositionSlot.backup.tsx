"use client";

import { Player, players } from "@/lib/players";
import FormationPlayerCard from "./FormationPlayerCard";
import { Lineup } from "@/hooks/useFormation";
import { motion } from "framer-motion";
import { validatePlayerPosition } from "@/lib/positionValidation";

interface Props {
  position: keyof Lineup;
  player: Player | null;

  selectedPlayer: Player | null;

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
  selectedPlayer,
  top,
  left,
  onClick,
  assignDraggedPlayer,
  onPlayerSelect,
  removePlayer,
}: Props) {
  // ==========================================
  // POSITION VALIDATION
  // ==========================================

  const validation = selectedPlayer
    ? validatePlayerPosition(selectedPlayer, position)
    : null;

  // ==========================================
  // VALIDATION COLORS
  // ==========================================

  let borderColor = "rgba(34, 211, 238, 0.8)";
  let glowColor = "rgba(34, 211, 238, 0.25)";
  let textColor = "#67e8f9";

  if (validation === "primary") {
    borderColor = "#22c55e";
    glowColor = "rgba(34, 197, 94, 0.55)";
    textColor = "#86efac";
  }

  if (validation === "secondary") {
    borderColor = "#facc15";
    glowColor = "rgba(250, 204, 21, 0.55)";
    textColor = "#fde047";
  }

  if (validation === "invalid") {
    borderColor = "#ef4444";
    glowColor = "rgba(239, 68, 68, 0.55)";
    textColor = "#f87171";
  }

  // ==========================================
  // DRAG & DROP
  // ==========================================

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();

    const playerId = Number(
      e.dataTransfer.getData("playerId")
    );

    const draggedPlayer = players.find(
      (p) => p.id === playerId
    );

    if (!draggedPlayer) return;

    assignDraggedPlayer(position, draggedPlayer);
  }

  // ==========================================
  // RENDER
  // ==========================================

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
      onDrop={handleDrop}
    >
      {player ? (
        // ======================================
        // PLAYER ALREADY IN POSITION
        // ======================================
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
          {/* Player Card */}
          <div
            onClick={() => onPlayerSelect(player)}
            className="
              cursor-pointer
              transition
            "
          >
            <FormationPlayerCard player={player} />
          </div>

          {/* Remove Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removePlayer(position);
            }}
            className="
              absolute
              -top-3
              -right-3
              z-20
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-full
              bg-red-600
              text-white
              font-bold
              shadow-lg
              opacity-0
              transition-all
              duration-200
              group-hover:opacity-100
              hover:scale-110
              hover:bg-red-700
            "
          >
            ✕
          </button>
        </div>
      ) : (
        // ======================================
        // EMPTY POSITION SLOT
        // ======================================
        <button
          type="button"
          onClick={onClick}
          className="
            relative
            flex
            h-20
            w-20
            flex-col
            items-center
            justify-center
            rounded-full
            border-[5px]
            border-dashed
            bg-black/50
            text-white
            transition-all
            duration-300
            hover:scale-110
          "
          style={{
            borderColor,
            color: textColor,
            boxShadow: `0 0 20px ${glowColor}`,
          }}
        >
          {/* Glow */}
          {selectedPlayer && (
            <span
              className="
                pointer-events-none
                absolute
                inset-[-8px]
                rounded-full
                opacity-40
              "
              style={{
                border: `2px solid ${borderColor}`,
                boxShadow: `0 0 25px ${glowColor}`,
              }}
            />
          )}

          {/* Plus */}
          <span className="relative z-10 text-2xl font-bold">
            +
          </span>

          {/* Position */}
          <span
            className="relative z-10 text-xs font-semibold"
            style={{
              color: textColor,
            }}
          >
            {position}
          </span>
        </button>
      )}
    </motion.div>
  );
}