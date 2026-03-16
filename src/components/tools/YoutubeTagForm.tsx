"use client";

import { useState } from "react";
import GenerateButton from "@/components/shared/GenerateButton";
import CopyButton from "@/components/shared/CopyButton";

export default function YoutubeTagForm() {
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState("");

  const generate = async () => {
    if (!topic.trim()) {
      setError("Please enter a video title or topic.");
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
          type: "youtube-tags",
          topic: topic.trim(),
          description: description.trim(),
          count: 10,
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

  const allTags = results.join(", ");
  const totalChars = allTags.length;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Video Title or Topic *
            </label>
            <input
              type="text"
              placeholder="e.g. Best AI tools for content creators"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">
              Additional Context (optional)
            </label>
            <textarea
              placeholder="Describe your video content for more relevant tags..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all resize-none"
            />
          </div>
        </div>
      </div>

      <GenerateButton
        onClick={generate}
        loading={loading}
        text="Generate Tags"
        loadingText="Generating..."
      />

      {error && (
        <p className="text-sm text-red-500 bg-red-50 rounded-lg p-3">
          {error}
        </p>
      )}

      {results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-400">
              Generated Tags ({results.length})
            </h2>
            <div className="flex items-center gap-3">
              <span
                className={`text-xs ${totalChars > 500 ? "text-red-500" : "text-gray-400"}`}
              >
                {totalChars}/500 characters
              </span>
              <CopyButton text={allTags} label="Copy All" />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex flex-wrap gap-2">
              {results.map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 bg-surface-50 border border-gray-200 rounded-full px-3 py-1.5 text-sm text-gray-700 hover:border-brand-300 hover:bg-brand-50 transition-colors cursor-default"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
