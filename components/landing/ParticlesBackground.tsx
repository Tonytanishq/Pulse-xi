"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type Particle = {
  size: number;
  left: number;
  top: number;
  duration: number;
};

export default function ParticlesBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const data = Array.from({ length: 25 }, () => ({
      size: Math.random() * 6 + 2,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 5 + 4,
    }));

    setParticles(data);
  }, []);

  return (
    <>
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-cyan-400/50"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.left}%`,
            top: `${particle.top}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            opacity: [0.2, 1, 0.2],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
          }}
        />
      ))}
    </>
  );
}