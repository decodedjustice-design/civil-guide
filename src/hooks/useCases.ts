import { useCallback, useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CASE_COLUMNS as COLLECTION_COLUMNS, casePayload, type CaseTable } from "@/lib/case/schema";
import { useAuth } from "@/contexts/AuthContext";

export interface CaseRow {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  case_type: string | null;
  status: string;
  county: string | null;
  state: string | null;
  legacy_justice_place_case_id: string | null;
  created_at: string;
  updated_at: string;
}

export type CaseDraft = Partial<Omit<CaseRow, "id" | "user_id" | "created_at" | "updated_at">>;

const ACTIVE_CASE_KEY = "dj:active-case-id";
const CASE_COLUMNS: string =
  "id,user_id,name,description,case_type,status,county,state,legacy_justice_place_case_id,created_at,updated_at";

export function useCases() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: cases = [], isLoading } = useQuery({
    queryKey: ["cases", user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("cases")
        .select(CASE_COLUMNS)
        .eq("user_id", user.id)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as CaseRow[];
    },
  });

  const createCase = useMutation({
    mutationFn: async (payload: CaseDraft & { name?: string }) => {
      if (!user) throw new Error("Not signed in");
      const { data, error } = await supabase
        .from("cases")
        .insert({
          user_id: user.id,
          name: payload.name?.trim() || "Untitled case",
          case_type: payload.case_type ?? "general",
          description: payload.description ?? null,
          county: payload.county ?? null,
          state: payload.state ?? "WA",
          status: payload.status ?? "active",
        })
        .select(CASE_COLUMNS)
        .single();
      if (error) throw error;
      return data as unknown as CaseRow;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cases"] }),
  });

  const updateCase = useMutation({
    mutationFn: async ({ id, ...patch }: CaseDraft & { id: string }) => {
      if (!user) throw new Error("Not signed in");
      const { error } = await supabase
        .from("cases")
        .update(patch)
        .eq("id", id)
        .eq("user_id", user.id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cases"] }),
  });

  return { cases, isLoading, createCase, updateCase, user };
}

export function useActiveCaseId(caseIdFromRoute?: string) {
  const [activeId, setActiveId] = useState<string | null>(
    () => caseIdFromRoute ?? localStorage.getItem(ACTIVE_CASE_KEY)
  );

  useEffect(() => {
    if (caseIdFromRoute) {
      setActiveId(caseIdFromRoute);
      localStorage.setItem(ACTIVE_CASE_KEY, caseIdFromRoute);
    }
  }, [caseIdFromRoute]);

  const select = useCallback((id: string) => {
    setActiveId(id);
    localStorage.setItem(ACTIVE_CASE_KEY, id);
  }, []);

  return { activeId, select };
}

export function useCaseCollection<T extends { id: string }>(
  table: CaseTable,
  caseId: string | undefined,
  orderBy: { column: string; ascending?: boolean } = { column: "created_at", ascending: false }
) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = [table, caseId, user?.id];

  const { data: items = [], isLoading } = useQuery({
    queryKey,
    enabled: !!caseId && !!user,
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from(table)
        .select(COLLECTION_COLUMNS[table])
        .eq("case_id", caseId)
        .eq("user_id", user?.id)
        .order(orderBy.column, { ascending: orderBy.ascending ?? false });
      if (error) throw error;
      return (data ?? []) as T[];
    },
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey });
    queryClient.invalidateQueries({ queryKey: ["case-snapshot", caseId] });
  };

  const add = useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      if (!user || !caseId) throw new Error("No active case");
      const { error } = await (supabase as any)
        .from(table)
        .insert(casePayload(table, values, caseId, user.id));
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: Record<string, unknown> }) => {
      if (!user || !caseId) throw new Error("No active case");
      const { error } = await (supabase as any).from(table).update(casePayload(table, values, caseId, user.id)).eq("id", id).eq("case_id", caseId).eq("user_id", user.id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      if (!user || !caseId) throw new Error("No active case");
      const { error } = await (supabase as any).from(table).delete().eq("id", id).eq("case_id", caseId).eq("user_id", user.id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return { items, isLoading, add, update, remove };
}
