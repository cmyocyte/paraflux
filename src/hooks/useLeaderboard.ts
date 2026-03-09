// TODO: Replace mock data with subgraph query or API call.
// Interface contract: return { data, isLoading, isError }.

import { useMemo } from "react";

export type TraderTimeframe = "7d" | "30d" | "all";

export interface TraderEntry {
  address: string;
  accountValue: number; // USD
  pnl: number; // USD, signed
  roi: number; // decimal (0.35 = 35%)
  volume: number; // USD
}

export interface LPEntry {
  address: string;
  shares: number;
  valueUsdc: number; // USD
  poolShare: number; // decimal (0.05 = 5%)
  depositTime: number; // unix timestamp
}

// ---------------------------------------------------------------------------
// Mock traders — sorted by PNL descending (all-time)
// Distribution: ~10% big winners, ~25% small winners, ~65% losers
// ---------------------------------------------------------------------------

const MOCK_TRADERS: TraderEntry[] = [
  { address: "0x87f9a1dc4bc2e8cf47e2b1eaa8c6e3b4d92ae2cf", accountValue: 475_309, pnl: 183_215, roi: 0.6214, volume: 41_981_752 },
  { address: "0xecb6d81f7a0e93b2c4f8d1a52b00e7c3d9f12b00", accountValue: 358_858, pnl: 136_441, roi: 0.5827, volume: 13_235_318 },
  { address: "0x393d8e4f1b2a7c0d5e6f9a1b3c8d2e4f7a092109", accountValue: 655_017, pnl: 124_382, roi: 0.0234, volume: 8_129_445 },
  { address: "0x5f2b8a1c3d4e9f0a7b6c2d8e4f1a5b9c3d7e4abc", accountValue: 57_158, pnl: 113_024, roi: 2.3748, volume: 55_448_322 },
  { address: "0x20c2e9f1a3b4d5c6e7f8a0b1c2d3e4f5a6b744f5", accountValue: 93_829, pnl: 110_120, roi: 1.4235, volume: 128_993_370 },
  { address: "0x35d1f8e2a9b4c0d1e3f5a7b2c4d6e8f0a1b3acb1", accountValue: 135_579, pnl: 91_395, roi: 0.9126, volume: 100_912_120 },
  { address: "0x0c5e9f2a1b3c4d5e6f7a8b0c1d2e3f4a5b6c3dd4", accountValue: 42_441, pnl: 58_345, roi: 2.1124, volume: 19_248_100 },
  { address: "0x418a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8888", accountValue: 61_210, pnl: 52_235, roi: 1.1853, volume: 63_507_360 },
  { address: "0x856c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a910d", accountValue: 245_408, pnl: 50_041, roi: 0.2556, volume: 936_247_754 },
  { address: "0xcac1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a726b3", accountValue: 319_059, pnl: 43_532, roi: 0.1581, volume: 69_232_156 },
  { address: "0x7a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8901", accountValue: 28_450, pnl: 4_812, roi: 0.2035, volume: 3_450_200 },
  { address: "0x2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e12", accountValue: 15_230, pnl: 2_145, roi: 0.1640, volume: 1_280_000 },
  { address: "0x9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f34", accountValue: 8_900, pnl: 890, roi: 0.1112, volume: 890_500 },
  { address: "0x4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a56", accountValue: 42_100, pnl: 420, roi: 0.0101, volume: 5_610_000 },
  { address: "0xb6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b478", accountValue: 11_500, pnl: 115, roi: 0.0101, volume: 2_300_000 },
  { address: "0xc7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c590", accountValue: 5_200, pnl: -210, roi: -0.0388, volume: 520_000 },
  { address: "0xd8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6ab", accountValue: 3_800, pnl: -580, roi: -0.1324, volume: 380_000 },
  { address: "0xe9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7cd", accountValue: 19_200, pnl: -1_920, roi: -0.0909, volume: 7_680_000 },
  { address: "0xf0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8ef", accountValue: 7_400, pnl: -2_220, roi: -0.2308, volume: 1_480_000 },
  { address: "0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a901", accountValue: 31_500, pnl: -3_150, roi: -0.0909, volume: 12_600_000 },
  { address: "0xb2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b023", accountValue: 14_800, pnl: -4_440, roi: -0.2308, volume: 2_960_000 },
  { address: "0xc3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c145", accountValue: 22_000, pnl: -5_500, roi: -0.2000, volume: 8_800_000 },
  { address: "0xd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d267", accountValue: 8_100, pnl: -6_480, roi: -0.4444, volume: 1_620_000 },
  { address: "0xe5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e389", accountValue: 45_000, pnl: -9_000, roi: -0.1667, volume: 18_000_000 },
  { address: "0xf6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4ab", accountValue: 12_300, pnl: -9_840, roi: -0.4444, volume: 2_460_000 },
  { address: "0xa7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5cd", accountValue: 67_000, pnl: -13_400, roi: -0.1667, volume: 26_800_000 },
  { address: "0xb8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6ef", accountValue: 38_200, pnl: -15_280, roi: -0.2857, volume: 15_280_000 },
  { address: "0xc9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c701", accountValue: 5_500, pnl: -4_950, roi: -0.4737, volume: 1_100_000 },
];

// ---------------------------------------------------------------------------
// Mock LP providers — sorted by poolShare descending
// ---------------------------------------------------------------------------

const now = Math.floor(Date.now() / 1000);

const MOCK_LPS: LPEntry[] = [
  { address: "0x11a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f901", shares: 482_150, valueUsdc: 503_844, poolShare: 0.1824, depositTime: now - 86400 * 78 },
  { address: "0x22b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a012", shares: 410_200, valueUsdc: 428_659, poolShare: 0.1552, depositTime: now - 86400 * 65 },
  { address: "0x33c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b123", shares: 298_000, valueUsdc: 311_410, poolShare: 0.1128, depositTime: now - 86400 * 82 },
  { address: "0x44d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c234", shares: 215_600, valueUsdc: 225_292, poolShare: 0.0816, depositTime: now - 86400 * 45 },
  { address: "0x55e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d345", shares: 188_900, valueUsdc: 197_400, poolShare: 0.0715, depositTime: now - 86400 * 30 },
  { address: "0x66f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e456", shares: 142_300, valueUsdc: 148_704, poolShare: 0.0539, depositTime: now - 86400 * 55 },
  { address: "0x77a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f567", shares: 98_500, valueUsdc: 102_932, poolShare: 0.0373, depositTime: now - 86400 * 21 },
  { address: "0x88b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a678", shares: 75_200, valueUsdc: 78_584, poolShare: 0.0285, depositTime: now - 86400 * 40 },
  { address: "0x99c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b789", shares: 61_400, valueUsdc: 64_163, poolShare: 0.0232, depositTime: now - 86400 * 12 },
  { address: "0xaad1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c890", shares: 48_900, valueUsdc: 51_100, poolShare: 0.0185, depositTime: now - 86400 * 88 },
  { address: "0xbbe2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d901", shares: 35_600, valueUsdc: 37_202, poolShare: 0.0135, depositTime: now - 86400 * 7 },
  { address: "0xccf3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9ea12", shares: 28_100, valueUsdc: 29_365, poolShare: 0.0106, depositTime: now - 86400 * 33 },
  { address: "0xdda4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0fb23", shares: 19_400, valueUsdc: 20_273, poolShare: 0.0073, depositTime: now - 86400 * 60 },
  { address: "0xeeb5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f10c34", shares: 12_800, valueUsdc: 13_376, poolShare: 0.0048, depositTime: now - 86400 * 15 },
  { address: "0xffc6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a21d45", shares: 8_500, valueUsdc: 8_883, poolShare: 0.0032, depositTime: now - 86400 * 5 },
  { address: "0x01d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b32e56", shares: 5_200, valueUsdc: 5_434, poolShare: 0.0020, depositTime: now - 86400 * 2 },
  { address: "0x02e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c43f67", shares: 3_100, valueUsdc: 3_240, poolShare: 0.0012, depositTime: now - 86400 * 1 },
  { address: "0x03f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d54078", shares: 1_200, valueUsdc: 1_254, poolShare: 0.0005, depositTime: now - 86400 * 90 },
];

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

const TIMEFRAME_SCALE: Record<TraderTimeframe, { pnl: number; volume: number }> = {
  "7d": { pnl: 0.25, volume: 0.25 },
  "30d": { pnl: 0.7, volume: 0.7 },
  all: { pnl: 1, volume: 1 },
};

export function useTraderLeaderboard(timeframe: TraderTimeframe) {
  const data = useMemo(() => {
    const scale = TIMEFRAME_SCALE[timeframe];
    return MOCK_TRADERS.map((t) => ({
      ...t,
      pnl: Math.round(t.pnl * scale.pnl),
      roi: t.roi * scale.pnl,
      volume: Math.round(t.volume * scale.volume),
    })).sort((a, b) => b.pnl - a.pnl);
  }, [timeframe]);

  return { data, isLoading: false, isError: false };
}

export function useLPLeaderboard() {
  return { data: MOCK_LPS, isLoading: false, isError: false };
}
