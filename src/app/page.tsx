import Link from "next/link";
import {
  BoltIcon,
  ChartBarIcon,
  CircleStackIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import { PayoffCalculator } from "@/components/landing/PayoffCalculator";
import { HeroShader } from "@/components/landing/HeroShader";
import { HeroContent } from "@/components/landing/HeroContent";
import { AnimatedStats } from "@/components/landing/AnimatedStats";
import { EcosystemStrip } from "@/components/landing/EcosystemStrip";
import { PayoffCurveMini } from "@/components/landing/PayoffCurveMini";
import { FadeIn } from "@/components/landing/FadeIn";

/* ─── Problem → Solution (3 beats) ─── */
const THESIS = [
  {
    icon: ChartBarIcon,
    title: "Perps Won. Volatility Didn't.",
    description:
      "DeFi moves billions per day in perps. TradFi trades trillions in options and vol derivatives — none of it exists on-chain.",
  },
  {
    icon: CircleStackIcon,
    title: "Options Tried. Liquidity Died.",
    description:
      "On-chain options fragmented liquidity across hundreds of strikes and expiries. No single pool ever had depth.",
  },
  {
    icon: BoltIcon,
    title: "One Pool. No Fragmentation.",
    description:
      "A purpose-built realized vol oracle settles everything. Power perps for convex exposure. Variance swaps for pure vol. Two instruments, one pool.",
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
  title: "Paraflux | The On-Chain Volatility Market",
  description:
    "The on-chain volatility layer. Power perpetuals + variance swaps — convexity and pure vol trading, settled against an on-chain realized vol oracle. Powered by Hyperliquid.",
  openGraph: {
    title: "Paraflux | The On-Chain Volatility Market",
    description:
      "The on-chain volatility layer. Power perpetuals + variance swaps — convexity and pure vol trading, settled against an on-chain realized vol oracle. Powered by Hyperliquid.",
    siteName: "Paraflux",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Paraflux | The On-Chain Volatility Market",
    description:
      "The on-chain volatility layer. Power perpetuals + variance swaps — convexity and pure vol trading, settled against an on-chain realized vol oracle. Powered by Hyperliquid.",
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

      {/* ────────────────────── Stats ────────────────────── */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#22c55e]/20 to-transparent" />
      <section className="bg-[#0f1216]/60">
        <AnimatedStats />
      </section>
      <div className="h-px bg-gradient-to-r from-transparent via-[#21262d] to-transparent" />

      {/* ────────────────────── Ecosystem + Social Proof ────────────────────── */}
      <EcosystemStrip />
      <GradientDivider />

      {/* ────────────────────── Thesis (3 beats) ────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-28">
        <FadeIn>
          <SectionLabel>The Missing Market</SectionLabel>
          <h2 className="font-display text-center text-3xl font-bold text-white">
            Trillions in TradFi. Zero On-Chain.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-sm text-zinc-500">
            Volatility is the largest derivatives market in the world. We built
            the oracle to settle it and the instruments to trade it.
          </p>
        </FadeIn>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {THESIS.map((item) => (
            <FadeIn key={item.title} className="h-full">
              <div className="group relative h-full overflow-hidden rounded-xl border border-[#21262d] bg-[#0f1216] p-8 transition-all duration-300 hover:border-[#22c55e]/20 hover:shadow-[0_0_40px_rgba(34,197,94,0.06)]">
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
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ────────────────────── Payoff: The Proof ────────────────────── */}
      <GradientDivider />
      <section className="bg-[#0f1216]/40">
        <div className="mx-auto max-w-4xl px-4 py-28">
          <FadeIn>
            <SectionLabel>The Payoff</SectionLabel>
            <h2 className="font-display text-center text-3xl font-bold text-white">
              Same Move. More Upside.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-center text-sm leading-6 text-zinc-500">
              Power perps: your gains curve upward on big moves. Same leverage,
              same collateral — returns accelerate.
            </p>
          </FadeIn>

          {/* Chart — hero size */}
          <FadeIn delay={0.1}>
            <div className="mx-auto mt-14 max-w-2xl rounded-xl border border-[#21262d] bg-[#0f1216] p-8">
              <p className="mb-6 text-center font-mono text-[10px] tracking-widest text-zinc-600 uppercase">
                Convex vs Linear payoff
              </p>
              <PayoffCurveMini />
            </div>
          </FadeIn>

          {/* Calculator */}
          <FadeIn delay={0.15}>
            <div className="mx-auto mt-6 max-w-2xl rounded-xl border border-[#21262d] bg-[#0f1216] p-8">
              <p className="mb-6 text-center font-mono text-[10px] tracking-widest text-zinc-600 uppercase">
                Try any HYPE move
              </p>
              <PayoffCalculator />
            </div>
          </FadeIn>
        </div>
      </section>
      <GradientDivider />

      {/* ────────────────────── Two Audiences ────────────────────── */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-28">
          <FadeIn>
            <SectionLabel>Get Started</SectionLabel>
            <h2 className="font-display text-center text-3xl font-bold text-white">
              Two Ways to Trade. One Way to Earn.
            </h2>
          </FadeIn>
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {/* Traders */}
            <FadeIn delay={0.05} className="h-full">
              <div className="group relative h-full overflow-hidden rounded-xl border border-[#21262d] bg-[#0f1216] p-8 transition-all duration-300 hover:border-[#22c55e]/20 md:p-10">
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
                  Power perps give you convex exposure — gains accelerate on big
                  moves. Variance swaps let you go long or short vol directly.
                  Two instruments, one pool, no strikes, no expiries.
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
            <FadeIn delay={0.1} className="h-full">
              <div className="group relative h-full overflow-hidden rounded-xl border border-[#21262d] bg-[#0f1216] p-8 transition-all duration-300 hover:border-[#22c55e]/20 md:p-10">
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
                  Deposit USDC. Earn 75% of all trading fees from both power
                  perps and variance swaps, plus continuous funding. One vault,
                  diversified income.
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

      {/* ────────────────────── Final CTA ────────────────────── */}
      <GradientDivider />
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: "600px",
            height: "300px",
            background:
              "radial-gradient(ellipse, rgba(34,197,94,0.06) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-3xl px-4 py-28 text-center">
          <FadeIn>
            <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              The volatility market is
              <br />
              coming on-chain.
            </h2>
            <p className="mt-4 text-lg text-zinc-500">Be early.</p>
            <div className="mt-10 flex items-center justify-center gap-5">
              <Link
                href="/trade"
                className="rounded-lg bg-[#22c55e] px-8 py-3.5 text-sm font-semibold text-[#0b0e11] shadow-[0_0_30px_rgba(34,197,94,0.25)] transition-all hover:bg-[#16a34a] hover:shadow-[0_0_40px_rgba(34,197,94,0.35)]"
              >
                Start Trading
              </Link>
              <Link
                href="/earn"
                className="rounded-lg border border-[#30363d] bg-[#0b0e11]/50 px-8 py-3.5 text-sm font-semibold text-zinc-300 transition-all hover:border-[#22c55e]/30 hover:bg-[#22c55e]/5 hover:text-white"
              >
                Earn Yield
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
      <GradientDivider />

      {/* ────────────────────── Risk Disclosure ────────────────────── */}
      <section>
        <div className="mx-auto max-w-3xl px-4 py-20">
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
                    Paraflux is an experimental DeFi protocol. Smart contracts
                    are immutable and have only been internally audited — no
                    external audit has been performed. Use at your own risk.
                  </p>
                  <p>
                    Power perpetuals have a{" "}
                    <strong className="text-zinc-300">squared payoff</strong>{" "}
                    — this amplifies both gains and losses. Variance swaps
                    carry{" "}
                    <strong className="text-zinc-300">
                      unbounded upside risk
                    </strong>{" "}
                    for short vol positions. Combined with leverage, losses can
                    exceed your initial collateral.
                  </p>
                  <p>
                    Positions below the maintenance margin are liquidated
                    automatically. Funding payments accrue continuously and can
                    erode collateral over time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
