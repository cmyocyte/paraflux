"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const W = 320;
const H = 190;
const PAD = 30;

// Generate points for the curves
function buildPath(
  fn: (x: number) => number,
  xMin: number,
  xMax: number,
  steps: number
): string {
  const points: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const x = xMin + ((xMax - xMin) * i) / steps;
    const y = fn(x);
    const px = PAD + ((x - xMin) / (xMax - xMin)) * (W - 2 * PAD);
    const py = H - PAD - ((y - (-0.6)) / (1.4 - (-0.6))) * (H - 2 * PAD);
    points.push(`${px},${py}`);
  }
  return `M${points.join("L")}`;
}

// Linear 2x: y = 2x
const linearPath = buildPath((x) => 2 * x, -0.3, 0.3, 100);
// Power 2x: y = 2 * ((1+x)^2 - 1)
const powerPath = buildPath((x) => 2 * (Math.pow(1 + x, 2) - 1), -0.3, 0.3, 100);

// Zero line y position
const zeroY = H - PAD - ((0 - (-0.6)) / (1.4 - (-0.6))) * (H - 2 * PAD);
// Zero line x position (x=0)
const zeroX = PAD + (0.3 / 0.6) * (W - 2 * PAD);

export function PayoffCurveMini() {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${W} ${H}`}
      className="mx-auto w-full max-w-lg"
      fill="none"
    >
      {/* Axes */}
      <line
        x1={PAD}
        y1={zeroY}
        x2={W - PAD}
        y2={zeroY}
        stroke="#21262d"
        strokeWidth={1}
      />
      <line
        x1={zeroX}
        y1={PAD}
        x2={zeroX}
        y2={H - PAD}
        stroke="#21262d"
        strokeWidth={1}
      />

      {/* Labels */}
      <text x={W - PAD + 4} y={zeroY + 4} className="fill-zinc-600 text-[8px]">
        S
      </text>
      <text x={zeroX - 4} y={PAD - 6} className="fill-zinc-600 text-[8px]" textAnchor="middle">
        P&L
      </text>

      {/* Linear 2x — solid, dim */}
      <motion.path
        d={linearPath}
        stroke="#4b5563"
        strokeWidth={1.5}
        initial={{ pathLength: 0 }}
        animate={isInView ? { pathLength: 1 } : {}}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />

      {/* Power 2x — solid, green */}
      <motion.path
        d={powerPath}
        stroke="#22c55e"
        strokeWidth={2}
        initial={{ pathLength: 0 }}
        animate={isInView ? { pathLength: 1 } : {}}
        transition={{ duration: 1.4, delay: 0.3, ease: "easeOut" }}
      />

      {/* Legend */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 1.5, duration: 0.4 }}
      >
        <line x1={W - PAD - 68} y1={H - 16} x2={W - PAD - 52} y2={H - 16} stroke="#4b5563" strokeWidth={1.5} />
        <text x={W - PAD - 48} y={H - 13} className="fill-zinc-500 text-[8px]">
          Linear 2x
        </text>
        <line x1={W - PAD - 68} y1={H - 4} x2={W - PAD - 52} y2={H - 4} stroke="#22c55e" strokeWidth={2} />
        <text x={W - PAD - 48} y={H - 1} className="fill-[#22c55e] text-[8px]">
          Paraflux 2x
        </text>
      </motion.g>
    </svg>
  );
}
