import { Formation, Lineup } from "@/hooks/useFormation";
import { Player } from "@/lib/players";

export type MatchVenue = "HOME" | "AWAY";

export type MatchdayStatus =
  | "UPCOMING"
  | "LIVE"
  | "COMPLETED";

export type MatchResult =
  | "WIN"
  | "DRAW"
  | "LOSS";

export interface Matchday {
  id: string;

  opponent: string;
  date: string;
  kickoff: string;
  venue: MatchVenue;

  formation: Formation;
  lineup: Lineup;

  substitutes: Player[];

  confirmed: boolean;

  status: MatchdayStatus;

  // ⚽ MATCH RESULT
  bvritScore?: number;
  opponentScore?: number;
  result?: MatchResult;

  createdAt: string;
}

const MATCHDAY_STORAGE_KEY =
  "pulse-xi-matchdays";

const LEGACY_MATCHDAY_STORAGE_KEY =
  "pulse-xi-matchday";

function syncMatchdayLifecycle(
  matchday: Matchday
): Matchday {
  if (matchday.status === "COMPLETED") {
    return matchday;
  }

  if (!matchday.date) {
    return matchday;
  }

  const matchDate = new Date(
    `${matchday.date}T00:00:00`
  );

  if (Number.isNaN(matchDate.getTime())) {
    return matchday;
  }

  const today = new Date();

  const todayDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  if (matchDate < todayDate) {
    return {
      ...matchday,
      status: "COMPLETED",
    };
  }

  return matchday;
}

function normalizeMatchday(
  matchday: Matchday
): Matchday {
  const normalizedMatchday: Matchday = {
    ...matchday,

    substitutes: Array.isArray(
      matchday.substitutes
    )
      ? matchday.substitutes
      : [],

    confirmed:
      typeof matchday.confirmed === "boolean"
        ? matchday.confirmed
        : false,

    status:
      matchday.status === "LIVE" ||
      matchday.status === "COMPLETED"
        ? matchday.status
        : "UPCOMING",

    bvritScore:
      typeof matchday.bvritScore ===
        "number" &&
      matchday.bvritScore >= 0
        ? matchday.bvritScore
        : undefined,

    opponentScore:
      typeof matchday.opponentScore ===
        "number" &&
      matchday.opponentScore >= 0
        ? matchday.opponentScore
        : undefined,

    result:
      matchday.result === "WIN" ||
      matchday.result === "DRAW" ||
      matchday.result === "LOSS"
        ? matchday.result
        : undefined,
  };

  return syncMatchdayLifecycle(
    normalizedMatchday
  );
}

export function createMatchday(
  opponent: string,
  date: string,
  kickoff: string,
  venue: MatchVenue,
  formation: Formation,
  lineup: Lineup
): Matchday {
  return {
    id: `match-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`,

    opponent: opponent.trim(),
    date,
    kickoff,
    venue,

    formation,
    lineup,

    substitutes: [],

    confirmed: false,

    status: "UPCOMING",

    createdAt: new Date().toISOString(),
  };
}

export function getMatchdays(): Matchday[] {
  if (typeof window === "undefined") {
    return [];
  }

  const savedMatchdays =
    localStorage.getItem(
      MATCHDAY_STORAGE_KEY
    );

  if (savedMatchdays) {
    try {
      const parsed =
        JSON.parse(savedMatchdays);

      if (Array.isArray(parsed)) {
        const normalizedMatchdays =
          parsed.map(
            (matchday) =>
              normalizeMatchday(matchday)
          );

        const changed =
          normalizedMatchdays.some(
            (matchday, index) => {
              const original =
                parsed[index];

              return (
                matchday.status !==
                  original?.status ||
                matchday.bvritScore !==
                  original?.bvritScore ||
                matchday.opponentScore !==
                  original?.opponentScore ||
                matchday.result !==
                  original?.result
              );
            }
          );

        if (changed) {
          localStorage.setItem(
            MATCHDAY_STORAGE_KEY,
            JSON.stringify(
              normalizedMatchdays
            )
          );
        }

        return normalizedMatchdays;
      }
    } catch {
      console.warn(
        "Pulse XI: Failed to restore saved matchdays."
      );
    }
  }

  // Legacy migration
  const legacyMatchday =
    localStorage.getItem(
      LEGACY_MATCHDAY_STORAGE_KEY
    );

  if (!legacyMatchday) {
    return [];
  }

  try {
    const parsed =
      JSON.parse(
        legacyMatchday
      ) as Matchday;

    const migratedMatchday =
      normalizeMatchday(parsed);

    localStorage.setItem(
      MATCHDAY_STORAGE_KEY,
      JSON.stringify([
        migratedMatchday,
      ])
    );

    localStorage.removeItem(
      LEGACY_MATCHDAY_STORAGE_KEY
    );

    return [migratedMatchday];
  } catch {
    console.warn(
      "Pulse XI: Failed to migrate legacy matchday."
    );

    return [];
  }
}

export function getMatchday(
  id: string
): Matchday | null {
  const matchdays = getMatchdays();

  return (
    matchdays.find(
      (matchday) =>
        matchday.id === id
    ) ?? null
  );
}

function saveMatchdays(
  matchdays: Matchday[]
): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    MATCHDAY_STORAGE_KEY,
    JSON.stringify(matchdays)
  );
}

export function saveMatchday(
  matchday: Matchday
): void {
  if (typeof window === "undefined") {
    return;
  }

  const matchdays = getMatchdays();

  const existingIndex =
    matchdays.findIndex(
      (existingMatchday) =>
        existingMatchday.id ===
        matchday.id
    );

  const normalizedMatchday =
    normalizeMatchday(matchday);

  if (existingIndex === -1) {
    saveMatchdays([
      ...matchdays,
      normalizedMatchday,
    ]);

    return;
  }

  const updatedMatchdays = [
    ...matchdays,
  ];

  updatedMatchdays[
    existingIndex
  ] = normalizedMatchday;

  saveMatchdays(updatedMatchdays);
}

export function loadMatchday(): Matchday | null {
  const matchdays = getMatchdays();

  if (matchdays.length === 0) {
    return null;
  }

  return matchdays[
    matchdays.length - 1
  ];
}

export function updateMatchday(
  matchday: Matchday
): Matchday | null {
  const matchdays = getMatchdays();

  const index =
    matchdays.findIndex(
      (existingMatchday) =>
        existingMatchday.id ===
        matchday.id
    );

  if (index === -1) {
    return null;
  }

  const updatedMatchdays = [
    ...matchdays,
  ];

  const normalizedMatchday =
    normalizeMatchday(matchday);

  updatedMatchdays[index] =
    normalizedMatchday;

  saveMatchdays(updatedMatchdays);

  return normalizedMatchday;
}

export function updateMatchdayConfirmation(
  confirmed: boolean
): Matchday | null {
  const matchday = loadMatchday();

  if (!matchday) {
    return null;
  }

  return updateMatchday({
    ...matchday,
    confirmed,
  });
}

export function updateMatchdayStatus(
  status: MatchdayStatus
): Matchday | null {
  const matchday = loadMatchday();

  if (!matchday) {
    return null;
  }

  return updateMatchday({
    ...matchday,
    status,
  });
}

export function updateMatchdayLineup(
  lineup: Lineup,
  confirmed: boolean
): Matchday | null {
  const matchday = loadMatchday();

  if (!matchday) {
    return null;
  }

  return updateMatchday({
    ...matchday,
    lineup,
    confirmed,
  });
}

export function updateMatchdaySubstitutes(
  substitutes: Player[]
): Matchday | null {
  const matchday = loadMatchday();

  if (!matchday) {
    return null;
  }

  return updateMatchday({
    ...matchday,
    substitutes,
  });
}

/**
 * Record or edit the final score for a matchday.
 *
 * BVRIT's score and the opponent's score are stored
 * independently of HOME/AWAY venue.
 */
export function updateMatchdayResult(
  id: string,
  bvritScore: number,
  opponentScore: number
): Matchday | null {
  if (
    !Number.isInteger(bvritScore) ||
    !Number.isInteger(opponentScore) ||
    bvritScore < 0 ||
    opponentScore < 0
  ) {
    return null;
  }

  const matchday = getMatchday(id);

  if (!matchday) {
    return null;
  }

  let result: MatchResult;

  if (bvritScore > opponentScore) {
    result = "WIN";
  } else if (
    bvritScore < opponentScore
  ) {
    result = "LOSS";
  } else {
    result = "DRAW";
  }

  return updateMatchday({
    ...matchday,
    status: "COMPLETED",
    bvritScore,
    opponentScore,
    result,
  });
}

export function clearMatchdayResult(
  id: string
): Matchday | null {
  const matchday = getMatchday(id);

  if (!matchday) {
    return null;
  }

  return updateMatchday({
    ...matchday,
    bvritScore: undefined,
    opponentScore: undefined,
    result: undefined,
  });
}

export function deleteMatchday(
  id?: string
): void {
  if (typeof window === "undefined") {
    return;
  }

  const matchdays = getMatchdays();

  if (matchdays.length === 0) {
    return;
  }

  if (id) {
    saveMatchdays(
      matchdays.filter(
        (matchday) =>
          matchday.id !== id
      )
    );

    return;
  }

  const updatedMatchdays =
    matchdays.slice(0, -1);

  saveMatchdays(updatedMatchdays);
}