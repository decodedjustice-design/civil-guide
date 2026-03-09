import { cn } from "@/lib/utils";
import { CheckCircle2, Lock } from "lucide-react";
import { CASE_BUILDER_STEPS, CaseBuilderStep } from "@/hooks/useCaseBuilder";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CaseBuilderProgressProps {
  currentStep: CaseBuilderStep;
  isStepComplete: (step: CaseBuilderStep) => boolean;
  isStepUnlocked: (step: CaseBuilderStep) => boolean;
  onStepClick: (step: CaseBuilderStep) => void;
  progressPercent: number;
}

export function CaseBuilderProgress({
  currentStep,
  isStepComplete,
  isStepUnlocked,
  onStepClick,
  progressPercent,
}: CaseBuilderProgressProps) {
  const getUnlockHint = (step: CaseBuilderStep): string => {
    switch (step) {
      case "evidence-vault": return "Complete the Incident Intake to unlock this step.";
      case "timeline-builder": return "Upload at least one piece of evidence to unlock this step.";
      case "legal-issue-mapping": return "Add at least one timeline event to unlock this step.";
      case "case-packet": return "Identify legal issues to unlock this step.";
      default: return "";
    }
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="space-y-4">
        {/* Progress bar */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground tracking-wide font-medium">Case Progress</span>
          <span className="text-xs font-medium text-foreground">{progressPercent}%</span>
        </div>
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-gold rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Step indicators */}
        <div className="flex items-start justify-between gap-1">
          {CASE_BUILDER_STEPS.map((step, index) => {
            const isActive = step.id === currentStep;
            const isComplete = isStepComplete(step.id);
            const isUnlocked = isStepUnlocked(step.id);
            const isLocked = !isUnlocked;

            const stepButton = (
              <button
                onClick={() => onStepClick(step.id)}
                disabled={isLocked}
                className={cn(
                  "flex flex-col items-center text-center flex-1 min-w-0 group transition-colors",
                  isUnlocked ? "cursor-pointer" : "cursor-not-allowed opacity-50"
                )}
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all mb-1.5",
                    isComplete && "border-gold bg-gold/15 text-gold",
                    isActive && !isComplete && "border-primary bg-primary/10 text-primary",
                    !isActive && !isComplete && isUnlocked && "border-border bg-card text-muted-foreground/40 group-hover:border-muted-foreground/60",
                    isLocked && "border-border/50 bg-muted/30 text-muted-foreground/30"
                  )}
                >
                  {isComplete ? (
                    <CheckCircle2 className="w-4 h-4" strokeWidth={1.5} />
                  ) : isLocked ? (
                    <Lock className="w-3.5 h-3.5" />
                  ) : (
                    <span className="text-xs font-medium">{index + 1}</span>
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] sm:text-xs font-medium leading-tight tracking-wide",
                    isActive ? "text-primary" : isComplete ? "text-foreground" : isUnlocked ? "text-muted-foreground" : "text-muted-foreground/40"
                  )}
                >
                  {step.shortLabel}
                </span>
              </button>
            );

            return (
              <div key={step.id} className="flex-1 min-w-0">
                {isLocked ? (
                  <Tooltip>
                    <TooltipTrigger asChild>{stepButton}</TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-[200px] text-center">
                      <p className="text-xs">{getUnlockHint(step.id)}</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  stepButton
                )}
              </div>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
}
