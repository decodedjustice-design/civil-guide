import { useCallback, useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
  created_at: string;
  updated_at: string;
}

const ACTIVE_CASE_KEY = "dj:active-case-id";

export function useCases() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: cases = [], isLoading } = useQuery({
    queryKey: ["cases", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cases")
        .select("id,user_id,name,description,case_type,status,county,state,created_at,updated_at")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as CaseRow[];
    },
  });

  const createCase = useMutation({
    mutationFn: async (payload: Partial<CaseRow>) => {
      if (!user) throw new Error("Not signed in");
      const { data, error } = await supabase
        .from("cases")
        .insert({
          user_id: user.id,
          name: payload.name?.trim() || "Untitled case",
          description: payload.description ?? null,
          case_type: payload.case_type ?? null,
          county: payload.county ?? null,
          state: payload.state ?? "WA",
        })
        .select("*")
        .single();
      if (error) throw error;
      return data as CaseRow;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cases"] }),
  });

  const updateCase = useMutation({
    mutationFn: async ({ id, ...patch }: Partial<CaseRow> & { id: string }) => {
      const { error } = await supabase.from("cases").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cases"] }),
  });

  return { cases, isLoading, createCase, updateCase, user };
}

/** Remembers the last case the person was working in. */
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

/** Generic per-case collection helper used by the workspace tabs. */
export function useCaseCollection<T extends { id: string }>(
  table: string,
  caseId: string | undefined,
  orderBy: { column: string; ascending?: boolean } = { column: "created_at", ascending: false }
) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = [table, caseId];

  const { data: items = [], isLoading } = useQuery({
    queryKey,
    enabled: !!caseId && !!user,
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from(table)
        .select("*")
        .eq("case_id", caseId)
        .order(orderBy.column, { ascending: orderBy.ascending ?? false });
      if (error) throw error;
      return (data ?? []) as T[];
    },
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey });

  const add = useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      if (!user || !caseId) throw new Error("No active case");
      const { error } = await (supabase as any)
        .from(table)
        .insert({ ...values, case_id: caseId, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: Record<string, unknown> }) => {
      const { error } = await (supabase as any).from(table).update(values).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return { items, isLoading, add, update, remove };
}
