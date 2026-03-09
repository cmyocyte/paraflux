"use client";

import { FadeIn } from "./FadeIn";

const LOGOS = [
  { name: "HyperEVM", text: "HyperEVM" },
  { name: "Hyperliquid", text: "Hyperliquid" },
  { name: "OpenZeppelin", text: "OpenZeppelin" },
  { name: "Foundry", text: "Foundry" },
  { name: "ERC-4626", text: "ERC-4626" },
];

export function EcosystemStrip() {
  return (
    <FadeIn delay={0.2}>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <p className="mb-5 text-center font-mono text-[10px] tracking-[0.2em] text-zinc-600 uppercase">
          Built with
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          {LOGOS.map((logo) => (
            <span
              key={logo.name}
              className="font-mono text-xs font-medium tracking-wide text-zinc-600 transition-colors hover:text-zinc-400"
            >
              {logo.text}
            </span>
          ))}
        </div>
      </div>
    </FadeIn>
  );
}
