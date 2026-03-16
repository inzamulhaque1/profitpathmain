import { Metadata } from "next";
import ToolPageLayout from "@/components/shared/ToolPageLayout";
import YoutubeTitleForm from "@/components/tools/YoutubeTitleForm";

export const metadata: Metadata = {
  title: "YouTube Title Generator — Free AI-Powered Tool",
  description:
    "Generate click-worthy YouTube titles instantly with AI. Free tool to boost your video CTR and grow your channel faster.",
  keywords: [
    "youtube title generator",
    "ai youtube titles",
    "video title ideas",
    "youtube seo",
  ],
  openGraph: {
    title: "YouTube Title Generator — Free AI Tool",
    description: "Generate viral YouTube titles with AI.",
    url: "https://profitpath.online/youtube-title-generator",
  },
  alternates: {
    canonical: "https://profitpath.online/youtube-title-generator",
  },
};

const faqItems = [
  {
    q: "How does the YouTube Title Generator work?",
    a: "Enter your video topic, select a niche and tone, and our AI generates 5 click-worthy title options optimized for YouTube search and CTR.",
  },
  {
    q: "Are the generated titles SEO-optimized?",
    a: "Yes! The AI considers YouTube SEO best practices including power words, emotional triggers, and optimal character length (under 60 characters).",
  },
  {
    q: "Can I use these titles for my YouTube videos?",
    a: "Absolutely! All generated titles are free to use. We recommend testing different titles using YouTube's A/B testing feature or tools like TubeBuddy.",
  },
];

export default function YoutubeTitleGeneratorPage() {
  return (
    <ToolPageLayout
      title="YouTube Title Generator"
      description="Generate click-worthy, SEO-optimized YouTube video titles instantly with AI. Enter your topic and get 5 title ideas."
      slug="youtube-title-generator"
      faqItems={faqItems}
      affiliateContext="youtube"
    >
      <YoutubeTitleForm />
    </ToolPageLayout>
  );
}
