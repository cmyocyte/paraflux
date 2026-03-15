"use client";

import { useReadContract } from "wagmi";
import { CONTRACTS } from "@/config/contracts";
import { positionEngineAbi } from "@/lib/abi/PositionEngine";

export function useTotalLongOI() {
  return useReadContract({
    address: CONTRACTS.positionEngine,
    abi: positionEngineAbi,
    functionName: "longOpenInterest",
    query: { refetchInterval: 60000 },
  });
}

export function useTotalShortOI() {
  return useReadContract({
    address: CONTRACTS.positionEngine,
    abi: positionEngineAbi,
    functionName: "shortOpenInterest",
    query: { refetchInterval: 60000 },
  });
}

export function useOpenInterest() {
  const longOI = useTotalLongOI();
  const shortOI = useTotalShortOI();

  return {
    longOI: longOI.data,
    shortOI: shortOI.data,
    isLoading: longOI.isLoading || shortOI.isLoading,
  };
}
