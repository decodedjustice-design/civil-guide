import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { CaseWorkspaceLayout } from "@/components/case-workspace/CaseWorkspaceLayout";
import { RecordManager } from "@/components/case-workspace/RecordManager";
import { CaseWorkspaceSummary } from "@/components/case-workspace/CaseWorkspaceSummary";
import { useCaseSnapshot } from "@/hooks/useCaseSnapshot";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { REQUEST_STATUSES } from "@/lib/case/classification";
import { ClipboardCopy, ExternalLink, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function CaseRequests() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { snapshot } = useCaseSnapshot(id);
  const [linkingRequest, setLinkingRequest] = useState<any | null>(null);
  const [selectedDocumentId, setSelectedDocumentId] = useState("");

  const { user } = useAuth();
  const queryClient = useQueryClient();
  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: ["case_records_requests", id] });
    void queryClient.invalidateQueries({ queryKey: ["case-snapshot", id] });
  };
  const markSent = async (request: any) => {
    if (!id || !user || request.status !== "draft") return;
    const { error } = await supabase.from("case_records_requests")
      .update({ status: "sent", date_sent: new Date().toISOString().slice(0, 10) })
      .eq("id", request.id).eq("case_id", id).eq("user_id", user.id);
    if (error) { toast({ title: "Could not mark sent", description: error.message, variant: "destructive" }); return; }
    invalidate();
    toast({ title: "Request marked sent", description: "No automatic deadline or follow-up task was added." });
  };
  const setRequestStatus = async (request: any, status: string) => {
    if (!id || !user || request.status === status || ["complete", "denied"].includes(request.status)) return;
    const patch = status === "acknowledged"
      ? { status, acknowledgement_date: request.acknowledgement_date || new Date().toISOString().slice(0, 10) }
      : { status };
    const { error } = await supabase.from("case_records_requests").update(patch)
      .eq("id", request.id).eq("case_id", id).eq("user_id", user.id);
    if (error) { toast({ title: "Could not update request", description: error.message, variant: "destructive" }); return; }
    invalidate();
    toast({ title: "Request updated" });
  };

  const linkDocument = async () => {
    if (!id || !user || !linkingRequest || !snapshot.evidence.some((e) => e.id === selectedDocumentId)) return;
    const exists = snapshot.links.some((link: any) =>
      link.from_type === "request" && link.from_id === linkingRequest.id &&
      link.to_type === "document" && link.to_id === selectedDocumentId
    );
    if (exists) {
      toast({ title: "Already linked", description: "That document is already connected to this request." });
      return;
    }

    const { error } = await supabase.from("case_links").insert({
      case_id: id, user_id: user.id,
      from_type: "request",
      from_id: linkingRequest.id,
      to_type: "document",
      to_id: selectedDocumentId,
      relation: "response_document",
      note: "Document linked as a response to this records request.",
    });

    if (error) {
      toast({ title: "Could not link document", description: error.message, variant: "destructive" });
      return;
    }

    invalidate();
    setLinkingRequest(null);
    setSelectedDocumentId("");
    toast({ title: "Document linked", description: "The received record is now connected to this request." });
  };

  const copyRequest = async (request: any) => {
    const body = `Records Request

To: ${request.agency}

I am requesting the following records: ${request.request_title || request.description || "Records described in this request"}.

Please provide the records in an electronic format if available. If any portion is withheld, please identify the withheld material and the basis for withholding it.

Request tracking number: ${request.tracking_number || "To be assigned"}`;
    await navigator.clipboard.writeText(body);
    toast({ title: "Request copied", description: "The draft request is ready to paste into the verified submission channel." });
  };
  return (
    <CaseWorkspaceLayout
      title="Requests & deadlines"
      description="Records you've asked for and dates you're keeping an eye on. Dates here are yours to track — this tool doesn't calculate legal deadlines."
    >
      <CaseWorkspaceSummary communications={snapshot.communications} requests={snapshot.requests} />
      <RecordManager
        table="case_records_requests"
        caseId={id}
        addLabel="Add a request"
        customItemActions={(request) => (
          <>
            <Button variant="ghost" size="sm" onClick={() => void markSent(request)} aria-label="Mark request sent" title="Mark sent" disabled={request.status !== "draft"}><span className="text-xs">Sent</span></Button>
            {request.status === "sent" ? <Button variant="ghost" size="sm" onClick={() => void setRequestStatus(request, "acknowledged")} aria-label="Mark request acknowledged" title="Mark acknowledged"><span className="text-xs">Ack</span></Button> : null}
            {request.status === "acknowledged" ? <Button variant="ghost" size="sm" onClick={() => void setRequestStatus(request, "partial")} aria-label="Mark partial response" title="Mark partial response"><span className="text-xs">Partial</span></Button> : null}
            {["acknowledged", "partial"].includes(request.status) ? <Button variant="ghost" size="sm" onClick={() => void setRequestStatus(request, "complete")} aria-label="Mark request complete" title="Mark complete"><span className="text-xs">Complete</span></Button> : null}
            {["sent", "acknowledged"].includes(request.status) ? <Button variant="ghost" size="sm" onClick={() => void setRequestStatus(request, "denied")} aria-label="Mark request denied" title="Mark denied"><span className="text-xs">Denied</span></Button> : null}
            <Button variant="ghost" size="sm" onClick={() => void copyRequest(request)} aria-label="Copy request" title="Copy request"><ClipboardCopy className="w-4 h-4 text-primary" /></Button>
            {(request.status === "partial" || request.status === "complete") ? <Button variant="ghost" size="sm" onClick={() => { setLinkingRequest(request); setSelectedDocumentId(""); }} aria-label="Link response document" title="Link response document"><Link2 className="w-4 h-4 text-primary" /></Button> : null}
          </>
        )}
        emptyMessage="No requests tracked yet."
        titleField="request_title"
        subtitleFields={["agency", "request_method", "date_sent", "due_date", "notes"]}
        badgeFields={["status"]}
        orderBy={{ column: "due_date", ascending: true }}
        fields={[
          { key: "request_title", label: "What you asked for", type: "text", required: true },
          { key: "agency", label: "Agency or organization", type: "text", required: true },
          { key: "description", label: "Records requested", type: "textarea" },
          { key: "request_method", label: "Submission method", type: "text" },
          { key: "status", label: "Status", type: "select", options: REQUEST_STATUSES, defaultValue: "draft" },
          { key: "date_sent", label: "Date sent", type: "date" },
          { key: "acknowledgement_date", label: "Date acknowledged", type: "date" },
          { key: "due_date", label: "Date you're watching", type: "date" },
          { key: "tracking_number", label: "Reference or tracking number", type: "text" },
          { key: "outcome", label: "Outcome", type: "textarea" },
          { key: "notes", label: "Notes / contact details", type: "textarea" },
        ]}
      />
      
      <Dialog open={Boolean(linkingRequest)} onOpenChange={(next) => !next && setLinkingRequest(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Link response document</DialogTitle>
            <DialogDescription>
              Connect a document already stored in this case to “{linkingRequest?.request_title}”. Upload the record first from Evidence & exhibits if you do not see it here.
            </DialogDescription>
          </DialogHeader>
          <Select value={selectedDocumentId} onValueChange={setSelectedDocumentId}>
            <SelectTrigger><SelectValue placeholder="Choose a document" /></SelectTrigger>
            <SelectContent>
              {snapshot.evidence.length === 0
                ? <SelectItem value="__none" disabled>No documents yet</SelectItem>
                : snapshot.evidence.map((doc: any) => (
                  <SelectItem key={doc.id} value={doc.id}>{doc.title || "Untitled document"}</SelectItem>
                ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLinkingRequest(null)}>Cancel</Button>
            <Button onClick={() => void linkDocument()} disabled={!selectedDocumentId}>Link document</Button>
            <Button variant="ghost" onClick={() => navigate(id ? `/cases/${id}/evidence` : "#")}>Open Evidence</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </CaseWorkspaceLayout>
  );
}
