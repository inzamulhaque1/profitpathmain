export interface ToolDefinition {
  slug: string;
  title: string;
  description: string;
  icon: string;
  category: "calculator" | "youtube" | "ai" | "viral";
}

export interface IncomeSource {
  id: string;
  name: string;
  revenue: number;
  expenses: number;
}

export interface IncomeResults {
  grossIncome: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  afterTax: number;
  topEarner: { name: string; percentage: number } | null;
  sources: { name: string; profit: number; percentage: number }[];
}

export interface FreelanceInputs {
  desiredIncome: number;
  hoursPerWeek: number;
  vacationWeeks: number;
  businessExpenses: number;
  profitMargin: number;
}

export interface FreelanceResults {
  hourlyRate: number;
  projectRates: { hours: number; rate: number }[];
  monthlyBillableHours: number;
  totalNeeded: number;
}

export interface GenerateRequest {
  type: "youtube-titles" | "youtube-tags" | "ai-prompts" | "viral-youtube-prompts" | "viral-video-planner";
  topic?: string;
  niche?: string;
  tone?: string;
  count?: number;
  description?: string;
  goal?: string;
  targetTool?: string;
  style?: string;
  clipCount?: number;
  clipDuration?: string;
  platforms?: string[];
  // Viral Video Planner extended options
  visualStyle?: string;
  language?: string;
  speed?: string;
  concept?: string;
  contentFormat?: string;
  targetAudience?: string;
  hookStyle?: string;
  voiceStyle?: string;
  musicMood?: string;
  endingStyle?: string;
  ctaType?: string;
  aspectRatio?: string;
  audioMode?: string;
}

export interface GenerateResponse {
  results: string[] | AiPromptResult[] | VideoPlanResult;
  error?: string;
}

export interface AiPromptResult {
  title: string;
  prompt: string;
}

export interface VideoClip {
  clipNumber: number;
  duration: string;
  script: string;
  visualPrompt: string;
  capcutTextOverlay: string;
}

export interface VideoPlanResult {
  videoTitle: string;
  clips: VideoClip[];
  fullScript: string;
  thumbnailConcept: string;
  youtubeMetadata: {
    title: string;
    description: string;
    tags: string[];
  };
  tiktokCaption: string;
  instagramCaption: string;
  capcutEditingSteps: string[];
}

export interface AffiliateItem {
  name: string;
  url: string;
  description: string;
}

export interface FaqItem {
  q: string;
  a: string;
}
