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
            table="case_people"
            caseId={id}
            addLabel="Add person"
            emptyMessage="No people added yet."
            titleField="name"
            subtitleFields={["role", "organization", "notes"]}
            badgeFields={["relationship"]}
            fields={[
              { key: "name", label: "Name", type: "text", required: true },
              { key: "role", label: "Role or title", type: "text" },
              { key: "organization", label: "Organization", type: "text" },
              { key: "relationship", label: "Relationship to you", type: "text" },
              { key: "email", label: "Email", type: "text" },
              { key: "phone", label: "Phone", type: "text" },
              { key: "notes", label: "Notes", type: "textarea" },
            ]}
          />
        </TabsContent>
        <TabsContent value="orgs">
          <RecordManager
            table="case_organizations"
            caseId={id}
            addLabel="Add organization"
            emptyMessage="No organizations added yet."
            titleField="name"
            subtitleFields={["org_type", "notes"]}
            fields={[
              { key: "name", label: "Name", type: "text", required: true },
              { key: "org_type", label: "Type", type: "text", placeholder: "Agency, landlord, school, employer" },
              { key: "contact_name", label: "Main contact", type: "text" },
              { key: "email", label: "Email", type: "text" },
              { key: "phone", label: "Phone", type: "text" },
              { key: "address", label: "Address", type: "text" },
              { key: "notes", label: "Notes", type: "textarea" },
            ]}
          />
        </TabsContent>
      </Tabs>
    </CaseWorkspaceLayout>
  );
}
