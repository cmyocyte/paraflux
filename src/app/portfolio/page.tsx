"use client";

import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { usePosition } from "@/hooks/usePosition";
import { useUserShares, useShareValue } from "@/hooks/useVault";
import { useCurrentIndex } from "@/hooks/useOracle";
import { wadToNumber, usdcToNumber, formatUsd } from "@/lib/format";
import { Card, CardTitle } from "@/components/ui/Card";
import { PositionsTable } from "@/components/trade/PositionsTable";
import Link from "next/link";

function LPCard() {
  const { data: shares } = useUserShares();
  const { data: value } = useShareValue(shares);

  if (!shares || shares === 0n) return null;

  return (
    <Card>
      <CardTitle>LP Position</CardTitle>
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Shares</p>
          <p className="font-mono font-medium text-[#e1e4e8]">
            {(Number(shares) / 1e6).toFixed(4)}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Value</p>
          <p className="font-mono font-medium text-[#e1e4e8]">
            {value ? formatUsd(usdcToNumber(value)) : "\u2014"}
          </p>
        </div>
      </div>
      <Link
        href="/earn"
        className="mt-4 block text-center text-xs font-medium text-[#22c55e] hover:text-[#22c55e]/70 transition-colors"
      >
        Manage LP position &rarr;
      </Link>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="rounded border border-dashed border-[#21262d] p-12 text-center">
      <p className="text-lg font-medium text-zinc-400">No positions yet</p>
      <p className="mt-2 text-sm text-zinc-500">
        Open a trade or deposit liquidity to get started.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link
          href="/trade"
          className="rounded bg-[#22c55e] px-4 py-2 text-sm font-semibold text-[#0b0e11] hover:bg-[#16a34a]"
        >
          Start Trading
        </Link>
        <Link
          href="/earn"
          className="rounded border border-[#21262d] px-4 py-2 text-sm font-semibold text-[#22c55e] hover:border-[#22c55e]/30 hover:bg-[#161b22]"
        >
          Earn Yield
        </Link>
      </div>
    </div>
  );
}

export default function PortfolioPage() {
  const { isConnected } = useAccount();
  const { data: longPosition } = usePosition(true);
  const { data: shortPosition } = usePosition(false);
  const { data: shares } = useUserShares();

  const hasLong = longPosition && longPosition.size > 0n;
  const hasShort = shortPosition && shortPosition.size > 0n;
  const hasLP = shares && shares > 0n;
  const hasAnything = hasLong || hasShort || hasLP;

  if (!isConnected) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-2xl font-bold text-white">Portfolio</h1>
        <div className="mt-8 flex flex-col items-center gap-4">
          <p className="text-zinc-400">Connect your wallet to view positions.</p>
          <ConnectButton />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold text-white">Portfolio</h1>
      <p className="mt-1 text-xs text-zinc-500">
        Your open positions and LP holdings.
      </p>

      <div className="mt-6 space-y-4">
        {hasAnything ? (
          <>
            <PositionsTable />
            <LPCard />
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
