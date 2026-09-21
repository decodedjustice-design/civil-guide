import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Search } from "lucide-react";
import { CaseWorkspaceLayout } from "@/components/case-workspace/CaseWorkspaceLayout";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCaseSnapshot } from "@/hooks/useCaseSnapshot";

const sources = [
  { key: "evidence", label: "Exhibit", tab: "evidence", fields: ["title", "description", "source", "relevance_notes"] },
  { key: "timeline", label: "Timeline", tab: "timeline", fields: ["title", "description", "reason"] },
  { key: "issues", label: "Issue", tab: "issues", fields: ["title", "summary", "supporting_notes", "contradicting_notes"] },
  { key: "communications", label: "Communication", tab: "communications", fields: ["subject", "summary", "person"] },
  { key: "requests", label: "Request", tab: "requests", fields: ["request_title", "agency", "description", "outcome"] },
  { key: "people", label: "Person", tab: "people", fields: ["name", "role", "organization", "notes"] },
  { key: "organizations", label: "Organization", tab: "people", fields: ["name", "org_type", "notes"] },
  { key: "notes", label: "Note", tab: "", fields: ["title", "content"] },
  { key: "links", label: "Relationship", tab: "", fields: ["relation", "from_type", "to_type", "from_id", "to_id"] },
] as const;

export default function CaseSearch() {
  const { id } = useParams();
  const { snapshot, isLoading } = useCaseSnapshot(id);
  const [term, setTerm] = useState("");

  const results = useMemo(() => {
    const q = term.trim().toLowerCase();
    if (q.length < 2) return [];
    return sources.flatMap((s) =>
      ((snapshot as any)[s.key] as any[])
        .filter((row: any) => s.fields.some((f) => String(row[f] ?? "").toLowerCase().includes(q)))
        .map((row: any) => ({
          id: `${s.key}-${row.id}`,
          label: s.label,
          tab: s.tab,
          title: row.title || row.subject || row.name || row.request_title || "Untitled",
          snippet: s.fields
            .map((f) => row[f])
            .filter(Boolean)
            .join(" · ")
            .slice(0, 200),
        }))
    );
  }, [term, snapshot]);

  return (
    <CaseWorkspaceLayout
      title="Record search"
      description="Search everything in this case at once — exhibits, events, issues, contacts and notes."
    >
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search your case record"
            className="pl-9"
            aria-label="Search your case record"
          />
        </div>

        {isLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : term.trim().length < 2 ? (
          <p className="text-sm text-muted-foreground">Type at least two characters.</p>
        ) : results.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing matched that.</p>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              {results.length} match{results.length === 1 ? "" : "es"}
            </p>
            {results.map((r) => (
              <Link key={r.id} to={`/cases/${id}${r.tab ? `/${r.tab}` : ""}`}>
                <Card className="transition-colors hover:border-primary/40">
                  <CardContent className="p-4 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{r.label}</Badge>
                      <span className="font-medium text-foreground truncate">{r.title}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{r.snippet}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </CaseWorkspaceLayout>
  );
}
