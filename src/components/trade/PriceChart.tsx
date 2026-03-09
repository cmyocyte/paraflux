"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import {
  createChart,
  CandlestickSeries,
  HistogramSeries,
  LineSeries,
  LineStyle,
  type IChartApi,
  type ISeriesApi,
  type IPriceLine,
  type UTCTimestamp,
  type CandlestickData,
  type LineData,
  ColorType,
} from "lightweight-charts";
import { usePosition } from "@/hooks/usePosition";
import { useEstimatedCumulativeFunding } from "@/hooks/useFunding";
import {
  computeLiquidationIndex,
  computeFundingOwed,
  NORM_NUM,
} from "@/lib/math";
import { wadToNumber } from "@/lib/format";
import { useHyperliquidCandles } from "@/hooks/useHyperliquidCandles";
import {
  TimeframeSelector,
  TIMEFRAME_TO_HL_INTERVAL,
  type Timeframe,
} from "./TimeframeSelector";

interface PriceChartProps {
  className?: string;
}

export function PriceChart({ className }: PriceChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<"Histogram"> | null>(null);
  const spotSeriesRef = useRef<ISeriesApi<"Line"> | null>(null);
  const [timeframe, setTimeframe] = useState<Timeframe>("1h");
  const lastFitVersionRef = useRef(0);
  const loadMoreRef = useRef<() => void>(() => {});
  const priceLinesRef = useRef<IPriceLine[]>([]);

  // Position data for entry/liq price lines
  const { data: longPos } = usePosition(true);
  const { data: shortPos } = usePosition(false);
  const cumFunding = useEstimatedCumulativeFunding();

  const hlInterval = TIMEFRAME_TO_HL_INTERVAL[timeframe];
  const { candles, volumes, loading, error, dataVersion, loadMore, loadingMore } =
    useHyperliquidCandles(hlInterval);

  // Derive S² candles from spot OHLCV (the instrument traders are actually trading)
  const indexCandles = useMemo<CandlestickData<UTCTimestamp>[]>(
    () =>
      candles.map((c) => ({
        time: c.time,
        open: c.open * c.open,
        high: c.high * c.high,
        low: c.low * c.low,
        close: c.close * c.close,
      })),
    [candles]
  );

  // Spot price as a reference line (on left scale)
  const spotLine = useMemo<LineData<UTCTimestamp>[]>(
    () =>
      candles.map((c) => ({
        time: c.time,
        value: c.close,
      })),
    [candles]
  );

  // Keep loadMore ref current for the range change handler
  loadMoreRef.current = loadMore;

  // Create chart once
  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "#0f1216" },
        textColor: "#e1e4e8",
        fontSize: 11,
      },
      grid: {
        vertLines: { color: "#21262d" },
        horzLines: { color: "#21262d" },
      },
      crosshair: {
        vertLine: { color: "#30363d", labelBackgroundColor: "#21262d" },
        horzLine: { color: "#30363d", labelBackgroundColor: "#21262d" },
      },
      rightPriceScale: {
        borderColor: "#21262d",
        textColor: "#e1e4e8",
      },
      leftPriceScale: {
        visible: true,
        borderColor: "#21262d",
        textColor: "#6b7280",
      },
      timeScale: {
        borderColor: "#21262d",
        timeVisible: true,
        secondsVisible: false,
      },
    });

    // S² Power Index candles (primary — this is what traders trade)
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderUpColor: "#22c55e",
      borderDownColor: "#ef4444",
      wickUpColor: "#22c55e",
      wickDownColor: "#ef4444",
    });

    // Volume histogram
    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
      priceScaleId: "volume",
    });

    chart.priceScale("volume").applyOptions({
      scaleMargins: { top: 0.8, bottom: 0 },
    });

    // HYPE spot reference line (left scale)
    const spotSeries = chart.addSeries(LineSeries, {
      color: "rgba(225, 228, 232, 0.35)",
      lineWidth: 1,
      priceScaleId: "left",
      priceLineVisible: false,
      lastValueVisible: true,
      title: "Spot",
    });

    // Load more candles when user scrolls near the left edge
    chart.timeScale().subscribeVisibleLogicalRangeChange((range) => {
      if (!range) return;
      if (range.from < 10) {
        loadMoreRef.current();
      }
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;
    volumeSeriesRef.current = volumeSeries;
    spotSeriesRef.current = spotSeries;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        chart.applyOptions({ width: entry.contentRect.width });
      }
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
      volumeSeriesRef.current = null;
      spotSeriesRef.current = null;
    };
  }, []);

  // Update series when candle data changes
  useEffect(() => {
    if (!candleSeriesRef.current || !volumeSeriesRef.current || !spotSeriesRef.current)
      return;
    if (candles.length === 0) return;

    candleSeriesRef.current.setData(indexCandles);
    volumeSeriesRef.current.setData(volumes);
    spotSeriesRef.current.setData(spotLine);

    // Only auto-fit on initial load or timeframe change (dataVersion bump)
    if (dataVersion > 0 && dataVersion !== lastFitVersionRef.current) {
      lastFitVersionRef.current = dataVersion;
      chartRef.current?.timeScale().fitContent();
    }
  }, [candles, volumes, indexCandles, spotLine, dataVersion]);

  // Position entry/liquidation price lines
  useEffect(() => {
    const series = candleSeriesRef.current;
    if (!series) return;

    // Remove previous price lines
    for (const line of priceLinesRef.current) {
      series.removePriceLine(line);
    }
    priceLinesRef.current = [];

    const addPositionLines = (
      position: typeof longPos,
      isLong: boolean
    ) => {
      if (!position || position.size === 0n) return;

      const size = wadToNumber(position.size);
      const entryIndex = wadToNumber(position.entryIndex);
      const collateral = wadToNumber(position.collateral);

      // Entry line in S² chart space (index * NORM)
      const entryLine = series.createPriceLine({
        price: entryIndex * NORM_NUM,
        color: isLong ? "#22c55e" : "#ef4444",
        lineWidth: 1,
        lineStyle: LineStyle.Dashed,
        axisLabelVisible: true,
        title: isLong ? "Long Entry" : "Short Entry",
      });
      priceLinesRef.current.push(entryLine);

      // Liquidation line
      const fundingOwed =
        cumFunding !== undefined
          ? computeFundingOwed(
              position.size,
              position.entryFundingAccum,
              cumFunding,
              isLong
            )
          : 0;

      const liqIndex = computeLiquidationIndex(
        size,
        entryIndex,
        collateral,
        fundingOwed,
        isLong
      );

      if (liqIndex > 0) {
        const liqLine = series.createPriceLine({
          price: liqIndex * NORM_NUM,
          color: "#f97316",
          lineWidth: 1,
          lineStyle: LineStyle.Dashed,
          axisLabelVisible: true,
          title: isLong ? "Long Liq" : "Short Liq",
        });
        priceLinesRef.current.push(liqLine);
      }
    };

    addPositionLines(longPos, true);
    addPositionLines(shortPos, false);
  }, [longPos, shortPos, cumFunding]);

  // Latest values for header display
  const lastCandle = candles.length > 0 ? candles[candles.length - 1] : null;
  const lastIndex = lastCandle ? lastCandle.close * lastCandle.close : null;
  const prevCandle = candles.length > 1 ? candles[candles.length - 2] : null;
  const prevIndex = prevCandle ? prevCandle.close * prevCandle.close : null;
  const indexChange =
    lastIndex !== null && prevIndex !== null && prevIndex !== 0
      ? ((lastIndex - prevIndex) / prevIndex) * 100
      : 0;

  return (
    <div className="relative rounded border border-[#21262d] bg-[#0f1216]">
      {/* Header bar */}
      <div className="flex items-center gap-3 border-b border-[#21262d] px-3 py-2">
        <span className="text-xs font-medium text-zinc-400">HYPE² Index</span>
        {lastIndex !== null && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-zinc-100">
              {lastIndex.toFixed(2)}
            </span>
            <span
              className={`text-xs font-mono ${indexChange >= 0 ? "text-[#22c55e]" : "text-red-400"}`}
            >
              {indexChange >= 0 ? "+" : ""}
              {indexChange.toFixed(2)}%
            </span>
          </div>
        )}
        {lastCandle && (
          <span className="text-[10px] font-mono text-zinc-500">
            Spot ${lastCandle.close.toFixed(2)}
          </span>
        )}
        {(loading || loadingMore) && (
          <span className="text-[10px] text-zinc-600">
            {loadingMore ? "Loading history..." : "Loading..."}
          </span>
        )}
        {error && <span className="text-[10px] text-red-400">{error}</span>}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-[9px] font-medium uppercase tracking-wider text-zinc-600">
            Hyperliquid
          </span>
          <TimeframeSelector active={timeframe} onChange={setTimeframe} />
        </div>
      </div>

      {/* Chart: S² candles + volume + spot reference line */}
      <div ref={containerRef} className={className ?? "h-[420px]"} />
    </div>
  );
}
