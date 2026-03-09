"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { decodeEventLog, parseAbiItem } from "viem";
import { routerAbi } from "@/lib/abi/PowerPerpRouter";
import { liquidationEngineAbi } from "@/lib/abi/LiquidationEngine";
import { CONTRACTS } from "@/config/contracts";

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

const STORAGE_KEY = "superps_trade_history";
const LAST_SCANNED_KEY = "superps_liq_last_block";

/** Max blocks per getLogs RPC call (HyperEVM limit) */
const RPC_MAX_RANGE = 1000n;

/** How many blocks to look back on first scan (~3 hours at 1 block/sec) */
const INITIAL_LOOKBACK = 10_000n;

/** Delay between paginated RPC calls to avoid rate limiting (ms) */
const CHUNK_DELAY = 2_000;

/** Minimum interval between liquidation polls (ms) */
const POLL_INTERVAL = 60_000;

/** Delay before first poll to avoid competing with wagmi's initial RPC calls (ms) */
const INITIAL_DELAY = 10_000;

/** Retry delay when rate limited (ms) */
const RETRY_DELAY = 5_000;

/** Max retries for rate-limited RPC calls */
const MAX_RETRIES = 3;

function getLastScannedBlock(address: string): bigint {
  try {
    const raw = localStorage.getItem(
      `${LAST_SCANNED_KEY}_${address.toLowerCase()}`
    );
    return raw ? BigInt(raw) : 0n;
  } catch {
    return 0n;
  }
}

function setLastScannedBlock(address: string, block: bigint) {
  try {
    localStorage.setItem(
      `${LAST_SCANNED_KEY}_${address.toLowerCase()}`,
      block.toString()
    );
  } catch {
    // localStorage full or unavailable
  }
}

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

  // Poll for PositionLiquidated events targeting the connected user
  useEffect(() => {
    if (!address || !client || CONTRACTS.liquidationEngine === "0x") return;

    let cancelled = false;

    async function pollLiquidations() {
      if (pollingRef.current || cancelled) return;
      pollingRef.current = true;

      try {
        // Retry getBlockNumber with backoff — wagmi's page-load burst often exhausts the rate limit
        let currentBlock: bigint | null = null;
        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
          try {
            currentBlock = await client!.getBlockNumber();
            break;
          } catch {
            if (attempt < MAX_RETRIES - 1) {
              await new Promise((r) => setTimeout(r, RETRY_DELAY * (attempt + 1)));
            }
          }
        }
        if (currentBlock === null) {
          pollingRef.current = false;
          return; // All retries failed, will try again on next poll interval
        }

        const lastScanned = getLastScannedBlock(address!);

        // On first scan, look back INITIAL_LOOKBACK blocks; after that, only scan new blocks
        const fromBlock =
          lastScanned > 0n
            ? lastScanned + 1n
            : currentBlock > INITIAL_LOOKBACK
              ? currentBlock - INITIAL_LOOKBACK
              : 0n;

        if (fromBlock > currentBlock) {
          pollingRef.current = false;
          return;
        }

        // Paginate getLogs in chunks of RPC_MAX_RANGE with delay to avoid rate limits
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const allLogs: any[] = [];
        let isFirstChunk = true;
        let completedAll = true;
        let lastSuccessfulBlock = fromBlock;
        for (let from = fromBlock; from <= currentBlock && !cancelled; from += RPC_MAX_RANGE) {
          if (!isFirstChunk) {
            await new Promise((r) => setTimeout(r, CHUNK_DELAY));
          }
          isFirstChunk = false;

          const to = from + RPC_MAX_RANGE - 1n > currentBlock
            ? currentBlock
            : from + RPC_MAX_RANGE - 1n;

          try {
            const chunk = await client!.getLogs({
              address: CONTRACTS.liquidationEngine,
              event: parseAbiItem(
                "event PositionLiquidated(address indexed trader, address indexed liquidator, bool indexed isLong, uint256 size, uint256 indexAtLiquidation, uint256 liquidatorReward, uint256 badDebt)"
              ),
              args: { trader: address },
              fromBlock: from,
              toBlock: to,
            });
            allLogs.push(...chunk);
            lastSuccessfulBlock = to;
          } catch {
            // Rate limited — save progress so next poll resumes from here
            completedAll = false;
            break;
          }
        }

        const isFirstScan = lastScanned === 0n;

        // Save cursor: always save on follow-up scans, but on first scan
        // only save if we found events (otherwise rescan on next poll)
        if (completedAll && (!isFirstScan || allLogs.length > 0)) {
          setLastScannedBlock(address!, currentBlock);
        } else if (!completedAll && lastSuccessfulBlock > fromBlock && (!isFirstScan || allLogs.length > 0)) {
          setLastScannedBlock(address!, lastSuccessfulBlock);
        }

        console.log(`[liquidation-poll] scanned blocks ${fromBlock}→${lastSuccessfulBlock} (first=${isFirstScan}, found=${allLogs.length}, complete=${completedAll})`);

        if (cancelled || allLogs.length === 0) {
          pollingRef.current = false;
          return;
        }

        const logs = allLogs;
        const liquidationEvents: TradeEvent[] = [];

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

          // Estimate timestamp from block number (~1 block/sec on HyperEVM)
          // Avoids extra RPC calls that trigger rate limits
          const bn = log.blockNumber;
          const timestamp = bn
            ? Date.now() - Number(currentBlock - bn) * 1000
            : Date.now();

          liquidationEvents.push({
            type: args.isLong ? "liquidated-long" : "liquidated-short",
            size: args.size.toString(),
            entryIndex: args.indexAtLiquidation.toString(),
            badDebt: args.badDebt.toString(),
            txHash: log.transactionHash,
            timestamp,
          });
        }

        if (!cancelled && liquidationEvents.length > 0) {
          setTrades((prev) => {
            // Deduplicate by txHash
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
        console.error("Failed to poll liquidation events:", err);
      } finally {
        pollingRef.current = false;
      }
    }

    // Delay first poll to avoid competing with wagmi's initial RPC burst
    const initialTimeout = setTimeout(pollLiquidations, INITIAL_DELAY);
    const interval = setInterval(pollLiquidations, POLL_INTERVAL);

    return () => {
      cancelled = true;
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [address, client]);

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
            CONTRACTS.liquidationEngine !== "0x" &&
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
        console.error("Failed to record trade:", err);
      }
    },
    [address, client]
  );

  return { trades, recordTrade };
}
