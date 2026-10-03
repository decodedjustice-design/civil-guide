import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CaseSnapshot {
  evidence: any[];
  timeline: any[];
  issues: any[];
  people: any[];
  organizations: any[];
  communications: any[];
  requests: any[];
  record_gaps: any[];
  evidence_mentions: any[];
  notes: any[];
  links: any[];
  packets: any[];
}

const empty: CaseSnapshot = {
  evidence: [], timeline: [], issues: [], people: [], organizations: [],
  communications: [], requests: [], record_gaps: [], evidence_mentions: [], notes: [], links: [], packets: [],
};

/** Canonical case snapshot used across workspace screens. */
export function useCaseSnapshot(caseId?: string) {
  const query = useQuery({
    queryKey: ["case-snapshot", caseId],
    enabled: !!caseId,
    queryFn: async (): Promise<CaseSnapshot> => {
      if (!caseId) return empty;
      const load = async (table: string, order: string) => {
        const { data, error } = await (supabase as any)
          .from(table)
          .select("*")
          .eq("case_id", caseId)
          .order(order, { ascending: true, nullsFirst: false });
        if (error) throw error;
        return data ?? [];
      };

      const [documents, events, issues, people, organizations, communications, requests, tasks, evidence_mentions, links, packets] =
        await Promise.all([
          load("documents", "created_at"),
          load("events", "occurred_at"),
          load("issues", "created_at"),
          load("people", "display_name"),
          load("organizations", "name"),
          load("communications", "occurred_at"),
          load("record_requests", "due_at"),
          load("tasks", "due_at"),
          load("evidence_mentions", "created_at"),
          load("case_relationships", "created_at"),
          load("case_packets", "created_at"),
        ]);

      const evidence = documents.map((doc: any) => ({
        ...doc,
        title: doc.title ?? doc.display_filename ?? "Untitled document",
        exhibit_number: doc.exhibit_number ?? null,
      }));
      const timeline = events.map((event: any) => ({
        ...event,
        event_date: event.event_date ?? event.occurred_at ?? event.created_at,
      }));
      const record_gaps = tasks.filter((task: any) => task.task_type === "record_gap");
      const notes: any[] = [];
      return {
        evidence, timeline, issues, people, organizations,
        communications, requests, record_gaps, evidence_mentions, notes, links, packets,
      };
    },
  });

  return { snapshot: query.data ?? empty, isLoading: query.isLoading };
}
