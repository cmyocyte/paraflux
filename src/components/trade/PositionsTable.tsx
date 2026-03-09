"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { usePosition } from "@/hooks/usePosition";
import { useCurrentIndex } from "@/hooks/useOracle";
import { useEstimatedCumulativeFunding } from "@/hooks/useFunding";
import { useClosePosition } from "@/hooks/useTrade";
import { useTradeHistoryContext } from "@/context/TradeHistoryContext";
import { wadToNumber, formatUsd, formatSpotPrice, numberToUsdc } from "@/lib/format";
import {
  computeLiquidationIndex,
  indexToSpot,
  computeFundingOwed,
  computeHealth,
} from "@/lib/math";
import { PayoffCurve } from "./PayoffCurve";
import { clsx } from "clsx";

function PositionRow({ isLong, isExpanded, onToggle }: { isLong: boolean; isExpanded: boolean; onToggle: () => void }) {
  const { address } = useAccount();
  const { data: position, isError } = usePosition(isLong);
  const { data: currentIndex } = useCurrentIndex();
  const cumFunding = useEstimatedCumulativeFunding();
  const { closePosition, isPending, isConfirming, isSuccess: closeSuccess, hash: closeHash, reset: resetClose } = useClosePosition();
  const { recordTrade } = useTradeHistoryContext();

  useEffect(() => {
    if (closeSuccess && closeHash) {
      recordTrade(closeHash);
    }
  }, [closeSuccess, closeHash, recordTrade]);

  // Reset stale close mutation state when wallet changes
  useEffect(() => {
    resetClose();
  }, [address, resetClose]);

  if (!position || position.size === 0n || isError) return null;

  const size = wadToNumber(position.size);
  const entryIndex = wadToNumber(position.entryIndex);
  const collateral = wadToNumber(position.collateral);
  const currentIdx = currentIndex ? wadToNumber(currentIndex) : 0;

  const pricePnl = isLong
    ? size * (currentIdx - entryIndex)
    : size * (entryIndex - currentIdx);

  const fundingOwed =
    cumFunding && position
      ? computeFundingOwed(
          position.size,
          position.entryFundingAccum,
          cumFunding,
          isLong
        )
      : 0;

  const netPnl = pricePnl - fundingOwed;
  const netPnlPercent = collateral > 0 ? (netPnl / collateral) * 100 : 0;

  const liqIndex = computeLiquidationIndex(
    size,
    entryIndex,
    collateral,
    fundingOwed,
    isLong
  );
  const liqSpot = indexToSpot(liqIndex);

  const health = computeHealth(collateral, pricePnl, fundingOwed, size, currentIdx);

  const handleClose = () => {
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 300);
    // Slippage protection: expect at least 99.5% of estimated payout
    const expectedPayout = Math.max(0, collateral + netPnl);
    const minPayout = expectedPayout > 0 ? numberToUsdc(expectedPayout * 0.995) : 0n;
    closePosition(isLong, minPayout, deadline);
  };

  return (
    <>
    <tr
      className="cursor-pointer border-b border-[#21262d]/50 last:border-b-0 hover:bg-[#161b22]/50 transition-colors"
      onClick={onToggle}
    >
      <td className="px-3 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className={clsx("text-[9px] text-zinc-600 transition-transform", isExpanded && "rotate-90")}>
            ▸
          </span>
          <span
            className={clsx(
              "inline-block rounded px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider",
              isLong
                ? "bg-[#22c55e]/10 text-[#22c55e]"
                : "bg-red-900/50 text-red-400"
            )}
          >
            {isLong ? "LONG" : "SHORT"}
          </span>
          <span className="font-mono text-[10px] text-zinc-500">
            {collateral > 0 ? `${((size * entryIndex) / collateral).toFixed(1)}x` : "--"}
          </span>
        </div>
      </td>
      <td className="px-3 py-2.5 font-mono text-[#e1e4e8]">
        {size.toFixed(4)}
      </td>
      <td className="px-3 py-2.5 font-mono text-[#e1e4e8]">
        {formatUsd(size * currentIdx)}
      </td>
      <td className="px-3 py-2.5 font-mono text-[#e1e4e8]">
        {formatUsd(entryIndex)}
      </td>
      <td className="px-3 py-2.5 font-mono text-[#e1e4e8]">
        {formatUsd(currentIdx)}
      </td>
      <td className="px-3 py-2.5 font-mono text-orange-400">
        {formatSpotPrice(liqSpot)}
      </td>
      <td
        className={clsx(
          "px-3 py-2.5 font-mono",
          fundingOwed >= 0 ? "text-red-400" : "text-[#22c55e]"
        )}
      >
        {fundingOwed >= 0 ? "-" : "+"}
        {formatUsd(Math.abs(fundingOwed))}
      </td>
      <td
        className={clsx(
          "px-3 py-2.5 font-mono",
          netPnl >= 0 ? "text-[#22c55e]" : "text-red-400"
        )}
      >
        {formatUsd(netPnl)}{" "}
        <span className="text-zinc-500">
          ({netPnlPercent >= 0 ? "+" : ""}
          {netPnlPercent.toFixed(1)}%)
        </span>
      </td>
      <td className="px-3 py-2.5">
        <div className="flex items-center gap-2">
          <div className="h-1 w-12 rounded-full bg-[#21262d]">
            <div
              className={clsx(
                "h-1 rounded-full",
                health.marginRatio > 2
                  ? "bg-[#22c55e]"
                  : health.marginRatio > 1.3
                    ? "bg-yellow-400"
                    : "bg-red-500"
              )}
              style={{
                width: `${Math.min(100, Math.max(0, (health.marginRatio / 3) * 100))}%`,
              }}
            />
          </div>
          <span
            className={clsx(
              "font-mono text-[10px]",
              health.marginRatio > 2
                ? "text-[#22c55e]"
                : health.marginRatio > 1.3
                  ? "text-yellow-400"
                  : "text-red-400"
            )}
          >
            {health.marginRatio === Infinity
              ? "--"
              : `${(health.marginRatio * 100).toFixed(0)}%`}
          </span>
        </div>
      </td>
      <td className="px-3 py-2.5">
        <button
          onClick={(e) => { e.stopPropagation(); handleClose(); }}
          disabled={isPending || isConfirming}
          className="text-[10px] font-bold uppercase tracking-wider text-red-400 hover:text-red-300 disabled:opacity-50"
        >
          {isPending || isConfirming ? "..." : "Close"}
        </button>
      </td>
    </tr>
    {isExpanded && (
      <tr className="border-b border-[#21262d]/50">
        <td colSpan={10} className="bg-[#0d1014] px-3 py-3">
          <PayoffCurve
            size={size}
            isLong={isLong}
            entryIndex={entryIndex}
            collateral={collateral}
            markSpot={currentIdx > 0 ? indexToSpot(currentIdx) : undefined}
          />
        </td>
      </tr>
    )}
    </>
  );
}

export function PositionsTable({ embedded = false }: { embedded?: boolean }) {
  const { address } = useAccount();
  const { data: longPos, isError: longError } = usePosition(true);
  const { data: shortPos, isError: shortError } = usePosition(false);
  const [expandedSide, setExpandedSide] = useState<"long" | "short" | null>(null);

  // Reset expanded state when wallet changes
  useEffect(() => {
    setExpandedSide(null);
  }, [address]);

  const hasLong = longPos && longPos.size > 0n && !longError;
  const hasShort = shortPos && shortPos.size > 0n && !shortError;
  const hasAny = hasLong || hasShort;

  return (
    <div className={embedded ? "overflow-x-auto" : "overflow-x-auto rounded border border-[#21262d] bg-[#0f1216]"}>
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-[#21262d]">
            <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Side
            </th>
            <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Size
            </th>
            <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Value
            </th>
            <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Entry
            </th>
            <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Mark
            </th>
            <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Liq. Price
            </th>
            <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Funding
            </th>
            <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Net P&L
            </th>
            <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Health
            </th>
            <th className="px-3 py-2" />
          </tr>
        </thead>
        <tbody>
          {hasLong && (
            <PositionRow
              isLong={true}
              isExpanded={expandedSide === "long"}
              onToggle={() => setExpandedSide(expandedSide === "long" ? null : "long")}
            />
          )}
          {hasShort && (
            <PositionRow
              isLong={false}
              isExpanded={expandedSide === "short"}
              onToggle={() => setExpandedSide(expandedSide === "short" ? null : "short")}
            />
          )}
          {!hasAny && (
            <tr>
              <td
                colSpan={10}
                className="px-3 py-6 text-center text-xs font-bold uppercase tracking-wider text-zinc-600"
              >
                No open positions
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
