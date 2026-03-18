import { MetadataRoute } from "next";
import { TOOLS } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://profitpath.online";

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    // All tools dynamically
    ...TOOLS.map((tool) => ({
      url: `${base}/${tool.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: tool.slug === "viral-youtube-prompt-generator" ? 0.9 : 0.8,
    })),
    // Pro & Referral
    {
      url: `${base}/pro`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/referral`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    // Legal
    ...["privacy", "terms"].map((slug) => ({
      url: `${base}/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    })),
  ];
}
