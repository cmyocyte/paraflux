"use client";

import { useTotalAssets } from "@/hooks/useVault";
import { useOpenInterest } from "@/hooks/useOpenInterest";
import { useCurrentFundingRate } from "@/hooks/useFunding";
import { usdcToNumber, wadToNumber, SECONDS_PER_YEAR } from "@/lib/format";

/** LP receives 75% of fees (80% to vault after 20% protocol cut, minus 5% insurance from LP portion) */
const LP_FEE_SHARE = 0.75;

export function useEstimatedApy() {
  const { data: totalAssets } = useTotalAssets();
  const { longOI, shortOI } = useOpenInterest();
  const { data: fundingRate } = useCurrentFundingRate(longOI, shortOI);

  if (!totalAssets || longOI === undefined || shortOI === undefined || fundingRate === undefined) {
    return { apy: undefined, isLoading: true };
  }

  const tvl = usdcToNumber(totalAssets);
  const totalOI = wadToNumber(longOI) + wadToNumber(shortOI);
  const annualizedRate = Number(fundingRate * SECONDS_PER_YEAR) / 1e18;

  const apy = tvl > 0 ? (annualizedRate * totalOI * LP_FEE_SHARE) / tvl : 0;

  return { apy, isLoading: false };
}
