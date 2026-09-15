import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { detectPotentialViolations, type PotentialViolation } from "./violation-engine.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface AnalyzerInput {
  systemId: string;
  systemLabel: string;
  patternStrength?: 'none' | 'possible' | 'strong' | 'very_strong';
  location?: string;
  entityName?: string;
  clarionNarrative?: string;
  timelineEntries?: TimelineEntry[];
  evidenceItems?: EvidenceItem[];
  answeredQuestions?: Array<{ questionId: string; answer: string }>;
  maxQuestions?: number;
}
interface TimelineEntry { id?: string; title?: string; description?: string; date?: string; actors?: string[]; outcome?: string; }
interface EvidenceItem { id?: string; type?: string; title?: string; description?: string; linkedTimelineEntryId?: string; linkedDate?: string; }
type GapCategory = 'timeline' | 'evidence' | 'identity' | 'harm_outcome' | 'context';
interface GapQuestion { id: string; category: GapCategory; priority: number; gapType: string; relatedEntryId?: string; prompt: string; rationale: string; }

interface AnalyzerResultsAI {
  mode: "case_gap_and_violation_analysis";
  summary: { totalGapsFound: number; unresolvedGapCount: number; resolvedByUserAnswers: string[]; potentialViolationCount: number; };
  categories: Array<{ id: GapCategory; label: string; unresolvedCount: number; }>;
  questions: GapQuestion[];
  nextQuestions: GapQuestion[];
  potentialViolations: PotentialViolation[];
  safetyNotice: string;
  systemIdentification: string;
  powerDynamics: { whoHasControl: string[]; whoDoesNotControl: string[]; decisionMakers: string[]; };
  usualProcess: string[];
  commonStuckPoints: string[];
  priorityActions: Array<{ title: string; description: string }>;
  referenceAnchors: string[];
  gentleRealityCheck: string;
  closingAffirmation: string;
}

const CATEGORY_LABELS: Record<GapCategory, string> = {
  timeline: "Timeline gaps", evidence: "Evidence gaps", identity: "Identity gaps", harm_outcome: "Harm / outcome gaps", context: "Context gaps",
};
const hasText = (value?: string) => Boolean(value && value.trim().length > 0);
const safeDate = (value?: string) => { if (!value) return null; const parsed = Date.parse(value); return Number.isNaN(parsed) ? null : parsed; };

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) return new Response(JSON.stringify({ error: 'Authentication required', success: false }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    const supabaseClient = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: authHeader } } });
    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabaseClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) return new Response(JSON.stringify({ error: 'Invalid authentication', success: false }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const input = await req.json() as AnalyzerInput;
    const { systemId, systemLabel, location, clarionNarrative, timelineEntries = [], evidenceItems = [], answeredQuestions = [], maxQuestions = 5 } = input;
    const gaps: GapQuestion[] = [];
    const resolvedByUserAnswers: string[] = [];
    const entryEvidenceMap = new Map<string, number>();
    evidenceItems.forEach(item => { if (item.linkedTimelineEntryId) entryEvidenceMap.set(item.linkedTimelineEntryId, (entryEvidenceMap.get(item.linkedTimelineEntryId) || 0) + 1); });

    if (timelineEntries.length === 0) gaps.push({ id: 'timeline_missing', category: 'timeline', priority: 100, gapType: 'missing_timeline_events', prompt: 'Can you add the key events in order, even if some dates are approximate?', rationale: 'A basic event sequence helps organize the case record.' });
    timelineEntries.forEach((entry, index) => {
      const label = entry.title || `event ${index + 1}`; const entryId = entry.id || `timeline_${index}`;
      if (!hasText(entry.date)) gaps.push({ id: `missing_date_${entryId}`, category: 'timeline', priority: 90, gapType: 'missing_date', relatedEntryId: entry.id, prompt: `Do you know when "${label}" happened, even an estimated date or time range?`, rationale: 'Dates improve sequence clarity and deadline analysis.' });
      if ((entryEvidenceMap.get(entry.id || '') || 0) === 0) gaps.push({ id: `missing_evidence_${entryId}`, category: 'evidence', priority: 85, gapType: 'event_without_supporting_evidence', relatedEntryId: entry.id, prompt: `Do you have any photos, video, messages, reports, or documents related to "${label}"?`, rationale: 'Supporting items help test whether a potential violation can be substantiated.' });
      if (!entry.actors?.length) gaps.push({ id: `missing_actor_${entryId}`, category: 'identity', priority: 88, gapType: 'unclear_actor', relatedEntryId: entry.id, prompt: `Who was involved in "${label}"? If known, names, roles, or badge numbers are helpful.`, rationale: 'Identifying actors helps determine who had the legal duty or authority.' });
      if (!hasText(entry.outcome)) gaps.push({ id: `missing_outcome_${entryId}`, category: 'harm_outcome', priority: 86, gapType: 'missing_outcome', relatedEntryId: entry.id, prompt: `What was the immediate outcome of "${label}"? For example, any harm, injury, loss, or result.`, rationale: 'Outcomes can affect the legal theory, remedies, and proof.' });
    });
    const datedEvents = timelineEntries.map((entry, index) => ({ entry, index, ts: safeDate(entry.date) })).filter(x => x.ts !== null).sort((a,b) => (a.ts || 0) - (b.ts || 0));
    for (let i=0; i<datedEvents.length-1; i++) if ((datedEvents[i+1].ts! - datedEvents[i].ts!) > 1000*60*60*24*30) gaps.push({ id: `sequence_gap_${datedEvents[i].index}_${datedEvents[i+1].index}`, category: 'timeline', priority: 82, gapType: 'sequence_gap_between_events', prompt: `What happened between "${datedEvents[i].entry.title || `event ${datedEvents[i].index+1}`}" and "${datedEvents[i+1].entry.title || `event ${datedEvents[i+1].index+1}`}"?`, rationale: 'Large gaps can hide the event that establishes causation or notice.' });
    if (!hasText(clarionNarrative)) gaps.push({ id: 'missing_context_clarion', category: 'context', priority: 84, gapType: 'missing_context', prompt: 'Can you describe what led up to the first event in this case?', rationale: 'Lead-up context can identify notice, protected activity, authority, and causation.' });

    const normalizedAnswers = answeredQuestions.map(x => x.answer?.trim()).filter(Boolean).join(' ').toLowerCase();
    const unresolved = gaps.filter(gap => {
      if (!normalizedAnswers) return true;
      const resolved = gap.gapType.split('_').some(part => normalizedAnswers.includes(part));
      if (resolved) resolvedByUserAnswers.push(gap.id);
      return !resolved;
    });
    const sorted = unresolved.sort((a,b) => b.priority-a.priority);
    const limitedCount = Math.min(Math.max(maxQuestions, 3), 5);
    const nextQuestions = sorted.slice(0, limitedCount);
    const categories = (Object.keys(CATEGORY_LABELS) as GapCategory[]).map(id => ({ id, label: CATEGORY_LABELS[id], unresolvedCount: unresolved.filter(g => g.category === id).length }));

    const answerMap: Record<string,string> = {};
    answeredQuestions.forEach(item => { if (item.questionId && item.answer) answerMap[item.questionId] = item.answer; });
    const potentialViolations = detectPotentialViolations(systemId, answerMap, location);

    const violationActions = potentialViolations.map(v => ({
      title: `Potential violation: ${v.title}`,
      description: `${v.whyFlagged} Confidence: ${v.confidence}. What must be established: ${v.whatWouldNeedToBeTrue.join('; ')} Evidence to look for: ${v.evidenceToLookFor.join('; ')} Missing facts: ${v.missingFacts.join('; ')} Next step: ${v.nextStep}`
    }));
    const gapActions = nextQuestions.slice(0, Math.max(0, 3 - violationActions.length)).map((q, i) => ({ title: `Record gap ${i+1}`, description: q.prompt }));
    const priorityActions = [...violationActions, ...gapActions].slice(0, 5);

    const results: AnalyzerResultsAI = {
      mode: 'case_gap_and_violation_analysis',
      summary: { totalGapsFound: gaps.length, unresolvedGapCount: unresolved.length, resolvedByUserAnswers, potentialViolationCount: potentialViolations.length },
      categories, questions: sorted, nextQuestions, potentialViolations,
      safetyNotice: 'Potential violations are issue-spotting signals, not findings that a law was violated. Each result requires the applicable jurisdiction, exact facts, current law, and evidence to be verified.',
      systemIdentification: `Issue-spotting analysis for ${systemLabel}, based on the facts and answers provided.`,
      powerDynamics: { whoHasControl: ['The other party’s decisions and records', 'Agency/employer/provider processes'], whoDoesNotControl: ['The legal outcome', 'What another party ultimately decides'], decisionMakers: ['Courts, agencies, employers, providers, or other authorized decision-makers depending on the issue'] },
      usualProcess: ['Identify potential legal issues', 'Separate known facts from missing facts', 'Map each issue to the applicable legal framework', 'Preserve evidence that can confirm or defeat the issue', 'Verify current law before taking legal action'],
      commonStuckPoints: ['Missing dates', 'Unclear actors', 'Events without supporting evidence', 'Assuming a legal conclusion before checking the exact rule and facts'],
      priorityActions,
      referenceAnchors: potentialViolations.flatMap(v => v.legalFramework).filter((v,i,a) => a.indexOf(v) === i).slice(0, 12),
      gentleRealityCheck: 'A flagged issue is a lead to investigate, not proof of a violation. The engine is designed to show you exactly what facts and evidence would move an issue forward or rule it out.',
      closingAffirmation: 'You do not need to know the legal label before you document the facts. The analyzer helps connect the two.'
    };
    return new Response(JSON.stringify({ success: true, results }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('generate-analyzer-results error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error', success: false }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
