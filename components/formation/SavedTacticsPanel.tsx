"use client";

import { useEffect, useState } from "react";
import {
  deleteTactic,
  getSavedTactics,
  SavedTactic,
} from "@/lib/savedTactics";

interface Props {
  onLoadTactic: (tactic: SavedTactic) => void;
}

export default function SavedTacticsPanel({
  onLoadTactic,
}: Props) {
  const [tactics, setTactics] = useState<SavedTactic[]>([]);

  useEffect(() => {
    setTactics(getSavedTactics());
  }, []);

  function handleDelete(id: string) {
    deleteTactic(id);

    setTactics((currentTactics) =>
      currentTactics.filter((tactic) => tactic.id !== id)
    );
  }

  return (
    <div className="rounded-3xl border border-cyan-500/20 bg-[#111827]/90 p-6 shadow-xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-cyan-400">
            🧠 Saved Tactics
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Your saved formations and starting XIs
          </p>
        </div>

        <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-cyan-400">
          {tactics.length} Saved
        </span>
      </div>

      {tactics.length === 0 ? (
        <div className="rounded-2xl bg-white/5 p-5 text-center">
          <p className="text-sm text-gray-500">
            No saved tactics yet.
          </p>

          <p className="mt-1 text-[10px] text-gray-600">
            Save your current XI to see it here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {tactics.map((tactic) => (
            <div
              key={tactic.id}
              className="rounded-2xl border border-white/5 bg-white/5 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-white">
                    {tactic.name}
                  </p>

                  <p className="mt-1 text-xs text-cyan-400">
                    Formation: {tactic.formation}
                  </p>

                  <p className="mt-1 text-[10px] text-gray-600">
                    {new Date(tactic.createdAt).toLocaleString()}
                  </p>
                </div>

                <span className="shrink-0 rounded-lg bg-cyan-500/10 px-2 py-1 text-[10px] font-bold text-cyan-400">
                  XI
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onLoadTactic(tactic)}
                  className="
                    rounded-xl
                    border
                    border-cyan-400/30
                    bg-cyan-500/10
                    px-3
                    py-2
                    text-xs
                    font-black
                    text-cyan-300
                    transition-all
                    hover:scale-[1.02]
                    hover:bg-cyan-500/20
                    hover:text-white
                  "
                >
                  ⚡ LOAD
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(tactic.id)}
                  className="
                    rounded-xl
                    border
                    border-red-400/20
                    bg-red-500/5
                    px-3
                    py-2
                    text-xs
                    font-black
                    text-red-300
                    transition-all
                    hover:scale-[1.02]
                    hover:bg-red-500/10
                    hover:text-white
                  "
                >
                  🗑 DELETE
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}