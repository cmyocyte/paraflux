export const WAD = 10n ** 18n;
export const USDC_DECIMALS = 6;
export const USDC_UNIT = 10n ** 6n;
export const SECONDS_PER_YEAR = 31_557_600n;

/** Convert a WAD-scaled bigint to a JavaScript number. */
export function wadToNumber(wad: bigint): number {
  return Number(wad) / 1e18;
}

/** Convert a 6-decimal USDC bigint to a JavaScript number. */
export function usdcToNumber(usdc: bigint): number {
  return Number(usdc) / 1e6;
}

/** Convert a human-readable number to WAD bigint. */
export function numberToWad(n: number): bigint {
  return BigInt(Math.round(n * 1e18));
}

/** Convert a human-readable USD number to 6-decimal USDC bigint. */
export function numberToUsdc(n: number): bigint {
  return BigInt(Math.round(n * 1e6));
}

/** Format a number as USD currency string. */
export function formatUsd(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

/** Format a compact number (e.g. $1.2M, $340K). */
export function formatCompact(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

/** Format a WAD-per-second funding rate as annualized percentage. */
export function formatFundingRate(wadPerSecond: bigint): string {
  const annualized =
    Number(wadPerSecond * SECONDS_PER_YEAR) / 1e18;
  return `${(annualized * 100).toFixed(4)}%`;
}

/** Format basis points as percentage (e.g. 10 bps → "0.10%"). */
export function formatBps(bps: number): string {
  return `${(bps / 100).toFixed(2)}%`;
}

/** Format a percentage number (e.g. 0.35 → "35.00%"). */
export function formatPercent(n: number): string {
  return `${(n * 100).toFixed(2)}%`;
}

/** Shorten an address to 0x1234...abcd format. */
export function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/** Format seconds into a human-readable countdown (e.g. "2m 34s", "45s"). */
export function formatCountdown(seconds: number): string {
  if (seconds <= 0) return "0s";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  if (m > 0) return `${m}m ${s.toString().padStart(2, "0")}s`;
  return `${s}s`;
}

/** Format a number as a spot price with $ prefix and 2 decimals. */
export function formatSpotPrice(n: number): string {
  return `$${n.toFixed(2)}`;
}
