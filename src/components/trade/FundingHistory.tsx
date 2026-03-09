"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useCurrentFundingRate } from "@/hooks/useFunding";
import { useOpenInterest } from "@/hooks/useOpenInterest";
import { SECONDS_PER_YEAR } from "@/lib/format";

const MAX_POINTS = 60;
const SVG_H = 100;
const PAD = { top: 4, bottom: 16, left: 4, right: 4 };
const PLOT_H = SVG_H - PAD.top - PAD.bottom;

function generateDemoRates(): number[] {
  const rates: number[] = [];
  let rate = 0.12;
  for (let i = 0; i < MAX_POINTS; i++) {
    rate += (Math.random() - 0.48) * 0.02;
    rate = Math.max(-0.05, Math.min(0.3, rate));
    rates.push(rate);
  }
  return rates;
}

export function FundingHistory() {
  const { longOI, shortOI } = useOpenInterest();
  const { data: fundingRate } = useCurrentFundingRate(longOI, shortOI);

  const [rates, setRates] = useState<number[]>([]);
  const demoInitRef = useRef(false);
  const demoIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isLive = !!fundingRate;

  // Demo mode
  useEffect(() => {
    if (isLive) return;
    if (!demoInitRef.current) {
      setRates(generateDemoRates());
      demoInitRef.current = true;
    }

    demoIntervalRef.current = setInterval(() => {
      setRates((prev) => {
        const last = prev[prev.length - 1] ?? 0.12;
        const next = Math.max(
          -0.05,
          Math.min(0.3, last + (Math.random() - 0.48) * 0.02)
        );
        return [...prev.slice(-MAX_POINTS + 1), next];
      });
    }, 5000);

    return () => {
      if (demoIntervalRef.current) clearInterval(demoIntervalRef.current);
    };
  }, [isLive]);

  // Live mode
  useEffect(() => {
    if (!fundingRate) return;
    const annualized = Number(fundingRate * SECONDS_PER_YEAR) / 1e18;
    setRates((prev) => [...prev.slice(-MAX_POINTS + 1), annualized]);
  }, [fundingRate]);

  const currentRate = rates.length > 0 ? rates[rates.length - 1] : null;

  const chart = useMemo(() => {
    if (rates.length < 2) return null;

    const min = Math.min(...rates, 0);
    const max = Math.max(...rates, 0);
    const range = max - min || 1;

    const toY = (r: number) =>
      PAD.top + PLOT_H - ((r - min) / range) * PLOT_H;

    const zeroY = toY(0);

    // Build bar chart
    const barWidth = 100 / rates.length;
    const bars = rates.map((r, i) => {
      const x = (i / rates.length) * 100;
      const y = toY(r);
      const isPositive = r >= 0;
      return {
        x: `${x}%`,
        y: Math.min(y, zeroY),
        width: `${barWidth * 0.8}%`,
        height: Math.abs(y - zeroY),
        color: isPositive ? "#22c55e" : "#ef4444",
        opacity: 0.6,
      };
    });

    return { bars, zeroY, min, max };
  }, [rates]);

  if (!chart) {
    return (
      <div className="px-3 py-8 text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-zinc-600">
          Collecting funding data...
        </p>
      </div>
    );
  }

  return (
    <div className="px-3 py-2">
      {/* Header: current rate + demo badge + legend */}
      <div className="mb-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            Funding Rate
          </span>
          {!isLive && (
            <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[9px] font-bold uppercase text-zinc-500">
              Demo
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="h-1.5 w-1.5 rounded-sm bg-[#22c55e] opacity-60" />
            <span className="text-[9px] text-zinc-600">Longs pay</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-1.5 w-1.5 rounded-sm bg-[#ef4444] opacity-60" />
            <span className="text-[9px] text-zinc-600">Shorts pay</span>
          </div>
          {currentRate !== null && (
            <span className={`text-xs font-mono font-bold ${currentRate >= 0 ? "text-[#22c55e]" : "text-red-400"}`}>
              {currentRate >= 0 ? "+" : ""}{(currentRate * 100).toFixed(2)}%
            </span>
          )}
        </div>
      </div>

      <svg
        viewBox={`0 0 100 ${SVG_H}`}
        className="w-full"
        preserveAspectRatio="none"
        style={{ height: `${SVG_H}px` }}
      >
        {/* Zero line */}
        <line
          x1="0"
          y1={chart.zeroY}
          x2="100%"
          y2={chart.zeroY}
          stroke="#21262d"
          strokeWidth={0.5}
        />

        {/* Rate bars */}
        {chart.bars.map((bar, i) => (
          <rect
            key={i}
            x={bar.x}
            y={bar.y}
            width={bar.width}
            height={Math.max(0.5, bar.height)}
            fill={bar.color}
            opacity={bar.opacity}
            rx={0.3}
          />
        ))}
      </svg>

      {/* Y-axis labels */}
      <div className="mt-1 flex justify-between text-[9px] font-mono text-zinc-600">
        <span>Max {(chart.max * 100).toFixed(1)}%</span>
        <span className="text-zinc-700">0%</span>
        <span>Min {(chart.min * 100).toFixed(1)}%</span>
      </div>
    </div>
  );
}
