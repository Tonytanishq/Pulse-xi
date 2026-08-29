"use client";

import { FormationIntelligence } from "@/lib/formationIntelligence";
import { FormationRecommendation } from "@/lib/formationRecommendations";
import { buildFormationVerdict } from "@/lib/formationVerdict";
import { Lineup } from "@/hooks/useFormation";
import { Player } from "@/lib/players";

interface Props {
  intelligence: FormationIntelligence;
  recommendations: FormationRecommendation[];
  onAssignRecommendation: (
    position: keyof Lineup,
    player: Player
  ) => void;
}

export default function FormationIntelligencePanel({
  intelligence,
  recommendations,
  onAssignRecommendation,
}: Props) {
      const verdict = buildFormationVerdict(intelligence);
  const strengthStyle = (value: string) => {
    if (value === "Strong") return "text-green-400";
    if (value === "Balanced") return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="rounded-3xl border border-cyan-500/20 bg-[#111827]/90 p-6 shadow-xl">

      <h2 className="text-xl font-black text-cyan-400">
        🧠 Formation Intelligence
      </h2>

      <p className="mt-1 text-xs text-gray-500">
        Tactical analysis of your current XI
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">

        <div className="rounded-2xl bg-white/5 p-4 text-center">
          <div className="text-3xl font-black text-white">
            {intelligence.overallRating}
          </div>

          <div className="mt-1 text-xs text-gray-500">
            Overall Rating
          </div>
        </div>

        <div className="rounded-2xl bg-cyan-500/10 p-4 text-center">
          <div className="text-3xl font-black text-cyan-400">
            {intelligence.formationScore}
          </div>

          <div className="mt-1 text-xs text-cyan-500/70">
            Formation Score
          </div>
        </div>

      </div>

      <div className="mt-5 space-y-3">

        <div className="flex justify-between rounded-xl bg-white/5 p-3">
          <span>🛡 Defence</span>
          <span
            className={`font-bold ${strengthStyle(
              intelligence.defence
            )}`}
          >
            {intelligence.defence}
          </span>
        </div>

        <div className="flex justify-between rounded-xl bg-white/5 p-3">
          <span>🎯 Midfield</span>
          <span
            className={`font-bold ${strengthStyle(
              intelligence.midfield
            )}`}
          >
            {intelligence.midfield}
          </span>
        </div>

        <div className="flex justify-between rounded-xl bg-white/5 p-3">
          <span>⚡ Attack</span>
          <span
            className={`font-bold ${strengthStyle(
              intelligence.attack
            )}`}
          >
            {intelligence.attack}
          </span>
        </div>

      </div>

            <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-500/5 p-4">

        <div className="flex items-center justify-between gap-3">

          <div>
            <p className="text-sm font-black text-cyan-400">
              🧠 Tactical Verdict
            </p>

            <p className="mt-1 text-sm font-bold text-white">
              {verdict.headline}
            </p>
          </div>

          <span
            className={`shrink-0 rounded-full px-3 py-1 text-[9px] font-black uppercase tracking-wider ${
              verdict.priority === "Balanced"
                ? "bg-green-500/10 text-green-400"
                : "bg-orange-500/10 text-orange-400"
            }`}
          >
            {verdict.priority}
          </span>

        </div>

        <p className="mt-3 text-xs leading-relaxed text-gray-400">
          {verdict.summary}
        </p>

      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">

        <div className="rounded-xl bg-white/5 p-3">
          <p className="text-xs text-gray-500">
            Fitness
          </p>

          <p className="text-lg font-bold">
            {intelligence.averageFitness}%
          </p>
        </div>

        <div className="rounded-xl bg-white/5 p-3">
          <p className="text-xs text-gray-500">
            Attendance
          </p>

          <p className="text-lg font-bold">
            {intelligence.averageAttendance}%
          </p>
        </div>

      </div>

      {intelligence.warnings.length > 0 && (
        <div className="mt-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-3">

          <p className="mb-2 text-sm font-bold text-yellow-400">
            ⚠️ Warnings
          </p>

          {intelligence.warnings.map((warning, index) => (
            <p
              key={index}
              className="text-xs text-gray-400"
            >
              • {warning}
            </p>
          ))}

        </div>
      )}

      {intelligence.suggestions.length > 0 && (
        <div className="mt-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3">

          <p className="mb-2 text-sm font-bold text-cyan-400">
            💡 Suggestions
          </p>

          {intelligence.suggestions.map(
            (suggestion, index) => (
              <p
                key={index}
                className="text-xs text-gray-400"
              >
                • {suggestion}
              </p>
            )
          )}

        </div>
      )}

      {recommendations.length > 0 && (
  <div className="mt-4 rounded-xl border border-purple-500/20 bg-purple-500/5 p-3">

    <div className="mb-3 flex items-center justify-between">

      <p className="text-sm font-bold text-purple-400">
        🧠 Tactical Recommendations
      </p>

      <span className="text-[10px] uppercase tracking-wider text-gray-500">
        Top {recommendations.length}
      </span>

    </div>

    <div className="space-y-2">

      {recommendations.map(
        (recommendation, index) => (
          <div
            key={`${recommendation.player.id}-${recommendation.position}`}
            className="rounded-xl bg-white/5 p-3"
          >

            <div className="flex items-center justify-between gap-3">

              <div className="min-w-0">

                <div className="flex items-center gap-2">

                  <p className="truncate text-sm font-bold text-white">
                    {index + 1}. {recommendation.player.name}
                  </p>

                  {recommendation.isReplacement && (
                    <span className="shrink-0 rounded-full bg-orange-500/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-orange-400">
                      Upgrade
                    </span>
                  )}

                </div>

                <p className="mt-0.5 text-[11px] text-gray-500">
                  → {recommendation.position}
                </p>

                {recommendation.isReplacement &&
                  recommendation.currentPlayer && (
                    <p className="mt-1 text-[10px] text-gray-600">
                      Replacing {recommendation.currentPlayer.name}
                    </p>
                  )}

              </div>

              <div className="shrink-0 text-right">

                <p className="text-sm font-black text-purple-400">
                  +{recommendation.scoreImprovement}
                </p>

                <p className="text-[9px] text-gray-600">
                  improvement
                </p>

              </div>

            </div>

            <p className="mt-2 text-[11px] leading-relaxed text-gray-400">
              {recommendation.reason}
            </p>

            <button
              type="button"
              onClick={() =>
                onAssignRecommendation(
                  recommendation.position,
                  recommendation.player
                )
              }
              className="
                mt-3
                w-full
                rounded-xl
                border
                border-purple-400/30
                bg-purple-500/10
                px-3
                py-2
                text-xs
                font-bold
                text-purple-300
                transition
                hover:scale-[1.02]
                hover:bg-purple-500/20
                hover:text-white
              "
            >
              {recommendation.isReplacement
                ? "⚡ REPLACE PLAYER"
                : "＋ ADD TO XI"}
            </button>

          </div>
        )
      )}

    </div>

  </div>
)}

    </div>
  );
}