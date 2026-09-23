import { useParams } from "react-router-dom";
import { CaseWorkspaceLayout } from "@/components/case-workspace/CaseWorkspaceLayout";
import { RecordManager } from "@/components/case-workspace/RecordManager";
import { RECORD_GAP_STATUSES } from "@/lib/case/classification";

export default function CaseRecordGaps() {
  const { id } = useParams();

  return (
    <CaseWorkspaceLayout
      title="Record gaps"
      description="Track records you believe are missing, why they matter, who may hold them, and what happened after you looked for them."
    >
      <RecordManager
        table="case_record_gaps"
        caseId={id}
        addLabel="Add record gap"
        emptyMessage="No record gaps tracked yet. Add one when an important source is missing, unclear, or still needs to be requested."
        titleField="title"
        subtitleFields={["record_holder", "status", "due_date"]}
        badgeFields={["status"]}
        orderBy={{ column: "due_date", ascending: true }}
        fields={[
          { key: "title", label: "Record needed", type: "text", required: true, placeholder: "e.g. Complete CPS contact log" },
          { key: "reason", label: "Why it matters", type: "textarea" },
          { key: "record_holder", label: "Likely record holder", type: "text", placeholder: "Agency, court, provider, person" },
          {
            key: "status",
            label: "Status",
            type: "select",
            options: RECORD_GAP_STATUSES,
            defaultValue: "identified",
          },
          { key: "related_issue_id", label: "Related issue ID", type: "text", placeholder: "Optional case issue UUID" },
          { key: "related_request_id", label: "Related request ID", type: "text", placeholder: "Optional records-request UUID" },
          { key: "date_identified", label: "Date identified", type: "date" },
          { key: "date_requested", label: "Date requested", type: "date" },
          { key: "due_date", label: "Date to watch", type: "date" },
          { key: "received_date", label: "Date received", type: "date" },
          { key: "notes", label: "Notes", type: "textarea" },
        ]}
      />
    </CaseWorkspaceLayout>
  );
}
