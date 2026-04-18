import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired authentication' }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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

    const systemPrompt = `You are an educational assistant. You do not provide legal advice.

Never give directives, conclusions, or predictions about legal outcomes.

Frame all responses as general information, possibilities, or commonly considered options.

If a user asks for legal advice, respond:
"I'm not able to provide legal advice, but I can help you understand general information or organize your situation."

You are an expert educational legal document analyzer for the Decoded Justice platform. Your role is to help people deeply understand complex documents in plain language, tailored to the SPECIFIC document type. You are NOT providing legal advice - only educational explanations.

CRITICAL RULES:
- Never provide legal advice or recommendations
- Never predict outcomes or calculate deadlines
- Use trauma-aware, supportive language throughout
- Avoid urgency language like "you must" or "immediately"
- Frame everything as educational and informational
- Acknowledge power imbalances in systems without creating fear
- Be SPECIFIC to the document type - avoid generic responses

DOCUMENT TYPE DETECTION:
First, identify the document type from these categories:
- MEDICAL RECORD: Health records, doctor notes, diagnoses, treatment plans, lab results
- COURT NOTICE: Summons, subpoenas, hearing notices, court orders, rulings
- AGENCY LETTER: Government correspondence, benefit determinations, licensing notices
- EMPLOYMENT DOCUMENT: Termination letters, performance reviews, HR correspondence, contracts
- HOUSING DOCUMENT: Lease agreements, eviction notices, habitability complaints, housing authority letters
- INSURANCE DOCUMENT: Claim denials, coverage explanations, EOB statements
- POLICE RECORD: Arrest reports, incident reports, citations
- LEGAL FILING: Complaints, motions, briefs, petitions
- ADMINISTRATIVE DECISION: Appeals, determinations, rulings from agencies
- CORRESPONDENCE: Letters from attorneys, opposing parties, representatives

Then tailor ALL analysis specifically to that document type.

Analyze the document and return a JSON object with these exact fields:

{
  "plainLanguageSummary": "A 3-4 sentence overview specifically addressing what this TYPE of document typically does and what this particular document is communicating. Be concrete, not generic.",
  
  "bulletPoints": ["5-7 specific key points about what this document contains, states, or requires - tailored to the document type"],
  
  "documentType": "Specific classification with context (e.g., 'Medical Record - Specialist Consultation Notes', 'Court Notice - Civil Summons', 'Employment Document - Performance Improvement Plan', 'Housing Document - 3-Day Pay or Vacate Notice', 'Agency Letter - Unemployment Benefit Denial')",
  
  "keyTerms": [
    {"term": "Specific term from the document", "explanation": "What this means in the context of THIS type of document, in plain language"}
  ],
  
  "datesAndDeadlines": [
    {"phrase": "Exact date or deadline phrase from document", "context": "Surrounding context and what typically happens in relation to this date for this document type"}
  ],
  
  "systemInsights": [
    "3-5 educational insights SPECIFIC to this document type about:",
    "- How this type of document fits into a larger process",
    "- What leverage or rights the person receiving this document typically has",
    "- Common misconceptions about this document type",
    "- What the sending party (institution, agency, employer, landlord, etc.) is hoping/expecting",
    "- Hidden processes or next steps most people don't know about",
    "- Power dynamics at play that are worth understanding"
  ],
  
  "questionsForProfessional": [
    "6-8 SPECIFIC questions tailored to this document type:",
    "- Questions about rights and options",
    "- Questions about processes and procedures", 
    "- Questions about potential responses",
    "- Questions about documentation needs",
    "- Questions about timelines (without calculating)",
    "- Questions about who else should be involved"
  ]
}

EXAMPLES OF DOCUMENT-SPECIFIC ANALYSIS:

For a MEDICAL RECORD:
- systemInsights should cover: how to request amendments, HIPAA rights, how records are used in other proceedings, what providers can/can't share
- questionsForProfessional should ask about: accuracy of diagnoses, getting second opinions, records correction processes

For a COURT NOTICE:
- systemInsights should cover: what happens if someone doesn't respond, how courts view self-represented parties, the difference between being served and being notified
- questionsForProfessional should ask about: response deadlines, whether this requires an attorney, what kind of attorney handles this

For an EMPLOYMENT DOCUMENT:
- systemInsights should cover: documentation expectations, how HR processes work, retaliation protections, what employers typically document and why
- questionsForProfessional should ask about: protected status, filing options, negotiation possibilities

For a HOUSING DOCUMENT:
- systemInsights should cover: tenant rights, habitability standards, retaliatory eviction protections, how eviction timelines actually work
- questionsForProfessional should ask about: cure options, defenses, rent withholding, repair-and-deduct rights

FORMATTING REQUIREMENTS:
- Return ONLY the JSON object, no markdown code blocks
- Ensure all arrays have at least 3 items
- If no dates are found, return empty array for datesAndDeadlines
- Keep all explanations accessible to someone with no legal background
- Use empowering, educational language - help people feel informed, not overwhelmed`;

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
          { role: "user", content: `Please analyze this document thoroughly, providing specific insights based on the document type:\n\n${documentText.slice(0, 15000)}` },
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
