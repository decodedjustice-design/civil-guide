import { useParams } from "react-router-dom";
import { CaseWorkspaceLayout } from "@/components/case-workspace/CaseWorkspaceLayout";
import { RecordManager } from "@/components/case-workspace/RecordManager";
import { CaseWorkspaceSummary } from "@/components/case-workspace/CaseWorkspaceSummary";
import { useCaseSnapshot } from "@/hooks/useCaseSnapshot";
import { REQUEST_STATUSES } from "@/lib/case/classification";
import { ClipboardCopy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function CaseRequests() {
  const { id } = useParams();
  const { snapshot } = useCaseSnapshot(id);

  const addBusinessDays = (start: Date, days: number) => { const d = new Date(start); let added = 0; while (added < days) { d.setDate(d.getDate() + 1); const day = d.getDay(); if (day !== 0 && day !== 6) added++; } return d; };

  const markSent = async (request: any) => {
    if (!id) return;
    const sent = new Date();
    const checkpoint = addBusinessDays(sent, 5);
    const { error } = await supabase.from("record_requests").update({ status: "sent", requested_at: sent.toISOString().slice(0, 10), due_at: checkpoint.toISOString() }).eq("id", request.id).eq("case_id", id);
    if (error) { toast({ title: "Could not mark sent", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Request marked sent", description: `Washington PRA initial-response checkpoint set for ${checkpoint.toLocaleDateString()}.` });
  };

  const copyRequest = async (request: any) => {
    const body = `Records Request\\n\\nTo: ${request.contact_name || "Records Officer"}${request.record_holder ? `\\nOrganization: ${request.record_holder}` : ""}${request.contact_email ? `\\nEmail: ${request.contact_email}` : ""}\\n\\nI am requesting the following records: ${request.title}.\\n\\nPlease provide the records in an electronic format if available. If any portion is withheld, please identify the withheld material and the basis for withholding it.\\n\\nRequest tracking number: ${request.request_number || "To be assigned"}`;
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
        table="record_requests"
        caseId={id}
        addLabel="Add a request"
        customItemActions={(request) => (
          <>
            <Button variant="ghost" size="sm" onClick={() => void markSent(request)} aria-label="Mark request sent" title="Mark sent"><span className="text-xs">Sent</span></Button>\n            <Button variant="ghost" size="sm" onClick={() => void copyRequest(request)} aria-label="Copy request" title="Copy request"><ClipboardCopy className="w-4 h-4 text-primary" /></Button>
            {request.submission_url ? <Button variant="ghost" size="sm" asChild><a href={request.submission_url} target="_blank" rel="noreferrer" aria-label="Open official request portal" title="Open official request portal"><ExternalLink className="w-4 h-4 text-primary" /></a></Button> : null}
          </>
        )}
        emptyMessage="No requests tracked yet."
        titleField="title"
        subtitleFields={["record_holder", "contact_email", "submission_method", "requested_at", "due_at", "notes"]}
        badgeFields={["status"]}
        orderBy={{ column: "due_at", ascending: true }}
        fields={[
          { key: "title", label: "What you asked for", type: "text", required: true },
          { key: "request_type", label: "Request type", type: "select", options: [{ value: "washington_pra", label: "Washington Public Records Act" }, { value: "other", label: "Other records request" }], defaultValue: "washington_pra", help: "For Washington PRA requests, the tracker calculates a five-business-day initial-response checkpoint. This is not a deadline for producing all records." },
          { key: "record_holder", label: "Agency or organization", type: "text" },
          { key: "contact_name", label: "Records contact", type: "text" },
          { key: "contact_email", label: "Records email", type: "text" },
          { key: "contact_phone", label: "Records phone", type: "text" },
          { key: "submission_method", label: "Submission method", type: "text", placeholder: "Email, online portal, mail, fax" },
          { key: "submission_url", label: "Official request portal", type: "text" },
          { key: "mailing_address", label: "Mailing address", type: "textarea" },
          { key: "routing_source", label: "Routing source", type: "text", placeholder: "Official agency records page" },
          { key: "routing_verified_at", label: "Routing verified", type: "date" },
          
          { key: "status", label: "Status", type: "select", options: REQUEST_STATUSES, defaultValue: "draft" },
          
          { key: "requested_at", label: "Date sent", type: "date" },
          
          { key: "due_at", label: "Date you're watching", type: "text" },
          { key: "request_number", label: "Reference or tracking number", type: "text" },
          
          { key: "notes", label: "Notes", type: "textarea" },
        ]}
      />
    </CaseWorkspaceLayout>
  );
}
