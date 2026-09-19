import { Link, useParams } from "react-router-dom";
import { Download, FileText, PackageOpen, ArrowLeft } from "lucide-react";
import { CaseWorkspaceLayout } from "@/components/case-workspace/CaseWorkspaceLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCaseCollection } from "@/hooks/useCases";

export default function CaseExportCenter() {
  const { id } = useParams();
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
                    {packet.created_at ? new Date(packet.created_at).toLocaleString() : "Saved"}
                  </p>
                </div>
                {packet.content?.html ? (
                  <Button size="sm" onClick={() => downloadPacket(packet)}>
                    <Download className="h-4 w-4 mr-2" /> Export
                  </Button>
                ) : (
                  <span className="text-xs text-muted-foreground">Metadata-only save</span>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </CaseWorkspaceLayout>
  );
}
