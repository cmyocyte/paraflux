import { WAD } from "./format";

// --- Protocol constants ---
export const MAINTENANCE_MARGIN_BPS = 1500n; // 15%
export const MAINTENANCE_RATE = 0.15;
export const NORM_NUM = 100; // index = S^2 / NORM; matches Types.sol NORM = 100

/** WAD multiplication: (a * b) / 1e18 */
export function mulWad(a: bigint, b: bigint): bigint {
  return (a * b) / WAD;
}

/** WAD division: (a * 1e18) / b */
export function divWad(a: bigint, b: bigint): bigint {
  if (b === 0n) return 0n;
  return (a * WAD) / b;
}

/**
 * Estimate the total fee for a trade (base + impact).
 * All values in WAD.
 *
 * totalFee = notional * tradingFee + impactCoefficient * notional^2 / totalAssets
 */
export function estimateFee(
  notional: bigint,
  tradingFee: bigint,
  impactCoefficient: bigint,
  totalAssets: bigint
): { baseFee: bigint; impactFee: bigint; totalFee: bigint } {
  const baseFee = mulWad(notional, tradingFee);

  let impactFee = 0n;
  if (impactCoefficient > 0n && totalAssets > 0n) {
    const impactRate = mulWad(impactCoefficient, divWad(notional, totalAssets));
    impactFee = mulWad(notional, impactRate);
  }

  return { baseFee, impactFee, totalFee: baseFee + impactFee };
}

/**
 * Compute effective leverage from position params.
 * leverage = notional / collateral (both in WAD).
 */
export function computeLeverage(notional: bigint, collateral: bigint): number {
  if (collateral === 0n) return 0;
  return Number(notional) / Number(collateral);
}

// --- Liquidation ---

/**
 * Compute the power-index level at which a position gets liquidated.
 * All inputs are human-readable numbers (not WAD).
 *
 * Long:  liqIndex = (size * entryIndex + fundingOwed - collateral) / (size * (1 - 0.15))
 * Short: liqIndex = (collateral + size * entryIndex - fundingOwed) / (size * (1 + 0.15))
 */
export function computeLiquidationIndex(
  size: number,
  entryIndex: number,
  collateral: number,
  fundingOwed: number,
  isLong: boolean
): number {
  if (size <= 0) return 0;
  if (isLong) {
    const numerator = size * entryIndex + fundingOwed - collateral;
    const denominator = size * (1 - MAINTENANCE_RATE);
    return denominator > 0 ? Math.max(0, numerator / denominator) : 0;
  } else {
    const numerator = collateral + size * entryIndex - fundingOwed;
    const denominator = size * (1 + MAINTENANCE_RATE);
    return denominator > 0 ? Math.max(0, numerator / denominator) : 0;
  }
}

/** Convert a power index value to HYPE spot price: S = sqrt(index * NORM) */
export function indexToSpot(index: number): number {
  return index > 0 ? Math.sqrt(index * NORM_NUM) : 0;
}

/** Convert a HYPE spot price to power index: index = S^2 / NORM */
export function spotToIndex(spot: number): number {
  return (spot * spot) / NORM_NUM;
}

// --- Funding ---

/**
 * Compute funding owed for a position.
 * Inputs are WAD bigints; returns a human-readable number.
 * Positive = position owes funding, negative = receives funding.
 */
export function computeFundingOwed(
  size: bigint,
  entryFundingAccum: bigint,
  currentCumFunding: bigint,
  isLong: boolean
): number {
  const delta = currentCumFunding - entryFundingAccum;
  const absDelta = delta < 0n ? -delta : delta;
  const raw = mulWad(size, absDelta);
  const value = Number(raw) / 1e18;
  // Positive delta → longs owe, shorts receive
  if (isLong) {
    return delta > 0n ? value : -value;
  } else {
    return delta > 0n ? -value : value;
  }
}

// --- Health / Margin ---

/**
 * Compute remaining margin, maintenance required, and margin ratio.
 * marginRatio > 1.0 = healthy, <= 1.0 = liquidatable.
 */
export function computeHealth(
  collateral: number,
  unrealizedPnL: number,
  fundingOwed: number,
  size: number,
  currentIndex: number
): {
  remainingMargin: number;
  maintenanceRequired: number;
  marginRatio: number;
  isHealthy: boolean;
} {
  const remainingMargin = collateral + unrealizedPnL - fundingOwed;
  const maintenanceRequired = size * currentIndex * MAINTENANCE_RATE;
  const marginRatio =
    maintenanceRequired > 0 ? remainingMargin / maintenanceRequired : Infinity;
  return {
    remainingMargin,
    maintenanceRequired,
    marginRatio,
    isHealthy: marginRatio > 1.0,
  };
}

// --- Payoff curve ---

/**
 * Generate payoff curve data points for S² visualization.
 * Returns array of { spot, pnl } over a range of spot prices.
 */
export function generatePayoffCurve(
  size: number,
  entryIndex: number,
  isLong: boolean,
  spotCenter: number,
  points: number = 100
): { spot: number; pnl: number }[] {
  const result: { spot: number; pnl: number }[] = [];
  const spotMin = spotCenter * 0.5;
  const spotMax = spotCenter * 1.5;
  const step = (spotMax - spotMin) / points;

  for (let i = 0; i <= points; i++) {
    const spot = spotMin + i * step;
    const index = spotToIndex(spot);
    const pnl = isLong
      ? size * (index - entryIndex)
      : size * (entryIndex - index);
    result.push({ spot, pnl });
  }
  return result;
}
