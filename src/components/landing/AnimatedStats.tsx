"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, useSpring, useTransform } from "framer-motion";

interface Stat {
  value: string;
  numericValue?: number;
  prefix?: string;
  suffix?: string;
  label: string;
}

const STATS: Stat[] = [
  { value: "$600B+", label: "Daily TradFi Vol Trading" },
  { value: "~$50M", label: "Daily DeFi Options" },
  { value: "0", label: "On-Chain Vol Markets" },
  { value: "S²", label: "The Fix" },
];

function Counter({ target, duration = 1.5 }: { target: number; duration?: number }) {
  const spring = useSpring(0, { duration: duration * 1000, bounce: 0 });
  const display = useTransform(spring, (v) => Math.round(v).toString());
  const [text, setText] = useState("0");

  useEffect(() => {
    spring.set(target);
    const unsub = display.on("change", (v) => setText(v));
    return unsub;
  }, [spring, display, target]);

  return <>{text}</>;
}

export function AnimatedStats() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    if (isInView && !triggered) setTriggered(true);
  }, [isInView, triggered]);

  return (
    <div ref={ref} className="mx-auto grid max-w-5xl grid-cols-2 sm:grid-cols-4">
      {STATS.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 12 }}
          animate={triggered ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          className={`px-6 py-6 text-center ${
            i < STATS.length - 1 ? "border-r border-[#21262d]/50" : ""
          }`}
        >
          <p className="font-mono text-2xl font-bold text-white">
            {triggered && stat.numericValue !== undefined ? (
              <Counter target={stat.numericValue} />
            ) : (
              stat.value
            )}
          </p>
          <p className="mt-1 text-xs tracking-wide text-zinc-500">
            {stat.label}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
