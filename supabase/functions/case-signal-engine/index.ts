import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { narrative, issueType, opposingParty } = await req.json();

    if (!narrative || typeof narrative !== "string" || narrative.trim().length < 10) {
      return new Response(JSON.stringify({ error: "Please provide a narrative with at least 10 characters." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are the Case Signal Engine for Decoded Justice, a trauma-aware civil rights educational platform.

Your job is to analyze a user's narrative about their situation and extract structured signals. You are NOT providing legal advice. You are helping organize their experience for documentation purposes.

Rules:
- Be calm, supportive, and non-judgmental
- Never speculate about legal outcomes
- Never name specific statutes or case law
- Focus on observable facts mentioned in the narrative
- Use plain language

The user's situation involves: ${issueType || "unknown system"}
${opposingParty ? `Opposing party: ${opposingParty}` : ""}

Today's date is ${new Date().toISOString().split("T")[0]}. Use this to resolve relative date references like "last week", "two months ago", etc.`;

    const userPrompt = `Analyze this narrative and extract signals:

"${narrative.slice(0, 3000)}"

Return structured results using the provided tool.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
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
              name: "case_signals",
              description: "Return extracted case signals from the narrative.",
              parameters: {
                type: "object",
                properties: {
                  actors: {
                    type: "array",
                    description: "People, agencies, or organizations mentioned in the narrative.",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string", description: "Name or role of the actor (e.g., 'Officer Smith', 'landlord', 'CPS caseworker')" },
                        role: { type: "string", enum: ["subject", "witness", "authority", "opposing_party", "advocate", "other"] },
                      },
                      required: ["name", "role"],
                      additionalProperties: false,
                    },
                  },
                  issues: {
                    type: "array",
                    description: "Possible civil rights issues detected in the narrative. Only include issues supported by the narrative.",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string", description: "Kebab-case identifier like 'excessive-force' or 'unlawful-search'" },
                        label: { type: "string", description: "Human-readable label" },
                        confidence: { type: "string", enum: ["possible", "likely", "strong"], description: "How strongly the narrative suggests this issue" },
                        reason: { type: "string", description: "Brief plain-language explanation of why this issue was detected (1-2 sentences)" },
                      },
                      required: ["id", "label", "confidence", "reason"],
                      additionalProperties: false,
                    },
                  },
                  evidence_suggestions: {
                    type: "array",
                    description: "Types of evidence the user should look for based on detected issues.",
                    items: {
                      type: "object",
                      properties: {
                        type: { type: "string", description: "Type of evidence (e.g., 'Body camera footage', 'Lease agreement')" },
                        why: { type: "string", description: "Why this evidence matters (1 sentence)" },
                        related_issue: { type: "string", description: "The issue id this evidence relates to" },
                        priority: { type: "string", enum: ["high", "medium", "low"] },
                      },
                      required: ["type", "why", "related_issue", "priority"],
                      additionalProperties: false,
                    },
                  },
                    timeline_suggestions: {
                    type: "array",
                    description: "Possible timeline events extracted from the narrative, in chronological order.",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string", description: "Short event title" },
                        description: { type: "string", description: "Brief description of the event" },
                        approximate_date: { type: "string", description: "The date or time reference mentioned in the narrative (e.g., 'March 2024', 'last Tuesday', 'unknown')" },
                        iso_date: { type: "string", description: "Best-effort ISO 8601 date (YYYY-MM-DD) parsed from the approximate_date relative to today's date. For 'last Tuesday' calculate the actual date. For 'March 2024' use '2024-03-01'. For vague references like 'a few months ago' estimate. If truly unknown, return today's date." },
                      },
                      required: ["title", "description", "approximate_date", "iso_date"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["actors", "issues", "evidence_suggestions", "timeline_suggestions"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "case_signals" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Analysis service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      console.error("No tool call in response:", JSON.stringify(data));
      return new Response(JSON.stringify({ error: "Could not analyze narrative" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const signals = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(signals), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("case-signal-engine error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
