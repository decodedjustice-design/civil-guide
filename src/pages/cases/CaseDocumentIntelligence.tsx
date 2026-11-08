import { Link, useParams } from "react-router-dom";
import { CaseWorkspaceLayout } from "@/components/case-workspace/CaseWorkspaceLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
export default function CaseDocumentIntelligence() {
  const { id } = useParams();
  return <CaseWorkspaceLayout title="Document Intelligence" description="Source documents remain separate from extracted or derived content.">
    <Card><CardContent className="p-6 space-y-4">
      <p className="text-sm text-muted-foreground">Document extraction is unavailable with the current case storage. Preserved document versions, extracted text, source locators, and processing runs are not configured. Your original exhibits remain available.</p>
      <Button asChild variant="outline"><Link to={id ? `/cases/${id}/evidence` : '/cases'}>Open Evidence & exhibits</Link></Button>
    </CardContent></Card>
  </CaseWorkspaceLayout>;
}
