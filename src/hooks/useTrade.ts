"use client";

import {
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { CONTRACTS } from "@/config/contracts";
import { routerAbi } from "@/lib/abi/PowerPerpRouter";

export function useOpenLong() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({ hash });

  const openLong = (
    size: bigint,
    usdcAmount: bigint,
    slippageLimit: bigint,
    deadline: bigint
  ) => {
    writeContract({
      address: CONTRACTS.router,
      abi: routerAbi,
      functionName: "openLong",
      args: [size, usdcAmount, slippageLimit, deadline],
    });
  };

  return { openLong, isPending, isConfirming, isSuccess, error, hash, reset };
}

export function useOpenShort() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({ hash });

  const openShort = (
    size: bigint,
    usdcAmount: bigint,
    slippageLimit: bigint,
    deadline: bigint
  ) => {
    writeContract({
      address: CONTRACTS.router,
      abi: routerAbi,
      functionName: "openShort",
      args: [size, usdcAmount, slippageLimit, deadline],
    });
  };

  return { openShort, isPending, isConfirming, isSuccess, error, hash, reset };
}

export function useClosePosition() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } =
    useWaitForTransactionReceipt({ hash });

  const closePosition = (
    isLong: boolean,
    minPayout: bigint,
    deadline: bigint
  ) => {
    writeContract({
      address: CONTRACTS.router,
      abi: routerAbi,
      functionName: "closePosition",
      args: [isLong, minPayout, deadline],
    });
  };

  return { closePosition, isPending, isConfirming, isSuccess, error, hash, reset };
}
