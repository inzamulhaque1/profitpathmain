"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface SavedItem {
  _id: string;
  title: string;
  toolSlug: string;
  createdAt: string;
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

const TOOL_NAMES: Record<string, string> = {
  "viral-youtube-prompt-generator": "Viral Video Planner",
  "youtube-title-generator": "YouTube Title Generator",
  "youtube-tag-generator": "YouTube Tag Generator",
  "ai-prompt-generator": "AI Prompt Generator",
};

export default function SavedGenerationsList() {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/saved-generations")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setItems(data.items);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this saved generation?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/saved-generations/${id}`, { method: "DELETE" });
      if (res.ok) {
        setItems((prev) => prev.filter((item) => item._id !== id));
      }
    } finally {
      setDeleting(null);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-brand-200 border-t-brand-600 animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-4xl mb-4">📁</div>
        <h2 className="text-lg font-semibold text-gray-700 mb-2">No saved generations yet</h2>
        <p className="text-sm text-gray-500 mb-6">Generate a video plan and click &quot;Save&quot; to keep it here.</p>
        <Link href="/viral-youtube-prompt-generator" className="inline-flex px-6 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 transition-colors">
          Try Viral Video Planner
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item._id} className="p-3 sm:p-4 rounded-xl bg-white border border-gray-200 hover:border-gray-300 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-gray-800 line-clamp-1">{item.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                  {TOOL_NAMES[item.toolSlug] || item.toolSlug}
                </span>
                <span className="text-xs text-gray-400">{timeAgo(item.createdAt)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <Link
                href={`/saved/${item._id}`}
                className="text-xs px-3 py-2 rounded-lg border border-brand-200 text-brand-600 bg-brand-50 hover:bg-brand-100 transition-all"
              >
                View
              </Link>
              <button
                onClick={() => handleDelete(item._id)}
                disabled={deleting === item._id}
                className="text-xs px-3 py-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 transition-all cursor-pointer"
              >
                {deleting === item._id ? "..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
