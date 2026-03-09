"use client";

import { useState, useEffect } from "react";
import { useLPLeaderboard } from "@/hooks/useLeaderboard";
import { shortenAddress, formatUsd, formatPercent } from "@/lib/format";
import { Button } from "@/components/ui/Button";

const PAGE_SIZE = 10;

function formatRelativeTime(timestamp: number): string {
  const seconds = Math.floor(Date.now() / 1000) - timestamp;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  const days = Math.floor(seconds / 86400);
  return `${days}d ago`;
}

export function LPLeaderboard() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data } = useLPLeaderboard();

  useEffect(() => {
    setPage(1);
  }, [search]);

  const filtered = data.filter((lp) =>
    lp.address.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      {/* Controls */}
      <div className="flex items-center justify-end">
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
                Provider
              </th>
              <th className="px-3 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Shares
              </th>
              <th className="px-3 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Value (USDC)
              </th>
              <th className="px-3 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Pool Share
              </th>
              <th className="px-3 py-2 text-right text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Deposited
              </th>
            </tr>
          </thead>
          <tbody>
            {pageData.length > 0 ? (
              pageData.map((lp, i) => {
                const rank = (page - 1) * PAGE_SIZE + i + 1;
                return (
                  <tr
                    key={lp.address}
                    className="border-b border-[#21262d]/50 last:border-b-0 transition-colors hover:bg-[#161b22]/50"
                  >
                    <td className="px-3 py-2.5 font-mono text-zinc-500">
                      {rank}
                    </td>
                    <td className="px-3 py-2.5 font-mono text-[#e1e4e8]">
                      {shortenAddress(lp.address)}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-[#e1e4e8]">
                      {lp.shares.toLocaleString()}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-[#e1e4e8]">
                      {formatUsd(lp.valueUsdc)}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-[#e1e4e8]">
                      {formatPercent(lp.poolShare)}
                    </td>
                    <td className="px-3 py-2.5 text-right font-mono text-zinc-400">
                      {formatRelativeTime(lp.depositTime)}
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
                  No providers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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
    </div>
  );
}
