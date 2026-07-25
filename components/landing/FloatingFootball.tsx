"use client";

import { motion } from "framer-motion";

const ORBS = [
  { emoji: "⚽", size: 46, left: "8%", top: "24%", dur: 9, delay: 0 },
  { emoji: "⚽", size: 30, left: "84%", top: "30%", dur: 11, delay: 1.2 },
  { emoji: "⚽", size: 22, left: "18%", top: "70%", dur: 8, delay: 0.6 },
  { emoji: "⚽", size: 34, left: "72%", top: "68%", dur: 12, delay: 2 },
  { emoji: "🥅", size: 40, left: "90%", top: "58%", dur: 10, delay: 0.9 },
];

/** Slowly drifting football graphics behind the hero. Decorative only. */
export default function FloatingFootball() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {ORBS.map((o, i) => (
        <motion.span
          key={i}
          className="absolute select-none opacity-[0.14] blur-[0.5px] grayscale"
          style={{ left: o.left, top: o.top, fontSize: o.size }}
          animate={{ y: [0, -28, 0], rotate: [0, 18, 0] }}
          transition={{
            duration: o.dur,
            delay: o.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {o.emoji}
        </motion.span>
      ))}
    </div>
  );
}
