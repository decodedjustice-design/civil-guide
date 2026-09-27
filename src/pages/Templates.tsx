import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  FileText,
  FolderOpen,
  Gavel,
  Landmark,
  PenLine,
  Plus,
  Send,
  ShieldCheck,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { EducationalUseBanner } from "@/components/pro-se/EducationalUseBanner";
import { ProSeToolkitFlow } from "@/components/pro-se/ProSeToolkitFlow";
import { useAuth } from "@/contexts/AuthContext";

type Draft = { id: string; title: string; notes: string; updatedAt: string };
type Submission = {
  id: string;
  document: string;
  where: string;
  method: string;
  date: string;
  signature: string;
  confirmation: string;
};

const templates = [
  ["Civil Complaint", "complaint", "Organize allegations, jurisdiction, parties, facts, claims, and requested relief."],
  ["Answer to Complaint", "answer", "Organize admissions, denials, insufficient-information responses, and defenses."],
  ["Counterclaim", "complaint", "Structure a counterclaim for separate review against the applicable rules."],
  ["Third-Party Complaint", "complaint", "Planning template for a third-party claim; verify authorization and procedure."],
  ["Motion to Dismiss", "motion", "Drafting framework for a motion raising a dismissal argument."],
  ["Motion for Summary Judgment", "motion", "Organize undisputed facts, supporting evidence, and requested relief."],
  ["Opposition / Response to Motion", "answer", "Organize the response, factual record, and supporting authority."],
  ["Reply in Support of Motion", "motion", "Organize a reply around issues raised in the response."],
  ["Motion for Protective Order", "motion", "Planning framework for discovery-protection relief."],
  ["Motion to Compel Discovery", "motion", "Organize discovery requests, responses, deficiencies, and requested relief."],
  ["Interrogatories", "motion", "Draft and track written interrogatories; verify applicable limits."],
  ["Request for Production", "motion", "Draft document requests and track response obligations."],
  ["Requests for Admission", "motion", "Draft admissions and track response deadlines."],
  ["Civil Subpoena Planning Sheet", "motion", "Plan recipient, records or testimony sought, service, and proof."],
  ["Declaration in Support of Filing", "declaration", "Convert firsthand facts into a numbered declaration for review."],
  ["Certificate of Service", "declaration", "Record how and when a filing was served."],
  ["Notice of Hearing", "declaration", "Planning checklist for hearing notice information."],
  ["Proposed Order", "motion", "Organize requested disposition for the court's review."],
  ["Civil Filing Fee Waiver", "complaint-ifp", "Collect financial information for review against the court's current fee-waiver form."],
  ["Notice of Appeal Planning", "declaration", "Track decision date, appellate deadline, notice, and filing proof."],
] as const;

const formSources = [
  ["Washington Courts Forms", "Official Washington State court forms and instructions.", "https://www.courts.wa.gov/forms/"],
  ["U.S. Courts Civil Pro Se Forms", "Federal civil forms for people representing themselves.", "https://www.uscourts.gov/forms-rules/forms/civil-pro-se-forms"],
  ["Western District of Washington Pro Se", "Local federal information for self-represented litigants.", "https://www.wawd.uscourts.gov/representing-yourself-pro-se"],
  ["Western District Court Forms", "Federal court forms, including pro se materials.", "https://www.wawd.uscourts.gov/court-forms"],
] as const;

const filingChecks = [
  "Confirm the correct tribunal, case number, and filing deadline.",
  "Check whether an official form is required instead of a self-help template.",
  "Confirm signature, verification, notarization, or agency-specific requirements.",
  "Confirm service method, recipients, and proof-of-service requirements.",
  "Save the submitted document and proof of submission.",
];

function load<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) || "") as T; } catch { return fallback; }
}

export default function Templates() {
  const { user } = useAuth();
  const [drafts, setDrafts] = useState<Draft[]>(() => load("decoded-justice-template-drafts", []));
  const [submissions, setSubmissions] = useState<Submission[]>(() => load("decoded-justice-submission-records", []));
  const [draftTitle, setDraftTitle] = useState("");
  const [draftNotes, setDraftNotes] = useState("");
  const [record, setRecord] = useState({ document: "", where: "", method: "e-file / portal", date: "", signature: "Electronic", confirmation: "" });

  const saveDraft = () => {
    if (!draftTitle.trim()) return;
    const next = [{ id: crypto.randomUUID(), title: draftTitle.trim(), notes: draftNotes, updatedAt: new Date().toISOString() }, ...drafts];
    setDrafts(next);
    localStorage.setItem("decoded-justice-template-drafts", JSON.stringify(next));
    setDraftTitle("");
    setDraftNotes("");
  };

  const saveSubmission = () => {
    if (!record.document.trim()) return;
    const next = [{ id: crypto.randomUUID(), ...record }, ...submissions];
    setSubmissions(next);
    localStorage.setItem("decoded-justice-submission-records", JSON.stringify(next));
    setRecord({ document: "", where: "", method: "e-file / portal", date: "", signature: "Electronic", confirmation: "" });
  };

  const draftCount = useMemo(() => drafts.length, [drafts]);

  return (
    <Layout>
      <main className="container max-w-7xl px-6 py-10 sm:py-16">
        <header className="max-w-4xl mb-8">
          <p className="text-[10px] uppercase tracking-[0.22em] text-gold mb-3">Decoded Justice · Templates</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-medium tracking-tight">Pro Se Templates</h1>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            One workspace for finding a drafting template, building a document from your case record, checking submission requirements, and keeping proof that something was submitted.
          </p>
        </header>

        <Card className="mb-8 border-primary/20">
          <CardContent className="p-5 flex gap-3">
            <ShieldCheck className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div className="text-sm text-muted-foreground leading-relaxed">
              <p className="font-medium text-foreground">Self-help drafting, not an official-form replacement</p>
              <p className="mt-1">Templates help organize information. They do not determine whether a filing is legally sufficient. Always verify the current rules, deadlines, required official forms, service requirements, and local procedures.</p>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="library" className="space-y-6">
          <TabsList className="w-full h-auto justify-start flex-wrap gap-1 bg-secondary/40 p-1">
            <TabsTrigger value="library">Document Library</TabsTrigger>
            <TabsTrigger value="toolkit">Case Toolkit</TabsTrigger>
            <TabsTrigger value="builder">Guided Builder</TabsTrigger>
            <TabsTrigger value="drafts">Draft Workspace</TabsTrigger>
            <TabsTrigger value="knowledge">Legal Knowledge</TabsTrigger>
            <TabsTrigger value="forms">Government Forms</TabsTrigger>
            <TabsTrigger value="filing">Filing & Submission</TabsTrigger>
            <TabsTrigger value="signature">E-Signature</TabsTrigger>
            <TabsTrigger value="records">Submission Record</TabsTrigger>
          </TabsList>

          <TabsContent value="toolkit">
            <div className="space-y-5">
              <EducationalUseBanner />
              {user ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="font-serif">Pro Se Case Toolkit</CardTitle>
                    <p className="text-sm text-muted-foreground">Complete the existing Decoded Justice intake, outreach, legal-aid, and risk-acknowledgment workflow without leaving the Templates workspace.</p>
                  </CardHeader>
                  <CardContent><ProSeToolkitFlow /></CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-7 space-y-4">
                    <h2 className="font-serif text-2xl">Sign in to use the Case Toolkit</h2>
                    <p className="text-sm text-muted-foreground">The toolkit stores case-related workflow information in your account. The document library and public educational resources remain available without signing in.</p>
                    <Button asChild><Link to="/auth?redirect=/templates">Sign In to Continue</Link></Button>
                  </CardContent>
                </Card>
              )}
              <Card>
                <CardContent className="p-6 flex flex-wrap items-center justify-between gap-4">
                  <div><p className="font-medium">Full Case Workspace</p><p className="text-sm text-muted-foreground">Open the integrated case record for evidence, timeline, issues, communications, requests, relationships, packets, and exports.</p></div>
                  <Button asChild variant="outline"><Link to="/cases">Open Case Workspace</Link></Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="library" className="space-y-5">
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {templates.map(([name, type, description]) => (
                <Card key={name} className="h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <FileText className="h-5 w-5 text-gold" />
                      <Badge variant="outline">Drafting template</Badge>
                    </div>
                    <CardTitle className="font-serif text-lg">{name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex h-full flex-col">
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1">{description}</p>
                    <Button asChild variant="outline" className="mt-5 w-full">
                      <Link to={`/legal-templates?template=${encodeURIComponent(name)}&type=${type}`}>Open in Guided Builder</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="builder">
            <Card>
              <CardContent className="p-7 space-y-5">
                <div className="flex items-start gap-4">
                  <Gavel className="h-6 w-6 text-gold mt-1" />
                  <div>
                    <h2 className="font-serif text-2xl">Guided Builder</h2>
                    <p className="text-sm text-muted-foreground mt-1">Connect a case, review imported facts, complete missing fields, then generate a printable packet.</p>
                  </div>
                </div>
                <Button asChild><Link to="/legal-templates">Open Guided Packet Builder</Link></Button>
                <p className="text-xs text-muted-foreground">The existing builder currently supports complaint, complaint + fee-waiver, answer/response, motion + declaration, and declaration packets.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="drafts">
            <div className="grid lg:grid-cols-[1fr_1.4fr] gap-5">
              <Card>
                <CardHeader><CardTitle className="font-serif">New draft note</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <Input value={draftTitle} onChange={(e) => setDraftTitle(e.target.value)} placeholder="Draft title" />
                  <Textarea value={draftNotes} onChange={(e) => setDraftNotes(e.target.value)} placeholder="What are you working on? What still needs verification?" className="min-h-32" />
                  <Button onClick={saveDraft} disabled={!draftTitle.trim()}><Plus className="h-4 w-4 mr-2" />Save draft</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="font-serif">Saved drafts <span className="text-sm text-muted-foreground">({draftCount})</span></CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {drafts.length ? drafts.map((draft) => (
                    <div key={draft.id} className="rounded-lg border border-border p-4">
                      <div className="flex items-center gap-2"><FolderOpen className="h-4 w-4 text-gold" /><p className="font-medium">{draft.title}</p></div>
                      <p className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">{draft.notes || "No notes recorded."}</p>
                      <p className="text-[11px] text-muted-foreground mt-3">Updated {new Date(draft.updatedAt).toLocaleString()}</p>
                    </div>
                  )) : <p className="text-sm text-muted-foreground">No local drafts yet.</p>}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="knowledge">
            <div className="grid md:grid-cols-2 gap-4">
              {[
                ["Education Library", "/education-library", "Plain-language legal education and topic guides."],
                ["Legal Decoder", "/legal-decoder", "Understand documents and legal terminology."],
                ["Law Modules", "/law-modules", "Structured issue and authority modules."],
                ["Court Filing Information", "/courts-filing-info", "Court and filing workflow information."],
                ["Public Request Rights", "/public-request-rights", "Records-request planning and tracking."],
              ].map(([name, href, description]) => (
                <Card key={name}><CardContent className="p-6"><BookOpen className="h-5 w-5 text-gold mb-4" /><h2 className="font-serif text-xl">{name}</h2><p className="text-sm text-muted-foreground mt-1 mb-4">{description}</p><Button asChild variant="outline"><Link to={href}>Open</Link></Button></CardContent></Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="forms" className="space-y-4">
            <Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Official forms are jurisdiction-specific. Use the source site to confirm the current version before filing.</p></CardContent></Card>
            <div className="grid md:grid-cols-2 gap-4">
              {formSources.map(([name, description, href]) => (
                <a key={name} href={href} target="_blank" rel="noreferrer" className="block rounded-xl border border-border bg-card p-5 hover:bg-secondary/40 transition-colors">
                  <Landmark className="h-5 w-5 text-gold mb-3" /><h2 className="font-serif text-lg">{name}</h2><p className="text-xs text-muted-foreground mt-1">{description}</p>
                </a>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="filing">
            <div className="grid lg:grid-cols-2 gap-5">
              <Card>
                <CardHeader><CardTitle className="font-serif">Submission workflow</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {filingChecks.map((check, i) => <div key={check} className="flex gap-3 text-sm"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" /><span><strong>{i + 1}.</strong> {check}</span></div>)}
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="font-serif">Filing destinations</CardTitle></CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-3">
                  {["Federal", "Washington State", "County", "Municipal", "Court", "Administrative agency"].map((item) => <div key={item} className="rounded-lg border border-border p-4"><p className="font-medium">{item}</p><p className="text-xs text-muted-foreground mt-1">Verify the current portal, clerk, mailing address, hours, and local rules.</p></div>)}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="signature">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                ["Electronic", "Confirm the tribunal or agency accepts electronic signatures and identify the required format."],
                ["Typed", "Some submissions accept typed signature blocks; verify the applicable rule or instruction."],
                ["Telephonic attestation", "Use only where the receiving system or rule expressly permits it."],
                ["Wet signature", "Print, sign, scan or deliver as required; retain the signed copy."],
                ["Notary", "Confirm notarization is actually required before paying for or arranging a notary."],
                ["Agency-specific", "Follow the exact signature/attestation language required by the agency form or portal."],
              ].map(([name, description]) => <Card key={name}><CardContent className="p-6"><PenLine className="h-5 w-5 text-gold mb-4" /><h2 className="font-serif text-lg">{name}</h2><p className="text-sm text-muted-foreground mt-1">{description}</p></CardContent></Card>)}
            </div>
          </TabsContent>

          <TabsContent value="records">
            <div className="grid lg:grid-cols-[1fr_1.4fr] gap-5">
              <Card>
                <CardHeader><CardTitle className="font-serif">Record a submission</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <Input placeholder="What was submitted?" value={record.document} onChange={(e) => setRecord({ ...record, document: e.target.value })} />
                  <Input placeholder="Where?" value={record.where} onChange={(e) => setRecord({ ...record, where: e.target.value })} />
                  <Input placeholder="How? (portal, mail, in person, fax)" value={record.method} onChange={(e) => setRecord({ ...record, method: e.target.value })} />
                  <Input type="date" value={record.date} onChange={(e) => setRecord({ ...record, date: e.target.value })} />
                  <Input placeholder="Signature method" value={record.signature} onChange={(e) => setRecord({ ...record, signature: e.target.value })} />
                  <Input placeholder="Confirmation / receipt number" value={record.confirmation} onChange={(e) => setRecord({ ...record, confirmation: e.target.value })} />
                  <Button onClick={saveSubmission} disabled={!record.document.trim()}><Send className="h-4 w-4 mr-2" />Save submission record</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="font-serif">Submission history</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {submissions.length ? submissions.map((item) => <div key={item.id} className="rounded-lg border border-border p-4"><div className="flex gap-2 items-center"><FileCheck2 className="h-4 w-4 text-primary" /><p className="font-medium">{item.document}</p></div><p className="text-sm text-muted-foreground mt-2">{item.where || "Location not recorded"} · {item.method} · {item.date || "Date not recorded"}</p><p className="text-xs text-muted-foreground mt-1">Signature: {item.signature || "Not recorded"} · Confirmation: {item.confirmation || "Not recorded"}</p></div>) : <p className="text-sm text-muted-foreground">No submission records yet.</p>}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </Layout>
  );
}
