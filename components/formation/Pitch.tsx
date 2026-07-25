"use client";

const positions = [
  { id: "ST", top: "8%", left: "50%" },

  { id: "LM", top: "24%", left: "18%" },
  { id: "CAM", top: "24%", left: "50%" },
  { id: "RM", top: "24%", left: "82%" },

  { id: "CDM1", top: "43%", left: "35%" },
  { id: "CDM2", top: "43%", left: "65%" },

  { id: "LB", top: "65%", left: "12%" },
  { id: "CB1", top: "65%", left: "38%" },
  { id: "CB2", top: "65%", left: "62%" },
  { id: "RB", top: "65%", left: "88%" },

  { id: "GK", top: "88%", left: "50%" },
];

export default function Pitch() {
  return (
    <div className="relative mx-auto h-[900px] w-full max-w-4xl overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-b from-green-900 via-green-800 to-green-900">

      {/* Pitch Lines */}
      <div className="absolute inset-6 rounded-3xl border-4 border-white/40" />

      <div className="absolute left-1/2 top-0 h-full w-[3px] -translate-x-1/2 bg-white/40" />

      <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white/40" />

      {positions.map((position) => (
        <div
          key={position.id}
          className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
          style={{
            top: position.top,
            left: position.left,
          }}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-cyan-400 bg-black/40 text-lg font-bold text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.4)]">
            {position.id}
          </div>
        </div>
      ))}
    </div>
  );
}