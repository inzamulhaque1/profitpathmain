import ProCta from "./ProCta";
import AffiliateLink from "./AffiliateLink";
import { AFFILIATES, PRO_CTAS } from "@/lib/constants";
import { FaqItem } from "@/types";

interface ToolPageLayoutProps {
  title: string;
  description: string;
  slug: string;
  children: React.ReactNode;
  faqItems?: FaqItem[];
  affiliateContext?: "youtube" | "freelance" | "ai" | "income";
}

export default function ToolPageLayout({
  title,
  description,
  slug,
  children,
  faqItems,
  affiliateContext,
}: ToolPageLayoutProps) {
  const affiliates = affiliateContext ? AFFILIATES[affiliateContext] : [];
  const proCta = PRO_CTAS[slug];

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      {/* AdSlot placeholder removed — add back when AdSense is approved */}

      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-surface-900 text-balance">
          {title}
        </h1>
        <p className="text-gray-500 mt-2 sm:mt-3 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl">
          {description}
        </p>
      </div>

      {/* Tool content */}
      <div className="mb-10">{children}</div>

      {/* Pro CTA */}
      {proCta && (
        <div className="mb-8">
          <ProCta text={proCta} />
        </div>
      )}

      {/* Affiliate recommendations */}
      {affiliates && affiliates.length > 0 && (
        <div className="mb-10">
          <h2 className="text-base sm:text-lg font-display font-semibold text-surface-900 mb-4">
            Recommended Tools
          </h2>
          <div className="grid gap-3">
            {affiliates.map((item) => (
              <AffiliateLink key={item.name} item={item} />
            ))}
          </div>
        </div>
      )}

      {/* AdSlot placeholder removed — add back when AdSense is approved */}

      {/* FAQ */}
      {faqItems && faqItems.length > 0 && (
        <div className="mb-10">
          <h2 className="text-base sm:text-lg font-display font-semibold text-surface-900 mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqItems.map((faq, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5"
              >
                <h3 className="text-sm font-semibold text-surface-900">
                  {faq.q}
                </h3>
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: title,
            url: `https://profitpath.online/${slug}`,
            applicationCategory: "UtilityApplication",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            operatingSystem: "Web",
          }),
        }}
      />
      {faqItems && faqItems.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqItems.map((faq) => ({
                "@type": "Question",
                name: faq.q,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.a,
                },
              })),
            }),
          }}
        />
      )}
    </div>
  );
}
