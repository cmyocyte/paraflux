"use client";

import { useState, useEffect } from "react";
import { useAccount, useChainId } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSurgeDeposit } from "@/hooks/useSurgeLP";
import { useUSDCApproval } from "@/hooks/useUSDCApproval";
import { useSurgePreviewShares } from "@/hooks/useSurge";
import { CONTRACTS, EXPECTED_CHAIN_ID } from "@/config/contracts";
import { numberToUsdc, usdcToNumber, formatUsd } from "@/lib/format";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { WrongNetworkBanner } from "@/components/ui/WrongNetworkBanner";

export function SurgeDepositForm() {
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const [amountInput, setAmountInput] = useState("");

  const amount = parseFloat(amountInput) || 0;
  const usdcAmount = numberToUsdc(amount);

  const { data: previewShares } = useSurgePreviewShares(
    amount > 0 ? usdcAmount : undefined
  );
  const { deposit, isPending, isConfirming, isSuccess, reset } = useSurgeDeposit();
  const {
    approve,
    needsApproval,
    isApproving,
    balance,
  } = useUSDCApproval(CONTRACTS.surgeVault);

  const requiresApproval = needsApproval(usdcAmount);

  useEffect(() => {
    reset();
    setAmountInput("");
  }, [address, reset]);

  const handleDeposit = () => {
    if (amount <= 0) return;
    deposit(usdcAmount);
  };

  if (isSuccess) {
    return (
      <Card>
        <CardTitle>Deposit</CardTitle>
        <div className="mt-6 text-center">
          <p className="text-lg font-semibold text-[#22c55e]">
            Deposit successful!
          </p>
          <p className="mt-2 text-sm text-zinc-400">
            Your Surge shares have been minted. You can withdraw after the 1-hour
            cooldown.
          </p>
          <Button
            className="mt-4"
            variant="secondary"
            onClick={() => {
              setAmountInput("");
              reset();
            }}
          >
            Make Another Deposit
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardTitle>Deposit USDC</CardTitle>

      <p className="mt-2 text-xs text-zinc-500">
        ~50% deposited into Anchor, ~50% used for leveraged long HYPE
      </p>

      <div className="mt-4">
        <Input
          label="Amount"
          type="number"
          placeholder="0.0"
          suffix="USDC"
          value={amountInput}
          onChange={(e) => setAmountInput(e.target.value)}
        />
      </div>

      {previewShares !== undefined && amount > 0 && (
        <p className="mt-2 text-sm text-zinc-400">
          You will receive ~<span className="font-mono text-[#e1e4e8]">{usdcToNumber(previewShares).toFixed(4)}</span> Surge shares
        </p>
      )}

      <div className="mt-4">
        {!isConnected ? (
          <div className="flex justify-center">
            <ConnectButton />
          </div>
        ) : chainId !== EXPECTED_CHAIN_ID ? (
          <WrongNetworkBanner />
        ) : requiresApproval ? (
          <Button className="w-full" onClick={approve} loading={isApproving}>
            Approve USDC
          </Button>
        ) : (
          <Button
            className="w-full"
            onClick={handleDeposit}
            loading={isPending || isConfirming}
            disabled={amount <= 0}
          >
            Deposit
          </Button>
        )}
      </div>

      {balance !== undefined && (
        <p className="mt-2 text-center text-xs text-zinc-500">
          Wallet balance: {formatUsd(Number(balance) / 1e6)}
        </p>
      )}
    </Card>
  );
}
