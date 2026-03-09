"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useCurrentFundingRate } from "@/hooks/useFunding";
import { useOpenInterest } from "@/hooks/useOpenInterest";
import { SECONDS_PER_YEAR } from "@/lib/format";

const WIDTH = 80;
const HEIGHT = 24;
const MAX_POINTS = 20;

function generateDemoRates(): number[] {
  const rates: number[] = [];
  let rate = 0.12;
  for (let i = 0; i < MAX_POINTS; i++) {
    rate += (Math.random() - 0.48) * 0.02;
    rate = Math.max(0.01, Math.min(0.25, rate));
    rates.push(rate);
  }
  return rates;
}

function ratesToPath(rates: number[]): string {
  if (rates.length < 2) return "";
  const min = Math.min(...rates);
  const max = Math.max(...rates);
  const range = max - min || 1;

  const points = rates.map((r, i) => {
    const x = (i / (rates.length - 1)) * WIDTH;
    const y = HEIGHT - ((r - min) / range) * (HEIGHT - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  return `M${points.join("L")}`;
}

export function FundingSparkline() {
  const { longOI, shortOI } = useOpenInterest();
  const { data: fundingRate } = useCurrentFundingRate(longOI, shortOI);

  const [rates, setRates] = useState<number[]>([]);
  const demoInitRef = useRef(false);
  const demoIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isLive = fundingRate !== undefined;

  // Demo mode: seed + tick
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
          0.01,
          Math.min(0.25, last + (Math.random() - 0.48) * 0.02)
        );
        return [...prev.slice(-MAX_POINTS + 1), next];
      });
    }, 5000);

    return () => {
      if (demoIntervalRef.current) clearInterval(demoIntervalRef.current);
    };
  }, [isLive]);

  // Live mode: append annualized rate
  useEffect(() => {
    if (fundingRate === undefined) return;
    const annualized =
      Number(fundingRate * SECONDS_PER_YEAR) / 1e18;
    setRates((prev) => [...prev.slice(-MAX_POINTS + 1), annualized]);
  }, [fundingRate]);

  const path = useMemo(() => ratesToPath(rates), [rates]);
  const latestPositive = rates.length > 0 ? rates[rates.length - 1] >= 0 : true;

  if (rates.length < 2) return null;

  return (
    <svg
      width={WIDTH}
      height={HEIGHT}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="flex-shrink-0"
    >
      <path
        d={path}
        fill="none"
        stroke={latestPositive ? "#22c55e" : "#ef4444"}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
