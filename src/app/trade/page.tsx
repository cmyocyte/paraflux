"use client";

import { MarketData } from "@/components/trade/MarketData";
import { PriceChart } from "@/components/trade/PriceChart";
import { TradePanel } from "@/components/trade/TradePanel";
import { BottomTabs } from "@/components/trade/BottomTabs";
import { TradeHistoryProvider } from "@/context/TradeHistoryContext";

export default function TradePage() {
  return (
    <TradeHistoryProvider>
      <div className="mx-auto max-w-[1440px] px-3 py-3">
        {/* Compact stat bar */}
        <MarketData />

        {/* Main terminal grid: chart + tabs left, trade panel right spanning full height */}
        <div className="mt-2 grid gap-2 lg:grid-cols-[1fr_340px] lg:grid-rows-[auto_1fr]">
          <div className="min-w-0">
            <PriceChart />
          </div>
          <div className="min-w-0 lg:row-span-2">
            <TradePanel />
          </div>
          <div className="min-w-0">
            <BottomTabs />
          </div>
        </div>
      </div>
    </TradeHistoryProvider>
  );
}
