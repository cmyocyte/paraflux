"use client";

import { useCurrentIndex, useHypeSpot } from "@/hooks/useOracle";
import { useCurrentFundingRate, useBaseVolatility } from "@/hooks/useFunding";
import { useOpenInterest } from "@/hooks/useOpenInterest";
import { useVolume } from "@/hooks/useVolume";
import { wadToNumber, formatUsd, formatCompact, formatFundingRate, SECONDS_PER_YEAR } from "@/lib/format";
import { FundingCountdown } from "./FundingCountdown";

const DEMO = {
  spot: "$24.53",
  index: "$601.72",
  funding: "12.40%",
  fundingSub: "Longs pay",
  oi: "$1.28M",
};

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">
        {label}
      </span>
      <span className="font-mono text-sm font-bold text-[#e1e4e8]">{value}</span>
      {sub && (
        <span className="text-[10px] text-zinc-500">{sub}</span>
      )}
    </div>
  );
}

export function MarketData() {
  const { data: index } = useCurrentIndex();
  const { data: spot } = useHypeSpot();
  const { longOI, shortOI } = useOpenInterest();
  const { data: fundingRate } = useCurrentFundingRate(longOI, shortOI);
  const { data: baseVol } = useBaseVolatility();
  const { volume24h } = useVolume();

  const isLive = spot !== undefined || index !== undefined;

  // Implied vol: funding rate ≈ sigma² + skew, so implied vol = sqrt(annualized rate)
  // When funding is negative (shorts pay), fall back to configured base vol
  const impliedVol = fundingRate !== undefined && fundingRate > 0n
    ? Math.sqrt(Number(fundingRate * SECONDS_PER_YEAR) / 1e18) * 100
    : null;
  const baseVolPct = baseVol !== undefined ? wadToNumber(baseVol) * 100 : null;
  const volDisplay = impliedVol ?? baseVolPct;
  const volIsImplied = impliedVol !== null;

  const fundingSub = fundingRate !== undefined
    ? fundingRate > 0n
      ? "Longs pay"
      : fundingRate < 0n
        ? "Shorts pay"
        : "Balanced"
    : DEMO.fundingSub;

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-1 rounded border border-[#21262d] bg-[#0f1216] px-4 py-2">
      <Stat
        label="HYPE"
        value={spot !== undefined ? formatUsd(wadToNumber(spot)) : DEMO.spot}
      />
      <Stat
        label="Index"
        value={index !== undefined ? formatUsd(wadToNumber(index)) : DEMO.index}
        sub="S²/NORM"
      />
      <Stat
        label="Funding"
        value={fundingRate !== undefined ? formatFundingRate(fundingRate) : DEMO.funding}
        sub={fundingSub}
      />
      <FundingCountdown />
      <Stat
        label={volIsImplied ? "Implied Vol" : "Base Vol"}
        value={volDisplay !== null ? `${volDisplay.toFixed(1)}%` : "--"}
        sub="ann."
      />
      <Stat
        label="24h Vol"
        value={volume24h > 0 ? formatCompact(volume24h) : "--"}
      />
      <Stat
        label="OI"
        value={
          longOI !== undefined && shortOI !== undefined
            ? formatCompact(wadToNumber(longOI) + wadToNumber(shortOI))
            : DEMO.oi
        }
      />
      {!isLive && (
        <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-zinc-700">
          Demo
        </span>
      )}
    </div>
  );
}
