"use client";

interface Props {
  text: string;
  color?: "green" | "yellow" | "red" | "cyan";
}

export default function StatusBadge({
  text,
  color = "cyan",
}: Props) {
  const colors = {
    green: "bg-green-500 text-black",
    yellow: "bg-yellow-400 text-black",
    red: "bg-red-500 text-white",
    cyan: "bg-cyan-500 text-black",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${colors[color]}`}
    >
      {text}
    </span>
  );
}