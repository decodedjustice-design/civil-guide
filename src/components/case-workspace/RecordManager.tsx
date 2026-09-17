import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useCaseCollection } from "@/hooks/useCases";
import { classificationBadgeClass } from "@/lib/case/classification";
import { toast } from "@/hooks/use-toast";

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
  addLabel: string;
  emptyMessage: string;
}

const emptyValues = (fields: FieldConfig[]) =>
  fields.reduce<Record<string, any>>((acc, f) => {
    acc[f.key] = f.defaultValue ?? (f.type === "checkbox" ? false : "");
    return acc;
  }, {});

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
}: RecordManagerProps) {
  const { items, isLoading, add, update, remove } = useCaseCollection<any>(table, caseId, orderBy);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, any>>(emptyValues(fields));

  const openNew = () => {
    setEditingId(null);
    setValues(emptyValues(fields));
    setOpen(true);
  };

  const openEdit = (item: any) => {
    setEditingId(item.id);
    setValues(
      fields.reduce<Record<string, any>>((acc, f) => {
        acc[f.key] = item[f.key] ?? (f.type === "checkbox" ? false : "");
        return acc;
      }, {})
    );
    setOpen(true);
  };

  const save = async () => {
    const missing = fields.find((f) => f.required && !String(values[f.key] ?? "").trim());
    if (missing) {
      toast({ title: `${missing.label} is needed`, variant: "destructive" });
      return;
    }
    const payload = fields.reduce<Record<string, any>>((acc, f) => {
      const raw = values[f.key];
      acc[f.key] = f.type === "checkbox" ? Boolean(raw) : raw === "" ? null : raw;
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
      <div className="flex justify-end">
        <Button onClick={openNew} size="sm">
          <Plus className="w-4 h-4 mr-2" /> {addLabel}
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            {emptyMessage}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((item: any) => (
            <Card key={item.id} className="transition-colors hover:border-primary/40">
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground break-words">
                      {item[titleField] || "Untitled"}
                    </p>
                    {subtitleFields.length > 0 && (
                      <p className="text-sm text-muted-foreground mt-1 break-words">
                        {subtitleFields
                          .map((k) => item[k])
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    )}
                    {badgeFields.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {badgeFields.map((k) =>
                          item[k] ? (
                            <Badge
                              key={k}
                              variant="outline"
                              className={
                                k === "classification" ? classificationBadgeClass(item[k]) : ""
                              }
                            >
                              {fields.find((f) => f.key === k)?.options?.find(
                                (o) => o.value === item[k]
                              )?.label ?? String(item[k])}
                            </Badge>
                          ) : null
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>
                      <Pencil className="w-4 h-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => remove.mutate(item.id)}
                      aria-label="Remove"
                    >
                      <Trash2 className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit entry" : addLabel}</DialogTitle>
            <DialogDescription>
              Everything here stays private to your account. You can pause and come back.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {fields.map((f) => (
              <div key={f.key} className="space-y-1.5">
                <Label htmlFor={f.key}>{f.label}</Label>
                {f.type === "textarea" && (
                  <Textarea
                    id={f.key}
                    value={values[f.key] ?? ""}
                    placeholder={f.placeholder}
                    onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                  />
                )}
                {(f.type === "text" || f.type === "date") && (
                  <Input
                    id={f.key}
                    type={f.type === "date" ? "date" : "text"}
                    value={values[f.key] ?? ""}
                    placeholder={f.placeholder}
                    onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                  />
                )}
                {f.type === "select" && (
                  <Select
                    value={values[f.key] ?? ""}
                    onValueChange={(val) => setValues((v) => ({ ...v, [f.key]: val }))}
                  >
                    <SelectTrigger id={f.key}>
                      <SelectValue placeholder="Choose" />
                    </SelectTrigger>
                    <SelectContent>
                      {f.options?.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {f.type === "checkbox" && (
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={f.key}
                      checked={Boolean(values[f.key])}
                      onCheckedChange={(c) => setValues((v) => ({ ...v, [f.key]: Boolean(c) }))}
                    />
                    <span className="text-sm text-muted-foreground">{f.placeholder}</span>
                  </div>
                )}
                {f.help && <p className="text-xs text-muted-foreground">{f.help}</p>}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save} disabled={add.isPending || update.isPending}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
