"use client";

import { clsx } from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  suffix?: string;
  error?: string;
}

export function Input({
  label,
  suffix,
  error,
  className,
  ...props
}: InputProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={clsx(
            "w-full rounded border border-[#21262d] bg-[#0b0e11] px-2.5 py-1.5 font-mono text-sm text-[#e1e4e8] placeholder-zinc-600 transition-colors focus:border-[#22c55e]/50 focus:outline-none focus:ring-1 focus:ring-[#22c55e]/30",
            suffix && "pr-16",
            error && "border-red-600 focus:border-red-500 focus:ring-red-500/30",
            className
          )}
          {...props}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold uppercase tracking-wider text-zinc-600">
            {suffix}
          </span>
        )}
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
