import { Player } from "@/lib/players";

export type ValidationType =
  | "primary"
  | "secondary"
  | "invalid";

export function validatePlayerPosition(
  player: Player,
  targetPosition: string
): ValidationType {

  // Remove numbers (CB1 -> CB)
  const target = targetPosition
    .replace(/[0-9]/g, "")
    .toUpperCase();

  // Convert formation winger slots
  const normalizedTarget =
    target === "LW"
      ? "LM"
      : target === "RW"
      ? "RM"
      : target;

  const primary = player.primaryPosition.toUpperCase();

  if (primary === normalizedTarget) {
    return "primary";
  }

  if (
    player.secondaryPositions.some(
      (p: string) =>
        p.toUpperCase() === normalizedTarget
    )
  ) {
    return "secondary";
  }

  return "invalid";
}

export function canPlayPosition(
  player: Player,
  targetPosition: string
) {
  return (
    validatePlayerPosition(player, targetPosition) !==
    "invalid"
  );
}

export function getValidationColor(
  validation: ValidationType
) {
  switch (validation) {
    case "primary":
      return "green";

    case "secondary":
      return "yellow";

    default:
      return "red";
  }
}