import { defineChain } from "viem";
import { createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";

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

export const config = createConfig({
  chains: [hyperEVM, hyperEVMTestnet],
  connectors: [injected()],
  batch: { multicall: true },
  transports: {
    [hyperEVM.id]: http(undefined, {
      retryCount: 3,
      retryDelay: 1000,
      batch: { batchSize: 50, wait: 500 },
    }),
    [hyperEVMTestnet.id]: http(undefined, {
      retryCount: 3,
      retryDelay: 1000,
      batch: { batchSize: 50, wait: 500 },
    }),
  },
  ssr: true,
});
