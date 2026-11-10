import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select,SelectContent,SelectItem,SelectTrigger,SelectValue } from "@/components/ui/select";
import { Dialog,DialogContent,DialogHeader,DialogTitle,DialogDescription } from "@/components/ui/dialog";
import { fields,kindLabels,statusOptions } from "@/lib/accountability/fields";
import { ids,validateWorkRecord,type WorkRecord,type WorkKind } from "@/lib/accountability/model";
import { useWorkRecords } from "@/hooks/useWorkRecords";
import { useCaseSnapshot } from "@/hooks/useCaseSnapshot";
import { toast } from "sonner";
interface Props {kind:WorkKind;caseId:string;record?:WorkRecord;onClose:()=>void;}
export function WorkRecordEditor({kind,caseId,record,onClose}:Props){
 const {records,save}=useWorkRecords(caseId);const {snapshot}=useCaseSnapshot(caseId);
 const [title,setTitle]=useState(record?.title??"");const [status,setStatus]=useState(record?.status??statusOptions[kind][0]);
 const [data,setData]=useState<WorkRecord["data"]>(record?.data??{});
 const change=(key:string,value:string|string[])=>setData(prev=>({...prev,[key]:value}));
 const submit=async()=>{try{const draft={kind,title,status,data};validateWorkRecord(draft,snapshot.evidence.map(e=>e.id));await save.mutateAsync({...draft,id:record?.id});toast.success("Saved");onClose();}catch(e){toast.error(e instanceof Error?e.message:"Could not save");}};
 return <Dialog open onOpenChange={open=>!open&&onClose()}><DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto"><DialogHeader><DialogTitle>{record?"Edit":"Add"} {kindLabels[kind].toLowerCase()}</DialogTitle><DialogDescription>You can pause anytime. Unknown details can stay blank.</DialogDescription></DialogHeader><form className="space-y-4" onSubmit={e=>{e.preventDefault();void submit();}}><div><Label htmlFor="work-title">Title</Label><Input id="work-title" required maxLength={300} value={title} onChange={e=>setTitle(e.target.value)}/></div><div><Label>Status</Label><Select value={status} onValueChange={setStatus}><SelectTrigger aria-label="Status"><SelectValue/></SelectTrigger><SelectContent>{statusOptions[kind].map(s=><SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
 {fields[kind].map(f=>{const options=f.type==="evidence"?snapshot.evidence.map(e=>({id:e.id,title:`Exhibit ${e.exhibit_number??"—"} · ${e.title}`})):records.filter(r=>f.type==="agency"?r.kind==="agency":f.type==="allegations"?r.kind==="allegation":r.kind==="source").map(r=>({id:r.id,title:r.title}));
 const multiple=["evidence","allegations","sources"].includes(f.type??"");
 return <div key={f.key}><Label htmlFor={`work-${f.key}`}>{f.label}</Label>{multiple?<div className="border rounded-md p-3 space-y-2">{options.length?options.map(o=><label key={o.id} className="flex items-start gap-2 text-sm"><Checkbox checked={Array.isArray(data[f.key])&&data[f.key].includes(o.id)} onCheckedChange={checked=>{const selected=Array.isArray(data[f.key])?data[f.key] as string[]:[];change(f.key,checked?[...selected,o.id]:selected.filter(id=>id!==o.id));}}/><span className="break-words">{o.title}</span></label>):<p className="text-sm text-muted-foreground">No matching case records yet.</p>}</div>:f.type==="agency"||f.type==="select"?<Select value={String(data[f.key]||"__none")} onValueChange={v=>change(f.key,v==="__none"?"":v)}><SelectTrigger aria-label={f.label}><SelectValue/></SelectTrigger><SelectContent><SelectItem value="__none">Not recorded</SelectItem>{(f.type==="select"?(f.options??[]).map(s=>({id:s,title:s})):options).map(o=><SelectItem key={o.id} value={o.id}>{o.title}</SelectItem>)}</SelectContent></Select>:f.type==="textarea"?<Textarea id={`work-${f.key}`} rows={f.key==="body"?14:3} maxLength={50000} value={String(data[f.key]??"")} onChange={e=>change(f.key,e.target.value)}/>:<Input id={`work-${f.key}`} type={f.type==="date"?"date":"text"} maxLength={3000} value={String(data[f.key]??"")} onChange={e=>change(f.key,e.target.value)}/>}</div>;
 })}<div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={onClose}>Cancel</Button><Button type="submit" disabled={save.isPending}>{save.isPending?"Saving…":"Save"}</Button></div></form></DialogContent></Dialog>;
}
