export const liquidationEngineAbi = [
  {
    name: "PositionLiquidated",
    type: "event",
    inputs: [
      { name: "trader", type: "address", indexed: true },
      { name: "liquidator", type: "address", indexed: true },
      { name: "isLong", type: "bool", indexed: true },
      { name: "size", type: "uint256", indexed: false },
      { name: "indexAtLiquidation", type: "uint256", indexed: false },
      { name: "liquidatorReward", type: "uint256", indexed: false },
      { name: "badDebt", type: "uint256", indexed: false },
    ],
  },
] as const;
