"use client";

import { useReadContract } from "wagmi";
import { CONTRACTS } from "@/config/contracts";
import { routerAbi } from "@/lib/abi/PowerPerpRouter";
import { lpVaultAbi } from "@/lib/abi/LPVault";
import { estimateFee } from "@/lib/math";
import { wadToNumber, formatUsd } from "@/lib/format";

interface FeeEstimateProps {
  notional: bigint;
}

export function FeeEstimate({ notional }: FeeEstimateProps) {
  const { data: tradingFee } = useReadContract({
    address: CONTRACTS.router,
    abi: routerAbi,
    functionName: "tradingFee",
  });

  const { data: impactCoefficient } = useReadContract({
    address: CONTRACTS.router,
    abi: routerAbi,
    functionName: "impactCoefficient",
  });

  const { data: totalAssets } = useReadContract({
    address: CONTRACTS.lpVault,
    abi: lpVaultAbi,
    functionName: "totalAssets",
  });

  if (!tradingFee || !impactCoefficient || !totalAssets || notional === 0n) {
    return null;
  }

  // totalAssets is 6-decimal USDC — convert to WAD for fee math
  const totalAssetsWad = totalAssets * 10n ** 12n;

  const { baseFee, impactFee, totalFee } = estimateFee(
    notional,
    tradingFee,
    impactCoefficient,
    totalAssetsWad
  );

  return (
    <div className="space-y-0.5">
      <div className="flex items-baseline justify-between gap-2 text-zinc-400">
        <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider">Base Fee</span>
        <span className="font-mono text-xs text-[#e1e4e8]">{formatUsd(wadToNumber(baseFee))}</span>
      </div>
      {impactFee > 0n && (
        <div className="flex items-baseline justify-between gap-2 text-zinc-400">
          <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider">Impact Fee</span>
          <span className="font-mono text-xs text-[#e1e4e8]">{formatUsd(wadToNumber(impactFee))}</span>
        </div>
      )}
      <div className="flex items-baseline justify-between gap-2 border-t border-[#21262d] pt-0.5 text-[#e1e4e8]">
        <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider">Total Fee</span>
        <span className="font-mono text-xs">{formatUsd(wadToNumber(totalFee))}</span>
      </div>
    </div>
  );
}
