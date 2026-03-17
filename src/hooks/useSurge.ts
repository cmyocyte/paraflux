"use client";

import { useReadContract, useAccount } from "wagmi";
import { CONTRACTS } from "@/config/contracts";
import { surgeVaultAbi } from "@/lib/abi/SurgeVault";

export function useSurgeTotalAssets() {
  return useReadContract({
    address: CONTRACTS.surgeVault,
    abi: surgeVaultAbi,
    functionName: "totalAssets",
    query: { refetchInterval: 120_000 },
  });
}

export function useSurgeTotalSupply() {
  return useReadContract({
    address: CONTRACTS.surgeVault,
    abi: surgeVaultAbi,
    functionName: "totalSupply",
    query: { refetchInterval: 120_000 },
  });
}

export function useSurgeShares() {
  const { address } = useAccount();
  return useReadContract({
    address: CONTRACTS.surgeVault,
    abi: surgeVaultAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { refetchInterval: 120_000, enabled: !!address },
  });
}

export function useSurgeShareValue(shares?: bigint) {
  return useReadContract({
    address: CONTRACTS.surgeVault,
    abi: surgeVaultAbi,
    functionName: "convertToAssets",
    args: shares !== undefined ? [shares] : undefined,
    query: { enabled: shares !== undefined && shares > 0n },
  });
}

export function useSurgePreviewShares(assets?: bigint) {
  return useReadContract({
    address: CONTRACTS.surgeVault,
    abi: surgeVaultAbi,
    functionName: "convertToShares",
    args: assets !== undefined ? [assets] : undefined,
    query: { enabled: assets !== undefined && assets > 0n },
  });
}

export function useSurgeLastDeposit() {
  const { address } = useAccount();
  return useReadContract({
    address: CONTRACTS.surgeVault,
    abi: surgeVaultAbi,
    functionName: "lastDepositTime",
    args: address ? [address] : undefined,
    query: { refetchInterval: 120_000, enabled: !!address },
  });
}

export function useSurgeAnchorAllocation() {
  return useReadContract({
    address: CONTRACTS.surgeVault,
    abi: surgeVaultAbi,
    functionName: "getAnchorAllocation",
    query: { refetchInterval: 120_000 },
  });
}

export function useSurgeLongAllocation() {
  return useReadContract({
    address: CONTRACTS.surgeVault,
    abi: surgeVaultAbi,
    functionName: "getLongAllocation",
    query: { refetchInterval: 120_000 },
  });
}

export function useSurgeRebalance() {
  return useReadContract({
    address: CONTRACTS.surgeVault,
    abi: surgeVaultAbi,
    functionName: "isRebalanceNeeded",
    query: { refetchInterval: 120_000 },
  });
}
