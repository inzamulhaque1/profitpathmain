"use client";

import { useState } from "react";
import { AiPromptResult } from "@/types";
import GenerateButton from "@/components/shared/GenerateButton";
import CopyButton from "@/components/shared/CopyButton";

const AI_TOOLS = [
  "ChatGPT",
  "Claude",
  "Midjourney",
  "DALL-E",
  "Stable Diffusion",
  "General",
];
const STYLES = ["Simple", "Detailed", "Expert"];

export default function AiPromptForm() {
  const [goal, setGoal] = useState("");
  const [targetTool, setTargetTool] = useState("ChatGPT");
  const [style, setStyle] = useState("Detailed");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AiPromptResult[]>([]);
  const [error, setError] = useState("");

  const generate = async () => {
    if (!goal.trim()) {
      setError("Please describe what you want to create.");
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
          type: "ai-prompts",
          goal: goal.trim(),
          targetTool,
          style,
          count: 3,
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

  const selectClass =
    "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all bg-white";

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              What do you want to create? *
            </label>
            <textarea
              placeholder="e.g. A blog post about productivity tips for remote workers"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all resize-none"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Target AI Tool
              </label>
              <select
                value={targetTool}
                onChange={(e) => setTargetTool(e.target.value)}
                className={selectClass}
              >
                {AI_TOOLS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">
                Detail Level
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className={selectClass}
              >
                {STYLES.map((s) => (
                  <option key={s} value={s}>
                    {s}
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
        text="Generate Prompts"
        loadingText="Generating..."
      />

      {error && (
        <p className="text-sm text-red-500 bg-red-50 rounded-lg p-3">
          {error}
        </p>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-400">
            Generated Prompts for {targetTool}
          </h2>
          {results.map((result, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="text-sm font-semibold text-surface-900">
                  {result.title}
                </h3>
                <CopyButton text={result.prompt} />
              </div>
              <p className="text-sm text-gray-600 whitespace-pre-wrap bg-surface-50 rounded-lg p-4 border border-gray-100">
                {result.prompt}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
