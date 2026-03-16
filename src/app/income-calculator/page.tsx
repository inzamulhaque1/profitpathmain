import { Metadata } from "next";
import ToolPageLayout from "@/components/shared/ToolPageLayout";
import IncomeCalculatorForm from "@/components/tools/IncomeCalculatorForm";

export const metadata: Metadata = {
  title: "Income / Profit Calculator — Free Side Hustle Calculator",
  description:
    "Calculate your monthly profit from multiple side hustles and gigs. See gross income, expenses, net profit, margins, and after-tax income instantly.",
  keywords: [
    "income calculator",
    "profit calculator",
    "side hustle calculator",
    "gig income calculator",
  ],
  openGraph: {
    title: "Income / Profit Calculator — Free Tool",
    description: "Calculate your monthly profit from side hustles instantly.",
    url: "https://profitpath.online/income-calculator",
  },
  alternates: { canonical: "https://profitpath.online/income-calculator" },
};

const faqItems = [
  {
    q: "How does the income calculator work?",
    a: "Enter your income sources with their monthly revenue and expenses. The calculator instantly shows your gross income, total expenses, net profit, profit margin, and after-tax income.",
  },
  {
    q: "Can I add multiple income sources?",
    a: "Yes! Click 'Add another income source' to track as many side hustles and gigs as you want. The calculator shows a breakdown of each source's contribution.",
  },
  {
    q: "Is this calculator accurate for tax purposes?",
    a: "This calculator provides estimates for planning purposes. For accurate tax calculations, consult a tax professional or accountant.",
  },
];

export default function IncomeCalculatorPage() {
  return (
    <ToolPageLayout
      title="Income / Profit Calculator"
      description="Input your side hustles and gigs to get your estimated monthly profit, margins, and after-tax income."
      slug="income-calculator"
      faqItems={faqItems}
      affiliateContext="income"
    >
      <IncomeCalculatorForm />
    </ToolPageLayout>
  );
}
