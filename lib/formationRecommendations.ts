import {
  Lineup,
  Formation,
} from "@/hooks/useFormation";
import { Player } from "@/lib/players";
import { validatePlayerPosition } from "@/lib/positionValidation";
import { FORMATION_POSITIONS } from "@/lib/formations";

export interface FormationRecommendation {
  player: Player;
  position: keyof Lineup;
  reason: string;
  scoreImprovement: number;
  currentPlayer?: Player | null;
  isReplacement?: boolean;
}

export interface RecommendationResult {
  recommendations: FormationRecommendation[];
}

function getPlayersInLineup(lineup: Lineup): Player[] {
  return Object.values(lineup).filter(
    (player): player is Player => player !== null
  );
}

function getRecommendationScore(
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

  const positionScore =
    validation === "primary" ? 100 : 75;

  const rating = player.rating ?? 0;
  const fitness = player.fitness ?? 0;
  const attendance = player.attendance ?? 0;

  return (
    rating * 0.45 +
    positionScore * 0.30 +
    fitness * 0.15 +
    attendance * 0.10
  );
}

export function getFormationRecommendations(
  lineup: Lineup,
  formation: Formation,
  squad: Player[]
): RecommendationResult {
  const recommendations: FormationRecommendation[] = [];

  const positions =
    FORMATION_POSITIONS[formation] ?? {};

  const playersInLineup =
    getPlayersInLineup(lineup);

  const lineupIds = new Set(
    playersInLineup.map((player) => player.id)
  );

  /*
   * Only players who are not currently in the XI
   * can be considered as alternatives.
   */
  const availablePlayers = squad.filter(
    (player) => !lineupIds.has(player.id)
  );

  const candidates: FormationRecommendation[] = [];

  /*
   * Evaluate every player → every formation position.
   */
  Object.keys(positions).forEach((position) => {
    const slot = position as keyof Lineup;

    const currentPlayer = lineup[slot];

    availablePlayers.forEach((player) => {
      const recommendedScore =
        getRecommendationScore(
          player,
          position
        );

      if (recommendedScore <= 0) {
        return;
      }

      const currentScore =
        currentPlayer
          ? getRecommendationScore(
              currentPlayer,
              position
            )
          : 0;

      const scoreImprovement =
        recommendedScore - currentScore;

      /*
       * Empty position:
       * Any valid player is useful.
       */
      if (!currentPlayer) {
        const validation =
          validatePlayerPosition(
            player,
            position
          );

        const reason =
          validation === "primary"
            ? `${player.name} is a natural ${position} with a strong overall profile.`
            : `${player.name} can cover ${position} as a secondary position.`;

        candidates.push({
          player,
          position: slot,
          reason,
          scoreImprovement:
            Math.round(
              recommendedScore * 10
            ) / 10,
          currentPlayer: null,
          isReplacement: false,
        });

        return;
      }

      /*
       * Occupied position:
       * Only recommend a replacement when
       * the alternative is genuinely better.
       */
      if (scoreImprovement <= 5) {
        return;
      }

      const validation =
        validatePlayerPosition(
          player,
          position
        );

      const reason =
        validation === "primary"
          ? `${player.name} is a natural ${position} and improves this position by ${Math.round(scoreImprovement * 10) / 10} points.`
          : `${player.name} can cover ${position} and improves this position by ${Math.round(scoreImprovement * 10) / 10} points.`;

      candidates.push({
        player,
        position: slot,
        reason,
        scoreImprovement:
          Math.round(
            scoreImprovement * 10
          ) / 10,
        currentPlayer,
        isReplacement: true,
      });
    });
  });

  /*
   * Highest improvement first.
   */
  candidates.sort(
    (a, b) =>
      b.scoreImprovement -
      a.scoreImprovement
  );

  /*
   * Prevent the same player from being
   * recommended multiple times.
   */
  const usedPlayers = new Set<number>();

  /*
   * Prevent multiple recommendations
   * targeting the same position.
   */
  const usedPositions =
    new Set<keyof Lineup>();

  for (const candidate of candidates) {
    if (recommendations.length >= 5) {
      break;
    }

    if (
      usedPlayers.has(
        candidate.player.id
      )
    ) {
      continue;
    }

    if (
      usedPositions.has(
        candidate.position
      )
    ) {
      continue;
    }

    recommendations.push(candidate);

    usedPlayers.add(
      candidate.player.id
    );

    usedPositions.add(
      candidate.position
    );
  }

  return {
    recommendations,
  };
}