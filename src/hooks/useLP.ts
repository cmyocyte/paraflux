"use client";

import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from "wagmi";
import { CONTRACTS } from "@/config/contracts";
import { lpVaultAbi } from "@/lib/abi/LPVault";

export function useDeposit() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({ hash });

  const deposit = (usdcAmount: bigint) => {
    if (!address) return;
    writeContract({
      address: CONTRACTS.lpVault,
      abi: lpVaultAbi,
      functionName: "deposit",
      args: [usdcAmount, address],
    });
  };

  return { deposit, isPending, isConfirming, isSuccess, error, hash, reset };
}

export function useRedeem() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({ hash });

  const redeem = (shares: bigint) => {
    if (!address) return;
    writeContract({
      address: CONTRACTS.lpVault,
      abi: lpVaultAbi,
      functionName: "redeem",
      args: [shares, address, address],
    });
  };

  return { redeem, isPending, isConfirming, isSuccess, error, hash, reset };
}
