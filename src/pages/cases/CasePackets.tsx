import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Download, Printer, FileText, RefreshCw, Save, Eye } from "lucide-react";
import { CaseWorkspaceLayout } from "@/components/case-workspace/CaseWorkspaceLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useCaseSnapshot } from "@/hooks/useCaseSnapshot";
import { useCases } from "@/hooks/useCases";
import { CLASSIFICATION_LABELS, exhibitLabel } from "@/lib/case/classification";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const sectionOptions = [
  { key: "overview", label: "Case overview" },
  { key: "issues", label: "Claims & issues" },
  { key: "timeline", label: "Chronology" },
  { key: "evidence", label: "Exhibit index" },
  { key: "people", label: "People & organizations" },
  { key: "communications", label: "Communications log" },
  { key: "requests", label: "Requests & deadlines" },
  { key: "relationships", label: "Record relationships" },
];

const esc = (value: unknown) => String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;");

export default function CasePackets() {
  const { id } = useParams();
  const { snapshot, isLoading } = useCaseSnapshot(id);
  const { cases } = useCases();
  const activeCase = cases.find((c) => c.id === id);
  const [title, setTitle] = useState("Attorney Case Packet");
  const [selected, setSelected] = useState<string[]>(sectionOptions.map((s) => s.key));
  const [savedPacketId, setSavedPacketId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [building, setBuilding] = useState(false);

  const exportEvidence = snapshot.evidence.filter((e) => e.include_in_export !== false);

  const provenance = () => ({
    schema_version: 1,
    generated_at: new Date().toISOString(),
    case_id: id,
    case_name: activeCase?.name ?? null,
    sections: selected.map((key) => {
      const sourceIds: Record<string, string[]> = {
        overview: id ? [id] : [],
        issues: snapshot.issues.map((r) => r.id),
        timeline: snapshot.timeline.map((r) => r.id),
        evidence: exportEvidence.map((r) => r.id),
        people: [...snapshot.people, ...snapshot.organizations].map((r) => r.id),
        communications: snapshot.communications.map((r) => r.id),
        requests: snapshot.requests.map((r) => r.id),
        relationships: snapshot.links.map((r) => r.id),
      };
      const labels: Record<string, string> = Object.fromEntries(sectionOptions.map((s) => [s.key, s.label]));
      return { key: key, label: labels[key] ?? key, record_type: key, record_ids: sourceIds[key] ?? [], record_count: (sourceIds[key] ?? []).length };
    }),
    totals: {
      issues: snapshot.issues.length,
      timeline: snapshot.timeline.length,
      exhibits: exportEvidence.length,
      people: snapshot.people.length,
      organizations: snapshot.organizations.length,
      communications: snapshot.communications.length,
      requests: snapshot.requests.length,
      relationships: snapshot.links.length,
    },
  });

  const provenanceRows = () => provenance().sections.map((s: any) => `<div class="item"><h3>${esc(s.label)}</h3><p class="meta">${s.record_count} source record${s.record_count === 1 ? "" : "s"}</p><p class="source-list">${s.record_ids.length ? s.record_ids.map((rid: string) => esc(rid)).join(" · ") : "No source records in this section."}</p></div>`).join("");

  useEffect(() => {
    setSavedPacketId(null);
  }, [id]);

  const toggle = (key: string) => setSelected((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]);

  const buildHtml = () => {
    const rows = (items: any[], render: (i: any) => string) => items.length
      ? items.map((i) => render(i).replace('<div class="item"', `<div class="item" data-record-id="${esc(i.id)}"`)).join("")
      : "<p class='empty'>Nothing recorded.</p>";
    const parts: string[] = [];
    if (selected.includes("overview")) parts.push(`<section><h2>Case overview</h2><p><strong>${esc(activeCase?.name)}</strong></p><p>${esc(activeCase?.description)}</p><p>${esc([activeCase?.county, activeCase?.state].filter(Boolean).join(", "))}</p></section>`);
    if (selected.includes("issues")) parts.push(`<section><h2>Claims &amp; issues</h2>${rows(snapshot.issues, (i) => `<div class="item"><h3>${esc(i.title)}</h3><p class="meta">${esc(CLASSIFICATION_LABELS[i.classification as keyof typeof CLASSIFICATION_LABELS] ?? "Unknown")} · ${esc(i.status)}</p><p>${esc(i.summary)}</p><p><strong>Supporting:</strong> ${esc(i.supporting_notes)}</p><p><strong>Still unknown:</strong> ${esc(i.missing_records)}</p></div>`)}</section>`);
    if (selected.includes("timeline")) parts.push(`<section><h2>Chronology</h2>${rows(snapshot.timeline, (t) => `<div class="item"><h3>${esc(t.event_date)} — ${esc(t.title)}</h3><p class="meta">${esc(CLASSIFICATION_LABELS[t.classification as keyof typeof CLASSIFICATION_LABELS] ?? "Unknown")}${t.category ? ` · ${esc(t.category)}` : ""}</p><p>${esc(t.description)}</p></div>`)}</section>`);
    if (selected.includes("evidence")) parts.push(`<section><h2>Exhibit index</h2>${rows(snapshot.evidence.filter((e) => e.include_in_export !== false), (e) => `<div class="item"><h3>${esc(exhibitLabel(e.exhibit_number))} — ${esc(e.title)}</h3><p class="meta">${esc(CLASSIFICATION_LABELS[e.classification as keyof typeof CLASSIFICATION_LABELS] ?? "Unknown")}${e.source ? ` · Source: ${esc(e.source)}` : ""}${e.document_date ? ` · ${esc(e.document_date)}` : ""}${e.review_status ? ` · Review: ${esc(e.review_status)}` : ""}</p><p>${esc(e.description)}</p>${e.file_name ? `<p class="meta">File: ${esc(e.file_name)}</p>` : ""}</div>`)}</section>`);
    if (selected.includes("people")) parts.push(`<section><h2>People &amp; organizations</h2>${rows([...snapshot.people, ...snapshot.organizations], (p) => `<div class="item"><h3>${esc(p.name)}</h3><p class="meta">${esc(p.role || p.org_type || p.organization || "")}</p></div>`)}</section>`);
    if (selected.includes("communications")) parts.push(`<section><h2>Communications log</h2>${rows(snapshot.communications, (c) => `<div class="item"><h3>${esc(c.occurred_on)} — ${esc(c.subject)}</h3><p class="meta">${esc(c.method)}${c.person ? ` · ${esc(c.person)}` : ""}</p><p>${esc(c.summary)}</p></div>`)}</section>`);
    if (selected.includes("requests")) parts.push(`<section><h2>Requests &amp; deadlines</h2>${rows(snapshot.requests, (r) => `<div class="item"><h3>${esc(r.request_title)}</h3><p class="meta">${esc(r.status)}${r.due_date ? ` · due ${esc(r.due_date)}` : ""}</p><p>${esc(r.description)}</p></div>`)}</section>`);
    if (selected.includes("relationships")) parts.push(`<section><h2>Record relationships</h2>${rows(snapshot.links, (l) => `<div class="item"><h3>${esc(l.from_type)} → ${esc(l.relation)} → ${esc(l.to_type)}</h3><p class="meta">${esc(l.from_id)} · ${esc(l.to_id)}</p></div>`)}</section>`);
    parts.push(`<section><h2>Packet provenance</h2><p class="notice">This audit trail records which case records were included when this packet was generated. It does not establish the truth of any record or legal conclusion.</p>${provenanceRows()}</section>`);
    return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(title || activeCase?.name || "Case packet")}</title><style>body{font-family:Georgia,serif;max-width:800px;margin:40px auto;padding:0 24px;color:#241c17;line-height:1.55}h1{font-size:28px;margin-bottom:4px}h2{font-size:19px;border-bottom:1px solid #d9cfc4;padding-bottom:6px;margin-top:36px}h3{font-size:15px;margin:0 0 2px}.meta{font-size:12px;color:#7a6a5d;margin:0 0 6px}.item{margin:0 0 18px}.empty{color:#7a6a5d;font-style:italic}.source-list{font-family:monospace;font-size:10px;word-break:break-all}.notice{background:#f6f1ea;padding:14px;border-radius:8px;font-size:12px;color:#5b4b40}</style></head><body><h1>${esc(title || activeCase?.name || "Case packet")}</h1><p class="meta">Case: ${esc(activeCase?.name)} · Prepared ${esc(new Date().toLocaleDateString())}</p><p class="notice">Educational record only. Items retain the classification entered in the workspace. This packet does not make a legal finding or provide legal advice.</p>${parts.join("")}</body></html>`;
  };

  const savePacket = async () => {
    if (!id || !activeCase) return;
    setSaving(true);
    try {
      const generatedHtml = buildHtml();
      const manifest = provenance();
      const payload = { title: title || "Attorney Case Packet", packet_type: "attorney", sections: selected, options: { include_exhibits: true }, content: { generated_at: manifest.generated_at, section_count: selected.length, html: generatedHtml, provenance: manifest } };
      if (savedPacketId) {
        const { error } = await supabase.from("case_packets").update(payload).eq("id", savedPacketId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("case_packets").insert({ ...payload, case_id: id, user_id: activeCase.user_id }).select("id").single();
        if (error) throw error;
        setSavedPacketId(data.id);
      }
      toast({ title: "Packet saved" });
    } catch (e: any) {
      toast({ title: "Could not save packet", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const download = async () => {
    setBuilding(true);
    const blob = new Blob([buildHtml()], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(title || "case-packet").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.html`;
    a.click();
    URL.revokeObjectURL(url);
    setBuilding(false);
    toast({ title: "Packet downloaded" });
  };

  const print = () => {
    const w = window.open("", "_blank");
    if (!w) return toast({ title: "Your browser blocked the print window", variant: "destructive" });
    w.document.write(buildHtml()); w.document.close(); w.focus(); w.print();
  };

  return <CaseWorkspaceLayout title="Packet Builder & Export Center" description="Assemble a clean, attorney-ready case packet from the records already in this case.">
    {isLoading ? <Skeleton className="h-64 w-full" /> : <div className="space-y-5">
      <Card><CardContent className="p-5 space-y-4">
        <div><Label htmlFor="packet-title">Packet title</Label><Input id="packet-title" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div className="flex items-center gap-2"><FileText className="h-4 w-4 text-muted-foreground" /><h2 className="font-serif text-lg">Build the packet</h2></div>
        <div className="grid sm:grid-cols-2 gap-3">{sectionOptions.map((s) => <div key={s.key} className="flex items-center gap-2"><Checkbox id={`sec-${s.key}`} checked={selected.includes(s.key)} onCheckedChange={() => toggle(s.key)} /><Label htmlFor={`sec-${s.key}`} className="font-normal cursor-pointer">{s.label}</Label></div>)}</div>
        <p className="text-xs text-muted-foreground">Exhibits marked for export are included in stable exhibit-number order. Classifications and review status carry through as recorded.</p>
        <div className="flex flex-wrap gap-3 pt-1">
          <Button onClick={savePacket} disabled={selected.length === 0 || saving}><Save className="h-4 w-4 mr-2" />{saving ? "Saving…" : "Save packet"}</Button>
          <Button onClick={download} disabled={selected.length === 0 || building}><Download className="h-4 w-4 mr-2" />{building ? "Building…" : "Export packet"}</Button>
          <Button variant="outline" onClick={print} disabled={selected.length === 0}><Printer className="h-4 w-4 mr-2" />Print / save as PDF</Button>
        </div>
      </CardContent></Card>
      <Card><CardContent c
      <Card><CardContent className="p-5"><div className="flex items-center gap-2 mb-2"><Eye className="h-4 w-4 text-primary" /><h2 className="font-serif text-lg">Source tracing</h2></div><p className="text-xs text-muted-foreground mb-4">Review the exact case-record IDs represented in each selected section before saving or exporting.</p><div className="space-y-2">{provenance().sections.map((s: any) => <div key={s.key} className="rounded-lg border p-3"><div className="flex justify-between gap-3"><span className="font-medium text-sm">{s.label}</span><span className="text-xs text-muted-foreground">{s.record_count} source record{s.record_count === 1 ? "" : "s"}</span></div><p className="mt-1 text-[11px] font-mono break-all text-muted-foreground">{s.record_ids.length ? s.record_ids.join(" · ") : "No source records"}</p></div>)}</div></CardContent></Card>
    </div>}
  </CaseWorkspaceLayout>;
}
