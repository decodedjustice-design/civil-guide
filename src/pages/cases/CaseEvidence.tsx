import { useParams, Link } from "react-router-dom";
import { FileSearch, Loader2, ClipboardCheck } from "lucide-react";
import { CaseWorkspaceLayout } from "@/components/case-workspace/CaseWorkspaceLayout";
import { RecordManager } from "@/components/case-workspace/RecordManager";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCaseSnapshot } from "@/hooks/useCaseSnapshot";
import { CLASSIFICATIONS, REVIEW_STATUSES, exhibitLabel } from "@/lib/case/classification";

export default function CaseEvidence() {
  const { id } = useParams();
  const { snapshot, isLoading } = useCaseSnapshot(id);
  const mentions = snapshot.evidence_mentions;

  return (
    <CaseWorkspaceLayout title="Evidence & exhibits"
      description="Store source documents with preservation and provenance information. Original files remain separate from extracted or derived content.">
      <div className="flex justify-end mb-4">
        <Button asChild variant="outline" size="sm"><Link to={id ? `/cases/${id}/evidence-review` : "#"}><ClipboardCheck className="w-4 h-4 mr-2" /> Evidence Review</Link></Button>
      </div>
      {mentions.length > 0 && (
        <Card className="mb-5 border-primary/20 bg-primary/[0.03]">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <FileSearch className="w-4 h-4 text-primary" />
              Evidence mentioned in your story
              <Badge variant="secondary">{mentions.length}</Badge>
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              These are things your narrative says exist or were observed. They are not documents yet. Add the actual record below when you have it.
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            {mentions.map((mention: any) => (
              <div key={mention.id} className="rounded-lg border border-border/60 bg-background p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{mention.evidence_type}</p>
                    <p className="text-xs text-muted-foreground mt-1">{mention.description}</p>
                    {mention.approximate_date && mention.approximate_date !== "unknown" && (
                      <p className="text-[11px] text-muted-foreground mt-2">Date: {mention.approximate_date}</p>
                    )}
                  </div>
                  {mention.priority && <Badge variant="outline" className="shrink-0 text-[10px]">{mention.priority}</Badge>}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      {isLoading && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Checking for evidence mentioned in your story…
        </div>
      )}

      <RecordManager
        table="documents" caseId={id} addLabel="Add document" enableFileUpload
        emptyMessage="No source documents yet. Add the records that form the documentary basis of this case."
        titleField="display_filename"
        subtitleFields={["source", "document_date", "description"]}
        badgeFields={["classification", "review_status", "document_type"]}
        orderBy={{ column: "exhibit_number", ascending: true }}
        prefixLabel={(item) => exhibitLabel(item.exhibit_number)}
        fields={[
          { key: "display_filename", label: "Document title / filename", type: "text", required: true },
          { key: "document_type", label: "Document type", type: "text", placeholder: "Order, report, email, photo, recording" },
          { key: "description", label: "What it shows", type: "textarea" },
          { key: "source", label: "Where it came from", type: "text", placeholder: "Agency, person, portal" },
          { key: "document_date", label: "Date on the record", type: "date" },
          { key: "received_at", label: "Date received", type: "text" },
          { key: "classification", label: "Classification", type: "select", options: CLASSIFICATIONS.map((c) => ({ value: c.value, label: c.label })), defaultValue: "unknown" },
          { key: "review_status", label: "Review status", type: "select", options: REVIEW_STATUSES, defaultValue: "needs_review" },
          { key: "system_involved", label: "System involved", type: "text" },
          { key: "people_involved", label: "People involved", type: "text" },
          { key: "relevance_notes", label: "Why it matters", type: "textarea" },
          { key: "sensitive", label: "Sensitive", type: "checkbox", placeholder: "Handle with care" },
          { key: "include_in_export", label: "Include in packets", type: "checkbox", defaultValue: true, placeholder: "Add to exports by default" },
        ]}
      />
    </CaseWorkspaceLayout>
  );
}
