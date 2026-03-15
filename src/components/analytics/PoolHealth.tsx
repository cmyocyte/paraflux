"use client";

import { useInsuranceFund } from "@/hooks/useInsuranceFund";
import { useTotalCollateralLocked } from "@/hooks/useProtocolStats";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { useTotalAssets } from "@/hooks/useVault";
import { formatUnits } from "viem";

export function PoolHealth() {
  const insurance = useInsuranceFund();
  const { protocol } = useAnalyticsData();
  const totalCollateral = useTotalCollateralLocked();
  const totalAssets = useTotalAssets();

  // Insurance fund fill percentage
  const insuranceBalance =
    insurance.balance !== undefined
      ? Number(formatUnits(insurance.balance, 6))
      : undefined;
  const insuranceTarget =
    insurance.targetSize !== undefined
      ? Number(formatUnits(insurance.targetSize, 6))
      : undefined;
  const insurancePct =
    insuranceBalance !== undefined &&
    insuranceTarget !== undefined &&
    insuranceTarget > 0
      ? (insuranceBalance / insuranceTarget) * 100
      : undefined;

  // Bad debt from subgraph
  const badDebtUsd = protocol?.totalBadDebt
    ? parseFloat(protocol.totalBadDebt)
    : undefined;

  // Collateral locked (still RPC — not indexed in subgraph)
  const collateralUsd =
    totalCollateral.data !== undefined
      ? Number(formatUnits(totalCollateral.data, 18))
      : undefined;

  // TVL
  const tvlUsd =
    totalAssets.data !== undefined
      ? Number(formatUnits(totalAssets.data, 6))
      : undefined;

  // Collateral-to-TVL ratio
  const collateralRatio =
    collateralUsd !== undefined && tvlUsd !== undefined && tvlUsd > 0
      ? (collateralUsd / tvlUsd) * 100
      : undefined;

  const insuranceColor =
    insurancePct !== undefined
      ? insurancePct >= 100
        ? "#22c55e"
        : insurancePct >= 50
          ? "#eab308"
          : "#ef4444"
      : "#71717a";

  return (
    <div className="rounded-lg border border-[#21262d] bg-[#0d1117] p-4">
      <h3 className="mb-3 text-sm font-medium text-zinc-400">Pool Health</h3>

      {/* Insurance Fund Fill */}
      <div className="mb-4">
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-zinc-500">Insurance Fund</span>
          <span className="font-mono text-sm font-semibold text-white">
            {insuranceBalance !== undefined
              ? `$${insuranceBalance.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
              : "---"}
          </span>
        </div>
        <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-[#161b22]">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width:
                insurancePct !== undefined
                  ? `${Math.min(insurancePct, 100)}%`
                  : "0%",
              backgroundColor: insuranceColor,
            }}
          />
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-zinc-600">
          <span>
            {insurancePct !== undefined
              ? `${insurancePct.toFixed(1)}% filled`
              : "---"}
          </span>
          <span>
            {insuranceTarget !== undefined
              ? `Target: $${insuranceTarget.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
              : ""}
          </span>
        </div>
        {insurance.isFull && (
          <p className="mt-1 text-[10px] font-medium text-[#22c55e]">
            Target reached — excess fees redirected to LPs
          </p>
        )}
      </div>

      {/* Bad Debt */}
      <div className="mb-4">
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-zinc-500">Cumulative Bad Debt</span>
          <span
            className={`font-mono text-sm font-semibold ${
              badDebtUsd !== undefined && badDebtUsd > 0
                ? "text-[#ef4444]"
                : "text-white"
            }`}
          >
            {badDebtUsd !== undefined
              ? `$${badDebtUsd.toLocaleString("en-US", { maximumFractionDigits: 2 })}`
              : "---"}
          </span>
        </div>
        <p className="mt-0.5 text-[10px] text-zinc-600">
          Losses absorbed by insurance + LP vault
        </p>
      </div>

      {/* Collateral Locked */}
      <div>
        <div className="flex items-baseline justify-between">
          <span className="text-xs text-zinc-500">Collateral Locked</span>
          <span className="font-mono text-sm font-semibold text-white">
            {collateralUsd !== undefined
              ? `$${collateralUsd.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
              : "---"}
          </span>
        </div>
        {collateralRatio !== undefined && (
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#161b22]">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(collateralRatio, 100)}%`,
                backgroundColor:
                  collateralRatio < 50
                    ? "#22c55e"
                    : collateralRatio < 80
                      ? "#eab308"
                      : "#ef4444",
              }}
            />
          </div>
        )}
        <p className="mt-1 text-[10px] text-zinc-600">
          {collateralRatio !== undefined
            ? `${collateralRatio.toFixed(1)}% of TVL backing positions`
            : "---"}
        </p>
      </div>
    </div>
  );
}
