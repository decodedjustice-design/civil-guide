import { useRef, useState } from "react";
import { Plus, Pencil, Trash2, Upload, FileText, Download, Eye, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useCaseCollection } from "@/hooks/useCases";
import { useCaseSnapshot } from "@/hooks/useCaseSnapshot";
import { classificationBadgeClass } from "@/lib/case/classification";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface FieldConfig {
  key: string;
  label: string;
  type: "text" | "textarea" | "date" | "select" | "checkbox";
  options?: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  defaultValue?: string | boolean;
  help?: string;
}

interface RecordManagerProps {
  table: string;
  caseId?: string;
  fields: FieldConfig[];
  titleField: string;
  subtitleFields?: string[];
  badgeFields?: string[];
  orderBy?: { column: string; ascending?: boolean };
  prefixLabel?: (item: any) => string | null;
  addLabel: string;
  emptyMessage: string;
  enableFileUpload?: boolean;
}

const emptyValues = (fields: FieldConfig[]) =>
  fields.reduce<Record<string, any>>((acc, f) => {
    acc[f.key] = f.defaultValue ?? (f.type === "checkbox" ? false : "");
    return acc;
  }, {});

const sanitizeName = (name: string) => name.replace(/[^a-zA-Z0-9._-]/g, "_");

export function RecordManager({
  table,
  caseId,
  fields,
  titleField,
  subtitleFields = [],
  badgeFields = [],
  orderBy,
  addLabel,
  emptyMessage,
  prefixLabel,
  enableFileUpload = false,
}: RecordManagerProps) {
  const { items, isLoading, add, update, remove } = useCaseCollection<any>(table, caseId, orderBy);
  const { snapshot } = useCaseSnapshot(caseId);
  const [viewingItem, setViewingItem] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, any>>(emptyValues(fields));
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const openNew = () => {
    setEditingId(null);
    setValues(emptyValues(fields));
    setOpen(true);
  };

  const openEdit = (item: any) => {
    setEditingId(item.id);
    setValues(fields.reduce<Record<string, any>>((acc, f) => {
      acc[f.key] = item[f.key] ?? (f.type === "checkbox" ? false : "");
      return acc;
    }, {}));
    setOpen(true);
  };

  const uploadFile = async (file: File) => {
    if (!caseId || !file) return;
    setUploading(true);
    try {
      const path = `${caseId}/${crypto.randomUUID()}-${sanitizeName(file.name)}`;
      const { error: uploadError } = await supabase.storage.from("evidence").upload(path, file, {
        upsert: false,
        contentType: file.type || "application/octet-stream",
      });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from("evidence").getPublicUrl(path);
      setValues((v) => ({
        ...v,
        title: v.title || file.name,
        file_url: urlData.publicUrl,
        file_name: file.name,
        file_type: file.type || null,
        file_size: file.size,
      }));
      toast({ title: "File attached", description: "Save the exhibit to keep the attachment with this record." });
    } catch (e: any) {
      toast({ title: "Upload failed", description: e.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    const missing = fields.find((f) => f.required && !String(values[f.key] ?? "").trim());
    if (missing) {
      toast({ title: `${missing.label} is needed`, variant: "destructive" });
      return;
    }
    const payload = fields.reduce<Record<string, any>>((acc, f) => {
      const raw = values[f.key];
      if (f.type === "checkbox") acc[f.key] = Boolean(raw);
      else if (raw === "" || raw === undefined || raw === null) {
        if (editingId) acc[f.key] = null;
      } else acc[f.key] = raw;
      return acc;
    }, {});
    try {
      if (editingId) await update.mutateAsync({ id: editingId, values: payload });
      else await add.mutateAsync(payload);
      setOpen(false);
      toast({ title: editingId ? "Saved" : "Added" });
    } catch (e: any) {
      toast({ title: "Could not save", description: e.message, variant: "destructive" });
    }
  };

  if (!caseId) return null;

  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        {enableFileUpload && (
          <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
            <Upload className="w-4 h-4 mr-2" /> Upload document
          </Button>
        )}
        <input
          ref={fileRef}
          className="hidden"
          type="file"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              openNew();
              void uploadFile(file);
            }
            e.currentTarget.value = "";
          }}
        />
        <Button onClick={openNew} size="sm">
          <Plus className="w-4 h-4 mr-2" /> {addLabel}
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3"><Skeleton className="h-20 w-full" /><Skeleton className="h-20 w-full" /></div>
      ) : items.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-sm text-muted-foreground">{emptyMessage}</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {items.map((item: any) => (
            <Card key={item.id} className="transition-colors hover:border-primary/40">
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground break-words">
                      {prefixLabel?.(item) && <span className="text-primary font-mono text-xs mr-2">{prefixLabel(item)}</span>}
                      {item[titleField] || "Untitled"}
                    </p>
                    {subtitleFields.length > 0 && <p className="text-sm text-muted-foreground mt-1 break-words">{subtitleFields.map((k) => item[k]).filter(Boolean).join(" · ")}</p>}
                    {item.file_name && (
                      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <FileText className="w-3.5 h-3.5" />
                        <span className="truncate">{item.file_name}</span>
                        {item.file_url && <a className="ml-auto inline-flex items-center gap-1 text-primary" href={item.file_url} target="_blank" rel="noreferrer"><Download className="w-3.5 h-3.5" /> Open</a>}
                      </div>
                    )}
                    {badgeFields.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {badgeFields.map((k) => item[k] ? (
                          <Badge key={k} variant="outline" className={k === "classification" ? classificationBadgeClass(item[k]) : ""}>
                            {fields.find((f) => f.key === k)?.options?.find((o) => o.value === item[k])?.label ?? String(item[k])}
                          </Badge>
                        ) : null)}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => setViewingItem(item)}><Eye className="w-4 h-4" /><span className="sr-only">View record</span></Button>
                    <Button variant="ghost" size="sm" onClick={() => openEdit(item)}><Pencil className="w-4 h-4" /><span className="sr-only">Edit</span></Button>
                    <Button variant="ghost" size="sm" onClick={() => remove.mutate(item.id)} aria-label="Remove"><Trash2 className="w-4 h-4 text-muted-foreground" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={Boolean(viewingItem)} onOpenChange={(next) => !next && setViewingItem(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewingItem?.[titleField] || "Record"}</DialogTitle>
            <DialogDescription>Record detail, provenance fields, and connections stored in this case.</DialogDescription>
          </DialogHeader>
          {viewingItem && (
            <div className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-3">
                {fields.filter((f) => viewingItem[f.key] !== null && viewingItem[f.key] !== undefined && viewingItem[f.key] !== "").map((f) => (
                  <div key={f.key} className="rounded-lg border p-3">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{f.label}</p>
                    <p className="text-sm text-foreground mt-1 whitespace-pre-wrap break-words">{f.type === "checkbox" ? (viewingItem[f.key] ? "Yes" : "No") : String(f.options?.find((o) => o.value === viewingItem[f.key])?.label ?? viewingItem[f.key])}</p>
                  </div>
                ))}
              </div>
              {table === "documents" && (
                <div className="rounded-lg border p-4">
                  <p className="text-sm font-medium flex items-center gap-2"><FileText className="h-4 w-4" />Packet status</p>
                  <p className="text-xs text-muted-foreground mt-1">{viewingItem.include_in_export === false ? "Excluded from packet exports by current setting." : "Included in packet exports when the Exhibit Index section is selected."}</p>
                </div>
              )}
              {(() => {
                const links = snapshot.links.filter((l: any) => l.from_id === viewingItem.id || l.to_id === viewingItem.id);
                const labelFor = (type: string, id: string) => {
                  const source: Record<string, any[]> = { event: snapshot.timeline, timeline: snapshot.timeline, document: snapshot.evidence, evidence: snapshot.evidence, issue: snapshot.issues, person: snapshot.people, organization: snapshot.organizations, communication: snapshot.communications, request: snapshot.requests, task: snapshot.record_gaps, note: snapshot.notes };
                  const row = source[type]?.find((r: any) => r.id === id);
                  return row?.title || row?.name || row?.subject || row?.request_title || "Linked record";
                };
                return <div className="space-y-2">
                  <p className="text-sm font-medium flex items-center gap-2"><Link2 className="h-4 w-4" />Connected records</p>
                  {links.length === 0 ? <p className="text-xs text-muted-foreground">No explicit relationships recorded yet.</p> : links.map((link: any) => {
                    const outgoing = link.from_id === viewingItem.id;
                    const otherType = outgoing ? link.to_type : link.from_type;
                    const otherId = outgoing ? link.to_id : link.from_id;
                    return <div key={link.id} className="rounded-lg border p-3 text-sm flex items-center gap-2"><span className="text-muted-foreground">{outgoing ? "This record" : labelFor(otherType, otherId)}</span><span className="text-primary text-xs">{link.relation}</span><span>{outgoing ? labelFor(otherType, otherId) : "This record"}</span></div>;
                  })}
                </div>;
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editingId ? "Edit entry" : addLabel}</DialogTitle><DialogDescription>Everything here stays private to your account. You can pause and come back.</DialogDescription></DialogHeader>
          <div className="space-y-4">
            {fields.map((f) => (
              <div key={f.key} className="space-y-1.5">
                <Label htmlFor={f.key}>{f.label}</Label>
                {f.type === "textarea" && <Textarea id={f.key} value={values[f.key] ?? ""} placeholder={f.placeholder} onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))} />}
                {(f.type === "text" || f.type === "date") && <Input id={f.key} type={f.type === "date" ? "date" : "text"} value={values[f.key] ?? ""} placeholder={f.placeholder} onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))} />}
                {f.type === "select" && <Select value={values[f.key] ?? ""} onValueChange={(val) => setValues((v) => ({ ...v, [f.key]: val }))}><SelectTrigger id={f.key}><SelectValue placeholder="Choose" /></SelectTrigger><SelectContent>{f.options?.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent></Select>}
                {f.type === "checkbox" && <div className="flex items-center gap-2"><Checkbox id={f.key} checked={Boolean(values[f.key])} onCheckedChange={(c) => setValues((v) => ({ ...v, [f.key]: Boolean(c) }))} /><span className="text-sm text-muted-foreground">{f.placeholder}</span></div>}
                {f.help && <p className="text-xs text-muted-foreground">{f.help}</p>}
              </div>
            ))}
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={save} disabled={add.isPending || update.isPending || uploading}>{uploading ? "Uploading…" : "Save"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
