import { Lineup, Formation } from "@/hooks/useFormation";
import { Player } from "@/lib/players";
import { validatePlayerPosition } from "@/lib/positionValidation";

export interface FormationIntelligence {
  overallRating: number;
  formationScore: number;

  averageFitness: number;
  averageAttendance: number;

  defence: "Strong" | "Balanced" | "Weak";
  midfield: "Strong" | "Balanced" | "Weak";
  attack: "Strong" | "Balanced" | "Weak";

  warnings: string[];
  suggestions: string[];
}

function getPlayers(lineup: Lineup): Player[] {
  return Object.values(lineup).filter(
    (player): player is Player => player !== null
  );
}

function average(values: number[]) {
  if (!values.length) return 0;

  return (
    values.reduce((sum, value) => sum + value, 0) /
    values.length
  );
}

function getStrength(value: number) {
  if (value >= 80) return "Strong";
  if (value >= 65) return "Balanced";
  return "Weak";
}

function getPositionScore(
  player: Player,
  position: string
) {
  const validation = validatePlayerPosition(
    player,
    position
  );

  if (validation === "primary") return 100;
  if (validation === "secondary") return 75;

  return 40;
}

export function analyzeFormation(
  lineup: Lineup,
  formation: Formation
): FormationIntelligence {
  const squad = getPlayers(lineup);

  if (!squad.length) {
    return {
      overallRating: 0,
      formationScore: 0,

      averageFitness: 0,
      averageAttendance: 0,

      defence: "Weak",
      midfield: "Weak",
      attack: "Weak",

      warnings: [
        "No players assigned to the lineup.",
      ],

      suggestions: [
        "Start building your XI.",
      ],
    };
  }

  // ============================================================
  // BASIC SQUAD METRICS
  // ============================================================

  const averageRating = average(
    squad.map(
      (player) => player.rating ?? 0
    )
  );

  const averageFitness = average(
    squad.map(
      (player) => player.fitness ?? 0
    )
  );

  const averageAttendance = average(
    squad.map(
      (player) => player.attendance ?? 0
    )
  );

  // ============================================================
  // POSITION GROUPS
  // ============================================================

  const defenders = squad.filter((player) =>
    [
      "CB",
      "LB",
      "RB",
      "LCB",
      "RCB",
      "LWB",
      "RWB",
    ].includes(player.primaryPosition)
  );

  const midfielders = squad.filter((player) =>
    [
      "CDM",
      "CM",
      "CAM",
      "LM",
      "RM",
    ].includes(player.primaryPosition)
  );

  const attackers = squad.filter((player) =>
    [
      "ST",
      "LW",
      "RW",
    ].includes(player.primaryPosition)
  );

  // ============================================================
  // AREA RATINGS
  // ============================================================

  const defenceRating = average(
    defenders.map(
      (player) => player.rating ?? 0
    )
  );

  const midfieldRating = average(
    midfielders.map(
      (player) => player.rating ?? 0
    )
  );

  const attackRating = average(
    attackers.map(
      (player) => player.rating ?? 0
    )
  );

  // ============================================================
  // WARNINGS + SUGGESTIONS
  // ============================================================

  const warnings: string[] = [];
  const suggestions: string[] = [];

  // ============================================================
  // POSITION INTELLIGENCE
  // ============================================================

  let positionScoreTotal = 0;
  let positionCount = 0;

  Object.entries(lineup).forEach(
    ([position, player]) => {
      if (!player) return;

      const validation =
        validatePlayerPosition(
          player,
          position
        );

      positionScoreTotal += getPositionScore(
        player,
        position
      );

      positionCount++;

      if (validation === "secondary") {
        warnings.push(
          `${player.name} is playing ${position} outside their primary position.`
        );

        suggestions.push(
          `Consider moving ${player.name} to their primary position if possible.`
        );
      }

      if (validation === "invalid") {
        warnings.push(
          `${player.name} is not naturally suited to ${position}.`
        );

        suggestions.push(
          `Consider replacing ${player.name} at ${position} with a more suitable player.`
        );
      }
    }
  );

  const positionScore =
    positionCount > 0
      ? positionScoreTotal / positionCount
      : 0;

  // ============================================================
  // FITNESS
  // ============================================================

  if (averageFitness < 75) {
    warnings.push(
      "Overall squad fitness is below 75%."
    );

    suggestions.push(
      "Consider selecting fitter players before matchday."
    );
  }

  if (averageFitness >= 90) {
    suggestions.push(
      "Squad fitness is excellent."
    );
  }

  // ============================================================
  // ATTENDANCE
  // ============================================================

  if (averageAttendance < 80) {
    warnings.push(
      "Squad attendance is below 80%."
    );

    suggestions.push(
      "Players with stronger attendance may provide more reliable match availability."
    );
  }

  if (averageAttendance >= 90) {
    suggestions.push(
      "Squad attendance is excellent."
    );
  }

  // ============================================================
  // FORMATION REQUIREMENTS
  // ============================================================

  if (formation === "4-3-3") {
    if (attackers.length < 3) {
      warnings.push(
        "4-3-3 requires three attacking players."
      );
    }

    if (midfielders.length < 3) {
      warnings.push(
        "4-3-3 midfield depth is incomplete."
      );
    }
  }

  if (formation === "4-2-3-1") {
    if (midfielders.length < 3) {
      warnings.push(
        "4-2-3-1 requires strong midfield coverage."
      );
    }
  }

  if (formation === "4-4-2") {
    if (attackers.length < 2) {
      warnings.push(
        "4-4-2 requires two attacking players."
      );
    }
  }

  if (formation === "3-5-2") {
    if (defenders.length < 3) {
      warnings.push(
        "3-5-2 requires three defenders."
      );
    }
  }

  // ============================================================
  // AREA SUGGESTIONS
  // ============================================================

  if (defenceRating < 65) {
    suggestions.push(
      "Defence is the weakest area of the lineup."
    );
  }

  if (midfieldRating < 65) {
    suggestions.push(
      "Midfield is the weakest area of the lineup."
    );
  }

  if (attackRating < 65) {
    suggestions.push(
      "Attack is the weakest area of the lineup."
    );
  }

  // ============================================================
  // FORMATION SCORE
  // ============================================================

  /*
    Formation score weighting:

    Player quality       40%
    Position suitability 25%
    Fitness              20%
    Attendance           15%
  */

  const formationScore =
    averageRating * 0.40 +
    positionScore * 0.25 +
    averageFitness * 0.20 +
    averageAttendance * 0.15;

  // ============================================================
  // RETURN INTELLIGENCE
  // ============================================================

  return {
    overallRating:
      Math.round(
        averageRating * 10
      ) / 10,

    formationScore:
      Math.round(
        formationScore
      ),

    averageFitness:
      Math.round(
        averageFitness
      ),

    averageAttendance:
      Math.round(
        averageAttendance
      ),

    defence:
      getStrength(
        defenceRating
      ),

    midfield:
      getStrength(
        midfieldRating
      ),

    attack:
      getStrength(
        attackRating
      ),

    warnings,

    suggestions,
  };
}