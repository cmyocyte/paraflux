export const positionEngineAbi = [
  {
    name: "getPosition",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "trader", type: "address" },
      { name: "isLong", type: "bool" },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "size", type: "uint256" },
          { name: "entryIndex", type: "uint256" },
          { name: "collateral", type: "uint256" },
          { name: "entryFundingAccum", type: "int256" },
          { name: "side", type: "uint8" },
          { name: "lastInteraction", type: "uint48" },
        ],
      },
    ],
  },
  {
    name: "longOpenInterest",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "shortOpenInterest",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "totalPositions",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;
