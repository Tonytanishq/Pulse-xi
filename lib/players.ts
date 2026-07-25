// ============================================================
// PULSE XI — Player data layer
// Base roster is real (BVRIT FC). Profile stats are derived
// deterministically from the roster so the UI feels alive and
// numbers stay stable between renders/pages.
// ============================================================

export type PositionGroup = "GK" | "DEF" | "MID" | "FWD";
export type Foot = "Left" | "Right" | "Both";
export type FitnessStatus = "Match Fit" | "Knock" | "Recovering" | "Injured";

export interface Player {
  id: number;
  jersey: number;
  name: string;
  position: string;
  captain?: boolean;

  // Derived profile (all optional so legacy consumers keep compiling)
  group?: PositionGroup;
  foot?: Foot;
  age?: number;
  heightCm?: number;
  weightKg?: number;

  matches?: number;
  goals?: number;
  assists?: number;
  yellowCards?: number;
  redCards?: number;
  minutes?: number;

  attendance?: number; // %
  fitness?: number; // %
  rating?: number; // avg match rating 0-10
  form?: number[]; // last 5 ratings
  status?: FitnessStatus;
  joined?: number; // year
}

interface RosterEntry {
  id: number;
  jersey: number;
  name: string;
  position: string;
  captain?: boolean;
}

const roster: RosterEntry[] = [
  { id: 1, jersey: 54, name: "LOHITH", position: "LM" },
  { id: 2, jersey: 44, name: "NANDU", position: "LM" },
  { id: 3, jersey: 13, name: "DEVA", position: "RM" },
  { id: 4, jersey: 18, name: "MANOJ", position: "CB" },
  { id: 5, jersey: 14, name: "DANIEL", position: "LM/LB" },
  { id: 6, jersey: 93, name: "HRISHIKESH", position: "CB" },
  { id: 7, jersey: 4, name: "SURYA", position: "CB" },
  { id: 8, jersey: 15, name: "RAHUL", position: "CB" },
  { id: 9, jersey: 1, name: "KEERTHAN", position: "GK" },
  { id: 10, jersey: 21, name: "SUVAN", position: "GK" },
  { id: 11, jersey: 19, name: "MOKSHU", position: "CDM" },
  { id: 12, jersey: 8, name: "BAGATH CHANDRA", position: "CAM" },
  { id: 13, jersey: 25, name: "PRANAY", position: "LB" },
  { id: 14, jersey: 10, name: "ANURAG", position: "LM" },
  { id: 15, jersey: 17, name: "BALA", position: "CAM" },
  { id: 16, jersey: 23, name: "MELVIN", position: "LM" },
  { id: 17, jersey: 16, name: "RAHUL REDDY", position: "ST" },
  { id: 18, jersey: 5, name: "YESHWANTH MADHANI", position: "CAM" },
  { id: 19, jersey: 9, name: "SOHAN", position: "CDM" },
  { id: 20, jersey: 33, name: "ARAVIND", position: "RM/RB" },
  { id: 21, jersey: 25, name: "GANESH", position: "ST" },
  { id: 22, jersey: 20, name: "NIRANJAN", position: "LM/RM" },
  { id: 23, jersey: 3, name: "TONY", position: "CB", captain: true },
  { id: 24, jersey: 22, name: "ARJUN", position: "RB" },
  { id: 25, jersey: 7, name: "MURARI", position: "CDM" },
  { id: 26, jersey: 11, name: "SIDDHU", position: "ST" },
  { id: 27, jersey: 6, name: "NOOR", position: "GK" },
  { id: 28, jersey: 2, name: "BHASKAR", position: "RB" },
];

// --- deterministic pseudo-random helpers ---
function seeded(n: number): number {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x); // 0..1
}
function between(seed: number, min: number, max: number): number {
  return Math.round(min + seeded(seed) * (max - min));
}

export function positionGroup(position: string): PositionGroup {
  const p = position.toUpperCase();
  if (p.includes("GK")) return "GK";
  if (p.startsWith("ST") || p.includes("CF") || p.startsWith("LW") || p.startsWith("RW"))
    return "FWD";
  if (p.includes("CB") || p.includes("RB") || p.includes("LB")) return "DEF";
  return "MID";
}

const GROUP_META: Record<
  PositionGroup,
  { goals: [number, number]; assists: [number, number]; heights: [number, number] }
> = {
  GK: { goals: [0, 0], assists: [0, 1], heights: [180, 192] },
  DEF: { goals: [0, 4], assists: [1, 6], heights: [174, 188] },
  MID: { goals: [2, 9], assists: [3, 12], heights: [168, 182] },
  FWD: { goals: [6, 18], assists: [2, 9], heights: [172, 186] },
};

function enrich(entry: RosterEntry): Player {
  const s = entry.id;
  const group = positionGroup(entry.position);
  const meta = GROUP_META[group];

  const matches = between(s + 1, 12, 24);
  const goals = between(s + 2, meta.goals[0], meta.goals[1]);
  const assists = between(s + 3, meta.assists[0], meta.assists[1]);
  const attendance = between(s + 4, 74, 100);
  const fitness = between(s + 5, 68, 99);
  const ratingBase = 6.4 + seeded(s + 6) * 2.4; // 6.4 – 8.8
  const rating = Math.round(ratingBase * 10) / 10;
  const form = Array.from({ length: 5 }, (_, i) =>
    Math.round((5.8 + seeded(s * 5 + i) * 3.4) * 10) / 10,
  );

  const statusRoll = seeded(s + 9);
  const status: FitnessStatus =
    fitness > 92
      ? "Match Fit"
      : statusRoll > 0.85
        ? "Injured"
        : statusRoll > 0.7
          ? "Recovering"
          : fitness < 78
            ? "Knock"
            : "Match Fit";

  return {
    ...entry,
    group,
    foot: seeded(s + 10) > 0.72 ? "Left" : seeded(s + 11) > 0.9 ? "Both" : "Right",
    age: between(s + 12, 18, 23),
    heightCm: between(s + 13, meta.heights[0], meta.heights[1]),
    weightKg: between(s + 14, 62, 82),
    matches,
    goals,
    assists,
    yellowCards: between(s + 15, 0, 5),
    redCards: seeded(s + 16) > 0.88 ? 1 : 0,
    minutes: matches * between(s + 17, 55, 90),
    attendance,
    fitness,
    rating,
    form,
    status,
    joined: between(s + 18, 2022, 2025),
  };
}

export const players: Player[] = roster.map(enrich);

export function getPlayer(id: number): Player | undefined {
  return players.find((p) => p.id === id);
}

export const captain = players.find((p) => p.captain);

// --- roster-level aggregates (used across dashboard / analytics) ---
export const teamStats = {
  total: players.length,
  goals: players.reduce((a, p) => a + (p.goals ?? 0), 0),
  assists: players.reduce((a, p) => a + (p.assists ?? 0), 0),
  avgAttendance: Math.round(
    players.reduce((a, p) => a + (p.attendance ?? 0), 0) / players.length,
  ),
  avgFitness: Math.round(
    players.reduce((a, p) => a + (p.fitness ?? 0), 0) / players.length,
  ),
};

export const GROUP_LABEL: Record<PositionGroup, string> = {
  GK: "Goalkeepers",
  DEF: "Defenders",
  MID: "Midfielders",
  FWD: "Forwards",
};

export const GROUP_ACCENT: Record<PositionGroup, string> = {
  GK: "#fbbf24",
  DEF: "#38bdf8",
  MID: "#22d3ee",
  FWD: "#34d399",
};
