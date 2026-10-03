import { Link, useParams } from "react-router-dom";
import { CheckCircle2, CircleAlert, ArrowRight } from "lucide-react";
import { CaseWorkspaceLayout } from "@/components/case-workspace/CaseWorkspaceLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCaseSnapshot } from "@/hooks/useCaseSnapshot";

export default function CaseContentCheck() {
  const { id } = useParams();
  const { snapshot, isLoading } = useCaseSnapshot(id);

  const reviewItems = [
    ...snapshot.evidence.filter((item) => item.review_status === "needs_review").map((item) => ({
      type: "Evidence",
      label: item.title || "Evidence item",
      reason: "This exhibit is still marked as waiting for your review.",
      tab: "evidence",
    })),
    ...snapshot.issues.filter((item) => item.classification === "unknown").map((item) => ({
      type: "Issue",
      label: item.title,
      reason: "This issue has no classification yet, so it can't be treated as anything in particular.",
      tab: "issues",
    })),
    ...snapshot.timeline.filter((item) => item.classification === "unknown").map((item) => ({
      type: "Timeline event",
      label: item.title,
      reason: "This event has no classification yet.",
      tab: "timeline",
    })),
  ];

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
      label: "Evidence arrival date is recorded",
      failing: snapshot.evidence.filter((e) => !e.received_date).length,
      tab: "evidence",
    },
    {
      label: "Issues identify their source or explicitly remain unsourced",
      failing: snapshot.issues.filter((i) => !i.source).length,
      tab: "issues",
    },
    {
      label: "Identified record gaps have a status",
      failing: snapshot.record_gaps.filter((g) => !g.status).length,
      tab: "record-gaps",
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
        <div className="space-y-6">
          {reviewItems.length > 0 && (
            <Card className="border-accent/30 bg-accent/5">
              <CardContent className="p-5 space-y-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Still waiting on you</p>
                  <h2 className="font-serif text-xl mt-1">Review these items</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Nothing here was deleted. These are simply the parts of your record that haven't been settled yet.
                  </p>
                </div>
                <div className="space-y-2">
                  {reviewItems.map((item, index) => (
                    <div key={item.type + item.label + index} className="rounded-xl border border-border bg-card p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{item.type}</p>
                          <p className="text-sm font-medium text-foreground mt-1 truncate">{item.label}</p>
                          <p className="text-xs text-muted-foreground mt-1">{item.reason}</p>
                        </div>
                        <Link to={`/cases/${id}/${item.tab}`} className="shrink-0 text-xs text-primary hover:underline inline-flex items-center gap-1">
                          Review <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

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
        </div>
      )}
    </CaseWorkspaceLayout>
  );
}
