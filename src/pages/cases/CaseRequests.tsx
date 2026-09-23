import { useParams } from "react-router-dom";
import { CaseWorkspaceLayout } from "@/components/case-workspace/CaseWorkspaceLayout";
import { RecordManager } from "@/components/case-workspace/RecordManager";
import { CaseWorkspaceSummary } from "@/components/case-workspace/CaseWorkspaceSummary";
import { useCaseSnapshot } from "@/hooks/useCaseSnapshot";
import { REQUEST_STATUSES } from "@/lib/case/classification";

export default function CaseRequests() {
  const { id } = useParams();
  const { snapshot } = useCaseSnapshot(id);
  return (
    <CaseWorkspaceLayout
      title="Requests & deadlines"
      description="Records you've asked for and dates you're keeping an eye on. Dates here are yours to track — this tool doesn't calculate legal deadlines."
    >
      <CaseWorkspaceSummary communications={snapshot.communications} requests={snapshot.requests} />
      <RecordManager
        table="record_requests"
        caseId={id}
        addLabel="Add a request"
        emptyMessage="No requests tracked yet."
        titleField="title"
        subtitleFields={["record_holder", "requested_at", "due_at", "notes"]}
        badgeFields={["status", "record_holder"]}
        orderBy={{ column: "due_at", ascending: true }}
        fields={[
          { key: "title", label: "What you asked for", type: "text", required: true },
          { key: "record_holder", label: "Agency or organization", type: "text" },
          { key: "notes", label: "Details / notes", type: "textarea" },
          { key: "status", label: "Status", type: "select", options: REQUEST_STATUSES, defaultValue: "draft" },
          { key: "request_method", label: "How you sent it", type: "text", placeholder: "Email, portal, mail" },
          { key: "date_sent", label: "Date sent", type: "date" },
          { key: "acknowledgement_date", label: "Date they acknowledged", type: "date" },
          { key: "due_date", label: "Date you're watching", type: "date" },
          { key: "tracking_number", label: "Reference or tracking number", type: "text" },
          { key: "outcome", label: "What came back", type: "textarea" },
          { key: "notes", label: "Notes", type: "textarea" },
        ]}
      />
    </CaseWorkspaceLayout>
  );
}
