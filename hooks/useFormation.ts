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
      localStorage.getItem(
        "pulse-xi-formation"
      );

    const savedLineup =
      localStorage.getItem(
        "pulse-xi-lineup"
      );

    const savedXIConfirmed =
      localStorage.getItem(
        "pulse-xi-confirmed"
      );

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
  // HELPERS
  // ============================================================

  function getAssignedPlayers(
    currentLineup: Lineup = lineup
  ): Player[] {
    return Object.values(currentLineup).filter(
      (player): player is Player =>
        player !== null
    );
  }

  function getStartingXIPlayerIds(
    currentLineup: Lineup = lineup
  ): Set<number> {
    return new Set(
      getAssignedPlayers(currentLineup).map(
        (player) => player.id
      )
    );
  }

  // ============================================================
  // CAPTAIN
  // ============================================================

  function setCaptain(player: Player) {
    if (isXIConfirmed) {
      return;
    }

    setLineup((prev) => {
      const updated = { ...prev };

      (
        Object.keys(updated) as (keyof Lineup)[]
      ).forEach((key) => {
        if (updated[key]) {
          updated[key] = {
            ...updated[key]!,
            captain: false,
          };
        }
      });

      const position = (
        Object.keys(updated) as (keyof Lineup)[]
      ).find(
        (key) =>
          updated[key]?.id === player.id
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
    if (isXIConfirmed) {
      return;
    }

    setLineup((prev) => {
      const updated = { ...prev };

      (
        Object.keys(updated) as (keyof Lineup)[]
      ).forEach((key) => {
        if (updated[key]) {
          updated[key] = {
            ...updated[key]!,
            viceCaptain: false,
          };
        }
      });

      const position = (
        Object.keys(updated) as (keyof Lineup)[]
      ).find(
        (key) =>
          updated[key]?.id === player.id
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

  function assignPlayer(
    position: keyof Lineup
  ) {
    if (isXIConfirmed) {
      return;
    }

    if (!selectedPlayer) {
      return;
    }

    const validation =
      validatePlayerPosition(
        selectedPlayer,
        position
      );

    if (validation === "invalid") {
      return;
    }

    setLineup((prev) => {
      const updated = { ...prev };

      const existingPosition = (
        Object.keys(updated) as (keyof Lineup)[]
      ).find(
        (key) =>
          updated[key]?.id ===
          selectedPlayer.id
      );

      // Prevent the same player from occupying
      // multiple Starting XI positions.
      if (
        existingPosition &&
        existingPosition !== position
      ) {
        return updated;
      }

      updated[position] = selectedPlayer;

      return updated;
    });

    setSelectedPlayer(null);
  }

  // ============================================================
  // DRAG / DROP PLAYER
  // ============================================================

  function assignDraggedPlayer(
    position: keyof Lineup,
    player: Player
  ) {
    if (isXIConfirmed) {
      return;
    }

    const validation =
      validatePlayerPosition(
        player,
        position
      );

    if (validation === "invalid") {
      return;
    }

    setLineup((prev) => {
      const updated = { ...prev };

      const oldPosition = (
        Object.keys(updated) as (keyof Lineup)[]
      ).find(
        (key) =>
          updated[key]?.id === player.id
      );

      const targetPlayer =
        updated[position];

      updated[position] = player;

      if (
        oldPosition &&
        oldPosition !== position
      ) {
        updated[oldPosition] =
          targetPlayer;
      }

      return updated;
    });

    setSelectedPlayer(null);
  }

  // ============================================================
  // REMOVE PLAYER
  // ============================================================

  function removePlayer(
    position: keyof Lineup
  ) {
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

  function setFormation(
    newFormation: Formation
  ) {
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

  function loadSavedTactic(
    tactic: SavedTactic
  ) {
    /*
     * Loading a saved tactic is an explicit
     * user action, so it is allowed to replace
     * the current XI.
     */

    setIsXIConfirmed(false);

    setFormationState(
      tactic.formation
    );

    setLineup({
      ...tactic.lineup,
    });

    setSelectedPlayer(null);
  }

  // ============================================================
  // CONFIRM STARTING XI
  // ============================================================

  function confirmStartingXI(): boolean {
    const assignedPlayers =
      getAssignedPlayers();

    const uniquePlayerIds =
      new Set(
        assignedPlayers.map(
          (player) => player.id
        )
      );

    if (assignedPlayers.length !== 11) {
      window.alert(
        `⚠️ Starting XI must contain exactly 11 players.\n\nCurrent XI: ${assignedPlayers.length}/11`
      );

      return false;
    }

    if (
      uniquePlayerIds.size !== 11
    ) {
      window.alert(
        "⚠️ Starting XI contains duplicate players. Each player can only occupy one position."
      );

      return false;
    }

    setSelectedPlayer(null);
    setIsXIConfirmed(true);

    return true;
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

    getStartingXIPlayerIds,
  };
}