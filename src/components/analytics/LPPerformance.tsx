"use client";

import { useTotalAssets, useTotalSupply, useUtilization } from "@/hooks/useVault";
import { useEstimatedApy } from "@/hooks/useEstimatedApy";
import { formatUnits } from "viem";
import { useEffect, useState } from "react";

interface SharePricePoint {
  time: number;
  price: number;
}

export function LPPerformance() {
  const totalAssets = useTotalAssets();
  const totalSupply = useTotalSupply();
  const { data: utilization } = useUtilization();
  const { apy } = useEstimatedApy();

  const [history, setHistory] = useState<SharePricePoint[]>([]);

  // Share price = totalAssets (6-dec USDC) / totalSupply (6-dec shares)
  const sharePrice =
    totalAssets.data !== undefined &&
    totalSupply.data !== undefined &&
    totalSupply.data > 0n
      ? (Number(formatUnits(totalAssets.data, 6)) /
          Number(formatUnits(totalSupply.data, 6)))
      : undefined;

  const utilPct =
    utilization !== undefined
      ? Number(formatUnits(utilization, 18)) * 100
      : undefined;

  // Accumulate share price history
  useEffect(() => {
    if (sharePrice === undefined) return;
    setHistory((prev) => [
      ...prev.slice(-60),
      { time: Date.now(), price: sharePrice },
    ]);
  }, [sharePrice]);

  const utilColor =
    utilPct !== undefined
      ? utilPct < 50
        ? "#22c55e"
        : utilPct < 80
          ? "#eab308"
          : "#ef4444"
      : "#71717a";

  return (
    <div className="rounded-lg border border-[#21262d] bg-[#0d1117] p-4">
      <h3 className="mb-3 text-sm font-medium text-zinc-400">LP Performance</h3>

      {/* APY */}
      <div className="mb-4">
        <p className="text-2xl font-semibold text-[#22c55e]">
          {apy !== undefined ? `${(apy * 100).toFixed(2)}%` : "---"}
        </p>
        <p className="text-xs text-zinc-500">Estimated APY (funding only)</p>
      </div>

      {/* Share price + sparkline */}
      <div className="mb-4">
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-zinc-500">Share Price</span>
          <span className="font-mono text-sm font-semibold text-white">
            {sharePrice !== undefined
              ? `$${sharePrice.toFixed(4)}`
              : "---"}
          </span>
        </div>

        {history.length > 2 && (
          <div className="mt-2 flex h-12 items-end gap-px">
            {history.map((point, i) => {
              const min = Math.min(...history.map((p) => p.price));
              const max = Math.max(...history.map((p) => p.price));
              const range = max - min || 0.0001;
              const h = ((point.price - min) / range) * 100;
              return (
                <div
                  key={i}
                  className="flex-1 rounded-t bg-[#3b82f6]/60"
                  style={{ height: `${Math.max(h, 2)}%` }}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Utilization */}
      <div>
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-zinc-500">Pool Utilization</span>
          <span className="font-mono text-sm font-semibold text-white">
            {utilPct !== undefined ? `${utilPct.toFixed(1)}%` : "---"}
          </span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#161b22]">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: utilPct !== undefined ? `${Math.min(utilPct, 100)}%` : "0%",
              backgroundColor: utilColor,
            }}
          />
        </div>
      </div>
    </div>
  );
}
