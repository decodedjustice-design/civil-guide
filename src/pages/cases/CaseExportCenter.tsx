import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { Download, FileText, PackageOpen, ArrowLeft, Eye } from "lucide-react";
import { CaseWorkspaceLayout } from "@/components/case-workspace/CaseWorkspaceLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCaseCollection } from "@/hooks/useCases";

export default function CaseExportCenter() {
  const { id } = useParams();
  const [inspectPacket, setInspectPacket] = useState<any | null>(null);
  const { items, isLoading } = useCaseCollection<any>(
    "case_packets",
    id,
    { column: "created_at", ascending: false }
  );

  const downloadPacket = (packet: any) => {
    const html = packet?.content?.html;
    if (!html) return;
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${String(packet.title || "case-packet").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <CaseWorkspaceLayout
      title="Export Center"
      description="Saved packet versions from this case. Exports use the records and classifications already stored in the case workspace."
    >
      {isLoading ? (
        <Skeleton className="h-48 w-full" />
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center space-y-3">
            <PackageOpen className="h-8 w-8 mx-auto text-muted-foreground" strokeWidth={1.5} />
            <p className="text-sm text-muted-foreground">No saved packets yet.</p>
            <Button asChild>
              <Link to={`/cases/${id}/packets`}>
                <FileText className="h-4 w-4 mr-2" /> Open Packet Builder
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-end">
            <Button variant="outline" size="sm" asChild>
              <Link to={`/cases/${id}/packets`}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Packet Builder
              </Link>
            </Button>
          </div>
          {items.map((packet: any) => (
            <Card key={packet.id}>
              <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground truncate">{packet.title || "Case packet"}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {packet.packet_type || "packet"} · {packet.sections?.length ?? 0} sections ·{" "}
                    {packet.content?.provenance?.totals?.exhibits ?? "—"} exhibits ·{" "}
                    {packet.created_at ? new Date(packet.created_at).toLocaleString() : "Saved"}
                  </p>
                </div>
                <div className="flex gap-2">
                  {packet.content?.provenance ? (
                    <Button variant="outline" size="sm" onClick={() => setInspectPacket(packet)}>
                      <Eye className="h-4 w-4 mr-2" /> Source audit
                    </Button>
                  ) : null}
                  {packet.content?.html ? (
                    <Button size="sm" onClick={() => downloadPacket(packet)}>
                      <Download className="h-4 w-4 mr-2" /> Export
                    </Button>
                  ) : (
                    <span className="text-xs text-muted-foreground">Metadata-only save</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <Dialog open={!!inspectPacket} onOpenChange={(open) => !open && setInspectPacket(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Packet source audit</DialogTitle></DialogHeader>
          {inspectPacket?.content?.provenance ? (
            <div className="space-y-4 text-sm">
              <div className="rounded-lg border p-3">
                <p><strong>Case:</strong> {inspectPacket.content.provenance.case_name || "Case"}</p>
                <p><strong>Case ID:</strong> <span className="font-mono text-xs">{inspectPacket.content.provenance.case_id}</span></p>
                <p><strong>Generated:</strong> {new Date(inspectPacket.content.provenance.generated_at).toLocaleString()}</p>
              </div>
              <div className="space-y-3">
                {inspectPacket.content.provenance.sections.map((section: any) => (
                  <div key={section.key} className="rounded-lg border p-3">
                    <div className="flex justify-between gap-3"><span className="font-medium">{section.label}</span><span className="text-xs text-muted-foreground">{section.record_count} source record{section.record_count === 1 ? "" : "s"}</span></div>
                    {section.source_records?.length ? (
                      <ul className="mt-2 space-y-1 text-xs">
                        {section.source_records.map((record: any) => (
                          <li key={record.id} className="break-words">
                            <span className="font-medium text-foreground">{record.label}</span>{" "}
                            <span className="font-mono text-[10px] text-muted-foreground">({record.id})</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-2 text-[11px] text-muted-foreground">No source records</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </CaseWorkspaceLayout>
  );
}
