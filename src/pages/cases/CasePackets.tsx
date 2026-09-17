import { useState } from "react";
import { useParams } from "react-router-dom";
import { Download, Printer, FileText } from "lucide-react";
import { CaseWorkspaceLayout } from "@/components/case-workspace/CaseWorkspaceLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useCaseSnapshot } from "@/hooks/useCaseSnapshot";
import { useCases } from "@/hooks/useCases";
import { CLASSIFICATION_LABELS, exhibitLabel } from "@/lib/case/classification";
import { toast } from "@/hooks/use-toast";

const sectionOptions = [
  { key: "overview", label: "Case overview" },
  { key: "issues", label: "Claims & issues" },
  { key: "timeline", label: "Chronology" },
  { key: "evidence", label: "Exhibit index" },
  { key: "people", label: "People & organizations" },
  { key: "communications", label: "Communications log" },
  { key: "requests", label: "Requests & deadlines" },
];

const esc = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export default function CasePackets() {
  const { id } = useParams();
  const { snapshot, isLoading } = useCaseSnapshot(id);
  const { cases } = useCases();
  const activeCase = cases.find((c) => c.id === id);
  const [selected, setSelected] = useState<string[]>(sectionOptions.map((s) => s.key));

  const toggle = (key: string) =>
    setSelected((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

  const buildHtml = () => {
    const rows = (items: any[], render: (i: any) => string) =>
      items.length ? items.map(render).join("") : "<p class='empty'>Nothing recorded.</p>";

    const parts: string[] = [];
    if (selected.includes("overview")) {
      parts.push(`<section><h2>Case overview</h2>
        <p><strong>${esc(activeCase?.name)}</strong></p>
        <p>${esc(activeCase?.description)}</p>
        <p>${esc([activeCase?.county, activeCase?.state].filter(Boolean).join(", "))}</p></section>`);
    }
    if (selected.includes("issues")) {
      parts.push(`<section><h2>Claims &amp; issues</h2>${rows(
        snapshot.issues,
        (i) =>
          `<div class="item"><h3>${esc(i.title)}</h3><p class="meta">${esc(
            CLASSIFICATION_LABELS[i.classification as keyof typeof CLASSIFICATION_LABELS] ?? "Unknown"
          )} · ${esc(i.status)}</p><p>${esc(i.summary)}</p>
          <p><em>Still unknown:</em> ${esc(i.missing_facts)}</p></div>`
      )}</section>`);
    }
    if (selected.includes("timeline")) {
      parts.push(`<section><h2>Chronology</h2>${rows(
        snapshot.timeline,
        (t) =>
          `<div class="item"><h3>${esc(t.event_date)} — ${esc(t.title)}</h3><p class="meta">${esc(
            CLASSIFICATION_LABELS[t.classification as keyof typeof CLASSIFICATION_LABELS] ?? "Unknown"
          )}${t.category ? ` · ${esc(t.category)}` : ""}</p><p>${esc(t.description)}</p></div>`
      )}</section>`);
    }
    if (selected.includes("evidence")) {
      parts.push(`<section><h2>Exhibit index</h2>${rows(
        snapshot.evidence.filter((e) => e.include_in_export !== false),
        (e) =>
          `<div class="item"><h3>${esc(exhibitLabel(e.exhibit_number))} — ${esc(e.title)}</h3>
          <p class="meta">${esc(
            CLASSIFICATION_LABELS[e.classification as keyof typeof CLASSIFICATION_LABELS] ?? "Unknown"
          )}${e.source ? ` · Source: ${esc(e.source)}` : ""}${
            e.document_date ? ` · ${esc(e.document_date)}` : ""
          }</p><p>${esc(e.description)}</p></div>`
      )}</section>`);
    }
    if (selected.includes("people")) {
      parts.push(`<section><h2>People &amp; organizations</h2>${rows(
        [...snapshot.people, ...snapshot.organizations],
        (p) => `<div class="item"><h3>${esc(p.name)}</h3><p class="meta">${esc(p.role || p.org_type || "")}</p></div>`
      )}</section>`);
    }
    if (selected.includes("communications")) {
      parts.push(`<section><h2>Communications log</h2>${rows(
        snapshot.communications,
        (c) =>
          `<div class="item"><h3>${esc(c.occurred_at)} — ${esc(c.subject)}</h3><p class="meta">${esc(
            c.method
          )}${c.with_name ? ` · ${esc(c.with_name)}` : ""}</p><p>${esc(c.summary)}</p></div>`
      )}</section>`);
    }
    if (selected.includes("requests")) {
      parts.push(`<section><h2>Requests &amp; deadlines</h2>${rows(
        snapshot.requests,
        (r) =>
          `<div class="item"><h3>${esc(r.title)}</h3><p class="meta">${esc(r.status)}${
            r.due_date ? ` · watching ${esc(r.due_date)}` : ""
          }</p><p>${esc(r.description)}</p></div>`
      )}</section>`);
    }

    return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<title>${esc(activeCase?.name ?? "Case packet")}</title>
<style>
body{font-family:Georgia,serif;max-width:800px;margin:40px auto;padding:0 24px;color:#241c17;line-height:1.55}
h1{font-size:26px;margin-bottom:4px}h2{font-size:19px;border-bottom:1px solid #d9cfc4;padding-bottom:6px;margin-top:36px}
h3{font-size:15px;margin:0 0 2px}.meta{font-size:12px;color:#7a6a5d;margin:0 0 6px}
.item{margin:0 0 18px}.empty{color:#7a6a5d;font-style:italic}
.notice{background:#f6f1ea;padding:14px;border-radius:8px;font-size:12px;color:#5b4b40}
</style></head><body>
<h1>${esc(activeCase?.name ?? "Case packet")}</h1>
<p class="meta">Prepared ${esc(new Date().toLocaleDateString())}</p>
<p class="notice">Educational record only. Items are marked Fact, Allegation, Inference, Disputed or Unknown as recorded by the person who prepared this. Nothing here is legal advice or a finding that any law was broken.</p>
${parts.join("")}
</body></html>`;
  };

  const download = () => {
    const blob = new Blob([buildHtml()], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(activeCase?.name ?? "case-packet").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Packet downloaded" });
  };

  const print = () => {
    const w = window.open("", "_blank");
    if (!w) {
      toast({ title: "Your browser blocked the print window", variant: "destructive" });
      return;
    }
    w.document.write(buildHtml());
    w.document.close();
    w.focus();
    w.print();
  };

  return (
    <CaseWorkspaceLayout
      title="Packets & exports"
      description="Build a clean copy of your record to print, save, or bring to an appointment."
    >
      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <div className="space-y-5">
          <Card>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                <h2 className="font-serif text-lg">What to include</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {sectionOptions.map((s) => (
                  <div key={s.key} className="flex items-center gap-2">
                    <Checkbox
                      id={`sec-${s.key}`}
                      checked={selected.includes(s.key)}
                      onCheckedChange={() => toggle(s.key)}
                    />
                    <Label htmlFor={`sec-${s.key}`} className="font-normal cursor-pointer">
                      {s.label}
                    </Label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Exhibits marked "sensitive" still appear; exhibits you excluded from packets are left
                out. Classifications carry through exactly as you set them.
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <Button onClick={download} disabled={selected.length === 0}>
                  <Download className="h-4 w-4 mr-2" /> Download packet
                </Button>
                <Button variant="outline" onClick={print} disabled={selected.length === 0}>
                  <Printer className="h-4 w-4 mr-2" /> Print / save as PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </CaseWorkspaceLayout>
  );
}
