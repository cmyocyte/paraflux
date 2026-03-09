"use client";

import { useState, useEffect } from "react";
import { useLastFundingUpdate } from "@/hooks/useFunding";
import { formatCountdown } from "@/lib/format";

export function FundingCountdown() {
  const { data: lastUpdate } = useLastFundingUpdate();
  const [elapsed, setElapsed] = useState(0);
  const [demoElapsed, setDemoElapsed] = useState(42);

  // Live mode: tick elapsed since lastUpdate
  useEffect(() => {
    if (!lastUpdate) return;

    const tick = () => {
      const now = Math.floor(Date.now() / 1000);
      setElapsed(now - Number(lastUpdate));
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [lastUpdate]);

  // Demo mode: count up from 42s
  useEffect(() => {
    if (lastUpdate) return;
    const interval = setInterval(() => {
      setDemoElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [lastUpdate]);

  const isLive = !!lastUpdate;
  const seconds = isLive ? elapsed : demoElapsed;

  return (
    <span className="font-mono text-xs text-zinc-500">
      {formatCountdown(seconds)} ago
      {!isLive && (
        <span className="ml-1 text-[10px] font-bold uppercase tracking-wider text-zinc-700">
          demo
        </span>
      )}
    </span>
  );
}
