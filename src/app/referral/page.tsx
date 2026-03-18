"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function ReferralPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [referralCode, setReferralCode] = useState("");
  const [referralCount, setReferralCount] = useState(0);
  const [hasUnlimited, setHasUnlimited] = useState(false);
  const [unlimitedUntil, setUnlimitedUntil] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchReferral = useCallback(async () => {
    try {
      const res = await fetch("/api/referral");
      if (res.ok) {
        const data = await res.json();
        setReferralCode(data.referralCode);
        setReferralCount(data.referralCount || 0);
        setHasUnlimited(data.hasUnlimited);
        setUnlimitedUntil(data.unlimitedUntil);
      }
    } catch (err) {
      console.error("Failed to fetch referral:", err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/referral");
    }
    if (status === "authenticated") {
      fetchReferral();
    }
  }, [status, router, fetchReferral]);

  const referralLink = typeof window !== "undefined"
    ? `${window.location.origin}/register?ref=${referralCode}`
    : "";

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement("input");
      input.value = referralLink;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-brand-200 border-t-brand-600 animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-3 sm:px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🎁</div>
          <h1 className="text-2xl font-bold text-gray-800">Refer a Friend</h1>
          <p className="text-gray-500 mt-2">
            Share your link — when a friend signs up, you get <span className="font-bold text-green-600">1 day of unlimited generations!</span>
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          {/* Referral Link */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">Your Referral Link</label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={referralLink}
                className="flex-1 px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 text-sm"
              />
              <button
                onClick={handleCopy}
                className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                  copied
                    ? "bg-green-500 text-white"
                    : "bg-brand-600 hover:bg-brand-700 text-white"
                }`}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-gray-800">{referralCount}</div>
              <div className="text-xs text-gray-500 mt-1">Friends Referred</div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {hasUnlimited ? "Active" : "Inactive"}
              </div>
              <div className="text-xs text-gray-500 mt-1">Unlimited Status</div>
            </div>
          </div>

          {/* Unlimited badge */}
          {hasUnlimited && unlimitedUntil && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
              <p className="text-green-700 font-semibold">
                Unlimited generations active until{" "}
                {new Date(unlimitedUntil).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
            </div>
          )}

          {/* How it works */}
          <div className="border-t border-gray-100 pt-4">
            <h3 className="font-semibold text-gray-800 mb-3">How it works</h3>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                <p className="text-sm text-gray-600">Share your referral link with friends</p>
              </div>
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                <p className="text-sm text-gray-600">They sign up using your link</p>
              </div>
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                <p className="text-sm text-gray-600">You get 1 day of unlimited generations (stackable!)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
