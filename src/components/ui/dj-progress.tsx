import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle } from "lucide-react";

/**
 * Phase Progress Indicator
 * Shows a horizontal stepper with connected lines
 */
interface PhaseStep {
  number: number;
  title: string;
  icon?: React.ElementType;
  started: boolean;
}

interface PhaseProgressProps {
  phases: PhaseStep[];
  className?: string;
}

export function PhaseProgress({ phases, className }: PhaseProgressProps) {
  return (
    <div className={cn("flex items-center gap-0", className)}>
      {phases.map((phase, index) => (
        <div key={phase.number} className="flex items-center flex-1 min-w-0">
          <div className="flex flex-col items-center text-center flex-1">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                phase.started
                  ? "border-gold bg-gold/15 text-gold"
                  : "border-border bg-card text-muted-foreground/40"
              )}
            >
              {phase.started ? (
                <CheckCircle2 className="w-5 h-5" strokeWidth={1.5} />
              ) : (
                <Circle className="w-5 h-5" strokeWidth={1.5} />
              )}
            </div>
            <p
              className={cn(
                "text-xs mt-2 font-medium tracking-wide leading-tight",
                phase.started ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {phase.title}
            </p>
          </div>
          {index < phases.length - 1 && (
            <div
              className={cn(
                "h-px flex-shrink-0 w-6 sm:w-10 mt-[-1rem]",
                phase.started ? "bg-gold/40" : "bg-border"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * Step Workflow Component
 * A numbered vertical step-by-step guide
 */
interface WorkflowStep {
  title: string;
  description: string;
  icon?: React.ElementType;
  status?: "complete" | "current" | "upcoming";
}

interface StepWorkflowProps {
  steps: WorkflowStep[];
  className?: string;
}

export function StepWorkflow({ steps, className }: StepWorkflowProps) {
  return (
    <div className={cn("relative space-y-0", className)}>
      {steps.map((step, index) => {
        const Icon = step.icon;
        const status = step.status || "upcoming";

        return (
          <div key={index} className="relative flex gap-4 pb-8 last:pb-0">
            {/* Vertical connector line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "absolute left-5 top-10 w-px h-[calc(100%-2rem)]",
                  status === "complete" ? "bg-gold/40" : "bg-border"
                )}
              />
            )}

            {/* Step circle */}
            <div
              className={cn(
                "relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 transition-colors",
                status === "complete" && "border-gold bg-gold/15 text-gold",
                status === "current" && "border-primary bg-primary/10 text-primary",
                status === "upcoming" && "border-border bg-card text-muted-foreground/40"
              )}
            >
              {status === "complete" ? (
                <CheckCircle2 className="w-5 h-5" strokeWidth={1.5} />
              ) : Icon ? (
                <Icon className="w-5 h-5" strokeWidth={1.5} />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>

            {/* Step content */}
            <div className="pt-1.5 min-w-0">
              <h4
                className={cn(
                  "text-sm font-medium tracking-wide",
                  status === "current" ? "text-primary" : "text-foreground"
                )}
              >
                {step.title}
              </h4>
              <p className="text-sm text-muted-foreground font-light mt-1 leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Simple progress bar
 */
interface ProgressBarProps {
  value: number; // 0-100
  label?: string;
  className?: string;
  showPercentage?: boolean;
}

export function ProgressBar({ value, label, className, showPercentage = false }: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("w-full", className)}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {label && <span className="text-xs text-muted-foreground tracking-wide">{label}</span>}
          {showPercentage && (
            <span className="text-xs font-medium text-foreground">{clampedValue}%</span>
          )}
        </div>
      )}
      <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-gold rounded-full transition-all duration-500 ease-out"
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}
