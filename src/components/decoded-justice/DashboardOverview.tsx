import type { ReadinessResult } from "@/features/decoded-justice/types";
import { ReadinessScoreCard } from "./ReadinessScoreCard";

interface DashboardOverviewProps {
  caseTitle: string;
  nextStep: string;
  progressItems: Array<{ label: string; done: boolean }>;
  readiness: ReadinessResult;
}

export function DashboardOverview({ caseTitle, nextStep, progressItems, readiness }: DashboardOverviewProps) {
  return (
    <section className="space-y-5">
      <div className="rounded-xl border bg-card p-5">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Decoded Justice</p>
        <h1 className="text-2xl font-semibold mt-1">{caseTitle}</h1>
        <p className="text-muted-foreground mt-2">Next step: {nextStep}</p>
      </div>

      <div className="rounded-xl border bg-card p-5">
        <h2 className="font-semibold mb-3">Progress</h2>
        <div className="space-y-2">
          {progressItems.map((item) => (
            <div key={item.label} className="flex items-center justify-between text-sm">
              <span>{item.label}</span>
              <span className={item.done ? "text-emerald-600" : "text-amber-600"}>
                {item.done ? "Complete" : "Needs attention"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <ReadinessScoreCard readiness={readiness} />
    </section>
  );
}
