import { Link, useParams } from "react-router-dom";
import { CaseWorkspaceLayout } from "@/components/case-workspace/CaseWorkspaceLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
export default function CaseClaims() {
  const { id } = useParams();
  return <CaseWorkspaceLayout title="Claims & factual propositions" description="Statements remain distinct from established facts.">
    <Card><CardContent className="p-6 space-y-4">
      <p className="text-sm text-muted-foreground">Separate factual-proposition records are unavailable with the current case storage. Track allegations in Claims & issues, preserving classification and source context.</p>
      <Button asChild variant="outline"><Link to={id ? `/cases/${id}/issues` : '/cases'}>Open Claims & issues</Link></Button>
    </CardContent></Card>
  </CaseWorkspaceLayout>;
}
