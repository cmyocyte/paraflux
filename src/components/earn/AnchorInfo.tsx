"use client";

import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/Card";

const FAQ = [
  {
    q: "What is the Anchor strategy?",
    a: "The Anchor vault shorts HYPE^2 power perps to earn sigma^2 funding while staying delta-neutral. You earn yield without directional exposure to HYPE's price.",
  },
  {
    q: "How does rebalancing work?",
    a: "When the vault's delta drifts beyond the threshold (10%), anyone can call rebalance. The vault closes its short and re-opens at the target size to restore delta-neutrality.",
  },
  {
    q: "What are the risks?",
    a: "Large sudden price moves between rebalances can cause losses. The vault also pays trading fees on each rebalance (2x fees due to the close + re-open pattern). In sustained trending markets, rebalance losses can exceed funding income.",
  },
  {
    q: "How is this different from the LP vault?",
    a: "The LP vault earns fees from all trades but has exposure to trader P&L. The Anchor vault earns only funding income but stays delta-neutral — it doesn't care which direction HYPE moves, as long as it doesn't move too fast.",
  },
];

export function AnchorInfo() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <Card>
      <CardTitle>About Anchor Strategy</CardTitle>

      <p className="mt-3 text-sm text-zinc-400">
        Delta-neutral yield from power perp funding. Deposit USDC, the vault
        handles the rest.
      </p>

      <div className="mt-4 space-y-2">
        {FAQ.map((item, i) => (
          <div key={i} className="border-b border-[#21262d] pb-2">
            <button
              className="flex w-full items-center justify-between py-2 text-left text-sm font-medium text-[#e1e4e8] hover:text-[#22c55e]"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            >
              {item.q}
              <span
                className="ml-2 text-zinc-500 transition-transform"
                style={{
                  transform: openIndex === i ? "rotate(180deg)" : "rotate(0deg)",
                }}
              >
                ▾
              </span>
            </button>
            {openIndex === i && (
              <p className="pb-2 text-sm text-zinc-400">{item.a}</p>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
