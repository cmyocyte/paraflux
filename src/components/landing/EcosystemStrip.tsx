const STACK = ["Hyperliquid", "ERC-4626"];

export function EcosystemStrip() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="mr-1 font-mono text-[10px] tracking-widest text-zinc-700 uppercase">
          Built on
        </span>
        {STACK.map((name) => (
          <span
            key={name}
            className="rounded-full border border-[#21262d] bg-[#0f1216] px-3 py-1 font-mono text-[11px] text-zinc-500 transition-colors hover:border-[#22c55e]/20 hover:text-zinc-400"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
