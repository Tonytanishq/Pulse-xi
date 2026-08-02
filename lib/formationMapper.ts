import { Formation, Lineup } from "@/hooks/useFormation";

type PositionMap = Record<string, string>;

const MAPS: Record<Formation, Record<Formation, PositionMap>> = {
  "4-3-3": {
    "4-3-3": {},

    "4-2-3-1": {
      LW: "LAM",
      RW: "RAM",
      CAM: "CAM",
      CDM1: "CDM1",
      CDM2: "CDM2",
      ST: "ST",
    },

    "4-4-2": {
      LW: "LM",
      RW: "RM",
      CAM: "CM1",
      CDM1: "CM2",
      ST: "ST1",
    },

    "3-5-2": {
      LW: "LWB",
      RW: "RWB",
      CAM: "CAM",
      ST: "ST1",
      CB1: "LCB",
      CB2: "RCB",
    },
  },

  "4-2-3-1": {
    "4-3-3": {},
    "4-2-3-1": {},
    "4-4-2": {},
    "3-5-2": {},
  },

  "4-4-2": {
    "4-3-3": {},
    "4-2-3-1": {},
    "4-4-2": {},
    "3-5-2": {},
  },

  "3-5-2": {
    "4-3-3": {},
    "4-2-3-1": {},
    "4-4-2": {},
    "3-5-2": {},
  },
};

export function remapFormation(
  lineup: Lineup,
  from: Formation,
  to: Formation
): Lineup {
  const mapping = MAPS[from][to];

  const newLineup = {} as Lineup;

  // Initialize every position to null
  (Object.keys(lineup) as (keyof Lineup)[]).forEach((key) => {
    newLineup[key] = null;
  });

  // Move players according to mapping
  (Object.entries(lineup) as [keyof Lineup, Lineup[keyof Lineup]][]).forEach(
    ([position, player]) => {
      if (!player) return;

      const target = (mapping[position as string] ?? position) as keyof Lineup;

      newLineup[target] = player;
    }
  );

  return newLineup;
}