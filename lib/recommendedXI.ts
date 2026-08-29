import {
  Lineup,
  Formation,
} from "@/hooks/useFormation";

import { Player } from "@/lib/players";
import { validatePlayerPosition } from "@/lib/positionValidation";
import { FORMATION_POSITIONS } from "@/lib/formations";

export interface RecommendedXIPlayer {
  player: Player;
  position: keyof Lineup;
  score: number;
  reason: string;
}

export interface RecommendedXIResult {
  players: RecommendedXIPlayer[];
  teamScore: number;
  formation: Formation;
}

/* ============================================================
   PLAYER → POSITION SCORE
   ============================================================ */

function getPlayerScore(
  player: Player,
  position: string
): number {
  const validation = validatePlayerPosition(
    player,
    position
  );

  if (validation === "invalid") {
    return 0;
  }

  const rating = player.rating ?? 0;
  const fitness = player.fitness ?? 0;
  const attendance = player.attendance ?? 0;

  /*
   * Position suitability is heavily weighted because
   * a high-rated player in the wrong position should
   * not automatically beat a natural player.
   */

  const positionScore =
    validation === "primary"
      ? 100
      : 75;

  return (
    rating * 0.45 +
    positionScore * 0.30 +
    fitness * 0.15 +
    attendance * 0.10
  );
}

/* ============================================================
   RECOMMENDATION REASON
   ============================================================ */

function getReason(
  player: Player,
  position: string
): string {
  const validation =
    validatePlayerPosition(
      player,
      position
    );

  const rating = player.rating ?? 0;
  const fitness = player.fitness ?? 0;
  const attendance = player.attendance ?? 0;

  if (validation === "primary") {
    if (fitness >= 90 && rating >= 85) {
      return `${player.name} is a natural ${position} with elite rating and excellent fitness.`;
    }

    if (fitness >= 90) {
      return `${player.name} is a natural ${position} and enters the XI in excellent condition.`;
    }

    if (rating >= 85) {
      return `${player.name} is a natural ${position} with a high-quality overall rating.`;
    }

    if (attendance >= 90) {
      return `${player.name} is a natural ${position} with strong reliability and attendance.`;
    }

    return `${player.name} is a natural ${position} with a strong overall profile.`;
  }

  return `${player.name} provides reliable secondary coverage at ${position}.`;
}

/* ============================================================
   BUILD BEST XI
   ============================================================ */

export function buildRecommendedXI(
  formation: Formation,
  squad: Player[]
): RecommendedXIResult {
  const formationSlots =
    Object.keys(
      FORMATION_POSITIONS[formation] ?? {}
    ) as (keyof Lineup)[];

  if (!formationSlots.length || !squad.length) {
    return {
      players: [],
      teamScore: 0,
      formation,
    };
  }

  /* ==========================================================
     BUILD EVERY VALID PLAYER → POSITION OPTION
     ========================================================== */

  const candidates = formationSlots.flatMap(
    (position) =>
      squad
        .map((player) => ({
          player,
          position,
          score: getPlayerScore(
            player,
            position
          ),
        }))
        .filter(
          (candidate) =>
            candidate.score > 0
        )
  );

  /* ==========================================================
     SCARCITY ANALYSIS
     
     Positions with fewer suitable players are filled first.
     This prevents a flexible player from accidentally taking
     a position where another player has no alternatives.
     ========================================================== */

  const candidateCount = new Map<
    keyof Lineup,
    number
  >();

  formationSlots.forEach(
    (position) => {
      candidateCount.set(
        position,
        candidates.filter(
          (candidate) =>
            candidate.position === position
        ).length
      );
    }
  );

  const orderedPositions =
    [...formationSlots].sort(
      (a, b) => {
        const countA =
          candidateCount.get(a) ?? 0;

        const countB =
          candidateCount.get(b) ?? 0;

        return countA - countB;
      }
    );

  /* ==========================================================
     SELECT PLAYERS
     ========================================================== */

  const usedPlayers = new Set<number>();

  const selected: RecommendedXIPlayer[] =
    [];

  for (const position of orderedPositions) {
    const positionCandidates =
      candidates
        .filter(
          (candidate) =>
            candidate.position === position &&
            !usedPlayers.has(
              candidate.player.id
            )
        )
        .sort(
          (a, b) => {
            /*
             * Primary-position players get a small tie-break
             * advantage over secondary-position players.
             */

            const validationA =
              validatePlayerPosition(
                a.player,
                position
              );

            const validationB =
              validatePlayerPosition(
                b.player,
                position
              );

            if (
              validationA !== validationB
            ) {
              return validationA === "primary"
                ? -1
                : 1;
            }

            return b.score - a.score;
          }
        );

    const best =
      positionCandidates[0];

    if (!best) {
      continue;
    }

    usedPlayers.add(
      best.player.id
    );

    selected.push({
      player: best.player,
      position: best.position,
      score:
        Math.round(
          best.score * 10
        ) / 10,
      reason: getReason(
        best.player,
        best.position
      ),
    });
  }

  /* ==========================================================
     RETURN XI IN FORMATION ORDER
     ========================================================== */

  selected.sort(
    (a, b) =>
      formationSlots.indexOf(
        a.position
      ) -
      formationSlots.indexOf(
        b.position
      )
  );

  /* ==========================================================
     TEAM SCORE
     ========================================================== */

  const teamScore =
    selected.length > 0
      ? Math.round(
          (selected.reduce(
            (sum, item) =>
              sum + item.score,
            0
          ) /
            selected.length) *
            10
        ) / 10
      : 0;

  return {
    players: selected,
    teamScore,
    formation,
  };
}
