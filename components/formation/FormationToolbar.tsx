"use client";

import { Formation } from "@/hooks/useFormation";

interface Props {
  formation: Formation;
  onFormationChange: (formation: Formation) => void;
  onReset: () => void;
}

const formations: Formation[] = [
  "4-3-3",
  "4-2-3-1",
  "4-4-2",
  "3-5-2",
];

export default function FormationToolbar({
  formation,
  onFormationChange,
  onReset,
}: Props) {
  return (
    <div className="flex items-center justify-between border-b border-cyan-500/20 px-8 py-4">
      <div className="flex gap-3">
        {formations.map((item) => (
          <button
            key={item}
            onClick={() => onFormationChange(item)}
            className={`rounded-xl px-4 py-2 transition ${
              formation === item
                ? "bg-cyan-400 text-black shadow-lg shadow-cyan-400/40"
                : "bg-white/5 hover:bg-cyan-500/20 hover:scale-105"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <button
        onClick={onReset}
        className="rounded-xl bg-red-500 px-4 py-2 font-semibold hover:bg-red-600"
      >
        Reset
      </button>
    </div>
  );
}