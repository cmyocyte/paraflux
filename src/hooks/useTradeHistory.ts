"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { decodeEventLog } from "viem";
import { routerAbi } from "@/lib/abi/PowerPerpRouter";
import { liquidationEngineAbi } from "@/lib/abi/LiquidationEngine";
import { CONTRACTS } from "@/config/contracts";
import { subgraphClient } from "@/config/subgraph";
import { gql } from "graphql-request";

export type TradeEvent = {
  type:
    | "open-long"
    | "open-short"
    | "close-long"
    | "close-short"
    | "liquidated-long"
    | "liquidated-short";
  size?: string; // stringified bigint for JSON serialization
  collateral?: string;
  entryIndex?: string;
  netPnL?: string;
  payout?: string;
  badDebt?: string;
  txHash: string;
  timestamp: number;
};

const STORAGE_KEY = "paraflux_trade_history";

/** Minimum interval between liquidation polls (ms) */
const POLL_INTERVAL = 60_000;

/** Subgraph query for user's liquidation events */
const USER_LIQUIDATIONS_QUERY = gql`
  query UserLiquidations($trader: String!) {
    liquidations(
      where: { trader: $trader }
      orderBy: timestamp
      orderDirection: desc
      first: 50
    ) {
      trader
      isLong
      size
      collateral
      reward
      badDebt
      timestamp
      txHash
    }
  }
`;

function loadTrades(address: string): TradeEvent[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_${address.toLowerCase()}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTrades(address: string, trades: TradeEvent[]) {
  try {
    const trimmed = trades.slice(0, 50);
    localStorage.setItem(
      `${STORAGE_KEY}_${address.toLowerCase()}`,
      JSON.stringify(trimmed)
    );
  } catch {
    // localStorage full or unavailable
  }
}

export function useTradeHistory() {
  const { address } = useAccount();
  const client = usePublicClient();
  const [trades, setTrades] = useState<TradeEvent[]>([]);
  const pollingRef = useRef(false);

  // Load from localStorage on mount / address change
  useEffect(() => {
    if (!address) {
      setTrades([]);
      return;
    }
    setTrades(loadTrades(address));
  }, [address]);

  // Poll for user's liquidation events via subgraph (zero RPC calls)
  useEffect(() => {
    if (!address) return;

    let cancelled = false;

    async function pollLiquidations() {
      if (pollingRef.current || cancelled) return;
      pollingRef.current = true;

      try {
        const result = await subgraphClient.request<{
          liquidations: Array<{
            isLong: boolean;
            size: string;
            badDebt: string;
            timestamp: string;
            txHash: string;
          }>;
        }>(USER_LIQUIDATIONS_QUERY, {
          trader: address!.toLowerCase(),
        });

        if (cancelled || !result.liquidations.length) {
          pollingRef.current = false;
          return;
        }

        const liquidationEvents: TradeEvent[] = result.liquidations.map(
          (liq) => ({
            type: (liq.isLong ? "liquidated-long" : "liquidated-short") as TradeEvent["type"],
            size: liq.size,
            badDebt: liq.badDebt,
            txHash: liq.txHash,
            timestamp: Number(liq.timestamp) * 1000,
          })
        );

        if (!cancelled) {
          setTrades((prev) => {
            const existingHashes = new Set(prev.map((t) => t.txHash));
            const newOnes = liquidationEvents.filter(
              (e) => !existingHashes.has(e.txHash)
            );
            if (newOnes.length === 0) return prev;

            const updated = [...newOnes, ...prev].sort(
              (a, b) => b.timestamp - a.timestamp
            );
            saveTrades(address!, updated);
            return updated;
          });
        }
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.error("[trade-history] subgraph liquidation fetch error:", err);
        }
      } finally {
        pollingRef.current = false;
      }
    }

    pollLiquidations();
    const interval = setInterval(pollLiquidations, POLL_INTERVAL);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [address]);

  // Record a trade from a confirmed transaction hash
  const recordTrade = useCallback(
    async (txHash: `0x${string}`) => {
      if (!address || !client) return;

      try {
        const receipt = await client.getTransactionReceipt({ hash: txHash });
        const newEvents: TradeEvent[] = [];

        for (const log of receipt.logs) {
          // Check Router events
          if (log.address.toLowerCase() === CONTRACTS.router.toLowerCase()) {
            try {
              const decoded = decodeEventLog({
                abi: routerAbi,
                data: log.data,
                topics: log.topics,
              });

              if (decoded.eventName === "LongOpened") {
                const args = decoded.args as {
                  size: bigint;
                  collateral: bigint;
                  entryIndex: bigint;
                };
                newEvents.push({
                  type: "open-long",
                  size: args.size.toString(),
                  collateral: args.collateral.toString(),
                  entryIndex: args.entryIndex.toString(),
                  txHash,
                  timestamp: Date.now(),
                });
              } else if (decoded.eventName === "ShortOpened") {
                const args = decoded.args as {
                  size: bigint;
                  collateral: bigint;
                  entryIndex: bigint;
                };
                newEvents.push({
                  type: "open-short",
                  size: args.size.toString(),
                  collateral: args.collateral.toString(),
                  entryIndex: args.entryIndex.toString(),
                  txHash,
                  timestamp: Date.now(),
                });
              } else if (decoded.eventName === "PositionClosed") {
                const args = decoded.args as {
                  isLong: boolean;
                  netPnL: bigint;
                  payout: bigint;
                };
                newEvents.push({
                  type: args.isLong ? "close-long" : "close-short",
                  netPnL: args.netPnL.toString(),
                  payout: args.payout.toString(),
                  txHash,
                  timestamp: Date.now(),
                });
              }
            } catch {
              // Not one of our events, skip
            }
          }

          // Check LiquidationEngine events
          if (
            CONTRACTS.liquidationEngine !== "0x0000000000000000000000000000000000000000" &&
            log.address.toLowerCase() ===
              CONTRACTS.liquidationEngine.toLowerCase()
          ) {
            try {
              const decoded = decodeEventLog({
                abi: liquidationEngineAbi,
                data: log.data,
                topics: log.topics,
              });

              if (decoded.eventName === "PositionLiquidated") {
                const args = decoded.args as {
                  isLong: boolean;
                  size: bigint;
                  indexAtLiquidation: bigint;
                  badDebt: bigint;
                };
                newEvents.push({
                  type: args.isLong
                    ? "liquidated-long"
                    : "liquidated-short",
                  size: args.size.toString(),
                  entryIndex: args.indexAtLiquidation.toString(),
                  badDebt: args.badDebt.toString(),
                  txHash,
                  timestamp: Date.now(),
                });
              }
            } catch {
              // Not a liquidation event, skip
            }
          }
        }

        if (newEvents.length > 0) {
          setTrades((prev) => {
            const updated = [...newEvents, ...prev];
            saveTrades(address, updated);
            return updated;
          });
        }
      } catch (err) {
        if (process.env.NODE_ENV === "development") {
          console.error("Failed to record trade:", err);
        }
      }
    },
    [address, client]
  );

  return { trades, recordTrade };
}
