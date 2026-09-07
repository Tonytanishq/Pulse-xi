"use client";

import { useEffect, useState } from "react";
import { Player } from "@/lib/players";
import { remapFormation } from "@/lib/formationMapper";
import { validatePlayerPosition } from "@/lib/positionValidation";
import { SavedTactic } from "@/lib/savedTactics";

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

  const [isXIConfirmed, setIsXIConfirmed] =
    useState(false);

  // ============================================================
  // FORMATION + XI PERSISTENCE
  // ============================================================

  useEffect(() => {
    const savedFormation =
      localStorage.getItem("pulse-xi-formation");

    const savedLineup =
      localStorage.getItem("pulse-xi-lineup");

    const savedXIConfirmed =
      localStorage.getItem("pulse-xi-confirmed");

    if (savedFormation) {
      setFormationState(
        savedFormation as Formation
      );
    }

    if (savedLineup) {
      try {
        setLineup(
          JSON.parse(savedLineup) as Lineup
        );
      } catch {
        console.warn(
          "Pulse XI: Failed to restore saved lineup."
        );
      }
    }

    if (savedXIConfirmed === "true") {
      setIsXIConfirmed(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "pulse-xi-formation",
      formation
    );
  }, [formation]);

  useEffect(() => {
    localStorage.setItem(
      "pulse-xi-lineup",
      JSON.stringify(lineup)
    );
  }, [lineup]);

  useEffect(() => {
    localStorage.setItem(
      "pulse-xi-confirmed",
      String(isXIConfirmed)
    );
  }, [isXIConfirmed]);

  // ============================================================
  // CAPTAIN
  // ============================================================

  function setCaptain(player: Player) {
    // Locked XI → no changes allowed
    if (isXIConfirmed) {
      return;
    }

    setLineup((prev) => {
      const updated = { ...prev };

      // Remove captain from everyone
      (Object.keys(updated) as (keyof Lineup)[]).forEach(
        (key) => {
          if (updated[key]) {
            updated[key] = {
              ...updated[key]!,
              captain: false,
            };
          }
        }
      );

      // Assign new captain
      const position = (
        Object.keys(updated) as (keyof Lineup)[]
      ).find(
        (key) => updated[key]?.id === player.id
      );

      if (position && updated[position]) {
        updated[position] = {
          ...updated[position]!,
          captain: true,
        };
      }

      return updated;
    });
  }

  // ============================================================
  // VICE CAPTAIN
  // ============================================================

  function setViceCaptain(player: Player) {
    // Locked XI → no changes allowed
    if (isXIConfirmed) {
      return;
    }

    setLineup((prev) => {
      const updated = { ...prev };

      // Remove vice captain from everyone
      (Object.keys(updated) as (keyof Lineup)[]).forEach(
        (key) => {
          if (updated[key]) {
            updated[key] = {
              ...updated[key]!,
              viceCaptain: false,
            };
          }
        }
      );

      // Assign new vice captain
      const position = (
        Object.keys(updated) as (keyof Lineup)[]
      ).find(
        (key) => updated[key]?.id === player.id
      );

      if (position && updated[position]) {
        updated[position] = {
          ...updated[position]!,
          viceCaptain: true,
        };
      }

      return updated;
    });
  }

  // ============================================================
  // ASSIGN PLAYER
  // ============================================================

  function assignPlayer(position: keyof Lineup) {
    // Locked XI → no editing
    if (isXIConfirmed) {
      return;
    }

    if (!selectedPlayer) {
      return;
    }

    const validation = validatePlayerPosition(
      selectedPlayer,
      position
    );

    // Invalid position → do not assign
    if (validation === "invalid") {
      return;
    }

    setLineup((prev) => ({
      ...prev,
      [position]: selectedPlayer,
    }));

    setSelectedPlayer(null);
  }

  // ============================================================
  // DRAG / DROP PLAYER
  // ============================================================

  function assignDraggedPlayer(
    position: keyof Lineup,
    player: Player
  ) {
    // Locked XI → no drag/drop changes
    if (isXIConfirmed) {
      return;
    }

    const validation = validatePlayerPosition(
      player,
      position
    );

    // Invalid position → do not allow the drop
    if (validation === "invalid") {
      return;
    }

    setLineup((prev) => {
      const updated = { ...prev };

      // Find where dragged player currently is
      const oldPosition = (
        Object.keys(updated) as (keyof Lineup)[]
      ).find(
        (key) => updated[key]?.id === player.id
      );

      // Player occupying target position
      const targetPlayer = updated[position];

      // Move dragged player
      updated[position] = player;

      // Swap players if dragged player was already on pitch
      if (oldPosition) {
        updated[oldPosition] = targetPlayer;
      }

      return updated;
    });
  }

  // ============================================================
  // REMOVE PLAYER
  // ============================================================

  function removePlayer(position: keyof Lineup) {
    // Locked XI → no removal
    if (isXIConfirmed) {
      return;
    }

    setLineup((prev) => ({
      ...prev,
      [position]: null,
    }));
  }

  // ============================================================
  // CHANGE FORMATION
  // ============================================================

  function setFormation(newFormation: Formation) {
    // Locked XI → formation cannot change
    if (isXIConfirmed) {
      return;
    }

    setLineup((prev) =>
      remapFormation(
        prev,
        formation,
        newFormation
      )
    );

    setFormationState(newFormation);
  }

  // ============================================================
  // LOAD SAVED TACTIC
  // ============================================================

  function loadSavedTactic(tactic: SavedTactic) {
    // Locked XI → cannot replace the confirmed XI
    if (isXIConfirmed) {
      return;
    }

    setFormationState(tactic.formation);
    setLineup(tactic.lineup);
    setSelectedPlayer(null);
  }

  // ============================================================
  // CONFIRM STARTING XI
  // ============================================================

  function confirmStartingXI() {
    setSelectedPlayer(null);
    setIsXIConfirmed(true);
  }

  // ============================================================
  // UNLOCK STARTING XI
  // ============================================================

  function unlockStartingXI() {
    setIsXIConfirmed(false);
  }

  // ============================================================
  // RESET FORMATION
  // ============================================================

  function resetFormation() {
    // Locked XI → cannot reset
    if (isXIConfirmed) {
      return;
    }

    setLineup(EMPTY_LINEUP);
    setSelectedPlayer(null);
    setFormationState("4-3-3");
  }

  // ============================================================
  // RETURN
  // ============================================================

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

    loadSavedTactic,

    confirmStartingXI,
    unlockStartingXI,
    isXIConfirmed,

    resetFormation,
  };
}