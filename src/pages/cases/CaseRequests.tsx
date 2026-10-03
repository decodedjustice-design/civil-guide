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
        subtitleFields={["record_holder", "contact_email", "submission_method", "requested_at", "due_at", "notes"]}
        badgeFields={["status"]}
        orderBy={{ column: "due_at", ascending: true }}
        fields={[
          { key: "title", label: "What you asked for", type: "text", required: true },
          { key: "record_holder", label: "Agency or organization", type: "text" },
          { key: "contact_name", label: "Records contact", type: "text" },
          { key: "contact_email", label: "Records email", type: "text" },
          { key: "contact_phone", label: "Records phone", type: "text" },
          { key: "submission_method", label: "Submission method", type: "text", placeholder: "Email, online portal, mail, fax" },
          { key: "submission_url", label: "Official request portal", type: "text" },
          { key: "mailing_address", label: "Mailing address", type: "textarea" },
          { key: "routing_source", label: "Routing source", type: "text", placeholder: "Official agency records page" },
          { key: "routing_verified_at", label: "Routing verified", type: "date" },
          
          { key: "status", label: "Status", type: "select", options: REQUEST_STATUSES, defaultValue: "draft" },
          
          { key: "requested_at", label: "Date sent", type: "date" },
          
          { key: "due_at", label: "Date you're watching", type: "text" },
          { key: "request_number", label: "Reference or tracking number", type: "text" },
          
          { key: "notes", label: "Notes", type: "textarea" },
        ]}
      />
    </CaseWorkspaceLayout>
  );
}
