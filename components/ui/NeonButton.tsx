"use client";

import { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

export default function NeonButton({
  children,
  className = "",
  ...props
}: Props) {
  return (
    <button
      {...props}
      className={`
        rounded-xl
        bg-cyan-500
        px-5
        py-3
        font-bold
        text-black
        transition-all
        duration-300
        hover:scale-105
        hover:bg-cyan-400
        hover:shadow-[0_0_30px_rgba(34,211,238,0.6)]
        active:scale-95
        ${className}
      `}
    >
      {children}
    </button>
  );
}