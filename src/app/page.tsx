import { Metadata } from "next";
import Link from "next/link";
import { TOOLS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "ProfitPath — Free AI Tools for Creators, Freelancers & Side Hustlers",
  description:
    "Free AI-powered tools to create viral videos, generate YouTube titles & tags, calculate freelance rates, and grow your income. No signup required.",
  keywords: [
    "free ai tools",
    "viral video generator",
    "youtube title generator",
    "youtube tag generator",
    "freelance rate calculator",
    "side hustle calculator",
    "ai prompt generator",
    "content creator tools",
    "make money online tools",
  ],
  openGraph: {
    title: "ProfitPath — Free AI Tools for Creators & Side Hustlers",
    description:
      "Generate viral video plans, YouTube titles, AI prompts, and calculate profits — all free. Built for creators who want to grow fast.",
    url: "https://profitpath.online",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProfitPath — Free AI Tools for Creators & Side Hustlers",
    description:
      "Generate viral video plans, YouTube titles, AI prompts, and calculate profits — all free.",
  },
  alternates: {
    canonical: "https://profitpath.online",
  },
};

const OTHER_TOOLS = TOOLS.filter((t) => t.slug !== "viral-youtube-prompt-generator");

export default function HomePage() {
  return (
    <div>
      {/* Hero — Card Style */}
      <section className="relative overflow-hidden bg-surface-50">
        {/* Background decorations */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-brand-50/80 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-accent-50/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-20 w-[300px] h-[300px] bg-brand-50/40 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 py-10 sm:py-16 md:py-20">
          {/* Gradient border card */}
          <div className="rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-brand-500 via-brand-400 to-accent-500 p-[1.5px]">
            <div className="rounded-2xl sm:rounded-3xl bg-white p-6 sm:p-10 md:p-14">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 items-center">
                {/* Left — Text */}
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-brand-700 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full mb-4">
                    <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" />
                    100% FREE — NO SIGNUP REQUIRED
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-surface-900 leading-[1.1]">
                    AI Tools That Help You{" "}
                    <span className="bg-gradient-to-r from-brand-500 to-accent-500 bg-clip-text text-transparent">Create & Earn</span>{" "}
                    Faster
                  </h1>
                  <p className="text-sm sm:text-base text-gray-500 mt-4 leading-relaxed max-w-lg">
                    Generate <strong className="text-gray-700">viral video plans</strong>, AI visual prompts, scripts, thumbnails, and captions — all in one click. Built for creators who want to blow up.
                  </p>

                  {/* Feature grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 mt-6">
                    {[
                      { icon: "🎬", text: "Clip-by-clip scripts" },
                      { icon: "🎨", text: "AI visual prompts" },
                      { icon: "📱", text: "YouTube / TikTok / IG" },
                      { icon: "✂️", text: "CapCut editing guide" },
                      { icon: "🖼️", text: "Thumbnail concepts" },
                      { icon: "🌍", text: "5 languages supported" },
                    ].map((feat) => (
                      <div key={feat.text} className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                        <span className="text-base shrink-0">{feat.icon}</span>
                        {feat.text}
                      </div>
                    ))}
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-8">
                    <Link
                      href="/viral-youtube-prompt-generator"
                      className="inline-flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-brand-500/25 text-sm sm:text-base"
                    >
                      🔥 Try Viral Video Planner
                    </Link>
                    <a
                      href="#tools"
                      className="inline-flex items-center justify-center gap-2 text-surface-800 border border-gray-300 hover:border-gray-400 font-medium px-6 py-3.5 rounded-xl transition-all text-sm sm:text-base bg-white hover:bg-gray-50"
                    >
                      Browse All Tools
                    </a>
                  </div>

                  {/* Trust */}
                  <div className="flex flex-wrap gap-4 mt-6 text-xs text-gray-400">
                    {["No Credit Card", "AI-Powered", "Instant Results", "Save & Export"].map((t) => (
                      <div key={t} className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-brand-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        <span className="text-gray-500">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right — Visual Preview */}
                <div className="relative">
                  <div className="rounded-xl sm:rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 p-4 sm:p-6 space-y-3">
                    {/* Mock clip card */}
                    <div className="rounded-lg bg-white border border-gray-200 p-3 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center">1</span>
                        <span className="text-xs text-gray-400">~10s</span>
                        <span className="ml-auto text-[10px] px-2 py-0.5 rounded bg-green-50 text-green-600 border border-green-200 font-medium">Clip 1 of 5</span>
                      </div>
                      <div className="bg-amber-50 rounded-md p-2.5 mb-2">
                        <p className="text-xs text-amber-800 font-semibold">Script</p>
                        <p className="text-xs text-amber-700 mt-1 leading-relaxed">&ldquo;POV... you&apos;re ketchup... and the human just brought home hot sauce.&rdquo;</p>
                      </div>
                      <div className="bg-blue-50 rounded-md p-2.5">
                        <p className="text-xs text-blue-800 font-semibold">Visual Prompt</p>
                        <p className="text-xs text-blue-700 mt-1 leading-relaxed">Pixar-style fridge interior. Round cartoon ketchup with smug face, tiny arms crossed confidently...</p>
                      </div>
                    </div>

                    {/* Mock clip 2 (faded) — hidden on mobile */}
                    <div className="hidden sm:block rounded-lg bg-white/60 border border-gray-100 p-3 opacity-50">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-brand-50 text-brand-400 text-xs font-bold flex items-center justify-center">2</span>
                        <span className="text-xs text-gray-300">~10s</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded mt-2 w-3/4" />
                      <div className="h-3 bg-gray-100 rounded mt-1.5 w-1/2" />
                    </div>

                    {/* Platform badges */}
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      <span className="text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md bg-red-50 text-red-600 border border-red-200 font-medium">{"\u25B6"} YouTube</span>
                      <span className="text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md bg-cyan-50 text-cyan-600 border border-cyan-200 font-medium">{"\u266A"} TikTok</span>
                      <span className="text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md bg-pink-50 text-pink-600 border border-pink-200 font-medium">{"\u25F7"} Instagram</span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {["funny animation", "pixar style", "food comedy", "viral shorts", "cartoon"].map((t) => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">#{t}</span>
                      ))}
                    </div>
                  </div>

                  {/* Floating badges — hidden on mobile, shown on sm+ */}
                  <div className="hidden sm:block absolute -top-3 -right-3 bg-accent-400 text-surface-900 text-xs font-bold px-2.5 py-1 rounded-full shadow-lg rotate-3">
                    20+ Visual Styles
                  </div>
                  <div className="hidden sm:block absolute -bottom-2 -left-3 bg-brand-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg -rotate-2">
                    2-10 Clips
                  </div>
                  <div className="hidden sm:block absolute top-1/2 -right-3 bg-white text-surface-900 text-xs font-bold px-2.5 py-1 rounded-full shadow-lg border border-gray-200 rotate-1">
                    5-15s per clip
                  </div>
                  {/* Mobile: inline badges below the card */}
                  <div className="flex sm:hidden flex-wrap gap-2 mt-3 justify-center">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-accent-400 text-surface-900">20+ Visual Styles</span>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-brand-500 text-white">2-10 Clips</span>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white text-surface-900 border border-gray-200">5-15s per clip</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-10 sm:py-16">
          <h2 className="text-base sm:text-xl font-display font-bold text-surface-900 text-center mb-8 sm:mb-10">
            How It Works
          </h2>
          <div className="flex flex-col sm:flex-row items-stretch gap-4 sm:gap-0">
            {[
              { step: "1", icon: "🎯", title: "Pick a Tool", desc: "Choose from our growing library of free AI tools." },
              { step: "2", icon: "✏️", title: "Enter Your Info", desc: "Fill in a few fields — no signup needed." },
              { step: "3", icon: "🚀", title: "Get Results", desc: "Copy, share, save, or export instantly." },
            ].map((item, i) => (
              <div key={item.step} className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-0 flex-1 relative">
                {/* Connector line — desktop only */}
                {i < 2 && (
                  <div className="hidden sm:block absolute top-6 left-[calc(50%+28px)] w-[calc(100%-56px)] h-[2px] bg-gradient-to-r from-brand-200 to-brand-100" />
                )}
                {/* Step circle with icon */}
                <div className="relative shrink-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-brand-50 to-brand-100 border border-brand-200 flex items-center justify-center text-xl sm:text-2xl">
                    {item.icon}
                  </div>
                  <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-brand-500 text-white text-[10px] sm:text-xs font-bold flex items-center justify-center ring-2 ring-white">
                    {item.step}
                  </div>
                </div>
                {/* Text */}
                <div className="sm:mt-5">
                  <h3 className="font-display font-semibold text-surface-900 text-sm sm:text-base">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-400 mt-0.5 sm:mt-1.5 max-w-[220px]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Tools */}
      <section id="tools" className="max-w-6xl mx-auto px-4 py-12 sm:py-20">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-surface-900">
            All Free Tools
          </h2>
          <p className="text-sm text-gray-500 mt-2">More tools added every week</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {OTHER_TOOLS.map((tool) => (
            <Link
              key={tool.slug}
              href={`/${tool.slug}`}
              className="group rounded-xl border border-gray-200 bg-white p-5 sm:p-6 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-500/5 transition-all duration-200"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl shrink-0">{tool.icon}</span>
                <div>
                  <h3 className="text-sm sm:text-base font-display font-semibold text-surface-900 group-hover:text-brand-600 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1.5 leading-relaxed">
                    {tool.description}
                  </p>
                  <span className="inline-flex items-center text-xs sm:text-sm font-medium text-brand-600 mt-3">
                    Try it free →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-6xl mx-auto px-4 pb-12 sm:pb-20">
        <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-surface-900 to-surface-800 p-8 sm:p-12 md:p-16 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-white">
              Ready to Create Viral Content?
            </h2>
            <p className="text-sm sm:text-base text-gray-400 mt-3 max-w-lg mx-auto">
              Start generating video plans, titles, and content — completely free. Join thousands of creators.
            </p>
            <Link
              href="/viral-youtube-prompt-generator"
              className="inline-flex items-center gap-2 mt-6 sm:mt-8 bg-brand-500 hover:bg-brand-600 text-white font-semibold px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-brand-500/25 text-sm sm:text-base"
            >
              🔥 Get Started — It&apos;s Free
            </Link>
          </div>
        </div>
      </section>

      {/* JSON-LD Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "ProfitPath",
            url: "https://profitpath.online",
            description: "Free AI-powered tools for content creators, freelancers, and side hustlers.",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://profitpath.online/#tools",
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
    </div>
  );
}
