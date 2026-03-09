import Link from "next/link";
import {
  BoltIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  WrenchScrewdriverIcon,
  RocketLaunchIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
  CubeTransparentIcon,
  GlobeAltIcon,
  CpuChipIcon,
  CircleStackIcon,
} from "@heroicons/react/24/outline";
import { PayoffCalculator } from "@/components/landing/PayoffCalculator";
import { HeroShader } from "@/components/landing/HeroShader";
import { HeroContent } from "@/components/landing/HeroContent";
import { AnimatedStats } from "@/components/landing/AnimatedStats";
import { EcosystemStrip } from "@/components/landing/EcosystemStrip";
import { PayoffCurveMini } from "@/components/landing/PayoffCurveMini";
import { FadeIn, Stagger, StaggerItem } from "@/components/landing/FadeIn";

/* ─── Problem → Solution (3 beats) ─── */
const THESIS = [
  {
    icon: ChartBarIcon,
    title: "Perps Won. Volatility Didn't.",
    description:
      "DeFi solved leveraged trading — $5B/day across perp DEXes. But the TradFi volatility market ($600B+/day in options, VIX, variance swaps) has no DeFi equivalent. The biggest untapped market in crypto derivatives.",
  },
  {
    icon: CircleStackIcon,
    title: "Options Tried. Liquidity Died.",
    description:
      "Opyn, Lyra, Ribbon, Hegic, Premia — DeFi options have failed repeatedly. The problem is structural: options fragment liquidity across hundreds of strikes and expiries. No single point has enough depth.",
  },
  {
    icon: BoltIcon,
    title: "One Instrument. All the Convexity.",
    description:
      "Power perpetuals collapse an options chain into a single perpetual. No strikes, no expiries, no rolling. Your gains curve upward on big moves — option-like payoffs with perp-like liquidity, all in one oracle-priced pool.",
  },
];

/* ─── Why now / why here (timing + moat) ─── */
const WHY_NOW = [
  {
    icon: ShieldCheckIcon,
    title: "The Opyn Lesson, Applied",
    description:
      "Squeeth proved the math works. It failed on infrastructure — Ethereum gas killed structured vaults, no native hedge venue, single asset only. Superps is built to avoid the same traps.",
  },
  {
    icon: CubeTransparentIcon,
    title: "CoreWriter Moat",
    description:
      "The LP vault will hedge on Hyperliquid's $5B+/day order book via the CoreWriter precompile. You can fork the contracts. You can't fork the liquidity.",
  },
  {
    icon: CpuChipIcon,
    title: "Sub-Cent Composability",
    description:
      "Rebalancing a structured vault costs $5–50/tx on Ethereum. Under a penny on HyperEVM. This enables Anchor vaults, gamma harvesters, and vol arb strategies that are uneconomical anywhere else.",
  },
  {
    icon: GlobeAltIcon,
    title: "Multi-Asset Ready",
    description:
      "The architecture supports any asset with a Hyperliquid price feed. Gold², Silver², TSLA², Nasdaq² — convex exposure to assets that have never had power perpetuals. Products that don't exist anywhere.",
  },
];

/* ─── Roadmap: product → vol market → infrastructure layer ─── */
const ROADMAP = [
  {
    icon: CheckCircleIcon,
    phase: "Phase 1",
    title: "Foundation",
    status: "completed" as const,
    items: [
      "7 core contracts with insurance fund — built & tested",
      "349 tests passing (unit, fuzz, integration, invariant)",
      "Internal security review & 12 hardening fixes",
      "Testnet deployed, full UI, community testing complete",
    ],
  },
  {
    icon: WrenchScrewdriverIcon,
    phase: "Phase 2",
    title: "Mainnet Launch",
    status: "active" as const,
    items: [
      "HyperEVM mainnet deployment with seed liquidity",
      "Liquidation bot & funding keeper",
      "LP bootstrap — points program & fee rebates",
      "Trading SDK & ecosystem partnerships",
    ],
  },
  {
    icon: RocketLaunchIcon,
    phase: "Phase 3",
    title: "Build the Vol Market",
    status: "upcoming" as const,
    items: [
      "CoreWriter delta-hedge for LP vault",
      "Multi-power (p=2, p=0.5) — complete vol surface",
      "Anchor Strategy vault (delta-neutral, earns funding)",
      "On-chain Implied Volatility Index",
    ],
  },
  {
    icon: SparklesIcon,
    phase: "Phase 4",
    title: "The Volatility Layer",
    status: "upcoming" as const,
    items: [
      "Multi-asset: ETH², BTC², Gold², Silver² via HIP-3",
      "Structured vaults — Power Spread, Vol Arb, Tail Hedge",
      "Implied vol oracle for other protocols",
      "Professional external audit",
    ],
  },
];

function GradientDivider() {
  return (
    <div className="h-px bg-gradient-to-r from-transparent via-[#22c55e]/20 to-transparent" />
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-center gap-3">
      <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#22c55e]/40" />
      <span className="font-mono text-xs tracking-widest text-[#22c55e]/60 uppercase">
        {children}
      </span>
      <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#22c55e]/40" />
    </div>
  );
}

export const metadata = {
  title: "Superps | The On-Chain Volatility Market",
  description:
    "The first on-chain volatility market. Power perpetuals with option-like convexity and perp-like liquidity — no strikes, no expiries. Powered by Hyperliquid.",
  openGraph: {
    title: "Superps | The On-Chain Volatility Market",
    description:
      "The first on-chain volatility market. Power perpetuals with option-like convexity and perp-like liquidity — no strikes, no expiries. Powered by Hyperliquid.",
    siteName: "Superps",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Superps | The On-Chain Volatility Market",
    description:
      "The first on-chain volatility market. Power perpetuals with option-like convexity and perp-like liquidity — no strikes, no expiries. Powered by Hyperliquid.",
  },
};

export default function Home() {
  return (
    <div>
      {/* ────────────────────── Hero ────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <HeroShader />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0b0e11]/60 via-[#0b0e11]/20 to-[#0b0e11]" />
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[60%] select-none font-bold leading-none text-[#22c55e]"
          style={{ fontSize: "24rem", opacity: 0.04 }}
          aria-hidden="true"
        >
          S²
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-28 sm:pb-28 sm:pt-36">
          <HeroContent />
        </div>
      </section>

      {/* ────────────────────── Stats: The Market Gap ────────────────────── */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#22c55e]/20 to-transparent" />
      <section className="bg-[#0f1216]/60">
        <AnimatedStats />
      </section>
      <div className="h-px bg-gradient-to-r from-transparent via-[#21262d] to-transparent" />

      {/* ────────────────────── Ecosystem ────────────────────── */}
      <EcosystemStrip />
      <GradientDivider />

      {/* ────────────────────── The Missing Market (Problem → Solution) ────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-28">
        <FadeIn>
          <SectionLabel>The Missing Market</SectionLabel>
          <h2 className="font-display text-center text-3xl font-bold text-white">
            $600B/Day in TradFi. Zero in DeFi.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-zinc-500">
            Volatility is the largest derivatives market in the world. DeFi has
            never had one — not because the demand isn&apos;t there, but because
            options fragment liquidity too badly to work on-chain. Power perps
            are a fundamentally different approach.
          </p>
        </FadeIn>
        <Stagger className="mt-14 grid gap-6 md:grid-cols-3" staggerDelay={0.15}>
          {THESIS.map((item) => (
            <StaggerItem key={item.title}>
              <div className="group relative overflow-hidden rounded-xl border border-[#21262d] bg-[#0f1216] p-8 transition-all duration-300 hover:border-[#22c55e]/20 hover:shadow-[0_0_40px_rgba(34,197,94,0.06)]">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#22c55e]/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#22c55e]/10 ring-1 ring-[#22c55e]/10 transition-all duration-300 group-hover:bg-[#22c55e]/15 group-hover:shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                  <item.icon className="h-6 w-6 text-[#22c55e]" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-white">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  {item.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      {/* ────────────────────── Payoff: The Proof ────────────────────── */}
      <GradientDivider />
      <section className="bg-[#0f1216]/40">
        <div className="mx-auto max-w-7xl px-4 py-28">
          <FadeIn>
            <SectionLabel>The Payoff</SectionLabel>
            <h2 className="font-display text-center text-3xl font-bold text-white">
              Same Move. More Upside.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-center text-sm leading-6 text-zinc-500">
              The power perp payoff curves upward — same leverage, same
              collateral, but returns accelerate on big moves. This is
              convexity.
            </p>
          </FadeIn>
          <div className="mx-auto mt-14 grid max-w-4xl gap-12 md:grid-cols-2 md:items-start">
            <FadeIn delay={0.1} direction="left">
              <div className="rounded-xl border border-[#21262d] bg-[#0f1216] p-6">
                <p className="mb-4 text-center font-mono text-[10px] tracking-widest text-zinc-600 uppercase">
                  Convex vs Linear payoff
                </p>
                <PayoffCurveMini />
              </div>
            </FadeIn>
            <FadeIn delay={0.2} direction="right">
              <div className="rounded-xl border border-[#21262d] bg-[#0f1216] p-6">
                <p className="mb-4 text-center font-mono text-[10px] tracking-widest text-zinc-600 uppercase">
                  Try any HYPE move
                </p>
                <PayoffCalculator />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
      <GradientDivider />

      {/* ────────────────────── Comparison Table ────────────────────── */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-28">
          <FadeIn>
            <SectionLabel>Compare</SectionLabel>
            <h2 className="font-display text-center text-3xl font-bold text-white">
              How Superps Stack Up
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-center text-sm text-zinc-500">
              Option-like convexity. Perp-like liquidity. None of the
              complexity.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="mx-auto mt-14 max-w-4xl overflow-hidden rounded-xl border border-[#21262d]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#21262d] bg-[#0f1216]">
                    <th className="px-6 py-4 text-left text-xs font-medium tracking-wide text-zinc-500" />
                    <th className="px-6 py-4 text-center text-xs font-medium tracking-wide text-zinc-500">
                      Linear Perps
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium tracking-wide text-[#22c55e]">
                      Superps
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-medium tracking-wide text-zinc-500">
                      Options
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#21262d]/60">
                  {[
                    {
                      label: "Payoff",
                      linear: "Linear",
                      superps: "Convex (S²)",
                      options: "Convex",
                    },
                    {
                      label: "Upside on +20%",
                      linear: "+40% at 2x",
                      superps: "+88% at 2x",
                      options: "Varies",
                    },
                    {
                      label: "Ongoing Cost",
                      linear: "Funding rate",
                      superps: "Funding rate",
                      options: "Premium + theta decay",
                    },
                    {
                      label: "Expiry",
                      linear: "None",
                      superps: "None",
                      options: "Fixed expiry",
                    },
                    {
                      label: "Complexity",
                      linear: "Simple",
                      superps: "Simple",
                      options: "Strike, expiry, Greeks",
                    },
                    {
                      label: "Liquidity",
                      linear: "Single instrument",
                      superps: "Single instrument",
                      options: "Fragmented across strikes",
                    },
                    {
                      label: "Execution",
                      linear: "Orderbook / AMM",
                      superps: "Oracle-priced pool",
                      options: "Orderbook / RFQ",
                    },
                    {
                      label: "Best For",
                      linear: "Directional bets",
                      superps: "Volatility + convex leverage",
                      options: "Hedging, vol trading",
                    },
                  ].map((row, i) => (
                    <tr
                      key={row.label}
                      className={
                        i % 2 === 0 ? "bg-[#0b0e11]" : "bg-[#0f1216]/50"
                      }
                    >
                      <td className="px-6 py-3.5 text-left font-medium text-zinc-300">
                        {row.label}
                      </td>
                      <td className="px-6 py-3.5 text-center text-zinc-500">
                        {row.linear}
                      </td>
                      <td className="px-6 py-3.5 text-center font-medium text-[#22c55e]/90">
                        {row.superps}
                      </td>
                      <td className="px-6 py-3.5 text-center text-zinc-500">
                        {row.options}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ────────────────────── Why Now (Timing + Moat) ────────────────────── */}
      <section className="bg-[#0f1216]/40">
        <div className="mx-auto max-w-7xl px-4 py-28">
          <FadeIn>
            <SectionLabel>Why Now</SectionLabel>
            <h2 className="font-display text-center text-3xl font-bold text-white">
              Why Now. Why Here.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-zinc-500">
              Power perps existed before — Opyn&apos;s Squeeth launched on
              Ethereum in 2022. The math was right. The infrastructure
              wasn&apos;t. Everything that killed Squeeth is different on
              Hyperliquid.
            </p>
          </FadeIn>
          <Stagger
            className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
            staggerDelay={0.1}
          >
            {WHY_NOW.map((item) => (
              <StaggerItem key={item.title}>
                <div className="group relative overflow-hidden rounded-xl border border-[#21262d] bg-[#0b0e11] p-7 transition-all duration-300 hover:border-[#22c55e]/20 hover:shadow-[0_0_30px_rgba(34,197,94,0.04)]">
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#22c55e]/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#22c55e]/10 ring-1 ring-[#22c55e]/10">
                    <item.icon className="h-5 w-5 text-[#22c55e]" />
                  </div>
                  <h3 className="mt-4 font-display text-base font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    {item.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
      <GradientDivider />

      {/* ────────────────────── Two Audiences ────────────────────── */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-28">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Traders */}
            <FadeIn delay={0} direction="left">
              <div className="group relative overflow-hidden rounded-xl border border-[#21262d] bg-[#0f1216] p-8 transition-all duration-300 hover:border-[#22c55e]/20 md:p-10">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#22c55e]/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#22c55e]/10">
                  <ArrowTrendingUpIcon className="h-5 w-5 text-[#22c55e]" />
                </div>
                <p className="mt-5 font-mono text-xs tracking-widest text-[#22c55e]/60 uppercase">
                  For Traders
                </p>
                <h3 className="mt-2 font-display text-2xl font-bold text-white">
                  Trade volatility, not just direction
                </h3>
                <p className="mt-4 text-sm leading-7 text-zinc-400">
                  Every perp DEX offers the same thing: a linear bet on price.
                  Superps gives you convex exposure — your gains accelerate on
                  big moves while your risk stays defined. No strikes, no
                  expiries, no Greeks. One trade, one pool, one instrument. The
                  simplicity of perps with the payoff of options.
                </p>
                <Link
                  href="/trade"
                  className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#22c55e] px-6 py-3 text-sm font-semibold text-[#0b0e11] transition-all hover:bg-[#16a34a]"
                >
                  Open a Position
                </Link>
              </div>
            </FadeIn>

            {/* LPs */}
            <FadeIn delay={0.15} direction="right">
              <div className="group relative overflow-hidden rounded-xl border border-[#21262d] bg-[#0f1216] p-8 transition-all duration-300 hover:border-[#22c55e]/20 md:p-10">
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#22c55e]/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#22c55e]/10">
                  <BanknotesIcon className="h-5 w-5 text-[#22c55e]" />
                </div>
                <p className="mt-5 font-mono text-xs tracking-widest text-[#22c55e]/60 uppercase">
                  For LPs
                </p>
                <h3 className="mt-2 font-display text-2xl font-bold text-white">
                  Earn from every trade
                </h3>
                <p className="mt-4 text-sm leading-7 text-zinc-400">
                  Deposit USDC into the vault. Earn trading fees on every open
                  and close, plus continuous funding from leveraged traders.
                  Two revenue streams from day one — with CoreWriter
                  delta-hedging planned to reduce directional risk. Passive.
                  Always-on.
                </p>
                <Link
                  href="/earn"
                  className="mt-8 inline-flex items-center gap-2 rounded-lg border border-[#30363d] px-6 py-3 text-sm font-semibold text-zinc-300 transition-all hover:border-[#22c55e]/30 hover:bg-[#22c55e]/5 hover:text-white"
                >
                  Deposit USDC
                </Link>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ────────────────────── Roadmap / Vision ────────────────────── */}
      <GradientDivider />
      <section>
        <div className="mx-auto max-w-7xl px-4 py-28">
          <FadeIn>
            <SectionLabel>The Road Ahead</SectionLabel>
            <h2 className="font-display text-center text-3xl font-bold text-white">
              From Power Perps to the Volatility Layer
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-zinc-500">
              The foundation is complete — contracts, tests, testnet, full UI.
              Next: mainnet. The endgame is infrastructure — an on-chain
              implied vol oracle that other protocols build on.
            </p>
          </FadeIn>
          <Stagger
            className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4"
            staggerDelay={0.12}
          >
            {ROADMAP.map((phase) => (
              <StaggerItem key={phase.phase}>
                <div
                  className={`group relative rounded-xl border p-6 transition-all duration-300 ${
                    phase.status === "completed"
                      ? "border-[#22c55e]/20 bg-[#22c55e]/[0.03]"
                      : phase.status === "active"
                        ? "border-[#22c55e]/50 bg-[#0f1216] shadow-[0_0_30px_rgba(34,197,94,0.05)]"
                        : "border-[#21262d] bg-[#0f1216] hover:border-[#30363d]"
                  }`}
                >
                  {phase.status === "active" && (
                    <>
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#22c55e]/60 to-transparent" />
                      <span className="absolute -top-3 left-4 rounded-md bg-[#22c55e] px-2.5 py-0.5 text-xs font-semibold text-[#0b0e11]">
                        In Progress
                      </span>
                    </>
                  )}
                  {phase.status === "completed" && (
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#22c55e]/30 to-transparent" />
                  )}
                  <div className="flex items-center gap-3">
                    <phase.icon
                      className={`h-5 w-5 shrink-0 ${
                        phase.status === "upcoming"
                          ? "text-zinc-600"
                          : "text-[#22c55e]"
                      }`}
                    />
                    <div>
                      <p
                        className={`font-mono text-[10px] tracking-widest uppercase ${
                          phase.status === "upcoming"
                            ? "text-zinc-600"
                            : "text-[#22c55e]/70"
                        }`}
                      >
                        {phase.phase}
                      </p>
                      <h3 className="text-base font-semibold text-white">
                        {phase.title}
                      </h3>
                    </div>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {phase.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-[13px] leading-5 text-zinc-400"
                      >
                        <span
                          className={`mt-[7px] h-1 w-1 shrink-0 rounded-full ${
                            phase.status === "completed"
                              ? "bg-[#22c55e]/70"
                              : phase.status === "active"
                                ? "bg-[#22c55e]/40"
                                : "bg-zinc-700"
                          }`}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
      <GradientDivider />

      {/* ────────────────────── Risk Disclosure ────────────────────── */}
      <section>
        <div className="mx-auto max-w-3xl px-4 py-20">
          <FadeIn>
            <div className="overflow-hidden rounded-xl border border-yellow-900/20 bg-gradient-to-b from-yellow-950/10 to-transparent">
              <div className="h-px bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />
              <div className="flex items-start gap-4 p-6">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-yellow-500/10">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500/70" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-yellow-500/90">
                    Risk Disclosure
                  </h2>
                  <div className="mt-3 space-y-3 text-sm leading-6 text-zinc-400">
                    <p>
                      Superps is an experimental DeFi protocol. Smart contracts
                      are immutable and have not been professionally audited by
                      an external firm. Use at your own risk.
                    </p>
                    <p>
                      Power perpetuals have a{" "}
                      <strong className="text-zinc-300">squared payoff</strong>{" "}
                      — this amplifies both gains and losses. A 50% HYPE spot
                      drop creates a ~75% index drop. Combined with leverage,
                      losses can exceed your initial collateral.
                    </p>
                    <p>
                      Positions below the maintenance margin (15%) are liquidated
                      automatically. Funding payments accrue continuously and can
                      erode collateral over time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
