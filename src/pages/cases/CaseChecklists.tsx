import { useMemo, useState } from "react";
import { ClipboardCheck, CheckCircle2, Plus, RotateCcw, Trash2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CaseWorkspaceLayout } from "@/components/case-workspace/CaseWorkspaceLayout";

type ChecklistTemplate = {
  key: string;
  title: string;
  description: string;
  items: string[];
};

type ChecklistItem = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  checklist_key: string | null;
};

const TEMPLATES: ChecklistTemplate[] = [
  {
    key: "document-readiness",
    title: "Document readiness",
    description: "Prepare a clean source set before relying on a document in your case.",
    items: [
      "Identify the document and where it came from",
      "Confirm the document date and sender or issuing organization",
      "Keep the original file or a clear copy",
      "Record any page, paragraph, timestamp, or other source locator",
      "Note what factual point the document appears to support",
      "Note anything in the document that is unclear or contradictory",
      "Review extracted facts against the original document",
      "Mark the document ready for the next step only after review",
    ],
  },
  {
    key: "records-request",
    title: "Records request readiness",
    description: "Organize what you need before sending a public-records or records request.",
    items: [
      "Identify the record or record category needed",
      "Identify the likely record holder",
      "Write the date range or relevant time period",
      "Describe the records precisely enough to search",
      "Record why the records matter",
      "Confirm the correct records office or submission channel",
      "Save a copy of the request before sending",
      "Record the date sent and any response deadline to watch",
    ],
  },
  {
    key: "self-advocacy-meeting",
    title: "Self-advocacy meeting",
    description: "Prepare for a meeting with an agency, provider, school, landlord, employer, or other decision-maker.",
    items: [
      "Write the purpose of the meeting in one sentence",
      "List the facts you want to make sure are on the record",
      "Bring or identify the documents that support those facts",
      "List the questions that need an answer",
      "Identify the specific action or response you are requesting",
      "Decide how you will document the meeting",
      "Record who attended and their roles",
      "After the meeting, record commitments, responses, and next steps",
    ],
  },
  {
    key: "court-preparation",
    title: "Court preparation",
    description: "A general organization checklist; verify court-specific requirements and deadlines from the applicable court.",
    items: [
      "Confirm the court, case number, and hearing date",
      "Locate the current court order or notice",
      "Identify the filing, response, or appearance required",
      "Confirm the applicable deadline from the authoritative source",
      "Organize the documents you may need to reference",
      "Prepare a short chronology of the relevant events",
      "Prepare the questions or points you need to address",
      "Confirm how and where the court requires documents to be filed or served",
    ],
  },
];

export default function CaseChecklists() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [newItem, setNewItem] = useState("");
  const [adding, setAdding] = useState(false);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["case-checklists", id],
    enabled: !!id,
    queryFn: async (): Promise<ChecklistItem[]> => {
      const { data, error } = await supabase
        .from("tasks")
        .select("id,title,description,status,checklist_key")
        .eq("case_id", id!)
        .eq("task_type", "checklist_item")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const grouped = useMemo(() => {
    const map = new Map<string, ChecklistItem[]>();
    for (const item of items) {
      const key = item.checklist_key || "custom";
      const list = map.get(key) ?? [];
      list.push(item);
      map.set(key, list);
    }
    return map;
  }, [items]);

  const toggle = async (item: ChecklistItem) => {
    const nextStatus = item.status === "completed" ? "open" : "completed";
    const { error } = await supabase
      .from("tasks")
      .update({ status: nextStatus })
      .eq("id", item.id)
      .eq("case_id", id!);
    if (error) {
      toast({ title: "Could not update checklist", description: error.message, variant: "destructive" });
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["case-checklists", id] });
  };

  const addTemplate = async (template: ChecklistTemplate) => {
    if (!id || grouped.has(template.key)) return;
    const rows = template.items.map((title) => ({
      case_id: id,
      title,
      description: template.description,
      status: "open",
      task_type: "checklist_item",
      checklist_key: template.key,
      source_type: "checklist_template",
      review_status: "reviewed",
    }));
    const { error } = await supabase.from("tasks").insert(rows);
    if (error) {
      toast({ title: "Could not add checklist", description: error.message, variant: "destructive" });
      return;
    }
    setActiveKey(template.key);
    await queryClient.invalidateQueries({ queryKey: ["case-checklists", id] });
    toast({ title: "Checklist added", description: template.title });
  };

  const addCustomItem = async () => {
    const title = newItem.trim();
    if (!id || !activeKey || !title || adding) return;
    setAdding(true);
    try {
      const { error } = await supabase.from("tasks").insert({
        case_id: id,
        title,
        description: "Custom checklist item.",
        status: "open",
        task_type: "checklist_item",
        checklist_key: activeKey,
        source_type: "user_entered",
        review_status: "reviewed",
      });
      if (error) throw error;
      setNewItem("");
      await queryClient.invalidateQueries({ queryKey: ["case-checklists", id] });
    } catch (error: any) {
      toast({ title: "Could not add item", description: error.message, variant: "destructive" });
    } finally {
      setAdding(false);
    }
  };

  const resetChecklist = async (key: string) => {
    const checklistItems = grouped.get(key) ?? [];
    if (!checklistItems.length) return;
    const { error } = await supabase
      .from("tasks")
      .update({ status: "open" })
      .eq("case_id", id!)
      .eq("task_type", "checklist_item")
      .eq("checklist_key", key);
    if (error) {
      toast({ title: "Could not reset checklist", description: error.message, variant: "destructive" });
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ["case-checklists", id] });
  };

  const removeChecklist = async (key: string) => {
    const checklistItems = grouped.get(key) ?? [];
    if (!checklistItems.length) return;
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("case_id", id!)
      .eq("task_type", "checklist_item")
      .eq("checklist_key", key);
    if (error) {
      toast({ title: "Could not remove checklist", description: error.message, variant: "destructive" });
      return;
    }
    if (activeKey === key) setActiveKey(null);
    await queryClient.invalidateQueries({ queryKey: ["case-checklists", id] });
  };

  return (
    <CaseWorkspaceLayout
      title="Checklists & readiness"
      description="Turn a complicated task into small, trackable steps. Progress is saved to this case."
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {TEMPLATES.map((template) => {
          const checklistItems = grouped.get(template.key) ?? [];
          const complete = checklistItems.filter((item) => item.status === "completed").length;
          const percent = checklistItems.length ? Math.round((complete / checklistItems.length) * 100) : 0;
          return (
            <Card key={template.key} className="border-border/70">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base">{template.title}</CardTitle>
                    <CardDescription className="mt-1">{template.description}</CardDescription>
                  </div>
                  {checklistItems.length > 0 && (
                    <Badge variant="secondary">{complete}/{checklistItems.length}</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {checklistItems.length > 0 ? (
                  <>
                    <Progress value={percent} aria-label={`${percent}% complete`} />
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" onClick={() => setActiveKey(template.key)}>
                        {activeKey === template.key ? "Checklist open" : "Open checklist"}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => void resetChecklist(template.key)}>
                        <RotateCcw className="h-4 w-4 mr-1.5" /> Reset
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => void removeChecklist(template.key)}>
                        <Trash2 className="h-4 w-4 mr-1.5" /> Remove
                      </Button>
                    </div>
                  </>
                ) : (
                  <Button size="sm" onClick={() => void addTemplate(template)}>
                    <Plus className="h-4 w-4 mr-1.5" /> Add to case
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {isLoading ? (
        <Card><CardContent className="p-6 text-sm text-muted-foreground">Loading checklists…</CardContent></Card>
      ) : activeKey && grouped.has(activeKey) ? (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-lg">
                  {TEMPLATES.find((template) => template.key === activeKey)?.title ?? "Custom checklist"}
                </CardTitle>
                <CardDescription>Check items off as you complete them. You can return to this case at any time.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {(grouped.get(activeKey) ?? []).map((item) => (
              <label key={item.id} className="flex items-start gap-3 rounded-lg border border-border/60 p-3 hover:bg-secondary/30 cursor-pointer">
                <Checkbox
                  checked={item.status === "completed"}
                  onCheckedChange={() => void toggle(item)}
                  aria-label={item.title}
                />
                <span className={item.status === "completed" ? "text-sm line-through text-muted-foreground" : "text-sm"}>
                  {item.title}
                </span>
                {item.status === "completed" && <CheckCircle2 className="h-4 w-4 ml-auto text-primary shrink-0" />}
              </label>
            ))}
            <div className="flex gap-2 pt-3">
              <Input
                value={newItem}
                onChange={(event) => setNewItem(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") void addCustomItem();
                }}
                placeholder="Add your own checklist item"
                aria-label="New checklist item"
              />
              <Button onClick={() => void addCustomItem()} disabled={!newItem.trim() || adding}>
                <Plus className="h-4 w-4 mr-1.5" /> Add
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <ClipboardCheck className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
            <p className="font-medium">Choose a checklist when you are ready.</p>
            <p className="text-sm text-muted-foreground mt-1">Your progress is stored with the case, not just in this browser.</p>
          </CardContent>
        </Card>
      )}
    </CaseWorkspaceLayout>
  );
}
