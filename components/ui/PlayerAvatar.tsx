"use client";

interface Props {
  name: string;
}

export default function PlayerAvatar({ name }: Props) {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-xl font-black text-white shadow-lg">
      {initials}
    </div>
  );
}