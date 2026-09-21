import { Link, useParams } from "react-router-dom";
import { CheckCircle2, CircleAlert } from "lucide-react";
import { CaseWorkspaceLayout } from "@/components/case-workspace/CaseWorkspaceLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCaseSnapshot } from "@/hooks/useCaseSnapshot";

export default function CaseContentCheck() {
  const { id } = useParams();
  const { snapshot, isLoading } = useCaseSnapshot(id);

  const checks = [
    {
      label: "Every exhibit records where it came from",
      failing: snapshot.evidence.filter((e) => !e.source).length,
      tab: "evidence",
    },
    {
      label: "Every exhibit is marked fact, allegation, inference or disputed",
      failing: snapshot.evidence.filter((e) => !e.classification || e.classification === "unknown").length,
      tab: "evidence",
    },
    {
      label: "Every exhibit has been reviewed",
      failing: snapshot.evidence.filter((e) => e.review_status !== "reviewed").length,
      tab: "evidence",
    },
    {
      label: "Every timeline event has a date",
      failing: snapshot.timeline.filter((t) => !t.event_date).length,
      tab: "timeline",
    },
    {
      label: "Every timeline event is classified",
      failing: snapshot.timeline.filter((t) => !t.classification || t.classification === "unknown").length,
      tab: "timeline",
    },
    {
      label: "Each issue notes what would still need to be true",
      failing: snapshot.issues.filter((i) => !i.missing_records).length,
      tab: "issues",
    },
    {
      label: "Each issue notes what weakens or complicates it",
      failing: snapshot.issues.filter((i) => !i.contradicting_notes).length,
      tab: "issues",
    },
    {
      label: "Requests you sent have a date you're watching",
      failing: snapshot.requests.filter((r) => r.status !== "draft" && !r.due_date).length,
      tab: "requests",
    },
    {
      label: "Communications needing follow-up have a date",
      failing: snapshot.communications.filter((c) => c.follow_up_needed && !c.follow_up_date).length,
      tab: "communications",
    },
    {
      label: "Key records have at least one explicit relationship",
      failing: [...snapshot.evidence, ...snapshot.issues, ...snapshot.timeline].filter((row) => !snapshot.links.some((l) => l.from_id === row.id || l.to_id === row.id)).length,
      tab: "relationships",
    },
  ];

  return (
    <CaseWorkspaceLayout
      title="Content check"
      description="Gentle gaps in your record — not a score, and not a judgment about your case."
    >
      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <div className="space-y-3">
          {checks.map((c) => (
            <Card key={c.label}>
              <CardContent className="p-4 flex items-start gap-3">
                {c.failing === 0 ? (
                  <CheckCircle2 className="h-4 w-4 mt-0.5 text-primary shrink-0" strokeWidth={1.5} />
                ) : (
                  <CircleAlert className="h-4 w-4 mt-0.5 text-accent-foreground shrink-0" strokeWidth={1.5} />
                )}
                <div className="min-w-0">
                  <p className="text-sm text-foreground">{c.label}</p>
                  {c.failing > 0 && (
                    <Link to={`/cases/${id}/${c.tab}`} className="text-xs text-primary hover:underline">
                      {c.failing} item{c.failing === 1 ? "" : "s"} to look at
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </CaseWorkspaceLayout>
  );
}
