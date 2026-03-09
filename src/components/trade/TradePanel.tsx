"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useAccount, useChainId, useReadContract } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useCurrentIndex } from "@/hooks/useOracle";
import { useOpenLong, useOpenShort } from "@/hooks/useTrade";
import { useUSDCApproval } from "@/hooks/useUSDCApproval";
import { usePosition } from "@/hooks/usePosition";
import { CONTRACTS } from "@/config/contracts";
import { numberToWad, numberToUsdc, wadToNumber, formatUsd } from "@/lib/format";
import { estimateFee } from "@/lib/math";
import { routerAbi } from "@/lib/abi/PowerPerpRouter";
import { lpVaultAbi } from "@/lib/abi/LPVault";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { OrderSummary } from "./OrderSummary";
import { PayoffCurve } from "./PayoffCurve";
import { useTradeHistoryContext } from "@/context/TradeHistoryContext";
import { WrongNetworkBanner } from "@/components/ui/WrongNetworkBanner";
import { EXPECTED_CHAIN_ID } from "@/config/contracts";
import { clsx } from "clsx";

/** Extract a human-readable revert reason from a wagmi/viem error. */
function extractErrorMessage(error: Error | null): string | null {
  if (!error) return null;
  const msg = error.message ?? String(error);
  // Viem wraps revert reasons like: "... reverted with the following reason: XYZ"
  const revertMatch = msg.match(/reason:\s*(.+?)(?:\n|$)/i);
  if (revertMatch) return revertMatch[1].trim();
  // Custom error names like "FeeExceedsCollateral()"
  const customMatch = msg.match(/reverted with custom error '([^']+)'/);
  if (customMatch) return customMatch[1];
  // User rejected
  if (msg.includes("User rejected") || msg.includes("user rejected"))
    return "Transaction rejected";
  // Gas estimation
  if (msg.includes("gas") && msg.includes("exceeds"))
    return "Transaction would revert (gas estimation failed)";
  // Truncate long messages
  if (msg.length > 120) return msg.slice(0, 120) + "...";
  return msg;
}

const DEMO_INDEX = 600;
const SIZE_PCTS = [25, 50, 75, 100] as const;
const LEVERAGE_OPTIONS = [1, 2, 3] as const;
const SLIPPAGE_OPTIONS = [0.1, 0.5, 1.0] as const;

export function TradePanel() {
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const { data: currentIndex } = useCurrentIndex();
  const { data: longPos, refetch: refetchLong } = usePosition(true);
  const { data: shortPos, refetch: refetchShort } = usePosition(false);

  const [isLong, setIsLong] = useState(true);
  const [sizeInput, setSizeInput] = useState("");
  const [leverageInput, setLeverageInput] = useState("1");
  const [slippageInput, setSlippageInput] = useState("0.5");
  const [txStatus, setTxStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const {
    openLong,
    isPending: isOpeningLong,
    isConfirming: isConfirmingLong,
    isSuccess: isLongSuccess,
    error: longError,
    hash: longHash,
    reset: resetLong,
  } = useOpenLong();
  const {
    openShort,
    isPending: isOpeningShort,
    isConfirming: isConfirmingShort,
    isSuccess: isShortSuccess,
    error: shortError,
    hash: shortHash,
    reset: resetShort,
  } = useOpenShort();

  const {
    approve,
    needsApproval,
    isApproving,
    approveError,
    balance: usdcBalance,
    refetch: refetchBalance,
  } = useUSDCApproval(CONTRACTS.router);

  const { recordTrade } = useTradeHistoryContext();

  // Fee parameters for collateral calculation
  const { data: tradingFee } = useReadContract({
    address: CONTRACTS.router,
    abi: routerAbi,
    functionName: "tradingFee",
  });
  const { data: impactCoefficient } = useReadContract({
    address: CONTRACTS.router,
    abi: routerAbi,
    functionName: "impactCoefficient",
  });
  const { data: totalAssets } = useReadContract({
    address: CONTRACTS.lpVault,
    abi: lpVaultAbi,
    functionName: "totalAssets",
  });

  // Show errors from trade or approve hooks
  const tradeError = isLong ? longError : shortError;
  useEffect(() => {
    const error = tradeError || approveError;
    if (error) {
      setTxStatus({
        type: "error",
        message: extractErrorMessage(error) ?? "Transaction failed",
      });
    }
  }, [tradeError, approveError]);

  // Refetch data + show success after trade confirms
  const tradeSuccess = isLong ? isLongSuccess : isShortSuccess;
  const tradeHash = isLong ? longHash : shortHash;
  useEffect(() => {
    if (tradeSuccess && tradeHash) {
      setTxStatus({ type: "success", message: "Position opened!" });
      refetchLong();
      refetchShort();
      refetchBalance();
      setSizeInput("");
      recordTrade(tradeHash);
      // Auto-clear success message after 5s
      const timer = setTimeout(() => setTxStatus(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [tradeSuccess, tradeHash, refetchLong, refetchShort, refetchBalance, recordTrade]);

  // Reset stale mutation state when wallet changes
  useEffect(() => {
    resetLong();
    resetShort();
    setTxStatus(null);
    setSizeInput("");
  }, [address, resetLong, resetShort]);

  const size = parseFloat(sizeInput) || 0;
  const leverage = parseFloat(leverageInput) || 0;
  const indexValue = currentIndex ? wadToNumber(currentIndex) : DEMO_INDEX;
  const notional = size * indexValue;
  const collateral = leverage > 0 ? notional / leverage : 0;
  const bal = usdcBalance !== undefined ? Number(usdcBalance) / 1e6 : 0;

  const notionalWad = useMemo(
    () => (size > 0 && indexValue > 0 ? numberToWad(notional) : 0n),
    [size, indexValue, notional]
  );

  // Estimate fee and add it on top of margin so post-fee collateral satisfies leverage check
  const estimatedFeeNum = useMemo(() => {
    if (!tradingFee || !impactCoefficient || !totalAssets || notionalWad === 0n) return 0;
    const totalAssetsWad = totalAssets * 10n ** 12n;
    const { totalFee } = estimateFee(notionalWad, tradingFee, impactCoefficient, totalAssetsWad);
    return wadToNumber(totalFee);
  }, [notionalWad, tradingFee, impactCoefficient, totalAssets]);

  // Send margin + fee so Router can deduct fee and still have full margin
  const usdcAmount = numberToUsdc(collateral + estimatedFeeNum);
  const requiresApproval = needsApproval(usdcAmount);

  const isOpening = isLong
    ? isOpeningLong || isConfirmingLong
    : isOpeningShort || isConfirmingShort;

  const canTrade =
    size > 0 && collateral > 0 && leverage <= 3 && leverage > 0;
  const insufficientBalance = collateral + estimatedFeeNum > bal && bal > 0;

  // Current size as % of max affordable at this leverage
  const maxSize =
    bal > 0 && leverage > 0 && indexValue > 0
      ? (bal * leverage) / indexValue
      : 0;
  const sizePct = maxSize > 0 ? Math.min(100, (size / maxSize) * 100) : 0;

  // Fill size from % of balance at current leverage
  const fillSize = useCallback(
    (pct: number) => {
      if (bal <= 0 || leverage <= 0 || indexValue <= 0) return;
      const maxCollateral = (bal * pct) / 100;
      const maxSize = (maxCollateral * leverage) / indexValue;
      setSizeInput(maxSize.toFixed(4));
    },
    [bal, leverage, indexValue]
  );

  // Account summary data
  const hasLong = longPos && longPos.size > 0n;
  const hasShort = shortPos && shortPos.size > 0n;
  const positionCount = (hasLong ? 1 : 0) + (hasShort ? 1 : 0);
  const marginUsed =
    (hasLong ? wadToNumber(longPos!.collateral) : 0) +
    (hasShort ? wadToNumber(shortPos!.collateral) : 0);

  const handleSubmit = () => {
    if (!canTrade) return;
    setTxStatus(null); // Clear previous status

    const sizeWad = numberToWad(size);
    const deadline = BigInt(Math.floor(Date.now() / 1000) + 300);
    const slippage = parseFloat(slippageInput) || 0.5;
    const slippageFraction = slippage / 100;

    if (isLong) {
      // Longs: slippageLimit is a ceiling — reject if index rises above tolerance
      const slippageLimit = numberToWad(indexValue * (1 + slippageFraction));
      openLong(sizeWad, usdcAmount, slippageLimit, deadline);
    } else {
      // Shorts: slippageLimit is a floor — reject if index drops below tolerance
      const slippageLimit = numberToWad(indexValue * (1 - slippageFraction));
      openShort(sizeWad, usdcAmount, slippageLimit, deadline);
    }
  };

  return (
    <div className="h-full rounded border border-[#21262d] bg-[#0f1216] p-3">
      {/* Side selector */}
      <div className="flex gap-1.5">
        <button
          className={clsx(
            "flex-1 rounded py-1.5 text-xs font-semibold transition-all",
            isLong
              ? "bg-[#22c55e] text-[#0b0e11]"
              : "bg-[#161b22] text-zinc-500 hover:bg-[#21262d] hover:text-[#22c55e]/70"
          )}
          onClick={() => setIsLong(true)}
        >
          Long
        </button>
        <button
          className={clsx(
            "flex-1 rounded py-1.5 text-xs font-semibold transition-all",
            !isLong
              ? "bg-red-600 text-white"
              : "bg-[#161b22] text-zinc-500 hover:bg-[#21262d] hover:text-red-400/70"
          )}
          onClick={() => setIsLong(false)}
        >
          Short
        </button>
      </div>

      {/* Inputs */}
      <div className="mt-2 space-y-1.5">
        {/* Leverage */}
        <div>
          <Input
            label="Leverage"
            type="number"
            placeholder="1"
            suffix="x"
            value={leverageInput}
            onChange={(e) => setLeverageInput(e.target.value)}
            error={leverage > 3 ? "Max 3x" : undefined}
          />
          <div className="mt-1 flex items-center gap-1">
            {LEVERAGE_OPTIONS.map((lev) => (
              <button
                key={lev}
                onClick={() => setLeverageInput(String(lev))}
                className={clsx(
                  "rounded px-1.5 py-0.5 text-[10px] font-bold transition-colors",
                  leverage > 0 && Math.abs(leverage - lev) < 0.15
                    ? "bg-[#22c55e]/10 text-[#22c55e]"
                    : "text-zinc-600 hover:text-zinc-400"
                )}
              >
                {lev}x
              </button>
            ))}
          </div>
        </div>

        {/* Size */}
        <div>
          <Input
            label="Size"
            type="number"
            placeholder="0.0"
            suffix="units"
            value={sizeInput}
            onChange={(e) => setSizeInput(e.target.value)}
          />
          {/* Size slider + % dots */}
          {leverage > 0 && indexValue > 0 && (
            <div className="mt-1.5 space-y-1">
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={Math.round(sizePct)}
                  onChange={(e) => fillSize(Number(e.target.value))}
                  className="size-slider h-1 flex-1 cursor-pointer appearance-none rounded-full bg-[#21262d] accent-[#22c55e]"
                />
                <span className="w-8 text-right font-mono text-[10px] text-zinc-500">
                  {Math.round(sizePct)}%
                </span>
              </div>
              <div className="flex items-center justify-end gap-1">
                {SIZE_PCTS.map((pct) => (
                  <button
                    key={pct}
                    onClick={() => fillSize(pct)}
                    className={clsx(
                      "rounded px-1 py-0.5 text-[9px] font-bold transition-colors",
                      Math.abs(sizePct - pct) < 2
                        ? "bg-[#22c55e]/10 text-[#22c55e]"
                        : "text-zinc-600 hover:text-zinc-400"
                    )}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Slippage tolerance */}
      <div className="mt-1.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">
            Slippage
          </span>
          <div className="flex items-center gap-1">
            {SLIPPAGE_OPTIONS.map((pct) => (
              <button
                key={pct}
                onClick={() => setSlippageInput(String(pct))}
                className={clsx(
                  "rounded px-1.5 py-0.5 text-[10px] font-bold transition-colors",
                  Math.abs((parseFloat(slippageInput) || 0.5) - pct) < 0.01
                    ? "bg-[#22c55e]/10 text-[#22c55e]"
                    : "text-zinc-600 hover:text-zinc-400"
                )}
              >
                {pct}%
              </button>
            ))}
            <input
              type="number"
              step="0.1"
              min="0.01"
              max="10"
              value={slippageInput}
              onChange={(e) => setSlippageInput(e.target.value)}
              className="w-12 rounded bg-[#161b22] px-1 py-0.5 text-right font-mono text-[10px] text-[#e1e4e8] outline-none focus:ring-1 focus:ring-[#22c55e]/30"
            />
            <span className="text-[10px] text-zinc-600">%</span>
          </div>
        </div>
      </div>

      {/* Margin required */}
      {size > 0 && leverage > 0 && (
        <div className="mt-1.5 flex items-baseline justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">
            Margin Required
          </span>
          <span
            className={clsx(
              "font-mono text-xs",
              insufficientBalance ? "text-red-400" : "text-[#e1e4e8]"
            )}
          >
            {formatUsd(collateral)} USDC
          </span>
        </div>
      )}

      {/* Action button */}
      <div className="mt-2">
        {!isConnected ? (
          <div className="flex justify-center">
            <ConnectButton />
          </div>
        ) : chainId !== EXPECTED_CHAIN_ID ? (
          <WrongNetworkBanner />
        ) : requiresApproval ? (
          <Button
            className="w-full"
            onClick={approve}
            loading={isApproving}
          >
            Approve USDC
          </Button>
        ) : (
          <Button
            className="w-full"
            variant={isLong ? "primary" : "danger"}
            onClick={handleSubmit}
            loading={isOpening}
            disabled={!canTrade}
          >
            {insufficientBalance
              ? "Insufficient Balance"
              : isLong
                ? "Open Long"
                : "Open Short"}
          </Button>
        )}
      </div>

      {/* Transaction status */}
      {txStatus && (
        <div
          className={clsx(
            "mt-2 rounded px-2 py-1.5 text-xs",
            txStatus.type === "success"
              ? "bg-[#22c55e]/10 text-[#22c55e]"
              : "bg-red-500/10 text-red-400"
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <span>{txStatus.message}</span>
            <button
              onClick={() => setTxStatus(null)}
              className="text-zinc-500 hover:text-zinc-300"
            >
              &times;
            </button>
          </div>
          {txStatus.type === "success" && tradeHash && (
            <a
              href={`${chainId === 999 ? "https://hyperscan.xyz" : "https://testnet.purrsec.com"}/tx/${tradeHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-0.5 block text-[10px] text-zinc-500 hover:text-zinc-400"
            >
              View on explorer
            </a>
          )}
        </div>
      )}

      {/* Account summary */}
      <div className="mt-2 space-y-0.5 border-t border-[#21262d] pt-2">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">
            Balance
          </span>
          <span className="font-mono text-xs text-[#e1e4e8]">
            {usdcBalance !== undefined ? formatUsd(bal) : "\u2014"}
          </span>
        </div>
        {positionCount > 0 && (
          <>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                Positions
              </span>
              <span className="font-mono text-xs text-[#e1e4e8]">
                {hasLong && hasShort
                  ? "1 long, 1 short"
                  : hasLong
                    ? "1 long"
                    : "1 short"}
              </span>
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                Margin Used
              </span>
              <span className="font-mono text-xs text-[#e1e4e8]">
                {formatUsd(marginUsed)}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Order preview with liq price + fees */}
      <div className="mt-2">
        <OrderSummary
          size={size}
          collateral={collateral}
          isLong={isLong}
          notionalWad={notionalWad}
        />
      </div>

      {/* Payoff curve */}
      <div className="mt-2">
        <PayoffCurve size={size || 1} isLong={isLong} collateral={collateral} />
      </div>
    </div>
  );
}
