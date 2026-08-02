"use client";

import { Player } from "@/lib/players";

interface Props {
  player: Player;
}

export default function FormationPlayerCard({ player }: Props) {
  return (
    <div
        draggable
        onDragStart={(e) => {
            e.dataTransfer.setData("playerId", player.id.toString());
        }}
        className="
        group
        flex
        w-24
        flex-col
        items-center
        cursor-grab
        active:cursor-grabbing
        
        "
    >

      {/* Player Circle */}
      <div
    className="
    flex
    h-14
    w-14
    items-center
    justify-center
    rounded-full

    bg-gradient-to-br
    from-cyan-400
    to-blue-600

    text-xl
    font-black
    text-white

    shadow-lg

    transition-all
    duration-300

    group-hover:shadow-cyan-400/70
    group-hover:shadow-2xl
    "
    >
        {player.name.charAt(0)}
      </div>

      {/* Name */}
      <p className="mt-2 text-center text-sm font-bold uppercase leading-tight">
        {player.name}
      </p>

      {/* Jersey + Position */}
      <p className="text-xs text-cyan-300">
        #{player.jersey} • {player.position}
      </p>

      {/* Captain */}
      {player.captain && (
        <span className="mt-1 rounded-full bg-yellow-500 px-2 py-0.5 text-[10px] font-bold text-black">
          C
        </span>
      )}

    </div>
  );
}