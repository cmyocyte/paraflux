"use client";

import { useState, useEffect, useCallback } from "react";
import { subgraphClient } from "@/config/subgraph";
import {
  ANALYTICS_DASHBOARD_QUERY,
  type AnalyticsDashboardResult,
  type SubgraphProtocol,
  type SubgraphLiquidation,
  type SubgraphFundingSnapshot,
} from "@/lib/subgraph-queries";

const POLL_INTERVAL_MS = 60_000;

export interface AnalyticsData {
  protocol: SubgraphProtocol | null;
  liquidations: SubgraphLiquidation[];
  fundingSnapshots: SubgraphFundingSnapshot[];
  isLoading: boolean;
  isError: boolean;
}

/**
 * Single subgraph query that fetches all analytics dashboard data:
 * - Protocol singleton (fees, volume, positions, bad debt, etc.)
 * - Recent liquidations (last 50)
 * - Funding snapshots (last 60)
 *
 * Replaces ~8 individual RPC calls + a 50K-block log scan.
 */
export function useAnalyticsData(): AnalyticsData {
  const [protocol, setProtocol] = useState<SubgraphProtocol | null>(null);
  const [liquidations, setLiquidations] = useState<SubgraphLiquidation[]>([]);
  const [fundingSnapshots, setFundingSnapshots] = useState<
    SubgraphFundingSnapshot[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const result =
        await subgraphClient.request<AnalyticsDashboardResult>(
          ANALYTICS_DASHBOARD_QUERY
        );

      if (result.protocols.length > 0) {
        setProtocol(result.protocols[0]);
      }
      setLiquidations(result.liquidations ?? []);
      setFundingSnapshots(result.fundingSnapshots ?? []);
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("[analytics] subgraph fetch error:", err);
      }
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchData]);

  return { protocol, liquidations, fundingSnapshots, isLoading, isError };
}
