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

const BASE_PRICE = 200;

export default function ProPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isPro, setIsPro] = useState(false);
  const [proExpiry, setProExpiry] = useState<string | null>(null);
  const [requests, setRequests] = useState<PaymentReq[]>([]);
  const [loading, setLoading] = useState(true);

  const [step, setStep] = useState<"plan" | "pay" | "done">("plan");
  const [bkashNumber, setBkashNumber] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [finalPrice, setFinalPrice] = useState(BASE_PRICE);
  const [submitting, setSubmitting] = useState(false);
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
    if (status === "unauthenticated") router.push("/login?callbackUrl=/pro");
    if (status === "authenticated") fetchData();
  }, [status, router, fetchData]);

  function applyCoupon() {
    const code = couponCode.toLowerCase().trim();
    if (code === "new50") {
      setCouponApplied(true);
      setFinalPrice(Math.round(BASE_PRICE * 0.5));
    } else {
      setCouponApplied(false);
      setFinalPrice(BASE_PRICE);
      setError("Invalid coupon code");
      setTimeout(() => setError(""), 2000);
    }
  }

  function removeCoupon() {
    setCouponCode("");
    setCouponApplied(false);
    setFinalPrice(BASE_PRICE);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bkashNumber, transactionId, couponCode: couponApplied ? couponCode : "" }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
      } else {
        setStep("done");
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
      <div className="max-w-xl mx-auto">

        {/* Already Pro */}
        {isPro && proExpiry && (
          <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 p-6 text-white shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative text-center">
              <p className="text-4xl mb-2">👑</p>
              <h2 className="text-2xl font-bold">You&apos;re Pro!</h2>
              <p className="text-white/90 mt-1">
                Unlimited until{" "}
                <span className="font-bold">
                  {new Date(proExpiry).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Step: Choose Plan */}
        {step === "plan" && !hasPending && (
          <>
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Upgrade to Pro</h1>
              <p className="text-gray-500 mt-1 text-sm">Unlimited AI generations. No limits. No ads.</p>
            </div>

            {/* Pricing Card */}
            <div className="bg-white rounded-2xl border-2 border-brand-500 shadow-lg overflow-hidden mb-6">
              <div className="bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3 text-center">
                <span className="text-white text-sm font-semibold tracking-wide uppercase">Most Popular</span>
              </div>
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center gap-1">
                    {couponApplied && (
                      <span className="text-xl text-gray-400 line-through mr-1">{BASE_PRICE}</span>
                    )}
                    <span className="text-5xl font-extrabold text-gray-900">{finalPrice}</span>
                    <span className="text-gray-500 text-lg">BDT</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">per month</p>
                  {couponApplied && (
                    <div className="mt-2 inline-flex items-center gap-1.5 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                      <span>50% OFF applied!</span>
                      <span className="text-green-500">You save {BASE_PRICE - finalPrice} BDT</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  {["Unlimited generations", "All AI tools included", "No daily limits or ads", "No promo tasks required", "Priority support"].map((f) => (
                    <div key={f} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-700">{f}</span>
                    </div>
                  ))}
                </div>

                {/* Coupon */}
                <div className="border-t border-gray-100 pt-4 mb-4">
                  {!couponApplied ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Have a coupon code?"
                        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-brand-500"
                      />
                      <button
                        onClick={applyCoupon}
                        disabled={!couponCode.trim()}
                        className="px-4 py-2 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white text-sm font-medium rounded-lg transition"
                      >
                        Apply
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-green-600 text-sm font-semibold">Coupon: {couponCode.toUpperCase()}</span>
                        <span className="text-green-500 text-xs">(-50%)</span>
                      </div>
                      <button onClick={removeCoupon} className="text-red-400 hover:text-red-600 text-sm font-medium">Remove</button>
                    </div>
                  )}
                  {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
                </div>

                <button
                  onClick={() => setStep("pay")}
                  className="w-full bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 text-white font-bold py-3.5 rounded-xl transition text-sm shadow-lg shadow-brand-500/25"
                >
                  Pay {finalPrice} BDT via bKash
                </button>
              </div>
            </div>
          </>
        )}

        {/* Step: bKash Payment */}
        {step === "pay" && !hasPending && (
          <>
            <button onClick={() => setStep("plan")} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Back
            </button>

            {/* bKash Card */}
            <div className="bg-gradient-to-br from-[#E2136E] to-[#A4004F] rounded-2xl p-6 text-white shadow-xl mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                  <span className="text-[#E2136E] font-extrabold text-sm">bKash</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">Send Money</p>
                  <p className="text-white/70 text-xs">Personal Account</p>
                </div>
              </div>

              <div className="bg-white/15 backdrop-blur rounded-xl p-4 mb-4">
                <p className="text-white/80 text-xs mb-1">Send to this number</p>
                <p className="text-3xl font-bold tracking-wider">01728005274</p>
              </div>

              <div className="bg-white/15 backdrop-blur rounded-xl p-4">
                <p className="text-white/80 text-xs mb-1">Amount to send</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold">{finalPrice}</p>
                  <p className="text-white/80">BDT</p>
                  {couponApplied && (
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">coupon applied</span>
                  )}
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-white/90 text-xs font-medium">Steps:</p>
                <div className="flex items-start gap-2 text-xs text-white/80">
                  <span className="bg-white/20 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold">1</span>
                  Open bKash app &rarr; <strong className="text-white">Send Money</strong>
                </div>
                <div className="flex items-start gap-2 text-xs text-white/80">
                  <span className="bg-white/20 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold">2</span>
                  Enter <strong className="text-white">01728005274</strong> &rarr; Amount: <strong className="text-white">{finalPrice} BDT</strong>
                </div>
                <div className="flex items-start gap-2 text-xs text-white/80">
                  <span className="bg-white/20 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold">3</span>
                  Confirm &rarr; <strong className="text-white">Copy Transaction ID</strong> from SMS
                </div>
              </div>
            </div>

            {/* Submit Form */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Confirm Your Payment</h3>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-red-600 text-sm">{error}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1.5">Your bKash Number</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    </div>
                    <input
                      type="text"
                      value={bkashNumber}
                      onChange={(e) => setBkashNumber(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#E2136E] focus:ring-2 focus:ring-[#E2136E]/10"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1.5">Transaction ID (from SMS)</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <input
                      type="text"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      placeholder="e.g. BI7A2K5M0P"
                      required
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#E2136E] focus:ring-2 focus:ring-[#E2136E]/10"
                    />
                  </div>
                </div>

                {/* Amount Summary */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Pro Plan (1 month)</span>
                    <span className="text-gray-700">{BASE_PRICE} BDT</span>
                  </div>
                  {couponApplied && (
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-green-600">Coupon ({couponCode.toUpperCase()})</span>
                      <span className="text-green-600">-{BASE_PRICE - finalPrice} BDT</span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-gray-900 text-lg">{finalPrice} BDT</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-[#E2136E] to-[#A4004F] hover:from-[#C91060] hover:to-[#8A0040] disabled:from-gray-300 disabled:to-gray-300 text-white font-bold py-3.5 rounded-xl transition text-sm shadow-lg"
                >
                  {submitting ? "Submitting..." : "Submit Payment for Review"}
                </button>
                <p className="text-[10px] text-gray-400 text-center">Admin will verify your transaction and activate Pro within 24 hours</p>
              </form>
            </div>
          </>
        )}

        {/* Step: Done / Pending */}
        {(step === "done" || hasPending) && (
          <div className="text-center">
            <div className="bg-white rounded-2xl border border-orange-200 p-8 shadow-sm mb-6">
              <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Payment Under Review</h2>
              <p className="text-gray-500 text-sm mb-4">
                Your payment is being verified. Pro will be activated within 24 hours.
              </p>
              <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 px-4 py-2 rounded-full text-sm font-medium">
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                Pending Approval
              </div>
            </div>
          </div>
        )}

        {/* Payment History */}
        {requests.length > 0 && (
          <div className="mt-8">
            <h3 className="font-semibold text-gray-800 mb-3">Payment History</h3>
            <div className="space-y-2">
              {requests.map((req) => (
                <div key={req._id} className={`bg-white rounded-xl border p-4 ${
                  req.status === "pending" ? "border-orange-200" : req.status === "approved" ? "border-green-200" : "border-red-200"
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">{req.amount} BDT</span>
                        {req.couponCode && (
                          <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">
                            {req.couponCode}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">TXN: {req.transactionId}</p>
                      {req.adminNote && <p className="text-xs text-gray-500 mt-1">Note: {req.adminNote}</p>}
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                        req.status === "pending" ? "bg-orange-100 text-orange-700" :
                        req.status === "approved" ? "bg-green-100 text-green-700" :
                        "bg-red-100 text-red-700"
                      }`}>{req.status}</span>
                      <p className="text-[10px] text-gray-400 mt-1">{new Date(req.createdAt).toLocaleDateString()}</p>
                    </div>
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
