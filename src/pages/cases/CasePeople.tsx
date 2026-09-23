import { useParams } from "react-router-dom";
import { CaseWorkspaceLayout } from "@/components/case-workspace/CaseWorkspaceLayout";
import { RecordManager } from "@/components/case-workspace/RecordManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CasePeople() {
  const { id } = useParams();
  return (
    <CaseWorkspaceLayout
      title="People & organizations"
      description="Who was involved and which agency or company they belong to."
    >
      <Tabs defaultValue="people">
        <TabsList className="mb-4">
          <TabsTrigger value="people">People</TabsTrigger>
          <TabsTrigger value="orgs">Organizations</TabsTrigger>
        </TabsList>
        <TabsContent value="people">
          <RecordManager
            table="people"
            caseId={id}
            addLabel="Add person"
            emptyMessage="No people added yet."
            titleField="display_name"
            subtitleFields={["role_label", "organization", "notes"]}
            orderBy={{ column: "display_name", ascending: true }}
            fields={[
              { key: "display_name", label: "Name", type: "text", required: true },
              { key: "role_label", label: "Role or title", type: "text" },
              { key: "organization", label: "Organization", type: "text" },
              { key: "involvement", label: "How they're involved", type: "textarea" },
              { key: "contact", label: "Contact details", type: "text", placeholder: "Phone or email" },
              { key: "notes", label: "Notes", type: "textarea" },
            ]}
          />
        </TabsContent>
        <TabsContent value="orgs">
          <RecordManager
            table="organizations"
            caseId={id}
            addLabel="Add organization"
            emptyMessage="No organizations added yet."
            titleField="name"
            subtitleFields={["org_type", "contact", "notes"]}
            orderBy={{ column: "name", ascending: true }}
            fields={[
              { key: "display_name", label: "Name", type: "text", required: true },
              {
                key: "org_type",
                label: "Type",
                type: "text",
                placeholder: "Agency, landlord, school, employer",
              },
              { key: "contact", label: "Contact details", type: "text" },
              { key: "notes", label: "Notes", type: "textarea" },
            ]}
          />
        </TabsContent>
      </Tabs>
    </CaseWorkspaceLayout>
  );
}
