"use client";

import { FormationRecommendation } from "@/lib/formationRecommendations";

interface Props {
  recommendations: FormationRecommendation[];
}

export default function FormationRecommendationsPanel({
  recommendations,
}: Props) {
  return (
    <div className="rounded-3xl border border-purple-500/20 bg-[#111827]/90 p-6 shadow-xl">

      <h2 className="text-xl font-black text-purple-400">
        🎯 Recommended Players
      </h2>

      <p className="mt-1 text-xs text-gray-500">
        Players who could improve your current lineup
      </p>

      {recommendations.length === 0 ? (
        <div className="mt-5 rounded-xl bg-white/5 p-4 text-center">
          <p className="text-sm text-gray-400">
            No recommendations available.
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {recommendations.map((recommendation) => (
            <div
              key={`${recommendation.player.id}-${recommendation.position}`}
              className="rounded-2xl border border-white/10 bg-white/5 p-4"
            >
              <div className="flex items-center justify-between">

                <div>
                  <p className="font-bold text-white">
                    {recommendation.player.name}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Recommended for {recommendation.position}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-black text-purple-400">
                    {recommendation.scoreImprovement}
                  </p>

                  <p className="text-[10px] text-gray-500">
                    Recommendation Score
                  </p>
                </div>

              </div>

              <p className="mt-3 text-xs text-gray-400">
                {recommendation.reason}
              </p>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
