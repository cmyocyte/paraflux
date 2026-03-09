"use client";

import {
  useAnchorTotalAssets,
  useAnchorTotalSupply,
  useAnchorDelta,
  useAnchorRebalance,
  useAnchorTargetSize,
} from "@/hooks/useAnchorVault";
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

export function AnchorStats() {
  const { data: totalAssets } = useAnchorTotalAssets();
  const { data: totalSupply } = useAnchorTotalSupply();
  const { data: delta } = useAnchorDelta();
  const { data: rebalanceData } = useAnchorRebalance();
  const { data: targetSize } = useAnchorTargetSize();

  const tvl = totalAssets ? usdcToNumber(totalAssets) : 0;
  const sharePrice =
    totalAssets && totalSupply && totalSupply > 0n
      ? usdcToNumber(totalAssets) / usdcToNumber(totalSupply)
      : 1;

  const deltaNum = delta !== undefined ? wadToNumber(delta) : undefined;
  const absDelta = deltaNum !== undefined ? Math.abs(deltaNum) : undefined;

  const [needsRebalance, deviationBps] = rebalanceData ?? [undefined, undefined];
  const deviationPct =
    deviationBps !== undefined ? Number(deviationBps) / 100 : undefined;

  const targetNum = targetSize !== undefined ? wadToNumber(targetSize) : undefined;

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
      <Stat label="Total Value Locked" value={totalAssets ? formatUsd(tvl) : "\u2014"} />
      <Stat
        label="Share Price"
        value={totalSupply ? `$${sharePrice.toFixed(4)}` : "\u2014"}
      />
      <Stat
        label="Delta"
        value={
          deltaNum !== undefined
            ? deltaNum.toFixed(4)
            : "\u2014"
        }
        sub={absDelta !== undefined ? (absDelta < 0.01 ? "Near zero" : "Drifted") : undefined}
        valueClass={
          absDelta !== undefined
            ? absDelta < 0.01
              ? "text-[#22c55e]"
              : "text-[#eab308]"
            : undefined
        }
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
      <Stat
        label="Target Size"
        value={targetNum !== undefined ? targetNum.toFixed(2) : "\u2014"}
        sub="Short position target"
      />
    </div>
  );
}
