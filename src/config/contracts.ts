const ZERO = "0x0000000000000000000000000000000000000000" as `0x${string}`;

export const CONTRACTS = {
  router: (process.env.NEXT_PUBLIC_ROUTER_ADDRESS ?? ZERO) as `0x${string}`,
  oracle: (process.env.NEXT_PUBLIC_ORACLE_ADDRESS ?? ZERO) as `0x${string}`,
  fundingEngine: (process.env.NEXT_PUBLIC_FUNDING_ENGINE_ADDRESS ??
    ZERO) as `0x${string}`,
  positionEngine: (process.env.NEXT_PUBLIC_POSITION_ENGINE_ADDRESS ??
    ZERO) as `0x${string}`,
  lpVault: (process.env.NEXT_PUBLIC_LP_VAULT_ADDRESS ?? ZERO) as `0x${string}`,
  liquidationEngine: (process.env.NEXT_PUBLIC_LIQUIDATION_ENGINE_ADDRESS ??
    ZERO) as `0x${string}`,
  usdc: (process.env.NEXT_PUBLIC_USDC_ADDRESS ?? ZERO) as `0x${string}`,
  insuranceFund: (process.env.NEXT_PUBLIC_INSURANCE_FUND_ADDRESS ??
    ZERO) as `0x${string}`,
  anchorVault: (process.env.NEXT_PUBLIC_ANCHOR_VAULT_ADDRESS ??
    ZERO) as `0x${string}`,
  surgeVault: (process.env.NEXT_PUBLIC_SURGE_VAULT_ADDRESS ??
    ZERO) as `0x${string}`,
  volOracle: (process.env.NEXT_PUBLIC_VOL_ORACLE_ADDRESS ??
    ZERO) as `0x${string}`,
} as const;

/** Chain ID where the contracts are deployed (998 = testnet, 999 = mainnet). */
export const EXPECTED_CHAIN_ID = 998;
