"use client";

import { useState } from "react";
import { Player } from "@/lib/players";
import { remapFormation } from "@/lib/formationMapper";

export type Formation =
  | "4-3-3"
  | "4-2-3-1"
  | "4-4-2"
  | "3-5-2";

export interface Lineup {
  GK: Player | null;

  LB: Player | null;
  RB: Player | null;

  CB1: Player | null;
  CB2: Player | null;

  LCB: Player | null;
  CB: Player | null;
  RCB: Player | null;

  LWB: Player | null;
  RWB: Player | null;

  CDM: Player | null;
  CDM1: Player | null;
  CDM2: Player | null;

  CM1: Player | null;
  CM2: Player | null;

  LM: Player | null;
  RM: Player | null;

  LW: Player | null;
  RW: Player | null;

  LAM: Player | null;
  RAM: Player | null;

  CAM: Player | null;

  ST: Player | null;
  ST1: Player | null;
  ST2: Player | null;
}

const EMPTY_LINEUP: Lineup = {
  GK: null,

  LB: null,
  RB: null,

  CB1: null,
  CB2: null,

  LCB: null,
  CB: null,
  RCB: null,

  LWB: null,
  RWB: null,

  CDM: null,
  CDM1: null,
  CDM2: null,

  CM1: null,
  CM2: null,

  LM: null,
  RM: null,

  LW: null,
  RW: null,

  LAM: null,
  RAM: null,

  CAM: null,

  ST: null,
  ST1: null,
  ST2: null,
};

export function useFormation() {
  const [formation, setFormationState] =
  useState<Formation>("4-3-3");

  const [selectedPlayer, setSelectedPlayer] =
    useState<Player | null>(null);

  const [lineup, setLineup] =
    useState<Lineup>(EMPTY_LINEUP);

  function setCaptain(player: Player) {
  setLineup((prev) => {
    const updated = { ...prev };

    // Remove captain from everyone
    (Object.keys(updated) as (keyof Lineup)[]).forEach((key) => {
      if (updated[key]) {
        updated[key] = {
          ...updated[key]!,
          captain: false,
        };
      }
    });

    // Assign new captain
    const position = (
      Object.keys(updated) as (keyof Lineup)[]
    ).find((key) => updated[key]?.id === player.id);

    if (position && updated[position]) {
      updated[position] = {
        ...updated[position]!,
        captain: true,
      };
    }

    return updated;
  });
}

function setViceCaptain(player: Player) {
  setLineup((prev) => {
    const updated = { ...prev };

    // Remove vice captain from everyone
    (Object.keys(updated) as (keyof Lineup)[]).forEach((key) => {
      if (updated[key]) {
        updated[key] = {
          ...updated[key]!,
          viceCaptain: false,
        };
      }
    });

    // Assign new vice captain
    const position = (
      Object.keys(updated) as (keyof Lineup)[]
    ).find((key) => updated[key]?.id === player.id);

    if (position && updated[position]) {
      updated[position] = {
        ...updated[position]!,
        viceCaptain: true,
      };
    }

    return updated;
  });
}

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

  function setFormation(newFormation: Formation) {
  setLineup((prev) =>
    remapFormation(prev, formation, newFormation)
  );

  setFormationState(newFormation);
}

  function resetFormation() {
  setLineup(EMPTY_LINEUP);
  setSelectedPlayer(null);
  setFormationState("4-3-3");
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

    setCaptain,
    setViceCaptain,

    resetFormation,
  };
}