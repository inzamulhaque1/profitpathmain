"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { GeneratedVideo } from "@/lib/viral-planner-types";

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button onClick={handleCopy} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-all cursor-pointer">
      {copied ? "Copied!" : label}
    </button>
  );
}

interface SavedItem {
  _id: string;
  title: string;
  toolSlug: string;
  data: GeneratedVideo;
  inputs: Record<string, unknown>;
  createdAt: string;
}

export default function SavedViewPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [item, setItem] = useState<SavedItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/saved-generations/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setItem(data.item);
        else setError(data.error || "Not found");
      })
      .catch(() => setError("Failed to load"))
      .finally(() => setLoading(false));
  }, [params.id]);

  async function handleDelete() {
    if (!confirm("Delete this saved generation?")) return;
    const res = await fetch(`/api/saved-generations/${params.id}`, { method: "DELETE" });
    if (res.ok) router.push("/saved");
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 rounded-full border-2 border-brand-200 border-t-brand-600 animate-spin" />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-12 text-center">
        <p className="text-gray-500 mb-4">{error || "Generation not found"}</p>
        <Link href="/saved" className="text-brand-600 hover:text-brand-700 text-sm font-medium">Back to Saved</Link>
      </div>
    );
  }

  const result = item.data;
  const visualStyle = (item.inputs?.visualStyle as string) || result.detectedStyle;
  const clipDuration = (item.inputs?.clipDuration as number) || 10;
  const clipCount = result.clips?.length || 0;
  const totalSeconds = clipCount * clipDuration;
  const isAsmr = item.inputs?.audioMode === "sound-effects-only";

  function formatClip(clip: { number: number; narration: string; visual: string }) {
    return `Clip ${clip.number}:\n${isAsmr ? "Sound" : "Script"}: ${clip.narration}\n\nVisual Prompt (${visualStyle}): ${clip.visual}`;
  }

  const allClipsText = result.clips?.map(formatClip).join("\n\n---\n\n") || "";

  // Platform text
  const ytTags = result.tags?.join(", ") || "";
  const ytDescription = `${result.caption || ""}\n\n${result.fullScript || ""}\n\nTags: ${ytTags}`;
  const igCaption = `${result.caption || ""}\n.\n.\n.\n${(result.tags || []).map((t: string) => `#${t.replace(/\s+/g, "")}`).join(" ")}`;
  const ttCaption = `${result.caption || ""} ${(result.tags || []).slice(0, 10).map((t: string) => `#${t.replace(/\s+/g, "")}`).join(" ")}`;

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <Link href="/saved" className="text-xs text-brand-600 hover:text-brand-700 mb-2 inline-block">&larr; Back to Saved</Link>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{result.title}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">{result.detectedStyle}</span>
            <span className="text-xs text-gray-400">{clipCount} clips x {clipDuration}s = {totalSeconds}s</span>
          </div>
        </div>
        <button onClick={handleDelete} className="self-start text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 cursor-pointer">
          Delete
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-5">
          {/* Clips */}
          {result.clips && result.clips.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{clipCount} Clip Prompts</h3>
                <CopyButton text={allClipsText} label="Copy All Clips" />
              </div>

              {result.clips.map((clip) => (
                <div key={clip.number} className="rounded-xl bg-white border border-gray-200 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center">{clip.number}</span>
                      <span className="text-xs text-gray-400">~{clipDuration}s</span>
                    </div>
                    <CopyButton text={formatClip(clip)} label="Copy" />
                  </div>
                  <div className="p-3 sm:p-4 space-y-3">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-amber-700">{isAsmr ? "Sound Description" : "Script"} + Visual</p>
                        <CopyButton text={`${clip.narration}\n\n${clip.visual}`} label="Copy All" />
                      </div>
                      <p className="text-sm text-amber-900">&ldquo;{clip.narration}&rdquo;</p>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-xs font-semibold text-blue-700 mb-1">Visual Prompt ({visualStyle})</p>
                        <p className="text-sm text-blue-900 font-mono">{clip.visual}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Thumbnail */}
          {result.thumbnailPrompt && (
            <div className="p-4 rounded-xl bg-white border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Thumbnail Prompt</h3>
                <CopyButton text={result.thumbnailPrompt} />
              </div>
              <p className="text-sm text-gray-600 font-mono bg-gray-50 rounded-lg p-3">{result.thumbnailPrompt}</p>
            </div>
          )}

          {result.thumbnailCapcutText && (
            <div className="p-4 rounded-xl bg-white border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Thumbnail Text Overlay</h3>
                <CopyButton text={result.thumbnailCapcutText} />
              </div>
              <p className="text-sm font-bold text-gray-800">{result.thumbnailCapcutText}</p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-5">
          {/* Platform Copy */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Copy for Platform</h3>
            <div className="p-4 rounded-xl bg-red-50 border border-red-200">
              <span className="text-sm font-bold text-red-600">{"\u25B6"} YouTube</span>
              <div className="space-y-2 mt-3">
                <div className="flex items-center justify-between gap-3"><span className="text-xs text-gray-500">Title</span><CopyButton text={result.title} /></div>
                <div className="flex items-center justify-between gap-3"><span className="text-xs text-gray-500">Description</span><CopyButton text={ytDescription} /></div>
                <div className="flex items-center justify-between gap-3"><span className="text-xs text-gray-500">Tags</span><CopyButton text={ytTags} /></div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-cyan-50 border border-cyan-200">
              <span className="text-sm font-bold text-cyan-600">{"\u266A"} TikTok</span>
              <div className="mt-3"><div className="flex items-center justify-between gap-3"><span className="text-xs text-gray-500">Caption + Tags</span><CopyButton text={ttCaption} /></div></div>
            </div>
            <div className="p-4 rounded-xl bg-pink-50 border border-pink-200">
              <span className="text-sm font-bold text-pink-600">{"\u25F7"} Instagram</span>
              <div className="mt-3"><div className="flex items-center justify-between gap-3"><span className="text-xs text-gray-500">Caption + Hashtags</span><CopyButton text={igCaption} /></div></div>
            </div>
          </div>

          {/* Tags */}
          {result.tags && result.tags.length > 0 && (
            <div className="p-4 rounded-xl bg-white border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tags ({result.tags.length})</h3>
                <CopyButton text={result.tags.join(", ")} label="Copy All" />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {result.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 rounded-full text-xs bg-gray-100 border border-gray-200 text-gray-600">#{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* Editing Steps */}
          {result.editingSteps && result.editingSteps.length > 0 && (
            <div className="p-4 rounded-xl bg-white border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Editing Steps</h3>
                <CopyButton text={result.editingSteps.join("\n")} />
              </div>
              <ol className="space-y-1.5">
                {result.editingSteps.map((s, i) => (
                  <li key={i} className="text-sm text-gray-600 flex gap-2">
                    <span className="text-brand-600 shrink-0">{i + 1}.</span><span>{s}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Full Script */}
          {result.fullScript && (
            <div className="p-4 rounded-xl bg-white border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Full Script</h3>
                <CopyButton text={result.fullScript} />
              </div>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{result.fullScript}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
