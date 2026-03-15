"use client";

import { useReadContract, useAccount } from "wagmi";
import { CONTRACTS } from "@/config/contracts";
import { anchorVaultAbi } from "@/lib/abi/AnchorVault";

export function useAnchorTotalAssets() {
  return useReadContract({
    address: CONTRACTS.anchorVault,
    abi: anchorVaultAbi,
    functionName: "totalAssets",
    query: { refetchInterval: 60000 },
  });
}

export function useAnchorTotalSupply() {
  return useReadContract({
    address: CONTRACTS.anchorVault,
    abi: anchorVaultAbi,
    functionName: "totalSupply",
    query: { refetchInterval: 60000 },
  });
}

export function useAnchorShares() {
  const { address } = useAccount();
  return useReadContract({
    address: CONTRACTS.anchorVault,
    abi: anchorVaultAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { refetchInterval: 60000, enabled: !!address },
  });
}

export function useAnchorShareValue(shares?: bigint) {
  return useReadContract({
    address: CONTRACTS.anchorVault,
    abi: anchorVaultAbi,
    functionName: "convertToAssets",
    args: shares !== undefined ? [shares] : undefined,
    query: { enabled: shares !== undefined && shares > 0n },
  });
}

export function useAnchorPreviewShares(assets?: bigint) {
  return useReadContract({
    address: CONTRACTS.anchorVault,
    abi: anchorVaultAbi,
    functionName: "convertToShares",
    args: assets !== undefined ? [assets] : undefined,
    query: { enabled: assets !== undefined && assets > 0n },
  });
}

export function useAnchorLastDeposit() {
  const { address } = useAccount();
  return useReadContract({
    address: CONTRACTS.anchorVault,
    abi: anchorVaultAbi,
    functionName: "lastDepositTime",
    args: address ? [address] : undefined,
    query: { refetchInterval: 60000, enabled: !!address },
  });
}

export function useAnchorDelta() {
  return useReadContract({
    address: CONTRACTS.anchorVault,
    abi: anchorVaultAbi,
    functionName: "getCurrentDelta",
    query: { refetchInterval: 60000 },
  });
}

export function useAnchorRebalance() {
  return useReadContract({
    address: CONTRACTS.anchorVault,
    abi: anchorVaultAbi,
    functionName: "isRebalanceNeeded",
    query: { refetchInterval: 60000 },
  });
}

export function useAnchorTargetSize() {
  return useReadContract({
    address: CONTRACTS.anchorVault,
    abi: anchorVaultAbi,
    functionName: "getTargetSize",
    query: { refetchInterval: 60000 },
  });
}
