"use client";

import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/Card";
import { clsx } from "clsx";

const FAQ_ITEMS = [
  {
    question: "How do I earn yield?",
    answer:
      "The vault collects 75% of all trading fees. When traders open, close, or get liquidated, fees flow into the vault, increasing the value of your LP shares. You also earn from the funding rate when longs pay shorts (the majority of the time in bullish markets).",
  },
  {
    question: "What are the risks?",
    answer:
      "The vault is the counterparty to all traders. If traders are collectively profitable, the vault value decreases. However, the protocol has an insurance fund as a first-loss buffer, and historically most leveraged perp traders lose money net of fees.",
  },
  {
    question: "What is the cooldown?",
    answer:
      "After depositing, you must wait 1 hour before withdrawing. This prevents sandwich attacks on the share price and protects existing LPs from value extraction.",
  },
  {
    question: "How is the share price determined?",
    answer:
      "Share price = Total Vault Assets / Total LP Shares. It increases when fees are collected and decreases if traders profit. This is a standard ERC-4626 vault mechanism used across DeFi.",
  },
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[#21262d] last:border-b-0">
      <button
        className="flex w-full items-center justify-between py-3 text-left text-sm font-semibold text-[#e1e4e8] hover:text-[#22c55e] transition-colors"
        onClick={() => setOpen(!open)}
      >
        {question}
        <svg
          className={clsx(
            "h-4 w-4 flex-shrink-0 text-zinc-500 transition-transform duration-200",
            open && "rotate-180"
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <p className="pb-3 text-sm leading-relaxed text-zinc-400">{answer}</p>
      )}
    </div>
  );
}

export function LPFaq() {
  return (
    <Card>
      <CardTitle>How LP Works</CardTitle>
      <div className="mt-4">
        {FAQ_ITEMS.map((item) => (
          <FaqItem key={item.question} question={item.question} answer={item.answer} />
        ))}
      </div>
    </Card>
  );
}
