import { useParams } from "react-router-dom";
import { CaseWorkspaceLayout } from "@/components/case-workspace/CaseWorkspaceLayout";
import { RecordManager } from "@/components/case-workspace/RecordManager";
import { CLASSIFICATIONS, ISSUE_STATUSES } from "@/lib/case/classification";

export default function CaseIssues() {
  const { id } = useParams();
  return (
    <CaseWorkspaceLayout title="Claims & issues"
      description="The questions your record may raise. These are areas that may warrant closer review — not conclusions.">
      <RecordManager
        table="issues" caseId={id} addLabel="Add issue"
        emptyMessage="No issues tracked yet. Analyzer research leads arrive marked unknown — never as a settled fact."
        titleField="title" subtitleFields={["description", "category"]}
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
