import { Metadata } from "next";
import ToolPageLayout from "@/components/shared/ToolPageLayout";
import YoutubeTagForm from "@/components/tools/YoutubeTagForm";

export const metadata: Metadata = {
  title: "YouTube Tag Generator — Free AI Tag Tool",
  description:
    "Generate relevant, trending YouTube tags instantly with AI. Boost your video discoverability and reach more viewers.",
  keywords: [
    "youtube tag generator",
    "youtube tags",
    "video tags generator",
    "youtube seo tags",
  ],
  openGraph: {
    title: "YouTube Tag Generator — Free AI Tool",
    description: "Generate relevant YouTube tags with AI.",
    url: "https://profitpath.online/youtube-tag-generator",
  },
  alternates: {
    canonical: "https://profitpath.online/youtube-tag-generator",
  },
};

const faqItems = [
  {
    q: "How many tags should I use on YouTube?",
    a: "YouTube allows up to 500 characters of tags. Most experts recommend 5-15 relevant tags that mix broad and specific terms. Our tool generates 10 optimized tags by default.",
  },
  {
    q: "Do YouTube tags still matter for SEO?",
    a: "While tags are less important than titles and descriptions, they still help YouTube understand your content and can improve discoverability, especially for misspelled search terms.",
  },
  {
    q: "Can I copy all tags at once?",
    a: "Yes! Click the 'Copy All' button to copy all generated tags as a comma-separated list, ready to paste into YouTube Studio.",
  },
];

export default function YoutubeTagGeneratorPage() {
  return (
    <ToolPageLayout
      title="YouTube Tag Generator"
      description="Get relevant, trending tags for your YouTube videos to boost discoverability. Enter your topic and get instant tag suggestions."
      slug="youtube-tag-generator"
      faqItems={faqItems}
      affiliateContext="youtube"
    >
      <YoutubeTagForm />
    </ToolPageLayout>
  );
}
