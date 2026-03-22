"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const REFERRAL_KEY = "paraflux_referral_code";
const REFERRAL_MAX_LENGTH = 32;
const REFERRAL_PATTERN = /^[a-zA-Z0-9_-]+$/;

function isValidReferral(code: string): boolean {
  return code.length > 0 && code.length <= REFERRAL_MAX_LENGTH && REFERRAL_PATTERN.test(code);
}

export function useReferral() {
  const searchParams = useSearchParams();
  const [referralCode, setReferralCode] = useState<string | null>(null);

  useEffect(() => {
    // Check URL for ?ref=<code>
    const refParam = searchParams.get("ref");
    if (refParam && isValidReferral(refParam)) {
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
