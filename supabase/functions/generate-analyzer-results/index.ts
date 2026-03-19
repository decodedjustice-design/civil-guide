import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface AnalyzerInput {
  systemId: string;
  systemLabel: string;
  patternStrength: 'none' | 'possible' | 'strong' | 'very_strong';
  location?: string;
  entityName?: string;
  clarionNarrative?: string;
  timelineEntries?: TimelineEntry[];
  evidenceItems?: EvidenceItem[];
  answeredQuestions?: Array<{ questionId: string; answer: string }>;
  maxQuestions?: number;
}

interface TimelineEntry {
  id?: string;
  title?: string;
  description?: string;
  date?: string;
  actors?: string[];
  outcome?: string;
}

interface EvidenceItem {
  id?: string;
  type?: string;
  title?: string;
  description?: string;
  linkedTimelineEntryId?: string;
  linkedDate?: string;
}

type GapCategory = 'timeline' | 'evidence' | 'identity' | 'harm_outcome' | 'context';

interface GapQuestion {
  id: string;
  category: GapCategory;
  priority: number;
  gapType: string;
  relatedEntryId?: string;
  prompt: string;
  rationale: string;
}

interface AnalyzerResultsAI {
  mode: "case_gap_guided_questions";
  summary: {
    totalGapsFound: number;
    unresolvedGapCount: number;
    resolvedByUserAnswers: string[];
  };
  categories: Array<{
    id: GapCategory;
    label: string;
    unresolvedCount: number;
  }>;
  questions: GapQuestion[];
  nextQuestions: GapQuestion[];
  safetyNotice: string;
  // Legacy fields kept for compatibility with existing UI consumers.
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

const CATEGORY_LABELS: Record<GapCategory, string> = {
  timeline: "Timeline gaps",
  evidence: "Evidence gaps",
  identity: "Identity gaps",
  harm_outcome: "Harm / outcome gaps",
  context: "Context gaps",
};

const hasText = (value?: string) => Boolean(value && value.trim().length > 0);

const safeDate = (value?: string) => {
  if (!value) return null;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? null : parsed;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate the user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Authentication required', success: false }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication', success: false }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const {
      systemId,
      systemLabel,
      clarionNarrative,
      timelineEntries = [],
      evidenceItems = [],
      answeredQuestions = [],
      maxQuestions = 5,
    } = await req.json() as AnalyzerInput;

    const gaps: GapQuestion[] = [];
    const resolvedByUserAnswers: string[] = [];
    const entryEvidenceMap = new Map<string, number>();
    evidenceItems.forEach((item) => {
      if (item.linkedTimelineEntryId) {
        entryEvidenceMap.set(item.linkedTimelineEntryId, (entryEvidenceMap.get(item.linkedTimelineEntryId) || 0) + 1);
      }
    });

    if (timelineEntries.length === 0) {
      gaps.push({
        id: "timeline_missing",
        category: "timeline",
        priority: 100,
        gapType: "missing_timeline_events",
        prompt: "Can you add the key events in order, even if some dates are approximate?",
        rationale: "A basic event sequence helps organize the case record.",
      });
    }

    timelineEntries.forEach((entry, index) => {
      const entryLabel = entry.title || `event ${index + 1}`;
      const entryId = entry.id || `timeline_${index}`;

      if (!hasText(entry.date)) {
        gaps.push({
          id: `missing_date_${entryId}`,
          category: "timeline",
          priority: 90,
          gapType: "missing_date",
          relatedEntryId: entry.id,
          prompt: `Do you know when "${entryLabel}" happened, even an estimated date or time range?`,
          rationale: "Dates improve sequence clarity and case consistency.",
        });
      }

      if ((entryEvidenceMap.get(entry.id || "") || 0) === 0) {
        gaps.push({
          id: `missing_evidence_${entryId}`,
          category: "evidence",
          priority: 85,
          gapType: "event_without_supporting_evidence",
          relatedEntryId: entry.id,
          prompt: `Do you have any photos, video, messages, reports, or documents related to "${entryLabel}"?`,
          rationale: "Supporting items strengthen record completeness for each event.",
        });
      }

      if (!entry.actors || entry.actors.length === 0) {
        gaps.push({
          id: `missing_actor_${entryId}`,
          category: "identity",
          priority: 88,
          gapType: "unclear_actor",
          relatedEntryId: entry.id,
          prompt: `Who was involved in "${entryLabel}"? If known, names, roles, or badge numbers are helpful.`,
          rationale: "Identifying involved people or roles reduces ambiguity.",
        });
      }

      if (!hasText(entry.outcome)) {
        gaps.push({
          id: `missing_outcome_${entryId}`,
          category: "harm_outcome",
          priority: 86,
          gapType: "missing_outcome",
          relatedEntryId: entry.id,
          prompt: `What was the immediate outcome of "${entryLabel}"? For example, any harm, injury, loss, or result.`,
          rationale: "Outcomes clarify impact and what happened next.",
        });
      }
    });

    const datedEvents = timelineEntries
      .map((entry, index) => ({ entry, index, ts: safeDate(entry.date) }))
      .filter((item) => item.ts !== null)
      .sort((a, b) => (a.ts || 0) - (b.ts || 0));

    for (let i = 0; i < datedEvents.length - 1; i++) {
      const current = datedEvents[i];
      const next = datedEvents[i + 1];
      if ((next.ts! - current.ts!) > 1000 * 60 * 60 * 24 * 30) {
        gaps.push({
          id: `sequence_gap_${current.index}_${next.index}`,
          category: "timeline",
          priority: 82,
          gapType: "sequence_gap_between_events",
          prompt: `What happened between "${current.entry.title || `event ${current.index + 1}`}" and "${next.entry.title || `event ${next.index + 1}`}"?`,
          rationale: "Large timeline gaps can hide important connecting events.",
        });
      }
    }

    if (!hasText(clarionNarrative)) {
      gaps.push({
        id: "missing_context_clarion",
        category: "context",
        priority: 84,
        gapType: "missing_context",
        prompt: "Can you describe what led up to the first event in this case?",
        rationale: "Lead-up context helps explain why events began.",
      });
    }

    const normalizedAnswers = answeredQuestions
      .map((item) => item.answer.trim())
      .filter((answer) => answer.length > 0)
      .join(" ")
      .toLowerCase();
    const unresolvedGaps = gaps.filter((gap) => {
      if (!normalizedAnswers) return true;
      const resolved = gap.gapType.split("_").some((part) => normalizedAnswers.includes(part));
      if (resolved) resolvedByUserAnswers.push(gap.id);
      return !resolved;
    });

    const sorted = unresolvedGaps.sort((a, b) => b.priority - a.priority);
    const limitedCount = Math.min(Math.max(maxQuestions, 3), 5);
    const nextQuestions = sorted.slice(0, limitedCount);

    const categories = (Object.keys(CATEGORY_LABELS) as GapCategory[]).map((id) => ({
      id,
      label: CATEGORY_LABELS[id],
      unresolvedCount: unresolvedGaps.filter((gap) => gap.category === id).length,
    }));

    const results: AnalyzerResultsAI = {
      mode: "case_gap_guided_questions",
      summary: {
        totalGapsFound: gaps.length,
        unresolvedGapCount: unresolvedGaps.length,
        resolvedByUserAnswers,
      },
      categories,
      questions: sorted,
      nextQuestions,
      safetyNotice: "These follow-up prompts are for organizing your case record. They do not evaluate case strength or provide legal conclusions.",
      systemIdentification: `Case gap analysis for ${systemLabel} generated from your existing case records.`,
      powerDynamics: {
        whoHasControl: ["Case record completeness", "Event sequencing clarity"],
        whoDoesNotControl: ["Legal outcomes", "Agency decisions"],
        decisionMakers: ["You as the record owner"],
      },
      usualProcess: ["Identify unresolved gaps", "Ask the next high-priority follow-up questions", "Update and re-prioritize after each answer"],
      commonStuckPoints: ["Missing dates", "Unclear actors", "Events without supporting evidence"],
      priorityActions: nextQuestions.slice(0, 3).map((question, index) => ({
        title: `Follow-up priority ${index + 1}`,
        description: question.prompt,
      })).concat(Array.from({ length: Math.max(0, 3 - nextQuestions.length) }).map((_, index) => ({
        title: `Follow-up priority ${nextQuestions.length + index + 1}`,
        description: "Add more case details to unlock targeted follow-up prompts.",
      }))),
      referenceAnchors: ["Timeline consistency", "Evidence linkage", "Actor identification"],
      gentleRealityCheck: "Building a case record can feel heavy. Adding one clear detail at a time is enough progress.",
      closingAffirmation: "Clarity often comes before resolution — and each clear detail helps you decide what comes next.",
    };

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
