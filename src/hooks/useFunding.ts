"use client";

import { useState, useEffect } from "react";
import { useReadContract } from "wagmi";
import { CONTRACTS } from "@/config/contracts";
import { fundingEngineAbi } from "@/lib/abi/FundingEngine";
import { useOpenInterest } from "@/hooks/useOpenInterest";
import { useCurrentIndex } from "@/hooks/useOracle";
import { WAD } from "@/lib/format";

export function useCurrentFundingRate(longOI?: bigint, shortOI?: bigint) {
  return useReadContract({
    address: CONTRACTS.fundingEngine,
    abi: fundingEngineAbi,
    functionName: "getCurrentFundingRate",
    args: longOI !== undefined && shortOI !== undefined
      ? [longOI, shortOI]
      : undefined,
    query: {
      refetchInterval: 120_000,
      enabled: longOI !== undefined && shortOI !== undefined,
    },
  });
}

export function useCumulativeFunding() {
  return useReadContract({
    address: CONTRACTS.fundingEngine,
    abi: fundingEngineAbi,
    functionName: "cumulativeFunding",
    query: { refetchInterval: 120_000 },
  });
}

export function useBaseVolatility() {
  return useReadContract({
    address: CONTRACTS.fundingEngine,
    abi: fundingEngineAbi,
    functionName: "baseVolatility",
    query: { refetchInterval: 120_000 },
  });
}

export function useLastFundingUpdate() {
  return useReadContract({
    address: CONTRACTS.fundingEngine,
    abi: fundingEngineAbi,
    functionName: "lastFundingUpdate",
    query: { refetchInterval: 120_000 },
  });
}

/**
 * Estimates cumulative funding including unaccrued portion.
 * Adds (fundingRate * elapsedSeconds) to the on-chain value,
 * ticking every second so the UI stays live even when
 * accrueGlobalFunding() hasn't been called recently.
 */
export function useEstimatedCumulativeFunding() {
  const { data: cumFunding } = useCumulativeFunding();
  const { data: lastUpdate } = useLastFundingUpdate();
  const { longOI, shortOI } = useOpenInterest();
  const { data: fundingRate } = useCurrentFundingRate(longOI, shortOI);
  const { data: currentIndex } = useCurrentIndex();
  const [now, setNow] = useState(() => Math.floor(Date.now() / 1000));

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (cumFunding === undefined) return undefined;
  if (lastUpdate === undefined || fundingRate === undefined || currentIndex === undefined) return cumFunding;

  const elapsed = BigInt(Math.max(0, now - Number(lastUpdate)));
  // fundingRate is pure sigma^2/year per-second; accumulator advances by rate * dt * index
  const pendingFunding = (fundingRate * elapsed * currentIndex) / WAD;
  return cumFunding + pendingFunding;
}
