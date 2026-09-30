import { Link2, CircleHelp, FileSearch, Layers3, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ReactNode } from "react";

type Snapshot = {
  timeline: any[];
  evidence: any[];
  issues: any[];
  people: any[];
  organizations: any[];
  communications: any[];
  requests: any[];
  record_gaps: any[];
  links: any[];
};

function openRecordGaps(gaps: any[]) {
  return gaps.filter((gap) => !["received", "resolved"].includes(gap.status));
}

function unknownItems(snapshot: Snapshot) {
  const classified = [...snapshot.timeline, ...snapshot.evidence];
  const unclassified = classified.filter(
    (item) => !item.classification || item.classification === "unknown"
  ).length;

  const needsReview = [
    ...snapshot.timeline,
    ...snapshot.evidence,
    ...snapshot.issues,
    ...snapshot.people,
    ...snapshot.organizations,
    ...snapshot.communications,
    ...snapshot.record_gaps,
  ].filter((item) => item.review_status === "needs_review").length;

  return unclassified + needsReview;
}

function issueConnections(snapshot: Snapshot, issueId: string) {
  const evidence = snapshot.evidence.filter((item) => item.related_issue_id === issueId).length;
  const communications = snapshot.communications.filter(
    (item) => item.related_issue_id === issueId
  ).length;
  const gaps = snapshot.record_gaps.filter((item) => item.related_issue_id === issueId).length;

  return { evidence, communications, gaps, total: evidence + communications + gaps };
}

export function CaseIntelligencePanel({
  caseId,
  snapshot,
}: {
  caseId?: string;
  snapshot: Snapshot;
}) {
  if (!caseId) return null;

  const gaps = openRecordGaps(snapshot.record_gaps);
  const unclear = unknownItems(snapshot);
  const documented =
    snapshot.timeline.length +
    snapshot.evidence.length +
    snapshot.communications.length +
    snapshot.people.length +
    snapshot.organizations.length;
  const connected = snapshot.links.length;

  const strands = snapshot.issues
    .map((issue) => ({
      issue,
      connections: issueConnections(snapshot, issue.id),
    }))
    .filter(({ connections }) => connections.total > 0)
    .sort((a, b) => b.connections.total - a.connections.total)
    .slice(0, 5);

  return (
    <Card className="overflow-hidden border-primary/10">
      <CardContent className="p-0">
        <div className="p-5 sm:p-6 border-b bg-gradient-to-br from-primary/[0.04] via-background to-background">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-primary/70 font-medium">
                Case intelligence
              </p>
              <h2 className="font-serif text-xl sm:text-2xl mt-1">
                What your record currently contains
              </h2>
              <p className="text-sm text-muted-foreground mt-1.5 max-w-2xl">
                An organizational view of the material connected to this case. It does not measure
                case strength, predict an outcome, or decide what is legally significant.
              </p>
            </div>
            <Badge variant="outline" className="w-fit shrink-0">
              Live record view
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0">
          <Metric
            icon={<Layers3 className="h-4 w-4" />}
            label="Documented"
            value={documented}
            detail="timeline, evidence, communications, people"
          />
          <Metric
            icon={<CircleHelp className="h-4 w-4" />}
            label="Needs clarification"
            value={unclear}
            detail="unknown or flagged for review"
            to={"/cases/" + caseId + "/content-check"}
          />
          <Metric
            icon={<FileSearch className="h-4 w-4" />}
            label="Records still needed"
            value={gaps.length}
            detail="open record gaps"
            to={"/cases/" + caseId + "/record-gaps"}
          />
          <Metric
            icon={<Link2 className="h-4 w-4" />}
            label="Connected"
            value={connected}
            detail="explicit record relationships"
            to={"/cases/" + caseId + "/relationships"}
          />
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          <div className="grid lg:grid-cols-2 gap-5">
            <section className="rounded-xl border bg-muted/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-medium">What is documented</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Records already present in the case workspace.
                  </p>
                </div>
                <Layers3 className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <MiniCount label="Timeline" value={snapshot.timeline.length} />
                <MiniCount label="Evidence" value={snapshot.evidence.length} />
                <MiniCount label="People" value={snapshot.people.length + snapshot.organizations.length} />
                <MiniCount label="Communications" value={snapshot.communications.length} />
              </div>
            </section>

            <section className="rounded-xl border bg-muted/20 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-medium">What is still unclear</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Items that may benefit from a closer review or clarification.
                  </p>
                </div>
                <CircleHelp className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <p>
                  <span className="font-medium">{unclear}</span>{" "}
                  {unclear === 1 ? "item" : "items"} currently need clarification or review.
                </p>
                <Link
                  to={"/cases/" + caseId + "/content-check"}
                  className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                >
                  Open content check <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </section>
          </div>

          {strands.length > 0 && (
            <section>
              <div className="mb-3">
                <h3 className="font-medium">Connected record strands</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  These issues have explicit links to other records in the workspace.
                </p>
              </div>
              <div className="space-y-2">
                {strands.map(({ issue, connections }) => (
                  <Link
                    key={issue.id}
                    to={"/cases/" + caseId + "/issues"}
                    className="flex items-center gap-3 rounded-lg border p-3 hover:border-primary/30 hover:bg-muted/20 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{issue.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {connections.evidence} evidence · {connections.communications} communications ·{" "}
                        {connections.gaps} record gaps
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              to={"/cases/" + caseId + "/relationships"}
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              Explore record relationships <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              to={"/cases/" + caseId + "/record-gaps"}
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              Review missing records <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Metric({
  icon,
  label,
  value,
  detail,
  to,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  detail: string;
  to?: string;
}) {
  const content = (
    <div className="p-4 min-h-[118px] hover:bg-muted/20 transition-colors">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="font-serif text-2xl mt-3 text-foreground">{value}</p>
      <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{detail}</p>
    </div>
  );

  return to ? (
    <Link to={to} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30">
      {content}
    </Link>
  ) : (
    content
  );
}

function MiniCount({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border bg-background px-2.5 py-1.5 text-xs">
      <span className="text-muted-foreground">{label}</span>{" "}
      <span className="font-medium">{value}</span>
    </div>
  );
}
