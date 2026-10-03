import { useParams, useNavigate } from "react-router-dom";
import { CaseWorkspaceLayout } from "@/components/case-workspace/CaseWorkspaceLayout";
import { RecordManager } from "@/components/case-workspace/RecordManager";
import { CLASSIFICATIONS, ISSUE_STATUSES } from "@/lib/case/classification";
import { useCaseCollection } from "@/hooks/useCases";
import { useCaseSnapshot } from "@/hooks/useCaseSnapshot";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileSearch, ChevronRight } from "lucide-react";

export default function CaseIssues() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { snapshot } = useCaseSnapshot(id);
  const { items: reviews } = useCaseCollection<any>("evidence_reviews", id);

  const reviewStats = (issueId: string) => {
    const linked = reviews.filter((r: any) => r.issue_id === issueId);
    return {
      total: linked.length,
      needsReview: linked.filter((r: any) => r.review_status === "needs_review").length,
    };
  };

  return (
    <CaseWorkspaceLayout
      title="Claims & issues"
      description="The questions your record may raise. These are areas that may warrant closer review — not conclusions."
    >
      <div className="space-y-4 mb-6">
        {snapshot.issues.map((issue: any) => {
          const stats = reviewStats(issue.id);
          return (
            <Card key={issue.id}>
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">{issue.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {stats.total} evidence review{stats.total === 1 ? "" : "s"} · {stats.needsReview} needs review
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/cases/${id}/evidence-review?issue=${issue.id}`)}
                >
                  <FileSearch className="w-4 h-4 mr-2" />
                  Review evidence
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <RecordManager
        table="issues"
        caseId={id}
        addLabel="Add issue"
        emptyMessage="No issues tracked yet. Analyzer research leads arrive marked unknown — never as a settled fact."
        titleField="title"
        subtitleFields={["description", "category"]}
        badgeFields={["classification", "status", "origin"]}
        orderBy={{ column: "created_at", ascending: true }}
        fields={[
          { key: "title", label: "Issue", type: "text", required: true },
          { key: "description", label: "What this issue is about", type: "textarea", required: true },
          { key: "classification", label: "How should this be treated?", type: "select", options: CLASSIFICATIONS.map((c) => ({ value: c.value, label: c.label })), defaultValue: "unknown" },
          { key: "status", label: "Status", type: "select", options: ISSUE_STATUSES, defaultValue: "open" },
          { key: "category", label: "Category", type: "text" },
          { key: "who_made_allegation", label: "Who raised it", type: "text" },
          { key: "allegation_date", label: "When it first appeared", type: "date" },
          { key: "supporting_notes", label: "What supports it", type: "textarea" },
          { key: "contradicting_notes", label: "What weakens or complicates it", type: "textarea" },
          { key: "missing_records", label: "What's still unknown or missing", type: "textarea" },
          { key: "requested_remedy", label: "What you're asking for", type: "textarea" },
          { key: "next_action", label: "Next step", type: "textarea" },
          { key: "origin", label: "Origin", type: "text", defaultValue: "manual" },
          { key: "source", label: "Where this came from", type: "text" },
        ]}
      />
    </CaseWorkspaceLayout>
  );
}
