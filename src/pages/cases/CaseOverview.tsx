import { Link, useParams } from "react-router-dom";
import {
  CalendarClock,
  FolderArchive,
  ListTree,
  Users,
  MessageSquare,
  FileSearch,
  ArrowRight,
} from "lucide-react";
import { CaseWorkspaceLayout } from "@/components/case-workspace/CaseWorkspaceLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCaseSnapshot } from "@/hooks/useCaseSnapshot";
import { classificationBadgeClass, exhibitLabel } from "@/lib/case/classification";
import { CaseRelationshipEditor } from "@/components/case-workspace/CaseRelationshipEditor";

export default function CaseOverview() {
  const { id } = useParams();
  const { snapshot, isLoading } = useCaseSnapshot(id);

  const tiles = [
    { label: "Timeline events", count: snapshot.timeline.length, to: "timeline", icon: CalendarClock },
    { label: "Exhibits", count: snapshot.evidence.length, to: "evidence", icon: FolderArchive },
    { label: "Claims & issues", count: snapshot.issues.length, to: "issues", icon: ListTree },
    {
      label: "People & orgs",
      count: snapshot.people.length + snapshot.organizations.length,
      to: "people",
      icon: Users,
    },
    { label: "Communications", count: snapshot.communications.length, to: "communications", icon: MessageSquare },
    { label: "Requests", count: snapshot.requests.length, to: "requests", icon: FileSearch },
  ];

  const needsReview = snapshot.evidence.filter((e) => e.review_status !== "reviewed").length;
  const unclassified = [...snapshot.timeline, ...snapshot.evidence].filter(
    (r) => !r.classification || r.classification === "unknown"
  ).length;

  return (
    <CaseWorkspaceLayout
      title="Case overview"
      description="Where your record stands right now. Nothing here is a conclusion about your rights."
    >
      {isLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {tiles.map((t) => (
              <Link key={t.to} to={`/cases/${id}/${t.to}`}>
                <Card className="h-full transition-all hover:border-primary/40 hover:shadow-sm cursor-pointer">
                  <CardContent className="p-4">
                    <t.icon className="h-4 w-4 text-muted-foreground mb-2" strokeWidth={1.5} />
                    <p className="text-2xl font-serif text-foreground">{t.count}</p>
                    <p className="text-xs text-muted-foreground">{t.label}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {(needsReview > 0 || unclassified > 0) && (
            <Card>
              <CardContent className="p-5 space-y-2">
                <h2 className="font-serif text-lg">Worth a look when you have energy</h2>
                {needsReview > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {needsReview} exhibit{needsReview === 1 ? "" : "s"} haven't been reviewed yet.
                  </p>
                )}
                {unclassified > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {unclassified} item{unclassified === 1 ? " is" : "s are"} still marked unknown —
                    fact, allegation, inference, or disputed.
                  </p>
                )}
                <Link
                  to={`/cases/${id}/content-check`}
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline pt-1"
                >
                  Run a content check <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </CardContent>
            </Card>
          )}

          <CaseRelationshipEditor caseId={id} snapshot={snapshot} />

          <Card>
            <CardContent className="p-5 space-y-3">
              <h2 className="font-serif text-lg">Most recent exhibits</h2>
              {snapshot.evidence.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nothing added yet.{" "}
                  <Link to={`/cases/${id}/evidence`} className="text-primary hover:underline">
                    Add your first exhibit
                  </Link>
                  .
                </p>
              ) : (
                <ul className="space-y-2">
                  {snapshot.evidence.slice(-5).reverse().map((e) => (
                    <li key={e.id} className="flex items-center gap-2 text-sm">
                      <span className="font-mono text-xs text-primary whitespace-nowrap">
                        {exhibitLabel(e.exhibit_number)}
                      </span>
                      <span className="truncate text-foreground">{e.title}</span>
                      <Badge
                        variant="outline"
                        className={`ml-auto shrink-0 ${classificationBadgeClass(e.classification)}`}
                      >
                        {e.classification ?? "unknown"}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </CaseWorkspaceLayout>
  );
}
