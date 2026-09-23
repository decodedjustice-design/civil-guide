import { Link2, ArrowRight, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

type Snapshot = {
  timeline: any[];
  evidence: any[];
  issues: any[];
  people: any[];
  organizations: any[];
  communications: any[];
  requests: any[];
  record_gaps: any[];
  notes: any[];
  links: any[];
};

const collections: Record<string, keyof Snapshot> = {
  timeline: "timeline",
  evidence: "evidence",
  issue: "issues",
  person: "people",
  organization: "organizations",
  communication: "communications",
  request: "requests",
  record_gap: "record_gaps",
  note: "notes",
};

const labels: Record<string, string> = {
  timeline: "Timeline",
  evidence: "Exhibit",
  issue: "Issue",
  person: "Person",
  organization: "Organization",
  communication: "Communication",
  request: "Request",
  record_gap: "Record gap",
  note: "Note",
};

const pathFor = (caseId: string, type: string) => {
  const map: Record<string, string> = {
    timeline: "timeline",
    evidence: "evidence",
    issue: "issues",
    person: "people",
    organization: "people",
    communication: "communications",
    request: "requests",
    record_gap: "record-gaps",
  };
  const tab = map[type];
  return tab ? "/cases/" + caseId + "/" + tab : "/cases/" + caseId + "/relationships";
};

function recordLabel(snapshot: Snapshot, type: string, id: string) {
  const key = collections[type];
  const row = key ? snapshot[key]?.find((item: any) => item.id === id) : null;
  return row?.title || row?.name || row?.subject || row?.request_title || "Untitled record";
}

export function CaseRecordMap({ caseId, snapshot }: { caseId?: string; snapshot: Snapshot }) {
  if (!caseId) return null;

  const grouped = snapshot.links.reduce<Record<string, any[]>>((acc, link) => {
    const key = link.relation || "related";
    (acc[key] ??= []).push(link);
    return acc;
  }, {});

  return (
    <Card>
      <CardContent className="p-5 space-y-4">
        <div>
          <h2 className="font-serif text-lg flex items-center gap-2">
            <Link2 className="h-4 w-4" /> Record map
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            A readable view of the connections you have explicitly recorded. Connections do not establish that either record is true.
          </p>
        </div>

        {snapshot.links.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            No record connections yet. Use Relationships to connect an issue to an exhibit, timeline event to a source, or another record pair.
          </p>
        ) : (
          <div className="space-y-4">
            {Object.entries(grouped).map(([relation, links]) => (
              <div key={relation} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{relation}</Badge>
                  <span className="text-xs text-muted-foreground">{links.length} connection{links.length === 1 ? "" : "s"}</span>
                </div>
                {links.map((link) => (
                  <div key={link.id} className="rounded-lg border p-3 flex items-center gap-2 text-sm">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted-foreground">{labels[link.from_type] ?? link.from_type}</p>
                      <Link
                        to={pathFor(caseId, link.from_type)}
                        className="font-medium text-foreground hover:text-primary hover:underline truncate block"
                      >
                        {recordLabel(snapshot, link.from_type, link.from_id)}
                      </Link>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted-foreground">{labels[link.to_type] ?? link.to_type}</p>
                      <Link
                        to={pathFor(caseId, link.to_type)}
                        className="font-medium text-foreground hover:text-primary hover:underline truncate block"
                      >
                        {recordLabel(snapshot, link.to_type, link.to_id)}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        <Link
          to={"/cases/" + caseId + "/relationships"}
          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
        >
          Edit record relationships <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </CardContent>
    </Card>
  );
}
