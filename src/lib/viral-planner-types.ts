// === Viral Video Planner Types ===

export interface GeneratedClip {
  number: number;
  narration: string;
  visual: string;
}

export interface GeneratedVideo {
  title: string;
  detectedStyle: string;
  clips: GeneratedClip[];
  tags: string[];
  caption: string;
  thumbnailPrompt: string;
  thumbnailCapcutText: string;
  editingSteps: string[];
  fullScript: string;
}

export interface GenerateResponse {
  success: boolean;
  data?: GeneratedVideo;
  error?: string;
}

export interface TitlesResponse {
  success: boolean;
  titles?: string[];
  error?: string;
}

// Visual styles
export type VisualStyle =
  | "Realistic Cinematic 4K"
  | "Pixar 3D Animation"
  | "Dark Noir"
  | "Neon Cyberpunk"
  | "Horror Atmospheric"
  | "Epic Sci-Fi"
  | "Dreamy Watercolor"
  | "Anime Stylized"
  | "Vintage Film"
  | "Bold Pop Art"
  | "ASMR Macro Close-up"
  | "Cartoon 2D Animation"
  | "Minimalist Flat Design"
  | "Hyper Surreal"
  | "Documentary Style"
  | "Lofi Aesthetic"
  | "Studio Ghibli Style"
  | "Retro Pixel Art"
  | "Sketch Hand-drawn"
  | "Cinematic Dark Horror";

export type Tone = "informative" | "funny" | "scary" | "motivational" | "dramatic";
export type ClipCount = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type ClipDuration = 5 | 6 | 8 | 10 | 12 | 15;
export type NarrationLanguage = "English" | "Bangla" | "Hindi" | "Spanish" | "Arabic";
export type NarrationSpeed = "slow" | "normal" | "fast";

// Advanced options
export type ContentFormat = "storytelling" | "listicle" | "tutorial" | "explainer" | "comparison" | "review";
export type TargetAudience = "kids" | "teens" | "adults" | "everyone";
export type HookStyle = "question" | "shocking-fact" | "pov" | "challenge" | "controversy";
export type Platform = "YouTube Shorts" | "TikTok" | "Instagram Reels" | "YouTube Long-form";
export type VoiceStyle = "narrator" | "storyteller" | "excited host" | "coach" | "comedian" | "whisperer";
export type MusicMood = "dark ambient" | "upbeat" | "cinematic epic" | "calm relaxing" | "funny comedy" | "horror tension" | "emotional piano";
export type EndingStyle = "loop" | "cliffhanger" | "open question" | "call-to-action" | "summary";
export type CTAType = "subscribe" | "follow" | "comment" | "like & share" | "none";
export type AspectRatio = "9:16 vertical" | "16:9 horizontal" | "1:1 square";
export type AudioMode = "voiceover" | "sound-effects-only" | "voiceover + sfx";

export interface PlannerInputs {
  topic: string;
  visualStyle: VisualStyle;
  tone: Tone;
  clipCount: ClipCount;
  clipDuration: ClipDuration;
  narrationLanguage: NarrationLanguage;
  narrationSpeed: NarrationSpeed;
  concept?: string;
  // Advanced
  contentFormat?: ContentFormat;
  targetAudience?: TargetAudience;
  hookStyle?: HookStyle;
  platform?: Platform;
  voiceStyle?: VoiceStyle;
  musicMood?: MusicMood;
  endingStyle?: EndingStyle;
  ctaType?: CTAType;
  aspectRatio?: AspectRatio;
  audioMode?: AudioMode;
}

// Option arrays for the form
export const VISUAL_STYLES: VisualStyle[] = [
  "Realistic Cinematic 4K", "Pixar 3D Animation", "Dark Noir", "Neon Cyberpunk",
  "Horror Atmospheric", "Epic Sci-Fi", "Dreamy Watercolor", "Anime Stylized",
  "Vintage Film", "Bold Pop Art", "ASMR Macro Close-up", "Cartoon 2D Animation",
  "Minimalist Flat Design", "Hyper Surreal", "Documentary Style", "Lofi Aesthetic",
  "Studio Ghibli Style", "Retro Pixel Art", "Sketch Hand-drawn", "Cinematic Dark Horror",
];
export const TONES: Tone[] = ["informative", "funny", "scary", "motivational", "dramatic"];
export const CLIP_COUNTS: ClipCount[] = [2, 3, 4, 5, 6, 7, 8, 9, 10];
export const CLIP_DURATIONS: ClipDuration[] = [5, 6, 8, 10, 12, 15];
export const LANGUAGES: NarrationLanguage[] = ["English", "Bangla", "Hindi", "Spanish", "Arabic"];
export const SPEEDS: NarrationSpeed[] = ["slow", "normal", "fast"];
export const CONTENT_FORMATS: ContentFormat[] = ["storytelling", "listicle", "tutorial", "explainer", "comparison", "review"];
export const TARGET_AUDIENCES: TargetAudience[] = ["kids", "teens", "adults", "everyone"];
export const HOOK_STYLES: HookStyle[] = ["question", "shocking-fact", "pov", "challenge", "controversy"];
export const PLATFORMS: Platform[] = ["YouTube Shorts", "TikTok", "Instagram Reels", "YouTube Long-form"];
export const VOICE_STYLES: VoiceStyle[] = ["narrator", "storyteller", "excited host", "coach", "comedian", "whisperer"];
export const MUSIC_MOODS: MusicMood[] = ["dark ambient", "upbeat", "cinematic epic", "calm relaxing", "funny comedy", "horror tension", "emotional piano"];
export const ENDING_STYLES: EndingStyle[] = ["loop", "cliffhanger", "open question", "call-to-action", "summary"];
export const CTA_TYPES: CTAType[] = ["subscribe", "follow", "comment", "like & share", "none"];
export const ASPECT_RATIOS: AspectRatio[] = ["9:16 vertical", "16:9 horizontal", "1:1 square"];
export const AUDIO_MODES: AudioMode[] = ["voiceover", "sound-effects-only", "voiceover + sfx"];
