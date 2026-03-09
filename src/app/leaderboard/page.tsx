"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { TraderLeaderboard } from "@/components/leaderboard/TraderLeaderboard";
import { LPLeaderboard } from "@/components/leaderboard/LPLeaderboard";

type LeaderboardTab = "traders" | "lp";

const TABS: { key: LeaderboardTab; label: string }[] = [
  { key: "traders", label: "Traders" },
  { key: "lp", label: "LP Providers" },
];

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<LeaderboardTab>("traders");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold text-white">Leaderboard</h1>
      <p className="mt-1 text-xs text-zinc-500">
        Top performers across trading and liquidity provision.
      </p>

      <div className="mt-6 rounded border border-[#21262d] bg-[#0f1216]">
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
        <div className="p-4">
          {activeTab === "traders" && <TraderLeaderboard />}
          {activeTab === "lp" && <LPLeaderboard />}
        </div>
      </div>
    </div>
  );
}
