// Generate social content from a logged experience via OpenRouter.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type Format = "linkedin" | "instagram" | "tiktok" | "twitter" | "portfolio";
type Tone = "professional" | "casual";

interface Experience {
  title: string;
  type: string;
  date?: string;
  location?: string;
  reflection?: string;
  takeaways?: string[];
  skills?: string[];
  peopleMet?: { name: string; role?: string }[];
  impact?: string;
}

const FORMAT_GUIDES: Record<Format, string> = {
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

function parseModelJson(raw: string): { text: string; hashtags: string[] } {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const candidate = fenced ? fenced[1].trim() : trimmed;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");
  if (start >= 0 && end > start) {
    try {
      const parsed = JSON.parse(candidate.slice(start, end + 1));
      return {
        text: String(parsed.text ?? "").trim(),
        hashtags: Array.isArray(parsed.hashtags)
          ? parsed.hashtags.map((h: string) => String(h).replace(/^#/, "").trim()).filter(Boolean)
          : [],
      };
    } catch {
      /* fall through */
    }
  }
  return { text: trimmed, hashtags: [] };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    if (!OPENROUTER_API_KEY) {
      return new Response(
        JSON.stringify({ error: "OPENROUTER_API_KEY not configured on the server." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const body = await req.json();
    const experience = body.experience as Experience;
    const format = body.format as Format;
    const tone = (body.tone as Tone) ?? "professional";
    const model = Deno.env.get("OPENROUTER_MODEL") ?? DEFAULT_MODEL;

    if (!experience?.title || !format || !FORMAT_GUIDES[format]) {
      return new Response(
        JSON.stringify({ error: "Missing experience or invalid format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const systemPrompt = `You are Jumpy, an upbeat AI personal-brand coach for university students. Tone: ${tone}. Respond with ONLY valid JSON: {"text":"...","hashtags":["tag1"]}. Hashtags without #.`;

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

    const aiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://leap.app",
        "X-Title": "Leap Content Studio",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 1200,
      }),
    });

    if (aiRes.status === 429) {
      return new Response(
        JSON.stringify({ error: "Rate limit reached. Please try again in a moment." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (!aiRes.ok) {
      const t = await aiRes.text();
      console.error("OpenRouter error", aiRes.status, t);
      return new Response(
        JSON.stringify({ error: "OpenRouter API error. Check your API key and model." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const data = await aiRes.json();
    const content = data?.choices?.[0]?.message?.content ?? "";
    const parsed = parseModelJson(content);

    if (!parsed.text) {
      return new Response(JSON.stringify({ error: "AI returned empty content" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("generate-content error", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
