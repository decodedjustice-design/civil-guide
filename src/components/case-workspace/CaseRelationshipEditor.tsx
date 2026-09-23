import { useMemo, useState } from "react";
import { Link2, Trash2, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

type RecordType = "event" | "document" | "issue" | "person" | "organization" | "communication" | "request" | "note";
const TYPE_LABELS: Record<RecordType, string> = {
  event: "Timeline event",
  document: "Exhibit",
  issue: "Issue",
  person: "Person",
  organization: "Organization",
  communication: "Communication",
  request: "Request",
  note: "Note",
};
const COLLECTIONS: Record<RecordType, keyof ReturnType<typeof useEmptySnapshot>> = {
  event: "timeline", document: "evidence", issue: "issues", person: "people",
  organization: "organizations", communication: "communications", request: "requests", note: "notes",
};
function useEmptySnapshot() { return { timeline: [], evidence: [], issues: [], people: [], organizations: [], communications: [], requests: [], notes: [], links: [] }; }

interface Props { caseId?: string; snapshot: ReturnType<typeof useEmptySnapshot>; }

export function CaseRelationshipEditor({ caseId, snapshot }: Props) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [fromType, setFromType] = useState<RecordType>("timeline");
  const [fromId, setFromId] = useState("");
  const [toType, setToType] = useState<RecordType>("evidence");
  const [toId, setToId] = useState("");
  const [relation, setRelation] = useState("supports");
  const [saving, setSaving] = useState(false);

  const options = useMemo(() => (type: RecordType) => {
    const rows = snapshot[COLLECTIONS[type]] as any[];
    return rows.map((row) => ({
      id: row.id,
      label: row.title || row.name || row.subject || row.request_title || "Untitled record",
    }));
  }, [snapshot]);

  const addLink = async () => {
    if (!caseId || !user?.id || !fromId || !toId || !relation.trim()) return;
    setSaving(true);
    const { error } = await supabase.from("case_relationships").insert({
      case_id: caseId, from_id: fromId, from_type: fromType,
      to_id: toId, to_type: toType, relation: relation.trim(),
    });
    setSaving(false);
    if (error) { toast.error("Could not save relationship"); return; }
    toast.success("Relationship added");
    await queryClient.invalidateQueries({ queryKey: ["case-snapshot", caseId] });
    setFromId(""); setToId("");
  };

  const removeLink = async (id: string) => {
    const { error } = await supabase.from("case_relationships").delete().eq("id", id).eq("case_id", caseId);
    if (error) toast.error("Could not remove relationship");
    else { toast.success("Relationship removed"); await queryClient.invalidateQueries({ queryKey: ["case-snapshot", caseId] }); }
  };

  const labelFor = (type: string, id: string) => {
    const rows = snapshot[COLLECTIONS[type as RecordType]] as any[];
    const row = rows.find((r) => r.id === id);
    return row?.title || row?.name || row?.subject || row?.request_title || "Untitled record";
  };

  return (
    <Card>
      <CardContent className="p-5 space-y-4">
        <div>
          <h2 className="font-serif text-lg flex items-center gap-2"><Link2 className="h-4 w-4" />Relationships</h2>
          <p className="text-sm text-muted-foreground mt-1">Connect records without changing what any record says.</p>
        </div>
        <div className="grid lg:grid-cols-[1fr_1fr_auto_1fr_1fr_auto] gap-2 items-end">
          <div><label className="text-xs text-muted-foreground">From</label><Select value={fromType} onValueChange={(v) => { setFromType(v as RecordType); setFromId(""); }}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.entries(TYPE_LABELS).map(([k,v])=><SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent></Select></div>
          <div><label className="text-xs text-muted-foreground">Record</label><Select value={fromId} onValueChange={setFromId}><SelectTrigger><SelectValue placeholder="Choose" /></SelectTrigger><SelectContent>{options(fromType).map(o=><SelectItem key={o.id} value={o.id}>{o.label}</SelectItem>)}</SelectContent></Select></div>
          <div className="pb-1"><Input value={relation} onChange={(e)=>setRelation(e.target.value)} placeholder="supports" className="min-w-24" /></div>
          <div><label className="text-xs text-muted-foreground">To</label><Select value={toType} onValueChange={(v) => { setToType(v as RecordType); setToId(""); }}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.entries(TYPE_LABELS).map(([k,v])=><SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent></Select></div>
          <div><label className="text-xs text-muted-foreground">Record</label><Select value={toId} onValueChange={setToId}><SelectTrigger><SelectValue placeholder="Choose" /></SelectTrigger><SelectContent>{options(toType).map(o=><SelectItem key={o.id} value={o.id}>{o.label}</SelectItem>)}</SelectContent></Select></div>
          <Button onClick={addLink} disabled={saving || !fromId || !toId} className="gap-2"><Plus className="h-4 w-4" />Add</Button>
        </div>
        {snapshot.links.length === 0 ? <p className="text-xs text-muted-foreground">No relationships recorded yet.</p> : <div className="space-y-2">{snapshot.links.map((link:any)=><div key={link.id} className="flex items-center gap-2 rounded-lg border p-3 text-sm"><Link2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" /><span className="truncate">{labelFor(link.from_type,link.from_id)}</span><span className="text-xs text-primary shrink-0">{link.relation}</span><span className="truncate">{labelFor(link.to_type,link.to_id)}</span><Button variant="ghost" size="icon" className="ml-auto shrink-0" onClick={()=>removeLink(link.id)}><Trash2 className="h-4 w-4" /></Button></div>)}</div>}
      </CardContent>
    </Card>
  );
}
