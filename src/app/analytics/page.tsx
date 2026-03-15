"use client";

import { ProtocolOverview } from "@/components/analytics/ProtocolOverview";
import { OpenInterestChart } from "@/components/analytics/OpenInterestChart";
import { FundingRateChart } from "@/components/analytics/FundingRateChart";
import { FeeRevenue } from "@/components/analytics/FeeRevenue";
import { LiquidationFeed } from "@/components/analytics/LiquidationFeed";
import { LPPerformance } from "@/components/analytics/LPPerformance";
import { PoolHealth } from "@/components/analytics/PoolHealth";
import { VolatilityPanel } from "@/components/analytics/VolatilityPanel";

export default function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 py-8">
      <h1 className="text-2xl font-bold text-white">Protocol Analytics</h1>

      {/* Top-level stats strip */}
      <ProtocolOverview />

      {/* Row 1: OI + Funding */}
      <div className="grid gap-4 md:grid-cols-2">
        <OpenInterestChart />
        <FundingRateChart />
      </div>

      {/* Row 2: Fees + Liquidations */}
      <div className="grid gap-4 md:grid-cols-2">
        <FeeRevenue />
        <LiquidationFeed />
      </div>

      {/* Row 3: LP + Pool Health */}
      <div className="grid gap-4 md:grid-cols-2">
        <LPPerformance />
        <PoolHealth />
      </div>

      {/* Row 4: Volatility Oracle */}
      <VolatilityPanel />
    </div>
  );
}
