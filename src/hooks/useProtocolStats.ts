"use client";

import { useReadContract } from "wagmi";
import { CONTRACTS } from "@/config/contracts";
import { lpVaultAbi } from "@/lib/abi/LPVault";

export function useTotalCollateralLocked() {
  return useReadContract({
    address: CONTRACTS.lpVault,
    abi: lpVaultAbi,
    functionName: "totalCollateralLocked",
    query: { refetchInterval: 60000 },
  });
}
