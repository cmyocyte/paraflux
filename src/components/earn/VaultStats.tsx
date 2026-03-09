"use client";

import { useTotalAssets, useTotalSupply, useUtilization } from "@/hooks/useVault";
import { useOpenInterest } from "@/hooks/useOpenInterest";
import { useEstimatedApy } from "@/hooks/useEstimatedApy";
import { usdcToNumber, wadToNumber, formatUsd, formatPercent } from "@/lib/format";
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

export function VaultStats() {
  const { data: totalAssets } = useTotalAssets();
  const { data: totalSupply } = useTotalSupply();
  const { data: utilization } = useUtilization();
  const { longOI, shortOI } = useOpenInterest();
  const { apy } = useEstimatedApy();

  const tvl = totalAssets ? usdcToNumber(totalAssets) : 0;
  const sharePrice =
    totalAssets && totalSupply && totalSupply > 0n
      ? usdcToNumber(totalAssets) / usdcToNumber(totalSupply)
      : 1;
  const util = utilization ? wadToNumber(utilization) : 0;

  const netOI =
    longOI && shortOI
      ? wadToNumber(longOI) - wadToNumber(shortOI)
      : 0;

  const exposureDir =
    netOI > 0 ? "Vault net short" : netOI < 0 ? "Vault net long" : "Balanced";

  const apyDisplay =
    apy !== undefined ? `${(apy * 100).toFixed(2)}%` : "\u2014";
  const apyNegative = apy !== undefined && apy < 0;

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
      <Stat label="Total Value Locked" value={totalAssets ? formatUsd(tvl) : "\u2014"} />
      <Stat
        label="Share Price"
        value={totalSupply ? `$${sharePrice.toFixed(4)}` : "\u2014"}
      />
      <Stat
        label="Est. APY"
        value={apyDisplay}
        sub={apyNegative ? "Vault paying traders" : "from funding fees"}
        valueClass={apyNegative ? "text-red-400" : apy !== undefined && apy > 0 ? "text-[#22c55e]" : undefined}
      />
      <Stat
        label="Utilization"
        value={utilization ? formatPercent(util) : "\u2014"}
        sub={utilization ? "of vault backing positions" : undefined}
      />
      <Stat
        label="Net Exposure"
        value={longOI && shortOI ? formatUsd(Math.abs(netOI)) : "\u2014"}
        sub={longOI && shortOI ? exposureDir : undefined}
      />
    </div>
  );
}
