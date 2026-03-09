"use client";

import { useReadContract } from "wagmi";
import { CONTRACTS } from "@/config/contracts";
import { lpVaultAbi } from "@/lib/abi/LPVault";
import { positionEngineAbi } from "@/lib/abi/PositionEngine";
import { fundingEngineAbi } from "@/lib/abi/FundingEngine";

export function useAccumulatedFees() {
  return useReadContract({
    address: CONTRACTS.lpVault,
    abi: lpVaultAbi,
    functionName: "accumulatedFees",
    query: { refetchInterval: 30000 },
  });
}

export function useTotalBadDebt() {
  return useReadContract({
    address: CONTRACTS.lpVault,
    abi: lpVaultAbi,
    functionName: "totalBadDebt",
    query: { refetchInterval: 30000 },
  });
}

export function useTotalPositions() {
  return useReadContract({
    address: CONTRACTS.positionEngine,
    abi: positionEngineAbi,
    functionName: "totalPositions",
    query: { refetchInterval: 30000 },
  });
}

export function useTotalCollateralLocked() {
  return useReadContract({
    address: CONTRACTS.lpVault,
    abi: lpVaultAbi,
    functionName: "totalCollateralLocked",
    query: { refetchInterval: 30000 },
  });
}

export function useCumulativeFunding() {
  return useReadContract({
    address: CONTRACTS.fundingEngine,
    abi: fundingEngineAbi,
    functionName: "cumulativeFunding",
    query: { refetchInterval: 15000 },
  });
}
