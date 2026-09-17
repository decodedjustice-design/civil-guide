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
        subtitleFields={["occurred_on", "person", "summary"]}
        badgeFields={["classification", "method"]}
        orderBy={{ column: "occurred_on", ascending: false }}
        fields={[
          { key: "subject", label: "Subject", type: "text", required: true },
          { key: "occurred_on", label: "Date", type: "date" },
          { key: "occurred_time", label: "Time", type: "text", placeholder: "e.g. 2:15 pm" },
          { key: "method", label: "How", type: "select", options: COMMUNICATION_METHODS, defaultValue: "Phone" },
          { key: "person", label: "Who you spoke with", type: "text" },
          { key: "agency", label: "Their organization", type: "text" },
          { key: "summary", label: "What was said", type: "textarea" },
          { key: "requested", label: "What you asked for", type: "textarea" },
          { key: "response", label: "What they said back", type: "textarea" },
          { key: "promises_made", label: "Anything they promised", type: "textarea" },
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
          { key: "follow_up_date", label: "Follow up by", type: "date" },
          { key: "notes", label: "Notes", type: "textarea" },
        ]}
      />
    </CaseWorkspaceLayout>
  );
}
