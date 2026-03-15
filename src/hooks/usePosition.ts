"use client";

import { useReadContract } from "wagmi";
import { useAccount } from "wagmi";
import { CONTRACTS } from "@/config/contracts";
import { positionEngineAbi } from "@/lib/abi/PositionEngine";

export function usePosition(isLong: boolean) {
  const { address } = useAccount();

  return useReadContract({
    address: CONTRACTS.positionEngine,
    abi: positionEngineAbi,
    functionName: "getPosition",
    args: address ? [address, isLong] : undefined,
    query: {
      refetchInterval: 30000,
      enabled: !!address,
    },
  });
}

export function useHasPosition(isLong: boolean) {
  const position = usePosition(isLong);
  const hasPosition = position.data && position.data.size > 0n;
  return { hasPosition, isLoading: position.isLoading };
}
