"use client";

import { useReadContract } from "wagmi";
import { CONTRACTS } from "@/config/contracts";
import { insuranceFundAbi } from "@/lib/abi/InsuranceFund";

export function useInsuranceBalance() {
  return useReadContract({
    address: CONTRACTS.insuranceFund,
    abi: insuranceFundAbi,
    functionName: "balance",
    query: { refetchInterval: 30000 },
  });
}

export function useInsuranceTargetSize() {
  return useReadContract({
    address: CONTRACTS.insuranceFund,
    abi: insuranceFundAbi,
    functionName: "targetSize",
    query: { refetchInterval: 60000 },
  });
}

export function useInsuranceIsFull() {
  return useReadContract({
    address: CONTRACTS.insuranceFund,
    abi: insuranceFundAbi,
    functionName: "isFull",
    query: { refetchInterval: 30000 },
  });
}

export function useInsuranceFundingRatio() {
  return useReadContract({
    address: CONTRACTS.insuranceFund,
    abi: insuranceFundAbi,
    functionName: "fundingRatio",
    query: { refetchInterval: 30000 },
  });
}

export function useInsuranceFund() {
  const balance = useInsuranceBalance();
  const targetSize = useInsuranceTargetSize();
  const isFull = useInsuranceIsFull();
  const fundingRatio = useInsuranceFundingRatio();

  return {
    balance: balance.data,
    targetSize: targetSize.data,
    isFull: isFull.data,
    fundingRatio: fundingRatio.data,
    isLoading:
      balance.isLoading ||
      targetSize.isLoading ||
      isFull.isLoading ||
      fundingRatio.isLoading,
  };
}
