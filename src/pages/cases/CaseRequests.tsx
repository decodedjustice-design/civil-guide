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
          { key: "status", label: "Status", type: "select", options: REQUEST_STATUSES, defaultValue: "open" },
          { key: "requested_at", label: "Date sent", type: "date" },
          { key: "due_at", label: "Date you're watching", type: "date" },
          { key: "received_at", label: "Date received", type: "date" },
          { key: "request_number", label: "Reference or tracking number", type: "text" },
          { key: "related_issue_id", label: "Related issue ID", type: "text", placeholder: "Optional issue UUID" },
        ]}
      />
    </CaseWorkspaceLayout>
  );
}
