"use client";

import { useState, useEffect, useCallback } from "react";
import { usePublicClient } from "wagmi";
import { CONTRACTS } from "@/config/contracts";
import { subgraphClient } from "@/config/subgraph";
import {
  TRADER_LEADERBOARD_QUERY,
  LP_LEADERBOARD_QUERY,
  type SubgraphTrader,
  type SubgraphLP,
} from "@/lib/subgraph-queries";
import { positionEngineAbi } from "@/lib/abi/PositionEngine";
import { oracleAbi } from "@/lib/abi/OracleModule";
import { lpVaultAbi } from "@/lib/abi/LPVault";

// ─── Constants ─────────────────────────────────────────────────────
const POLL_INTERVAL_MS = 30_000;

// ─── Types (unchanged interface) ────────────────────────────────────
export interface TraderEntry {
  address: string;
  accountValue: number;
  pnl: number;
  roi: number;
  volume: number;
}

export interface LPEntry {
  address: string;
  shares: number;
  valueUsdc: number;
  poolShare: number;
  depositTime: number;
}

// ─── Helpers ───────────────────────────────────────────────────────
function wadToNum(wad: bigint): number {
  return Number(wad) / 1e18;
}

type PositionResult = {
  size: bigint;
  entryIndex: bigint;
  collateral: bigint;
};

function safeReadContract<T>(promise: Promise<T>): Promise<T | null> {
  return promise.catch(() => null);
}

// ─── Trader Leaderboard ────────────────────────────────────────────

export function useTraderLeaderboard() {
  const client = usePublicClient();
  const [data, setData] = useState<TraderEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      // 1. Fetch traders from subgraph (instant)
      const result = await subgraphClient.request<{
        traders: SubgraphTrader[];
      }>(TRADER_LEADERBOARD_QUERY, {
        first: 100,
        orderBy: "totalVolume",
        orderDirection: "desc",
      });

      if (!result.traders.length) {
        setData([]);
        setIsLoading(false);
        return;
      }

      // 2. Enrich with live position data — all calls in parallel
      //    (viem HTTP batch transport merges them into one HTTP request)
      if (client && CONTRACTS.oracle !== "0x") {
        const [currentIndex, ...positionResults] = await Promise.all([
          client.readContract({
            address: CONTRACTS.oracle,
            abi: oracleAbi,
            functionName: "getIndex",
          }) as Promise<bigint>,
          ...result.traders.flatMap((trader) => {
            const addr = trader.id as `0x${string}`;
            return [
              safeReadContract(
                client.readContract({
                  address: CONTRACTS.positionEngine,
                  abi: positionEngineAbi,
                  functionName: "getPosition",
                  args: [addr, true],
                }) as Promise<PositionResult>
              ),
              safeReadContract(
                client.readContract({
                  address: CONTRACTS.positionEngine,
                  abi: positionEngineAbi,
                  functionName: "getPosition",
                  args: [addr, false],
                }) as Promise<PositionResult>
              ),
            ];
          }),
        ]);

        const entries: TraderEntry[] = result.traders.map((trader, i) => {
          const realizedPnl = parseFloat(trader.totalPnl);
          const volume = parseFloat(trader.totalVolume);

          const longPos = positionResults[i * 2] as PositionResult | null;
          const shortPos = positionResults[i * 2 + 1] as PositionResult | null;

          let unrealizedPnL = 0;
          let openCollateral = 0;

          if (longPos && longPos.size > 0n) {
            unrealizedPnL +=
              wadToNum(longPos.size) * wadToNum(currentIndex) -
              wadToNum(longPos.size) * wadToNum(longPos.entryIndex);
            openCollateral += wadToNum(longPos.collateral);
          }

          if (shortPos && shortPos.size > 0n) {
            unrealizedPnL +=
              wadToNum(shortPos.size) * wadToNum(shortPos.entryIndex) -
              wadToNum(shortPos.size) * wadToNum(currentIndex);
            openCollateral += wadToNum(shortPos.collateral);
          }

          const pnl = realizedPnl + unrealizedPnL;
          const accountValue = openCollateral + unrealizedPnL;
          const roi = volume > 0 ? pnl / volume : 0;

          return {
            address: trader.id,
            accountValue: Math.max(accountValue, 0),
            pnl,
            roi,
            volume,
          };
        });

        entries.sort((a, b) => b.pnl - a.pnl);
        setData(entries);
      } else {
        // No RPC client — use subgraph data only
        const entries: TraderEntry[] = result.traders.map((trader) => {
          const realizedPnl = parseFloat(trader.totalPnl);
          const volume = parseFloat(trader.totalVolume);
          return {
            address: trader.id,
            accountValue: 0,
            pnl: realizedPnl,
            roi: volume > 0 ? realizedPnl / volume : 0,
            volume,
          };
        });
        entries.sort((a, b) => b.pnl - a.pnl);
        setData(entries);
      }
    } catch (err) {
      console.error("[leaderboard] trader fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [client]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { data, isLoading, isError: false };
}

// ─── LP Leaderboard ────────────────────────────────────────────────

export function useLPLeaderboard() {
  const client = usePublicClient();
  const [data, setData] = useState<LPEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      // 1. Fetch LPs from subgraph
      const result = await subgraphClient.request<{
        liquidityProviders: SubgraphLP[];
      }>(LP_LEADERBOARD_QUERY, {
        first: 100,
        orderBy: "totalDeposited",
        orderDirection: "desc",
      });

      if (!result.liquidityProviders.length) {
        setData([]);
        setIsLoading(false);
        return;
      }

      if (client && CONTRACTS.lpVault !== "0x") {
        // 2. All RPC calls in parallel (viem batches into one HTTP request)
        const [totalAssets, totalSupply, ...lpResults] = await Promise.all([
          client.readContract({
            address: CONTRACTS.lpVault,
            abi: lpVaultAbi,
            functionName: "totalAssets",
          }) as Promise<bigint>,
          client.readContract({
            address: CONTRACTS.lpVault,
            abi: lpVaultAbi,
            functionName: "totalSupply",
          }) as Promise<bigint>,
          ...result.liquidityProviders.flatMap((lp) => {
            const addr = lp.id as `0x${string}`;
            return [
              safeReadContract(
                client.readContract({
                  address: CONTRACTS.lpVault,
                  abi: lpVaultAbi,
                  functionName: "balanceOf",
                  args: [addr],
                }) as Promise<bigint>
              ),
              safeReadContract(
                client.readContract({
                  address: CONTRACTS.lpVault,
                  abi: lpVaultAbi,
                  functionName: "lastDepositTime",
                  args: [addr],
                }) as Promise<bigint>
              ),
            ];
          }),
        ]);

        const totalSupplyNum = Number(totalSupply);
        const sharePrice =
          totalSupplyNum > 0 ? Number(totalAssets) / totalSupplyNum : 1;

        const entries: LPEntry[] = [];

        for (let i = 0; i < result.liquidityProviders.length; i++) {
          const lp = result.liquidityProviders[i];
          const shares = lpResults[i * 2] as bigint | null;
          const lastDeposit = lpResults[i * 2 + 1] as bigint | null;

          if (shares !== null && shares > 0n) {
            const sharesNum = Number(shares) / 1e6;
            const valueUsdc = sharesNum * sharePrice;
            const poolShare =
              totalSupplyNum > 0 ? Number(shares) / totalSupplyNum : 0;

            entries.push({
              address: lp.id,
              shares: sharesNum,
              valueUsdc,
              poolShare,
              depositTime: lastDeposit !== null ? Number(lastDeposit) : 0,
            });
          } else {
            // Fallback to subgraph data
            const sharesNum = parseFloat(lp.currentShares);
            if (sharesNum <= 0) continue;
            entries.push({
              address: lp.id,
              shares: sharesNum,
              valueUsdc: sharesNum * sharePrice,
              poolShare:
                totalSupplyNum > 0 ? (sharesNum * 1e6) / totalSupplyNum : 0,
              depositTime: 0,
            });
          }
        }

        entries.sort((a, b) => b.poolShare - a.poolShare);
        setData(entries);
      } else {
        // No RPC client — use subgraph data only
        const entries: LPEntry[] = result.liquidityProviders.map((lp) => {
          const sharesNum = parseFloat(lp.currentShares);
          return {
            address: lp.id,
            shares: sharesNum,
            valueUsdc: sharesNum,
            poolShare: 0,
            depositTime: 0,
          };
        });
        entries.sort((a, b) => b.poolShare - a.poolShare);
        setData(entries);
      }
    } catch (err) {
      console.error("[leaderboard] LP fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [client]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { data, isLoading, isError: false };
}
