"use client";

import { clsx } from "clsx";

export type Timeframe = "1m" | "5m" | "1h" | "4h" | "1D";

/** Maps our timeframe labels to Hyperliquid candle interval strings. */
export const TIMEFRAME_TO_HL_INTERVAL: Record<Timeframe, string> = {
  "1m": "1m",
  "5m": "5m",
  "1h": "1h",
  "4h": "4h",
  "1D": "1d",
};

interface TimeframeSelectorProps {
  active: Timeframe;
  onChange: (tf: Timeframe) => void;
}

const TIMEFRAMES: Timeframe[] = ["1m", "5m", "1h", "4h", "1D"];

export function TimeframeSelector({ active, onChange }: TimeframeSelectorProps) {
  return (
    <div className="flex gap-1">
      {TIMEFRAMES.map((tf) => (
        <button
          key={tf}
          onClick={() => onChange(tf)}
          className={clsx(
            "rounded px-2 py-0.5 text-xs font-bold uppercase tracking-wider transition-colors",
            active === tf
              ? "bg-[#22c55e]/10 text-[#22c55e]"
              : "text-zinc-600 hover:text-zinc-400"
          )}
        >
          {tf}
        </button>
      ))}
    </div>
  );
}
