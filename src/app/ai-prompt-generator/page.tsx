import { Metadata } from "next";
import ToolPageLayout from "@/components/shared/ToolPageLayout";
import AiPromptForm from "@/components/tools/AiPromptForm";

export const metadata: Metadata = {
  title: "AI Prompt Generator — Free Prompt Engineering Tool",
  description:
    "Generate high-quality prompts for ChatGPT, Claude, Midjourney, and other AI tools. Get better AI results with expertly crafted prompts.",
  keywords: [
    "ai prompt generator",
    "chatgpt prompts",
    "prompt engineering",
    "midjourney prompts",
    "ai prompts",
  ],
  openGraph: {
    title: "AI Prompt Generator — Free Tool",
    description: "Generate expert AI prompts for any tool.",
    url: "https://profitpath.online/ai-prompt-generator",
  },
  alternates: {
    canonical: "https://profitpath.online/ai-prompt-generator",
  },
};

const faqItems = [
  {
    q: "What AI tools are supported?",
    a: "We generate optimized prompts for ChatGPT, Claude, Midjourney, DALL-E, Stable Diffusion, and general-purpose AI tools.",
  },
  {
    q: "How do I use the generated prompts?",
    a: "Simply click the 'Copy' button on any prompt, then paste it directly into your AI tool of choice. The prompts are ready to use as-is.",
  },
  {
    q: "What makes a good AI prompt?",
    a: "Good prompts are specific, include context and constraints, define the desired output format, and set the right tone. Our generator handles all of this automatically.",
  },
];

export default function AiPromptGeneratorPage() {
  return (
    <ToolPageLayout
      title="AI Prompt Generator"
      description="Generate high-quality prompts for ChatGPT, Midjourney, Claude, and other AI tools. Describe what you want and get ready-to-use prompts."
      slug="ai-prompt-generator"
      faqItems={faqItems}
      affiliateContext="ai"
    >
      <AiPromptForm />
    </ToolPageLayout>
  );
}
