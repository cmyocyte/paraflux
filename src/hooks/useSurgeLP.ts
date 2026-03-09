"use client";

import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { CONTRACTS } from "@/config/contracts";
import { surgeVaultAbi } from "@/lib/abi/SurgeVault";

export function useSurgeDeposit() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({ hash });

  const deposit = (usdcAmount: bigint) => {
    if (!address) return;
    writeContract({
      address: CONTRACTS.surgeVault,
      abi: surgeVaultAbi,
      functionName: "deposit",
      args: [usdcAmount, address],
    });
  };

  return { deposit, isPending, isConfirming, isSuccess, error, hash, reset };
}

export function useSurgeRedeem() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({ hash });

  const redeem = (shares: bigint) => {
    if (!address) return;
    writeContract({
      address: CONTRACTS.surgeVault,
      abi: surgeVaultAbi,
      functionName: "redeem",
      args: [shares, address, address],
    });
  };

  return { redeem, isPending, isConfirming, isSuccess, error, hash, reset };
}

export function useSurgeWithdraw() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({ hash });

  const withdraw = (usdcAmount: bigint) => {
    if (!address) return;
    writeContract({
      address: CONTRACTS.surgeVault,
      abi: surgeVaultAbi,
      functionName: "withdraw",
      args: [usdcAmount, address, address],
    });
  };

  return { withdraw, isPending, isConfirming, isSuccess, error, hash, reset };
}
