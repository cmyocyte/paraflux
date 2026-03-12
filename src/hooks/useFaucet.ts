"use client";

import { useEffect } from "react";
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useReadContract,
  useAccount,
} from "wagmi";
import { CONTRACTS } from "@/config/contracts";
import { mockUsdcAbi } from "@/lib/abi/MockUSDC";

const CLAIM_AMOUNT = 10_000n * 1_000_000n; // 10,000 USDC (6 decimals)
const COOLDOWN_KEY = "paraflux_faucet_last_claim";
const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours

export function useFaucet() {
  const { address } = useAccount();

  const { writeContract, data: hash, isPending, error, reset } =
    useWriteContract();

  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({ hash });

  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: CONTRACTS.usdc,
    abi: mockUsdcAbi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 15000 },
  });

  useEffect(() => {
    if (isSuccess) refetchBalance();
  }, [isSuccess, refetchBalance]);

  useEffect(() => {
    reset();
  }, [address, reset]);

  const canClaim = (): boolean => {
    const last = localStorage.getItem(COOLDOWN_KEY);
    if (!last) return true;
    return Date.now() - Number(last) >= COOLDOWN_MS;
  };

  const timeUntilNextClaim = (): number => {
    const last = localStorage.getItem(COOLDOWN_KEY);
    if (!last) return 0;
    const elapsed = Date.now() - Number(last);
    return Math.max(0, COOLDOWN_MS - elapsed);
  };

  const claim = () => {
    if (!address) return;
    if (!canClaim()) return;

    localStorage.setItem(COOLDOWN_KEY, String(Date.now()));
    writeContract({
      address: CONTRACTS.usdc,
      abi: mockUsdcAbi,
      functionName: "mint",
      args: [address, CLAIM_AMOUNT],
    });
  };

  return {
    claim,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
    reset,
    balance,
    canClaim,
    timeUntilNextClaim,
    refetchBalance,
  };
}
