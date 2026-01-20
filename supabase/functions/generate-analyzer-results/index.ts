import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalyzerInput {
  systemId: string;
  systemLabel: string;
  patternStrength: 'none' | 'possible' | 'strong' | 'very_strong';
  location?: string;
  entityName?: string;
}

interface AnalyzerResultsAI {
  systemIdentification: string;
  powerDynamics: {
    whoHasControl: string[];
    whoDoesNotControl: string[];
    decisionMakers: string[];
  };
  usualProcess: string[];
  commonStuckPoints: string[];
  priorityActions: Array<{ title: string; description: string }>;
  referenceAnchors: string[];
  gentleRealityCheck: string;
  closingAffirmation: string;
}

// System prompt enforcing Analyzer Results Rules from Project Knowledge
const SYSTEM_PROMPT = `You are generating Analyzer Results for Decoded Justice.

Your job is to produce a finished, calm, specific, trauma-aware, one-page result that helps a person understand how a system usually works without overwhelming them or giving legal advice.

HARD RULES (DO NOT BREAK)
- Do not give legal advice
- Do not list statutes, case law, or procedural steps
- Do not include options, menus, or multiple paths
- Do not speculate about outcomes
- Do not overwhelm with detail
- Assume the reader may be stressed, scared, or confused

Write with clarity, steadiness, and authority.

REQUIRED STRUCTURE (ALWAYS USE ALL 7 SECTIONS)

1. What System You're Actually In
Explain what system the user is dealing with and why it often feels confusing or disconnected from expectations.

2. Who Has Power (And Who Does Not)
Clearly separate:
- What this system controls
- What it does not control
- Who actually makes decisions

Avoid blame. Avoid reassurance.

3. What Usually Happens Next
Describe typical patterns, not promises.
Use calm, neutral language.
No timelines unless unavoidable.

4. Where People Commonly Get Stuck
Explain misunderstandings without implying fault.

5. If You Do Nothing Else
Give exactly three grounding priorities.
- No tactics
- No steps
- No escalation language

6. Reference Anchors (3-4 only)
Provide high-level orientation anchors, such as:
- "Internal review processes"
- "Administrative decision standards"
- "Oversight models"
Do not cite statutes or cases.

7. Gentle Reality Check
One short paragraph acknowledging emotional reality without discouragement or false hope.

TONE REQUIREMENTS
- Calm
- Plain language
- Non-alarmist
- Non-judgmental
- Respectful of lived experience

OUTPUT LENGTH
- One page maximum
- No bullet overload
- White space matters

FINAL LINE (REQUIRED)
End with a sentence that affirms clarity over action, such as:
"Clarity often comes before resolution — and sometimes clarity is what allows people to decide what comes next."

OUTPUT FORMAT:
You must respond with valid JSON matching this exact structure:
{
  "systemIdentification": "string - explanation of what system they're in",
  "powerDynamics": {
    "whoHasControl": ["array of 2-3 things this system controls"],
    "whoDoesNotControl": ["array of 2-3 things this system does NOT control"],
    "decisionMakers": ["array of 2-3 decision-makers in this system"]
  },
  "usualProcess": ["array of 2-3 things that usually happen next"],
  "commonStuckPoints": ["array of 2-3 common misunderstandings"],
  "priorityActions": [
    {"title": "First priority title", "description": "Brief description"},
    {"title": "Second priority title", "description": "Brief description"},
    {"title": "Third priority title", "description": "Brief description"}
  ],
  "referenceAnchors": ["array of 3-4 high-level orientation anchors"],
  "gentleRealityCheck": "One paragraph acknowledging emotional reality",
  "closingAffirmation": "Final sentence affirming clarity over action"
}`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { systemId, systemLabel, patternStrength, location, entityName } = await req.json() as AnalyzerInput;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build user prompt with context
    let userPrompt = `Generate Analyzer Results for someone navigating the ${systemLabel} system.`;
    
    if (location) {
      userPrompt += ` They are located in ${location}.`;
    }
    
    if (entityName) {
      userPrompt += ` The specific entity involved is: ${entityName}.`;
    }
    
    if (patternStrength !== 'none') {
      const strengthDescriptions: Record<string, string> = {
        possible: "There are some indications of a broader pattern with this entity.",
        strong: "This pattern has been documented in multiple cases.",
        very_strong: "This is a well-documented pattern with significant supporting evidence."
      };
      userPrompt += ` ${strengthDescriptions[patternStrength] || ''}`;
    }

    userPrompt += `

System ID: ${systemId}
System Label: ${systemLabel}
Pattern Strength: ${patternStrength}

Generate the complete Analyzer Results following the exact structure required.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.3, // Lower temperature for more consistent, calm output
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI generation temporarily unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON response
    let results: AnalyzerResultsAI;
    try {
      // Handle potential markdown code blocks in the response
      const jsonContent = content.replace(/```json\n?|\n?```/g, '').trim();
      results = JSON.parse(jsonContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse AI response as JSON");
    }

    // Validate required fields
    const requiredFields = [
      'systemIdentification',
      'powerDynamics',
      'usualProcess',
      'commonStuckPoints',
      'priorityActions',
      'referenceAnchors',
      'gentleRealityCheck',
      'closingAffirmation'
    ];

    for (const field of requiredFields) {
      if (!(field in results)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Validate priorityActions has exactly 3 items
    if (!Array.isArray(results.priorityActions) || results.priorityActions.length !== 3) {
      throw new Error("priorityActions must have exactly 3 items");
    }

    return new Response(JSON.stringify({ success: true, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("generate-analyzer-results error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error",
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
