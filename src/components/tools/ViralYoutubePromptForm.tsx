"use client";

import { useState } from "react";
import GenerateButton from "@/components/shared/GenerateButton";
import CopyButton from "@/components/shared/CopyButton";

interface ViralIdea {
  title: string;
  hook: string;
  outline: string[];
  viralReason: string;
}

const CONTENT_TYPES = [
  "Short-form (Shorts/Reels)",
  "Long-form (10+ min)",
  "Medium (5-10 min)",
  "Podcast / Talk",
];

const TONES = [
  "Entertaining",
  "Educational",
  "Controversial",
  "Inspirational",
  "Funny",
];

export default function ViralYoutubePromptForm() {
  const [topic, setTopic] = useState("");
  const [niche, setNiche] = useState("");
  const [contentType, setContentType] = useState(CONTENT_TYPES[0]);
  const [tone, setTone] = useState(TONES[0]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ViralIdea[]>([]);
  const [error, setError] = useState("");

  const generate = async () => {
    if (!topic.trim()) {
      setError("Please enter a niche or topic.");
      return;
    }

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "viral-youtube-prompts",
          topic: topic.trim(),
          niche: niche.trim(),
          style: contentType,
          tone,
          count: 5,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setResults(data.results);
    } catch {
      setError("Connection error. Check your internet.");
    } finally {
      setLoading(false);
    }
  };

  const copyIdea = (idea: ViralIdea) =>
    `Title: ${idea.title}\n\nHook: ${idea.hook}\n\nOutline:\n${idea.outline.map((p, i) => `${i + 1}. ${p}`).join("\n")}\n\nWhy it goes viral: ${idea.viralReason}`;

  const selectClass =
    "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all bg-white";

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Niche / Topic *
            </label>
            <input
              type="text"
              placeholder="e.g. Personal finance, Gaming, Fitness, Tech reviews"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Sub-niche (optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Budget tips for college students, Minecraft speedruns"
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Content Type
              </label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value)}
                className={selectClass}
              >
                {CONTENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Tone
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className={selectClass}
              >
                {TONES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <GenerateButton
        onClick={generate}
        loading={loading}
        text="Generate Viral Ideas"
        loadingText="Generating..."
      />

      {error && (
        <p className="text-sm text-red-500 bg-red-50 rounded-lg p-3">
          {error}
        </p>
      )}

      {results.length > 0 && (
        <div className="space-y-5">
          <h2 className="text-sm font-semibold text-gray-400">
            {results.length} Viral Video Ideas
          </h2>
          {results.map((idea, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 bg-white p-5 space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-base font-semibold text-surface-900">
                  <span className="text-brand-500 mr-2">#{i + 1}</span>
                  {idea.title}
                </h3>
                <CopyButton text={copyIdea(idea)} />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-amber-700 mb-1">
                  Hook (first 3 seconds)
                </p>
                <p className="text-sm text-amber-900 italic">
                  &ldquo;{idea.hook}&rdquo;
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 mb-2">
                  Content Outline
                </p>
                <ul className="space-y-1.5">
                  {idea.outline.map((point, j) => (
                    <li
                      key={j}
                      className="text-sm text-gray-600 flex items-start gap-2"
                    >
                      <span className="text-brand-500 font-semibold text-xs mt-0.5">
                        {j + 1}.
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-purple-700 mb-1">
                  Why it goes viral
                </p>
                <p className="text-sm text-purple-900">{idea.viralReason}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
