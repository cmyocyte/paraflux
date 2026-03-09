"use client";

import {
  useSurgeTotalAssets,
  useSurgeTotalSupply,
  useSurgeAnchorAllocation,
  useSurgeLongAllocation,
  useSurgeRebalance,
} from "@/hooks/useSurge";
import { usdcToNumber, wadToNumber, formatUsd } from "@/lib/format";
import { clsx } from "clsx";

function Stat({
  label,
  value,
  sub,
  valueClass,
}: {
  label: string;
  value: string;
  sub?: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded border border-[#21262d] bg-[#0f1216] px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">{label}</p>
      <p className={clsx("mt-1 font-mono text-lg font-bold text-[#e1e4e8]", valueClass)}>
        {value}
      </p>
      {sub && (
        <p className="mt-0.5 text-[10px] text-zinc-600">{sub}</p>
      )}
    </div>
  );
}

export function SurgeStats() {
  const { data: totalAssets } = useSurgeTotalAssets();
  const { data: totalSupply } = useSurgeTotalSupply();
  const { data: anchorAllocation } = useSurgeAnchorAllocation();
  const { data: longAllocation } = useSurgeLongAllocation();
  const { data: rebalanceData } = useSurgeRebalance();

  const tvl = totalAssets ? usdcToNumber(totalAssets) : 0;
  const sharePrice =
    totalAssets && totalSupply && totalSupply > 0n
      ? usdcToNumber(totalAssets) / usdcToNumber(totalSupply)
      : 1;

  const [anchorShares, anchorValue] = anchorAllocation ?? [undefined, undefined];
  const anchorValueNum = anchorValue !== undefined ? usdcToNumber(anchorValue) : undefined;
  const anchorPct = tvl > 0 && anchorValueNum !== undefined ? (anchorValueNum / tvl) * 100 : undefined;

  const [, longNotional] = longAllocation ?? [undefined, undefined, undefined];
  const longNotionalNum = longNotional !== undefined ? usdcToNumber(longNotional) : undefined;

  const [needsRebalance, anchorDeviationBps] = rebalanceData ?? [undefined, undefined];
  const deviationPct =
    anchorDeviationBps !== undefined ? Number(anchorDeviationBps) / 100 : undefined;

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
      <Stat label="Total Value Locked" value={totalAssets ? formatUsd(tvl) : "\u2014"} />
      <Stat
        label="Share Price"
        value={totalSupply ? `$${sharePrice.toFixed(4)}` : "\u2014"}
      />
      <Stat
        label="Anchor Allocation"
        value={
          anchorValueNum !== undefined
            ? formatUsd(anchorValueNum)
            : "\u2014"
        }
        sub={anchorPct !== undefined ? `${anchorPct.toFixed(1)}% of vault` : undefined}
      />
      <Stat
        label="Long Position"
        value={
          longNotionalNum !== undefined
            ? formatUsd(longNotionalNum)
            : "\u2014"
        }
        sub="Notional size"
      />
      <Stat
        label="Rebalance"
        value={
          needsRebalance === undefined
            ? "\u2014"
            : needsRebalance
              ? `${deviationPct?.toFixed(1)}% off`
              : "Balanced"
        }
        valueClass={
          needsRebalance === undefined
            ? undefined
            : needsRebalance
              ? "text-[#eab308]"
              : "text-[#22c55e]"
        }
      />
    </div>
  );
}
