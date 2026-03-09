import { cn } from "@/lib/utils";
import { CheckCircle2, Circle } from "lucide-react";
import { CASE_BUILDER_STEPS, CaseBuilderStep } from "@/hooks/useCaseBuilder";

interface CaseBuilderProgressProps {
  currentStep: CaseBuilderStep;
  isStepComplete: (step: CaseBuilderStep) => boolean;
  onStepClick: (step: CaseBuilderStep) => void;
  progressPercent: number;
}

export function CaseBuilderProgress({
  currentStep,
  isStepComplete,
  onStepClick,
  progressPercent,
}: CaseBuilderProgressProps) {
  return (
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

          return (
            <button
              key={step.id}
              onClick={() => onStepClick(step.id)}
              className={cn(
                "flex flex-col items-center text-center flex-1 min-w-0 group cursor-pointer transition-colors",
                isActive && "text-primary",
                !isActive && !isComplete && "text-muted-foreground"
              )}
            >
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all mb-1.5",
                  isComplete && "border-gold bg-gold/15 text-gold",
                  isActive && !isComplete && "border-primary bg-primary/10 text-primary",
                  !isActive && !isComplete && "border-border bg-card text-muted-foreground/40 group-hover:border-muted-foreground/60"
                )}
              >
                {isComplete ? (
                  <CheckCircle2 className="w-4 h-4" strokeWidth={1.5} />
                ) : (
                  <span className="text-xs font-medium">{index + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] sm:text-xs font-medium leading-tight tracking-wide",
                  isActive ? "text-primary" : isComplete ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.shortLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
