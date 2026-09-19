import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileCheck2,
  FileText,
  FolderOpen,
  Info,
  Landmark,
  Lock,
  RefreshCw,
  Scale,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useCases } from "@/hooks/useCases";
import { useCaseSnapshot } from "@/hooks/useCaseSnapshot";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type PacketType = "complaint" | "complaint-ifp" | "answer" | "motion" | "declaration";

const packetTypes: { id: PacketType; title: string; description: string; icon: React.ElementType }[] = [
  { id: "complaint", title: "Civil Complaint Packet", description: "Organize the information commonly used to start a civil case.", icon: FileText },
  { id: "complaint-ifp", title: "Complaint + In Forma Pauperis", description: "Prepare a complaint together with guided fee-waiver information.", icon: ShieldCheck },
  { id: "answer", title: "Answer / Response Packet", description: "Organize a response to a complaint or other initiating document.", icon: Scale },
  { id: "motion", title: "Motion + Declaration", description: "Prepare a motion and supporting factual declaration.", icon: Landmark },
  { id: "declaration", title: "Declaration", description: "Build a numbered factual declaration from your case record.", icon: UserRound },
];

const packetLabels: Record<PacketType, string> = {
  complaint: "Civil Complaint",
  "complaint-ifp": "Civil Complaint + In Forma Pauperis",
  answer: "Answer / Response",
  motion: "Motion + Declaration",
  declaration: "Declaration",
};

const esc = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function CaseDataSummary({ snapshot, caseName }: { snapshot: ReturnType<typeof useCaseSnapshot>["snapshot"]; caseName?: string }) {
  const counts = [
    ["Timeline", snapshot.timeline.length],
    ["Evidence", snapshot.evidence.length],
    ["Issues", snapshot.issues.length],
    ["People", snapshot.people.length + snapshot.organizations.length],
    ["Communications", snapshot.communications.length],
    ["Requests", snapshot.requests.length],
  ];

  return (
    <div className="rounded-xl border border-border bg-secondary/30 p-4">
      <div className="flex items-center gap-2 mb-3">
        <FolderOpen className="h-4 w-4 text-gold" />
        <p className="text-sm font-medium text-foreground">{caseName || "Selected case"}</p>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {counts.map(([label, count]) => (
          <div key={String(label)} className="rounded-lg bg-background border border-border/60 p-2.5 text-center">
            <p className="font-serif text-lg">{count}</p>
            <p className="text-[10px] text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function buildPacketHtml(
  packetType: PacketType,
  title: string,
  caseName: string,
  fields: Record<string, string>,
  snapshot: ReturnType<typeof useCaseSnapshot>["snapshot"],
) {
  const timeline = snapshot.timeline
    .map((item: any, i: number) => `<li><strong>${esc(item.event_date || "Date unknown")} — ${esc(item.title)}</strong><br>${esc(item.description)}</li>`)
    .join("");
  const issues = snapshot.issues
    .map((item: any) => `<li><strong>${esc(item.title)}</strong><br>${esc(item.summary)}</li>`)
    .join("");
  const exhibits = snapshot.evidence
    .filter((item: any) => item.include_in_export !== false)
    .map((item: any) => `<li><strong>${esc(item.title)}</strong> — ${esc(item.source || "Source not recorded")}</li>`)
    .join("");

  const mainSections = `
    <section><h2>Case information</h2>
      <p><strong>Case:</strong> ${esc(caseName)}</p>
      <p><strong>Court:</strong> ${esc(fields.court)}</p>
      <p><strong>Case number:</strong> ${esc(fields.caseNumber)}</p>
      <p><strong>County / District:</strong> ${esc(fields.location)}</p>
      <p><strong>Plaintiff / Petitioner:</strong> ${esc(fields.plaintiff)}</p>
      <p><strong>Defendant / Respondent:</strong> ${esc(fields.defendant)}</p>
    </section>
    <section><h2>Factual statement</h2><p>${esc(fields.facts)}</p></section>
  `;

  const answer = packetType === "answer" ? `
    <section><h2>Response</h2><p><strong>Admissions:</strong> ${esc(fields.admissions)}</p><p><strong>Denials:</strong> ${esc(fields.denials)}</p><p><strong>Insufficient information:</strong> ${esc(fields.insufficient)}</p><p><strong>Other defenses / responses:</strong> ${esc(fields.defenses)}</p></section>
  ` : "";

  const motion = packetType === "motion" ? `
    <section><h2>Motion</h2><p><strong>Relief requested:</strong> ${esc(fields.relief)}</p><p>${esc(fields.motionGrounds)}</p></section>
    <section><h2>Supporting declaration</h2><p>${esc(fields.declaration)}</p></section>
  ` : "";

  const declaration = packetType === "declaration" ? `
    <section><h2>Declaration</h2><p>${esc(fields.declaration)}</p></section>
  ` : "";

  const ifp = packetType === "complaint-ifp" ? `
    <section><h2>In Forma Pauperis / Fee Waiver Information</h2>
      <p><strong>Employment / income:</strong> ${esc(fields.income)}</p>
      <p><strong>Public benefits:</strong> ${esc(fields.benefits)}</p>
      <p><strong>Household / dependents:</strong> ${esc(fields.household)}</p>
      <p><strong>Assets:</strong> ${esc(fields.assets)}</p>
      <p><strong>Monthly expenses:</strong> ${esc(fields.expenses)}</p>
      <p><strong>Other financial obligations:</strong> ${esc(fields.obligations)}</p>
    </section>
  ` : "";

  return `<!doctype html><html><head><meta charset="utf-8"><title>${esc(title)}</title><style>
    @page{margin:0.7in}body{font-family:Georgia,serif;color:#241c17;line-height:1.55;max-width:760px;margin:0 auto}
    h1{font-size:26px;margin-bottom:4px}h2{font-size:18px;border-bottom:1px solid #d9cfc4;padding-bottom:6px;margin-top:28px}
    p,li{font-size:12px}.meta{font-size:10px;color:#6f6258}.notice{padding:12px;background:#f6f1ea;border-radius:6px;font:11px Arial,sans-serif}
    li{margin-bottom:8px}.signature{margin-top:42px}.line{border-top:1px solid #333;width:280px;margin-top:40px}
  </style></head><body>
    <h1>${esc(title)}</h1><p class="meta">Prepared from Decoded Justice case data · ${esc(new Date().toLocaleDateString())}</p>
    <div class="notice">Draft generated from information available in the selected case. Review every field and verify the current court requirements and official forms before filing.</div>
    ${mainSections}${answer}${motion}${declaration}${ifp}
    <section><h2>Case record available to you</h2><h3>Timeline</h3><ul>${timeline || "<li>No timeline entries recorded.</li>"}</ul><h3>Claims & issues</h3><ul>${issues || "<li>No issues recorded.</li>"}</ul><h3>Exhibits</h3><ul>${exhibits || "<li>No exhibits marked for export.</li>"}</ul></section>
    <section class="signature"><h2>Signature</h2><p>${esc(fields.signature)}</p><div class="line"></div><p>Signature</p><p>${esc(fields.printedName)} · ${esc(fields.signatureDate)}</p></section>
  </body></html>`;
}

export default function StarterLegalTemplates() {
  const { user } = useAuth();
  const { cases, isLoading: casesLoading } = useCases();
  const [selectedCaseId, setSelectedCaseId] = useState("");
  const [packetType, setPacketType] = useState<PacketType>("complaint-ifp");
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("Pro Se Filing Packet");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const activeCase = cases.find((item) => item.id === selectedCaseId);
  const { snapshot, isLoading: snapshotLoading } = useCaseSnapshot(selectedCaseId || undefined);

  const imported = useMemo(() => {
    if (!activeCase) return {};
    const firstPerson = snapshot.people[0];
    const firstOrg = snapshot.organizations[0];
    return {
      court: [activeCase.county, activeCase.state].filter(Boolean).join(", "),
      location: [activeCase.county, activeCase.state].filter(Boolean).join(", "),
      plaintiff: firstPerson?.name || "",
      defendant: firstOrg?.name || "",
      facts: snapshot.timeline.map((item: any) => `${item.event_date || "Date unknown"} — ${item.title}: ${item.description || ""}`).join("\n\n"),
    };
  }, [activeCase, snapshot]);

  const value = (key: string) => fields[key] ?? imported[key as keyof typeof imported] ?? "";
  const setValue = (key: string, next: string) => setFields((prev) => ({ ...prev, [key]: next }));

  const requiredKeys = ["court", "plaintiff", "defendant", "facts", "printedName", "signatureDate"];
  const missing = requiredKeys.filter((key) => !value(key).trim());
  if (packetType === "complaint-ifp") {
    ["income", "household", "expenses"].forEach((key) => { if (!value(key).trim()) missing.push(key); });
  }

  const nextStep = () => setStep((current) => Math.min(4, current + 1));
  const previousStep = () => setStep((current) => Math.max(1, current - 1));

  const generate = async () => {
    if (!activeCase) return;
    setSaving(true);
    try {
      const html = buildPacketHtml(packetType, title || packetLabels[packetType], activeCase.name, Object.fromEntries(
        [...new Set([...Object.keys(fields), ...Object.keys(imported)])].map((key) => [key, value(key)])
      ), snapshot);

      const { error } = await supabase.from("case_packets").insert({
        case_id: activeCase.id,
        user_id: activeCase.user_id,
        title: title || packetLabels[packetType],
        packet_type: packetType,
        sections: [packetLabels[packetType], "Case information", "Factual statement", "Case record"],
        options: { source: "case_builder", generated_from_case: true },
        content: { generated_at: new Date().toISOString(), html },
      });
      if (error) throw error;

      const win = window.open("", "_blank");
      if (!win) throw new Error("Your browser blocked the packet window. Allow pop-ups and try again.");
      win.document.write(html);
      win.document.close();
      win.focus();
      setTimeout(() => win.print(), 250);
      toast({ title: "Packet ready", description: "Review the document and choose Save as PDF in the print dialog." });
    } catch (error: any) {
      toast({ title: "Could not generate packet", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <main className="container max-w-6xl px-6 py-10 sm:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <p className="text-[10px] uppercase tracking-[0.22em] text-gold mb-3">Pro Se Templates</p>
            <h1 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight text-foreground">Pro Se Templates & Packet Builder</h1>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed max-w-3xl">
              Build documents from information you already entered in your Case Workspace. Decoded Justice can import available case information, show you what is missing, let you review everything, and generate a printable filing packet.
            </p>
          </div>

          <Card className="mb-8 border-primary/20">
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <div className="text-sm text-muted-foreground leading-relaxed">
                  <p className="font-medium text-foreground mb-1">Important</p>
                  <p>These are self-help drafting tools. A generated document is not automatically an official court form. Court requirements, deadlines, filing procedures, service requirements, and fee-waiver rules vary. Verify the current requirements and official forms for the court handling your case.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {!user ? (
            <Card className="mb-8">
              <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-serif text-xl">Use your Case Builder data</h2>
                  <p className="text-sm text-muted-foreground mt-1">Sign in to connect an existing case and prefill the packet from your case record.</p>
                </div>
                <Button asChild><Link to="/auth?redirect=/legal-templates">Sign in to use a case <ArrowRight className="h-4 w-4 ml-2" /></Link></Button>
              </CardContent>
            </Card>
          ) : null}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
            {packetTypes.map((packet) => {
              const Icon = packet.icon;
              const active = packetType === packet.id;
              return (
                <button key={packet.id} type="button" onClick={() => { setPacketType(packet.id); setStep(1); setTitle(packet.title); }}
                  className={`text-left rounded-xl border p-5 transition-colors ${active ? "border-primary bg-accent-soft" : "border-border bg-card hover:bg-secondary/40"}`}>
                  <Icon className="h-5 w-5 text-gold mb-4" />
                  <h2 className="font-serif text-lg text-foreground">{packet.title}</h2>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{packet.description}</p>
                </button>
              );
            })}
          </div>

          <div className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
            {[["1", "Choose case"], ["2", "Review data"], ["3", "Complete"], ["4", "Generate"]].map(([n, label], index) => (
              <div key={n} className="flex items-center gap-2">
                <span className={`h-7 w-7 rounded-full flex items-center justify-center border ${step >= Number(n) ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border"}`}>{n}</span>
                <span className="hidden sm:inline">{label}</span>
                {index < 3 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />}
              </div>
            ))}
          </div>

          <Card>
            <CardHeader><CardTitle className="font-serif text-2xl">{packetLabels[packetType]}</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              {step === 1 && (
                <>
                  <div>
                    <Label>Case to use</Label>
                    {user ? (
                      <Select value={selectedCaseId} onValueChange={setSelectedCaseId}>
                        <SelectTrigger className="mt-2"><SelectValue placeholder={casesLoading ? "Loading cases…" : "Choose a case"} /></SelectTrigger>
                        <SelectContent>
                          {cases.map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-sm text-muted-foreground mt-2">Sign in to connect your Case Builder.</p>
                    )}
                  </div>
                  {activeCase && <CaseDataSummary snapshot={snapshot} caseName={activeCase.name} />}
                  <div className="flex justify-end"><Button onClick={nextStep} disabled={!activeCase}>Continue <ChevronRight className="h-4 w-4 ml-2" /></Button></div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="flex items-start gap-3 rounded-lg bg-secondary/40 p-4">
                    <RefreshCw className="h-4 w-4 text-gold mt-0.5" />
                    <div><p className="text-sm font-medium">Information imported from your case</p><p className="text-xs text-muted-foreground mt-1">Review each field. Imported information is a starting point, not a legal conclusion.</p></div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div><Label>Court</Label><Input className="mt-1.5" value={value("court")} onChange={(e) => setValue("court", e.target.value)} /></div>
                    <div><Label>Case number</Label><Input className="mt-1.5" value={value("caseNumber")} onChange={(e) => setValue("caseNumber", e.target.value)} placeholder="If already assigned" /></div>
                    <div><Label>Plaintiff / Petitioner</Label><Input className="mt-1.5" value={value("plaintiff")} onChange={(e) => setValue("plaintiff", e.target.value)} /></div>
                    <div><Label>Defendant / Respondent</Label><Input className="mt-1.5" value={value("defendant")} onChange={(e) => setValue("defendant", e.target.value)} /></div>
                    <div className="sm:col-span-2"><Label>County / District</Label><Input className="mt-1.5" value={value("location")} onChange={(e) => setValue("location", e.target.value)} /></div>
                    <div className="sm:col-span-2"><Label>Factual summary</Label><Textarea className="mt-1.5 min-h-36" value={value("facts")} onChange={(e) => setValue("facts", e.target.value)} /></div>
                  </div>
                  <div className="flex justify-between"><Button variant="outline" onClick={previousStep}><ChevronLeft className="h-4 w-4 mr-2" />Back</Button><Button onClick={nextStep}>Continue <ChevronRight className="h-4 w-4 ml-2" /></Button></div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {packetType === "answer" && <>
                      <div className="sm:col-span-2"><Label>Admissions</Label><Textarea className="mt-1.5" value={value("admissions")} onChange={(e) => setValue("admissions", e.target.value)} /></div>
                      <div className="sm:col-span-2"><Label>Denials</Label><Textarea className="mt-1.5" value={value("denials")} onChange={(e) => setValue("denials", e.target.value)} /></div>
                      <div className="sm:col-span-2"><Label>Insufficient information</Label><Textarea className="mt-1.5" value={value("insufficient")} onChange={(e) => setValue("insufficient", e.target.value)} /></div>
                      <div className="sm:col-span-2"><Label>Other defenses / responses</Label><Textarea className="mt-1.5" value={value("defenses")} onChange={(e) => setValue("defenses", e.target.value)} /></div>
                    </>}
                    {(packetType === "motion" || packetType === "declaration") && <>
                      {packetType === "motion" && <><div className="sm:col-span-2"><Label>What are you asking the court to do?</Label><Textarea className="mt-1.5" value={value("relief")} onChange={(e) => setValue("relief", e.target.value)} /></div><div className="sm:col-span-2"><Label>Grounds / explanation</Label><Textarea className="mt-1.5" value={value("motionGrounds")} onChange={(e) => setValue("motionGrounds", e.target.value)} /></div></>}
                      <div className="sm:col-span-2"><Label>Declaration</Label><Textarea className="mt-1.5 min-h-40" value={value("declaration")} onChange={(e) => setValue("declaration", e.target.value)} /></div>
                    </>}
                    {packetType === "complaint-ifp" && <>
                      <div><Label>Employment / income</Label><Textarea className="mt-1.5" value={value("income")} onChange={(e) => setValue("income", e.target.value)} /></div>
                      <div><Label>Public benefits</Label><Textarea className="mt-1.5" value={value("benefits")} onChange={(e) => setValue("benefits", e.target.value)} /></div>
                      <div><Label>Household / dependents</Label><Textarea className="mt-1.5" value={value("household")} onChange={(e) => setValue("household", e.target.value)} /></div>
                      <div><Label>Assets</Label><Textarea className="mt-1.5" value={value("assets")} onChange={(e) => setValue("assets", e.target.value)} /></div>
                      <div><Label>Monthly expenses</Label><Textarea className="mt-1.5" value={value("expenses")} onChange={(e) => setValue("expenses", e.target.value)} /></div>
                      <div><Label>Other financial obligations</Label><Textarea className="mt-1.5" value={value("obligations")} onChange={(e) => setValue("obligations", e.target.value)} /></div>
                    </>}
                    <div className="sm:col-span-2"><Separator /><p className="text-xs text-muted-foreground mt-4">Use your own words and verify every statement before filing. The tool does not decide what facts or claims you should assert.</p></div>
                  </div>
                  <div className="flex justify-between"><Button variant="outline" onClick={previousStep}><ChevronLeft className="h-4 w-4 mr-2" />Back</Button><Button onClick={nextStep}>Review <FileCheck2 className="h-4 w-4 ml-2" /></Button></div>
                </>
              )}

              {step === 4 && (
                <>
                  <div className="space-y-4">
                    <div><Label>Packet title</Label><Input className="mt-1.5" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
                    {activeCase && <CaseDataSummary snapshot={snapshot} caseName={activeCase.name} />}
                    <div className="rounded-lg border border-border p-4">
                      <p className="text-sm font-medium mb-2">Review status</p>
                      {missing.length === 0 ? (
                        <p className="text-sm text-foreground flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" />Required drafting information is present.</p>
                      ) : (
                        <div><p className="text-sm text-foreground">Still needs attention:</p><p className="text-xs text-muted-foreground mt-1">{missing.join(", ")}</p></div>
                      )}
                    </div>
                    <div className="rounded-lg bg-secondary/40 p-4 text-sm text-muted-foreground">
                      <p className="font-medium text-foreground mb-1">Before filing</p>
                      <p>Verify the court, case number, party names, allegations or responses, deadlines, service requirements, required official forms, signatures, and attachments.</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button variant="outline" onClick={previousStep}><ChevronLeft className="h-4 w-4 mr-2" />Back</Button>
                      <Button onClick={generate} disabled={!activeCase || snapshotLoading || saving}><FileText className="h-4 w-4 mr-2" />{saving ? "Generating…" : "Generate PDF"}</Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <section className="mt-12">
            <div className="flex items-end justify-between gap-4 mb-5">
              <div><p className="text-[10px] uppercase tracking-[0.22em] text-gold mb-2">Official resources</p><h2 className="font-serif text-2xl sm:text-3xl">Verify before filing</h2></div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <a href="https://www.courts.wa.gov/forms/?fa=forms.static&staticID=14" target="_blank" rel="noreferrer" className="rounded-xl border border-border bg-card p-5 hover:bg-secondary/40 transition-colors"><p className="font-serif text-lg">Washington Courts Forms</p><p className="text-xs text-muted-foreground mt-1">Official Washington State court forms and instructions.</p></a>
              <a href="https://www.uscourts.gov/forms-rules/forms/civil-pro-se-forms" target="_blank" rel="noreferrer" className="rounded-xl border border-border bg-card p-5 hover:bg-secondary/40 transition-colors"><p className="font-serif text-lg">U.S. Courts Civil Pro Se Forms</p><p className="text-xs text-muted-foreground mt-1">Federal civil forms for people representing themselves.</p></a>
              <a href="https://www.wawd.uscourts.gov/representing-yourself-pro-se" target="_blank" rel="noreferrer" className="rounded-xl border border-border bg-card p-5 hover:bg-secondary/40 transition-colors"><p className="font-serif text-lg">Western District of Washington — Pro Se</p><p className="text-xs text-muted-foreground mt-1">Local federal information for people representing themselves.</p></a>
              <a href="https://www.wawd.uscourts.gov/court-forms#Pro%20Se" target="_blank" rel="noreferrer" className="rounded-xl border border-border bg-card p-5 hover:bg-secondary/40 transition-colors"><p className="font-serif text-lg">Western District Court Forms</p><p className="text-xs text-muted-foreground mt-1">Federal court forms, including pro se materials.</p></a>
            </div>
          </section>

          <div className="mt-8 rounded-xl border border-border bg-secondary/20 p-5 flex items-start gap-3">
            <Lock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">Case information is used to prefill this packet when you select a case. Review imported information before generating a document. Decoded Justice does not determine whether a legal claim is valid or whether a filing should be made.</p>
          </div>
        </div>
      </main>
    </Layout>
  );
}
