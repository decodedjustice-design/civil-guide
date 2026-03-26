import { AlertCircle, CheckCircle2 } from "lucide-react";
import type { ReadinessResult } from "@/features/decoded-justice/types";

interface ReadinessScoreCardProps {
  readiness: ReadinessResult;
}

export function ReadinessScoreCard({ readiness }: ReadinessScoreCardProps) {
  return (
    <div className="rounded-xl border bg-card p-5 space-y-3">
      <h3 className="text-lg font-semibold text-foreground">Case readiness</h3>
      <p className="text-3xl font-bold text-primary">{readiness.score}%</p>
      {readiness.missing.length === 0 ? (
        <div className="flex items-center gap-2 text-emerald-600">
          <CheckCircle2 className="h-4 w-4" />
          <span className="text-sm">Everything needed for packet generation is in place.</span>
        </div>
      ) : (
        <div className="space-y-2">
          {readiness.missing.map((item) => (
            <div key={item} className="flex items-start gap-2 text-amber-700">
              <AlertCircle className="h-4 w-4 mt-0.5" />
              <span className="text-sm">{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
