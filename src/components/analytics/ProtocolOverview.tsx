"use client";

import { useTotalAssets } from "@/hooks/useVault";
import { useOpenInterest } from "@/hooks/useOpenInterest";
import { useInsuranceFund } from "@/hooks/useInsuranceFund";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { formatUnits } from "viem";

function formatUsd(value: bigint | undefined, decimals = 6): string {
  if (value === undefined) return "---";
  const num = Number(formatUnits(value, decimals));
  return num.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function formatWad(value: bigint | undefined): string {
  if (value === undefined) return "---";
  const num = Number(formatUnits(value, 18));
  return num.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-lg border border-[#21262d] bg-[#0d1117] p-4">
      <p className="text-xs font-medium text-zinc-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-white">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-zinc-500">{sub}</p>}
    </div>
  );
}

function formatCompactUsd(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

export function ProtocolOverview() {
  const totalAssets = useTotalAssets();
  const { longOI, shortOI } = useOpenInterest();
  const insurance = useInsuranceFund();
  const { protocol, isError: subgraphError } = useAnalyticsData();

  const totalOI =
    longOI !== undefined && shortOI !== undefined
      ? longOI + shortOI
      : undefined;

  const lifetimeVolume = protocol ? parseFloat(protocol.totalVolume) : 0;
  const totalFees = protocol ? parseFloat(protocol.totalFees) : 0;
  const activePositions = protocol ? protocol.activePositions : subgraphError ? "err" : "---";

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      <StatCard label="Total Value Locked" value={formatUsd(totalAssets.data)} />
      <StatCard
        label="Open Interest"
        value={formatWad(totalOI)}
        sub={
          longOI !== undefined && shortOI !== undefined
            ? `L: ${formatWad(longOI)} / S: ${formatWad(shortOI)}`
            : undefined
        }
      />
      <StatCard
        label="Lifetime Volume"
        value={lifetimeVolume > 0 ? formatCompactUsd(lifetimeVolume) : subgraphError ? "err" : "---"}
      />
      <StatCard
        label="Accumulated Fees"
        value={totalFees > 0 ? formatCompactUsd(totalFees) : subgraphError ? "err" : "---"}
      />
      <StatCard
        label="Active Positions"
        value={activePositions}
      />
      <StatCard
        label="Insurance Fund"
        value={formatUsd(insurance.balance)}
        sub={insurance.isFull ? "Target reached" : undefined}
      />
    </div>
  );
}
