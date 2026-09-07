import { Formation, Lineup } from "@/hooks/useFormation";

export interface SavedTactic {
  id: string;
  name: string;
  formation: Formation;
  lineup: Lineup;
  createdAt: string;
}

const STORAGE_KEY = "pulse-xi-saved-tactics";

export function getSavedTactics(): SavedTactic[] {
  if (typeof window === "undefined") {
    return [];
  }

  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return [];
  }

  try {
    return JSON.parse(saved) as SavedTactic[];
  } catch {
    return [];
  }
}

export function saveTactic(
  name: string,
  formation: Formation,
  lineup: Lineup
): SavedTactic {
  const tactics = getSavedTactics();

  const tactic: SavedTactic = {
    id: crypto.randomUUID(),
    name: name.trim(),
    formation,
    lineup,
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify([
      ...tactics,
      tactic,
    ])
  );

  return tactic;
}

export function deleteTactic(id: string): void {
  const tactics = getSavedTactics();

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      tactics.filter(
        (tactic) => tactic.id !== id
      )
    )
  );
}
