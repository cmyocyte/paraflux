import { defineChain } from "viem";
import { http, fallback } from "wagmi";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";

const httpOpts = {
  retryCount: 4,
  retryDelay: 1500,
  batch: { batchSize: 30, wait: 500 } as const,
};

export const hyperEVM = defineChain({
  id: 999,
  name: "HyperEVM",
  nativeCurrency: { name: "HYPE", symbol: "HYPE", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.hyperliquid.xyz/evm"] },
  },
  blockExplorers: {
    default: { name: "HyperScan", url: "https://hyperscan.xyz" },
  },
});

export const hyperEVMTestnet = defineChain({
  id: 998,
  name: "HyperEVM Testnet",
  nativeCurrency: { name: "HYPE", symbol: "HYPE", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.hyperliquid-testnet.xyz/evm"] },
  },
  blockExplorers: {
    default: { name: "Purrsec", url: "https://testnet.purrsec.com" },
  },
  testnet: true,
});

// Alchemy endpoint (free tier: 30M CU/month)
// Set NEXT_PUBLIC_ALCHEMY_API_KEY in .env.local to enable
const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

// Testnet: fallback across multiple public RPCs + optional Alchemy
// If one RPC is rate-limited, viem automatically tries the next
const testnetTransports = [
  ...(alchemyKey
    ? [http(`https://hyperliquid-testnet.g.alchemy.com/v2/${alchemyKey}`, httpOpts)]
    : []),
  http("https://rpc.hyperliquid-testnet.xyz/evm", httpOpts),
  http("https://api.hyperliquid-testnet.xyz/evm", httpOpts),
  http("https://rpcs.chain.link/hyperevm/testnet", httpOpts),
];

// Mainnet: Alchemy primary + public fallback
const mainnetTransports = [
  ...(alchemyKey
    ? [http(`https://hyperliquid-mainnet.g.alchemy.com/v2/${alchemyKey}`, httpOpts)]
    : []),
  http("https://rpc.hyperliquid.xyz/evm", httpOpts),
];

export const config = getDefaultConfig({
  appName: "Paraflux",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "PLACEHOLDER",
  chains: [hyperEVMTestnet, hyperEVM],
  transports: {
    [hyperEVMTestnet.id]: fallback(testnetTransports, { rank: true }),
    [hyperEVM.id]: fallback(mainnetTransports, { rank: true }),
  },
  ssr: true,
});
