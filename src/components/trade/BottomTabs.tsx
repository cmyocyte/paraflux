"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { PositionsTable } from "./PositionsTable";
import { TradeHistory } from "./TradeHistory";
import { FundingHistory } from "./FundingHistory";

type Tab = "positions" | "trades" | "funding";

const TABS: { key: Tab; label: string }[] = [
  { key: "positions", label: "Positions" },
  { key: "trades", label: "Trades" },
  { key: "funding", label: "Funding" },
];

export function BottomTabs() {
  const [activeTab, setActiveTab] = useState<Tab>("positions");

  return (
    <div className="rounded border border-[#21262d] bg-[#0f1216]">
      {/* Tab bar */}
      <div className="flex gap-0.5 border-b border-[#21262d] px-2 pt-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={clsx(
              "rounded-t px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors",
              activeTab === tab.key
                ? "bg-[#22c55e]/10 text-[#22c55e]"
                : "text-zinc-600 hover:text-zinc-400"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "positions" && <PositionsTable embedded />}
      {activeTab === "trades" && <TradeHistory />}
      {activeTab === "funding" && <FundingHistory />}
    </div>
  );
}
