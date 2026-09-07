import { Formation, Lineup } from "@/hooks/useFormation";

export type MatchVenue = "HOME" | "AWAY";

export type MatchdayStatus =
  | "UPCOMING"
  | "LIVE"
  | "COMPLETED";

export interface Matchday {
  id: string;
  opponent: string;
  date: string;
  kickoff: string;
  venue: MatchVenue;
  formation: Formation;
  lineup: Lineup;
  confirmed: boolean;
  status: MatchdayStatus;
  createdAt: string;
}

const MATCHDAY_STORAGE_KEY =
  "pulse-xi-matchday";

/*
 * ============================================================
 * CREATE MATCHDAY
 * ============================================================
 */

export function createMatchday(
  opponent: string,
  date: string,
  kickoff: string,
  venue: MatchVenue,
  formation: Formation,
  lineup: Lineup
): Matchday {
  return {
    id: `match-${Date.now()}`,
    opponent: opponent.trim(),
    date,
    kickoff,
    venue,
    formation,
    lineup,
    confirmed: false,
    status: "UPCOMING",
    createdAt: new Date().toISOString(),
  };
}

/*
 * ============================================================
 * SAVE MATCHDAY
 * ============================================================
 */

export function saveMatchday(
  matchday: Matchday
): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    MATCHDAY_STORAGE_KEY,
    JSON.stringify(matchday)
  );
}

/*
 * ============================================================
 * LOAD MATCHDAY
 * ============================================================
 */

export function loadMatchday(): Matchday | null {
  if (typeof window === "undefined") {
    return null;
  }

  const savedMatchday =
    localStorage.getItem(
      MATCHDAY_STORAGE_KEY
    );

  if (!savedMatchday) {
    return null;
  }

  try {
    return JSON.parse(
      savedMatchday
    ) as Matchday;
  } catch {
    console.warn(
      "Pulse XI: Failed to restore saved matchday."
    );

    return null;
  }
}

/*
 * ============================================================
 * UPDATE MATCHDAY CONFIRMATION
 * ============================================================
 */

export function updateMatchdayConfirmation(
  confirmed: boolean
): Matchday | null {
  const matchday = loadMatchday();

  if (!matchday) {
    return null;
  }

  const updatedMatchday: Matchday = {
    ...matchday,
    confirmed,
  };

  saveMatchday(updatedMatchday);

  return updatedMatchday;
}

/*
 * ============================================================
 * UPDATE MATCHDAY STATUS
 * ============================================================
 */

export function updateMatchdayStatus(
  status: MatchdayStatus
): Matchday | null {
  const matchday = loadMatchday();

  if (!matchday) {
    return null;
  }

  const updatedMatchday: Matchday = {
    ...matchday,
    status,
  };

  saveMatchday(updatedMatchday);

  return updatedMatchday;
}

/*
 * ============================================================
 * UPDATE MATCHDAY LINEUP
 * ============================================================
 */

export function updateMatchdayLineup(
  lineup: Lineup,
  confirmed: boolean
): Matchday | null {
  const matchday = loadMatchday();

  if (!matchday) {
    return null;
  }

  const updatedMatchday: Matchday = {
    ...matchday,
    lineup,
    confirmed,
  };

  saveMatchday(updatedMatchday);

  return updatedMatchday;
}

/*
 * ============================================================
 * DELETE MATCHDAY
 * ============================================================
 */

export function deleteMatchday(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(
    MATCHDAY_STORAGE_KEY
  );
}