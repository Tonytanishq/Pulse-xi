"use client";

import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export default function GlassCard({
  children,
  className = "",
}: GlassCardProps) {
  return (
    <div
      className={`
        rounded-3xl
        border
        border-cyan-500/30
        bg-white/5
        backdrop-blur-xl
        shadow-[0_0_40px_rgba(34,211,238,0.15)]
        transition-all
        duration-300
        hover:border-cyan-400
        hover:shadow-[0_0_50px_rgba(34,211,238,0.35)]
        ${className}
      `}
    >
      {children}
    </div>
  );
}