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
        table="documents" caseId={id} addLabel="Add document"
        emptyMessage="No source documents yet. Add the records that form the documentary basis of this case."
        titleField="display_filename"
        subtitleFields={["source", "document_date", "description"]}
        badgeFields={["classification", "review_status", "document_type"]}
        orderBy={{ column: "exhibit_number", ascending: true }}
        prefixLabel={(item) => exhibitLabel(item.exhibit_number)}
        fields={[
          { key: "display_filename", label: "Document title / filename", type: "text", required: true },
          { key: "document_type", label: "Document type", type: "text", required: true, placeholder: "Order, report, email, photo, recording" },
          { key: "description", label: "What it shows", type: "textarea" },
          { key: "source", label: "Where it came from", type: "text", placeholder: "Agency, person, portal" },
          { key: "document_date", label: "Date on the record", type: "date" },
          { key: "received_at", label: "Date received", type: "date" },
          { key: "original_preserved", label: "Original preserved", type: "checkbox", placeholder: "I have retained the original file" },
          { key: "metadata_preserved", label: "Metadata preserved", type: "checkbox", placeholder: "I have preserved available file metadata" },
          { key: "chain_of_custody", label: "Chain-of-custody notes", type: "textarea" },
          { key: "preservation_notes", label: "Preservation notes", type: "textarea" },
          { key: "classification", label: "Classification", type: "select", options: CLASSIFICATIONS.map((c) => ({ value: c.value, label: c.label })), defaultValue: "unknown" },
          { key: "review_status", label: "Review status", type: "select", options: REVIEW_STATUSES, defaultValue: "needs_review" },
          { key: "category", label: "Category", type: "text" },
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
