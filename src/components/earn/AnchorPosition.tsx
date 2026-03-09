"use client";

import { useAccount } from "wagmi";
import {
  useAnchorShares,
  useAnchorShareValue,
  useAnchorTotalSupply,
  useAnchorLastDeposit,
} from "@/hooks/useAnchorVault";
import { usdcToNumber, formatUsd, formatCountdown } from "@/lib/format";
import { Card, CardTitle } from "@/components/ui/Card";
import { useState, useEffect } from "react";

const COOLDOWN_SECONDS = 3600;

export function AnchorPosition() {
  const { isConnected } = useAccount();
  const { data: shares } = useAnchorShares();
  const { data: shareValue } = useAnchorShareValue(shares);
  const { data: totalSupply } = useAnchorTotalSupply();
  const { data: lastDeposit } = useAnchorLastDeposit();

  const [now, setNow] = useState(Math.floor(Date.now() / 1000));

  useEffect(() => {
    const interval = setInterval(() => setNow(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isConnected || !shares || shares === 0n) return null;

  const value = shareValue ? usdcToNumber(shareValue) : 0;
  const poolShare =
    totalSupply && totalSupply > 0n
      ? (Number(shares) / Number(totalSupply)) * 100
      : 0;

  const cooldownEnd = lastDeposit ? Number(lastDeposit) + COOLDOWN_SECONDS : 0;
  const cooldownRemaining = Math.max(0, cooldownEnd - now);

  return (
    <Card>
      <CardTitle>Your Anchor Position</CardTitle>
      <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div>
          <p className="text-xs text-zinc-500">Shares</p>
          <p className="font-mono text-sm font-bold text-[#e1e4e8]">
            {usdcToNumber(shares).toFixed(4)}
          </p>
        </div>
        <div>
          <p className="text-xs text-zinc-500">Value</p>
          <p className="font-mono text-sm font-bold text-[#e1e4e8]">
            {formatUsd(value)}
          </p>
        </div>
        <div>
          <p className="text-xs text-zinc-500">Pool Share</p>
          <p className="font-mono text-sm font-bold text-[#e1e4e8]">
            {poolShare.toFixed(2)}%
          </p>
        </div>
        <div>
          <p className="text-xs text-zinc-500">Cooldown</p>
          <p className="font-mono text-sm font-bold text-[#e1e4e8]">
            {cooldownRemaining > 0 ? (
              <span className="text-[#eab308]">{formatCountdown(cooldownRemaining)}</span>
            ) : (
              <span className="text-[#22c55e]">Ready</span>
            )}
          </p>
        </div>
      </div>
    </Card>
  );
}
