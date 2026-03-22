"use client";

import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { formatUnits } from "viem";

export function LiquidationFeed() {
  const { liquidations, isLoading, isError } = useAnalyticsData();

  const shortenAddr = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="rounded-lg border border-[#21262d] bg-[#0d1117] p-4">
      <h3 className="mb-3 text-sm font-medium text-zinc-400">
        Recent Liquidations
      </h3>

      {isLoading ? (
        <div className="flex h-32 items-center justify-center text-zinc-600">
          Loading...
        </div>
      ) : isError ? (
        <div className="flex h-32 items-center justify-center text-red-400">
          Failed to load liquidation data
        </div>
      ) : liquidations.length === 0 ? (
        <div className="flex h-32 items-center justify-center text-zinc-600">
          No liquidations found
        </div>
      ) : (
        <div className="max-h-64 overflow-y-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[#21262d] text-zinc-500">
                <th className="pb-2 text-left font-medium">Side</th>
                <th className="pb-2 text-right font-medium">Size</th>
                <th className="pb-2 text-right font-medium">Reward</th>
                <th className="pb-2 text-right font-medium">Bad Debt</th>
                <th className="pb-2 text-left font-medium">Trader</th>
              </tr>
            </thead>
            <tbody>
              {liquidations.map((liq) => {
                const size = Number(formatUnits(BigInt(liq.size), 18));
                const reward = Number(formatUnits(BigInt(liq.reward), 18));
                const badDebt = Number(formatUnits(BigInt(liq.badDebt), 18));

                return (
                  <tr
                    key={liq.txHash}
                    className="border-b border-[#21262d]/50 hover:bg-[#161b22]"
                  >
                    <td className="py-1.5">
                      <span
                        className={
                          liq.isLong ? "text-[#22c55e]" : "text-[#ef4444]"
                        }
                      >
                        {liq.isLong ? "Long" : "Short"}
                      </span>
                    </td>
                    <td className="py-1.5 text-right text-white">
                      {size.toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="py-1.5 text-right text-[#22c55e]">
                      $
                      {reward.toLocaleString("en-US", {
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="py-1.5 text-right">
                      <span
                        className={
                          badDebt > 0 ? "text-[#ef4444]" : "text-zinc-500"
                        }
                      >
                        {badDebt > 0
                          ? `$${badDebt.toLocaleString("en-US", { maximumFractionDigits: 2 })}`
                          : "--"}
                      </span>
                    </td>
                    <td className="py-1.5 text-zinc-400">
                      {shortenAddr(liq.trader)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
