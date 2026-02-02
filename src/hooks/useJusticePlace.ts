import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export type CaseStatus = 
  | "getting_oriented"
  | "gathering_information"
  | "preparing_outreach"
  | "awaiting_responses"
  | "reviewing_options"
  | "taking_next_steps"
  | "on_hold";

export interface JusticePlaceCase {
  id: string;
  user_id: string;
  case_name: string;
  county: string;
  incident_month_year: string;
  issue_type: string;
  case_status: CaseStatus;
  created_at: string;
  updated_at: string;
}

export interface JusticePlaceBookmark {
  id: string;
  user_id: string;
  resource_type: string;
  resource_id: string;
  resource_title: string;
  resource_url?: string;
  notes?: string;
  created_at: string;
}

export interface CaseFormData {
  caseName: string;
  county: string;
  incidentMonthYear: string;
  issueType: string;
}

const CASE_STATUS_LABELS: Record<CaseStatus, string> = {
  getting_oriented: "Getting Oriented",
  gathering_information: "Gathering Information",
  preparing_outreach: "Preparing Outreach",
  awaiting_responses: "Awaiting Responses",
  reviewing_options: "Reviewing Options",
  taking_next_steps: "Taking Next Steps",
  on_hold: "On Hold",
};

export function getCaseStatusLabel(status: CaseStatus): string {
  return CASE_STATUS_LABELS[status] || status;
}

export function useJusticePlace() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [caseData, setCaseData] = useState<JusticePlaceCase | null>(null);
  const [bookmarks, setBookmarks] = useState<JusticePlaceBookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [needsIntake, setNeedsIntake] = useState(false);

  // Fetch case data on mount
  useEffect(() => {
    if (user) {
      fetchCaseData();
    } else {
      setIsLoading(false);
      setCaseData(null);
      setNeedsIntake(false);
    }
  }, [user]);

  const fetchCaseData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("justice_place_cases")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setCaseData(data as JusticePlaceCase);
        setNeedsIntake(false);
        // Fetch bookmarks
        await fetchBookmarks();
      } else {
        setNeedsIntake(true);
        setCaseData(null);
      }
    } catch (err) {
      console.error("Error fetching case data:", err);
      toast({
        title: "Error loading your space",
        description: "Could not load Justice Place. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBookmarks = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("justice_place_bookmarks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBookmarks(data || []);
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
    }
  };

  const createCase = useCallback(
    async (formData: CaseFormData): Promise<boolean> => {
      if (!user) return false;

      setIsSaving(true);
      try {
        const { data, error } = await supabase
          .from("justice_place_cases")
          .insert({
            user_id: user.id,
            case_name: formData.caseName,
            county: formData.county,
            incident_month_year: formData.incidentMonthYear,
            issue_type: formData.issueType,
            case_status: "getting_oriented",
          })
          .select()
          .single();

        if (error) throw error;

        setCaseData(data as JusticePlaceCase);
        setNeedsIntake(false);

        toast({
          title: "Welcome to Justice Place",
          description: "Your personal workspace has been created.",
        });

        return true;
      } catch (err) {
        console.error("Error creating case:", err);
        toast({
          title: "Error creating your space",
          description: "Could not create Justice Place. Please try again.",
          variant: "destructive",
        });
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [user, toast]
  );

  const updateCase = useCallback(
    async (updates: Partial<CaseFormData & { caseStatus: CaseStatus }>): Promise<boolean> => {
      if (!user || !caseData) return false;

      setIsSaving(true);
      try {
        const updateData: Record<string, unknown> = {};
        if (updates.caseName !== undefined) updateData.case_name = updates.caseName;
        if (updates.county !== undefined) updateData.county = updates.county;
        if (updates.incidentMonthYear !== undefined) updateData.incident_month_year = updates.incidentMonthYear;
        if (updates.issueType !== undefined) updateData.issue_type = updates.issueType;
        if (updates.caseStatus !== undefined) updateData.case_status = updates.caseStatus;

        const { data, error } = await supabase
          .from("justice_place_cases")
          .update(updateData)
          .eq("id", caseData.id)
          .select()
          .single();

        if (error) throw error;

        setCaseData(data as JusticePlaceCase);

        toast({
          title: "Updated",
          description: "Your case information has been saved.",
        });

        return true;
      } catch (err) {
        console.error("Error updating case:", err);
        toast({
          title: "Error saving changes",
          description: "Could not save your changes. Please try again.",
          variant: "destructive",
        });
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [user, caseData, toast]
  );

  const addBookmark = useCallback(
    async (bookmark: {
      resourceType: string;
      resourceId: string;
      resourceTitle: string;
      resourceUrl?: string;
      notes?: string;
    }): Promise<boolean> => {
      if (!user) return false;

      try {
        const { data, error } = await supabase
          .from("justice_place_bookmarks")
          .insert({
            user_id: user.id,
            resource_type: bookmark.resourceType,
            resource_id: bookmark.resourceId,
            resource_title: bookmark.resourceTitle,
            resource_url: bookmark.resourceUrl || null,
            notes: bookmark.notes || null,
          })
          .select()
          .single();

        if (error) {
          if (error.code === "23505") {
            toast({
              title: "Already saved",
              description: "This resource is already in your bookmarks.",
            });
            return false;
          }
          throw error;
        }

        setBookmarks((prev) => [data, ...prev]);

        toast({
          title: "Saved to Justice Place",
          description: `${bookmark.resourceTitle} has been bookmarked.`,
        });

        return true;
      } catch (err) {
        console.error("Error adding bookmark:", err);
        toast({
          title: "Error saving bookmark",
          description: "Could not save this resource.",
          variant: "destructive",
        });
        return false;
      }
    },
    [user, toast]
  );

  const removeBookmark = useCallback(
    async (bookmarkId: string): Promise<boolean> => {
      if (!user) return false;

      try {
        const { error } = await supabase
          .from("justice_place_bookmarks")
          .delete()
          .eq("id", bookmarkId);

        if (error) throw error;

        setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId));

        toast({
          title: "Removed",
          description: "Bookmark has been removed.",
        });

        return true;
      } catch (err) {
        console.error("Error removing bookmark:", err);
        return false;
      }
    },
    [user, toast]
  );

  const isBookmarked = useCallback(
    (resourceType: string, resourceId: string): boolean => {
      return bookmarks.some(
        (b) => b.resource_type === resourceType && b.resource_id === resourceId
      );
    },
    [bookmarks]
  );

  return {
    user,
    caseData,
    bookmarks,
    isLoading,
    isSaving,
    needsIntake,
    createCase,
    updateCase,
    addBookmark,
    removeBookmark,
    isBookmarked,
    refetch: fetchCaseData,
  };
}
