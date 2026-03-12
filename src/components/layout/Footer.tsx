export function Footer() {
  return (
    <footer className="border-t border-[#21262d] bg-[#0b0e11]">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          {/* Logo + tagline */}
          <div>
            <p className="font-display text-sm font-bold text-white">
              Para<span className="text-[#22c55e]">flux</span>
            </p>
            <p className="mt-1 text-xs text-zinc-600">
              The On-Chain Volatility Layer
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-8">
            <a
              href="https://github.com/cmyocyte/paraflux"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-500 transition-colors hover:text-zinc-300"
            >
              GitHub
            </a>
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-500 transition-colors hover:text-zinc-300"
            >
              X / Twitter
            </a>
            <a
              href="/trade"
              className="text-xs text-zinc-500 transition-colors hover:text-zinc-300"
            >
              Trade
            </a>
            <a
              href="/earn"
              className="text-xs text-zinc-500 transition-colors hover:text-zinc-300"
            >
              Earn
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 border-t border-[#21262d]/50 pt-6 text-center">
          <p className="text-[11px] text-zinc-700">
            Paraflux is experimental software. Smart contracts are immutable and
            only internally audited. Use at your own risk.
          </p>
        </div>
      </div>
    </footer>
  );
}
