"use client";

import {
  useSimulatedRealizedVol,
  useEffectiveImpliedVol,
  useVolRiskPremium,
  useObservationCount,
  useLastObservationTimestamp,
} from "@/hooks/useVolatility";
import { useBaseVolatility } from "@/hooks/useFunding";
import { wadToNumber, formatPercent } from "@/lib/format";

export function VolatilityPanel() {
  const { data: simRealizedVol } = useSimulatedRealizedVol();
  const { data: effectiveImpliedVol } = useEffectiveImpliedVol();
  const { data: volRiskPremium } = useVolRiskPremium();
  const { data: baseVol } = useBaseVolatility();
  const { data: obsCount } = useObservationCount();
  const { data: lastObs } = useLastObservationTimestamp();

  const realized =
    simRealizedVol !== undefined ? wadToNumber(simRealizedVol) : undefined;
  const implied =
    effectiveImpliedVol !== undefined
      ? wadToNumber(effectiveImpliedVol)
      : undefined;
  const premium =
    volRiskPremium !== undefined ? wadToNumber(volRiskPremium) : undefined;
  const sigma =
    baseVol !== undefined ? wadToNumber(baseVol) : undefined;
  const observations =
    obsCount !== undefined ? Number(obsCount) : undefined;

  // How stale is the last observation?
  const lastObsAge =
    lastObs !== undefined
      ? Math.max(0, Math.floor(Date.now() / 1000) - Number(lastObs))
      : undefined;

  const premiumColor =
    premium !== undefined
      ? premium > 0.02
        ? "text-[#ef4444]" // overpriced (>2pp)
        : premium < -0.02
          ? "text-[#22c55e]" // underpriced
          : "text-white" // fair
      : "text-white";

  const initialized = observations !== undefined && observations >= 1;

  return (
    <div className="rounded-lg border border-[#21262d] bg-[#0d1117] p-4">
      <h3 className="mb-3 text-sm font-medium text-zinc-400">
        Volatility Oracle
      </h3>

      {!initialized ? (
        <div className="text-center text-sm text-zinc-500 py-6">
          <p>Vol oracle not yet initialized</p>
          <p className="text-[10px] mt-1">
            Waiting for first observation from vol keeper
          </p>
        </div>
      ) : (
        <>
          {/* Realized vs Implied */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <span className="text-xs text-zinc-500">Realized Vol</span>
              <div className="font-mono text-lg font-semibold text-white">
                {realized !== undefined ? formatPercent(realized) : "---"}
              </div>
              <span className="text-[10px] text-zinc-600">EWMA annualized</span>
            </div>
            <div>
              <span className="text-xs text-zinc-500">Implied Vol</span>
              <div className="font-mono text-lg font-semibold text-white">
                {implied !== undefined ? formatPercent(implied) : "---"}
              </div>
              <span className="text-[10px] text-zinc-600">from funding rate</span>
            </div>
          </div>

          {/* Vol Risk Premium bar */}
          <div className="mb-4">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-zinc-500">Vol Risk Premium</span>
              <span className={`font-mono text-sm font-semibold ${premiumColor}`}>
                {premium !== undefined
                  ? `${premium > 0 ? "+" : ""}${(premium * 100).toFixed(2)}pp`
                  : "---"}
              </span>
            </div>
            {premium !== undefined && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[10px] text-zinc-600 w-16 text-right">
                  Cheap
                </span>
                <div className="relative h-2 flex-1 rounded-full bg-[#161b22]">
                  {/* Center marker */}
                  <div className="absolute left-1/2 top-0 h-2 w-px bg-zinc-600" />
                  {/* Premium indicator */}
                  <div
                    className="absolute top-0 h-2 w-2 rounded-full"
                    style={{
                      // Clamp to [-50pp, +50pp] for display
                      left: `${Math.min(Math.max(50 + premium * 100, 5), 95)}%`,
                      backgroundColor:
                        premium > 0.02
                          ? "#ef4444"
                          : premium < -0.02
                            ? "#22c55e"
                            : "#a1a1aa",
                      transform: "translateX(-50%)",
                    }}
                  />
                </div>
                <span className="text-[10px] text-zinc-600 w-16">
                  Expensive
                </span>
              </div>
            )}
            <p className="mt-1 text-[10px] text-zinc-600">
              {premium !== undefined
                ? premium > 0.02
                  ? "Vol overpriced — longs overpaying for convexity"
                  : premium < -0.02
                    ? "Vol underpriced — longs getting cheap gamma"
                    : "Vol fairly priced"
                : ""}
            </p>
          </div>

          {/* Bottom stats */}
          <div className="grid grid-cols-3 gap-2 border-t border-[#21262d] pt-3">
            <div>
              <span className="text-[10px] text-zinc-500">Base Sigma</span>
              <div className="font-mono text-xs text-white">
                {sigma !== undefined ? formatPercent(sigma) : "---"}
              </div>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500">Observations</span>
              <div className="font-mono text-xs text-white">
                {observations !== undefined ? observations.toLocaleString() : "---"}
              </div>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500">Last Update</span>
              <div className="font-mono text-xs text-white">
                {lastObsAge !== undefined
                  ? lastObsAge < 60
                    ? `${lastObsAge}s ago`
                    : lastObsAge < 3600
                      ? `${Math.floor(lastObsAge / 60)}m ago`
                      : `${Math.floor(lastObsAge / 3600)}h ago`
                  : "---"}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
