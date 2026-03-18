import { ToolDefinition, AffiliateItem } from "@/types";

export const SITE_CONFIG = {
  name: "ProfitPath",
  url: "https://profitpath.online",
  description:
    "Free online tools for side hustlers, freelancers, and content creators. Calculate profits, generate YouTube titles, AI prompts, and more.",
  ogImage: "/images/og-image.png",
};

export const TOOLS: ToolDefinition[] = [
  {
    slug: "income-calculator",
    title: "Income / Profit Calculator",
    description:
      "Input your side hustles and gigs to calculate estimated monthly profit, margins, and after-tax income.",
    icon: "💰",
    category: "calculator",
  },
  {
    slug: "freelance-rate-calculator",
    title: "Freelance Rate Calculator",
    description:
      "Calculate your ideal hourly and project rates based on your income goals, expenses, and availability.",
    icon: "📊",
    category: "calculator",
  },
  {
    slug: "youtube-title-generator",
    title: "YouTube Title Generator",
    description:
      "Generate click-worthy, SEO-optimized YouTube video titles instantly with AI.",
    icon: "🎬",
    category: "youtube",
  },
  {
    slug: "youtube-tag-generator",
    title: "YouTube Tag Generator",
    description:
      "Get relevant, trending tags for your YouTube videos to boost discoverability.",
    icon: "🏷️",
    category: "youtube",
  },
  {
    slug: "ai-prompt-generator",
    title: "AI Prompt Generator",
    description:
      "Generate high-quality prompts for ChatGPT, Midjourney, Claude, and other AI tools.",
    icon: "🤖",
    category: "ai",
  },
  {
    slug: "viral-youtube-prompt-generator",
    title: "Viral Video Planner",
    description:
      "Generate complete viral video packages — scripts, visual prompts, thumbnails, captions, and editing guides.",
    icon: "🔥",
    category: "youtube",
  },
];

export const AFFILIATES: Record<string, AffiliateItem[]> = {
  youtube: [
    {
      name: "TubeBuddy",
      url: "https://www.tubebuddy.com",
      description: "The #1 browser extension for YouTube channel management and SEO optimization.",
    },
    {
      name: "Canva Pro",
      url: "https://www.canva.com",
      description: "Design stunning thumbnails and channel art with professional templates.",
    },
  ],
  freelance: [
    {
      name: "FreshBooks",
      url: "https://www.freshbooks.com",
      description: "Simple invoicing and accounting software built for freelancers.",
    },
  ],
  ai: [
    {
      name: "ChatGPT Plus",
      url: "https://chat.openai.com",
      description: "Get access to GPT-4 and advanced AI features for content creation.",
    },
  ],
  income: [
    {
      name: "QuickBooks",
      url: "https://quickbooks.intuit.com",
      description: "Track income, expenses, and taxes for your side hustles in one place.",
    },
  ],
};

export const PRO_CTAS: Record<string, string> = {
  "income-calculator":
    "Save your calculations and track monthly income trends with ProfitPath Pro.",
  "freelance-rate-calculator":
    "Export your rate card as a branded PDF with ProfitPath Pro.",
  "youtube-title-generator":
    "Generate 50+ titles at once and save favorites with ProfitPath Pro.",
  "youtube-tag-generator":
    "Generate 50+ tags, analyze competitors, and export tag sets with ProfitPath Pro.",
  "ai-prompt-generator":
    "Unlock advanced prompt templates and bulk generation with ProfitPath Pro.",
  "viral-youtube-prompt-generator":
    "Generate 20+ video plans at once, get full scripts with timestamps, and track trending niches with ProfitPath Pro.",
};
