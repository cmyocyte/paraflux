"use client";

import { useState, useEffect } from "react";
import { useAccount, useChainId } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useFaucet } from "@/hooks/useFaucet";
import { EXPECTED_CHAIN_ID } from "@/config/contracts";
import { Card, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { WrongNetworkBanner } from "@/components/ui/WrongNetworkBanner";

function formatCountdown(ms: number): string {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${hours}h ${minutes}m ${seconds}s`;
}

export default function FaucetPage() {
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const {
    claim,
    isPending,
    isConfirming,
    isSuccess,
    error,
    reset,
    balance,
    canClaim,
    timeUntilNextClaim,
  } = useFaucet();

  const [countdown, setCountdown] = useState(0);

  // Update countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(timeUntilNextClaim());
    }, 1000);
    return () => clearInterval(interval);
  }, [timeUntilNextClaim]);

  const isTestnet = EXPECTED_CHAIN_ID === 998;
  const isLoading = isPending || isConfirming;
  const usdcBalance = balance ? Number(balance) / 1e6 : 0;

  if (!isTestnet) {
    return (
      <div className="mx-auto max-w-lg px-4 py-8">
        <h1 className="text-2xl font-bold text-white">Testnet Faucet</h1>
        <Card className="mt-6">
          <p className="text-sm text-zinc-400">
            The faucet is only available on testnet.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <h1 className="text-2xl font-bold text-white">Testnet Faucet</h1>
      <p className="mt-1 text-xs text-zinc-500">
        Claim test USDC to try the protocol on HyperEVM testnet
      </p>

      <Card className="mt-6">
        <CardTitle>Claim Test USDC</CardTitle>

        {/* Balance display */}
        {isConnected && (
          <div className="mt-4 rounded-lg border border-[#21262d] bg-[#0b0e11] p-4">
            <p className="text-xs text-zinc-500">Your USDC Balance</p>
            <p className="mt-1 text-xl font-semibold text-white">
              {usdcBalance.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              <span className="text-sm text-zinc-400">USDC</span>
            </p>
          </div>
        )}

        <div className="mt-4">
          {isSuccess ? (
            <div className="text-center">
              <p className="text-lg font-semibold text-[#22c55e]">
                10,000 USDC claimed!
              </p>
              <p className="mt-2 text-sm text-zinc-400">
                Your test USDC has been minted to your wallet.
              </p>
              <Button
                className="mt-4"
                variant="secondary"
                onClick={() => reset()}
              >
                Done
              </Button>
            </div>
          ) : !isConnected ? (
            <div className="flex justify-center">
              <ConnectButton />
            </div>
          ) : chainId !== EXPECTED_CHAIN_ID ? (
            <WrongNetworkBanner />
          ) : !canClaim() ? (
            <div className="text-center">
              <p className="text-sm text-zinc-400">
                You can claim again in
              </p>
              <p className="mt-1 text-lg font-semibold text-white">
                {formatCountdown(countdown)}
              </p>
            </div>
          ) : (
            <Button
              className="w-full"
              onClick={claim}
              loading={isLoading}
            >
              {isPending
                ? "Confirming..."
                : isConfirming
                ? "Minting..."
                : "Claim 10,000 USDC"}
            </Button>
          )}

          {error && (
            <p className="mt-3 text-center text-xs text-red-400">
              {error.message.length > 100
                ? error.message.slice(0, 100) + "..."
                : error.message}
            </p>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-zinc-600">
          Limited to one claim per 24 hours
        </p>
      </Card>
    </div>
  );
}
