"use client";

import { motion } from "framer-motion";

export default function Background() {
  return (
    <>
      {/* Blue Glow */}
      <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-cyan-500/10 blur-[140px]" />

      {/* Purple Glow */}
      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-blue-700/10 blur-[140px]" />

      {/* Floating Dot 1 */}
      <motion.div
        animate={{ y: [-20, 20, -20] }}
        transition={{ repeat: Infinity, duration: 6 }}
        className="absolute left-20 top-28 h-3 w-3 rounded-full bg-cyan-400"
      />

      {/* Floating Dot 2 */}
      <motion.div
        animate={{ y: [20, -20, 20] }}
        transition={{ repeat: Infinity, duration: 8 }}
        className="absolute bottom-28 right-24 h-4 w-4 rounded-full bg-blue-500"
      />
    </>
  );
}