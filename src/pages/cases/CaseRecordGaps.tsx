import { useParams } from "react-router-dom";
import { FilePlus2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CaseWorkspaceLayout } from "@/components/case-workspace/CaseWorkspaceLayout";
import { RecordManager } from "@/components/case-workspace/RecordManager";
import { RECORD_GAP_STATUSES } from "@/lib/case/classification";
import { useQueryClient } from "@tanstack/react-query";

export default function CaseRecordGaps() {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const createRequestFromGap = async (gap: any) => {
    if (!id || gap.related_request_id) return;
    try {
      const title = String(gap.title ?? "Record request").replace(/^(Locate|Clarify):\s*/i, "");
      const { data: request, error: requestError } = await supabase
        .from("record_requests")
        .insert({ case_id: id, title, record_holder: gap.record_holder ?? null, status: "draft", notes: gap.description ?? gap.notes ?? null, related_issue_id: gap.related_issue_id ?? null })
        .select("id")
        .single();
      if (requestError) throw requestError;
      const { error: taskError } = await supabase
        .from("tasks")
        .update({ related_request_id: request.id })
        .eq("id", gap.id)
        .eq("case_id", id);
      if (taskError) throw taskError;
      await queryClient.invalidateQueries({ queryKey: ["tasks", id] });
      await queryClient.invalidateQueries({ queryKey: ["record_requests", id] });
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
        table="tasks"
        caseId={id}
        addLabel="Add record gap"
        emptyMessage="No record gaps tracked yet. Add one when an important source is missing, unclear, or still needs to be requested."
        titleField="title"
        subtitleFields={["record_holder", "status", "due_at"]}
        badgeFields={["status"]}
        orderBy={{ column: "due_at", ascending: true }}
        customItemActions={(gap) => !gap.related_request_id ? (
          <Button variant="ghost" size="sm" onClick={() => void createRequestFromGap(gap)} aria-label="Create record request" title="Create draft request">
            <FilePlus2 className="w-4 h-4 text-primary" />
            <span className="sr-only">Create record request</span>
          </Button>
        ) : null}
        fields={[
          { key: "title", label: "Record needed", type: "text", required: true, placeholder: "e.g. Complete CPS contact log" },
          { key: "task_type", label: "Task type", type: "text", defaultValue: "record_gap", help: "This workspace only displays tasks classified as record gaps." },
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
          { key: "due_at", label: "Date to watch", type: "text" },
          { key: "received_at", label: "Date received", type: "date" },
          { key: "related_request_id", label: "Linked request ID", type: "text", help: "Created automatically when you use Create record request." },
          { key: "notes", label: "Notes", type: "textarea" },
        ]}
      />
    </CaseWorkspaceLayout>
  );
}
