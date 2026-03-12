"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const REFERRAL_KEY = "paraflux_referral_code";

export function useReferral() {
  const searchParams = useSearchParams();
  const [referralCode, setReferralCode] = useState<string | null>(null);

  useEffect(() => {
    // Check URL for ?ref=<code>
    const refParam = searchParams.get("ref");
    if (refParam) {
      localStorage.setItem(REFERRAL_KEY, refParam);
      setReferralCode(refParam);
      return;
    }

    // Fall back to stored code
    const stored = localStorage.getItem(REFERRAL_KEY);
    if (stored) {
      setReferralCode(stored);
    }
  }, [searchParams]);

  const clearReferral = () => {
    localStorage.removeItem(REFERRAL_KEY);
    setReferralCode(null);
  };

  return { referralCode, clearReferral };
}
