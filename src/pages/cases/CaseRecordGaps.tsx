import { Link, useParams } from "react-router-dom";
import { ArrowRight, FolderSearch } from "lucide-react";
import { CaseWorkspaceLayout } from "@/components/case-workspace/CaseWorkspaceLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCaseSnapshot } from "@/hooks/useCaseSnapshot";

export default function CaseRecordGaps() {
  const { id } = useParams();
  const { snapshot, isLoading } = useCaseSnapshot(id);

  return (
    <CaseWorkspaceLayout
      title="Record gaps"
      description="Records your case still needs. Each one comes from an issue's “what's still unknown” note, so nothing here is tracked twice."
    >
      {isLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : snapshot.record_gaps.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <FolderSearch className="h-6 w-6 mx-auto mb-3 text-muted-foreground" strokeWidth={1.5} />
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              No record gaps are tracked yet. When you note what an issue still needs on the Claims &amp; Issues page, it shows up here.
            </p>
            <Link to={`/cases/${id}/issues`} className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-4">
              Go to Claims & Issues <ArrowRight className="h-3 w-3" />
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {snapshot.record_gaps.map((gap) => (
            <Card key={gap.id}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{gap.title}</p>
                    <p className="text-xs text-muted-foreground mt-2 whitespace-pre-wrap">{gap.description}</p>
                  </div>
                  <Badge variant="outline" className="shrink-0 text-[10px]">{gap.status}</Badge>
                </div>
                <Link to={`/cases/${id}/issues`} className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-3">
                  Update on the issue <ArrowRight className="h-3 w-3" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </CaseWorkspaceLayout>
  );
}
