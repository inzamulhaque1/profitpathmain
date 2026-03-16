"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useGenerationLimit } from "@/hooks/useGenerationLimit";
import LimitPopup from "@/components/shared/LimitPopup";
import type {
  GeneratedVideo,
  GenerateResponse,
  TitlesResponse,
  PlannerInputs,
  VisualStyle,
  Tone,
  ClipCount,
  ClipDuration,
  NarrationLanguage,
  NarrationSpeed,
  ContentFormat,
  TargetAudience,
  HookStyle,
  Platform,
  VoiceStyle,
  MusicMood,
  EndingStyle,
  CTAType,
  AspectRatio,
  AudioMode,
} from "@/lib/viral-planner-types";
import {
  VISUAL_STYLES,
  TONES,
  CLIP_COUNTS,
  CLIP_DURATIONS,
  LANGUAGES,
  SPEEDS,
  CONTENT_FORMATS,
  TARGET_AUDIENCES,
  HOOK_STYLES,
  PLATFORMS,
  VOICE_STYLES,
  MUSIC_MOODS,
  ENDING_STYLES,
  CTA_TYPES,
  ASPECT_RATIOS,
  AUDIO_MODES,
} from "@/lib/viral-planner-types";

// === Copy Button ===
function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button
      onClick={handleCopy}
      className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-all cursor-pointer"
    >
      {copied ? "Copied!" : label}
    </button>
  );
}

// === Select Component ===
function Select<T extends string | number>({
  label,
  value,
  onChange,
  options,
  renderOption,
  capitalize: cap,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: readonly T[];
  renderOption?: (v: T) => string;
  capitalize?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
      <select
        value={String(value)}
        onChange={(e) => onChange((typeof value === "number" ? Number(e.target.value) : e.target.value) as T)}
        className={`w-full px-3 py-2.5 rounded-lg bg-white border border-gray-200 text-gray-800 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/25 transition-all ${cap ? "capitalize" : ""}`}
      >
        {options.map((o) => (
          <option key={String(o)} value={String(o)} className={cap ? "capitalize" : ""}>
            {renderOption ? renderOption(o) : String(o)}
          </option>
        ))}
      </select>
    </div>
  );
}

function OptionalSelect<T extends string>({
  label,
  value,
  onChange,
  options,
  placeholder = "Auto",
  capitalize: cap,
}: {
  label: string;
  value: T | "";
  onChange: (v: T | "") => void;
  options: readonly T[];
  placeholder?: string;
  capitalize?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T | "")}
        className={`w-full px-3 py-2.5 rounded-lg bg-white border border-gray-200 text-gray-800 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/25 transition-all ${cap ? "capitalize" : ""}`}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o} className={cap ? "capitalize" : ""}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

// === Platform Copy Section ===
function PlatformCopy({ result }: { result: GeneratedVideo }) {
  const ytTags = result.tags.join(", ");
  const ytDescription = `${result.caption}\n\n${result.fullScript}\n\nTags: ${ytTags}`;
  const igCaption = `${result.caption}\n.\n.\n.\n${result.tags.map((t) => `#${t.replace(/\s+/g, "")}`).join(" ")}`;
  const ttCaption = `${result.caption} ${result.tags.slice(0, 10).map((t) => `#${t.replace(/\s+/g, "")}`).join(" ")}`;

  const platforms = [
    { name: "YouTube", icon: "\u25B6", bg: "bg-red-50", border: "border-red-200", text: "text-red-600", fields: [{ label: "Title", value: result.title }, { label: "Description", value: ytDescription }, { label: "Tags", value: ytTags }] },
    { name: "TikTok", icon: "\u266A", bg: "bg-cyan-50", border: "border-cyan-200", text: "text-cyan-600", fields: [{ label: "Caption + Tags", value: ttCaption }] },
    { name: "Instagram", icon: "\u25F7", bg: "bg-pink-50", border: "border-pink-200", text: "text-pink-600", fields: [{ label: "Caption + Hashtags", value: igCaption }] },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Copy for Platform</h3>
      {platforms.map((p) => (
        <div key={p.name} className={`p-4 rounded-xl ${p.bg} border ${p.border}`}>
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-sm font-bold ${p.text}`}>{p.icon} {p.name}</span>
          </div>
          <div className="space-y-2">
            {p.fields.map((f) => (
              <div key={f.label} className="flex items-center justify-between gap-3">
                <span className="text-xs text-gray-500">{f.label}</span>
                <CopyButton text={f.value} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// === MAIN FORM ===
export default function ViralVideoPlannerForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const { used, limit, canGenerate, isGuest, taskCompleted, incrementCount, completeTask } = useGenerationLimit();
  const [showLimitPopup, setShowLimitPopup] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Step 1
  const [topic, setTopic] = useState("");
  const [visualStyle, setVisualStyle] = useState<VisualStyle>("Realistic Cinematic 4K");
  const [tone, setTone] = useState<Tone>("informative");
  const [clipCount, setClipCount] = useState<ClipCount>(5);
  const [clipDuration, setClipDuration] = useState<ClipDuration>(10);
  const [narrationLanguage, setNarrationLanguage] = useState<NarrationLanguage>("English");
  const [narrationSpeed, setNarrationSpeed] = useState<NarrationSpeed>("normal");
  const [concept, setConcept] = useState("");

  // Advanced
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [contentFormat, setContentFormat] = useState<ContentFormat | "">("");
  const [targetAudience, setTargetAudience] = useState<TargetAudience | "">("");
  const [hookStyle, setHookStyle] = useState<HookStyle | "">("");
  const [platform, setPlatform] = useState<Platform | "">("");
  const [voiceStyle, setVoiceStyle] = useState<VoiceStyle | "">("");
  const [musicMood, setMusicMood] = useState<MusicMood | "">("");
  const [endingStyle, setEndingStyle] = useState<EndingStyle | "">("");
  const [ctaType, setCtaType] = useState<CTAType | "">("");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio | "">("");
  const [audioMode, setAudioMode] = useState<AudioMode | "">("");

  // Step 2
  const [titles, setTitles] = useState<string[]>([]);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [editingTitle, setEditingTitle] = useState(false);

  // Step 3
  const [result, setResult] = useState<GeneratedVideo | null>(null);

  // Shared
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isAsmr = audioMode === "sound-effects-only";
  const totalSeconds = clipCount * clipDuration;

  const advancedCount = [contentFormat, targetAudience, hookStyle, platform, voiceStyle && !isAsmr ? voiceStyle : "", musicMood, endingStyle, ctaType, aspectRatio, audioMode].filter(Boolean).length;

  function getInputs(): PlannerInputs {
    const base: PlannerInputs = {
      topic: topic.trim(),
      visualStyle,
      tone,
      clipCount,
      clipDuration,
      narrationLanguage,
      narrationSpeed,
      concept: concept.trim() || undefined,
    };
    if (contentFormat) base.contentFormat = contentFormat;
    if (targetAudience) base.targetAudience = targetAudience;
    if (hookStyle) base.hookStyle = hookStyle;
    if (platform) base.platform = platform;
    if (voiceStyle && !isAsmr) base.voiceStyle = voiceStyle;
    if (musicMood) base.musicMood = musicMood;
    if (endingStyle) base.endingStyle = endingStyle;
    if (ctaType) base.ctaType = ctaType;
    if (aspectRatio) base.aspectRatio = aspectRatio;
    if (audioMode) base.audioMode = audioMode;
    return base;
  }

  async function handleGenerateTitles() {
    if (topic.trim().length < 3) return;
    if (!canGenerate) {
      setShowLimitPopup(true);
      return;
    }
    setLoading(true);
    setError("");
    setTitles([]);
    setSelectedTitle("");

    try {
      const res = await fetch("/api/viral-planner/titles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: getInputs() }),
      });
      const data: TitlesResponse = await res.json();
      if (data.success && data.titles) {
        setTitles(data.titles);
        setSelectedTitle(data.titles[0]);
        setStep(2);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateVideo() {
    if (!selectedTitle.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/viral-planner/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: getInputs(), selectedTitle: selectedTitle.trim() }),
      });
      const data: GenerateResponse = await res.json();
      if (data.success && data.data) {
        setResult(data.data);
        setStep(3);
        setSaved(false);
        incrementCount();
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!result) return;
    if (!session) {
      router.push(`/login?callbackUrl=${encodeURIComponent("/viral-youtube-prompt-generator")}`);
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/saved-generations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: result.title,
          toolSlug: "viral-youtube-prompt-generator",
          data: result,
          inputs: getInputs(),
        }),
      });
      if (res.ok) setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  function formatClip(clip: { number: number; narration: string; visual: string }) {
    return `Clip ${clip.number}:\n${isAsmr ? "Sound" : "Script"}: ${clip.narration}\n\nVisual Prompt (${visualStyle}): ${clip.visual}`;
  }

  const allClipsText = result ? result.clips.map(formatClip).join("\n\n---\n\n") : "";

  return (
    <div className="max-w-5xl mx-auto">
      {/* Step Indicator */}
      <div className="flex justify-center items-center gap-3 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step >= s
                  ? "bg-brand-100 text-brand-700 border-2 border-brand-500"
                  : "bg-gray-100 text-gray-400 border-2 border-gray-200"
              }`}
            >
              {step > s ? "\u2713" : s}
            </div>
            {s < 3 && (
              <div className={`w-12 h-0.5 ${step > s ? "bg-teal-400" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* ====== STEP 1: Form ====== */}
      {step === 1 && !loading && (
        <div className="space-y-5">
          {/* Topic */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Topic *</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && handleGenerateTitles()}
              placeholder="e.g. Why cats always land on their feet"
              className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/25 transition-all"
            />
          </div>

          {/* Core options grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="sm:col-span-1">
              <Select label="Visual Style" value={visualStyle} onChange={setVisualStyle} options={VISUAL_STYLES} />
            </div>
            <Select label="Tone" value={tone} onChange={setTone} options={TONES} capitalize />
            <Select label="Clip Count" value={clipCount} onChange={setClipCount} options={CLIP_COUNTS} renderOption={(c) => `${c} clips`} />
            <Select label="Clip Duration" value={clipDuration} onChange={setClipDuration} options={CLIP_DURATIONS} renderOption={(d) => `${d} sec`} />
            <Select label="Language" value={narrationLanguage} onChange={setNarrationLanguage} options={LANGUAGES} />
            <Select label="Speed" value={narrationSpeed} onChange={setNarrationSpeed} options={SPEEDS} capitalize />
          </div>

          {/* Total duration badge */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-brand-50 text-brand-700 border border-brand-200">
              Total: {clipCount} clips x {clipDuration}s = {totalSeconds}s video
            </span>
          </div>

          {/* Concept */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">Brief Concept (optional)</label>
            <textarea
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              placeholder="Any specific angle or idea you want the video to explore..."
              rows={3}
              className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/25 transition-all resize-y"
            />
          </div>

          {/* Advanced Options */}
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <span className="text-sm text-gray-600 font-medium flex items-center gap-2">
                Advanced Options
                {advancedCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-brand-50 text-brand-700 border border-brand-200">
                    {advancedCount} set
                  </span>
                )}
              </span>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform ${showAdvanced ? "rotate-180" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showAdvanced && (
              <div className="p-4 border-t border-gray-200 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <OptionalSelect
                    label="Audio Mode"
                    value={audioMode}
                    onChange={(v) => { setAudioMode(v); if (v === "sound-effects-only") setVoiceStyle(""); }}
                    options={AUDIO_MODES}
                  />
                  {!isAsmr && (
                    <OptionalSelect label="Voice Style" value={voiceStyle} onChange={setVoiceStyle} options={VOICE_STYLES} capitalize />
                  )}
                  <OptionalSelect label="Music Mood" value={musicMood} onChange={setMusicMood} options={MUSIC_MOODS} capitalize />
                </div>

                {isAsmr && (
                  <div className="px-3 py-2 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 text-xs">
                    ASMR Mode: Narration will be replaced with sound descriptions. Voice Style is hidden.
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <OptionalSelect label="Content Format" value={contentFormat} onChange={setContentFormat} options={CONTENT_FORMATS} capitalize />
                  <OptionalSelect label="Hook Style" value={hookStyle} onChange={setHookStyle} options={HOOK_STYLES} capitalize />
                  <OptionalSelect label="Ending Style" value={endingStyle} onChange={setEndingStyle} options={ENDING_STYLES} capitalize />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <OptionalSelect label="Platform" value={platform} onChange={setPlatform} options={PLATFORMS} placeholder="Any" />
                  <OptionalSelect label="Target Audience" value={targetAudience} onChange={setTargetAudience} options={TARGET_AUDIENCES} placeholder="Everyone" capitalize />
                  <OptionalSelect label="Aspect Ratio" value={aspectRatio} onChange={setAspectRatio} options={ASPECT_RATIOS} placeholder="9:16 vertical" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <OptionalSelect label="CTA Type" value={ctaType} onChange={setCtaType} options={CTA_TYPES} capitalize />
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              onClick={handleGenerateTitles}
              disabled={loading || topic.trim().length < 3}
              className="w-full sm:w-auto px-8 py-3 rounded-xl bg-brand-500 text-white font-semibold hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              Generate Titles
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center gap-4 py-20">
          <div className="w-10 h-10 rounded-full border-2 border-brand-200 border-t-teal-600 animate-spin" />
          <p className="text-gray-500 animate-pulse text-sm">
            {step === 1 ? "Generating title suggestions..." : "Generating full video concept..."}
          </p>
        </div>
      )}

      {/* ====== STEP 2: Title Selection ====== */}
      {step === 2 && !loading && (
        <div className="max-w-2xl mx-auto space-y-5">
          <h2 className="text-base font-semibold text-center text-gray-600">Pick a title or write your own</h2>
          <div className="space-y-2">
            {titles.map((title, i) => (
              <button
                key={i}
                onClick={() => { setSelectedTitle(title); setEditingTitle(false); }}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all cursor-pointer ${
                  selectedTitle === title && !editingTitle
                    ? "bg-brand-50 border-brand-400 text-gray-800"
                    : "bg-white border-gray-200 text-gray-600 hover:border-brand-300 hover:text-gray-800"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                      selectedTitle === title && !editingTitle
                        ? "bg-brand-200 text-brand-700"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="text-sm">{title}</span>
                </div>
              </button>
            ))}
          </div>

          <div>
            <button
              onClick={() => setEditingTitle(!editingTitle)}
              className="text-sm text-brand-600 hover:text-brand-700 transition-colors cursor-pointer"
            >
              {editingTitle ? "Cancel editing" : "Write custom title"}
            </button>
            {editingTitle && (
              <input
                type="text"
                value={selectedTitle}
                onChange={(e) => setSelectedTitle(e.target.value)}
                placeholder="Type your custom title..."
                className="w-full mt-2 px-4 py-3 rounded-lg bg-white border border-brand-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/25 transition-all text-sm"
              />
            )}
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={() => { setStep(1); setError(""); }}
              className="px-5 py-2.5 rounded-xl text-sm text-gray-500 bg-white border border-gray-200 hover:text-gray-700 transition-all cursor-pointer"
            >
              Back
            </button>
            <button
              onClick={handleGenerateVideo}
              disabled={loading || !selectedTitle.trim()}
              className="px-8 py-3 rounded-xl bg-brand-500 text-white font-semibold hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              Generate Video
            </button>
          </div>
        </div>
      )}

      {/* ====== STEP 3: Results ====== */}
      {step === 3 && result && !loading && (
        <>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 mb-6 sm:mb-8 px-2 sm:px-0">
            <button
              onClick={() => { setStep(2); setResult(null); setError(""); }}
              className="px-4 py-2.5 rounded-lg text-sm text-gray-500 bg-white border border-gray-200 hover:text-gray-700 transition-all cursor-pointer"
            >
              Pick Different Title
            </button>
            <button
              onClick={() => { setStep(1); setResult(null); setTitles([]); setSelectedTitle(""); setError(""); }}
              className="px-4 py-2.5 rounded-lg text-sm text-gray-500 bg-white border border-gray-200 hover:text-gray-700 transition-all cursor-pointer"
            >
              New Topic
            </button>
            <button
              onClick={handleSave}
              disabled={saving || saved}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                saved
                  ? "bg-green-50 border border-green-200 text-green-700"
                  : "bg-brand-50 border border-brand-200 text-brand-700 hover:bg-brand-100"
              } disabled:cursor-not-allowed`}
            >
              {saved ? "\u2713 Saved!" : saving ? "Saving..." : session ? "Save for Later" : "Save (Login Required)"}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT */}
            <div className="lg:col-span-2 space-y-5">
              {/* Title */}
              <div className="p-5 rounded-xl bg-white border border-gray-200">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-lg font-bold text-gray-800">{result.title}</h2>
                  <span className="shrink-0 px-3 py-1 rounded-full text-xs font-medium bg-brand-50 text-brand-700 border border-brand-200">
                    {result.detectedStyle}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {clipCount} clips x {clipDuration}s = {totalSeconds}s total
                </p>
              </div>

              {/* Clips */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {result.clips.length} Clip Prompts
                  </h3>
                  <CopyButton text={allClipsText} label="Copy All Clips" />
                </div>

                {result.clips.map((clip) => (
                  <div key={clip.number} className="rounded-xl bg-white border border-gray-200 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center">
                          {clip.number}
                        </span>
                        <span className="text-xs text-gray-400">~{clipDuration}s</span>
                      </div>
                      <CopyButton text={formatClip(clip)} label="Copy" />
                    </div>

                    <div className="p-3 sm:p-4 space-y-3">
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-amber-700">
                            {isAsmr ? "Sound Description" : "Script"} + Visual
                          </p>
                          <CopyButton text={`${clip.narration}\n\n${clip.visual}`} label="Copy All" />
                        </div>
                        <p className="text-sm text-amber-900">
                          &ldquo;{clip.narration}&rdquo;
                        </p>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-xs font-semibold text-blue-700 mb-1">
                            Visual Prompt ({visualStyle})
                          </p>
                          <p className="text-sm text-blue-900 font-mono">
                            {clip.visual}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Thumbnail */}
              <div className="p-4 rounded-xl bg-white border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Thumbnail Prompt</h3>
                  <CopyButton text={result.thumbnailPrompt} />
                </div>
                <p className="text-sm text-gray-600 font-mono bg-gray-50 rounded-lg p-3">{result.thumbnailPrompt}</p>
              </div>

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

            {/* RIGHT */}
            <div className="space-y-5">
              <PlatformCopy result={result} />

              <div className="p-4 rounded-xl bg-white border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Tags ({result.tags.length})</h3>
                  <CopyButton text={result.tags.join(", ")} label="Copy All" />
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {result.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 rounded-full text-xs bg-gray-100 border border-gray-200 text-gray-600">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {result.editingSteps?.length > 0 && (
                <div className="p-4 rounded-xl bg-white border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Editing Steps</h3>
                    <CopyButton text={result.editingSteps.join("\n")} />
                  </div>
                  <ol className="space-y-1.5">
                    {result.editingSteps.map((s, i) => (
                      <li key={i} className="text-sm text-gray-600 flex gap-2">
                        <span className="text-brand-600 shrink-0">{i + 1}.</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              <div className="p-4 rounded-xl bg-white border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Full Script</h3>
                  <CopyButton text={result.fullScript} />
                </div>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{result.fullScript}</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Usage Counter */}
      <div className="mt-4 text-center text-xs text-gray-400">
        {used}/{limit} generations used today
        {!taskCompleted && !isGuest && used >= limit && " — Complete a task for more!"}
      </div>

      {/* Limit Popup */}
      <LimitPopup
        isOpen={showLimitPopup}
        onClose={() => setShowLimitPopup(false)}
        isGuest={isGuest}
        used={used}
        limit={limit}
        onTaskComplete={async () => {
          const success = await completeTask();
          if (success) setShowLimitPopup(false);
          return success;
        }}
      />
    </div>
  );
}
