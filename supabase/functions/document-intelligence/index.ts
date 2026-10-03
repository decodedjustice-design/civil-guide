import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

type ExtractionKind = "date" | "person_or_role" | "organization" | "claim" | "event" | "evidence_reference" | "issue_signal";

interface Extraction {
  id: string;
  kind: ExtractionKind;
  text: string;
  normalized?: string;
  locator: { start: number; end: number; quoted_text: string };
  verification: "needs_review";
  rationale: string;
}

const clean = (s: string) => s.replace(/\s+/g, " ").trim();

const addUnique = (items: Extraction[], seen: Set<string>, kind: ExtractionKind, text: string, start: number, end: number, rationale: string, normalized?: string) => {
  const value = clean(text);
  if (value.length < 2) return;
  const key = kind + "|" + value.toLowerCase();
  if (seen.has(key) || items.length >= 80) return;
  seen.add(key);
  items.push({
    id: `extraction_${items.length + 1}`,
    kind,
    text: value.slice(0, 500),
    ...(normalized ? { normalized } : {}),
    locator: { start, end, quoted_text: value.slice(0, 500) },
    verification: "needs_review",
    rationale,
  });
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const body = await req.json();
    const text = String(body.text || "").trim();
    const documentId = body.documentId || null;
    const documentVersionId = body.documentVersionId || null;

    if (!text) {
      return new Response(JSON.stringify({ success: false, error: "Document text is required." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    if (text.length > 500_000) {
      return new Response(JSON.stringify({
        success: false,
        error: "Document text is too large for this extraction pass. Analyze a smaller section or use preserved extracted text.",
      }), {
        status: 413,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const extractions: Extraction[] = [];
    const seen = new Set<string>();

    const datePattern = /\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2}(?:,\s*\d{4})?|\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b|\b\d{4}-\d{2}-\d{2}\b/g;
    for (const m of text.matchAll(datePattern)) {
      const value = m[0];
      addUnique(extractions, seen, "date", value, m.index ?? 0, (m.index ?? 0) + value.length, "Date-like text detected directly in the source.", value);
    }

    const rolePattern = /\b(?:Officer|Deputy|Detective|Sergeant|Lieutenant|Sheriff|Caseworker|Social Worker|Investigator|Supervisor|Judge|Attorney|Lawyer|Landlord|Property Manager|Teacher|Principal|Doctor|Nurse|Employer|HR|Agency|Worker|Caregiver)\s+[A-Z][A-Za-z'’-]+(?:\s+[A-Z][A-Za-z'’-]+){0,3}\b/g;
    for (const m of text.matchAll(rolePattern)) {
      const value = m[0];
      addUnique(extractions, seen, "person_or_role", value, m.index ?? 0, (m.index ?? 0) + value.length, "Name-and-role pattern detected; identity must be confirmed by the user.");
    }

    const orgPattern = /\b(?:Police Department|Sheriff(?:'s)? Office|County|City of [A-Z][A-Za-z]+|Department of [A-Z][A-Za-z]+|DCYF|CPS|Superior Court|District Court|School District|Housing Authority|Department of Corrections)\b[^\n.;]{0,80}/g;
    for (const m of text.matchAll(orgPattern)) {
      const value = clean(m[0]);
      addUnique(extractions, seen, "organization", value, m.index ?? 0, (m.index ?? 0) + m[0].length, "Organization-like text detected directly in the source.");
    }

    const sentences = [...text.matchAll(/[^.!?\n]+[.!?]?/g)];
    const eventSignals = /\b(?:occurred|happened|called|contacted|visited|entered|searched|seized|stopped|detained|arrested|removed|placed|evicted|terminated|denied|requested|reported|filed|served|received|sent|met|ordered|approved|rejected|investigated|interviewed|threatened|restrained|injured|returned)\b/i;
    const evidenceSignals = /\b(?:photo|photograph|video|body[- ]?camera|recording|text message|email|letter|report|police report|medical record|court order|order|notice|document|record|screenshot|audio|voicemail|call log|dispatch|CAD)\b/i;
    const issueSignals = /\b(?:search|seiz(?:e|ed)|retaliat|discriminat|accommodation|due process|notice|eviction|removal|force|detain|arrest|denied|termination|harassment|threat|privacy|records request)\b/i;

    for (const m of sentences) {
      const sentence = clean(m[0]);
      const start = m.index ?? 0;
      const end = start + m[0].length;
      if (sentence.length < 12) continue;
      if (eventSignals.test(sentence)) addUnique(extractions, seen, "event", sentence, start, end, "Event-like sentence detected from action language.");
      if (evidenceSignals.test(sentence)) addUnique(extractions, seen, "evidence_reference", sentence, start, end, "The sentence appears to reference a record, recording, or other evidence source.");
      if (issueSignals.test(sentence)) addUnique(extractions, seen, "issue_signal", sentence, start, end, "Potential issue-related language detected; this is an investigation signal, not a legal conclusion.");
    }

    for (const m of sentences) {
      const sentence = clean(m[0]);
      const start = m.index ?? 0;
      if (sentence.length >= 25 && /\b(?:said|stated|reported|claimed|denied|alleged|according to|explained|told)\b/i.test(sentence)) {
        addUnique(extractions, seen, "claim", sentence, start, start + m[0].length, "Statement-like language detected; the source and speaker should be verified.");
      }
    }

    const counts = extractions.reduce<Record<string, number>>((a, x) => {
      a[x.kind] = (a[x.kind] || 0) + 1;
      return a;
    }, {});

    return new Response(JSON.stringify({
      success: true,
      schemaVersion: "document-intelligence.v1",
      source: {
        documentId,
        documentVersionId,
        characterCount: text.length,
        extractionMethod: "deterministic-pattern-v1",
      },
      summary: {
        total: extractions.length,
        counts,
        reviewRequired: extractions.length,
      },
      extractions,
      notice: "These are source-text extraction signals. They are not verified facts, legal findings, or credibility determinations. Review each item against the original document before relying on it."
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (error) {
    console.error("document-intelligence error:", error);
    return new Response(JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
