"use client";

import { useReadContract } from "wagmi";
import { CONTRACTS } from "@/config/contracts";
import { fundingEngineAbi } from "@/lib/abi/FundingEngine";
import { positionEngineAbi } from "@/lib/abi/PositionEngine";
import { formatUnits } from "viem";
import { useEffect, useState } from "react";

const SECONDS_PER_YEAR = 31_557_600;

interface FundingPoint {
  time: number;
  annualRate: number;
}

export function FundingRateChart() {
  const longOI = useReadContract({
    address: CONTRACTS.positionEngine,
    abi: positionEngineAbi,
    functionName: "longOpenInterest",
    query: { refetchInterval: 15000 },
  });

  const shortOI = useReadContract({
    address: CONTRACTS.positionEngine,
    abi: positionEngineAbi,
    functionName: "shortOpenInterest",
    query: { refetchInterval: 15000 },
  });

  const fundingRate = useReadContract({
    address: CONTRACTS.fundingEngine,
    abi: fundingEngineAbi,
    functionName: "getCurrentFundingRate",
    args:
      longOI.data !== undefined && shortOI.data !== undefined
        ? [longOI.data, shortOI.data]
        : undefined,
    query: {
      refetchInterval: 15000,
      enabled: longOI.data !== undefined && shortOI.data !== undefined,
    },
  });

  const [history, setHistory] = useState<FundingPoint[]>([]);

  const annualRate =
    fundingRate.data !== undefined
      ? Number(formatUnits(fundingRate.data, 18)) * SECONDS_PER_YEAR * 100
      : undefined;

  useEffect(() => {
    if (annualRate === undefined) return;
    setHistory((prev) => [
      ...prev.slice(-60),
      { time: Date.now(), annualRate },
    ]);
  }, [annualRate]);

  const isPositive = annualRate !== undefined && annualRate >= 0;

  return (
    <div className="rounded-lg border border-[#21262d] bg-[#0d1117] p-4">
      <h3 className="mb-3 text-sm font-medium text-zinc-400">Funding Rate</h3>

      {/* Current rate */}
      <div className="mb-4">
        <p
          className={`text-2xl font-semibold ${
            isPositive ? "text-[#22c55e]" : "text-[#ef4444]"
          }`}
        >
          {annualRate !== undefined
            ? `${annualRate >= 0 ? "+" : ""}${annualRate.toFixed(2)}%`
            : "---"}
        </p>
        <p className="text-xs text-zinc-500">
          Annualized{" "}
          {isPositive ? "(Longs pay shorts)" : "(Shorts pay longs)"}
        </p>
      </div>

      {/* Rate history sparkline */}
      {history.length > 2 && (
        <div className="flex h-20 items-center gap-0.5">
          {history.map((point, i) => {
            const maxAbs = Math.max(
              ...history.map((p) => Math.abs(p.annualRate)),
              0.01
            );
            const h = (Math.abs(point.annualRate) / maxAbs) * 50;
            const isPos = point.annualRate >= 0;
            return (
              <div
                key={i}
                className="flex flex-1 flex-col items-stretch"
                style={{ height: "100%" }}
              >
                <div className="flex flex-1 items-end">
                  {isPos && (
                    <div
                      className="w-full rounded-t bg-[#22c55e]/60"
                      style={{ height: `${h}%` }}
                    />
                  )}
                </div>
                <div className="h-px bg-zinc-700" />
                <div className="flex flex-1 items-start">
                  {!isPos && (
                    <div
                      className="w-full rounded-b bg-[#ef4444]/60"
                      style={{ height: `${h}%` }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
