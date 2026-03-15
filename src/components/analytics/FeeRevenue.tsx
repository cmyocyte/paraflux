"use client";

import { useAnalyticsData } from "@/hooks/useAnalyticsData";

export function FeeRevenue() {
  const { protocol } = useAnalyticsData();

  const totalFeesUsd = protocol ? parseFloat(protocol.totalFees) : undefined;
  const protocolFees = protocol
    ? parseFloat(protocol.totalProtocolFees)
    : undefined;
  const insuranceFees = protocol
    ? parseFloat(protocol.totalInsuranceFees)
    : undefined;
  // LP fees = total - protocol - insurance
  const lpFees =
    totalFeesUsd !== undefined &&
    protocolFees !== undefined &&
    insuranceFees !== undefined
      ? totalFeesUsd - protocolFees - insuranceFees
      : undefined;

  return (
    <div className="rounded-lg border border-[#21262d] bg-[#0d1117] p-4">
      <h3 className="mb-3 text-sm font-medium text-zinc-400">Fee Revenue</h3>

      {/* Total */}
      <p className="text-2xl font-semibold text-white">
        {totalFeesUsd !== undefined
          ? `$${totalFeesUsd.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
          : "---"}
      </p>
      <p className="mb-4 text-xs text-zinc-500">Cumulative fees collected</p>

      {/* Split bar */}
      {totalFeesUsd !== undefined && totalFeesUsd > 0 && (
        <>
          <div className="mb-2 flex h-4 overflow-hidden rounded">
            <div
              className="bg-[#22c55e]/80"
              style={{ width: "75%" }}
              title="LP"
            />
            <div
              className="bg-[#3b82f6]/80"
              style={{ width: "20%" }}
              title="Protocol"
            />
            <div
              className="bg-[#f59e0b]/80"
              style={{ width: "5%" }}
              title="Insurance"
            />
          </div>

          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-[#22c55e]" />
              <span className="text-zinc-400">LP</span>
              <span className="text-white">
                ${lpFees?.toLocaleString("en-US", { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-[#3b82f6]" />
              <span className="text-zinc-400">Protocol</span>
              <span className="text-white">
                $
                {protocolFees?.toLocaleString("en-US", {
                  maximumFractionDigits: 0,
                })}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-[#f59e0b]" />
              <span className="text-zinc-400">Insurance</span>
              <span className="text-white">
                $
                {insuranceFees?.toLocaleString("en-US", {
                  maximumFractionDigits: 0,
                })}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
