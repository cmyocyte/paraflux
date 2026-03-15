"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { clsx } from "clsx";
import { useState, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

import { EXPECTED_CHAIN_ID } from "@/config/contracts";

const NAV_LINKS = [
  { href: "/trade", label: "Trade" },
  { href: "/earn", label: "Earn" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/analytics", label: "Analytics" },
  ...(EXPECTED_CHAIN_ID === 998
    ? [{ href: "/faucet", label: "Faucet" }]
    : []),
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/" || pathname === "";
  const isActive = (href: string) =>
    pathname === href || pathname === `${href}/`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-[#21262d] bg-[#0b0e11]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-display text-lg font-bold tracking-tight text-white">
            Para<span className="text-[#22c55e]">flux</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "rounded px-3 py-1.5 text-[13px] font-medium transition-all",
                isActive(link.href)
                  ? "bg-[#22c55e]/10 text-[#22c55e]"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Wallet + sticky CTA + mobile toggle */}
        <div className="flex items-center gap-3">
          <AnimatePresence>
            {isHome && scrolled && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, width: 0 }}
                animate={{ opacity: 1, scale: 1, width: "auto" }}
                exit={{ opacity: 0, scale: 0.9, width: 0 }}
                transition={{ duration: 0.2 }}
                className="hidden overflow-hidden md:block"
              >
                <Link
                  href="/trade"
                  className="whitespace-nowrap rounded-md bg-[#22c55e] px-4 py-1.5 text-xs font-semibold text-[#0b0e11] transition-colors hover:bg-[#16a34a]"
                >
                  Start Trading
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
          <ConnectButton
            chainStatus="icon"
            showBalance={false}
            accountStatus="address"
          />
          <button
            className="rounded p-2 text-zinc-500 hover:text-zinc-300 md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <XMarkIcon className="h-5 w-5" />
            ) : (
              <Bars3Icon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="border-t border-[#21262d] px-4 py-3 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={clsx(
                "block rounded px-3 py-2 text-[13px] font-medium",
                isActive(link.href)
                  ? "bg-[#22c55e]/10 text-[#22c55e]"
                  : "text-zinc-400 hover:text-zinc-200"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
