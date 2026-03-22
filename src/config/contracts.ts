export const CONTRACTS = {
  router: "0xBdB2ED591Da3ceb2280EDcAcADbA2B9B78025464" as `0x${string}`,
  oracle: "0x497a02257E804518A27F1b47ce7603bE7b6A8377" as `0x${string}`,
  fundingEngine: "0xbFEcdEB418d39b05Bd40F929d111d353C4cE968E" as `0x${string}`,
  positionEngine: "0xAaf9f52F39986EDE1D79a52e2022da378bA40745" as `0x${string}`,
  lpVault: "0x69bCF8694E52B81a698707aEB626aE43A25FF5D4" as `0x${string}`,
  liquidationEngine: "0xc719479FDE4d5F80186aD7de128b5e410c3551B0" as `0x${string}`,
  usdc: "0xB55ce2841be1acD5F2D613E882715E10e3431faB" as `0x${string}`,
  insuranceFund: "0xB143b6cf58024E00C39aB02A0921f25d540C48D4" as `0x${string}`,
  anchorVault: "0xB694517F86311052f97F66B022F85D518aae2baa" as `0x${string}`,
  surgeVault: "0x876c95ac69E280788B81A815e03b9CFB3e2c6a24" as `0x${string}`,
  volOracle: "0xbad0c8c6C56eBc54Cc9005AA2805548A482C7c34" as `0x${string}`,
} as const;

/** Chain ID where the contracts are deployed (998 = testnet, 999 = mainnet). */
export const EXPECTED_CHAIN_ID = 998;
