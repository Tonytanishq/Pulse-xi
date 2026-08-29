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

  primaryPosition: string;
  secondaryPositions: string[];

  captain?: boolean;
  viceCaptain?: boolean;

  // Derived profile
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

  attendance?: number;
  fitness?: number;
  rating?: number;
  form?: number[];
  status?: FitnessStatus;
  joined?: number;
}

interface RosterEntry {
  id: number;
  jersey: number;
  name: string;

  primaryPosition: string;
  secondaryPositions: string[];

  captain?: boolean;
}

const roster: RosterEntry[] = [
  {
    id: 1,
    jersey: 54,
    name: "LOHITH",
    primaryPosition: "LM",
    secondaryPositions: ["ST"],
  },

  {
    id: 2,
    jersey: 44,
    name: "NANDU",
    primaryPosition: "LM",
    secondaryPositions: ["RM", "LB"],
  },

  {
    id: 3,
    jersey: 13,
    name: "DEVA",
    primaryPosition: "RM",
    secondaryPositions: ["LM"],
  },

  {
    id: 4,
    jersey: 18,
    name: "MANOJ",
    primaryPosition: "CB",
    secondaryPositions: [],
  },

  {
    id: 5,
    jersey: 14,
    name: "DANIEL",
    primaryPosition: "LM/LB",
    secondaryPositions: ["RM", "RB"],
  },

  {
    id: 6,
    jersey: 93,
    name: "HRISHIKESH",
    primaryPosition: "CB",
    secondaryPositions: [],
  },

  {
    id: 7,
    jersey: 4,
    name: "SURYA",
    primaryPosition: "CB",
    secondaryPositions: ["LB"],
  },

  {
    id: 8,
    jersey: 15,
    name: "RAHUL",
    primaryPosition: "CB",
    secondaryPositions: [],
  },

  {
    id: 9,
    jersey: 1,
    name: "KEERTHAN",
    primaryPosition: "GK",
    secondaryPositions: [],
  },

  {
    id: 10,
    jersey: 21,
    name: "SUVAN",
    primaryPosition: "GK",
    secondaryPositions: [],
  },

  {
    id: 11,
    jersey: 19,
    name: "MOKSHU",
    primaryPosition: "CDM",
    secondaryPositions: ["CAM"],
  },

  {
    id: 12,
    jersey: 8,
    name: "BAGATH CHANDRA",
    primaryPosition: "CAM",
    secondaryPositions: ["RM"],
  },

  {
    id: 13,
    jersey: 25,
    name: "PRANAY",
    primaryPosition: "LB",
    secondaryPositions: [],
  },

  {
    id: 14,
    jersey: 10,
    name: "ANURAG",
    primaryPosition: "LM",
    secondaryPositions: ["CAM", "RM"],
  },

  {
    id: 15,
    jersey: 17,
    name: "BALA",
    primaryPosition: "CAM",
    secondaryPositions: [],
  },

  {
    id: 16,
    jersey: 23,
    name: "MELVIN",
    primaryPosition: "LM",
    secondaryPositions: ["RM"],
  },

  {
    id: 17,
    jersey: 16,
    name: "RAHUL REDDY",
    primaryPosition: "ST",
    secondaryPositions: ["CB", "CAM", "GK"],
  },

  {
    id: 18,
    jersey: 5,
    name: "YESHWANTH MADHANI",
    primaryPosition: "CAM",
    secondaryPositions: ["CDM", "ST"],
  },

  {
    id: 19,
    jersey: 9,
    name: "SOHAN",
    primaryPosition: "CDM",
    secondaryPositions: ["LB", "ST", "LM"],
  },

  {
    id: 20,
    jersey: 33,
    name: "ARAVIND",
    primaryPosition: "RM/RB",
    secondaryPositions: ["LM", "LB"],
  },

  {
    id: 21,
    jersey: 25,
    name: "GANESH",
    primaryPosition: "ST",
    secondaryPositions: [],
  },

  {
    id: 22,
    jersey: 20,
    name: "NIRANJAN",
    primaryPosition: "LM/RM",
    secondaryPositions: ["RM"],
  },

  {
    id: 23,
    jersey: 3,
    name: "TONY",
    primaryPosition: "CB",
    secondaryPositions: ["ST", "LM", "RM", "CAM"],
    captain: true,
  },

  {
    id: 24,
    jersey: 22,
    name: "ARJUN",
    primaryPosition: "RB",
    secondaryPositions: ["RM", "ST"],
  },

  {
    id: 25,
    jersey: 7,
    name: "MURARI",
    primaryPosition: "CDM",
    secondaryPositions: ["CAM", "ST"],
  },

  {
    id: 26,
    jersey: 11,
    name: "SIDDHU",
    primaryPosition: "ST",
    secondaryPositions: ["CAM"],
  },

  {
    id: 27,
    jersey: 6,
    name: "NOOR",
    primaryPosition: "GK",
    secondaryPositions: ["CB"],
  },

  {
    id: 28,
    jersey: 2,
    name: "BHASKAR",
    primaryPosition: "RB",
    secondaryPositions: [],
  },
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

  if (
    p.includes("ST") ||
    p.includes("LW") ||
    p.includes("RW") ||
    p.includes("CF")
  )
    return "FWD";

  if (
    p.includes("CB") ||
    p.includes("LB") ||
    p.includes("RB") ||
    p.includes("LWB") ||
    p.includes("RWB")
  )
    return "DEF";

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
  const group = positionGroup(entry.primaryPosition);
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

    primaryPosition: entry.primaryPosition,
    secondaryPositions: entry.secondaryPositions,
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
