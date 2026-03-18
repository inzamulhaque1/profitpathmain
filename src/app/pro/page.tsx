"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface PaymentReq {
  _id: string;
  bkashNumber: string;
  transactionId: string;
  amount: number;
  couponCode: string;
  status: "pending" | "approved" | "rejected";
  adminNote: string;
  createdAt: string;
}

export default function ProPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isPro, setIsPro] = useState(false);
  const [proExpiry, setProExpiry] = useState<string | null>(null);
  const [requests, setRequests] = useState<PaymentReq[]>([]);
  const [loading, setLoading] = useState(true);

  const [bkashNumber, setBkashNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/payment");
      if (res.ok) {
        const data = await res.json();
        setIsPro(data.isPro);
        setProExpiry(data.proExpiry);
        setRequests(data.requests || []);
      }
    } catch (err) {
      console.error("Failed to fetch:", err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/pro");
    }
    if (status === "authenticated") {
      fetchData();
    }
  }, [status, router, fetchData]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bkashNumber, transactionId, couponCode }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
      } else {
        setMessage(`Payment request submitted! Amount: ${data.amount} BDT${data.couponApplied ? ` (coupon: ${data.couponApplied})` : ""}. Waiting for admin approval.`);
        setBkashNumber("");
        setTransactionId("");
        setCouponCode("");
        fetchData();
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setSubmitting(false);
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-brand-200 border-t-brand-600 animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  const hasPending = requests.some((r) => r.status === "pending");

  return (
    <div className="min-h-[80vh] py-8 px-3 sm:px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">👑</div>
          <h1 className="text-2xl font-bold text-gray-800">Upgrade to Pro</h1>
          <p className="text-gray-500 mt-2">
            Get <span className="font-bold text-brand-600">unlimited generations</span> for just 200 BDT/month
          </p>
        </div>

        {/* Pro Status */}
        {isPro && proExpiry && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6 text-center">
            <div className="text-3xl mb-2">👑</div>
            <p className="text-green-700 font-bold text-lg">You are a Pro member!</p>
            <p className="text-green-600 text-sm mt-1">
              Unlimited generations until{" "}
              {new Date(proExpiry).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pricing Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-bold text-lg text-gray-900 mb-4">Pro Plan</h2>
            <div className="flex items-baseline gap-1 mb-4">
              <span className="text-4xl font-bold text-gray-900">200</span>
              <span className="text-gray-500">BDT/month</span>
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-green-500">&#10003;</span> Unlimited generations
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-green-500">&#10003;</span> No daily limits
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-green-500">&#10003;</span> No promo tasks required
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-green-500">&#10003;</span> All tools included
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <span className="text-green-500">&#10003;</span> Priority support
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm font-medium text-yellow-800">
                Use code <span className="font-mono bg-yellow-200 px-1.5 py-0.5 rounded text-yellow-900">new50</span> to get 50% off your first month!
              </p>
              <p className="text-xs text-yellow-600 mt-1">First month only: 100 BDT</p>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-bold text-lg text-gray-900 mb-4">Pay via bKash</h2>

            {/* bKash Instructions */}
            <div className="bg-pink-50 border border-pink-200 rounded-lg p-4 mb-4">
              <p className="text-sm font-semibold text-pink-800 mb-2">Send Money to:</p>
              <p className="text-2xl font-bold text-pink-700 font-mono">01728005274</p>
              <p className="text-xs text-pink-600 mt-2">
                Open bKash app &rarr; Send Money &rarr; Enter number &rarr; Amount: 200 BDT (or 100 with coupon) &rarr; Send &rarr; Copy Transaction ID
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-red-600 text-sm">{error}</div>
            )}
            {message && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 text-green-600 text-sm">{message}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Your bKash Number</label>
                <input
                  type="text"
                  value={bkashNumber}
                  onChange={(e) => setBkashNumber(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Transaction ID</label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="e.g. TXN123456789"
                  required
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-brand-500"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Coupon Code (optional)</label>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="e.g. new50"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-brand-500"
                />
              </div>
              <button
                type="submit"
                disabled={submitting || hasPending}
                className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-gray-300 text-white font-semibold py-2.5 rounded-lg transition text-sm"
              >
                {hasPending ? "Request Pending..." : submitting ? "Submitting..." : "Submit Payment"}
              </button>
              {hasPending && (
                <p className="text-xs text-orange-600 text-center">You have a pending request. Please wait for admin approval.</p>
              )}
            </form>
          </div>
        </div>

        {/* Payment History */}
        {requests.length > 0 && (
          <div className="mt-8">
            <h3 className="font-semibold text-gray-800 mb-3">Payment History</h3>
            <div className="space-y-2">
              {requests.map((req) => (
                <div key={req._id} className={`bg-white rounded-lg border p-4 flex flex-wrap items-center justify-between gap-2 ${
                  req.status === "pending" ? "border-orange-200" : req.status === "approved" ? "border-green-200" : "border-red-200"
                }`}>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {req.amount} BDT {req.couponCode && <span className="text-xs text-gray-400">(coupon: {req.couponCode})</span>}
                    </p>
                    <p className="text-xs text-gray-500">TXN: {req.transactionId} | From: {req.bkashNumber}</p>
                    {req.adminNote && <p className="text-xs text-gray-500 mt-1">Note: {req.adminNote}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{new Date(req.createdAt).toLocaleDateString()}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      req.status === "pending" ? "bg-orange-100 text-orange-700" :
                      req.status === "approved" ? "bg-green-100 text-green-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {req.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
