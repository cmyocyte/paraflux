"use client";

import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { CONTRACTS } from "@/config/contracts";
import { anchorVaultAbi } from "@/lib/abi/AnchorVault";

export function useAnchorDeposit() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({ hash });

  const deposit = (usdcAmount: bigint) => {
    if (!address) return;
    writeContract({
      address: CONTRACTS.anchorVault,
      abi: anchorVaultAbi,
      functionName: "deposit",
      args: [usdcAmount, address],
    });
  };

  return { deposit, isPending, isConfirming, isSuccess, error, hash, reset };
}

export function useAnchorRedeem() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({ hash });

  const redeem = (shares: bigint) => {
    if (!address) return;
    writeContract({
      address: CONTRACTS.anchorVault,
      abi: anchorVaultAbi,
      functionName: "redeem",
      args: [shares, address, address],
    });
  };

  return { redeem, isPending, isConfirming, isSuccess, error, hash, reset };
}
