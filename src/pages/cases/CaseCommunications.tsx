import { useParams } from "react-router-dom";
import { CaseWorkspaceLayout } from "@/components/case-workspace/CaseWorkspaceLayout";
import { RecordManager } from "@/components/case-workspace/RecordManager";
import { CLASSIFICATIONS, COMMUNICATION_METHODS } from "@/lib/case/classification";

export default function CaseCommunications() {
  const { id } = useParams();
  return (
    <CaseWorkspaceLayout
      title="Communications log"
      description="Calls, emails, and conversations — what was said, by whom, and when."
    >
      <RecordManager
        table="case_communications"
        caseId={id}
        addLabel="Log a contact"
        emptyMessage="Nothing logged yet. Even a short note about a phone call helps later."
        titleField="subject"
        subtitleFields={["occurred_at", "with_name", "summary"]}
        badgeFields={["classification", "method"]}
        orderBy={{ column: "occurred_at", ascending: false }}
        fields={[
          { key: "subject", label: "Subject", type: "text", required: true },
          { key: "occurred_at", label: "Date", type: "date", required: true },
          { key: "method", label: "How", type: "select", options: COMMUNICATION_METHODS },
          { key: "with_name", label: "Who you spoke with", type: "text" },
          { key: "with_organization", label: "Their organization", type: "text" },
          { key: "direction", label: "Direction", type: "select", options: [
            { value: "outgoing", label: "You contacted them" },
            { value: "incoming", label: "They contacted you" },
          ] },
          { key: "summary", label: "What was said", type: "textarea" },
          {
            key: "classification",
            label: "How should this be treated?",
            type: "select",
            options: CLASSIFICATIONS.map((c) => ({ value: c.value, label: c.label })),
            defaultValue: "unknown",
          },
          { key: "follow_up", label: "Follow-up needed", type: "checkbox", placeholder: "Something still needs a reply" },
          { key: "follow_up_date", label: "Follow up by", type: "date" },
        ]}
      />
    </CaseWorkspaceLayout>
  );
}
