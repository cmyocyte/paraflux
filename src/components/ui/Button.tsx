"use client";

import { clsx } from "clsx";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#22c55e] hover:bg-[#16a34a] text-[#0b0e11] font-semibold disabled:bg-[#22c55e]/30 disabled:text-[#0b0e11]/50",
  secondary:
    "bg-[#161b22] hover:bg-[#21262d] text-[#22c55e] border border-[#21262d] hover:border-[#22c55e]/30 disabled:opacity-40",
  danger:
    "bg-red-600 hover:bg-red-500 text-white font-bold disabled:bg-red-900 disabled:text-red-400",
  ghost:
    "bg-transparent hover:bg-[#161b22] text-zinc-400 hover:text-[#22c55e] disabled:text-zinc-700",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-xs",
  lg: "px-6 py-3 text-sm",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#22c55e]/40 focus:ring-offset-1 focus:ring-offset-[#0b0e11]",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="h-4 w-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
