import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FileSearch, Loader2, Sparkles, ArrowLeft, CheckCircle2 } from "lucide-react";
import { CaseWorkspaceLayout } from "@/components/case-workspace/CaseWorkspaceLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useCaseSnapshot } from "@/hooks/useCaseSnapshot";

type Extraction = {
  id: string;
  kind: string;
  text: string;
  normalized?: string;
  locator: { start: number; end: number; quoted_text: string };
  verification: "needs_review";
  rationale: string;
};

const labels: Record<string, string> = {
  date: "Date",
  person_or_role: "Person / role",
  organization: "Organization",
  claim: "Claim / statement",
  event: "Event",
  evidence_reference: "Evidence reference",
  issue_signal: "Issue signal",
};

export default function CaseDocumentIntelligence() {
  const { id } = useParams();
  const { snapshot, isLoading } = useCaseSnapshot(id);
  const [selectedId, setSelectedId] = useState("");
  const [sourceText, setSourceText] = useState("");
  const [versionId, setVersionId] = useState<string | null>(null);
  const [extractedTextId, setExtractedTextId] = useState<string | null>(null);
  const [promoting, setPromoting] = useState<string | null>(null);
  const [promoted, setPromoted] = useState<Record<string, string>>({});
  const [loadingText, setLoadingText] = useState(false);
  const [running, setRunning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [results, setResults] = useState<Extraction[]>([]);
  const [notice, setNotice] = useState("");

  const documents = snapshot.evidence;
  const selected = useMemo(() => documents.find((d: any) => d.id === selectedId), [documents, selectedId]);

  useEffect(() => {
    if (!selectedId && documents.length) setSelectedId(documents[0].id);
  }, [documents, selectedId]);

  useEffect(() => {
    let cancelled = false;
    const loadLatestText = async () => {
      if (!selectedId || !id) return;
      setLoadingText(true);
      setNotice("");
      setResults([]);
      const { data: versions } = await (supabase as any)
        .from("document_versions")
        .select("id, version_no")
        .eq("document_id", selectedId)
        .eq("case_id", id)
        .order("version_no", { ascending: false })
        .limit(1);
      const latest = versions?.[0];
      if (!latest) {
        if (!cancelled) {
          setVersionId(null);
          setSourceText("");
          setNotice("No extracted text is attached to this document yet. Paste the document text below to analyze it.");
        }
        setLoadingText(false);
        return;
      }
      const { data: extracted } = await (supabase as any)
        .from("extracted_text")
        .select("id, normalized_text, document_version_id")
        .eq("document_version_id", latest.id)
        .eq("case_id", id)
        .order("created_at", { ascending: false })
        .limit(1);
      if (!cancelled) {
        setVersionId(latest.id);
        setSourceText(extracted?.[0]?.normalized_text || "");
        if (!extracted?.[0]) setNotice("A document version exists, but no extracted text is available. Paste text below.");
      }
      setLoadingText(false);
    };
    loadLatestText();
    return () => { cancelled = true; };
  }, [selectedId, id]);

  const run = async () => {
    if (!id || !selectedId || !sourceText.trim()) return;
    setRunning(true);
    setNotice("");
    setResults([]);
    const { data, error } = await supabase.functions.invoke("document-intelligence", {
      body: { caseId: id, documentId: selectedId, documentVersionId: versionId, text: sourceText },
    });
    if (error || !data?.success) {
      setNotice(error?.message || data?.error || "Document intelligence could not run.");
      setRunning(false);
      return;
    }
    setResults(data.extractions || []);
    setNotice(data.notice || "");
    setRunning(false);
  };

  const promote = async (item: Extraction) => {
    if (!id || !selectedId) return;
    setPromoting(item.id);
    setNotice("");

    const locatorPayload: any = {
      case_id: id,
      document_version_id: versionId,
      text_start: item.locator.start,
      text_end: item.locator.end,
      quoted_text: item.locator.quoted_text,
      locator_hash: await crypto.subtle.digest("SHA-256", new TextEncoder().encode(
        `${selectedId}|${versionId || "source-text"}|${item.locator.start}|${item.locator.end}|${item.locator.quoted_text}`
      )).then(buf => Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("")),
    };
    if (extractedTextId) locatorPayload.extracted_text_id = extractedTextId;

    const { data: locator, error: locatorError } = await (supabase as any)
      .from("evidence_locators")
      .insert(locatorPayload)
      .select("id")
      .single();

    if (locatorError || !locator) {
      setNotice(locatorError?.message || "Could not preserve the source locator.");
      setPromoting(null);
      return;
    }

    let createdId: string | null = null;
    let label = "";
    if (item.kind === "event") {
      const parsedDate = item.normalized && /^\d{4}-\d{2}-\d{2}$/.test(item.normalized)
        ? new Date(`${item.normalized}T12:00:00Z`).toISOString()
        : null;
      const { data, error } = await (supabase as any).from("events").insert({
        case_id: id,
        occurred_at: parsedDate,
        title: item.text.slice(0, 120),
        description: item.text,
        classification: "unknown",
        category: "document-extracted",
        importance: "normal",
        reviewed: false,
        disputed: false,
        source_locator_id: locator.id,
        source_type: "Document Intelligence",
        reason: "Promoted from a reviewed source extraction; verify against the original document.",
        review_status: "needs_review",
      }).select("id").single();
      createdId = data?.id || null;
      label = "event";
      if (error) setNotice(error.message);
    } else if (item.kind === "claim") {
      const { data, error } = await (supabase as any).from("claims").insert({
        case_id: id,
        statement: item.text,
        classification: "unknown",
        confidence: null,
        who_made: null,
        first_stated_at: null,
        source_locator_id: locator.id,
        notes: "Promoted from Document Intelligence. Speaker, classification, and factual status require review.",
      }).select("id").single();
      createdId = data?.id || null;
      label = "claim";
      if (error) setNotice(error.message);
    } else if (item.kind === "person_or_role") {
      const match = item.text.match(/^(?:Officer|Deputy|Detective|Sergeant|Lieutenant|Sheriff|Caseworker|Social Worker|Investigator|Supervisor|Judge|Attorney|Lawyer|Landlord|Property Manager|Teacher|Principal|Doctor|Nurse|Employer|HR|Agency|Worker|Caregiver)\s+/i);
      const role = match?.[0]?.trim() || null;
      const name = role ? item.text.slice(match![0].length).trim() : item.text;
      const { data, error } = await (supabase as any).from("people").insert({
        case_id: id,
        display_name: name.slice(0, 200),
        role_label: role,
        source_type: "Document Intelligence",
        review_status: "needs_review",
        notes: `Source extraction: ${item.text}. Verify identity and role before relying on this person record. Locator ${locator.id}.`,
      }).select("id").single();
      createdId = data?.id || null;
      label = "person";
      if (error) setNotice(error.message);
    } else if (item.kind === "organization") {
      const { data, error } = await (supabase as any).from("organizations").insert({
        case_id: id,
        name: item.text.slice(0, 250),
        org_type: "document-extracted",
        source_type: "Document Intelligence",
        review_status: "needs_review",
        notes: `Source locator: ${locator.id}. Verify the organization name and context against the original document.`,
      }).select("id").single();
      createdId = data?.id || null;
      label = "organization";
      if (error) setNotice(error.message);
    } else if (item.kind === "evidence_reference") {
      const { data, error } = await (supabase as any).from("evidence_mentions").insert({
        case_id: id,
        evidence_type: "document-reference",
        description: item.text,
        approximate_date: item.normalized || null,
        priority: "normal",
        status: "needs_review",
        source_type: "Document Intelligence",
        review_status: "needs_review",
      }).select("id").single();
      createdId = data?.id || null;
      label = "evidence reference";
      if (error) setNotice(error.message);
    }

    if (createdId) {
      setPromoted(prev => ({ ...prev, [item.id]: label }));
      setNotice(`Promoted to ${label}. The new record remains marked Needs review and retains source locator ${locator.id}.`);
    } else if (!notice) {
      setNotice("This extraction type stays as a source signal until it has enough context to safely promote.");
    }
    setPromoting(null);
  };

  const saveRun = async () => {
    if (!id || !selectedId || !results.length) return;
    setSaving(true);
    setNotice("");
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) {
      setNotice("You must be signed in to save an extraction.");
      setSaving(false);
      return;
    }
    const fingerprintBytes = new TextEncoder().encode(sourceText);
    const digest = await crypto.subtle.digest("SHA-256", fingerprintBytes);
    const fingerprint = Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, "0")).join("");
    const { data: runRow, error: runError } = await (supabase as any).from("ai_runs").insert({
      case_id: id,
      document_version_id: versionId,
      operation: "document_intelligence",
      consented_at: new Date().toISOString(),
      status: "completed",
      provider: "Decoded Justice deterministic extractor",
      model: null,
      prompt_version: "document-intelligence.v1",
      schema_version: "document-intelligence.v1",
      input_fingerprint: fingerprint,
      created_by: userId,
      completed_at: new Date().toISOString(),
    }).select("id").single();
    if (runError || !runRow) {
      setNotice(runError?.message || "Could not save the processing run.");
      setSaving(false);
      return;
    }
    const { error: extractionError } = await (supabase as any).from("ai_extractions").insert({
      case_id: id,
      ai_run_id: runRow.id,
      validation_status: "needs_review",
      payload: {
        source: { document_id: selectedId, document_version_id: versionId, character_count: sourceText.length },
        extraction_method: "deterministic-pattern-v1",
        extractions: results,
      },
    });
    if (extractionError) {
      setNotice(extractionError.message);
      setSaving(false);
      return;
    }
    setNotice("Extraction saved. Every extracted item remains marked as Needs review until you verify it against the source.");
    setSaving(false);
  };

  return (
    <CaseWorkspaceLayout
      title="Document Intelligence"
      description="Extract dates, people, organizations, events, statements, evidence references, and issue signals from a source document without turning extraction into a legal finding."
    >
      <div className="flex items-center justify-between mb-5">
        <Button asChild variant="ghost" size="sm">
          <Link to={id ? `/cases/${id}/evidence` : "#"}><ArrowLeft className="w-4 h-4 mr-2" /> Evidence</Link>
        </Button>
        <Badge variant="outline">Source-preserving · v1</Badge>
      </div>

      <Card className="mb-5">
        <CardHeader>
          <CardTitle className="text-base">1. Choose a source document</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Loading documents…</div>
          ) : documents.length === 0 ? (
            <p className="text-sm text-muted-foreground">Add a source document to the Evidence workspace first.</p>
          ) : (
            <Select value={selectedId} onValueChange={setSelectedId}>
              <SelectTrigger><SelectValue placeholder="Select a document" /></SelectTrigger>
              <SelectContent>
                {documents.map((doc: any) => <SelectItem key={doc.id} value={doc.id}>{doc.display_filename || doc.title || "Untitled document"}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
          {selected && <p className="text-xs text-muted-foreground mt-3">{selected.document_type || "Document"} · {selected.source || "Source not specified"}</p>}
        </CardContent>
      </Card>

      <Card className="mb-5">
        <CardHeader>
          <CardTitle className="text-base">2. Source text</CardTitle>
          <p className="text-xs text-muted-foreground">If extracted text is available for the selected document, it is loaded here. Otherwise paste text from the original record. The original file remains the source of record.</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {loadingText && <div className="flex items-center gap-2 text-xs text-muted-foreground"><Loader2 className="w-3.5 h-3.5 animate-spin" /> Checking for extracted text…</div>}
          <Label htmlFor="document-text">Document text</Label>
          <Textarea id="document-text" value={sourceText} onChange={e => setSourceText(e.target.value)} rows={12} placeholder="Paste source text here if extracted text is not already available." />
          <div className="flex justify-end">
            <Button onClick={run} disabled={running || !sourceText.trim() || !selectedId}>
              {running ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
              Analyze document
            </Button>
          </div>
        </CardContent>
      </Card>

      {notice && <div className="mb-5 rounded-lg border border-border bg-muted/30 p-3 text-xs text-muted-foreground">{notice}</div>}

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base">3. Extracted source signals</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">{results.length} items · all require review</p>
              </div>
              <Button variant="outline" onClick={saveRun} disabled={saving}>
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                Save extraction
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {results.map(item => (
              <div key={item.id} className="rounded-lg border border-border/60 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{labels[item.kind] || item.kind}</Badge>
                  <Badge variant="outline">Needs review</Badge>
                </div>
                <p className="text-sm leading-6">{item.text}</p>
                <p className="text-[11px] text-muted-foreground mt-2">Source locator: characters {item.locator.start}–{item.locator.end}</p>
                <p className="text-[11px] text-muted-foreground mt-1">{item.rationale}</p>
                {["event", "claim", "person_or_role", "organization", "evidence_reference"].includes(item.kind) && !promoted[item.id] && (
                  <Button size="sm" variant="outline" className="mt-3" onClick={() => promote(item)} disabled={promoting === item.id}>
                    {promoting === item.id ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5 mr-2" />}
                    Promote to case record
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </CaseWorkspaceLayout>
  );
}
