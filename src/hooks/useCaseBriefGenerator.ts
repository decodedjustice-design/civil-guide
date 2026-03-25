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
  evidenceCount?: number;
}

interface EvidenceItem {
  id: string;
  title: string;
  description: string | null;
  document_date: string | null;
  source: string | null;
  file_type: string | null;
}

export interface CaseBriefData {
  generatedAt: string;
  caseOverview: {
    matterTitle: string;
    likelySystem: string;
    incidentDate: string | null;
    narrativeSummary: string;
  };
  timeline: TimelineEntry[];
  evidenceIndex: Array<EvidenceItem & { linkedEventId: string | null; linkedEventTitle: string | null; linkStrength: "exact" | "nearby" | "unlinked" }>;
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
        return { ...item, linkedEventId: null, linkedEventTitle: null, linkStrength: "unlinked" as const };
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
        return { ...item, linkedEventId: exactMatch.id, linkedEventTitle: exactMatch.title, linkStrength: "exact" as const };
      }
      if (nearbyMatch) {
        return { ...item, linkedEventId: nearbyMatch.id, linkedEventTitle: nearbyMatch.title, linkStrength: "nearby" as const };
      }
      return { ...item, linkedEventId: null, linkedEventTitle: null, linkStrength: "unlinked" as const };
    });

    const evidenceCountByEventId = evidenceIndex.reduce<Record<string, number>>((acc, item) => {
      if (!item.linkedEventId) return acc;
      acc[item.linkedEventId] = (acc[item.linkedEventId] || 0) + 1;
      return acc;
    }, {});

    const timelineWithEvidenceCounts = timeline.map((event) => ({
      ...event,
      evidenceCount: evidenceCountByEventId[event.id] || 0,
    }));

    const keyFacts = [
      ...timeline.slice(0, 6).map((event) => `${event.event_date}: ${event.title}${event.description ? ` — ${event.description}` : ""}`),
      ...clarion
        .slice(0, 3)
        .flatMap((entry) => entry.content.split(/[.\n]/))
        .map((x) => x.trim())
        .filter((x) => x.length > 30)
        .slice(0, 4),
    ].slice(0, 10);

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
      },
      timeline: timelineWithEvidenceCounts,
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
