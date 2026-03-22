import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trade | Paraflux",
  description: "Trade the squared HYPE payoff on HyperEVM.",
};

export default function TradeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
