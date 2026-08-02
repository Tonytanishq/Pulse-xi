export function getPlayerInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function getFirstName(name: string) {
  return name.split(" ")[0];
}