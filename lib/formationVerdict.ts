import { FormationIntelligence } from "@/lib/formationIntelligence";

export interface FormationVerdict {
  headline: string;
  summary: string;
  priority: "Defence" | "Midfield" | "Attack" | "Balanced";
}

function getWeakestArea(
  intelligence: FormationIntelligence
): "Defence" | "Midfield" | "Attack" | "Balanced" {
  const areas = [
    {
      name: "Defence" as const,
      value:
        intelligence.defence === "Strong"
          ? 90
          : intelligence.defence === "Balanced"
            ? 70
            : 50,
    },
    {
      name: "Midfield" as const,
      value:
        intelligence.midfield === "Strong"
          ? 90
          : intelligence.midfield === "Balanced"
            ? 70
            : 50,
    },
    {
      name: "Attack" as const,
      value:
        intelligence.attack === "Strong"
          ? 90
          : intelligence.attack === "Balanced"
            ? 70
            : 50,
    },
  ];

  const weakest = areas.reduce((current, area) =>
    area.value < current.value ? area : current
  );

  if (weakest.value === 90) {
    return "Balanced";
  }

  return weakest.name;
}

export function buildFormationVerdict(
  intelligence: FormationIntelligence
): FormationVerdict {
  const priority = getWeakestArea(intelligence);

  if (priority === "Balanced") {
    return {
      headline: "Your XI looks tactically balanced.",
      summary:
        "No major weakness is currently standing out. Focus on maintaining fitness, attendance and positional suitability before matchday.",
      priority: "Balanced",
    };
  }

  if (priority === "Defence") {
    return {
      headline: "Defence is the priority.",
      summary:
        "Your defensive unit is currently the weakest area of the XI. Consider improving defensive personnel or using a more defensive setup.",
      priority: "Defence",
    };
  }

  if (priority === "Midfield") {
    return {
      headline: "Midfield needs attention.",
      summary:
        "Your midfield is currently the weakest area of the XI. Consider adding players with stronger positional suitability and overall ratings.",
      priority: "Midfield",
    };
  }

  return {
    headline: "Attack is the priority.",
    summary:
      "Your attacking unit is currently the weakest area of the XI. Consider improving the forward options before matchday.",
    priority: "Attack",
  };
}
