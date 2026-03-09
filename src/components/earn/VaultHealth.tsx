"use client";

import { useUtilization } from "@/hooks/useVault";
import { useOpenInterest } from "@/hooks/useOpenInterest";
import { wadToNumber, formatCompact } from "@/lib/format";
import { Card, CardTitle } from "@/components/ui/Card";

function UtilizationBar() {
  const { data: utilization } = useUtilization();
  const util = utilization ? wadToNumber(utilization) * 100 : 0;
  const hasData = utilization !== undefined;

  const barColor =
    util < 50 ? "#22c55e" : util < 80 ? "#eab308" : "#ef4444";

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Utilization</p>
        <p className="font-mono text-sm font-bold text-[#e1e4e8]">
          {hasData ? `${util.toFixed(1)}%` : "\u2014"}
        </p>
      </div>
      <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-[#161b22]">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: hasData ? `${Math.min(util, 100)}%` : "0%",
            backgroundColor: barColor,
          }}
        />
      </div>
      <p className="mt-1.5 text-[10px] text-zinc-600">
        {hasData
          ? `${util.toFixed(1)}% of vault assets are backing open positions`
          : "Connect to view vault utilization"}
      </p>
    </div>
  );
}

function OIBreakdown() {
  const { longOI, shortOI } = useOpenInterest();
  const hasData = longOI !== undefined && shortOI !== undefined;

  const longVal = longOI ? wadToNumber(longOI) : 0;
  const shortVal = shortOI ? wadToNumber(shortOI) : 0;
  const total = longVal + shortVal;
  const longPct = total > 0 ? (longVal / total) * 100 : 50;
  const netOI = longVal - shortVal;

  const netDir = netOI > 0 ? "Vault net short" : netOI < 0 ? "Vault net long" : "Balanced";

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Open Interest</p>
        <p className="font-mono text-sm font-bold text-[#e1e4e8]">
          {hasData ? formatCompact(total) : "\u2014"}
        </p>
      </div>
      <div className="mt-2 flex h-2.5 w-full overflow-hidden rounded-full bg-[#161b22]">
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${longPct}%`,
            backgroundColor: "#22c55e",
            borderRadius: longPct >= 100 ? "9999px" : "9999px 0 0 9999px",
          }}
        />
        <div
          className="h-full transition-all duration-500"
          style={{
            width: `${100 - longPct}%`,
            backgroundColor: "#ef4444",
            borderRadius: longPct <= 0 ? "9999px" : "0 9999px 9999px 0",
          }}
        />
      </div>
      <div className="mt-1.5 flex justify-between text-[10px]">
        <span className="text-[#22c55e]">
          {hasData ? `${formatCompact(longVal)} Long` : "Long"}
        </span>
        <span className="text-zinc-600">
          {hasData ? netDir : ""}
        </span>
        <span className="text-red-400">
          {hasData ? `${formatCompact(shortVal)} Short` : "Short"}
        </span>
      </div>
    </div>
  );
}

export function VaultHealth() {
  return (
    <Card>
      <CardTitle>Vault Health</CardTitle>
      <div className="mt-4 space-y-6">
        <UtilizationBar />
        <OIBreakdown />
      </div>
    </Card>
  );
}
