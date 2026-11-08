import { Link, useParams } from "react-router-dom";
import { CaseWorkspaceLayout } from "@/components/case-workspace/CaseWorkspaceLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
export default function CaseEvidenceReview() {
  const { id } = useParams();
  return <CaseWorkspaceLayout title="Evidence review" description="Keep source content separate from your interpretation.">
    <Card><CardContent className="p-6 space-y-4">
      <p className="text-sm text-muted-foreground">Separate passage-level evidence reviews are unavailable with the current case storage. Exhibit review status and issue supporting, contradicting, and missing-record notes remain available.</p>
      <Button asChild variant="outline"><Link to={id ? `/cases/${id}/evidence` : '/cases'}>Open Evidence & exhibits</Link></Button>
    </CardContent></Card>
  </CaseWorkspaceLayout>;
}
