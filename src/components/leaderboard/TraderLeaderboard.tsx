"use client";

import { useState, useEffect } from "react";
import { clsx } from "clsx";
import { useTraderLeaderboard } from "@/hooks/useLeaderboard";
import { shortenAddress, formatUsd, formatCompact, formatPercent } from "@/lib/format";
import { Button } from "@/components/ui/Button";

const PAGE_SIZE = 10;

export function TraderLeaderboard() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useTraderLeaderboard();

  useEffect(() => {
    setPage(1);
  }, [search]);

  const filtered = data.filter((t) =>
    t.address.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
          All Time
        </span>
        <input
          type="text"
          placeholder="Search wallet..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-52 rounded border border-[#21262d] bg-[#0b0e11] px-2.5 py-1.5 font-mono text-xs text-[#e1e4e8] placeholder-zinc-600 transition-colors focus:border-[#22c55e]/50 focus:outline-none focus:ring-1 focus:ring-[#22c55e]/30"
        />
      </div>

      {/* Table */}
      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[#21262d]">
              <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Rank
              </th>
              <th className="px-3 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Trader
              </th>
              <th className="px-3 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Account Value
              </th>
              <th className="px-3 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                PNL
              </th>
              <th className="px-3 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                ROI
              </th>
              <th className="px-3 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Volume
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-8 text-center text-xs text-zinc-500"
                >
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-zinc-600 border-t-[#22c55e]" />
                    Scanning on-chain activity...
                  </div>
                </td>
              </tr>
            ) : pageData.length > 0 ? (
              pageData.map((t, i) => {
                const rank = (page - 1) * PAGE_SIZE + i + 1;
                return (
                  <tr
                    key={t.address}
                    className="border-b border-[#21262d]/50 last:border-b-0 transition-colors hover:bg-[#161b22]/50"
                  >
                    <td className="px-3 py-2.5 font-mono text-zinc-500">
                      {rank}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-[#e1e4e8]">
                      {shortenAddress(t.address)}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-[#e1e4e8]">
                      {formatCompact(t.accountValue)}
                    </td>
                    <td
                      className={clsx(
                        "px-3 py-2.5 text-right font-mono",
                        t.pnl >= 0 ? "text-[#22c55e]" : "text-red-400"
                      )}
                    >
                      {t.pnl >= 0 ? "+" : ""}
                      {formatUsd(t.pnl)}
                    </td>
                    <td
                      className={clsx(
                        "px-3 py-2.5 text-right font-mono",
                        t.roi >= 0 ? "text-[#22c55e]" : "text-red-400"
                      )}
                    >
                      {t.roi >= 0 ? "+" : ""}
                      {formatPercent(t.roi)}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-[#e1e4e8]">
                      {formatCompact(t.volume)}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-3 py-6 text-center text-xs text-zinc-600"
                >
                  No traders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!isLoading && (
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-zinc-500">
            {filtered.length > 0
              ? `${(page - 1) * PAGE_SIZE + 1}-${Math.min(page * PAGE_SIZE, filtered.length)} of ${filtered.length}`
              : "0 results"}
          </span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Prev
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
