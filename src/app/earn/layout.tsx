import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Earn | Paraflux",
  description: "Deposit USDC to earn yield from trading fees and structured strategies.",
};

export default function EarnLayout({ children }: { children: React.ReactNode }) {
  return children;
}
