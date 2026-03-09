"use client";

import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { EXPECTED_CHAIN_ID } from "@/config/contracts";
import { Button } from "./Button";

/**
 * Shows a banner with a "Switch Network" button when the connected wallet
 * is on the wrong chain (e.g. mainnet instead of testnet).
 * Returns null when disconnected or already on the correct chain.
 */
export function WrongNetworkBanner() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();

  if (!isConnected || chainId === EXPECTED_CHAIN_ID) return null;

  return (
    <div className="rounded border border-yellow-800/50 bg-yellow-900/20 px-3 py-2 text-center">
      <p className="text-xs font-bold text-yellow-400">
        Wrong network — contracts are on{" "}
        {EXPECTED_CHAIN_ID === 998 ? "HyperEVM Testnet" : "HyperEVM"}
      </p>
      <Button
        className="mt-2"
        size="sm"
        onClick={() => switchChain({ chainId: EXPECTED_CHAIN_ID })}
        loading={isPending}
      >
        Switch Network
      </Button>
    </div>
  );
}
