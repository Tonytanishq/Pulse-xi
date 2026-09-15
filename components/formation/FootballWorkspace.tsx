"use client";

import { useEffect, useState } from "react";

import FootballPitch from "./FootballPitch";
import FormationToolbar from "./FormationToolbar";
import PlayerBench from "./PlayerBench";
import MatchdayPanel from "./MatchdayPanel";

import { players, Player } from "@/lib/players";
import { useFormation } from "@/hooks/useFormation";
import { LayoutGroup } from "framer-motion";

import PlayerDetails from "./PlayerDetails";
import { analyzeFormation } from "@/lib/formationIntelligence";
import { getFormationRecommendations } from "@/lib/formationRecommendations";
import FormationIntelligencePanel from "./FormationIntelligencePanel";
import { buildRecommendedXI } from "@/lib/recommendedXI";

import SavedTacticsPanel from "./SavedTacticsPanel";
import { saveTactic } from "@/lib/savedTactics";

import {
  createMatchday,
  MatchVenue,
  Matchday,
  saveMatchday,
  loadMatchday,
  deleteMatchday,
  updateMatchdayLineup,
  updateMatchdaySubstitutes,
  updateMatchdayConfirmation,
} from "@/lib/matchday";

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
    loadSavedTactic,

    confirmStartingXI,
    unlockStartingXI,
    isXIConfirmed,
  } = useFormation();

  const [matchday, setMatchday] =
    useState<Matchday | null>(null);

  const [substitutes, setSubstitutes] =
    useState<Player[]>([]);

  /*
   * ============================================================
   * RESTORE SAVED MATCHDAY
   * ============================================================
   */

  useEffect(() => {
    const savedMatchday = loadMatchday();

    if (savedMatchday) {
      setMatchday(savedMatchday);

      setSubstitutes(
        savedMatchday.substitutes ?? []
      );
    }
  }, []);

  /*
   * ============================================================
   * FORMATION INTELLIGENCE
   * ============================================================
   */

  const intelligence = analyzeFormation(
    lineup,
    formation
  );

  const recommendations =
    getFormationRecommendations(
      lineup,
      formation,
      players
    );

  const recommendedXI = buildRecommendedXI(
    formation,
    players
  );

  /*
   * ============================================================
   * SAVE TACTIC
   * ============================================================
   */

  function handleSaveTactic() {
    const name = window.prompt(
      "Enter a name for this tactic:"
    );

    if (!name?.trim()) {
      return;
    }

    saveTactic(
      name,
      formation,
      lineup
    );

    window.alert(
      `⚽ "${name.trim()}" saved successfully!`
    );
  }

  /*
   * ============================================================
   * STARTING XI HELPERS
   * ============================================================
   */

  function getStartingXIIds(): Set<number> {
    return new Set(
      Object.values(lineup)
        .filter(
          (player): player is Player =>
            player !== null
        )
        .map((player) => player.id)
    );
  }

  /*
   * ============================================================
   * SYNC SUBSTITUTES
   * ============================================================
   */

  function syncSubstitutesWithLineup(
    currentSubstitutes: Player[]
  ) {
    const startingXIIds =
      getStartingXIIds();

    const cleanedSubstitutes =
      currentSubstitutes.filter(
        (player) =>
          !startingXIIds.has(player.id)
      );

    setSubstitutes(
      cleanedSubstitutes
    );

    if (matchday) {
      const updatedMatchday =
        updateMatchdaySubstitutes(
          cleanedSubstitutes
        );

      if (updatedMatchday) {
        setMatchday(updatedMatchday);
      }
    }

    return cleanedSubstitutes;
  }

  /*
   * ============================================================
   * ASSIGN PLAYER TO STARTING XI
   *
   * Wrapper around useFormation so that a player who was
   * previously selected as a substitute is automatically
   * removed from the bench.
   * ============================================================
   */

  function handleAssignPlayer(
    position: Parameters<
      typeof assignPlayer
    >[0]
  ) {
    if (!selectedPlayer) {
      return;
    }

    const playerId =
      selectedPlayer.id;

    const updatedSubstitutes =
      substitutes.filter(
        (player) =>
          player.id !== playerId
      );

    assignPlayer(position);

    if (
      updatedSubstitutes.length !==
      substitutes.length
    ) {
      setSubstitutes(
        updatedSubstitutes
      );

      if (matchday) {
        const updatedMatchday =
          updateMatchdaySubstitutes(
            updatedSubstitutes
          );

        if (updatedMatchday) {
          setMatchday(
            updatedMatchday
          );
        }
      }
    }
  }

  /*
   * ============================================================
   * DRAG PLAYER INTO STARTING XI
   * ============================================================
   */

  function handleAssignDraggedPlayer(
    position: Parameters<
      typeof assignDraggedPlayer
    >[0],
    player: Player
  ) {
    const updatedSubstitutes =
      substitutes.filter(
        (substitute) =>
          substitute.id !== player.id
      );

    assignDraggedPlayer(
      position,
      player
    );

    if (
      updatedSubstitutes.length !==
      substitutes.length
    ) {
      setSubstitutes(
        updatedSubstitutes
      );

      if (matchday) {
        const updatedMatchday =
          updateMatchdaySubstitutes(
            updatedSubstitutes
          );

        if (updatedMatchday) {
          setMatchday(
            updatedMatchday
          );
        }
      }
    }
  }

  /*
   * ============================================================
   * CREATE MATCHDAY
   * ============================================================
   */

  function handleCreateMatchday(
    opponent: string,
    date: string,
    kickoff: string,
    venue: MatchVenue
  ) {
    const newMatchday =
      createMatchday(
        opponent,
        date,
        kickoff,
        venue,
        formation,
        lineup
      );

    const matchdayWithSubstitutes: Matchday = {
      ...newMatchday,
      substitutes: [...substitutes],
      confirmed: isXIConfirmed,
    };

    setMatchday(
      matchdayWithSubstitutes
    );

    setSubstitutes([
      ...substitutes,
    ]);

    saveMatchday(
      matchdayWithSubstitutes
    );

    window.alert(
      `📋 Matchday created against ${newMatchday.opponent}!`
    );
  }

  /*
   * ============================================================
   * SUBSTITUTE MANAGEMENT
   * ============================================================
   */

  function handleToggleSubstitute(
    player: Player
  ) {
    const startingXIIds =
      getStartingXIIds();

    /*
     * A Starting XI player can never
     * simultaneously be a substitute.
     */
    if (
      startingXIIds.has(player.id)
    ) {
      window.alert(
        "⚠️ A Starting XI player cannot also be a substitute."
      );

      return;
    }

    const alreadySelected =
      substitutes.some(
        (substitute) =>
          substitute.id === player.id
      );

    /*
     * REMOVE SUBSTITUTE
     */

    if (alreadySelected) {
      const updatedSubstitutes =
        substitutes.filter(
          (substitute) =>
            substitute.id !== player.id
        );

      setSubstitutes(
        updatedSubstitutes
      );

      if (matchday) {
        const updatedMatchday =
          updateMatchdaySubstitutes(
            updatedSubstitutes
          );

        if (updatedMatchday) {
          setMatchday(
            updatedMatchday
          );
        }
      }

      return;
    }

    /*
     * MAXIMUM 7 SUBSTITUTES
     */

    if (substitutes.length >= 7) {
      window.alert(
        "🪑 Maximum 7 substitutes allowed."
      );

      return;
    }

    /*
     * ADD SUBSTITUTE
     */

    const updatedSubstitutes = [
      ...substitutes,
      player,
    ];

    setSubstitutes(
      updatedSubstitutes
    );

    if (matchday) {
      const updatedMatchday =
        updateMatchdaySubstitutes(
          updatedSubstitutes
        );

      if (updatedMatchday) {
        setMatchday(
          updatedMatchday
        );
      }
    }
  }

  /*
   * ============================================================
   * DELETE MATCHDAY
   * ============================================================
   */

  function handleDeleteMatchday() {
    const confirmed =
      window.confirm(
        "Delete the current matchday?"
      );

    if (!confirmed) {
      return;
    }

    deleteMatchday();

    setMatchday(null);
    setSubstitutes([]);

    window.alert(
      "🗑️ Current matchday deleted."
    );
  }

  /*
   * ============================================================
   * CONFIRM / UPDATE STARTING XI
   * ============================================================
   */

  function handleStartingXIAction() {
    /*
     * ==========================================================
     * UNLOCK
     * ==========================================================
     */

    if (isXIConfirmed) {
      unlockStartingXI();

      /*
       * Keep Matchday confirmation state
       * synchronized with Formation state.
       */

      const updatedMatchday =
        updateMatchdayConfirmation(
          false
        );

      if (updatedMatchday) {
        setMatchday(
          updatedMatchday
        );
      }

      return;
    }

    /*
     * ==========================================================
     * CONFIRM
     * ==========================================================
     */

    const confirmed =
      confirmStartingXI();

    /*
     * confirmStartingXI() returns false
     * when the XI is not exactly 11 players.
     */

    if (!confirmed) {
      return;
    }

    /*
     * Remove any accidental substitute
     * overlap before saving the XI.
     */

    const startingXIIds =
      new Set(
        Object.values(lineup)
          .filter(
            (player): player is Player =>
              player !== null
          )
          .map((player) => player.id)
      );

    const cleanedSubstitutes =
      substitutes.filter(
        (player) =>
          !startingXIIds.has(
            player.id
          )
      );

    setSubstitutes(
      cleanedSubstitutes
    );

    /*
     * Save the exact current Formation
     * snapshot into the Matchday.
     */

    if (matchday) {
      const updatedMatchday =
        updateMatchdayLineup(
          lineup,
          true
        );

      if (updatedMatchday) {
        const syncedMatchday: Matchday = {
          ...updatedMatchday,
          substitutes:
            cleanedSubstitutes,
          confirmed: true,
        };

        saveMatchday(
          syncedMatchday
        );

        setMatchday(
          syncedMatchday
        );
      }
    }
  }

  /*
   * ============================================================
   * RENDER
   * ============================================================
   */

  return (
    <div className="min-h-screen bg-[#050816] text-white">

      {/* ========================================================
          HEADER
      ======================================================== */}

      <div className="border-b border-cyan-500/20 px-8 py-6">
        <h1 className="text-4xl font-black tracking-wide">
          ⚽ Pulse XI
        </h1>

        <p className="mt-2 text-gray-400">
          Professional Football Management Platform
        </p>
      </div>

      {/* ========================================================
          FORMATION TOOLBAR
      ======================================================== */}

      <FormationToolbar
        formation={formation}
        onFormationChange={setFormation}
        onReset={resetFormation}
      />

      {/* ========================================================
          MAIN WORKSPACE
      ======================================================== */}

      <div className="grid grid-cols-[360px_1fr_320px] gap-6 p-6">

        {/* ======================================================
            LEFT — PLAYER BENCH
        ====================================================== */}

        <div className="flex flex-col gap-6">

          <PlayerBench
            players={players}
            startingXI={Object.values(lineup).filter(
              (player): player is Player =>
                player !== null
            )}
            substitutes={substitutes}
            selectedPlayer={selectedPlayer}
            onSelect={setSelectedPlayer}
            onToggleSubstitute={
              handleToggleSubstitute
            }
          />

          {/* ==================================================
              MATCHDAY SETUP
          ================================================== */}

          <MatchdayPanel
            formation={formation}
            onCreateMatchday={
              handleCreateMatchday
            }
          />

        </div>

        {/* ======================================================
            CENTER — FOOTBALL PITCH
        ====================================================== */}

        <LayoutGroup>
          <FootballPitch
            formation={formation}
            lineup={lineup}
            selectedPlayer={selectedPlayer}
            assignPlayer={
              handleAssignPlayer
            }
            assignDraggedPlayer={
              handleAssignDraggedPlayer
            }
            removePlayer={
              removePlayer
            }
            onPlayerSelect={
              setSelectedPlayer
            }
          />
        </LayoutGroup>

        {/* ======================================================
            RIGHT — MANAGEMENT PANEL
        ====================================================== */}

        <div className="flex flex-col gap-6">

          {/* ==================================================
              CURRENT MATCHDAY
          ================================================== */}

          {matchday && (
            <div className="rounded-3xl border border-purple-400/20 bg-purple-500/5 p-5 shadow-xl">

              <div className="mb-4 flex items-center justify-between">

                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-purple-400">
                    Active Matchday
                  </p>

                  <h2 className="mt-1 text-xl font-black text-white">
                    vs {matchday.opponent}
                  </h2>
                </div>

                <div className="rounded-xl border border-purple-400/20 bg-purple-500/10 px-3 py-2 text-xs font-black text-purple-300">
                  {matchday.venue}
                </div>

              </div>

              <div className="space-y-2 text-xs text-gray-400">

                <div className="flex justify-between">
                  <span>Date</span>

                  <span className="font-bold text-white">
                    {matchday.date}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Kickoff</span>

                  <span className="font-bold text-white">
                    {matchday.kickoff}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Formation</span>

                  <span className="font-bold text-cyan-300">
                    {matchday.formation}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Substitutes</span>

                  <span className="font-bold text-emerald-300">
                    {substitutes.length} / 7
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Status</span>

                  <span
                    className={`
                      font-black
                      ${
                        matchday.status ===
                        "UPCOMING"
                          ? "text-cyan-300"
                          : matchday.status ===
                              "LIVE"
                            ? "text-red-300"
                            : "text-emerald-300"
                      }
                    `}
                  >
                    {matchday.status}
                  </span>
                </div>

              </div>

              <div className="mt-4 rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2 text-center text-[10px] font-black uppercase tracking-widest text-gray-500">
                {matchday.confirmed
                  ? "Starting XI confirmed"
                  : "Starting XI snapshot saved"}
              </div>

              {/* ==================================================
                  DELETE MATCHDAY
              ================================================== */}

              <button
                type="button"
                onClick={
                  handleDeleteMatchday
                }
                className="
                  mt-3
                  w-full
                  rounded-xl
                  border
                  border-red-400/20
                  bg-red-500/5
                  px-4
                  py-2.5
                  text-[10px]
                  font-black
                  uppercase
                  tracking-widest
                  text-red-300
                  transition-all
                  hover:bg-red-500/10
                  hover:text-red-200
                "
              >
                🗑️ DELETE MATCHDAY
              </button>

            </div>
          )}

          {/* ==================================================
              SAVED TACTICS
          ================================================== */}

          <SavedTacticsPanel
            onLoadTactic={
              loadSavedTactic
            }
          />

          {/* ==================================================
              CONFIRM / EDIT STARTING XI
          ================================================== */}

          <button
            type="button"
            onClick={
              handleStartingXIAction
            }
            className="
              w-full
              rounded-2xl
              border
              border-yellow-400/30
              bg-yellow-500/10
              px-5
              py-4
              text-sm
              font-black
              tracking-wide
              text-yellow-300
              shadow-lg
              transition-all
              hover:scale-[1.02]
              hover:bg-yellow-500/20
              hover:text-white
            "
          >
            {isXIConfirmed
              ? "🔓 EDIT STARTING XI"
              : "🔒 CONFIRM STARTING XI"}
          </button>

          {/* ==================================================
              SAVE CURRENT XI
          ================================================== */}

          <button
            type="button"
            onClick={
              handleSaveTactic
            }
            className="
              w-full
              rounded-2xl
              border
              border-emerald-400/30
              bg-emerald-500/10
              px-5
              py-4
              text-sm
              font-black
              tracking-wide
              text-emerald-300
              shadow-lg
              transition-all
              hover:scale-[1.02]
              hover:bg-emerald-500/20
              hover:text-white
            "
          >
            💾 SAVE CURRENT XI
          </button>

          {/* ==================================================
              BUILD BEST XI
          ================================================== */}

          <button
            type="button"
            onClick={() => {
              recommendedXI.players.forEach(
                (selection) => {
                  handleAssignDraggedPlayer(
                    selection.position,
                    selection.player
                  );
                }
              );
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

          {/* ==================================================
              PLAYER DETAILS
          ================================================== */}

          <PlayerDetails
            player={
              selectedPlayer
                ? Object.values(
                    lineup
                  ).find(
                    (p) =>
                      p?.id ===
                      selectedPlayer.id
                  ) ??
                  selectedPlayer
                : null
            }
            onCaptain={setCaptain}
            onViceCaptain={
              setViceCaptain
            }
          />

          {/* ==================================================
              FORMATION INTELLIGENCE
          ================================================== */}

          <FormationIntelligencePanel
            intelligence={
              intelligence
            }
            recommendations={
              recommendations.recommendations
            }
            onAssignRecommendation={(
              position,
              player
            ) => {
              handleAssignDraggedPlayer(
                position,
                player
              );
            }}
          />

        </div>
      </div>
    </div>
  );
}