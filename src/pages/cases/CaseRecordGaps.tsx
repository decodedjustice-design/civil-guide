import { useParams } from "react-router-dom";
import { FilePlus2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CaseWorkspaceLayout } from "@/components/case-workspace/CaseWorkspaceLayout";
import { RecordManager } from "@/components/case-workspace/RecordManager";
import { RECORD_GAP_STATUSES } from "@/lib/case/classification";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

export default function CaseRecordGaps() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const createRequestFromGap = async (gap: any) => {
    if (!id || !user || gap.related_request_id) return;
    if (!gap.record_holder?.trim()) { toast({ title: "Add the agency or organization first", variant: "destructive" }); return; }
    try {
      const title = String(gap.title ?? "Record request").replace(/^(Locate|Clarify):\s*/i, "");
      const { data: request, error: requestError } = await supabase
        .from("case_records_requests")
        .insert({ case_id: id, user_id: user.id, request_title: title, agency: gap.record_holder, status: "draft", notes: gap.description ?? gap.notes ?? null })
        .select("id")
        .single();
      if (requestError) throw requestError;
      const { error: taskError } = await supabase
        .from("case_record_gaps")
        .update({ related_request_id: request.id })
        .eq("id", gap.id)
        .eq("case_id", id).eq("user_id", user.id);
      if (taskError) throw taskError;
      await queryClient.invalidateQueries({ queryKey: ["case_record_gaps", id] });
      await queryClient.invalidateQueries({ queryKey: ["case_records_requests", id] });
      await queryClient.invalidateQueries({ queryKey: ["case-snapshot", id] });
      toast({ title: "Request created", description: "A draft request is linked to this record gap. Confirm the recipient and submission method before sending." });
    } catch (error: any) {
      toast({ title: "Could not create request", description: error.message, variant: "destructive" });
    }
  };

  return (
    <CaseWorkspaceLayout
      title="Record gaps"
      description="Track records you believe are missing, why they matter, who may hold them, and what happened after you looked for them."
    >
      <RecordManager
        table="case_record_gaps"
        caseId={id}
        addLabel="Add record gap"
        emptyMessage="No record gaps tracked yet. Add one when an important source is missing, unclear, or still needs to be requested."
        titleField="title"
        subtitleFields={["record_holder", "status", "due_date"]}
        badgeFields={["status"]}
        orderBy={{ column: "due_date", ascending: true }}
        customItemActions={(gap) => !gap.related_request_id ? (
          <Button variant="ghost" size="sm" onClick={() => void createRequestFromGap(gap)} aria-label="Create record request" title="Create draft request">
            <FilePlus2 className="w-4 h-4 text-primary" />
            <span className="sr-only">Create record request</span>
          </Button>
        ) : null}
        fields={[
          { key: "title", label: "Record needed", type: "text", required: true, placeholder: "e.g. Complete CPS contact log" },
          { key: "description", label: "Why it matters", type: "textarea" },
          { key: "record_holder", label: "Likely record holder", type: "text", placeholder: "Agency, court, provider, person" },
          {
            key: "status",
            label: "Status",
            type: "select",
            options: RECORD_GAP_STATUSES,
            defaultValue: "identified",
          },
          { key: "identified_at", label: "Date identified", type: "date" },
          { key: "requested_at", label: "Date requested", type: "date" },
          { key: "due_date", label: "Date to watch", type: "date" },
          { key: "received_date", label: "Date received", type: "date" },
          { key: "related_request_id", label: "Linked request ID", type: "text", help: "Created automatically when you use Create record request." },
          { key: "notes", label: "Notes", type: "textarea" },
        ]}
      />
    </CaseWorkspaceLayout>
  );
}
