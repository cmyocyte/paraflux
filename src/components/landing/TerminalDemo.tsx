"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const LINES = [
  { prompt: true, text: "open long 1,000 USDC @ 3x leverage", delay: 0 },
  { prompt: false, text: "Oracle price: $24.31", delay: 800 },
  { prompt: false, text: "Index (S²/100): 5.9097", delay: 1100 },
  { prompt: false, text: "Notional: 3,000 USDC", delay: 1400 },
  { prompt: false, text: "Liq price: $18.20 (-25.1%)", delay: 1700 },
  {
    prompt: false,
    text: "✓ Position opened — tx confirmed",
    delay: 2200,
    accent: true,
  },
];

export function TerminalDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const timeouts: NodeJS.Timeout[] = [];
    LINES.forEach((line, i) => {
      timeouts.push(
        setTimeout(() => setVisibleLines(i + 1), line.delay + 400)
      );
    });

    return () => timeouts.forEach(clearTimeout);
  }, [isInView]);

  return (
    <div ref={ref} className="overflow-hidden rounded-xl border border-[#21262d]">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-[#21262d] bg-[#161b22] px-4 py-2.5">
        <div className="flex gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-[#f85149]/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#d29922]/60" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#3fb950]/60" />
        </div>
        <span className="ml-2 font-mono text-[10px] tracking-wide text-zinc-600">
          superps
        </span>
      </div>

      {/* Terminal body */}
      <div className="bg-[#0b0e11] p-5 font-mono text-sm leading-7">
        {LINES.slice(0, visibleLines).map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {line.prompt ? (
              <span>
                <span className="text-[#22c55e]">$</span>{" "}
                <span className="text-zinc-300">{line.text}</span>
              </span>
            ) : (
              <span className={line.accent ? "text-[#22c55e]" : "text-zinc-500"}>
                {"  "}
                {line.text}
              </span>
            )}
          </motion.div>
        ))}
        {visibleLines < LINES.length && isInView && (
          <motion.span
            className="inline-block h-4 w-2 bg-[#22c55e]/70"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
        )}
        {visibleLines >= LINES.length && (
          <div className="mt-1">
            <span className="text-[#22c55e]">$</span>{" "}
            <motion.span
              className="inline-block h-4 w-2 bg-[#22c55e]/70"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.6, repeat: Infinity }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
