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
  { id: "incident-intake", label: "Write Your Story", shortLabel: "Story", description: "Explain what happened in plain language." },
  { id: "timeline-builder", label: "Build Timeline", shortLabel: "Timeline", description: "Place events in clear chronological order." },
  { id: "evidence-vault", label: "Upload Evidence", shortLabel: "Evidence", description: "Add documents, photos, and files." },
  { id: "legal-issue-mapping", label: "Review Key Issues", shortLabel: "Issues", description: "Surface patterns and key legal issue areas." },
  { id: "case-packet", label: "Generate Case Packet", shortLabel: "Packet", description: "Create an attorney-ready case packet PDF." },
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
  
  const isStepComplete = (step: CaseBuilderStep): boolean => {
    switch (step) {
      case "incident-intake": return progress.incidentIntakeComplete;
      case "timeline-builder": return progress.timelineCount > 0;
      case "evidence-vault": return progress.evidenceCount > 0;
      case "legal-issue-mapping": return progress.legalIssuesIdentified;
      case "case-packet": return progress.casePacketGenerated;
      default: return false;
    }
  };

  const isStepUnlocked = (step: CaseBuilderStep): boolean => {
    const stepIndex = CASE_BUILDER_STEPS.findIndex((s) => s.id === step);
    if (stepIndex === 0) return true; // First step always unlocked
    // A step is unlocked if the previous step is complete
    const prevStep = CASE_BUILDER_STEPS[stepIndex - 1];
    return isStepComplete(prevStep.id);
  };

  const goToStep = (step: CaseBuilderStep) => {
    if (isStepUnlocked(step)) {
      setCurrentStep(step);
    }
  };
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
    isStepUnlocked,
    refetchProgress: fetchProgress,
  };
}
