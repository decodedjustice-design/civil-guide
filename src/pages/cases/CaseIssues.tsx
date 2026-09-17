import { useParams } from "react-router-dom";
import { CaseWorkspaceLayout } from "@/components/case-workspace/CaseWorkspaceLayout";
import { RecordManager } from "@/components/case-workspace/RecordManager";
import { CLASSIFICATIONS, ISSUE_STATUSES } from "@/lib/case/classification";

export default function CaseIssues() {
  const { id } = useParams();
  return (
    <CaseWorkspaceLayout
      title="Claims & issues"
      description="The questions your record may raise. These are areas that may warrant closer review — not conclusions."
    >
      <RecordManager
        table="case_issues"
        caseId={id}
        addLabel="Add issue"
        emptyMessage="No issues tracked yet. Anything the Analyzer suggests arrives marked as an allegation or unknown — never as a settled fact."
        titleField="title"
        subtitleFields={["summary", "who_made_allegation"]}
        badgeFields={["classification", "status", "origin"]}
        fields={[
          { key: "title", label: "Issue", type: "text", required: true },
          { key: "summary", label: "In your words", type: "textarea" },
          {
            key: "classification",
            label: "How should this be treated?",
            type: "select",
            options: CLASSIFICATIONS.map((c) => ({ value: c.value, label: c.label })),
            defaultValue: "unknown",
          },
          { key: "status", label: "Status", type: "select", options: ISSUE_STATUSES, defaultValue: "open" },
          { key: "category", label: "Category", type: "text" },
          { key: "who_made_allegation", label: "Who raised it", type: "text" },
          { key: "allegation_date", label: "When it first appeared", type: "date" },
          { key: "supporting_notes", label: "What supports it", type: "textarea" },
          { key: "contradicting_notes", label: "What weakens or complicates it", type: "textarea" },
          { key: "missing_records", label: "What's still unknown or missing", type: "textarea" },
          { key: "requested_remedy", label: "What you're asking for", type: "textarea" },
          { key: "next_action", label: "Next step", type: "textarea" },
          {
            key: "source",
            label: "Where this came from",
            type: "text",
            help: "Leave authority blank rather than guessing — unverified citations need checking.",
          },
        ]}
      />
    </CaseWorkspaceLayout>
  );
}
