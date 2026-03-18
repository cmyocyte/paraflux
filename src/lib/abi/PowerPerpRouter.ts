export const routerAbi = [
  // ── Write functions ──
  {
    name: "openLong",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "size", type: "uint256" },
      { name: "usdcAmount", type: "uint256" },
      { name: "slippageLimit", type: "uint256" },
      { name: "deadline", type: "uint256" },
      { name: "integrator", type: "address" },
    ],
    outputs: [],
  },
  {
    name: "openShort",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "size", type: "uint256" },
      { name: "usdcAmount", type: "uint256" },
      { name: "slippageLimit", type: "uint256" },
      { name: "deadline", type: "uint256" },
      { name: "integrator", type: "address" },
    ],
    outputs: [],
  },
  {
    name: "closePosition",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "isLong", type: "bool" },
      { name: "minPayout", type: "uint256" },
      { name: "deadline", type: "uint256" },
    ],
    outputs: [],
  },
  {
    name: "addCollateral",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "isLong", type: "bool" },
      { name: "usdcAmount", type: "uint256" },
    ],
    outputs: [],
  },
  // ── Read functions ──
  {
    name: "tradingFee",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "impactCoefficient",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "protocolFeeBps",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  // ── Events ──
  {
    name: "LongOpened",
    type: "event",
    inputs: [
      { name: "trader", type: "address", indexed: true },
      { name: "size", type: "uint256", indexed: false },
      { name: "collateral", type: "uint256", indexed: false },
      { name: "entryIndex", type: "uint256", indexed: false },
    ],
  },
  {
    name: "ShortOpened",
    type: "event",
    inputs: [
      { name: "trader", type: "address", indexed: true },
      { name: "size", type: "uint256", indexed: false },
      { name: "collateral", type: "uint256", indexed: false },
      { name: "entryIndex", type: "uint256", indexed: false },
    ],
  },
  {
    name: "PositionClosed",
    type: "event",
    inputs: [
      { name: "trader", type: "address", indexed: true },
      { name: "isLong", type: "bool", indexed: true },
      { name: "netPnL", type: "int256", indexed: false },
      { name: "payout", type: "uint256", indexed: false },
    ],
  },
  {
    name: "CollateralAdded",
    type: "event",
    inputs: [
      { name: "trader", type: "address", indexed: true },
      { name: "isLong", type: "bool", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
  {
    name: "CollateralRemoved",
    type: "event",
    inputs: [
      { name: "trader", type: "address", indexed: true },
      { name: "isLong", type: "bool", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
  // ── Errors ──
  {
    name: "SlippageExceeded",
    type: "error",
    inputs: [
      { name: "actual", type: "uint256" },
      { name: "limit", type: "uint256" },
    ],
  },
  {
    name: "FeeExceedsCollateral",
    type: "error",
    inputs: [],
  },
  {
    name: "DeadlineExpired",
    type: "error",
    inputs: [],
  },
] as const;
