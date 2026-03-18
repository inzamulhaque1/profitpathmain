import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refer a Friend — Get 1 Day Unlimited Generations",
  description:
    "Share your referral link with friends. When they sign up, you get 1 day of unlimited AI generations. Days are stackable — the more you share, the more you earn!",
  keywords: [
    "profitpath referral",
    "refer a friend",
    "free unlimited generations",
    "ai tools referral program",
  ],
  openGraph: {
    title: "Refer a Friend — Get Free Unlimited Generations | ProfitPath",
    description:
      "Share your link, friends sign up, you get 1 day unlimited. Stackable!",
    url: "https://profitpath.online/referral",
  },
  twitter: {
    card: "summary_large_image",
    title: "Refer & Earn | ProfitPath",
    description: "Get free unlimited AI generations by referring friends.",
  },
  alternates: {
    canonical: "https://profitpath.online/referral",
  },
};

export default function ReferralLayout({ children }: { children: React.ReactNode }) {
  return children;
}
