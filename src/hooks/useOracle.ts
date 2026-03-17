"use client";

import { useReadContract } from "wagmi";
import { CONTRACTS } from "@/config/contracts";
import { oracleAbi } from "@/lib/abi/OracleModule";

export function useCurrentIndex() {
  return useReadContract({
    address: CONTRACTS.oracle,
    abi: oracleAbi,
    functionName: "getIndex",
    query: { refetchInterval: 60_000 },
  });
}

export function useHypeSpot() {
  return useReadContract({
    address: CONTRACTS.oracle,
    abi: oracleAbi,
    functionName: "getHypeSpot",
    query: { refetchInterval: 60_000 },
  });
}

export function useEmaIndex() {
  return useReadContract({
    address: CONTRACTS.oracle,
    abi: oracleAbi,
    functionName: "getEmaIndex",
    query: { refetchInterval: 120_000 },
  });
}
