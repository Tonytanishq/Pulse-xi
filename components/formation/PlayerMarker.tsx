"use client";

import { Player } from "@/lib/players";

interface Props {
  player: Player;
  selected?: boolean;
  onClick?: () => void;
}

export default function PlayerMarker({
  player,
  selected = false,
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className={`
        group
        absolute
        -translate-x-1/2
        -translate-y-1/2
        transition-all
        duration-300
        hover:scale-110
      `}
    >
      {/* Circle */}

      <div
        className={`
          w-14
          h-14
          rounded-full
          flex
          items-center
          justify-center
          font-black
          text-lg
          shadow-xl

          ${
            selected
              ? "bg-cyan-400 text-black ring-4 ring-cyan-300"
              : "bg-[#071c34] text-cyan-300 border-2 border-cyan-400"
          }

          group-hover:shadow-cyan-400/60
        `}
      >
        {player.name.charAt(0)}
      </div>

      {/* Name */}

      <p className="mt-2 text-center text-white font-bold text-sm whitespace-nowrap">
        {player.name}
      </p>

      {/* Position */}

      <p className="text-center text-cyan-300 text-xs">
        {player.primaryPosition}
      </p>
    </button>
  );
}