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
import { lpVaultAbi } from "@/lib/abi/LPVault";

// ─── Constants ─────────────────────────────────────────────────────
const POLL_INTERVAL_MS = 120_000;

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

// ─── Trader Leaderboard (subgraph only — 0 RPC calls) ─────────────

export function useTraderLeaderboard() {
  const [data, setData] = useState<TraderEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
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

      const entries: TraderEntry[] = result.traders.map((trader) => {
        const pnl = parseFloat(trader.totalPnl);
        const volume = parseFloat(trader.totalVolume);
        return {
          address: trader.id,
          accountValue: 0,
          pnl,
          roi: volume > 0 ? pnl / volume : 0,
          volume,
        };
      });

      entries.sort((a, b) => b.pnl - a.pnl);
      setData(entries);
    } catch (err) {
      console.error("[leaderboard] trader fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { data, isLoading, isError: false };
}

// ─── LP Leaderboard (subgraph + 2 shared RPC calls for share price) ─

export function useLPLeaderboard() {
  const client = usePublicClient();
  const [data, setData] = useState<LPEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
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

      // Only 2 RPC calls for share price (batched into 1 HTTP request)
      let sharePrice = 1;
      let totalSupplyNum = 0;

      if (client) {
        try {
          const [totalAssets, totalSupply] = await Promise.all([
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
          ]);

          totalSupplyNum = Number(totalSupply);
          sharePrice =
            totalSupplyNum > 0 ? Number(totalAssets) / totalSupplyNum : 1;
        } catch {
          // Fall back to 1:1 share price
        }
      }

      const entries: LPEntry[] = [];

      for (const lp of result.liquidityProviders) {
        const sharesNum = parseFloat(lp.currentShares);
        if (sharesNum <= 0) continue;

        // currentShares from subgraph is already in USDC decimals (human-readable)
        const sharesRaw = sharesNum * 1e6;
        const valueUsdc = sharesNum * sharePrice;
        const poolShare =
          totalSupplyNum > 0 ? sharesRaw / totalSupplyNum : 0;

        entries.push({
          address: lp.id,
          shares: sharesNum,
          valueUsdc,
          poolShare,
          depositTime: 0,
        });
      }

      entries.sort((a, b) => b.poolShare - a.poolShare);
      setData(entries);
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
