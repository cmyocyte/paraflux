"use client";

import { useChainId } from "wagmi";
import { useTradeHistoryContext } from "@/context/TradeHistoryContext";
import type { TradeEvent } from "@/hooks/useTradeHistory";
import { formatUsd } from "@/lib/format";
import { getExplorerBase } from "@/lib/explorer";
import { clsx } from "clsx";

function typeLabel(type: TradeEvent["type"]): string {
  switch (type) {
    case "open-long":
      return "Open Long";
    case "open-short":
      return "Open Short";
    case "close-long":
      return "Close Long";
    case "close-short":
      return "Close Short";
    case "liquidated-long":
      return "Liquidated Long";
    case "liquidated-short":
      return "Liquidated Short";
  }
}

function typeColor(type: TradeEvent["type"]): string {
  switch (type) {
    case "open-long":
    case "close-long":
      return "text-[#22c55e]";
    case "open-short":
    case "close-short":
      return "text-red-400";
    case "liquidated-long":
    case "liquidated-short":
      return "text-orange-400";
  }
}

/** Convert a stringified bigint (WAD) to a number */
function wadStr(s: string | undefined): number {
  if (!s) return 0;
  return Number(BigInt(s)) / 1e18;
}

/** Format a timestamp as relative time (e.g. "2m ago", "1h ago") */
function timeAgo(ts: number): string {
  const seconds = Math.floor((Date.now() - ts) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function TradeRow({ trade, explorerBase }: { trade: TradeEvent; explorerBase: string }) {
  const isOpen = trade.type === "open-long" || trade.type === "open-short";
  const isLiquidation =
    trade.type === "liquidated-long" || trade.type === "liquidated-short";
  const pnl = trade.netPnL ? wadStr(trade.netPnL) : 0;
  const badDebt = trade.badDebt ? wadStr(trade.badDebt) : 0;

  return (
    <tr className="border-b border-[#21262d] text-xs">
      <td className="px-2 py-1.5">
        <span className={clsx("font-bold", typeColor(trade.type))}>
          {typeLabel(trade.type)}
        </span>
      </td>
      <td className="px-2 py-1.5 font-mono text-zinc-300">
        {trade.size ? wadStr(trade.size).toFixed(2) : "\u2014"}
      </td>
      <td className="px-2 py-1.5 font-mono text-zinc-300">
        {trade.entryIndex
          ? formatUsd(wadStr(trade.entryIndex))
          : "\u2014"}
      </td>
      <td className="px-2 py-1.5 font-mono text-zinc-300">
        {isLiquidation ? (
          <span className="text-orange-400">
            {badDebt > 0 ? `Bad debt: ${formatUsd(badDebt)}` : "Liquidated"}
          </span>
        ) : !isOpen && trade.netPnL ? (
          <span
            className={clsx(
              pnl > 0 ? "text-[#22c55e]" : pnl < 0 ? "text-red-400" : ""
            )}
          >
            {pnl >= 0 ? "+" : ""}
            {formatUsd(pnl)}
          </span>
        ) : (
          "\u2014"
        )}
      </td>
      <td className="px-2 py-1.5 font-mono text-zinc-500">
        {timeAgo(trade.timestamp)}
      </td>
      <td className="px-2 py-1.5 font-mono text-zinc-500">
        <a
          href={`${explorerBase}/tx/${trade.txHash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-zinc-300 transition-colors"
          title={trade.txHash}
        >
          {trade.txHash.slice(0, 8)}...
        </a>
      </td>
    </tr>
  );
}

export function TradeHistory() {
  const chainId = useChainId();
  const explorerBase = getExplorerBase(chainId);
  const { trades } = useTradeHistoryContext();

  if (trades.length === 0) {
    return (
      <div className="px-3 py-8 text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-zinc-600">
          No trades yet
        </p>
        <p className="mt-1 text-[10px] text-zinc-700">
          Trades will appear here as you open and close positions
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="px-2 py-1">
        <span className="text-[10px] text-zinc-600">
          {trades.length} trade{trades.length !== 1 ? "s" : ""}
        </span>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-[#21262d] text-[10px] font-bold uppercase tracking-wider text-zinc-600">
            <th className="px-2 py-1.5">Type</th>
            <th className="px-2 py-1.5">Size</th>
            <th className="px-2 py-1.5">Index</th>
            <th className="px-2 py-1.5">P&L</th>
            <th className="px-2 py-1.5">Time</th>
            <th className="px-2 py-1.5">Tx</th>
          </tr>
        </thead>
        <tbody>
          {trades.map((trade, i) => (
            <TradeRow key={`${trade.txHash}-${i}`} trade={trade} explorerBase={explorerBase} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
