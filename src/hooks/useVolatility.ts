"use client";

import { useReadContract } from "wagmi";
import { CONTRACTS } from "@/config/contracts";
import { impliedVolOracleAbi } from "@/lib/abi/ImpliedVolOracle";

const POLL_INTERVAL = 120_000; // 2min — vol changes only on keeper updates (~5min)

export function useRealizedVol() {
  return useReadContract({
    address: CONTRACTS.volOracle,
    abi: impliedVolOracleAbi,
    functionName: "getRealizedVol",
    query: { refetchInterval: POLL_INTERVAL },
  });
}

export function useSimulatedRealizedVol() {
  return useReadContract({
    address: CONTRACTS.volOracle,
    abi: impliedVolOracleAbi,
    functionName: "simulateRealizedVol",
    query: { refetchInterval: POLL_INTERVAL },
  });
}

export function useImpliedVol() {
  return useReadContract({
    address: CONTRACTS.volOracle,
    abi: impliedVolOracleAbi,
    functionName: "getImpliedVol",
    query: { refetchInterval: POLL_INTERVAL },
  });
}

export function useEffectiveImpliedVol() {
  return useReadContract({
    address: CONTRACTS.volOracle,
    abi: impliedVolOracleAbi,
    functionName: "getEffectiveImpliedVol",
    query: { refetchInterval: POLL_INTERVAL },
  });
}

export function useVolRiskPremium() {
  return useReadContract({
    address: CONTRACTS.volOracle,
    abi: impliedVolOracleAbi,
    functionName: "getVolRiskPremium",
    query: { refetchInterval: POLL_INTERVAL },
  });
}

export function useEwmaVariance() {
  return useReadContract({
    address: CONTRACTS.volOracle,
    abi: impliedVolOracleAbi,
    functionName: "getEwmaVariance",
    query: { refetchInterval: POLL_INTERVAL },
  });
}

export function useObservationCount() {
  return useReadContract({
    address: CONTRACTS.volOracle,
    abi: impliedVolOracleAbi,
    functionName: "observationCount",
    query: { refetchInterval: POLL_INTERVAL },
  });
}

export function useIsVolOracleInitialized() {
  return useReadContract({
    address: CONTRACTS.volOracle,
    abi: impliedVolOracleAbi,
    functionName: "isInitialized",
    query: { refetchInterval: POLL_INTERVAL },
  });
}

export function useLastObservationTimestamp() {
  return useReadContract({
    address: CONTRACTS.volOracle,
    abi: impliedVolOracleAbi,
    functionName: "lastObservationTimestamp",
    query: { refetchInterval: POLL_INTERVAL },
  });
}
