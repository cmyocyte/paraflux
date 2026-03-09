"use client";

import { useEffect, useRef, useState } from "react";
import { usePublicClient } from "wagmi";
import { parseAbiItem, formatUnits } from "viem";
import { CONTRACTS } from "@/config/contracts";

interface LiquidationEvent {
  trader: string;
  liquidator: string;
  isLong: boolean;
  size: number;
  index: number;
  reward: number;
  badDebt: number;
  txHash: string;
  blockNumber: bigint;
}

const RPC_MAX_RANGE = 1000n;
const LOOKBACK = 50_000n;
const POLL_INTERVAL = 60_000;

export function LiquidationFeed() {
  const client = usePublicClient();
  const [liquidations, setLiquidations] = useState<LiquidationEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const pollingRef = useRef(false);
  const lastBlockRef = useRef(0n);

  useEffect(() => {
    if (!client || CONTRACTS.liquidationEngine === "0x") {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    async function poll() {
      if (pollingRef.current || cancelled) return;
      pollingRef.current = true;

      try {
        const currentBlock = await client!.getBlockNumber();
        const fromBlock =
          lastBlockRef.current > 0n
            ? lastBlockRef.current + 1n
            : currentBlock > LOOKBACK
              ? currentBlock - LOOKBACK
              : 0n;

        if (fromBlock > currentBlock) {
          pollingRef.current = false;
          return;
        }

        const allLogs: LiquidationEvent[] = [];

        for (
          let from = fromBlock;
          from <= currentBlock && !cancelled;
          from += RPC_MAX_RANGE
        ) {
          const to =
            from + RPC_MAX_RANGE - 1n > currentBlock
              ? currentBlock
              : from + RPC_MAX_RANGE - 1n;

          try {
            const logs = await client!.getLogs({
              address: CONTRACTS.liquidationEngine,
              event: parseAbiItem(
                "event PositionLiquidated(address indexed trader, address indexed liquidator, bool indexed isLong, uint256 size, uint256 indexAtLiquidation, uint256 liquidatorReward, uint256 badDebt)"
              ),
              fromBlock: from,
              toBlock: to,
            });

            for (const log of logs) {
              const args = log.args as {
                trader: `0x${string}`;
                liquidator: `0x${string}`;
                isLong: boolean;
                size: bigint;
                indexAtLiquidation: bigint;
                liquidatorReward: bigint;
                badDebt: bigint;
              };
              allLogs.push({
                trader: args.trader,
                liquidator: args.liquidator,
                isLong: args.isLong,
                size: Number(formatUnits(args.size, 18)),
                index: Number(formatUnits(args.indexAtLiquidation, 18)),
                reward: Number(formatUnits(args.liquidatorReward, 6)),
                badDebt: Number(formatUnits(args.badDebt, 6)),
                txHash: log.transactionHash,
                blockNumber: log.blockNumber,
              });
            }
          } catch {
            break; // Rate limited — try again next poll
          }

          if (from + RPC_MAX_RANGE <= currentBlock) {
            await new Promise((r) => setTimeout(r, 2000));
          }
        }

        lastBlockRef.current = currentBlock;

        if (!cancelled && allLogs.length > 0) {
          setLiquidations((prev) => {
            const existingHashes = new Set(prev.map((l) => l.txHash));
            const newOnes = allLogs.filter(
              (l) => !existingHashes.has(l.txHash)
            );
            return [...newOnes, ...prev].slice(0, 50);
          });
        }
      } catch (err) {
        console.error("Failed to poll liquidations:", err);
      } finally {
        setIsLoading(false);
        pollingRef.current = false;
      }
    }

    const initialTimeout = setTimeout(poll, 3000);
    const interval = setInterval(poll, POLL_INTERVAL);

    return () => {
      cancelled = true;
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [client]);

  const shortenAddr = (addr: string) =>
    `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="rounded-lg border border-[#21262d] bg-[#0d1117] p-4">
      <h3 className="mb-3 text-sm font-medium text-zinc-400">
        Recent Liquidations
      </h3>

      {isLoading ? (
        <div className="flex h-32 items-center justify-center text-zinc-600">
          Scanning...
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
                <th className="pb-2 text-right font-medium">Index</th>
                <th className="pb-2 text-right font-medium">Reward</th>
                <th className="pb-2 text-right font-medium">Bad Debt</th>
                <th className="pb-2 text-left font-medium">Trader</th>
              </tr>
            </thead>
            <tbody>
              {liquidations.map((liq) => (
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
                    {liq.size.toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-1.5 text-right text-zinc-300">
                    $
                    {liq.index.toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-1.5 text-right text-[#22c55e]">
                    $
                    {liq.reward.toLocaleString("en-US", {
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-1.5 text-right">
                    <span
                      className={
                        liq.badDebt > 0 ? "text-[#ef4444]" : "text-zinc-500"
                      }
                    >
                      {liq.badDebt > 0
                        ? `$${liq.badDebt.toLocaleString("en-US", { maximumFractionDigits: 2 })}`
                        : "--"}
                    </span>
                  </td>
                  <td className="py-1.5 text-zinc-400">
                    {shortenAddr(liq.trader)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
