const EXPLORER_URL: Record<number, string> = {
  999: "https://hyperscan.xyz",
  998: "https://testnet.purrsec.com",
};

const DEFAULT_CHAIN = 998;

export function getTxUrl(hash: string, chainId?: number): string {
  const base = EXPLORER_URL[chainId ?? DEFAULT_CHAIN] ?? EXPLORER_URL[DEFAULT_CHAIN];
  return `${base}/tx/${hash}`;
}

export function getExplorerBase(chainId?: number): string {
  return EXPLORER_URL[chainId ?? DEFAULT_CHAIN] ?? EXPLORER_URL[DEFAULT_CHAIN];
}
