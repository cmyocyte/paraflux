"use client";

import { useState, useEffect } from "react";
import { useAccount, useChainId } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAnchorRedeem } from "@/hooks/useAnchorLP";
import {
  useAnchorShares,
  useAnchorShareValue,
  useAnchorLastDeposit,
} from "@/hooks/useAnchorVault";
import { EXPECTED_CHAIN_ID } from "@/config/contracts";
import { usdcToNumber, formatUsd } from "@/lib/format";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { WrongNetworkBanner } from "@/components/ui/WrongNetworkBanner";

const COOLDOWN_SECONDS = 3600;

export function AnchorWithdrawForm() {
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const [sharesInput, setSharesInput] = useState("");

  const { data: userShares } = useAnchorShares();
  const { data: lastDeposit } = useAnchorLastDeposit();
  const { redeem, isPending, isConfirming, isSuccess, reset } = useAnchorRedeem();

  const sharesNum = parseFloat(sharesInput) || 0;
  const sharesBigInt = BigInt(Math.floor(sharesNum * 1e6)) * 10n ** 12n;

  const { data: previewAssets } = useAnchorShareValue(
    sharesNum > 0 ? sharesBigInt : undefined
  );

  const now = Math.floor(Date.now() / 1000);
  const cooldownActive =
    lastDeposit !== undefined && Number(lastDeposit) + COOLDOWN_SECONDS > now;

  useEffect(() => {
    reset();
    setSharesInput("");
  }, [address, reset]);

  const handleRedeem = () => {
    if (sharesNum <= 0) return;
    redeem(sharesBigInt);
  };

  const handleMax = () => {
    if (userShares) {
      setSharesInput(usdcToNumber(userShares).toFixed(6));
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

      {previewAssets !== undefined && sharesNum > 0 && (
        <p className="mt-2 text-sm text-zinc-400">
          You will receive ~<span className="font-mono text-[#e1e4e8]">{formatUsd(usdcToNumber(previewAssets))}</span>
        </p>
      )}

      {cooldownActive && (
        <p className="mt-2 text-sm text-[#eab308]">
          Cooldown active — withdrawals available 1 hour after your last deposit.
        </p>
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
            onClick={handleRedeem}
            loading={isPending || isConfirming}
            disabled={sharesNum <= 0 || cooldownActive}
          >
            Withdraw
          </Button>
        )}
      </div>

      {userShares !== undefined && (
        <p className="mt-2 text-center text-xs text-zinc-500">
          Your shares: {usdcToNumber(userShares).toFixed(4)}
        </p>
      )}
    </Card>
  );
}
