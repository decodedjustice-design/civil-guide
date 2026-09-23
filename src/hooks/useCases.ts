import { useCallback, useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface CaseRow {
  id: string;
  owner_user_id: string;
  title: string;
  matter_type: string;
  status: string;
  jurisdiction: string;
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
      if (!user) return [];
      const { data, error } = await supabase
        .from("cases")
        .select("id,owner_user_id,title,matter_type,status,jurisdiction,created_at,updated_at")
        .eq("owner_user_id", user.id)
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
          owner_user_id: user.id,
          title: payload.title?.trim() || "Untitled case",
          matter_type: payload.matter_type ?? "general",
          jurisdiction: payload.jurisdiction ?? "Washington",
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
      const { error } = await supabase.from("cases").update(patch).eq("id", id).eq("owner_user_id", user?.id ?? "");
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

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey });
    queryClient.invalidateQueries({ queryKey: ["case-snapshot", caseId] });
  };

  const add = useMutation({
    mutationFn: async (values: Record<string, unknown>) => {
      if (!user || !caseId) throw new Error("No active case");
      const { error } = await (supabase as any)
        .from(table)
        .insert({ ...values, case_id: caseId });
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: Record<string, unknown> }) => {
      const { error } = await (supabase as any).from(table).update(values).eq("id", id).eq("case_id", caseId);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from(table).delete().eq("id", id).eq("case_id", caseId);
      if (error) throw error;
    },
    onSuccess: invalidate,
  });

  return { items, isLoading, add, update, remove };
}
