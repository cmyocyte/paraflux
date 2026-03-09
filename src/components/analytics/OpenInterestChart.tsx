"use client";

import { useOpenInterest } from "@/hooks/useOpenInterest";
import { formatUnits } from "viem";
import { useEffect, useState } from "react";

interface DataPoint {
  time: number;
  longOI: number;
  shortOI: number;
}

export function OpenInterestChart() {
  const { longOI, shortOI, isLoading } = useOpenInterest();
  const [history, setHistory] = useState<DataPoint[]>([]);

  // Accumulate data points on each refetch
  useEffect(() => {
    if (longOI === undefined || shortOI === undefined) return;
    const point: DataPoint = {
      time: Date.now(),
      longOI: Number(formatUnits(longOI, 18)),
      shortOI: Number(formatUnits(shortOI, 18)),
    };
    setHistory((prev) => [...prev.slice(-60), point]); // Keep last 60 points
  }, [longOI, shortOI]);

  const latestLong =
    longOI !== undefined ? Number(formatUnits(longOI, 18)) : 0;
  const latestShort =
    shortOI !== undefined ? Number(formatUnits(shortOI, 18)) : 0;
  const total = latestLong + latestShort;
  const longPct = total > 0 ? (latestLong / total) * 100 : 50;
  const shortPct = total > 0 ? (latestShort / total) * 100 : 50;

  return (
    <div className="rounded-lg border border-[#21262d] bg-[#0d1117] p-4">
      <h3 className="mb-3 text-sm font-medium text-zinc-400">
        Open Interest
      </h3>

      {isLoading ? (
        <div className="flex h-32 items-center justify-center text-zinc-600">
          Loading...
        </div>
      ) : (
        <>
          {/* OI Bar */}
          <div className="mb-4 flex h-8 overflow-hidden rounded-md">
            <div
              className="flex items-center justify-center bg-[#22c55e]/80 text-xs font-medium text-white transition-all"
              style={{ width: `${longPct}%` }}
            >
              {longPct > 15 && `Long ${longPct.toFixed(0)}%`}
            </div>
            <div
              className="flex items-center justify-center bg-[#ef4444]/80 text-xs font-medium text-white transition-all"
              style={{ width: `${shortPct}%` }}
            >
              {shortPct > 15 && `Short ${shortPct.toFixed(0)}%`}
            </div>
          </div>

          {/* Numbers */}
          <div className="flex justify-between text-sm">
            <div>
              <span className="text-[#22c55e]">Long OI: </span>
              <span className="text-white">
                ${latestLong.toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div>
              <span className="text-[#ef4444]">Short OI: </span>
              <span className="text-white">
                ${latestShort.toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>

          {/* Mini sparkline from history */}
          {history.length > 2 && (
            <div className="mt-3 flex h-16 items-end gap-0.5">
              {history.map((point, i) => {
                const max = Math.max(...history.map((p) => p.longOI + p.shortOI));
                const h = max > 0 ? ((point.longOI + point.shortOI) / max) * 100 : 0;
                return (
                  <div key={i} className="flex flex-1 flex-col justify-end">
                    <div
                      className="w-full rounded-t bg-[#22c55e]/60"
                      style={{
                        height: `${max > 0 ? (point.longOI / max) * 100 : 0}%`,
                      }}
                    />
                    <div
                      className="w-full bg-[#ef4444]/60"
                      style={{
                        height: `${max > 0 ? (point.shortOI / max) * 100 : 0}%`,
                      }}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
