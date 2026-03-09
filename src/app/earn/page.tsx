"use client";

import { useState } from "react";
import { VaultStats } from "@/components/earn/VaultStats";
import { YourPosition } from "@/components/earn/YourPosition";
import { DepositForm } from "@/components/earn/DepositForm";
import { WithdrawForm } from "@/components/earn/WithdrawForm";
import { VaultHealth } from "@/components/earn/VaultHealth";
import { LPFaq } from "@/components/earn/LPFaq";
import { AnchorStats } from "@/components/earn/AnchorStats";
import { AnchorPosition } from "@/components/earn/AnchorPosition";
import { AnchorDepositForm } from "@/components/earn/AnchorDepositForm";
import { AnchorWithdrawForm } from "@/components/earn/AnchorWithdrawForm";
import { AnchorInfo } from "@/components/earn/AnchorInfo";
import { SurgeStats } from "@/components/earn/SurgeStats";
import { SurgeDepositForm } from "@/components/earn/SurgeDepositForm";
import { SurgeWithdrawForm } from "@/components/earn/SurgeWithdrawForm";
import { SurgeInfo } from "@/components/earn/SurgeInfo";

type VaultTab = "lp" | "anchor" | "surge";

export default function EarnPage() {
  const [activeTab, setActiveTab] = useState<VaultTab>("lp");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-bold text-white">Earn</h1>
      <p className="mt-1 text-xs text-zinc-500">
        Deposit USDC to earn yield. Choose your strategy.
      </p>

      {/* Vault selector tabs */}
      <div className="mt-6 flex gap-1 rounded-lg border border-[#21262d] bg-[#0f1216] p-1">
        <button
          className={`flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
            activeTab === "lp"
              ? "bg-[#22c55e]/10 text-[#22c55e]"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
          onClick={() => setActiveTab("lp")}
        >
          <span className="font-semibold">LP Vault</span>
          <span className="ml-2 text-xs text-zinc-500">Earn fees from trades</span>
        </button>
        <button
          className={`flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
            activeTab === "anchor"
              ? "bg-[#22c55e]/10 text-[#22c55e]"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
          onClick={() => setActiveTab("anchor")}
        >
          <span className="font-semibold">Anchor Strategy</span>
          <span className="ml-2 text-xs text-zinc-500">Delta-neutral yield</span>
        </button>
        <button
          className={`flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
            activeTab === "surge"
              ? "bg-[#22c55e]/10 text-[#22c55e]"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
          onClick={() => setActiveTab("surge")}
        >
          <span className="font-semibold">Surge</span>
          <span className="ml-2 text-xs text-zinc-500">Long + funding yield</span>
        </button>
      </div>

      {/* LP Vault tab */}
      {activeTab === "lp" && (
        <>
          <div className="mt-6">
            <VaultStats />
          </div>
          <div className="mt-6">
            <YourPosition />
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <DepositForm />
            <WithdrawForm />
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <VaultHealth />
            <LPFaq />
          </div>
        </>
      )}

      {/* Anchor Strategy tab */}
      {activeTab === "anchor" && (
        <>
          <div className="mt-6">
            <AnchorStats />
          </div>
          <div className="mt-6">
            <AnchorPosition />
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <AnchorDepositForm />
            <AnchorWithdrawForm />
          </div>
          <div className="mt-6">
            <AnchorInfo />
          </div>
        </>
      )}

      {/* Surge tab */}
      {activeTab === "surge" && (
        <>
          <div className="mt-6">
            <SurgeStats />
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <SurgeDepositForm />
            <SurgeWithdrawForm />
          </div>
          <div className="mt-6">
            <SurgeInfo />
          </div>
        </>
      )}
    </div>
  );
}
