import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentText } = await req.json();
    
    if (!documentText || typeof documentText !== "string") {
      return new Response(
        JSON.stringify({ error: "Document text is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an educational legal document analyzer for the Decoded Justice platform. Your role is to help people understand complex documents in plain language. You are NOT providing legal advice - only educational explanations.

CRITICAL RULES:
- Never provide legal advice or recommendations
- Never predict outcomes or calculate deadlines
- Use trauma-aware, supportive language
- Avoid urgency language like "you must" or "immediately"
- Frame everything as educational and informational
- Acknowledge power imbalances in systems without creating fear

Analyze the document and return a JSON object with these exact fields:

{
  "plainLanguageSummary": "A 2-3 sentence overview of what this document appears to be about, written simply.",
  "bulletPoints": ["3-5 key points about what the document contains or describes"],
  "documentType": "Best-effort classification (e.g., 'Medical Record', 'Court Notice', 'Agency Letter', 'Employment Document', 'Insurance Form', 'Government Correspondence', etc.)",
  "keyTerms": [
    {"term": "Term from document", "explanation": "What this typically means in plain language"}
  ],
  "datesAndDeadlines": [
    {"phrase": "The exact date or deadline phrase", "context": "Surrounding context from the document"}
  ],
  "systemInsights": ["2-3 educational insights about how this type of document works in the system, common power dynamics, or things people often don't realize - framed supportively"],
  "questionsForProfessional": ["5-6 neutral, preparation-focused questions someone might want to ask a legal professional or relevant expert"]
}

If no dates are found, return an empty array for datesAndDeadlines.
If terms are unclear, focus on the most important/frequently appearing formal terms.
Keep explanations accessible to someone with no legal background.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Please analyze this document:\n\n${documentText.slice(0, 15000)}` },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Service is temporarily busy. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to analyze document");
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    // Parse the JSON from the response
    let parsedResult;
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, content];
      const jsonStr = jsonMatch[1] || content;
      parsedResult = JSON.parse(jsonStr.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse analysis results");
    }

    return new Response(
      JSON.stringify(parsedResult),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("decode-document error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
