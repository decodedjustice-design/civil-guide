import { useParams } from "react-router-dom";
import { CaseWorkspaceLayout } from "@/components/case-workspace/CaseWorkspaceLayout";
import { RecordManager } from "@/components/case-workspace/RecordManager";
import { CLASSIFICATIONS, REVIEW_STATUSES, exhibitLabel } from "@/lib/case/classification";

export default function CaseEvidence() {
  const { id } = useParams();
  return (
    <CaseWorkspaceLayout title="Evidence & exhibits"
      description="Store source documents with preservation and provenance information. Original files remain separate from extracted or derived content.">
      <RecordManager
        table="evidence" caseId={id} addLabel="Add document"
        emptyMessage="No source documents yet. Add the records that form the documentary basis of this case."
        titleField="title"
        subtitleFields={["source", "document_date", "description"]}
        badgeFields={["classification", "review_status", "file_type"]}
        orderBy={{ column: "exhibit_number", ascending: true }}
        prefixLabel={(item) => exhibitLabel(item.exhibit_number)}
        fields={[
          { key: "title", label: "Document title / filename", type: "text", required: true },
          { key: "file_type", label: "Document type", type: "text", placeholder: "Order, report, email, photo, recording" },
          { key: "description", label: "What it shows", type: "textarea" },
          { key: "source", label: "Where it came from", type: "text", placeholder: "Agency, person, portal" },
          { key: "document_date", label: "Date on the record", type: "date" },
          { key: "received_date", label: "Date received", type: "date" },
          { key: "classification", label: "Classification", type: "select", options: CLASSIFICATIONS.map((c) => ({ value: c.value, label: c.label })), defaultValue: "unknown" },
          { key: "review_status", label: "Review status", type: "select", options: REVIEW_STATUSES, defaultValue: "needs_review" },
          { key: "system_involved", label: "System involved", type: "text" },
          { key: "people_involved", label: "People involved", type: "text" },
          { key: "relevance_notes", label: "Why it matters", type: "textarea" },
          { key: "sensitive", label: "Sensitive", type: "checkbox", placeholder: "Handle with care" },
          { key: "include_in_export", label: "Include in packets", type: "checkbox", defaultValue: true, placeholder: "Add to exports by default" },
        ]}
      />
    </CaseWorkspaceLayout>
  );
}
