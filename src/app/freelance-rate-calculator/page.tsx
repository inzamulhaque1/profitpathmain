import { Metadata } from "next";
import ToolPageLayout from "@/components/shared/ToolPageLayout";
import FreelanceRateForm from "@/components/tools/FreelanceRateForm";

export const metadata: Metadata = {
  title: "Freelance Rate Calculator — Find Your Ideal Hourly Rate",
  description:
    "Calculate your ideal freelance hourly and project rates based on income goals, expenses, and availability. Free tool for freelancers.",
  keywords: [
    "freelance rate calculator",
    "hourly rate calculator",
    "freelancer pricing",
    "project rate calculator",
  ],
  openGraph: {
    title: "Freelance Rate Calculator — Free Tool",
    description: "Calculate your ideal freelance rate instantly.",
    url: "https://profitpath.online/freelance-rate-calculator",
  },
  alternates: {
    canonical: "https://profitpath.online/freelance-rate-calculator",
  },
};

const faqItems = [
  {
    q: "How is my freelance rate calculated?",
    a: "We take your desired annual income, add business expenses, apply your profit margin target, then divide by your total billable hours (accounting for vacation). The result is rounded up to the nearest $5.",
  },
  {
    q: "What profit margin should I target?",
    a: "Most successful freelancers target 20-30% profit margin. This covers unexpected expenses, savings, and business growth. Start with 20% and adjust based on your industry.",
  },
  {
    q: "Should I charge hourly or per project?",
    a: "Project-based pricing is generally better for experienced freelancers — it rewards efficiency. Use the hourly rate as a baseline to calculate fair project prices.",
  },
];

export default function FreelanceRateCalculatorPage() {
  return (
    <ToolPageLayout
      title="Freelance Rate Calculator"
      description="Calculate your ideal hourly and project rates based on your income goals, expenses, and availability."
      slug="freelance-rate-calculator"
      faqItems={faqItems}
      affiliateContext="freelance"
    >
      <FreelanceRateForm />
    </ToolPageLayout>
  );
}
