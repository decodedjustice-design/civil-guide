import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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
type ExtractedFactKind = 'event' | 'person_or_role' | 'organization' | 'evidence_mention' | 'outcome';
interface ExtractedFact { id: string; kind: ExtractedFactKind; text: string; date?: string; source: 'narrative' | 'timeline' | 'answer'; verification: 'needs_user_verification'; }

const cleanSentence = (value: string) => value.replace(/\s+/g, ' ').trim().replace(/^[\s"'“”]+|[\s"'“”]+$/g, '');

const extractFactsFromNarrative = (narrative?: string): ExtractedFact[] => {
  const text = (narrative || '').trim();
  if (!text) return [];
  const facts: ExtractedFact[] = [];
  const seen = new Set<string>();
  const add = (kind: ExtractedFactKind, value: string, source: ExtractedFact['source'], date?: string) => {
    const cleaned = cleanSentence(value);
    if (!cleaned || cleaned.length < 8) return;
    const key = kind + ':' + cleaned.toLowerCase();
    if (seen.has(key) || facts.length >= 24) return;
    seen.add(key);
    facts.push({ id: 'fact_' + (facts.length + 1), kind, text: cleaned.slice(0, 280), ...(date ? { date } : {}), source, verification: 'needs_user_verification' });
  };

  const sentences = text.split(/(?<=[.!?])\s+|
+/).map(cleanSentence).filter(Boolean);
  const datePattern = /\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2}(?:,\s*\d{4})?|\b\d{1,2}\/\d{1,2}\/\d{2,4}\b|\b\d{4}-\d{2}-\d{2}\b/;
  const eventSignals = /\b(?:happened|occurred|called|contacted|visited|came|went|left|entered|searched|seized|stopped|detained|arrested|removed|placed|evicted|terminated|fired|denied|requested|reported|filed|served|received|sent|met|heard|ordered|approved|rejected|investigated|interviewed|threatened|hit|injured|restrained|took|returned)\b/i;
  const outcomeSignals = /\b(?:injured|hurt|hospitalized|arrested|detained|removed|placed|evicted|homeless|fired|terminated|denied|lost|damaged|charged|convicted|dismissed|approved|rejected|suspended|disciplined|missed|failed|received|no longer|resulted in)\b/i;
  const evidenceSignals = /\b(?:photo|photos|video|body[- ]?camera|recording|text messages?|emails?|email|letter|report|police report|medical record|court order|order|notice|document|documents|records?|screenshot|screen shot|audio|voicemail|call log|dispatch|cad)\b/i;
  const roleSignals = /\b(?:officer|deputy|sheriff|police|caseworker|social worker|investigator|supervisor|judge|attorney|lawyer|landlord|property manager|teacher|principal|doctor|nurse|employer|hr|agency|worker|caregiver|parent|child|son|daughter)\b/i;

  sentences.forEach(sentence => {
    const date = sentence.match(datePattern)?.[0];
    if (eventSignals.test(sentence)) add('event', sentence, 'narrative', date);
    if (outcomeSignals.test(sentence)) add('outcome', sentence, 'narrative', date);
    if (evidenceSignals.test(sentence)) add('evidence_mention', sentence, 'narrative', date);
    if (roleSignals.test(sentence)) add('person_or_role', sentence, 'narrative', date);
  });
  return facts.slice(0, 24);
};
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
  executiveSummary: string;
  whatWeKnow: string[];
  whatWeNeedToVerify: string[];
  powerDynamics: { whoHasControl: string[]; whoDoesNotControl: string[]; decisionMakers: string[]; };
  usualProcess: string[];
  commonStuckPoints: string[];
  priorityActions: Array<{ title: string; description: string }>;
  referenceAnchors: string[];
  extractedFacts: ExtractedFact[];
  gentleRealityCheck: string;
  closingAffirmation: string;
}

const CATEGORY_LABELS: Record<GapCategory, string> = {
  timeline: "Timeline gaps", evidence: "Evidence gaps", identity: "Identity gaps", harm_outcome: "Harm / outcome gaps", context: "Context gaps",
};
const hasText = (value?: string) => Boolean(value && value.trim().length > 0);
const safeDate = (value?: string) => { if (!value) return null; const parsed = Date.parse(value); return Number.isNaN(parsed) ? null : parsed; };

const inferSystemsFromNarrative = (narrative?: string): Array<{ id: string; label: string; signals: string[] }> => {
  const text = (narrative || '').toLowerCase();
  const matches: Array<{ id: string; label: string; signals: string[] }> = [];
  const add = (id: string, label: string, terms: string[]) => {
    const signals = terms.filter(term => text.includes(term));
    if (signals.length) matches.push({ id, label, signals });
  };
  add('police', 'Police or Sheriff', ['police', 'sheriff', 'officer', 'arrest', 'detained', 'search', 'seized', 'body camera', 'use of force']);
  add('housing', 'Housing / Landlord-Tenant', ['landlord', 'tenant', 'eviction', 'lease', 'rent', 'housing', 'apartment', 'reasonable accommodation']);
  add('cps_dcyf', 'Child Welfare / DCYF', ['dcyf', 'cps', 'child protective', 'dependency', 'placement', 'removal', 'foster', 'caseworker']);
  add('courts', 'Courts / Court Process', ['court', 'judge', 'hearing', 'arraignment', 'summons', 'notice of hearing', 'order']);
  add('employer', 'Employment', ['employer', 'workplace', 'job', 'fired', 'termination', 'hr', 'employee', 'accommodation at work']);
  add('school', 'School / Education', ['school', 'student', 'iep', '504 plan', 'discipline', 'attendance']);
  add('healthcare', 'Healthcare', ['doctor', 'hospital', 'clinic', 'medical record', 'provider', 'medicaid', 'health insurance']);
  add('government', 'Government Agency', ['agency', 'department', 'public records', 'records request', 'government office']);
  return matches;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  try {
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
    const inferredSystems = inferSystemsFromNarrative(clarionNarrative);
    const extractedFacts = extractFactsFromNarrative(clarionNarrative);
    const systemsToCheck = systemId === 'unsure' && inferredSystems.length
      ? inferredSystems.slice(0, 3)
      : [{ id: systemId, label: systemLabel, signals: [] }];
    const potentialViolations = systemsToCheck.flatMap(system => detectPotentialViolations(
      system.id,
      {
        ...answerMap,
        'issue-type': answerMap['issue-type'] || (
          /search|searched|seized|entered my home/i.test(clarionNarrative || '') ? 'search' :
          /arrest|detained|stop|pulled me over/i.test(clarionNarrative || '') ? 'arrest' :
          /retaliat|punished me|targeted me after/i.test(clarionNarrative || '') ? 'retaliation' :
          /removal|removed|placement|investigation/i.test(clarionNarrative || '') ? 'removal' :
          /evict|eviction|notice to vacate/i.test(clarionNarrative || '') ? 'eviction' :
          /discriminat|treated differently/i.test(clarionNarrative || '') ? 'discrimination' :
          ''
        )
      },
      location
    ));

    const knownFacts = [
      ...timelineEntries.filter(e => hasText(e.title)).slice(0, 4).map(e => {
        const date = hasText(e.date) ? ` on ${e.date}` : "";
        return `${e.title}${date}${hasText(e.description) ? `: ${e.description}` : ""}`;
      }),
      ...answeredQuestions.filter(a => hasText(a.answer)).slice(0, 3).map(a => a.answer.trim()),
    ].slice(0, 7);

    const verifyItems = [
      ...nextQuestions.slice(0, 5).map(q => q.prompt),
      ...potentialViolations.flatMap(v => v.missingFacts || []),
      ...potentialViolations.flatMap(v => v.evidenceToLookFor || []),
    ].filter(Boolean).filter((v, i, arr) => arr.indexOf(v) === i).slice(0, 10);

    const executiveSummary = potentialViolations.length
      ? `The information provided identifies ${potentialViolations.length} issue${potentialViolations.length === 1 ? "" : "s"} for further review within ${systemLabel}. The current record also contains ${unresolved.length} unresolved information gap${unresolved.length === 1 ? "" : "s"}, so the analyzer cannot determine from this information alone whether a legal violation occurred.`
      : unresolved.length
        ? `The current information does not identify a specific legal issue to characterize yet. There are ${unresolved.length} unresolved information gap${unresolved.length === 1 ? "" : "s"} that should be clarified before drawing stronger conclusions.`
        : `The current information has been organized for research and verification within ${systemLabel}. No specific violation signal was generated from the information provided.`;

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
      systemIdentification: systemId === 'unsure'
        ? (inferredSystems.length
          ? `The narrative contains signals associated with: ${inferredSystems.map(s => s.label).join(', ')}. These are classification leads, not legal conclusions.`
          : 'The narrative did not contain enough system-specific signals to classify the matter yet. The follow-up questions are intended to narrow the context.')
        : `Issue-spotting analysis for ${systemLabel}, based on the facts and answers provided.`,
      executiveSummary,
      whatWeKnow: [...knownFacts, ...(systemId === 'unsure' ? inferredSystems.slice(0, 3).map(s => `System signal: ${s.label} (${s.signals.slice(0, 3).join(', ')}).`) : [])].slice(0, 10),
      whatWeNeedToVerify: verifyItems,
      powerDynamics: { whoHasControl: ['The other party’s decisions and records', 'Agency/employer/provider processes'], whoDoesNotControl: ['The legal outcome', 'What another party ultimately decides'], decisionMakers: ['Courts, agencies, employers, providers, or other authorized decision-makers depending on the issue'] },
      usualProcess: ['Identify potential legal issues', 'Separate known facts from missing facts', 'Map each issue to the applicable legal framework', 'Preserve evidence that can confirm or defeat the issue', 'Verify current law before taking legal action'],
      commonStuckPoints: ['Missing dates', 'Unclear actors', 'Events without supporting evidence', 'Assuming a legal conclusion before checking the exact rule and facts'],
      priorityActions,
      referenceAnchors: potentialViolations.flatMap(v => v.legalFramework).filter((v,i,a) => a.indexOf(v) === i).slice(0, 12),
      extractedFacts,
      gentleRealityCheck: 'A flagged issue is a lead to investigate, not proof of a violation. The engine is designed to show you exactly what facts and evidence would move an issue forward or rule it out.',
      closingAffirmation: 'You do not need to know the legal label before you document the facts. The analyzer helps connect the two.'
    };
    return new Response(JSON.stringify({ success: true, results }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('generate-analyzer-results error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error', success: false }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
