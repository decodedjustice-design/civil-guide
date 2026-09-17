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
  notes: any[];
}

const empty: CaseSnapshot = {
  evidence: [],
  timeline: [],
  issues: [],
  people: [],
  organizations: [],
  communications: [],
  requests: [],
  notes: [],
};

/** Loads every collection for one case — used by Overview, Search, Content Check and Packets. */
export function useCaseSnapshot(caseId?: string) {
  const query = useQuery({
    queryKey: ["case-snapshot", caseId],
    enabled: !!caseId,
    queryFn: async (): Promise<CaseSnapshot> => {
      const tables: [keyof CaseSnapshot, string, string][] = [
        ["evidence", "evidence", "exhibit_number"],
        ["timeline", "timeline_entries", "event_date"],
        ["issues", "case_issues", "created_at"],
        ["people", "case_people", "name"],
        ["organizations", "case_organizations", "name"],
        ["communications", "case_communications", "occurred_on"],
        ["requests", "case_records_requests", "due_date"],
        ["notes", "notes", "created_at"],
      ];
      const results = await Promise.all(
        tables.map(async ([, table, order]) => {
          const { data, error } = await (supabase as any)
            .from(table)
            .select("*")
            .eq("case_id", caseId)
            .order(order, { ascending: true, nullsFirst: false });
          if (error) throw error;
          return data ?? [];
        })
      );
      return tables.reduce((acc, [key], i) => ({ ...acc, [key]: results[i] }), { ...empty });
    },
  });

  return { snapshot: query.data ?? empty, isLoading: query.isLoading };
}
