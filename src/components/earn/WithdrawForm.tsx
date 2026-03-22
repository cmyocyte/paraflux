"use client";

import { useState, useEffect } from "react";
import { useRedeem } from "@/hooks/useLP";
import {
  useUserShares,
  useShareValue,
  useLastDepositTime,
} from "@/hooks/useVault";
import { usdcToNumber, formatUsd } from "@/lib/format";
import { getTxUrl } from "@/lib/explorer";
import { EXPECTED_CHAIN_ID } from "@/config/contracts";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { WrongNetworkBanner } from "@/components/ui/WrongNetworkBanner";
import { useAccount, useChainId } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const COOLDOWN_SECONDS = 3600; // 1 hour

export function WithdrawForm() {
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const [sharesInput, setSharesInput] = useState("");
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));

  const shares = parseFloat(sharesInput) || 0;
  const sharesRaw = BigInt(Math.round(shares * 1e6)); // shares are 6-decimal like USDC

  const { data: userShares } = useUserShares();
  const { data: shareValue } = useShareValue(
    shares > 0 ? sharesRaw : undefined
  );
  const { data: lastDeposit } = useLastDepositTime();
  const { redeem, isPending, isConfirming, isSuccess, error: redeemError, hash, reset } = useRedeem();

  // Reset stale mutation state when wallet changes
  useEffect(() => {
    reset();
    setSharesInput("");
  }, [address, reset]);

  // Tick the clock every second for cooldown
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const cooldownEnd = lastDeposit
    ? Number(lastDeposit) + COOLDOWN_SECONDS
    : 0;
  const inCooldown = cooldownEnd > now;
  const remaining = inCooldown ? cooldownEnd - now : 0;
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  const handleWithdraw = () => {
    if (shares <= 0) return;
    redeem(sharesRaw);
  };

  const handleMax = () => {
    if (userShares) {
      setSharesInput((Number(userShares) / 1e6).toString());
    }
  };

  if (isSuccess) {
    return (
      <Card>
        <CardTitle>Withdraw</CardTitle>
        <div className="mt-6 text-center">
          <p className="text-lg font-semibold text-[#22c55e]">
            Withdrawal successful!
          </p>
          <p className="mt-2 text-sm text-zinc-400">
            USDC has been returned to your wallet.
          </p>
          {hash && (
            <a
              href={getTxUrl(hash, chainId)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              View transaction
            </a>
          )}
          <Button
            className="mt-4"
            variant="secondary"
            onClick={() => {
              setSharesInput("");
              reset();
            }}
          >
            Withdraw More
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardTitle>Withdraw</CardTitle>

      <div className="mt-4">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Input
              label="Shares to redeem"
              type="number"
              placeholder="0.0"
              suffix="shares"
              value={sharesInput}
              onChange={(e) => setSharesInput(e.target.value)}
            />
          </div>
          <button
            className="mb-0.5 rounded bg-[#161b22] px-3 py-2 text-xs font-bold uppercase tracking-wider text-zinc-400 hover:bg-[#21262d] hover:text-[#22c55e] transition-colors"
            onClick={handleMax}
          >
            MAX
          </button>
        </div>
      </div>

      {shareValue !== undefined && shares > 0 && (
        <p className="mt-2 text-sm text-zinc-400">
          You will receive ~<span className="font-mono text-[#e1e4e8]">{formatUsd(usdcToNumber(shareValue))}</span> USDC
        </p>
      )}

      {userShares !== undefined && (
        <p className="mt-1 text-xs text-zinc-500">
          Your shares: <span className="font-mono">{(Number(userShares) / 1e6).toFixed(4)}</span>
        </p>
      )}

      {inCooldown && (
        <div className="mt-3 rounded border border-yellow-800/50 bg-yellow-900/20 px-3 py-2 text-sm font-bold text-yellow-400">
          Cooldown active: {minutes}m {seconds.toString().padStart(2, "0")}s
          remaining
        </div>
      )}

      <div className="mt-4">
        {!isConnected ? (
          <div className="flex justify-center">
            <ConnectButton />
          </div>
        ) : chainId !== EXPECTED_CHAIN_ID ? (
          <WrongNetworkBanner />
        ) : (
          <Button
            className="w-full"
            variant="secondary"
            onClick={handleWithdraw}
            loading={isPending || isConfirming}
            disabled={shares <= 0 || inCooldown}
          >
            {inCooldown ? "Cooldown Active" : "Withdraw"}
          </Button>
        )}
      </div>
      {redeemError && (
        <p className="mt-2 text-center text-xs text-red-400">
          {redeemError.message?.includes("User rejected")
            ? "Transaction rejected"
            : redeemError.message?.slice(0, 120) || "Transaction failed"}
        </p>
      )}
    </Card>
  );
}
