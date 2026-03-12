"use client";

import { useState } from "react";

const PRESETS = [-20, -10, 0, 10, 20];

export function PayoffCalculator() {
  const [hypeChange, setHypeChange] = useState(10);

  // Power perp index change: (1 + move)^2 - 1
  const indexChange = Math.pow(1 + hypeChange / 100, 2) - 1;

  const rows = [
    { label: "Regular 2x", value: 2 * (hypeChange / 100) * 100 },
    { label: "Paraflux 2x", value: 2 * indexChange * 100 },
    { label: "Paraflux 3x", value: 3 * indexChange * 100 },
  ];

  const maxAbs = Math.max(...rows.map((r) => Math.abs(r.value)), 1);

  // Slider track fill: green from center-right, red from center-left
  const pct = ((hypeChange + 30) / 60) * 100;
  const mid = 50;
  const trackBg =
    hypeChange > 0
      ? `linear-gradient(to right, #21262d ${mid}%, rgba(34,197,94,0.35) ${mid}%, rgba(34,197,94,0.35) ${pct}%, #21262d ${pct}%)`
      : hypeChange < 0
        ? `linear-gradient(to right, #21262d ${pct}%, rgba(239,68,68,0.3) ${pct}%, rgba(239,68,68,0.3) ${mid}%, #21262d ${mid}%)`
        : "#21262d";

  return (
    <div>
      {/* Value display */}
      <div className="text-center">
        <p className="text-sm text-zinc-500">HYPE Price Change</p>
        <p
          className={`mt-1 font-mono text-4xl font-bold tabular-nums ${
            hypeChange > 0
              ? "text-[#22c55e]"
              : hypeChange < 0
                ? "text-red-400"
                : "text-zinc-500"
          }`}
        >
          {hypeChange > 0 ? "+" : ""}
          {hypeChange}%
        </p>
      </div>

      {/* Slider */}
      <div className="mx-auto mt-6 max-w-md">
        <input
          type="range"
          min={-30}
          max={30}
          step={1}
          value={hypeChange}
          onChange={(e) => setHypeChange(Number(e.target.value))}
          className="payoff-slider w-full"
          style={{ background: trackBg }}
        />
        <div className="mt-1.5 flex justify-between font-mono text-[10px] text-zinc-600">
          <span>-30%</span>
          <span>0%</span>
          <span>+30%</span>
        </div>
      </div>

      {/* Presets */}
      <div className="mx-auto mt-5 flex max-w-md justify-center gap-2">
        {PRESETS.map((p) => (
          <button
            key={p}
            onClick={() => setHypeChange(p)}
            className={`rounded-md px-3 py-1.5 font-mono text-xs transition-all ${
              hypeChange === p
                ? "bg-[#22c55e]/15 text-[#22c55e] ring-1 ring-[#22c55e]/30"
                : "bg-[#161b22] text-zinc-500 hover:bg-[#1c2128] hover:text-zinc-300"
            }`}
          >
            {p > 0 ? "+" : ""}
            {p}%
          </button>
        ))}
      </div>

      {/* Bars */}
      <div className="mt-12 space-y-4">
        {rows.map((row) => {
          const positive = row.value >= 0;
          const barWidth =
            hypeChange === 0
              ? 0
              : Math.max((Math.abs(row.value) / maxAbs) * 100, 14);
          const display = row.value.toFixed(1);
          const isParaflux3 = row.label === "Paraflux 3x";
          const isParaflux = row.label.startsWith("Paraflux");

          return (
            <div key={row.label} className="flex items-center gap-4">
              <span className="w-28 shrink-0 text-right font-mono text-xs tracking-wide text-zinc-500">
                {row.label}
              </span>
              <div className="relative h-12 flex-1 overflow-hidden rounded-lg bg-[#161b22]">
                {hypeChange === 0 ? (
                  <div className="flex h-full items-center px-4 font-mono text-sm font-bold text-zinc-600">
                    0.0%
                  </div>
                ) : (
                  <div
                    className={`flex h-full items-center rounded-lg px-4 font-mono text-sm font-bold transition-all duration-300 ease-out ${
                      positive
                        ? isParaflux3
                          ? "bg-gradient-to-r from-[#22c55e]/25 to-[#22c55e]/10 text-[#22c55e] shadow-[inset_0_0_30px_rgba(34,197,94,0.08)]"
                          : isParaflux
                            ? "bg-gradient-to-r from-[#22c55e]/15 to-[#22c55e]/5 text-[#22c55e]/80"
                            : "bg-[#21262d]/80 text-zinc-400"
                        : isParaflux3
                          ? "bg-gradient-to-r from-red-500/20 to-red-500/5 text-red-400 shadow-[inset_0_0_30px_rgba(239,68,68,0.06)]"
                          : isParaflux
                            ? "bg-gradient-to-r from-red-500/12 to-red-500/5 text-red-400/80"
                            : "bg-[#21262d]/80 text-zinc-400"
                    }`}
                    style={{ width: `${barWidth}%` }}
                  >
                    {positive ? "+" : ""}
                    {display}%
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic insight */}
      <p className="mt-8 text-center text-xs leading-5 text-zinc-600">
        {hypeChange > 0 ? (
          <>
            At +{hypeChange}%, Paraflux 2x returns{" "}
            <span className="font-mono text-[#22c55e]">
              +{rows[1].value.toFixed(1)}%
            </span>{" "}
            vs{" "}
            <span className="font-mono text-zinc-400">
              +{rows[0].value.toFixed(1)}%
            </span>{" "}
            on a regular 2x perp — same leverage, {((rows[1].value / rows[0].value - 1) * 100).toFixed(0)}% more profit.
          </>
        ) : hypeChange < 0 ? (
          <>
            Squared payoff amplifies losses too. Paraflux 2x loses{" "}
            <span className="font-mono text-red-400">
              {rows[1].value.toFixed(1)}%
            </span>{" "}
            vs{" "}
            <span className="font-mono text-zinc-400">
              {rows[0].value.toFixed(1)}%
            </span>{" "}
            — {((Math.abs(rows[1].value) / Math.abs(rows[0].value) - 1) * 100).toFixed(0)}% steeper.
          </>
        ) : (
          <>
            Drag the slider to see how power perps compare to regular perps
            across different HYPE price moves.
          </>
        )}
      </p>
    </div>
  );
}
