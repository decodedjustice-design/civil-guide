import { Link, useParams } from "react-router-dom";
import { CaseWorkspaceLayout } from "@/components/case-workspace/CaseWorkspaceLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
export default function CaseChecklists() {
  const { id } = useParams();
  return <CaseWorkspaceLayout title="Checklists & readiness" description="Organize your preparation without changing your case records.">
    <Card><CardContent className="p-6 space-y-4">
      <p className="text-sm text-muted-foreground">Saved checklist progress is unavailable with the current case storage. No checklist items have been created or changed.</p>
      <Button asChild variant="outline"><Link to={id ? `/cases/${id}/evidence` : '/cases'}>Open Evidence & exhibits</Link></Button>
    </CardContent></Card>
  </CaseWorkspaceLayout>;
}
