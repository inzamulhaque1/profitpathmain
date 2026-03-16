"use client";

import { useState } from "react";
import GenerateButton from "@/components/shared/GenerateButton";
import ResultCard from "@/components/shared/ResultCard";

const NICHES = [
  "Tech",
  "Finance",
  "Lifestyle",
  "Gaming",
  "Education",
  "Health & Fitness",
  "Entertainment",
  "Other",
];
const TONES = ["Clickbait", "Professional", "Casual", "Educational", "Funny"];

export default function YoutubeTitleForm() {
  const [topic, setTopic] = useState("");
  const [niche, setNiche] = useState("Tech");
  const [tone, setTone] = useState("Clickbait");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState("");

  const generate = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic or video idea.");
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
          type: "youtube-titles",
          topic: topic.trim(),
          niche,
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

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all";
  const selectClass =
    "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all bg-white";

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Topic / Video Idea *
            </label>
            <input
              type="text"
              placeholder="e.g. How to make money with AI in 2025"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Niche / Category
              </label>
              <select
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className={selectClass}
              >
                {NICHES.map((n) => (
                  <option key={n} value={n}>
                    {n}
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
        text="Generate Titles"
        loadingText="Generating..."
      />

      {error && (
        <p className="text-sm text-red-500 bg-red-50 rounded-lg p-3">
          {error}
        </p>
      )}

      {results.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-400">
            Generated Titles
          </h2>
          {results.map((title, i) => (
            <ResultCard
              key={i}
              content={title}
              title={`Title ${i + 1}`}
            >
              <span className="text-xs text-gray-400 mt-2 block">
                {title.length} characters
              </span>
            </ResultCard>
          ))}
        </div>
      )}
    </div>
  );
}
