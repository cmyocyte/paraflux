"use client";

import { useReadContract, useAccount } from "wagmi";
import { CONTRACTS } from "@/config/contracts";
import { lpVaultAbi } from "@/lib/abi/LPVault";

export function useTotalAssets() {
  return useReadContract({
    address: CONTRACTS.lpVault,
    abi: lpVaultAbi,
    functionName: "totalAssets",
    query: { refetchInterval: 30000 },
  });
}

export function useTotalSupply() {
  return useReadContract({
    address: CONTRACTS.lpVault,
    abi: lpVaultAbi,
    functionName: "totalSupply",
    query: { refetchInterval: 30000 },
  });
}

export function useUserShares() {
  const { address } = useAccount();
  return useReadContract({
    address: CONTRACTS.lpVault,
    abi: lpVaultAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { refetchInterval: 30000, enabled: !!address },
  });
}

export function useShareValue(shares?: bigint) {
  return useReadContract({
    address: CONTRACTS.lpVault,
    abi: lpVaultAbi,
    functionName: "convertToAssets",
    args: shares !== undefined ? [shares] : undefined,
    query: { enabled: shares !== undefined && shares > 0n },
  });
}

export function usePreviewShares(assets?: bigint) {
  return useReadContract({
    address: CONTRACTS.lpVault,
    abi: lpVaultAbi,
    functionName: "convertToShares",
    args: assets !== undefined ? [assets] : undefined,
    query: { enabled: assets !== undefined && assets > 0n },
  });
}

export function useUtilization() {
  return useReadContract({
    address: CONTRACTS.lpVault,
    abi: lpVaultAbi,
    functionName: "utilization",
    query: { refetchInterval: 30000 },
  });
}

export function useLastDepositTime() {
  const { address } = useAccount();
  return useReadContract({
    address: CONTRACTS.lpVault,
    abi: lpVaultAbi,
    functionName: "lastDepositTime",
    args: address ? [address] : undefined,
    query: { refetchInterval: 30000, enabled: !!address },
  });
}
