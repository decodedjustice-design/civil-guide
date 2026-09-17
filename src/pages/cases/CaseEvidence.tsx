import { useParams } from "react-router-dom";
import { CaseWorkspaceLayout } from "@/components/case-workspace/CaseWorkspaceLayout";
import { RecordManager } from "@/components/case-workspace/RecordManager";
import { CLASSIFICATIONS, REVIEW_STATUSES, exhibitLabel } from "@/lib/case/classification";

export default function CaseEvidence() {
  const { id } = useParams();
  return (
    <CaseWorkspaceLayout
      title="Evidence & exhibits"
      description="Store the real records behind your case. Exhibit numbers stay stable once assigned, and each item keeps its source, date, classification, and review status."
    >
      <RecordManager
        table="evidence"
        caseId={id}
        enableFileUpload
        addLabel="Add exhibit"
        emptyMessage="No exhibits yet. Upload a document or add a record you already have."
        titleField="title"
        subtitleFields={["source", "document_date", "description"]}
        badgeFields={["classification", "review_status", "system_involved"]}
        orderBy={{ column: "exhibit_number", ascending: true }}
        prefixLabel={(item) => exhibitLabel(item.exhibit_number)}
        fields={[
          { key: "title", label: "Title", type: "text", required: true },
          { key: "file_url", label: "File URL", type: "text", help: "Filled automatically when you upload a document." },
          { key: "file_name", label: "File name", type: "text", help: "Filled automatically when you upload a document." },
          { key: "file_type", label: "File type", type: "text" },
          { key: "file_size", label: "File size (bytes)", type: "text" },
          { key: "description", label: "What it shows", type: "textarea" },
          { key: "source", label: "Where it came from", type: "text", placeholder: "Agency, person, portal" },
          { key: "document_date", label: "Date on the record", type: "date" },
          {
            key: "classification",
            label: "How should this be treated?",
            type: "select",
            options: CLASSIFICATIONS.map((c) => ({ value: c.value, label: c.label })),
            defaultValue: "unknown",
          },
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
