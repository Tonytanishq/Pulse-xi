"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

export default function MouseGlow() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const smoothX = useSpring(x);
  const smoothY = useSpring(y);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      x.set(e.clientX - 180);
      y.set(e.clientY - 180);
    };

    window.addEventListener("mousemove", move);

    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <motion.div
      className="fixed w-96 h-96 rounded-full blur-[120px] bg-cyan-400/20 pointer-events-none"
      style={{
        x: smoothX,
        y: smoothY,
      }}
    />
  );
}