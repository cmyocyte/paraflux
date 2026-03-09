"use client";

import { useEffect } from "react";
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { CONTRACTS } from "@/config/contracts";
import { erc20Abi } from "@/lib/abi/ERC20";

const MAX_UINT256 = 2n ** 256n - 1n;

export function useUSDCApproval(spender: `0x${string}`) {
  const { address } = useAccount();

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: CONTRACTS.usdc,
    abi: erc20Abi,
    functionName: "allowance",
    args: address ? [address, spender] : undefined,
    query: { enabled: !!address },
  });

  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: CONTRACTS.usdc,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address, refetchInterval: 30000 },
  });

  const {
    writeContract,
    data: hash,
    isPending: isApproving,
    error: approveError,
    reset,
  } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({
      hash,
      query: {
        enabled: !!hash,
      },
    });

  // Refetch allowance after approval confirms
  useEffect(() => {
    if (isSuccess) {
      refetchAllowance();
    }
  }, [isSuccess, refetchAllowance]);

  // Reset stale approve state when wallet changes
  useEffect(() => {
    reset();
  }, [address, reset]);

  const approve = () => {
    writeContract({
      address: CONTRACTS.usdc,
      abi: erc20Abi,
      functionName: "approve",
      args: [spender, MAX_UINT256],
    });
  };

  const needsApproval = (amount: bigint) => {
    if (!allowance) return true;
    return allowance < amount;
  };

  return {
    allowance,
    balance,
    approve,
    needsApproval,
    isApproving: isApproving || isConfirming,
    approveError,
    refetch: refetchBalance,
  };
}
