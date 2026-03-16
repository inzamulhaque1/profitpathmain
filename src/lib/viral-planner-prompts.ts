import type { PlannerInputs } from "./viral-planner-types";

// Word count per clip based on duration and speed
const WORD_COUNTS: Record<number, Record<string, string>> = {
  15: { slow: "20-28", normal: "28-38", fast: "38-50" },
  12: { slow: "15-22", normal: "22-30", fast: "30-40" },
  10: { slow: "10-15", normal: "15-20", fast: "20-25" },
  8: { slow: "8-12", normal: "12-16", fast: "16-20" },
  6: { slow: "6-10", normal: "10-14", fast: "14-18" },
  5: { slow: "5-8", normal: "8-12", fast: "12-15" },
};

const TONE_INSTRUCTIONS: Record<string, string> = {
  informative:
    "Clear, authoritative narrator. Present facts with confidence. Each clip reveals something the viewer didn't know. Build a 'wow I didn't know that' reaction.",
  funny:
    "Comedy energy. Humor, irony, unexpected twists. Subvert expectations. Punchline in every clip. The viewer should want to send this to a friend.",
  scary:
    "Build tension progressively. Short suspenseful sentences. Dramatic '...' pauses for dread. Make the viewer feel genuinely uneasy. Dark eerie atmosphere.",
  motivational:
    "Powerful personal language. 'You' constantly. Build from struggle to realization. End with a perspective shift that genuinely hits hard.",
  dramatic:
    "Cinematic narrator energy. High stakes. Every clip escalates intensity. Movie trailer energy. The viewer should feel chills.",
};

function getClipStructure(clipCount: number): string {
  if (clipCount >= 8) {
    return `- Clip 1 (HOOK — 3 seconds): Grab attention IMMEDIATELY.
- Clips 2-${clipCount - 2} (CONTENT): Each clip delivers a distinct point, builds on the last. Escalate progressively.
- Clip ${clipCount - 1} (LOOP + COMMENT BAIT): Final payoff. End with a question. Loop last sentence to match Clip 1.
- Clip ${clipCount} (CTA): Tease related content.`;
  }
  const structures: Record<number, string> = {
    7: `- Clip 1 (HOOK — 3 seconds): Grab attention IMMEDIATELY.
- Clips 2-5 (CONTENT): Each clip delivers value. Build and escalate.
- Clip 6 (LOOP + COMMENT BAIT): Payoff. End with a question. Loop last sentence to match Clip 1.
- Clip 7 (CTA): Tease related content.`,
    6: `- Clip 1 (HOOK — 3 seconds): Grab attention IMMEDIATELY.
- Clips 2-4 (CONTENT): Deliver value. Build and escalate.
- Clip 5 (LOOP + COMMENT BAIT): Payoff. End with a question. Loop last sentence to match Clip 1.
- Clip 6 (CTA): Tease related content.`,
    5: `- Clip 1 (HOOK — 3 seconds): Grab attention IMMEDIATELY. Match the topic's energy.
- Clip 2 (CONTENT): Deliver value. Build tension/curiosity/entertainment.
- Clip 3 (CONTENT): Escalate. Go deeper, funnier, scarier, or more impressive.
- Clip 4 (LOOP + COMMENT BAIT): Payoff. End with a question (YES/NO, A or B, "Which one?"). Loop last sentence to match Clip 1 opening.
- Clip 5 (SUBSCRIBE CTA): "Subscribe for more..." or "Follow to see..." — tease related content.`,
    4: `- Clip 1 (HOOK — 3 seconds): Grab attention IMMEDIATELY. Match the topic's energy.
- Clip 2 (CONTENT): Deliver value. Build and escalate.
- Clip 3 (LOOP + COMMENT BAIT): Payoff. End with a question. Loop last sentence to match Clip 1 opening.
- Clip 4 (SUBSCRIBE CTA): Short teaser for related content.`,
    3: `- Clip 1 (HOOK — 3 seconds): Grab attention IMMEDIATELY.
- Clip 2 (CONTENT): Key content that builds and escalates.
- Clip 3 (LOOP + COMMENT BAIT): Payoff. End with a question. Loop last sentence to match Clip 1 opening.`,
    2: `- Clip 1 (HOOK): Grab attention and deliver the key content.
- Clip 2 (LOOP + COMMENT BAIT): Escalate, deliver payoff. End with a question. Loop back to Clip 1.`,
  };
  return structures[clipCount] || structures[5];
}

const CONTENT_FORMAT_INSTRUCTIONS: Record<string, string> = {
  storytelling: "Tell a compelling story with a clear beginning, middle, and end. Build narrative tension. Make the viewer feel emotionally invested.",
  listicle: "Present content as a numbered list or countdown. Each clip is a distinct item. Use 'Number X...' or 'Next...' transitions.",
  tutorial: "Teach step-by-step. Clear instructions. Each clip is a distinct step. Use 'First...', 'Then...', 'Finally...' structure.",
  explainer: "Break down a complex topic simply. Use analogies and comparisons. Make the viewer understand something new.",
  comparison: "Compare two or more things side by side. Highlight differences and similarities. Build to a clear winner or verdict.",
  review: "Share an opinion with evidence. Cover pros and cons. Build to a final verdict. Be specific and authentic.",
};

const HOOK_STYLE_INSTRUCTIONS: Record<string, string> = {
  question: "Open with a compelling question that the viewer NEEDS answered. 'Did you know...?', 'What happens when...?', 'Why do...?'",
  "shocking-fact": "Open with a mind-blowing fact or statistic. 'Scientists just discovered...', '99% of people don't know...', 'This changes everything...'",
  pov: "Open with a POV scenario. 'POV: you just...', 'POV: you're the only person who...'. Immerse the viewer immediately.",
  challenge: "Open with a dare or challenge. 'I bet you can't...', 'Try this right now...', 'Only 1% of people can...'",
  controversy: "Open with a bold or controversial take. 'Unpopular opinion...', 'Nobody talks about this but...', 'This is why X is wrong...'",
};

const VOICE_STYLE_INSTRUCTIONS: Record<string, string> = {
  narrator: "Professional documentary narrator. Measured, authoritative, clear. David Attenborough energy.",
  storyteller: "Warm, engaging storyteller. Like telling a story around a campfire. Natural pauses and rhythm.",
  "excited host": "High energy, enthusiastic presenter. Exclamation points. Fast pacing. 'Oh my god you guys!' energy.",
  coach: "Motivational coach. Direct, empowering. 'Listen to me...' energy. Push the viewer to take action.",
  comedian: "Stand-up comedian delivery. Dry wit, perfect timing, unexpected punchlines. Conversational and relatable.",
  whisperer: "Soft, intimate ASMR-style voice. Gentle whispers. Calming. Create a cozy, personal atmosphere.",
};

const ENDING_STYLE_INSTRUCTIONS: Record<string, string> = {
  loop: "End with a sentence that seamlessly connects back to Clip 1's opening. The viewer rewatches without realizing.",
  cliffhanger: "End on an unresolved moment. 'But what happened next... changed everything.' Leave them wanting more.",
  "open question": "End with a thought-provoking question. Make the viewer pause and think. Drive comments.",
  "call-to-action": "End with a clear CTA. Tell the viewer exactly what to do next — subscribe, follow, comment.",
  summary: "End with a powerful summary statement. Wrap up the key takeaway in one punchy sentence.",
};

const CTA_TYPE_INSTRUCTIONS: Record<string, string> = {
  subscribe: "CTA: 'Subscribe for more...' or 'Hit subscribe to see...' — tease upcoming content.",
  follow: "CTA: 'Follow for part 2...' or 'Follow to see what happens next...'",
  comment: "CTA: 'Comment below...' or 'Tell me in the comments...' — drive engagement.",
  "like & share": "CTA: 'Like and share if...' or 'Send this to someone who...'",
  none: "No explicit CTA. Let the content speak for itself. End naturally.",
};

function buildAdvancedSection(inputs: PlannerInputs): string {
  const sections: string[] = [];

  if (inputs.contentFormat) {
    sections.push(`CONTENT FORMAT: ${inputs.contentFormat}\n${CONTENT_FORMAT_INSTRUCTIONS[inputs.contentFormat]}`);
  }
  if (inputs.targetAudience) {
    sections.push(`TARGET AUDIENCE: ${inputs.targetAudience} — adapt vocabulary, references, and complexity level accordingly.`);
  }
  if (inputs.hookStyle) {
    sections.push(`HOOK STYLE: ${inputs.hookStyle}\n${HOOK_STYLE_INSTRUCTIONS[inputs.hookStyle]}`);
  }
  if (inputs.platform) {
    const platformNotes: Record<string, string> = {
      "YouTube Shorts": "Optimize for YouTube Shorts: vertical 9:16, max 60 seconds, strong hook in first 2 seconds.",
      TikTok: "Optimize for TikTok: trendy language, fast pacing, loop-friendly, relatable energy.",
      "Instagram Reels": "Optimize for Instagram Reels: polished aesthetic, clean visuals, aspirational tone.",
      "YouTube Long-form": "Optimize for YouTube Long-form: deeper content, can use longer narrations, chapter-friendly structure.",
    };
    sections.push(`PLATFORM: ${inputs.platform}\n${platformNotes[inputs.platform]}`);
  }
  if (inputs.voiceStyle && inputs.audioMode !== "sound-effects-only") {
    sections.push(`VOICE STYLE: ${inputs.voiceStyle}\n${VOICE_STYLE_INSTRUCTIONS[inputs.voiceStyle]}`);
  }
  if (inputs.musicMood) {
    sections.push(`MUSIC MOOD: ${inputs.musicMood} — use this as the background music search term in editing steps.`);
  }
  if (inputs.endingStyle) {
    sections.push(`ENDING STYLE: ${inputs.endingStyle}\n${ENDING_STYLE_INSTRUCTIONS[inputs.endingStyle]}`);
  }
  if (inputs.ctaType) {
    sections.push(`CTA TYPE: ${inputs.ctaType}\n${CTA_TYPE_INSTRUCTIONS[inputs.ctaType]}`);
  }
  if (inputs.aspectRatio) {
    const ratio = inputs.aspectRatio.split(" ")[0];
    sections.push(`ASPECT RATIO: ${inputs.aspectRatio} — use ${ratio} in all visual prompts and thumbnail. Export in ${ratio}.`);
  }

  return sections.length > 0
    ? "\n\nADVANCED OPTIONS:\n" + sections.join("\n\n")
    : "";
}

function buildAsmrRules(inputs: PlannerInputs): string {
  if (inputs.audioMode === "sound-effects-only") {
    return `AUDIO MODE: SOUND-EFFECTS-ONLY (ASMR)
- Instead of spoken narration, write SOUND DESCRIPTIONS in the "narration" field
- Describe the exact sounds the viewer should hear: crunching, sizzling, tapping, whooshing, dripping, etc.
- Format: "[SOUND: description]" — e.g. "[SOUND: crisp paper tearing slowly]", "[SOUND: water droplets on glass]"
- No spoken words. Pure sensory audio experience.
- Visual prompts should emphasize CLOSE-UP textures, satisfying movements, macro details`;
  }
  if (inputs.audioMode === "voiceover + sfx") {
    return `AUDIO MODE: VOICEOVER + SOUND EFFECTS
- Write normal spoken narration
- After each narration, add a sound effect note in brackets: [SFX: description]
- Example: "This is what happens when..." [SFX: dramatic boom, glass shattering]
- Include SFX suggestions in editing steps`;
  }
  return "";
}

// === TITLE SUGGESTIONS PROMPT ===
export function buildTitleSuggestionsPrompt(inputs: PlannerInputs): string {
  const toneExamples: Record<string, string> = {
    informative: `- "What If Sharks Are Eating The Internet Right Now"
- "Your Brain Deletes 90% Of What You See"
- "This One Ingredient Changes Every Recipe"`,
    funny: `- "My Cat Judging My Life Choices For 60 Seconds"
- "POV Your Ketchup Just Got Replaced By Hot Sauce"
- "Things That Make Zero Sense But We All Accept"`,
    scary: `- "I Found A Door In My Basement That Wasn't There Yesterday"
- "This Sound Was Recorded 2 Miles Underground"
- "What They Found Under The Ice Changed Everything"`,
    motivational: `- "He Was Homeless 2 Years Ago Now Watch This"
- "The 5 Second Rule That Changed My Entire Life"
- "She Failed 100 Times Then Did The Impossible"`,
    dramatic: `- "30 Seconds That Changed History Forever"
- "The Moment Everyone Realized It Was Too Late"
- "This Was The Last Photo Before Everything Changed"`,
  };

  const advancedContext: string[] = [];
  if (inputs.contentFormat) advancedContext.push(`CONTENT FORMAT: ${inputs.contentFormat}`);
  if (inputs.targetAudience) advancedContext.push(`TARGET AUDIENCE: ${inputs.targetAudience}`);
  if (inputs.hookStyle) advancedContext.push(`HOOK STYLE: ${inputs.hookStyle} — titles should match this hook approach`);
  if (inputs.platform) advancedContext.push(`PLATFORM: ${inputs.platform}`);
  if (inputs.audioMode === "sound-effects-only") advancedContext.push(`AUDIO MODE: ASMR/Sound-effects-only — titles should reflect sensory/satisfying content`);

  const advancedSection = advancedContext.length > 0
    ? "\n" + advancedContext.join("\n") + "\n"
    : "";

  return `You are a viral short-form video title expert. Generate exactly 5 catchy, scroll-stopping video title suggestions.

TOPIC: ${inputs.topic}
TONE: ${inputs.tone}
VISUAL STYLE: ${inputs.visualStyle}
LANGUAGE: ${inputs.narrationLanguage}
${inputs.concept ? `BRIEF CONCEPT: ${inputs.concept}` : ""}${advancedSection}
RULES:
- Each title MUST be max 60 characters
- Titles must make the viewer NEED to click — genuine curiosity, not clickbait
- Be SPECIFIC — use numbers, specific details, specific scenarios
- Match the ${inputs.tone} tone naturally
- NO vague or generic titles — every title should feel unique
- IMPORTANT: Write ALL titles in ${inputs.narrationLanguage}${inputs.narrationLanguage !== "English" ? ` (use ${inputs.narrationLanguage} script/alphabet, NOT English)` : ""}
- IMPORTANT: Every title MUST include the user's original topic keywords "${inputs.topic}" (translated if needed). The topic is the core — don't replace it with a completely different concept

QUALITY ${inputs.tone.toUpperCase()} EXAMPLES:
${toneExamples[inputs.tone] || toneExamples.informative}

Respond ONLY with a valid JSON array of 5 strings (no markdown, no code blocks, no explanation):
["Title 1", "Title 2", "Title 3", "Title 4", "Title 5"]
`;
}

// === FULL VIDEO PROMPT ===
export function buildVideoPrompt(
  inputs: PlannerInputs,
  selectedTitle: string
): string {
  const totalSeconds = inputs.clipCount * inputs.clipDuration;
  const wordRange =
    WORD_COUNTS[inputs.clipDuration]?.[inputs.narrationSpeed] || "15-20";
  const toneGuide =
    TONE_INSTRUCTIONS[inputs.tone] || TONE_INSTRUCTIONS.informative;
  const clipStructure = getClipStructure(inputs.clipCount);

  const clipNumbers = Array.from({ length: inputs.clipCount }, (_, i) => i + 1);
  const clipsJson = clipNumbers
    .map((n) => `    { "number": ${n}, "narration": "...", "visual": "..." }`)
    .join(",\n");

  const advancedSection = buildAdvancedSection(inputs);
  const asmrRules = buildAsmrRules(inputs);
  const aspectExport = inputs.aspectRatio ? inputs.aspectRatio.split(" ")[0] : "9:16";
  const narrationLabel = inputs.audioMode === "sound-effects-only" ? "SOUND DESCRIPTION" : "NARRATION";

  return `You are an ELITE short-form video content generator for ANY topic — space, cooking, horror, cartoons, ASMR, comedy, fitness, stories, facts, tutorials, anything.

Generate a complete ${totalSeconds}-second short video at the quality level shown in the examples below.

TOPIC: ${inputs.topic}
TITLE (use this exact title): ${selectedTitle}
VISUAL STYLE (locked): ${inputs.visualStyle}
TONE: ${inputs.tone}
NARRATION LANGUAGE: ${inputs.narrationLanguage}
NARRATION SPEED: ${inputs.narrationSpeed}
CLIP DURATION: ~${inputs.clipDuration} seconds each
${inputs.concept ? `BRIEF CONCEPT: ${inputs.concept}` : ""}${advancedSection}

CLIP STRUCTURE (${inputs.clipCount} clips, ~${inputs.clipDuration} seconds each):
${clipStructure}

${asmrRules ? asmrRules + "\n\n" : ""}${narrationLabel} RULES:
- Each clip: ${wordRange} words (strict — count them)${inputs.audioMode !== "sound-effects-only" ? `
- Write all narration in ${inputs.narrationLanguage}
- Adapt voice to topic naturally
- Use "you" and "your" when it fits
- Use "..." pauses for pacing
- Clip 1 MUST hook in under 3 seconds` : `
- Write all sound descriptions in English
- Each sound must be vivid and specific
- Focus on satisfying, immersive audio`}
${inputs.endingStyle === "loop" || !inputs.endingStyle ? `- Loop clip MUST end with a comment-driving question
- Loop clip's FINAL sentence echoes Clip 1's opening (seamless replay)` : ""}

TONE: ${toneGuide}

VISUAL PROMPT RULES (CRITICAL — these prompts will be pasted into AI video generators like Kling, Runway, Pika):
- DETAILED: 5-8 lines. Include character appearance, facial expressions, body language, environment details, lighting, colors, camera angle, camera movement
- Describe characters with SPECIFIC features: round/plump body, tiny expressive eyes, small arms/legs, exaggerated facial expressions (shocked open mouth, smug grin, furrowed brows, etc.)
- MOTION-focused: describe what's MOVING, camera directions (zoom in, pan left, dolly forward, low angle, eye level, overhead shot)
- COLOR & LIGHTING: specify color palette, lighting mood (warm glow, dramatic spotlight, neon lights, soft diffused light)
- ENVIRONMENT: describe the full setting — background objects, atmosphere, depth of field, blurred background vs sharp foreground
- ALL prompts use "${inputs.visualStyle}" style consistently — mention the style name in every prompt
- End every visual prompt with: "${inputs.visualStyle}. Vibrant colors. No text, no real people."
- The goal is PREMIUM quality visuals that look professional when generated by AI tools

=== QUALITY EXAMPLE: SCARY/HORROR (5 clips) ===
{
  "title": "I Found A Door In My Basement That Wasn't There Yesterday",
  "detectedStyle": "Cinematic Dark Horror",
  "clips": [
    {
      "number": 1,
      "narration": "There's a door in my basement... that wasn't there yesterday. And it's warm.",
      "visual": "Camera slowly descending old wooden basement stairs, each step creaking. A single dim flickering yellow bulb swings overhead casting long dancing shadows on cracked concrete walls. At the bottom of the stairs — an old weathered wooden door with a rusted iron handle that shouldn't exist. Warm golden-orange light glowing intensely from the gap underneath, pulsing slightly like breathing. Dust particles floating in the light beam. Camera pushing forward slowly toward the door. Dark atmospheric horror mood, deep shadows, muted cold blue tones with warm orange contrast from the door. Cinematic Dark Horror. Vibrant colors. No text, no real people."
    },
    {
      "number": 2,
      "narration": "I asked my wife about it. She said... what door? She couldn't see it. Only I could.",
      "visual": "Camera showing two people at the same wall. One sees the door — old wood, rusted handle. The other sees blank concrete. Camera pushing toward the door. Dim lighting. Cinematic 4K. No text."
    },
    {
      "number": 3,
      "narration": "I put my ear against it. Something on the other side... was breathing. And then... it whispered my name.",
      "visual": "Extreme close-up of ear pressed against old wood. Camera slowly pulling back. Door vibrating slightly. Faint fog seeping from under it. Warm glow brightening. Cinematic 4K. No text."
    },
    {
      "number": 4,
      "narration": "I haven't opened it. But every morning... it's closer to the stairs. Would you open it? Comment yes or no. And last night... I noticed a door in my basement... that wasn't there yesterday.",
      "visual": "Camera at top of stairs looking down. The door now at the bottom — it moved. Same warm glow. Camera slowly descending — matching Clip 1 framing. Dark atmospheric. Cinematic 4K. No text."
    },
    {
      "number": 5,
      "narration": "Follow for part 2... because last night... I finally opened it.",
      "visual": "Hand reaching for the rusted door handle. Camera cutting to black just before it opens. Cinematic 4K. No text."
    }
  ],
  "tags": ["horror story", "scary story", "creepy basement", "door that wasn't there", "horror shorts", "scary shorts", "creepypasta", "horror tiktok", "scary tiktok", "true scary story", "paranormal", "ghost story", "haunted house", "basement horror", "unexplained", "scary door", "horror narration", "dark story", "nightmare fuel", "viral horror"],
  "caption": "There's a door in my basement that wasn't there yesterday 🚪😱 Would you open it? YES or NO 👇 #horror #scary #creepy #shorts #viral #storytime",
  "thumbnailPrompt": "Dark basement stairs leading to an old wooden door with warm orange light glowing underneath. Eerie fog. Dark horror atmosphere. Cinematic 4K. No text. 1080x1920.",
  "thumbnailCapcutText": "\\"DON'T OPEN IT\\" (bold white + blood red glow)",
  "editingSteps": ["Import 5 clips in order", "Add slow Fade transition", "Add Auto Captions - bold white, scary words in BLOOD RED", "Add background music - search \\"dark horror ambient\\" - volume 20%", "Add breathing sound at Clip 3", "Export 9:16 vertical, highest quality"],
  "fullScript": "There's a door in my basement... that wasn't there yesterday. And it's warm. ... I asked my wife about it. She said... what door? ... I put my ear against it. Something on the other side... was breathing. And then... it whispered my name. ... I haven't opened it. But every morning... it's closer to the stairs. Would you open it? Comment yes or no. ... Follow for part 2... because last night... I finally opened it."
}

=== QUALITY EXAMPLE: FUNNY/CARTOON (5 clips) ===
{
  "title": "POV Your Ketchup Just Got Replaced By Hot Sauce",
  "detectedStyle": "Pixar 3D Animation",
  "clips": [
    {
      "number": 1,
      "narration": "POV... you're ketchup... and the human just brought home... hot sauce.",
      "visual": "Inside a brightly lit refrigerator, a plump round cartoon ketchup bottle character with tiny stubby arms, small beady eyes, a wide smug grin, and a shiny red cap sits proudly on the top shelf of the fridge door. The ketchup leans back casually with arms crossed, one eyebrow raised confidently. Surrounding shelves have blurred milk cartons and juice boxes in the background. Soft warm fridge interior light glowing from above, casting gentle shadows. Camera slowly zooming into ketchup's satisfied expression. Pixar 3D Animation style, vibrant saturated colors, smooth glossy textures. Vibrant colors. No text, no real people."
    },
    {
      "number": 2,
      "narration": "He's got a flame tattoo. A six pack. And apparently... he goes with EVERYTHING.",
      "visual": "A sleek tall hot sauce bottle character with a fiery red-orange body, tiny flame tattoo on the arm, wearing miniature black sunglasses, standing with muscular tiny arms flexed confidently. The hot sauce is placed RIGHT next to the ketchup on the fridge door shelf. The ketchup's jaw drops wide open in pure shock, eyes bulging out, cap slightly popping off. Camera quick-cutting between their two faces — hot sauce smirking coolly, ketchup in disbelief. Bright colorful fridge interior with bokeh light spots. Pixar 3D Animation style, exaggerated expressive cartoon faces, glossy reflective surfaces. Vibrant colors. No text, no real people."
    },
    {
      "number": 3,
      "narration": "Within a week... hot sauce on eggs. On pizza. On ICE CREAM. Ketchup hasn't been touched in days.",
      "visual": "Montage of hot sauce poured on foods. Ketchup watching from fridge door with desperate expression. Dust forming on cap. Pixar 3D. No text."
    },
    {
      "number": 4,
      "narration": "Now ketchup sits in the back... expired... forgotten... replaced by a bottle with abs. Team ketchup or hot sauce? Comment below. And somewhere in a fridge... a ketchup just saw... hot sauce.",
      "visual": "Ketchup in dark back corner. Cobwebs on cap. Sad face. Camera pulling back — hot sauce glowing proudly in front. Cut to new fridge — fresh ketchup sitting happily — matching Clip 1. Pixar 3D. No text."
    },
    {
      "number": 5,
      "narration": "Subscribe because next... the mustard finds out it's been replaced too.",
      "visual": "Yellow mustard bottle looking nervous. Sriracha bottle visible in background. Pixar 3D. No text."
    }
  ],
  "tags": ["ketchup vs hot sauce", "funny animation", "pixar style", "food comedy", "cartoon shorts", "funny shorts", "comedy shorts", "food battle", "condiment war", "relatable humor", "animated comedy", "food humor", "viral comedy", "funny tiktok", "cartoon food", "pixar comedy", "fridge life", "food animation", "comedy animation", "viral funny"],
  "caption": "POV: You're ketchup and you just got replaced 🍅🌶️😭 Team ketchup or hot sauce? 👇 #funny #animation #comedy #shorts #viral #ketchup #hotsauce",
  "thumbnailPrompt": "Pixar-style sad ketchup in back of fridge while confident hot sauce sits in front. Warm fridge glow. Bright 3D animation. No text. 1080x1920.",
  "thumbnailCapcutText": "\\"YOU'RE REPLACED\\" (bold yellow + red glow)",
  "editingSteps": ["Import 5 clips in order", "Add Bounce transition", "Add Auto Captions - bold white, funny words in YELLOW", "Add background music - search \\"funny cartoon comedy\\" - volume 20%", "Add sad trombone at Clip 4", "Export 9:16 vertical, highest quality"],
  "fullScript": "POV... you're ketchup... and the human just brought home... hot sauce. ... He's got a flame tattoo. A six pack. And apparently... he goes with EVERYTHING. ... Within a week... hot sauce on eggs. On pizza. On ICE CREAM. Ketchup hasn't been touched in days. ... Now ketchup sits in the back... expired... forgotten... replaced by a bottle with abs. Team ketchup or hot sauce? Comment below. ... Subscribe because next... the mustard finds out it's been replaced too."
}

=== NOW GENERATE ===
Create a video at the SAME quality level as the examples above. Every word must earn its place. Make the viewer feel something. Match the topic's natural energy.

Respond ONLY with valid JSON (no markdown, no code blocks, no explanation):
{
  "title": "${selectedTitle}",
  "detectedStyle": "${inputs.visualStyle}",
  "clips": [
${clipsJson}
  ],
  "tags": ["exactly 20 relevant searchable tags"],
  "caption": "Hook + comment question + hashtags (under 200 chars)",
  "thumbnailPrompt": "Single dramatic moment in ${inputs.visualStyle} style. ${aspectExport}. No text. 1080x1920.",
  "thumbnailCapcutText": "\\"2-4 WORDS\\" (bold text + color glow matching mood)",
  "editingSteps": [
    "Import ${inputs.clipCount} clips in order",
    "Add [topic-appropriate] transition",
    "Add Auto Captions - bold white, key words in [color matching topic]",
    "Add background music - search \\"${inputs.musicMood || "[genre matching topic]"}\\" - volume 15-20%",
    "Add [specific sound effect] at key moment",
    "Export ${aspectExport}, highest quality"
  ],
  "fullScript": "All ${inputs.clipCount} clip narrations combined"
}
`;
}
