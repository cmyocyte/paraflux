"use client";

import { useState, useId, useRef, useMemo, useCallback } from "react";
import { useCurrentIndex, useHypeSpot } from "@/hooks/useOracle";
import { wadToNumber, formatSpotPrice, formatUsd } from "@/lib/format";
import {
  generatePayoffCurve,
  indexToSpot,
  spotToIndex,
  computeLiquidationIndex,
} from "@/lib/math";

const DEMO_SPOT = 24.5;
const DEMO_INDEX = 600;
const SVG_W = 300;
const SVG_H = 100;
const PAD = { top: 12, right: 6, bottom: 14, left: 44 };
const PLOT_W = SVG_W - PAD.left - PAD.right;
const PLOT_H = SVG_H - PAD.top - PAD.bottom;

interface PayoffCurveProps {
  size?: number;
  isLong?: boolean;
  entryIndex?: number;
  collateral?: number;
  markSpot?: number;
}

export function PayoffCurve({
  size = 1,
  isLong = true,
  entryIndex,
  collateral = 0,
  markSpot,
}: PayoffCurveProps) {
  const { data: indexRaw } = useCurrentIndex();
  const { data: spotRaw } = useHypeSpot();
  const svgRef = useRef<SVGSVGElement>(null);
  const clipId = useId().replace(/:/g, "");
  const [hoverX, setHoverX] = useState<number | null>(null);

  const isPositionMode = markSpot !== undefined;

  const idxVal = indexRaw ? wadToNumber(indexRaw) : DEMO_INDEX;
  const spotVal = spotRaw ? wadToNumber(spotRaw) : DEMO_SPOT;
  const entry = entryIndex ?? idxVal;

  const data = useMemo(
    () => generatePayoffCurve(size, entry, isLong, spotVal, 100),
    [size, entry, isLong, spotVal]
  );

  const spots = data.map((d) => d.spot);
  const pnls = data.map((d) => d.pnl);
  const minSpot = spots[0];
  const maxSpot = spots[spots.length - 1];
  const minPnl = Math.min(...pnls);
  const maxPnl = Math.max(...pnls);
  const pnlRange = maxPnl - minPnl || 1;
  const spotRange = maxSpot - minSpot || 1;

  const toX = (s: number) => PAD.left + ((s - minSpot) / spotRange) * PLOT_W;
  const toY = (p: number) =>
    PAD.top + PLOT_H - ((p - minPnl) / pnlRange) * PLOT_H;

  const zeroY = toY(0);
  const entrySpot = isPositionMode ? indexToSpot(entry) : spotVal;
  const entryX = toX(entrySpot);

  // Liquidation price marker
  const liqSpot = useMemo(() => {
    if (collateral <= 0 || size <= 0) return null;
    const liqIdx = computeLiquidationIndex(size, entry, collateral, 0, isLong);
    if (liqIdx <= 0) return null;
    const spot = indexToSpot(liqIdx);
    if (spot < minSpot || spot > maxSpot) return null;
    return spot;
  }, [size, entry, collateral, isLong, minSpot, maxSpot]);

  const liqX = liqSpot !== null ? toX(liqSpot) : null;

  // Mark price (position mode)
  const markX =
    markSpot !== undefined && markSpot >= minSpot && markSpot <= maxSpot
      ? toX(markSpot)
      : null;

  const markPnl = useMemo(() => {
    if (markSpot === undefined) return null;
    const markIndex = spotToIndex(markSpot);
    return isLong ? size * (markIndex - entry) : size * (entry - markIndex);
  }, [markSpot, size, entry, isLong]);

  const markY = markPnl !== null ? toY(markPnl) : null;

  const markPnlPct = markPnl !== null && collateral > 0
    ? (markPnl / collateral) * 100
    : null;

  // Hover tracking
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const svgX = ((e.clientX - rect.left) / rect.width) * SVG_W;
      if (svgX < PAD.left || svgX > SVG_W - PAD.right) {
        setHoverX(null);
        return;
      }
      setHoverX(svgX);
    },
    []
  );

  const handleMouseLeave = useCallback(() => setHoverX(null), []);

  // Hover data
  const hoverData = useMemo(() => {
    if (hoverX === null) return null;
    const spotFrac = (hoverX - PAD.left) / PLOT_W;
    const hoverSpot = minSpot + spotFrac * spotRange;
    const idx = Math.round(spotFrac * (data.length - 1));
    const clamped = Math.max(0, Math.min(data.length - 1, idx));
    const pnl = data[clamped].pnl;
    const y = PAD.top + PLOT_H - ((pnl - minPnl) / pnlRange) * PLOT_H;
    return { spot: hoverSpot, pnl, x: hoverX, y };
  }, [hoverX, data, minSpot, spotRange, minPnl, pnlRange]);

  // SVG paths
  const fullPath = data
    .map((d, i) => {
      const x = toX(d.spot).toFixed(1);
      const y = toY(d.pnl).toFixed(1);
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    })
    .join("");

  const firstX = toX(data[0].spot).toFixed(1);
  const lastX = toX(data[data.length - 1].spot).toFixed(1);
  const areaPath = `${fullPath}L${lastX},${zeroY.toFixed(1)}L${firstX},${zeroY.toFixed(1)}Z`;

  // Tooltip positioning
  const tipX = hoverData
    ? hoverData.x > SVG_W / 2
      ? hoverData.x - 64
      : hoverData.x + 6
    : 0;

  return (
    <div className={isPositionMode ? "max-w-xl" : "w-full"}>
      {/* Position mode: compact stat header */}
      {isPositionMode && (
        <div className="mb-1 flex items-center gap-3 text-[10px]">
          <span className={`font-bold uppercase tracking-wider ${isLong ? "text-[#22c55e]" : "text-red-400"}`}>
            {isLong ? "Long" : "Short"} Payoff
          </span>
          <span className="text-zinc-600">
            Entry <span className="font-mono text-zinc-400">{formatSpotPrice(indexToSpot(entry))}</span>
          </span>
          <span className="text-zinc-600">
            Mark <span className="font-mono text-[#e1e4e8]">{formatSpotPrice(markSpot)}</span>
          </span>
          {markPnl !== null && (
            <span className={`font-mono font-bold ${markPnl >= 0 ? "text-[#22c55e]" : "text-red-400"}`}>
              {markPnl >= 0 ? "+" : ""}{formatUsd(markPnl)}
              {markPnlPct !== null && (
                <span className="ml-0.5 text-zinc-500 font-normal">
                  ({markPnlPct >= 0 ? "+" : ""}{markPnlPct.toFixed(1)}%)
                </span>
              )}
            </span>
          )}
          {liqSpot !== null && (
            <span className="text-zinc-600">
              Liq <span className="font-mono text-orange-400">{formatSpotPrice(liqSpot)}</span>
            </span>
          )}
        </div>
      )}

      {/* Preview mode header */}
      {!isPositionMode && (
        <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-zinc-600">
          {isLong ? "Long" : "Short"} Payoff
        </p>
      )}

      <svg
        ref={svgRef}
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="w-full cursor-crosshair"
        preserveAspectRatio="xMidYMid meet"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <defs>
          <linearGradient id={`${clipId}-profit-grad`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22c55e" stopOpacity={0.12} />
            <stop offset="100%" stopColor="#22c55e" stopOpacity={0.01} />
          </linearGradient>
          <linearGradient id={`${clipId}-loss-grad`} x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#ef4444" stopOpacity={0.12} />
            <stop offset="100%" stopColor="#ef4444" stopOpacity={0.01} />
          </linearGradient>
          <clipPath id={`${clipId}-profit`}>
            <rect
              x={PAD.left}
              y={PAD.top}
              width={PLOT_W}
              height={Math.max(0, zeroY - PAD.top)}
            />
          </clipPath>
          <clipPath id={`${clipId}-loss`}>
            <rect
              x={PAD.left}
              y={zeroY}
              width={PLOT_W}
              height={Math.max(0, SVG_H - PAD.bottom - zeroY)}
            />
          </clipPath>
        </defs>

        {/* Area fills */}
        <path d={areaPath} fill={`url(#${clipId}-profit-grad)`} clipPath={`url(#${clipId}-profit)`} />
        <path d={areaPath} fill={`url(#${clipId}-loss-grad)`} clipPath={`url(#${clipId}-loss)`} />

        {/* Zero line */}
        <line
          x1={PAD.left} y1={zeroY} x2={SVG_W - PAD.right} y2={zeroY}
          stroke="#30363d" strokeWidth={1}
        />

        {/* Entry marker */}
        <line
          x1={entryX} y1={PAD.top} x2={entryX} y2={SVG_H - PAD.bottom}
          stroke="#30363d" strokeWidth={1} strokeDasharray="3,3"
        />
        <text
          x={entryX} y={PAD.top - 2} textAnchor="middle"
          fill="#4b5563" fontSize={6} fontFamily="monospace"
        >
          entry
        </text>

        {/* Liquidation marker */}
        {liqX !== null && (
          <>
            <line
              x1={liqX} y1={PAD.top} x2={liqX} y2={SVG_H - PAD.bottom}
              stroke="#ef4444" strokeWidth={1} strokeDasharray="2,2"
            />
            <text
              x={liqX} y={PAD.top - 2} textAnchor="middle"
              fill="#ef4444" fontSize={6} fontFamily="monospace" fontWeight="bold"
            >
              liq
            </text>
          </>
        )}

        {/* Mark price (position mode) */}
        {isPositionMode && markX !== null && markY !== null && markPnl !== null && (
          <>
            <line
              x1={markX} y1={PAD.top} x2={markX} y2={SVG_H - PAD.bottom}
              stroke="#e1e4e8" strokeWidth={1} strokeDasharray="2,2"
            />
            <text
              x={markX} y={PAD.top - 2} textAnchor="middle"
              fill="#e1e4e8" fontSize={6} fontFamily="monospace" fontWeight="bold"
            >
              mark
            </text>
            <circle
              cx={markX} cy={markY} r={2.5}
              fill={markPnl >= 0 ? "#22c55e" : "#ef4444"}
              stroke="#0f1216" strokeWidth={1}
            />
          </>
        )}

        {/* Profit line */}
        <path
          d={fullPath} fill="none" stroke="#22c55e" strokeWidth={1.5}
          clipPath={`url(#${clipId}-profit)`}
        />
        {/* Loss line */}
        <path
          d={fullPath} fill="none" stroke="#ef4444" strokeWidth={1.5}
          clipPath={`url(#${clipId}-loss)`}
        />

        {/* Hover crosshair */}
        {hoverData && (
          <>
            <line
              x1={hoverData.x} y1={PAD.top} x2={hoverData.x} y2={SVG_H - PAD.bottom}
              stroke="#e1e4e8" strokeWidth={0.5} opacity={0.4}
            />
            <line
              x1={PAD.left} y1={hoverData.y} x2={SVG_W - PAD.right} y2={hoverData.y}
              stroke="#e1e4e8" strokeWidth={0.5} opacity={0.2} strokeDasharray="2,3"
            />
            <circle
              cx={hoverData.x} cy={hoverData.y} r={2.5}
              fill={hoverData.pnl >= 0 ? "#22c55e" : "#ef4444"}
            />
            <rect
              x={tipX} y={PAD.top} width={58} height={22}
              fill="#0f1216" stroke="#21262d" strokeWidth={0.5} rx={2}
            />
            <text
              x={tipX + 4} y={PAD.top + 9}
              fill="#e1e4e8" fontSize={6.5} fontFamily="monospace"
            >
              ${hoverData.spot.toFixed(2)}
            </text>
            <text
              x={tipX + 4} y={PAD.top + 18}
              fill={hoverData.pnl >= 0 ? "#22c55e" : "#ef4444"}
              fontSize={6.5} fontFamily="monospace"
            >
              {hoverData.pnl >= 0 ? "+" : ""}
              {formatUsd(hoverData.pnl)}
            </text>
          </>
        )}

        {/* Y-axis labels */}
        <text
          x={PAD.left - 3} y={toY(maxPnl) + 3} textAnchor="end"
          fill="#22c55e" fontSize={7} fontFamily="monospace" opacity={0.7}
        >
          +{formatUsd(maxPnl)}
        </text>
        <text
          x={PAD.left - 3} y={zeroY + 3} textAnchor="end"
          fill="#4b5563" fontSize={7} fontFamily="monospace"
        >
          $0
        </text>
        <text
          x={PAD.left - 3} y={toY(minPnl) + 3} textAnchor="end"
          fill="#ef4444" fontSize={7} fontFamily="monospace" opacity={0.7}
        >
          {formatUsd(minPnl)}
        </text>

        {/* X-axis labels */}
        <text
          x={toX(minSpot)} y={SVG_H - 2} textAnchor="start"
          fill="#555" fontSize={7} fontFamily="monospace"
        >
          {formatSpotPrice(minSpot)}
        </text>
        <text
          x={isPositionMode ? toX(markSpot) : entryX}
          y={SVG_H - 2} textAnchor="middle"
          fill="#e1e4e8" fontSize={7} fontFamily="monospace"
        >
          {formatSpotPrice(isPositionMode ? markSpot : spotVal)}
        </text>
        <text
          x={toX(maxSpot)} y={SVG_H - 2} textAnchor="end"
          fill="#555" fontSize={7} fontFamily="monospace"
        >
          {formatSpotPrice(maxSpot)}
        </text>
      </svg>
    </div>
  );
}
