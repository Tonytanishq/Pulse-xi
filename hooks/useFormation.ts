"use client";

import { useState } from "react";
import { Player } from "@/lib/players";

export type Formation =
  | "4-3-3"
  | "4-2-3-1"
  | "4-4-2"
  | "3-5-2";

export interface Lineup {
  GK: Player | null;

  LB: Player | null;
  CB1: Player | null;
  CB2: Player | null;
  RB: Player | null;

  CDM1: Player | null;
  CDM2: Player | null;

  LW: Player | null;
  CAM: Player | null;
  RW: Player | null;

  ST: Player | null;
}

const EMPTY_LINEUP: Lineup = {
  GK: null,

  LB: null,
  CB1: null,
  CB2: null,
  RB: null,

  CDM1: null,
  CDM2: null,

  LW: null,
  CAM: null,
  RW: null,

  ST: null,
};

export function useFormation() {
  const [formation, setFormation] =
    useState<Formation>("4-3-3");

  const [selectedPlayer, setSelectedPlayer] =
    useState<Player | null>(null);

  const [lineup, setLineup] =
    useState<Lineup>(EMPTY_LINEUP);

  function assignPlayer(position: keyof Lineup) {
    if (!selectedPlayer) return;

    setLineup((prev) => ({
      ...prev,
      [position]: selectedPlayer,
    }));

    setSelectedPlayer(null);
  }

  function assignDraggedPlayer(
    position: keyof Lineup,
    player: Player
) {
    setLineup((prev) => {
        const updated = { ...prev };

        // Find where the dragged player currently is
        const oldPosition = (
            Object.keys(updated) as (keyof Lineup)[]
        ).find((key) => updated[key]?.id === player.id);

        // Player already occupying the target position
        const targetPlayer = updated[position];

        // Move dragged player
        updated[position] = player;

        // Put target player into dragged player's old position
        if (oldPosition) {
            updated[oldPosition] = targetPlayer;
        }

        return updated;
    });
}

  function removePlayer(position: keyof Lineup) {
    setLineup((prev) => ({
      ...prev,
      [position]: null,
    }));
  }

  function resetFormation() {
    setLineup(EMPTY_LINEUP);
    setSelectedPlayer(null);
  }

  return {
    formation,
    setFormation,

    lineup,

    selectedPlayer,
    setSelectedPlayer,

    assignPlayer,
    assignDraggedPlayer,
    removePlayer,

    resetFormation,
  };
}