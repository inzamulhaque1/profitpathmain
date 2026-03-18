import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upgrade to Pro — Unlimited AI Generations",
  description:
    "Get unlimited AI generations with ProfitPath Pro. No daily limits, no ads, no promo tasks. Just 200 BDT/month via bKash. Use code NEW50 for 50% off your first month.",
  keywords: [
    "profitpath pro",
    "unlimited ai generations",
    "ai tools subscription",
    "bkash payment",
    "pro plan",
  ],
  openGraph: {
    title: "Upgrade to Pro — Unlimited AI Generations | ProfitPath",
    description:
      "Get unlimited AI generations with ProfitPath Pro. No daily limits, no ads. Just 200 BDT/month.",
    url: "https://profitpath.online/pro",
  },
  twitter: {
    card: "summary_large_image",
    title: "Upgrade to Pro | ProfitPath",
    description: "Unlimited AI generations for just 200 BDT/month.",
  },
  alternates: {
    canonical: "https://profitpath.online/pro",
  },
};

export default function ProLayout({ children }: { children: React.ReactNode }) {
  return children;
}
