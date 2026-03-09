"use client";

import { useMemo } from "react";
import { useCurrentIndex } from "@/hooks/useOracle";
import { wadToNumber, formatUsd, formatSpotPrice } from "@/lib/format";
import { computeLiquidationIndex, indexToSpot } from "@/lib/math";
import { FeeEstimate } from "./FeeEstimate";
import { clsx } from "clsx";

interface OrderSummaryProps {
  size: number;
  collateral: number;
  isLong: boolean;
  notionalWad: bigint;
}

function Row({
  label,
  value,
  danger,
  warn,
}: {
  label: string;
  value: string;
  danger?: boolean;
  warn?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-2 text-zinc-400">
      <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider">{label}</span>
      <span
        className={clsx(
          "truncate font-mono text-xs",
          danger
            ? "text-orange-400"
            : warn
              ? "text-red-400"
              : "text-[#e1e4e8]"
        )}
      >
        {value}
      </span>
    </div>
  );
}

export function OrderSummary({
  size,
  collateral,
  isLong,
  notionalWad,
}: OrderSummaryProps) {
  const { data: currentIndex } = useCurrentIndex();

  const indexValue = currentIndex ? wadToNumber(currentIndex) : 600;
  const notional = size * indexValue;
  const leverage = collateral > 0 ? notional / collateral : 0;

  // Liquidation: for a new position, fundingOwed = 0
  const liqIndex = useMemo(
    () => computeLiquidationIndex(size, indexValue, collateral, 0, isLong),
    [size, indexValue, collateral, isLong]
  );
  const liqSpot = useMemo(() => indexToSpot(liqIndex), [liqIndex]);

  const hasInputs = size > 0 && collateral > 0;

  return (
    <div className="space-y-1 border-t border-[#21262d] pt-2 text-xs">
      <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-zinc-600">
        Order Preview
      </p>

      <Row label="Entry Index" value={hasInputs ? formatUsd(indexValue) : "\u2014"} />
      <Row
        label="Leverage"
        value={hasInputs ? `${leverage.toFixed(2)}x${leverage > 3 ? " (max 3x)" : ""}` : "\u2014"}
        warn={hasInputs && leverage > 3}
      />
      <Row label="Liq. Index" value={hasInputs ? formatUsd(liqIndex) : "\u2014"} danger={hasInputs} />
      <Row label="Liq. Spot" value={hasInputs ? formatSpotPrice(liqSpot) : "\u2014"} danger={hasInputs} />

      {/* Fee breakdown */}
      {notionalWad > 0n && (
        <div className="mt-2 border-t border-[#21262d] pt-2">
          <FeeEstimate notional={notionalWad} />
        </div>
      )}
    </div>
  );
}
