import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics | Paraflux",
  description: "Protocol analytics: volume, fees, open interest, and liquidations.",
};

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
