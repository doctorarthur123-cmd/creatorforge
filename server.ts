import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Lazy-initialized Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Fallback Title Generator with rich syntactic variation and seed-based rotation
function generateFallbackTitles(topic: string, keyword?: string, audience?: string, seedStr?: string, angleChoice?: string) {
  const t = topic.trim();
  const kw = keyword?.trim() || t;
  const aud = audience?.trim() ? `for ${audience.trim()}` : "";
  const seed = (seedStr ? Array.from(seedStr).reduce((acc, c) => acc + c.charCodeAt(0), 0) : Date.now()) % 1000;

  // Rich, varied syntactic patterns per category (no repetitive AI cliches)
  const curiosityPool = [
    `The Unspoken Reality of ${t} Most People Ignore`,
    `What Actually Happens When You Take ${t} Seriously`,
    `The Counter-Intuitive Truth About ${t} (${kw})`,
    `Why Traditional Advice on ${t} Is Quietly Breaking Down`,
    `I Examined the Top 1% in ${t} — Here's What They Do Differently`,
    `The Hidden Bottleneck in ${t} (And How to Unblock It)`,
    `Everything You Were Told About ${t} Might Be Backward`,
    `The Missing Variable That Decides Your Success in ${t}`,
    `Why Your Current Approach to ${t} Isn't Working As Expected`,
    `Rethinking ${t}: The Unfiltered Perspective`,
  ];

  const searchPool = [
    `How to Master ${t} in 2026: Complete Step-by-Step Blueprint ${aud}`.trim(),
    `${kw} Explained Simply: The Practical Beginner-to-Pro Guide`,
    `${t} Masterclass: Core Fundamentals, Workflows & Best Practices`,
    `How to Fix the Most Critical Mistakes in ${t} (${kw})`,
    `The Modern ${t} Framework: Clear Walkthrough ${aud}`.trim(),
    `${kw} Demystified: What You Need to Know Before Starting`,
    `Step-by-Step Guide to ${t}: Systems, Tools, and Execution`,
    `The Complete ${t} Diagnostic: How to Audit & Optimize Your Results`,
    `Best Practices for ${t} in 2026 (Actionable Tutorial)`,
    `How to Approach ${t} From Scratch Without Wasting Time`,
  ];

  const emotionalPool = [
    `The Turning Point: How Taking ${t} Seriously Shifted Everything ${aud}`.trim(),
    `If You Feel Stuck With ${t}, Watch This Before Giving Up`,
    `The Real Cost of Procrastinating on ${t} (A Candid Talk)`,
    `Overcoming the Frustration of ${t}: What Finally Clicked for Me`,
    `The Honest Reality of Pursuing ${t} in Today's Landscape`,
    `Stop Doubting Your Progress in ${t}: The Compounding Effect`,
    `Why It's Okay to Struggle With ${t} (And Where to Start Today)`,
    `From Burnout to Clarity: Rebuilding My Relationship With ${t}`,
    `The Hardest Lesson ${t} Taught Me (And Why It Matters)`,
    `What Nobody Tells You About the Mental Game of ${t}`,
  ];

  const professionalPool = [
    `${t}: An Advanced Architecture & Strategic Playbook ${aud}`.trim(),
    `High-Performance ${kw}: Principles, Systems & Case Analysis`,
    `The Standardized Framework for Scaling ${t} Effectively`,
    `Deconstructing ${t}: An In-Depth Industry Breakdown`,
    `The Strategic Roadmap to Sustainable Mastery in ${t}`,
    `Executive Summary: Navigating ${t} With Precision and Data`,
    `A Systems-Level Deep Dive Into ${t} and Modern Workflows`,
    `The Blueprint for ${t}: Optimization, Metrics, and Execution`,
    `Structured Execution: Solving the Core Complexities of ${t}`,
    `Building an End-to-End System for ${kw} Mastery`,
  ];

  const shortsPool = [
    `The 60-Second Rule for ${kw}! ⏱️`,
    `Stop Overcomplicating ${t} 🛑`,
    `The 1 Thing Holding Back Your ${kw} 💡`,
    `Quick Diagnostic: Is Your ${t} Working? 🔍`,
    `3 Rapid Fixes for Better ${t} ⚡`,
    `The #1 Mistake in ${kw} (Fix This Fast) ⚠️`,
    `How Pros Actually Handle ${t} 🎯`,
    `Try This 2-Minute Habit for ${kw} 🔥`,
    `The Golden Rule of ${t} in 30 Seconds 🧠`,
    `Zero-Cost Upgrade for Your ${t} Setup 🚀`,
  ];

  // Rotate based on seed for genuine variety across repeated queries
  const shuffleAndPick = (arr: string[], count: number, offset: number) => {
    const start = (seed + offset) % arr.length;
    const result: string[] = [];
    for (let i = 0; i < count; i++) {
      result.push(arr[(start + i * 3) % arr.length]);
    }
    return result;
  };

  return {
    curiosity: shuffleAndPick(curiosityPool, 4, 0),
    search: shuffleAndPick(searchPool, 4, 2),
    emotional: shuffleAndPick(emotionalPool, 4, 4),
    professional: shuffleAndPick(professionalPool, 4, 6),
    shorts: shuffleAndPick(shortsPool, 4, 8),
  };
}

// Fallback Tags Generator function with diverse search intents and no stale repetition
function generateFallbackTags(topic: string, keyword?: string, seedStr?: string) {
  const cleanTopic = topic.trim().toLowerCase();
  const cleanKw = keyword?.trim().toLowerCase() || "";
  const words = cleanTopic.split(/\s+/).filter((w) => w.length > 2);
  const seed = (seedStr ? Array.from(seedStr).reduce((acc, c) => acc + c.charCodeAt(0), 0) : Date.now()) % 100;

  const candidatePool: string[] = [];

  // Core targets
  candidatePool.push(cleanTopic);
  if (cleanKw && cleanKw !== cleanTopic) candidatePool.push(cleanKw);

  // Diverse intent categories
  const intentModifiers = [
    "tutorial",
    "step by step guide",
    "explained simply",
    "best practices",
    "common mistakes",
    "practical walkthrough",
    "case study",
    "workflow breakdown",
    "for beginners",
    "advanced techniques",
    "tips and tricks",
    "complete roadmap",
    "overview 2026",
    "strategy",
    "how to master",
    "troubleshooting",
    "setup guide",
    "comparison review",
    "pro tips",
    "field test",
  ];

  // Synthesize varied phrases
  for (const mod of intentModifiers) {
    if (mod.startsWith("how to")) {
      candidatePool.push(`${mod} ${cleanKw || cleanTopic}`);
    } else {
      candidatePool.push(`${cleanKw || cleanTopic} ${mod}`);
      if (cleanKw && cleanTopic !== cleanKw) {
        candidatePool.push(`${cleanTopic} ${mod}`);
      }
    }
  }

  // Multi-word combinations
  if (words.length >= 2) {
    candidatePool.push(words.slice(0, 2).join(" "));
    if (words.length >= 3) {
      candidatePool.push(words.slice(1, 3).join(" "));
      candidatePool.push(`${words[0]} ${words[2]}`);
    }
  }

  // De-duplicate while preserving seed-based ordering
  const unique = Array.from(new Set(candidatePool));
  const rotated: string[] = [];
  const startIdx = seed % unique.length;
  for (let i = 0; i < unique.length; i++) {
    rotated.push(unique[(startIdx + i) % unique.length]);
  }

  return rotated.slice(0, 22);
}

// Fallback Description Generator function with dynamic narrative architectures
function generateFallbackDescription(title: string, topic: string, keywords?: string, cta?: string, seedStr?: string) {
  const cleanTitle = title.trim();
  const cleanTopic = topic.trim();
  const kwList = keywords
    ? keywords.split(",").map((k) => k.trim()).filter(Boolean)
    : [cleanTopic, "breakdown", "guide", "practical tutorial"];
  const seed = (seedStr ? Array.from(seedStr).reduce((acc, c) => acc + c.charCodeAt(0), 0) : Date.now()) % 4;

  const userCta = cta?.trim() || "If this video gave you clarity, please consider subscribing and liking to support more in-depth creator guides!";

  const openingHooks = [
    `In this video, we break down "${cleanTitle}" from the ground up. If you've been navigating ${cleanTopic}, this in-depth guide is structured to provide immediate, actionable clarity.`,
    `Looking to level up your approach to ${cleanTopic}? In "${cleanTitle}", we explore core mechanics, real-world examples, and the key workflows you need to know.`,
    `Tackling ${cleanTopic} comes with unique nuances and frequent misunderstandings. Here is your definitive breakdown of "${cleanTitle}" without the fluff.`,
    `From foundational principles to advanced execution, this walkthrough of "${cleanTitle}" equips you with tested strategies for ${cleanTopic}.`,
  ];

  const bodyOverviews = [
    `We designed this video to help creators, professionals, and enthusiasts achieve consistent results with ${cleanTopic}. Whether you are establishing your initial workflow or refining an existing setup, you will walk away with concrete takeaways you can apply right away.\n\n📌 What We Cover in This Video:\n• The foundational context behind ${cleanTopic}\n• Step-by-step implementation and key principles\n• Practical workflows to streamline your process\n• Critical pitfalls to avoid and how to diagnose issues\n• Proven recommendations for long-term consistency`,
    `This guide cuts straight through the noise to focus on what actually works in ${cleanTopic}. We analyze the underlying mechanics and demonstrate actionable techniques designed for high-impact execution.\n\n📌 Key Takeaways & Highlights:\n• Why traditional approaches to ${cleanTopic} often stall out\n• The primary framework for structuring your workflow\n• Real-world scenarios, testing, and practical demonstration\n• Essential tools and diagnostics for peak efficiency\n• Summary action items for immediate implementation`,
    `Navigating ${cleanTopic} doesn't have to be overwhelming. In this detailed breakdown, we unpack the systems and decision-making frameworks behind "${cleanTitle}".\n\n📌 Inside the Episode:\n• Foundational setup and core prerequisite knowledge\n• The central strategy explained simply and thoroughly\n• Practical execution: how to apply this step-by-step\n• High-leverage tips for avoiding costly time-wasters\n• Next steps to take your mastery further`,
  ];

  const timestampOutlines = [
    `TIMESTAMPS:\n0:00 - Introduction & Core Concept\n1:15 - Foundational Setup for ${cleanTopic}\n3:40 - The Core Framework Explained\n7:10 - Practical Walkthrough & Real-World Execution\n10:25 - Troubleshooting & Mistakes to Avoid\n13:10 - Final Summary & Action Checklist`,
    `TIMESTAMPS:\n0:00 - Why This Matters: The Big Picture\n1:30 - Key Context on ${cleanTopic}\n4:15 - Step-by-Step Methodology\n8:00 - Pro Tips & Efficiency Hacks\n11:45 - Common Traps & How to Steer Clear\n14:00 - Wrap-Up & Next Steps`,
  ];

  const chosenHook = openingHooks[seed % openingHooks.length];
  const chosenBody = bodyOverviews[seed % bodyOverviews.length];
  const chosenTimestamps = timestampOutlines[seed % timestampOutlines.length];

  const callToAction = `🔔 CONNECT & ENGAGE:\n${userCta}\n\n💬 QUESTION FOR THE COMMUNITY: What has been your biggest takeaway or challenge regarding ${cleanTopic}? Let us know in the comments below!`;

  const safeHash = cleanTopic.replace(/[^a-zA-Z0-9]/g, "");
  const safeKw = (kwList[0] || "ContentCreator").replace(/[^a-zA-Z0-9]/g, "");
  const hashtags = [
    `#${safeHash.slice(0, 25)}`,
    `#${safeKw.slice(0, 25)}`,
    "#ContentCreation",
    "#TutorialGuide",
    "#CreatorTools",
  ].filter((h) => h.length > 2);

  const mainDescription = `${chosenBody}\n\n${chosenTimestamps}`;
  const fullFormattedText = `${chosenHook}\n\n${mainDescription}\n\n${callToAction}\n\nRelevant Keywords: ${kwList.join(", ")}\n\n${hashtags.join(" ")}`;

  return {
    hook: chosenHook,
    mainDescription,
    keywordsList: kwList,
    callToAction,
    hashtags,
    fullFormattedText,
  };
}

// 1. YouTube Title Generator API
app.post("/api/generate-titles", async (req, res) => {
  try {
    const { topic, keyword, audience, creativeAngle, variationSeed } = req.body;
    if (!topic || typeof topic !== "string" || !topic.trim()) {
      res.status(400).json({ error: "Video topic is required" });
      return;
    }

    const seed = variationSeed || `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    const anglePool = [
      "Contrarian & myth-busting analysis vs. conventional advice",
      "High-efficiency workflow, secret frameworks & systems",
      "Deep-dive case study, experiment, or practical breakthrough",
      "Curiosity gap, psychological hook & counter-intuitive reveal",
      "Tactical masterclass with actionable milestones",
      "Beginner reality-check and transformative roadmap",
      "Under-the-radar insights and high-stakes problem-solving",
      "Comparison, breakdown, and unfiltered review",
    ];

    const chosenAngle = creativeAngle && creativeAngle !== "auto"
      ? creativeAngle
      : anglePool[Math.floor(Math.random() * anglePool.length)];

    const ai = getAI();
    if (!ai) {
      const fallback = generateFallbackTitles(topic, keyword, audience, seed, chosenAngle);
      res.json(fallback);
      return;
    }

    const prompt = `You are a world-class YouTube title strategist known for creating viral, honest, and high-CTR titles.
Analyze this video's specific subject, core mechanics, niche terminology, and audience:
- Topic: "${topic}"
${keyword ? `- Target Keyword: "${keyword}"` : ""}
${audience ? `- Target Audience: "${audience}"` : ""}
- Creative Angle Focus for this Run: "${chosenAngle}"
- Unique Generation Seed: "${seed}"

CRITICAL ANTI-REPETITION & DIVERSITY DIRECTIVE:
1. Every title MUST be fresh, bespoke, and uniquely crafted for this specific topic.
2. NEVER return repetitive clichés or obvious AI patterns (strictly ban: "I Tried X For 30 Days", "Why 99% of People Fail", "Do THIS", "The Secret Truth Nobody Talks About", "X Changed My Life").
3. VARY SENTENCE STRUCTURES: Use a mix of direct declarations, intriguing questions, two-part colon phrases, bracketed qualifiers, and counter-intuitive contrasts.
4. VARY VOCABULARY: Use vivid, domain-accurate vocabulary natural to real human creators in this niche. Avoid generic buzzwords.
5. VARY HOOKS & ANGLES: Emphasize unexpected findings, actionable blueprints, high-stakes decisions, or realistic problem-solving.
6. STRICT RELEVANCE: Keep all titles directly and naturally related to "${topic}". Do NOT inject random or unrelated subjects.

Generate 3-4 distinct title ideas for EACH of the 5 categories:
- curiosity: Genuine curiosity-gap titles that make viewers eager to click without deception.
- search: High-intent, evergreen search queries that real viewers type into YouTube search.
- emotional: Relatable, authentic, high-stakes, or transformative titles that resonate emotionally.
- professional: Authoritative, polished, masterclass, or framework-oriented titles for high credibility.
- shorts: Punchy, high-energy titles tailored for YouTube Shorts (under 50 characters).

Return ONLY valid JSON matching this schema:
{
  "curiosity": string[],
  "search": string[],
  "emotional": string[],
  "professional": string[],
  "shorts": string[]
}`;

    const candidateModels = ["gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.8-flash"];
    let response: any = null;
    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            temperature: 0.95,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                curiosity: { type: Type.ARRAY, items: { type: Type.STRING } },
                search: { type: Type.ARRAY, items: { type: Type.STRING } },
                emotional: { type: Type.ARRAY, items: { type: Type.STRING } },
                professional: { type: Type.ARRAY, items: { type: Type.STRING } },
                shorts: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["curiosity", "search", "emotional", "professional", "shorts"],
            },
          },
        });
        if (response && response.text) break;
      } catch (err: any) {
        lastError = err;
        console.log(`[ai] Model ${model} busy (${err?.status || err?.code || "unavailable"}), attempting next candidate...`);
      }
    }

    if (!response || !response.text) {
      console.log("[ai] Serving fresh algorithmic fallback titles");
      res.json(generateFallbackTitles(topic, keyword, audience, seed, chosenAngle));
      return;
    }

    const parsed = JSON.parse(response.text || "{}");
    if (!parsed.curiosity || !parsed.curiosity.length) {
      res.json(generateFallbackTitles(topic, keyword, audience, seed, chosenAngle));
      return;
    }
    res.json(parsed);
  } catch (error) {
    console.log("[ai] Handled title generation fallback");
    const { topic, keyword, audience, creativeAngle, variationSeed } = req.body;
    res.json(generateFallbackTitles(topic || "Video Topic", keyword, audience, variationSeed, creativeAngle));
  }
});

// 2. YouTube Tags Generator API
app.post("/api/generate-tags", async (req, res) => {
  try {
    const { topic, keyword, variationSeed } = req.body;
    if (!topic || typeof topic !== "string" || !topic.trim()) {
      res.status(400).json({ error: "Video topic or title is required" });
      return;
    }

    const seed = variationSeed || `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    const ai = getAI();
    if (!ai) {
      const fallbackTags = generateFallbackTags(topic, keyword, seed);
      res.json({ tags: fallbackTags });
      return;
    }

    const prompt = `You are an expert YouTube SEO and discovery specialist.
Generate a rich, diverse, and high-performing list of 20-25 tags for this video:
- Topic / Title: "${topic}"
${keyword ? `- Primary Keyword: "${keyword}"` : ""}
- Variation Run Seed: "${seed}"

CRITICAL DIVERSITY & SEARCH INTENT REQUIREMENTS:
1. Thoroughly analyze the user's specific subject matter, tools, methodologies, and context first.
2. Provide a wide, diverse distribution across search intents:
   - Specific user queries & long-tail search questions viewers actually type
   - Problem-solving and diagnostic phrases
   - Key terminology, sub-genres, tools, and technical concepts directly tied to this exact topic
   - Educational & intent modifiers (e.g., "walkthrough", "best practices", "for beginners", "explained", "mistakes to avoid", "guide", "workflow", "review")
   - Broader niche category anchors
3. AVOID repetitive prefix patterns (do NOT generate 10 tags that all begin with the exact same two words).
4. STRICT RELEVANCE: Every tag must be directly related and useful for this video topic. Do NOT add random or off-topic tags.

Return valid JSON with format:
{
  "tags": string[]
}`;

    const candidateModels = ["gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.8-flash"];
    let response: any = null;
    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            temperature: 0.95,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                tags: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ["tags"],
            },
          },
        });
        if (response && response.text) break;
      } catch (err: any) {
        lastError = err;
        console.log(`[ai] Model ${model} busy (${err?.status || err?.code || "unavailable"}), attempting next candidate...`);
      }
    }

    if (!response || !response.text) {
      console.log("[ai] Serving fresh algorithmic fallback tags");
      res.json({ tags: generateFallbackTags(topic, keyword, seed) });
      return;
    }

    const parsed = JSON.parse(response.text || "{}");
    if (!parsed.tags || !parsed.tags.length) {
      res.json({ tags: generateFallbackTags(topic, keyword, seed) });
      return;
    }
    res.json(parsed);
  } catch (error) {
    console.log("[ai] Handled tags generation fallback");
    const { topic, keyword, variationSeed } = req.body;
    res.json({ tags: generateFallbackTags(topic || "Video", keyword, variationSeed) });
  }
});

// 3. YouTube Description Generator API
app.post("/api/generate-description", async (req, res) => {
  try {
    const { title, topic, keywords, cta, creativeAngle, variationSeed } = req.body;
    if (!title || !title.trim() || !topic || !topic.trim()) {
      res.status(400).json({ error: "Video title and topic are required" });
      return;
    }

    const seed = variationSeed || `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

    const anglePool = [
      "Tactical walkthrough and actionable execution",
      "Myth-busting and solving critical roadblocks",
      "Step-by-step masterclass with clear milestones",
      "Candid case study and real-world results",
    ];
    const chosenAngle = creativeAngle && creativeAngle !== "auto"
      ? creativeAngle
      : anglePool[Math.floor(Math.random() * anglePool.length)];

    const ai = getAI();
    if (!ai) {
      const fallback = generateFallbackDescription(title, topic, keywords, cta, seed);
      res.json(fallback);
      return;
    }

    const prompt = `You are an elite YouTube scriptwriter and SEO copywriter.
Craft a fresh, authentic, and high-converting YouTube video description for:
- Video Title: "${title}"
- Video Topic: "${topic}"
${keywords ? `- Keywords to naturally integrate: "${keywords}"` : ""}
${cta ? `- Custom Call To Action preference: "${cta}"` : ""}
- Tone & Creative Angle: "${chosenAngle}"
- Run Seed: "${seed}"

CRITICAL ANTI-REPETITION & FRESHNESS DIRECTIVE:
1. Hook above the fold: Write a punchy 1-2 sentence opening that immediately grips the viewer and states the value without cheesy boilerplate (strictly ban: "Welcome back to the channel, today we are...").
2. Body & Structure: Provide a thoughtful, custom breakdown highlighting key takeaways specific to "${topic}". Include realistic timestamps tailored to this video's actual narrative flow.
3. Natural integration: Integrate keywords organically into authentic sentences, not as a stuffed list.
4. Community & CTA: Provide a conversational, engaging prompt to comment and subscribe directly relevant to this video's subject.
5. Hashtags: 3-5 clean, focused hashtags.

Return valid JSON with:
{
  "hook": string,
  "mainDescription": string,
  "keywordsList": string[],
  "callToAction": string,
  "hashtags": string[],
  "fullFormattedText": string
}`;

    const candidateModels = ["gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.8-flash"];
    let response: any = null;
    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            temperature: 0.95,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                hook: { type: Type.STRING },
                mainDescription: { type: Type.STRING },
                keywordsList: { type: Type.ARRAY, items: { type: Type.STRING } },
                callToAction: { type: Type.STRING },
                hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                fullFormattedText: { type: Type.STRING },
              },
              required: ["hook", "mainDescription", "keywordsList", "callToAction", "hashtags", "fullFormattedText"],
            },
          },
        });
        if (response && response.text) break;
      } catch (err: any) {
        lastError = err;
        console.log(`[ai] Model ${model} busy (${err?.status || err?.code || "unavailable"}), attempting next candidate...`);
      }
    }

    if (!response || !response.text) {
      console.log("[ai] Serving fresh algorithmic fallback description");
      res.json(generateFallbackDescription(title, topic, keywords, cta, seed));
      return;
    }

    const parsed = JSON.parse(response.text || "{}");
    if (!parsed.fullFormattedText) {
      res.json(generateFallbackDescription(title, topic, keywords, cta, seed));
      return;
    }
    res.json(parsed);
  } catch (error) {
    console.log("[ai] Handled description generation fallback");
    const { title, topic, keywords, cta, variationSeed } = req.body;
    res.json(generateFallbackDescription(title || "Title", topic || "Topic", keywords, cta, variationSeed));
  }
});

// 4. Secure Thumbnail Image Proxy for direct download
app.get("/api/download-thumbnail", async (req, res) => {
  try {
    const imageUrl = req.query.url as string;
    const filename = (req.query.filename as string) || "youtube-thumbnail.jpg";

    if (!imageUrl) {
      res.status(400).send("Image URL is required");
      return;
    }

    const parsed = new URL(imageUrl);
    // Allow only YouTube official thumbnail domains
    const allowedHosts = ["img.youtube.com", "i.ytimg.com", "i1.ytimg.com", "i2.ytimg.com", "i3.ytimg.com", "i4.ytimg.com"];
    if (!allowedHosts.includes(parsed.hostname)) {
      res.status(403).send("Invalid image source host");
      return;
    }

    const imageResp = await fetch(imageUrl);
    if (!imageResp.ok) {
      res.status(imageResp.status).send("Failed to fetch image from YouTube CDN");
      return;
    }

    const contentType = imageResp.headers.get("content-type") || "image/jpeg";
    const arrayBuffer = await imageResp.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(filename)}"`);
    res.setHeader("Content-Length", buffer.length.toString());
    res.send(buffer);
  } catch (err) {
    console.error("Thumbnail download proxy error:", err);
    res.status(500).send("Error proxying thumbnail image");
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CreatorTools Hub Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
