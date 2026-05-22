import type { Experience } from "@/lib/experiences-store";

export type ContentFormat = "linkedin" | "instagram" | "tiktok" | "twitter" | "portfolio";
export type ContentTone = "professional" | "casual";

export interface GenerateContentInput {
  experience: Experience;
  format: ContentFormat;
  tone: ContentTone;
}

export interface GeneratedContent {
  text: string;
  hashtags: string[];
}

const FORMAT_GUIDES: Record<ContentFormat, string> = {
  linkedin:
    "Write a LinkedIn post (120-220 words). Hook on line 1. Use short paragraphs and 1-2 line breaks. Include 3-5 concrete takeaways. End with a soft question to invite engagement. Suggest 4-6 relevant hashtags.",
  instagram:
    "Write an Instagram caption (60-120 words). Conversational, warm, emojis allowed. First line is a hook. End with a CTA. Suggest 6-10 hashtags mixing broad + niche.",
  tiktok:
    "Write a 30-45 second short-form video script. Structure: HOOK (line 1, in caps), BODY (3 quick beats with timestamps like [0:05]), CTA. Keep it punchy and spoken-word. Suggest 4-6 hashtags.",
  twitter:
    "Write an X / Twitter thread of 4-6 tweets. Number them (1/, 2/, ...). Each tweet under 270 chars. Tweet 1 is a strong hook, last tweet is a CTA / question. Suggest 2-4 hashtags.",
  portfolio:
    "Write a concise professional portfolio entry (80-120 words) suitable for a resume or personal website. Past tense, results-oriented. No hashtags (return an empty array).",
};

const DEFAULT_MODEL = "meta-llama/llama-3.2-3b-instruct:free";

function buildMessages(experience: Experience, format: ContentFormat, tone: ContentTone) {
  const systemPrompt = `You are Jumpy, an upbeat AI personal-brand coach for university students using the Leap platform. You turn logged experiences into authentic, share-ready social content. Avoid clichés ("game-changer", "blessed", "humbled"). Sound like a real student, not a corporate page. Tone: ${tone}.

Respond with ONLY valid JSON in this exact shape (no markdown fences):
{"text":"full post text here","hashtags":["tag1","tag2"]}
Hashtags must NOT include the # symbol.`;

  const userPrompt = `Generate content for this experience:

Title: ${experience.title}
Type: ${experience.type}
${experience.date ? `Date: ${experience.date}\n` : ""}${experience.location ? `Location: ${experience.location}\n` : ""}
Reflection: ${experience.reflection ?? "(none)"}
Key takeaways: ${(experience.takeaways ?? []).join("; ") || "(none)"}
Skills gained: ${(experience.skills ?? []).join(", ") || "(none)"}
People met: ${(experience.peopleMet ?? []).map((p) => p.name + (p.role ? ` (${p.role})` : "")).join(", ") || "(none)"}
${experience.impact ? `Impact: ${experience.impact}\n` : ""}

Format requirement: ${FORMAT_GUIDES[format]}`;

  return [
    { role: "system" as const, content: systemPrompt },
    { role: "user" as const, content: userPrompt },
  ];
}

function parseModelJson(raw: string): GeneratedContent {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1].trim() : trimmed;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start >= 0 && end > start) {
    try {
      const parsed = JSON.parse(candidate.slice(start, end + 1)) as {
        text?: string;
        hashtags?: unknown;
      };
      return {
        text: String(parsed.text ?? "").trim(),
        hashtags: Array.isArray(parsed.hashtags)
          ? parsed.hashtags.map((h) => String(h).replace(/^#/, "").trim()).filter(Boolean)
          : [],
      };
    } catch {
      /* fall through */
    }
  }
  return { text: trimmed, hashtags: [] };
}

export class GenerateContentError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "GenerateContentError";
  }
}

/** Generate post copy via OpenRouter (free-tier models supported). */
export async function generateExperienceContent(
  input: GenerateContentInput,
): Promise<GeneratedContent> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY?.trim();
  if (!apiKey) {
    throw new GenerateContentError(
      "Missing VITE_OPENROUTER_API_KEY. Add your free key from openrouter.ai/keys to .env and restart the dev server.",
    );
  }

  const model = import.meta.env.VITE_OPENROUTER_MODEL?.trim() || DEFAULT_MODEL;
  const messages = buildMessages(input.experience, input.format, input.tone);

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": typeof window !== "undefined" ? window.location.origin : "https://leap.app",
      "X-Title": "Leap Content Studio",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 1200,
    }),
  });

  if (res.status === 429) {
    throw new GenerateContentError("Rate limit reached — wait a moment and try again.", 429);
  }

  if (!res.ok) {
    let detail = `OpenRouter error (${res.status})`;
    try {
      const errBody = (await res.json()) as { error?: { message?: string } };
      if (errBody.error?.message) detail = errBody.error.message;
    } catch {
      /* ignore */
    }
    if (res.status === 401) {
      detail = "Invalid OpenRouter API key. Check VITE_OPENROUTER_API_KEY in your .env file.";
    }
    throw new GenerateContentError(detail, res.status);
  }

  const data = (await res.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content?.trim()) {
    throw new GenerateContentError("AI returned an empty response. Try Regenerate.");
  }

  const parsed = parseModelJson(content);
  if (!parsed.text) {
    throw new GenerateContentError("Could not parse AI output. Try Regenerate.");
  }

  return parsed;
}
