import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface ClarionEntry {
  content: string;
  created_at: string;
}

interface TimelineEntry {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
}

interface EvidenceItem {
  id: string;
  title: string;
  description: string | null;
  document_date: string | null;
  source: string | null;
  file_type: string | null;
}

interface NarrativeSections {
  incidentOverview: string;
  keyActors: string[];
  whatHappened: string[];
  outcomeHarm: string[];
}

interface PrioritizedTimelineEntry extends TimelineEntry {
  hasLinkedEvidence: boolean;
  linkedEvidenceCount: number;
}

export interface CaseBriefData {
  generatedAt: string;
  caseOverview: {
    matterTitle: string;
    likelySystem: string;
    incidentDate: string | null;
    narrativeSummary: string;
    narrativeSections: NarrativeSections;
  };
  timeline: TimelineEntry[];
  prioritizedTimeline: PrioritizedTimelineEntry[];
  evidenceIndex: Array<EvidenceItem & { linkedEventTitle: string | null; linkStrength: "exact" | "nearby" | "unlinked" }>;
  keyFacts: string[];
  possibleLegalIssues: string[];
  deadlines: {
    incidentDate: string | null;
    tortNoticeDeadline: string | null;
    section1983Deadline: string | null;
  };
}

const SYSTEM_LABELS: Record<string, string> = {
  police: "Police / Law Enforcement",
  housing: "Housing",
  cps_dcyf: "Child Welfare / CPS / DCYF",
  schools: "Education / Schools",
  healthcare: "Healthcare",
  benefits: "Government Benefits",
  courts: "Courts",
  employment: "Employment",
  other: "Other",
};

const ACTOR_TERMS = ["officer", "deputy", "police", "sheriff", "detective", "judge", "teacher", "landlord", "supervisor", "staff", "security", "caseworker", "cps", "dcyf", "hospital", "official"];
const HARM_TERMS = ["injur", "pain", "harm", "bruise", "hospital", "fracture", "bleed", "fear", "trauma", "lost", "damage", "distress"];
const FORCE_TERMS = ["force", "restrain", "tackle", "handcuff", "grab", "push", "spray", "taser", "hit", "choke"];

function splitSentences(entries: ClarionEntry[]) {
  return entries
    .flatMap((entry) => entry.content.split(/(?<=[.!?])\s+|\n+/))
    .map((line) => line.trim())
    .filter((line) => line.length > 20);
}

function unique(items: string[]) {
  return Array.from(new Set(items));
}

function sentenceHasAny(sentence: string, terms: string[]) {
  const lower = sentence.toLowerCase();
  return terms.some((term) => lower.includes(term));
}

export function useCaseBriefGenerator() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clarion, setClarion] = useState<ClarionEntry[]>([]);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [system, setSystem] = useState<string>("other");

  useEffect(() => {
    if (!user) return;

    async function fetchAll() {
      setIsLoading(true);
      setError(null);
      try {
        const [clarionRes, timelineRes, evidenceRes, analyzerRes] = await Promise.all([
          supabase.from("clarion_entries").select("content, created_at").eq("user_id", user.id).order("created_at", { ascending: false }),
          supabase.from("timeline_entries").select("id, title, description, event_date").eq("user_id", user.id).order("event_date", { ascending: true }),
          supabase.from("evidence").select("id, title, description, document_date, source, file_type").eq("user_id", user.id).order("created_at", { ascending: false }),
          supabase.from("analyzer_results").select("system").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1),
        ]);

        if (clarionRes.error || timelineRes.error || evidenceRes.error || analyzerRes.error) {
          throw clarionRes.error || timelineRes.error || evidenceRes.error || analyzerRes.error;
        }

        setClarion(clarionRes.data || []);
        setTimeline(timelineRes.data || []);
        setEvidence(evidenceRes.data || []);
        setSystem(analyzerRes.data?.[0]?.system || "other");
      } catch (err) {
        console.error("Case brief generation failed", err);
        setError("We could not compile your case brief at this time.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchAll();
  }, [user]);

  const data = useMemo<CaseBriefData>(() => {
    const incidentDate = timeline[0]?.event_date || evidence.find((e) => e.document_date)?.document_date || null;

    const narrativeSummary = clarion.length
      ? clarion
          .map((entry) => entry.content.trim())
          .filter(Boolean)
          .join("\n\n")
          .slice(0, 2500)
      : "No Clarion narrative entries available.";

    const evidenceIndex = evidence.map((item) => {
      const evDate = item.document_date ? new Date(item.document_date).getTime() : null;
      if (!evDate) {
        return { ...item, linkedEventTitle: null, linkStrength: "unlinked" as const };
      }

      let exactMatch: TimelineEntry | null = null;
      let nearbyMatch: TimelineEntry | null = null;
      for (const event of timeline) {
        const eventMs = new Date(event.event_date).getTime();
        const diff = Math.abs(eventMs - evDate);
        if (diff === 0) {
          exactMatch = event;
          break;
        }
        if (!nearbyMatch && diff <= 3 * 24 * 60 * 60 * 1000) {
          nearbyMatch = event;
        }
      }

      if (exactMatch) {
        return { ...item, linkedEventTitle: exactMatch.title, linkStrength: "exact" as const };
      }
      if (nearbyMatch) {
        return { ...item, linkedEventTitle: nearbyMatch.title, linkStrength: "nearby" as const };
      }
      return { ...item, linkedEventTitle: null, linkStrength: "unlinked" as const };
    });

    const evidenceLinksByEvent = evidenceIndex.reduce<Record<string, number>>((acc, item) => {
      if (!item.linkedEventTitle) return acc;
      acc[item.linkedEventTitle] = (acc[item.linkedEventTitle] || 0) + 1;
      return acc;
    }, {});

    const prioritizedTimeline = [...timeline]
      .sort((a, b) => {
        const evidenceDelta = (evidenceLinksByEvent[b.title] || 0) - (evidenceLinksByEvent[a.title] || 0);
        if (evidenceDelta !== 0) return evidenceDelta;

        const aText = `${a.title} ${a.description || ""}`.toLowerCase();
        const bText = `${b.title} ${b.description || ""}`.toLowerCase();
        const scoreA = Number(sentenceHasAny(aText, FORCE_TERMS)) + Number(sentenceHasAny(aText, HARM_TERMS));
        const scoreB = Number(sentenceHasAny(bText, FORCE_TERMS)) + Number(sentenceHasAny(bText, HARM_TERMS));
        if (scoreB !== scoreA) return scoreB - scoreA;

        return new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
      })
      .slice(0, 6)
      .map((event) => ({
        ...event,
        hasLinkedEvidence: Boolean(evidenceLinksByEvent[event.title]),
        linkedEvidenceCount: evidenceLinksByEvent[event.title] || 0,
      }));

    const sentences = splitSentences(clarion);
    const actorCandidates = unique(
      sentences
        .filter((s) => sentenceHasAny(s, ACTOR_TERMS) || /\b(i|we|they|he|she)\b/i.test(s))
        .slice(0, 6),
    );

    const whatHappened = unique(
      [
        ...prioritizedTimeline.map((event) => `${event.event_date}: ${event.title}${event.description ? ` — ${event.description}` : ""}`),
        ...sentences.filter((s) => sentenceHasAny(s, FORCE_TERMS) || sentenceHasAny(s, ["arrive", "stop", "called", "removed", "detain", "search"]))
      ]
        .map((s) => s.trim())
        .filter(Boolean),
    ).slice(0, 6);

    const outcomeHarm = unique(
      [
        ...sentences.filter((s) => sentenceHasAny(s, HARM_TERMS)),
        ...timeline
          .map((event) => `${event.title}${event.description ? ` — ${event.description}` : ""}`)
          .filter((s) => sentenceHasAny(s, HARM_TERMS)),
      ],
    ).slice(0, 4);

    const incidentOverview = sentences[0]
      ? `Records indicate an incident involving ${SYSTEM_LABELS[system] || "civil systems"}. The reporting narrative describes events that may implicate official conduct and resulting harm.`
      : "No narrative overview is available from current records.";

    const keyFacts = unique(
      [
        ...prioritizedTimeline.map((event) => `${event.event_date}: ${event.title}${event.description ? ` — ${event.description}` : ""}`),
        ...sentences.filter((s) => sentenceHasAny(s, FORCE_TERMS) || sentenceHasAny(s, HARM_TERMS) || sentenceHasAny(s, ACTOR_TERMS)),
      ]
        .map((fact) => fact.replace(/\s+/g, " ").trim())
        .filter((fact) => fact.length > 25),
    ).slice(0, 8);

    const issueSet = new Set<string>();
    issueSet.add(`Potential ${SYSTEM_LABELS[system] || "civil rights"} claims for attorney review.`);

    const corpus = `${narrativeSummary}\n${timeline.map((t) => `${t.title} ${t.description || ""}`).join("\n")}`.toLowerCase();
    if (corpus.includes("retaliat")) issueSet.add("Possible retaliation-related issues (non-conclusive).");
    if (corpus.includes("search") || corpus.includes("seiz")) issueSet.add("Possible search/seizure issues (non-conclusive).");
    if (corpus.includes("discriminat") || corpus.includes("bias")) issueSet.add("Possible discrimination or equal treatment concerns (non-conclusive).");
    if (corpus.includes("due process") || corpus.includes("hearing")) issueSet.add("Possible procedural due process concerns (non-conclusive).");
    if (corpus.includes("force") || corpus.includes("injur")) issueSet.add("Possible excessive force / injury-related issues (non-conclusive).");

    const tortDate = incidentDate ? new Date(incidentDate) : null;
    const sectionDate = incidentDate ? new Date(incidentDate) : null;
    if (tortDate) tortDate.setDate(tortDate.getDate() + 60);
    if (sectionDate) sectionDate.setFullYear(sectionDate.getFullYear() + 3);

    return {
      generatedAt: format(new Date(), "MMMM d, yyyy 'at' h:mm a"),
      caseOverview: {
        matterTitle: timeline[0]?.title || evidence[0]?.title || "Untitled Matter",
        likelySystem: SYSTEM_LABELS[system] || "Other",
        incidentDate,
        narrativeSummary,
        narrativeSections: {
          incidentOverview,
          keyActors: actorCandidates.length ? actorCandidates : ["No clear actor details captured in current records."],
          whatHappened: whatHappened.length ? whatHappened : ["No sequence details available from current records."],
          outcomeHarm: outcomeHarm.length ? outcomeHarm : ["No concrete harm details captured in current records."],
        },
      },
      timeline,
      prioritizedTimeline,
      evidenceIndex,
      keyFacts: keyFacts.length ? keyFacts : ["No key facts could be derived from existing records."],
      possibleLegalIssues: Array.from(issueSet),
      deadlines: {
        incidentDate,
        tortNoticeDeadline: tortDate ? format(tortDate, "MMMM d, yyyy") : null,
        section1983Deadline: sectionDate ? format(sectionDate, "MMMM d, yyyy") : null,
      },
    };
  }, [clarion, timeline, evidence, system]);

  return { data, isLoading, error };
}
