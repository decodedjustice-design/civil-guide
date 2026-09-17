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
        emptyMessage="No issues tracked yet. The Analyzer can suggest areas to look at, and anything it adds arrives as an allegation or unknown."
        titleField="title"
        subtitleFields={["summary"]}
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
          { key: "supporting_facts", label: "What supports it", type: "textarea" },
          { key: "contrary_facts", label: "What weakens or complicates it", type: "textarea" },
          { key: "missing_facts", label: "What's still unknown", type: "textarea" },
          { key: "authority", label: "Authority (if known)", type: "text", help: "Leave blank rather than guessing. Unverified authority needs checking." },
        ]}
      />
    </CaseWorkspaceLayout>
  );
}
