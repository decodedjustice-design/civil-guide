import { useParams } from "react-router-dom";
import { CaseWorkspaceLayout } from "@/components/case-workspace/CaseWorkspaceLayout";
import { RecordManager } from "@/components/case-workspace/RecordManager";
import {
  CLASSIFICATIONS,
  TIMELINE_CATEGORIES,
  IMPORTANCE_LEVELS,
} from "@/lib/case/classification";

export default function CaseTimeline() {
  const { id } = useParams();
  return (
    <CaseWorkspaceLayout
      title="Master chronology"
      description="Events in order, each marked for what it is — documented fact, allegation, inference, disputed, or not yet known."
    >
      <RecordManager
        table="timeline_entries"
        caseId={id}
        addLabel="Add event"
        emptyMessage="No events yet. Start with the dates you're most sure about."
        titleField="title"
        subtitleFields={["event_date", "description"]}
        badgeFields={["classification", "category", "importance"]}
        orderBy={{ column: "event_date", ascending: true }}
        fields={[
          { key: "title", label: "What happened", type: "text", required: true },
          { key: "event_date", label: "Date", type: "date", required: true },
          { key: "description", label: "Details", type: "textarea" },
          {
            key: "classification",
            label: "How should this be treated?",
            type: "select",
            options: CLASSIFICATIONS.map((c) => ({ value: c.value, label: c.label })),
            defaultValue: "unknown",
            help: "Nothing becomes a fact unless you mark it as one.",
          },
          { key: "category", label: "Category", type: "select", options: TIMELINE_CATEGORIES },
          { key: "importance", label: "Importance", type: "select", options: IMPORTANCE_LEVELS },
          { key: "reviewed", label: "Reviewed", type: "checkbox", placeholder: "I've checked this against a record" },
          { key: "disputed", label: "Disputed", type: "checkbox", placeholder: "Accounts conflict on this" },
          { key: "reason", label: "Why this matters", type: "textarea" },
        ]}
      />
    </CaseWorkspaceLayout>
  );
}
