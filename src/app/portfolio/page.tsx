"use client";

import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { usePosition } from "@/hooks/usePosition";
import { useUserShares, useShareValue } from "@/hooks/useVault";
import { useAnchorShares, useAnchorShareValue, useAnchorTotalSupply } from "@/hooks/useAnchorVault";
import { useSurgeShares, useSurgeShareValue, useSurgeTotalSupply } from "@/hooks/useSurge";
import { useLPStats } from "@/hooks/useLPStats";
import { useCurrentIndex } from "@/hooks/useOracle";
import { wadToNumber, usdcToNumber, formatUsd } from "@/lib/format";
import { CONTRACTS } from "@/config/contracts";
import { clsx } from "clsx";
import { Card, CardTitle } from "@/components/ui/Card";
import { PositionsTable } from "@/components/trade/PositionsTable";
import Link from "next/link";

function LPCard() {
  const { data: shares } = useUserShares();
  const { data: value } = useShareValue(shares);
  const { stats: lpStats } = useLPStats();

  if (!shares || shares === 0n) return null;

  const valueUsd = value ? usdcToNumber(value) : 0;
  const pnl = lpStats && value ? valueUsd - lpStats.netDeposited : null;
  const roi = lpStats && lpStats.netDeposited > 0 && pnl !== null
    ? (pnl / lpStats.netDeposited) * 100
    : null;

  return (
    <Card>
      <CardTitle>LP Position</CardTitle>
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Shares</p>
          <p className="font-mono font-medium text-[#e1e4e8]">
            {(Number(shares) / 1e6).toFixed(4)}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Value</p>
          <p className="font-mono font-medium text-[#e1e4e8]">
            {value ? formatUsd(valueUsd) : "\u2014"}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Net Deposited</p>
          <p className="font-mono font-medium text-[#e1e4e8]">
            {lpStats ? formatUsd(lpStats.netDeposited) : "\u2014"}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">P&L</p>
          <p
            className={clsx(
              "font-mono font-medium",
              pnl === null
                ? "text-[#e1e4e8]"
                : pnl >= 0
                  ? "text-[#22c55e]"
                  : "text-red-400"
            )}
          >
            {pnl !== null ? (
              <>
                {pnl >= 0 ? "+" : ""}{formatUsd(pnl)}
                {roi !== null && (
                  <span className="ml-1 text-[10px] text-zinc-500">
                    ({roi >= 0 ? "+" : ""}{roi.toFixed(1)}%)
                  </span>
                )}
              </>
            ) : "\u2014"}
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

const ZERO_ADDR = "0x0000000000000000000000000000000000000000";

function VaultCard({
  title,
  shares,
  value,
  totalSupply,
  href,
}: {
  title: string;
  shares: bigint | undefined;
  value: bigint | undefined;
  totalSupply: bigint | undefined;
  href: string;
}) {
  if (!shares || shares === 0n) return null;

  const sharesNum = Number(shares) / 1e6;
  const valueUsd = value ? usdcToNumber(value) : 0;
  // Approximate P&L: value vs shares-at-par (1 share = 1 USDC at initial deposit)
  const pnl = value ? valueUsd - sharesNum : null;
  const roi = pnl !== null && sharesNum > 0 ? (pnl / sharesNum) * 100 : null;
  const poolShare =
    totalSupply && totalSupply > 0n
      ? (Number(shares) / Number(totalSupply)) * 100
      : 0;

  return (
    <Card>
      <CardTitle>{title}</CardTitle>
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Shares</p>
          <p className="font-mono font-medium text-[#e1e4e8]">
            {sharesNum.toFixed(4)}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Value</p>
          <p className="font-mono font-medium text-[#e1e4e8]">
            {value ? formatUsd(valueUsd) : "\u2014"}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">P&L</p>
          <p
            className={clsx(
              "font-mono font-medium",
              pnl === null
                ? "text-[#e1e4e8]"
                : pnl >= 0
                  ? "text-[#22c55e]"
                  : "text-red-400"
            )}
          >
            {pnl !== null ? (
              <>
                {pnl >= 0 ? "+" : ""}{formatUsd(pnl)}
                {roi !== null && (
                  <span className="ml-1 text-[10px] text-zinc-500">
                    ({roi >= 0 ? "+" : ""}{roi.toFixed(1)}%)
                  </span>
                )}
              </>
            ) : "\u2014"}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Pool Share</p>
          <p className="font-mono font-medium text-[#e1e4e8]">
            {poolShare.toFixed(2)}%
          </p>
        </div>
      </div>
      <Link
        href={href}
        className="mt-4 block text-center text-xs font-medium text-[#22c55e] hover:text-[#22c55e]/70 transition-colors"
      >
        Manage position &rarr;
      </Link>
    </Card>
  );
}

function AnchorCard() {
  const { data: shares } = useAnchorShares();
  const { data: value } = useAnchorShareValue(shares);
  const { data: totalSupply } = useAnchorTotalSupply();

  if (CONTRACTS.anchorVault === ZERO_ADDR) return null;

  return (
    <VaultCard
      title="Anchor Position"
      shares={shares}
      value={value}
      totalSupply={totalSupply}
      href="/earn"
    />
  );
}

function SurgeCard() {
  const { data: shares } = useSurgeShares();
  const { data: value } = useSurgeShareValue(shares);
  const { data: totalSupply } = useSurgeTotalSupply();

  if (CONTRACTS.surgeVault === ZERO_ADDR) return null;

  return (
    <VaultCard
      title="Surge Position"
      shares={shares}
      value={value}
      totalSupply={totalSupply}
      href="/earn"
    />
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
  const { data: anchorShares } = useAnchorShares();
  const { data: surgeShares } = useSurgeShares();

  const hasLong = longPosition && longPosition.size > 0n;
  const hasShort = shortPosition && shortPosition.size > 0n;
  const hasLP = shares && shares > 0n;
  const hasAnchor = anchorShares && anchorShares > 0n;
  const hasSurge = surgeShares && surgeShares > 0n;
  const hasAnything = hasLong || hasShort || hasLP || hasAnchor || hasSurge;

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
        Your open positions and vault holdings.
      </p>

      <div className="mt-6 space-y-4">
        {hasAnything ? (
          <>
            <PositionsTable />
            <LPCard />
            <AnchorCard />
            <SurgeCard />
          </>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
}
