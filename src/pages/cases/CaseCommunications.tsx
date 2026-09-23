import { useParams } from "react-router-dom";
import { CaseWorkspaceLayout } from "@/components/case-workspace/CaseWorkspaceLayout";
import { RecordManager } from "@/components/case-workspace/RecordManager";
import { CaseWorkspaceSummary } from "@/components/case-workspace/CaseWorkspaceSummary";
import { useCaseSnapshot } from "@/hooks/useCaseSnapshot";
import { CLASSIFICATIONS, COMMUNICATION_METHODS } from "@/lib/case/classification";

export default function CaseCommunications() {
  const { id } = useParams();
  const { snapshot } = useCaseSnapshot(id);
  return (
    <CaseWorkspaceLayout
      title="Communications log"
      description="Calls, emails, and conversations — what was said, by whom, and when."
    >
      <CaseWorkspaceSummary communications={snapshot.communications} requests={snapshot.requests} />
      <RecordManager
        table="communications"
        caseId={id}
        addLabel="Log a contact"
        emptyMessage="Nothing logged yet. Even a short note about a phone call helps later."
        titleField="subject"
        subtitleFields={["occurred_at", "method", "summary"]}
        badgeFields={["classification", "method"]}
        orderBy={{ column: "occurred_at", ascending: false }}
        fields={[
          { key: "subject", label: "Subject", type: "text", required: true },
          { key: "occurred_at", label: "Date / time", type: "date" },
          { key: "method", label: "How", type: "select", options: COMMUNICATION_METHODS, defaultValue: "Phone" },
          { key: "person_id", label: "Person ID", type: "text", placeholder: "Optional person UUID" },
          { key: "organization_id", label: "Organization ID", type: "text", placeholder: "Optional organization UUID" },
          { key: "summary", label: "What was said", type: "textarea" },
          
          {
            key: "classification",
            label: "How should this be treated?",
            type: "select",
            options: CLASSIFICATIONS.map((c) => ({ value: c.value, label: c.label })),
            defaultValue: "unknown",
            help: "Nothing becomes a fact unless you mark it as one.",
          },
          {
            key: "follow_up_needed",
            label: "Follow-up needed",
            type: "checkbox",
            placeholder: "Something still needs a reply",
          },
          { key: "related_issue_id", label: "Related issue ID", type: "text", placeholder: "Optional issue UUID" },
          { key: "related_request_id", label: "Related request ID", type: "text", placeholder: "Optional request UUID" },
        ]}
      />
    </CaseWorkspaceLayout>
  );
}
