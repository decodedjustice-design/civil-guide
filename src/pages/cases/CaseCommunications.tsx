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
        table="case_communications"
        caseId={id}
        addLabel="Log a contact"
        emptyMessage="Nothing logged yet. Even a short note about a phone call helps later."
        titleField="subject"
        subtitleFields={["occurred_on", "subject", "summary"]}
        badgeFields={["classification", "method"]}
        orderBy={{ column: "occurred_on", ascending: false }}
        fields={[
          { key: "subject", label: "Subject", type: "text", required: true },
          { key: "occurred_on", label: "Date", type: "date" },
          { key: "occurred_time", label: "Time", type: "text" },
          { key: "person", label: "Person", type: "text" },
          { key: "agency", label: "Agency", type: "text" },
          { key: "requested", label: "What was requested", type: "textarea" },
          { key: "response", label: "Response", type: "textarea" },
          { key: "promises_made", label: "Commitments", type: "textarea" },
          { key: "follow_up_date", label: "Follow-up date", type: "date" },
          
          { key: "method", label: "How", type: "select", options: COMMUNICATION_METHODS, defaultValue: "Phone" },
          
          
          { key: "summary", label: "What was said", type: "textarea" },
          
          
          
          { key: "classification", label: "How should this be treated?", type: "select", options: CLASSIFICATIONS.map((c) => ({ value: c.value, label: c.label })), defaultValue: "unknown" },
          { key: "follow_up_needed", label: "Follow-up needed", type: "checkbox", placeholder: "Something still needs a reply" },
          
          { key: "notes", label: "Notes", type: "textarea" },
        ]}
      />
    </CaseWorkspaceLayout>
  );
}
