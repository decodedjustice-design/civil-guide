import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export type CaseBuilderStep = 
  | "incident-intake"
  | "evidence-vault"
  | "timeline-builder"
  | "legal-issue-mapping"
  | "case-packet";

export const CASE_BUILDER_STEPS: { id: CaseBuilderStep; label: string; shortLabel: string; description: string }[] = [
  { id: "incident-intake", label: "Incident Intake", shortLabel: "Intake", description: "Describe what happened and who was involved." },
  { id: "evidence-vault", label: "Evidence Vault", shortLabel: "Evidence", description: "Upload and organize your supporting documents." },
  { id: "timeline-builder", label: "Timeline Builder", shortLabel: "Timeline", description: "Build a chronological record of events." },
  { id: "legal-issue-mapping", label: "Legal Issue Mapping", shortLabel: "Issues", description: "Identify the legal issues in your situation." },
  { id: "case-packet", label: "Case Packet Generator", shortLabel: "Packet", description: "Generate a professional case summary." },
];

export interface CaseBuilderProgress {
  incidentIntakeComplete: boolean;
  evidenceCount: number;
  timelineCount: number;
  legalIssuesIdentified: boolean;
  casePacketGenerated: boolean;
}

export function useCaseBuilder() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<CaseBuilderStep>("incident-intake");
  const [progress, setProgress] = useState<CaseBuilderProgress>({
    incidentIntakeComplete: false,
    evidenceCount: 0,
    timelineCount: 0,
    legalIssuesIdentified: false,
    casePacketGenerated: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchProgress = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      const [caseRes, evidenceRes, timelineRes, analyzerRes, intakeRes] = await Promise.all([
        supabase.from("justice_place_cases").select("id").eq("user_id", user.id).maybeSingle(),
        supabase.from("evidence").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("timeline_entries").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("analyzer_results").select("id").eq("user_id", user.id).limit(1),
        supabase.from("intake_packets").select("id").eq("user_id", user.id).limit(1),
      ]);

      setProgress({
        incidentIntakeComplete: !!caseRes.data,
        evidenceCount: evidenceRes.count || 0,
        timelineCount: timelineRes.count || 0,
        legalIssuesIdentified: (analyzerRes.data?.length || 0) > 0,
        casePacketGenerated: (intakeRes.data?.length || 0) > 0,
      });
    } catch (err) {
      console.error("Error fetching case builder progress:", err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const currentStepIndex = CASE_BUILDER_STEPS.findIndex((s) => s.id === currentStep);
  
  const goToStep = (step: CaseBuilderStep) => setCurrentStep(step);
  const goNext = () => {
    if (currentStepIndex < CASE_BUILDER_STEPS.length - 1) {
      setCurrentStep(CASE_BUILDER_STEPS[currentStepIndex + 1].id);
    }
  };
  const goBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(CASE_BUILDER_STEPS[currentStepIndex - 1].id);
    }
  };

  const isStepComplete = (step: CaseBuilderStep): boolean => {
    switch (step) {
      case "incident-intake": return progress.incidentIntakeComplete;
      case "evidence-vault": return progress.evidenceCount > 0;
      case "timeline-builder": return progress.timelineCount > 0;
      case "legal-issue-mapping": return progress.legalIssuesIdentified;
      case "case-packet": return progress.casePacketGenerated;
      default: return false;
    }
  };

  const completedSteps = CASE_BUILDER_STEPS.filter((s) => isStepComplete(s.id)).length;
  const progressPercent = Math.round((completedSteps / CASE_BUILDER_STEPS.length) * 100);

  return {
    user,
    currentStep,
    currentStepIndex,
    progress,
    progressPercent,
    completedSteps,
    isLoading,
    goToStep,
    goNext,
    goBack,
    isStepComplete,
    refetchProgress: fetchProgress,
  };
}
