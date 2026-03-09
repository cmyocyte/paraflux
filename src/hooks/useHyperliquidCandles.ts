"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { CandlestickData, UTCTimestamp } from "lightweight-charts";

const HL_REST = "https://api.hyperliquid.xyz/info";
const HL_WS = "wss://api.hyperliquid.xyz/ws";
const CANDLES_PER_FETCH = 300;

export interface HLCandle {
  t: number; // open time (ms)
  T: number; // close time (ms)
  o: string; // open
  h: string; // high
  l: string; // low
  c: string; // close
  v: string; // volume
  n: number; // num trades
  s: string; // symbol
  i: string; // interval
}

/** Convert an HL candle to lightweight-charts CandlestickData */
function toChartCandle(c: HLCandle): CandlestickData<UTCTimestamp> {
  return {
    time: Math.floor(c.t / 1000) as UTCTimestamp,
    open: Number(c.o),
    high: Number(c.h),
    low: Number(c.l),
    close: Number(c.c),
  };
}

/** Interval duration in ms (for computing startTime) */
const INTERVAL_MS: Record<string, number> = {
  "1m": 60_000,
  "5m": 300_000,
  "1h": 3_600_000,
  "4h": 14_400_000,
  "1d": 86_400_000,
};

export interface VolumeData {
  time: UTCTimestamp;
  value: number;
  color: string;
}

/** Shared fetch + dedup logic */
async function fetchCandleRange(
  hlInterval: string,
  startTime: number,
  endTime: number
): Promise<{ candles: CandlestickData<UTCTimestamp>[]; volumes: VolumeData[] }> {
  const res = await fetch(HL_REST, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      type: "candleSnapshot",
      req: { coin: "HYPE", interval: hlInterval, startTime, endTime },
    }),
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const data: HLCandle[] = await res.json();

  // Deduplicate by timestamp
  const seen = new Set<number>();
  const unique: HLCandle[] = [];
  for (const c of data) {
    if (!seen.has(c.t)) {
      seen.add(c.t);
      unique.push(c);
    }
  }

  unique.sort((a, b) => a.t - b.t);

  const candles = unique.map(toChartCandle);
  const volumes: VolumeData[] = unique.map((c) => ({
    time: Math.floor(c.t / 1000) as UTCTimestamp,
    value: Number(c.v),
    color:
      Number(c.c) >= Number(c.o)
        ? "rgba(34,197,94,0.3)"
        : "rgba(239,68,68,0.3)",
  }));

  return { candles, volumes };
}

export function useHyperliquidCandles(interval: string) {
  const [candles, setCandles] = useState<CandlestickData<UTCTimestamp>[]>([]);
  const [volumes, setVolumes] = useState<VolumeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Increments on initial load / timeframe change, not on WS updates
  const [dataVersion, setDataVersion] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const intervalRef = useRef(interval);
  const earliestMsRef = useRef(0);

  intervalRef.current = interval;

  // Fetch initial candles via REST
  const fetchCandles = useCallback(async (hlInterval: string) => {
    setLoading(true);
    setError(null);

    const ms = INTERVAL_MS[hlInterval] ?? 3_600_000;
    const endTime = Date.now();
    const startTime = endTime - CANDLES_PER_FETCH * ms;

    try {
      const result = await fetchCandleRange(hlInterval, startTime, endTime);
      earliestMsRef.current = startTime;
      setCandles(result.candles);
      setVolumes(result.volumes);
      setDataVersion((v) => v + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch candles");
    } finally {
      setLoading(false);
    }
  }, []);

  // Refetch when interval changes
  useEffect(() => {
    fetchCandles(interval);
  }, [interval, fetchCandles]);

  // Load older candles (called when user scrolls to left edge)
  const loadMore = useCallback(async () => {
    if (loadingMore || !earliestMsRef.current) return;
    setLoadingMore(true);

    const hlInterval = intervalRef.current;
    const ms = INTERVAL_MS[hlInterval] ?? 3_600_000;
    const endTime = earliestMsRef.current;
    const startTime = endTime - CANDLES_PER_FETCH * ms;

    try {
      const result = await fetchCandleRange(hlInterval, startTime, endTime);
      if (result.candles.length > 0) {
        earliestMsRef.current = startTime;

        // Prepend older candles, dedup by time
        setCandles((prev) => {
          const existingTimes = new Set(prev.map((c) => c.time));
          const newCandles = result.candles.filter(
            (c) => !existingTimes.has(c.time)
          );
          return [...newCandles, ...prev];
        });
        setVolumes((prev) => {
          const existingTimes = new Set(prev.map((v) => v.time));
          const newVolumes = result.volumes.filter(
            (v) => !existingTimes.has(v.time)
          );
          return [...newVolumes, ...prev];
        });
      }
    } catch {
      // Silent fail for historical loading
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore]);

  // WebSocket for live updates
  useEffect(() => {
    let ws: WebSocket;
    let reconnectTimer: ReturnType<typeof setTimeout>;
    let disposed = false;

    function connect() {
      if (disposed) return;

      ws = new WebSocket(HL_WS);
      wsRef.current = ws;

      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            method: "subscribe",
            subscription: { type: "candle", coin: "HYPE", interval },
          })
        );
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.channel !== "candle" || !msg.data) return;

          const hlCandle: HLCandle = msg.data;
          if (hlCandle.i !== intervalRef.current) return;

          const chartCandle = toChartCandle(hlCandle);
          const volumeBar: VolumeData = {
            time: chartCandle.time,
            value: Number(hlCandle.v),
            color:
              chartCandle.close >= chartCandle.open
                ? "rgba(34,197,94,0.3)"
                : "rgba(239,68,68,0.3)",
          };

          // Update or append — no dataVersion bump (preserves zoom)
          setCandles((prev) => {
            if (prev.length === 0) return [chartCandle];
            const last = prev[prev.length - 1];
            if (last.time === chartCandle.time) {
              return [...prev.slice(0, -1), chartCandle];
            } else if (chartCandle.time > last.time) {
              return [...prev, chartCandle];
            }
            return prev;
          });

          setVolumes((prev) => {
            if (prev.length === 0) return [volumeBar];
            const last = prev[prev.length - 1];
            if (last.time === volumeBar.time) {
              return [...prev.slice(0, -1), volumeBar];
            } else if (volumeBar.time > last.time) {
              return [...prev, volumeBar];
            }
            return prev;
          });
        } catch {
          // Ignore parse errors
        }
      };

      ws.onclose = () => {
        if (!disposed) {
          reconnectTimer = setTimeout(connect, 3000);
        }
      };

      ws.onerror = () => {
        ws.close();
      };
    }

    connect();

    return () => {
      disposed = true;
      clearTimeout(reconnectTimer);
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [interval]);

  return { candles, volumes, loading, error, dataVersion, loadMore, loadingMore };
}
