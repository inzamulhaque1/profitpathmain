import { Metadata } from "next";
import ToolPageLayout from "@/components/shared/ToolPageLayout";
import ViralVideoPlannerForm from "@/components/tools/ViralVideoPlannerForm";

export const metadata: Metadata = {
  title: "Viral Video Planner — Free AI Video Content Generator",
  description:
    "Generate complete viral video packages with scripts, visual prompts, thumbnails, captions, and editing guides. One click, everything you need to produce a viral video.",
  keywords: [
    "viral video planner",
    "youtube video ideas generator",
    "viral video script generator",
    "youtube shorts ideas",
    "tiktok content ideas",
    "video content planner",
    "ai video script",
    "viral hooks generator",
    "capcut editing guide",
  ],
  openGraph: {
    title: "Viral Video Planner — Free AI Video Content Generator",
    description:
      "Generate complete viral video packages with AI. Scripts, visuals, captions, editing steps — all in one click.",
    url: "https://profitpath.online/viral-youtube-prompt-generator",
  },
  twitter: {
    card: "summary_large_image",
    title: "Viral Video Planner — Free AI Video Content Generator",
    description:
      "Generate viral video scripts, AI visual prompts, thumbnails, and captions in one click. 100% free.",
  },
  alternates: {
    canonical: "https://profitpath.online/viral-youtube-prompt-generator",
  },
};

const faqItems = [
  {
    q: "What does the Viral Video Planner generate?",
    a: "It generates a complete video production package: clip-by-clip scripts with voiceover narration, detailed AI visual prompts (Pixar/3D style), CapCut text overlays, thumbnail concepts, YouTube metadata (title, description, tags), TikTok and Instagram captions, and step-by-step CapCut editing instructions.",
  },
  {
    q: "How do I use the visual prompts?",
    a: "Copy each visual prompt and paste it into an AI image or video generator like Midjourney, Kling AI, Runway, or DALL-E. The prompts are optimized for 3D animated Pixar-style visuals that work great for viral content.",
  },
  {
    q: "Does this work for YouTube Shorts, TikTok, and Instagram Reels?",
    a: "Yes! Select your target platforms and content type. The tool generates platform-specific captions with hashtags and optimizes clip timing for short-form or long-form content.",
  },
  {
    q: "Can I customize the number of clips and duration?",
    a: "Absolutely. Choose 2-10 clips per video and 5s, 6s, 8s, 10s, 12s, or 15s per clip. The scripts are automatically timed to match your selected duration.",
  },
  {
    q: "What are the CapCut editing steps?",
    a: "Step-by-step instructions for assembling your video in CapCut, including importing clips, adding voiceover, text overlays, transitions, music suggestions, effects, and export settings. Perfect for beginners.",
  },
];

export default function ViralVideoPlannerPage() {
  return (
    <ToolPageLayout
      title="Viral Video Planner"
      description="Generate a complete viral video package — scripts, AI visual prompts, thumbnails, captions, and editing guides. One click, everything you need."
      slug="viral-youtube-prompt-generator"
      faqItems={faqItems}
      affiliateContext="youtube"
    >
      <ViralVideoPlannerForm />
    </ToolPageLayout>
  );
}
