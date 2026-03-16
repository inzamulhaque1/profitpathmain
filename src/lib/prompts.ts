interface PromptParams {
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

export function buildPrompt(
  type: "youtube-titles" | "youtube-tags" | "ai-prompts" | "viral-youtube-prompts" | "viral-video-planner",
  params: PromptParams
): string {
  switch (type) {
    case "youtube-titles":
      return `You are a YouTube SEO expert. Generate ${params.count || 5} compelling, click-worthy video titles for the topic: "${params.topic}".
Niche/category: ${params.niche || "general"}.
Tone: ${params.tone || "engaging"}.

Rules:
- Use power words, numbers, and emotional triggers
- Keep each title under 60 characters
- Vary the format (how-to, listicle, question, statement, challenge)
- Optimize for YouTube search CTR
- Make titles that someone would actually click on

Return ONLY a valid JSON array of strings, no markdown, no explanation. Example: ["Title 1", "Title 2"]`;

    case "youtube-tags":
      return `You are a YouTube SEO specialist. Generate ${params.count || 10} relevant tags for a YouTube video about: "${params.topic}".
${params.description ? `Additional context: ${params.description}` : ""}

Rules:
- Mix broad and specific (long-tail) tags
- Include trending variations and related terms
- Keep each tag under 30 characters
- Order by relevance (most relevant first)
- Include both single-word and multi-word tags

Return ONLY a valid JSON array of strings, no markdown, no explanation. Example: ["tag one", "tag two"]`;

    case "ai-prompts":
      return `You are an expert prompt engineer. Generate ${params.count || 3} high-quality prompts for ${params.targetTool || "ChatGPT"} to help the user create: "${params.goal}".
Detail level: ${params.style || "detailed"}.

Rules:
- Each prompt should be ready to copy-paste into ${params.targetTool || "ChatGPT"}
- Include specific instructions, context, constraints, and desired output format
- Vary the approach across prompts (different angles, formats, or depths)
- Make prompts that produce genuinely useful results

Return ONLY a valid JSON array of objects with "title" and "prompt" fields, no markdown, no explanation. Example: [{"title": "Short label", "prompt": "Full prompt text"}]`;

    case "viral-youtube-prompts":
      return `You are a viral YouTube content strategist and expert creator coach. Generate ${params.count || 5} viral YouTube video ideas for the niche: "${params.topic}".
Content type: ${params.style || "Short-form (Shorts/Reels)"}.
${params.niche ? `Sub-niche focus: ${params.niche}` : ""}
${params.tone ? `Tone: ${params.tone}` : ""}

For each idea, provide:
- A viral-worthy title (clickbait but delivers value)
- A strong hook (first 3 seconds script to stop the scroll)
- A brief content outline (3-5 key points or story beats)
- Why it would go viral (psychology trigger: curiosity, controversy, relatability, shock, FOMO, etc.)

Rules:
- Focus on proven viral formats: challenges, "I tried X for 30 days", storytime, hot takes, tutorials with a twist, before/after, ranking/tier lists
- Make hooks that create an open loop or pattern interrupt
- Each idea should be distinctly different in format and approach
- Optimize for watch time retention and shares
- Think about what makes someone comment or share with a friend

Return ONLY a valid JSON array of objects with "title", "hook", "outline" (array of strings), and "viralReason" fields. No markdown, no explanation. Example: [{"title": "...", "hook": "...", "outline": ["point 1", "point 2"], "viralReason": "..."}]`;

    case "viral-video-planner": {
      const vs = params.visualStyle || "Realistic Cinematic 4K";
      const clipN = params.clipCount || 5;
      const lang = params.language || "English";
      const spd = params.speed || "normal";
      const isAsmr = params.audioMode === "sound-effects-only";

      const advancedLines: string[] = [];
      if (params.contentFormat) advancedLines.push(`Content Format: ${params.contentFormat}`);
      if (params.targetAudience) advancedLines.push(`Target Audience: ${params.targetAudience}`);
      if (params.hookStyle) advancedLines.push(`Hook Style: ${params.hookStyle}`);
      if (params.voiceStyle && !isAsmr) advancedLines.push(`Voice Style: ${params.voiceStyle}`);
      if (params.musicMood) advancedLines.push(`Music Mood: ${params.musicMood}`);
      if (params.endingStyle) advancedLines.push(`Ending Style: ${params.endingStyle}`);
      if (params.ctaType) advancedLines.push(`CTA Type: ${params.ctaType}`);
      if (params.aspectRatio) advancedLines.push(`Aspect Ratio: ${params.aspectRatio}`);
      if (params.audioMode) advancedLines.push(`Audio Mode: ${params.audioMode}`);

      return `You are an expert viral video content strategist, scriptwriter, and production planner. Create a COMPLETE viral video content package that a creator can immediately use to produce a video.

Topic: "${params.topic}"
${params.concept ? `Brief Concept: ${params.concept}` : ""}
Visual Style: ${vs}
Tone: ${params.tone || "informative"}
Number of clips: ${clipN}
Language: ${lang}
Narration Speed: ${spd}
Target platforms: ${(params.platforms || ["YouTube", "TikTok", "Instagram"]).join(", ")}
${advancedLines.length > 0 ? "\n" + advancedLines.join("\n") : ""}
${isAsmr ? "\nASMR MODE: Replace all narration with detailed sound effect descriptions instead of spoken words." : ""}

Generate a COMPLETE video content package with ALL of the following sections:

1. VIDEO TITLE: A viral, scroll-stopping title that drives massive curiosity. Use proven viral formats (questions, shocking statements, "POV:", "What happens when...", challenges).

2. CLIP-BY-CLIP BREAKDOWN: Exactly ${clipN} clips. For EACH clip provide:
   - "script": ${isAsmr ? "Detailed sound effect/ambient sound descriptions (no spoken words)" : `The voiceover narration text in ${lang}. Pace it for ${spd} speed delivery.`}
   - "visualPrompt": A DETAILED AI image/video generation prompt in "${vs}" style. Include: scene description, character details, expressions, poses, lighting, camera angle, mood, colors, action. Must be 60+ words. End with "No text, no real people."${vs === "Pixar 3D Animation" ? ' Start with "3D Pixar-style animated scene —".' : vs === "Anime Stylized" ? ' Start with "Anime-style scene —".' : vs === "Realistic Cinematic 4K" ? ' Start with "Cinematic 4K scene —".' : ` Start with "${vs} scene —".`}
   - "capcutTextOverlay": Bold text overlay shown on screen during this clip (short, impactful, 3-8 words)

3. FULL SCRIPT: All clip ${isAsmr ? "sound descriptions" : "scripts"} combined into one continuous ${isAsmr ? "sound design document" : "narration"}.

4. THUMBNAIL CONCEPT: Detailed description of the thumbnail in "${vs}" style — imagery, text overlay (max 4 words), colors, expressions, composition. Make it clickable.

5. YOUTUBE METADATA:
   - "title": SEO-optimized title under 100 characters
   - "description": Full YouTube description with hook line, video summary, call to action, keywords, and hashtags
   - "tags": Array of 15-20 relevant YouTube tags mixing broad and long-tail keywords

6. TIKTOK CAPTION: Short, engaging caption with relevant hashtags. Under 300 characters. Include a hook and CTA.

7. INSTAGRAM CAPTION: Longer storytelling-style caption with emojis and hashtags. Include CTA to follow.

8. CAPCUT EDITING STEPS: 8-12 step-by-step instructions for assembling this video in CapCut. Include: importing clips/images, adding ${isAsmr ? "sound effects" : "voiceover"}, text overlays, transitions, ${params.musicMood ? `${params.musicMood} background music` : "background music suggestion"}, effects, and export settings${params.aspectRatio ? ` for ${params.aspectRatio}` : ""}.

CRITICAL RULES:
- Clip 1 MUST contain the hook — stop the scroll within 2 seconds${params.hookStyle ? ` using a "${params.hookStyle}" hook style` : ""}
- Visual prompts MUST consistently use the "${vs}" visual style throughout ALL clips
- ${isAsmr ? "Sound descriptions must be vivid and ASMR-satisfying" : `All narration must be in ${lang} language, paced for ${spd} speed delivery`}
- Content must be genuinely entertaining and shareable, not generic
- The tone must consistently be: ${params.tone || "informative"}
${params.endingStyle ? `- The last clip must use a "${params.endingStyle}" ending style` : ""}
${params.ctaType && params.ctaType !== "none" ? `- Include a "${params.ctaType}" call-to-action` : ""}

Return ONLY valid JSON matching this EXACT structure:
{
  "videoTitle": "string",
  "clips": [
    {
      "clipNumber": 1,
      "duration": "auto",
      "script": "${isAsmr ? "sound description" : "voiceover narration text"}",
      "visualPrompt": "detailed ${vs} visual description for AI generation",
      "capcutTextOverlay": "BOLD TEXT FOR SCREEN"
    }
  ],
  "fullScript": "all clips combined",
  "thumbnailConcept": "detailed thumbnail description",
  "youtubeMetadata": {
    "title": "SEO optimized title",
    "description": "full youtube description with hashtags",
    "tags": ["tag1", "tag2", "tag3"]
  },
  "tiktokCaption": "short caption with #hashtags",
  "instagramCaption": "longer caption with #hashtags",
  "capcutEditingSteps": ["Step 1: ...", "Step 2: ..."]
}`;
    }

    default:
      throw new Error(`Unknown prompt type: ${type}`);
  }
}
