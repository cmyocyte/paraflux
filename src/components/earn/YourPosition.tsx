"use client";

import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useUserShares, useShareValue, useTotalSupply, useLastDepositTime } from "@/hooks/useVault";
import { usdcToNumber, formatUsd } from "@/lib/format";
import { Card } from "@/components/ui/Card";

const COOLDOWN_SECONDS = 3600;

export function YourPosition() {
  const { isConnected } = useAccount();
  const { data: userShares } = useUserShares();
  const { data: totalSupply } = useTotalSupply();
  const { data: shareValue } = useShareValue(userShares && userShares > 0n ? userShares : undefined);
  const { data: lastDeposit } = useLastDepositTime();
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isConnected) return null;

  if (!userShares || userShares === 0n) {
    return (
      <div className="rounded border border-[#21262d] bg-[#0f1216] px-4 py-3 text-sm text-zinc-500">
        You have no LP shares yet. Deposit USDC below to start earning.
      </div>
    );
  }

  const sharesNum = Number(userShares) / 1e6;
  const valueUsd = shareValue ? usdcToNumber(shareValue) : 0;
  const poolShare =
    totalSupply && totalSupply > 0n
      ? (Number(userShares) / Number(totalSupply)) * 100
      : 0;

  const cooldownEnd = lastDeposit ? Number(lastDeposit) + COOLDOWN_SECONDS : 0;
  const inCooldown = cooldownEnd > now;
  const remaining = inCooldown ? cooldownEnd - now : 0;
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  return (
    <Card className="border-l-2 border-l-[#22c55e]">
      <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Your Position</p>
      <div className="mt-3 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">Shares</p>
          <p className="mt-0.5 font-mono text-sm font-bold text-[#e1e4e8]">
            {sharesNum.toFixed(4)}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">Value</p>
          <p className="mt-0.5 font-mono text-sm font-bold text-[#e1e4e8]">
            {shareValue ? formatUsd(valueUsd) : "\u2014"}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">Pool Share</p>
          <p className="mt-0.5 font-mono text-sm font-bold text-[#e1e4e8]">
            {poolShare.toFixed(2)}%
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">Withdraw</p>
          {inCooldown ? (
            <p className="mt-0.5 font-mono text-sm font-bold text-yellow-400">
              {minutes}m {seconds.toString().padStart(2, "0")}s
            </p>
          ) : (
            <p className="mt-0.5 text-sm font-bold text-[#22c55e]">Ready</p>
          )}
        </div>
      </div>
    </Card>
  );
}
