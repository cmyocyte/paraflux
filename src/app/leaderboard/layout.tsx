import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leaderboard | Paraflux",
  description: "Top traders and liquidity providers on Paraflux.",
};

export default function LeaderboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
