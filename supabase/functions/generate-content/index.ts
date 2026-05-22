// Generate content (LinkedIn / Instagram / TikTok / X / Portfolio) from a logged experience.
// Uses Lovable AI Gateway with structured tool-calling for clean JSON output.

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
    "Write a concise professional portfolio entry (80-120 words) suitable for a resume or personal website. Past tense, results-oriented, third person OK. No hashtags (return an empty array).",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(
        JSON.stringify({ error: "LOVABLE_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const body = await req.json();
    const experience = body.experience as Experience;
    const format = body.format as Format;
    const tone = (body.tone as Tone) ?? "professional";

    if (!experience?.title || !format || !FORMAT_GUIDES[format]) {
      return new Response(
        JSON.stringify({ error: "Missing experience or invalid format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const systemPrompt = `You are Jumpy, an upbeat AI personal-brand coach for university students using the Leap platform. You turn logged experiences into authentic, share-ready social content. Avoid clichés ("game-changer", "blessed", "humbled"). Sound like a real student, not a corporate page. Tone: ${tone}.`;

    const userPrompt = `Generate content for this experience:

Title: ${experience.title}
Type: ${experience.type}
${experience.date ? `Date: ${experience.date}\n` : ""}${experience.location ? `Location: ${experience.location}\n` : ""}
Reflection: ${experience.reflection ?? "(none)"}
Key takeaways: ${(experience.takeaways ?? []).join("; ") || "(none)"}
Skills gained: ${(experience.skills ?? []).join(", ") || "(none)"}
People met: ${(experience.peopleMet ?? []).map((p) => p.name + (p.role ? ` (${p.role})` : "")).join(", ") || "(none)"}
${experience.impact ? `Impact: ${experience.impact}\n` : ""}

Format requirement: ${FORMAT_GUIDES[format]}

Call the return_content tool with the result.`;

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_content",
              description: "Return the generated post text and hashtags.",
              parameters: {
                type: "object",
                properties: {
                  text: { type: "string", description: "The full post / caption / script text." },
                  hashtags: {
                    type: "array",
                    items: { type: "string" },
                    description: "Hashtags WITHOUT the # symbol.",
                  },
                },
                required: ["text", "hashtags"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_content" } },
      }),
    });

    if (aiRes.status === 429) {
      return new Response(
        JSON.stringify({ error: "Rate limit reached. Please try again in a moment." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (aiRes.status === 402) {
      return new Response(
        JSON.stringify({ error: "AI credits exhausted. Add credits in Settings → Workspace → Usage." }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (!aiRes.ok) {
      const t = await aiRes.text();
      console.error("AI gateway error", aiRes.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await aiRes.json();
    const toolCall = data?.choices?.[0]?.message?.tool_calls?.[0];
    let parsed: { text: string; hashtags: string[] } | null = null;
    if (toolCall?.function?.arguments) {
      try {
        parsed = JSON.parse(toolCall.function.arguments);
      } catch (e) {
        console.error("Failed to parse tool args", e);
      }
    }

    if (!parsed) {
      // Fallback to message content if tool calling didn't fire.
      const content = data?.choices?.[0]?.message?.content ?? "";
      parsed = { text: content, hashtags: [] };
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
