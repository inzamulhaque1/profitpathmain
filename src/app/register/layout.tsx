import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a free ProfitPath account. Get unlimited AI generations, save your work, and access all tools.",
  robots: { index: false, follow: false },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
