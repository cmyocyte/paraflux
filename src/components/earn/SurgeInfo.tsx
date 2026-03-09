"use client";

import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/Card";

const FAQ = [
  {
    q: "What is the Surge strategy?",
    a: "Surge combines two positions: a delta-neutral Anchor strategy (short HYPE^2) that earns sigma^2 funding, and a leveraged long HYPE position via CoreWriter. The net result is approximately 1x long HYPE exposure with funding yield on top.",
  },
  {
    q: "How are deposits split?",
    a: "Roughly 50% of your USDC is deposited into the Anchor vault to earn funding income from the short power perp position. The other 50% is used as margin for a leveraged long HYPE position on Hyperliquid's native perp via CoreWriter.",
  },
  {
    q: "How does rebalancing work?",
    a: "A keeper monitors the Anchor allocation ratio. When the Anchor delta drifts beyond the threshold, the keeper triggers a rebalance to restore the target allocation between the Anchor position and the long leg.",
  },
  {
    q: "What are the risks?",
    a: "Directional risk: the long HYPE leg has full exposure to HYPE price movements. Funding costs: the long perp position pays funding when rates are positive. Rebalance slippage: large price moves between rebalances can cause losses. Smart contract risk: the vault interacts with multiple contracts including AnchorVault and CoreWriter.",
  },
  {
    q: "How is this different from just holding HYPE?",
    a: "Surge gives you similar directional exposure (~1x long) but adds funding yield from the Anchor component. In range-bound or mildly bullish markets, Surge outperforms a simple long position thanks to the sigma^2 funding earned by the Anchor leg.",
  },
  {
    q: "How is this different from the Anchor vault?",
    a: "The Anchor vault is delta-neutral — it earns funding yield with no directional exposure. Surge adds a leveraged long on top, giving you bullish exposure plus funding income. Anchor is for earning yield in sideways markets; Surge is for earning yield while staying long.",
  },
];

export function SurgeInfo() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <Card>
      <CardTitle>About Surge Strategy</CardTitle>

      <p className="mt-3 text-sm text-zinc-400">
        Surge = Anchor + Long HYPE. Earn sigma^2 funding yield while
        maintaining ~1x long HYPE exposure. Deposit USDC, the vault handles the
        rest.
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
