import { useParams } from "react-router-dom";
import { CaseWorkspaceLayout } from "@/components/case-workspace/CaseWorkspaceLayout";
import { RecordManager } from "@/components/case-workspace/RecordManager";
import { CLASSIFICATIONS } from "@/lib/case/classification";

export default function CaseClaims() {
  const { id } = useParams();

  return (
    <CaseWorkspaceLayout
      title="Claims & factual propositions"
      description="Track statements about what happened or what someone says happened. A claim is not a legal conclusion; keep its source, context, and review status separate."
    >
      <RecordManager
        table="claims"
        caseId={id}
        addLabel="Add claim"
        emptyMessage="No claims tracked yet. Add a specific factual proposition and preserve who made it, when it was first stated, and any notes about its source."
        titleField="statement"
        subtitleFields={["who_made", "classification"]}
        badgeFields={["classification"]}
        orderBy={{ column: "created_at", ascending: true }}
        fields={[
          {
            key: "statement",
            label: "Factual proposition",
            type: "textarea",
            required: true,
          },
          {
            key: "classification",
            label: "How should this statement be treated?",
            type: "select",
            options: CLASSIFICATIONS.map((c) => ({ value: c.value, label: c.label })),
            defaultValue: "user_reported_information",
          },
          {
            key: "who_made",
            label: "Who made the statement?",
            type: "text",
          },
          {
            key: "first_stated_at",
            label: "When was it first stated?",
            type: "date",
          },
          {
            key: "notes",
            label: "Context / review notes",
            type: "textarea",
          },
        ]}
      />
    </CaseWorkspaceLayout>
  );
}
