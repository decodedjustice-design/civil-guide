import { useParams } from "react-router-dom";
import { CaseWorkspaceLayout } from "@/components/case-workspace/CaseWorkspaceLayout";
import { CaseRelationshipEditor } from "@/components/case-workspace/CaseRelationshipEditor";
import { useCaseSnapshot } from "@/hooks/useCaseSnapshot";
import { Skeleton } from "@/components/ui/skeleton";

export default function CaseRelationships() {
  const { id } = useParams();
  const { snapshot, isLoading } = useCaseSnapshot(id);

  return (
    <CaseWorkspaceLayout
      title="Record relationships"
      description="Connect records so you can see how events, exhibits, issues, people, communications and requests relate. A relationship does not change the underlying record."
    >
      {isLoading ? <Skeleton className="h-64 w-full" /> : <CaseRelationshipEditor caseId={id} snapshot={snapshot} />}
    </CaseWorkspaceLayout>
  );
}
