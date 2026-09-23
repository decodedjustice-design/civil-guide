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
        titleField="title" subtitleFields={["description", "who_made_allegation"]}
        badgeFields={["classification", "status", "origin"]}
        fields={[
          { key: "title", label: "Issue", type: "text", required: true },
          { key: "description", label: "Summary", type: "textarea" },
          { key: "classification", label: "How should this be treated?", type: "select", options: CLASSIFICATIONS.map((c) => ({ value: c.value, label: c.label })), defaultValue: "unknown" },
          { key: "status", label: "Status", type: "select", options: ISSUE_STATUSES, defaultValue: "open" },
          { key: "category", label: "Category", type: "text" },
          { key: "who_made_allegation", label: "Who raised it", type: "text" },
          { key: "allegation_date", label: "When it first appeared", type: "date" },
          { key: "notice_provided", label: "Notice provided", type: "checkbox", placeholder: "The record shows notice was provided" },
          { key: "opportunity_to_respond", label: "Opportunity to respond", type: "checkbox", placeholder: "The record shows an opportunity to respond" },
          { key: "response_notes", label: "Response / notice notes", type: "textarea" },
          { key: "source_locator_id", label: "Source locator ID", type: "text", placeholder: "Specific evidence locator UUID" },
          { key: "source_type", label: "Source type", type: "text", placeholder: "Order, report, email, recording, firsthand account" },
          { key: "supporting_notes", label: "What supports it", type: "textarea" },
          { key: "contradicting_notes", label: "What weakens or complicates it", type: "textarea" },
          { key: "missing_records", label: "What's still unknown or missing", type: "textarea" },
          { key: "requested_remedy", label: "What you're asking for", type: "textarea" },
          { key: "next_action", label: "Next step", type: "textarea" },
          { key: "origin", label: "Origin", type: "text" },
          { key: "source", label: "Where this came from", type: "text" },
        ]}
      />
    </CaseWorkspaceLayout>
  );
}
