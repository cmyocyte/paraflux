"use client";

import { useState, useEffect, useCallback } from "react";
import { subgraphClient } from "@/config/subgraph";
import {
  PROTOCOL_STATS_QUERY,
  type SubgraphProtocol,
} from "@/lib/subgraph-queries";

const POLL_INTERVAL_MS = 60_000;

/**
 * Fetches protocol volume from the subgraph.
 * lifetimeVolume = Protocol.totalVolume (all-time)
 * volume24h = approximated as lifetime for now (testnet just deployed)
 */
export function useVolume() {
  const [lifetimeVolume, setLifetimeVolume] = useState(0);
  const [volume24h, setVolume24h] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const result = await subgraphClient.request<{
        protocols: SubgraphProtocol[];
      }>(PROTOCOL_STATS_QUERY);

      if (result.protocols.length > 0) {
        const total = parseFloat(result.protocols[0].totalVolume);
        setLifetimeVolume(total);
        setVolume24h(total);
      }
    } catch (err) {
      console.error("[volume] fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { lifetimeVolume, volume24h, isLoading };
}
