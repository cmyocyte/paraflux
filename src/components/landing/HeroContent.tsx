"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] as const },
  },
};

export function HeroContent() {
  return (
    <motion.div
      className="mx-auto max-w-3xl text-center"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        className="font-display text-6xl font-bold tracking-tight text-white drop-shadow-lg sm:text-8xl"
        variants={fadeUp}
      >
        Su<span className="text-[#22c55e]">perps</span>
      </motion.h1>
      <motion.p
        className="mt-4 font-display text-xl font-medium tracking-wide text-zinc-300 drop-shadow-md"
        variants={fadeUp}
      >
        Not a Perp DEX. The On-Chain Volatility Market.
      </motion.p>
      <motion.p
        className="mx-auto mt-6 max-w-xl text-base leading-7 text-zinc-400 drop-shadow-sm"
        variants={fadeUp}
      >
        DeFi has $5B/day in linear perps and almost zero volatility trading.
        Power perpetuals fix that — option-like convexity, perp-like liquidity,
        no strikes, no expiries. One instrument. Built on Hyperliquid.
      </motion.p>
      <motion.div
        className="mt-12 flex items-center justify-center gap-5"
        variants={fadeUp}
      >
        <Link
          href="/trade"
          className="rounded-lg bg-[#22c55e] px-8 py-3.5 text-sm font-semibold text-[#0b0e11] shadow-[0_0_30px_rgba(34,197,94,0.25)] transition-all hover:bg-[#16a34a] hover:shadow-[0_0_40px_rgba(34,197,94,0.35)]"
        >
          Start Trading
        </Link>
        <Link
          href="/earn"
          className="rounded-lg border border-[#30363d] bg-[#0b0e11]/50 px-8 py-3.5 text-sm font-semibold text-zinc-300 backdrop-blur-sm transition-all hover:border-[#22c55e]/30 hover:bg-[#22c55e]/5 hover:text-white"
        >
          Earn Yield
        </Link>
      </motion.div>
    </motion.div>
  );
}
