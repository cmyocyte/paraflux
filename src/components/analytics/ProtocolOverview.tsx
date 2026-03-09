"use client";

import { useTotalAssets } from "@/hooks/useVault";
import { useOpenInterest } from "@/hooks/useOpenInterest";
import {
  useAccumulatedFees,
  useTotalPositions,
} from "@/hooks/useProtocolStats";
import { useInsuranceFund } from "@/hooks/useInsuranceFund";
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

export function ProtocolOverview() {
  const totalAssets = useTotalAssets();
  const { longOI, shortOI } = useOpenInterest();
  const accFees = useAccumulatedFees();
  const totalPos = useTotalPositions();
  const insurance = useInsuranceFund();

  const totalOI =
    longOI !== undefined && shortOI !== undefined
      ? longOI + shortOI
      : undefined;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
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
      <StatCard label="Accumulated Fees" value={formatWad(accFees.data)} />
      <StatCard
        label="Active Positions"
        value={totalPos.data?.toString() ?? "---"}
      />
      <StatCard
        label="Insurance Fund"
        value={formatUsd(insurance.balance)}
        sub={insurance.isFull ? "Target reached" : undefined}
      />
    </div>
  );
}
