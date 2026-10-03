import { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { FileSearch, Plus, Save } from "lucide-react";
import { CaseWorkspaceLayout } from "@/components/case-workspace/CaseWorkspaceLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCaseCollection } from "@/hooks/useCases";
import { useCaseSnapshot } from "@/hooks/useCaseSnapshot";
import { toast } from "@/hooks/use-toast";

const REVIEW_STATUSES = [
  { value: "needs_review", label: "Needs review" },
  { value: "reviewed", label: "Reviewed" },
];

export default function CaseEvidenceReview() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const issueFromQuery = searchParams.get("issue") || "";
  const { snapshot } = useCaseSnapshot(id);
  const { items: reviews, add, update } = useCaseCollection<any>("evidence_reviews", id);
  const [documentId, setDocumentId] = useState("");
  const [issueId, setIssueId] = useState(issueFromQuery);
  const [status, setStatus] = useState("needs_review");
  const [locator, setLocator] = useState("");
  const [supports, setSupports] = useState("");
  const [contradicts, setContradicts] = useState("");
  const [unresolved, setUnresolved] = useState("");
  const [notes, setNotes] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const reset = () => {
    setDocumentId(""); setIssueId(issueFromQuery); setStatus("needs_review"); setLocator("");
    setSupports(""); setContradicts(""); setUnresolved(""); setNotes(""); setEditingId(null);
  };

  const save = async () => {
    if (!id || !documentId) {
      toast({ title: "Choose a document", description: "Each evidence review must identify its source document.", variant: "destructive" });
      return;
    }
    const payload = {
      document_id: documentId,
      issue_id: issueId || null,
      review_status: status,
      locator: locator || null,
      supports: supports || null,
      contradicts: contradicts || null,
      unresolved: unresolved || null,
      reviewer_notes: notes || null,
    };
    try {
      if (editingId) await update.mutateAsync({ id: editingId, values: payload });
      else await add.mutateAsync(payload);
      toast({ title: editingId ? "Review updated" : "Evidence review saved" });
      reset();
    } catch (e: any) {
      toast({ title: "Could not save review", description: e.message, variant: "destructive" });
    }
  };

  const edit = (review: any) => {
    setEditingId(review.id); setDocumentId(review.document_id); setIssueId(review.issue_id || "");
    setStatus(review.review_status || "needs_review"); setLocator(review.locator || "");
    setSupports(review.supports || ""); setContradicts(review.contradicts || "");
    setUnresolved(review.unresolved || ""); setNotes(review.reviewer_notes || "");
  };

  const docTitle = (id: string) => snapshot.evidence.find((d: any) => d.id === id)?.display_filename || "Untitled document";
  const issueTitle = (id: string) => snapshot.issues.find((i: any) => i.id === id)?.title || "No linked issue";

  return (
    <CaseWorkspaceLayout
      title="Evidence review"
      description="Record what a source actually supports, contradicts, or leaves unresolved. Keep source content separate from your interpretation."
    >
      <div className="grid gap-5 lg:grid-cols-[1.05fr_.95fr]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><Plus className="w-4 h-4" />{editingId ? "Edit review" : "Add evidence review"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Source document</Label>
              <Select value={documentId} onValueChange={setDocumentId}>
                <SelectTrigger><SelectValue placeholder="Choose the document being reviewed" /></SelectTrigger>
                <SelectContent>{snapshot.evidence.map((d: any) => <SelectItem key={d.id} value={d.id}>{d.display_filename || "Untitled document"}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Related issue</Label>
              <Select value={issueId || "__none"} onValueChange={(v) => setIssueId(v === "__none" ? "" : v)}>
                <SelectTrigger><SelectValue placeholder="Optional issue" /></SelectTrigger>
                <SelectContent><SelectItem value="__none">No linked issue</SelectItem>{snapshot.issues.map((i: any) => <SelectItem key={i.id} value={i.id}>{i.title || "Untitled issue"}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Review status</Label>
              <Select value={status} onValueChange={setStatus}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{REVIEW_STATUSES.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent></Select>
            </div>
            <div><Label>Source locator</Label><Input value={locator} onChange={(e) => setLocator(e.target.value)} placeholder="Page 4, paragraph 2; timestamp 00:13:42; email subject" /></div>
            <div><Label>What does the source support?</Label><Textarea value={supports} onChange={(e) => setSupports(e.target.value)} placeholder="Describe what the record actually shows or states." /></div>
            <div><Label>What does it contradict?</Label><Textarea value={contradicts} onChange={(e) => setContradicts(e.target.value)} placeholder="Identify a conflicting statement, record, or account." /></div>
            <div><Label>What remains unresolved?</Label><Textarea value={unresolved} onChange={(e) => setUnresolved(e.target.value)} placeholder="Identify questions the document does not answer." /></div>
            <div><Label>Reviewer notes</Label><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Your interpretation, cautions, or follow-up notes." /></div>
            <div className="flex gap-2"><Button onClick={() => void save()} disabled={add.isPending || update.isPending}><Save className="w-4 h-4 mr-2" />Save review</Button>{editingId ? <Button variant="outline" onClick={reset}>Cancel</Button> : null}</div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {reviews.length === 0 ? (
            <Card><CardContent className="p-8 text-center text-sm text-muted-foreground"><FileSearch className="w-8 h-8 mx-auto mb-3 opacity-60" />No evidence reviews yet.</CardContent></Card>
          ) : reviews.map((review: any) => (
            <Card key={review.id}>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div><p className="font-medium">{docTitle(review.document_id)}</p><p className="text-xs text-muted-foreground">{issueTitle(review.issue_id)} · {review.review_status}</p></div>
                  <Button variant="ghost" size="sm" onClick={() => edit(review)}>Edit</Button>
                </div>
                {review.locator ? <p className="text-xs text-muted-foreground">Source: {review.locator}</p> : null}
                {review.supports ? <div><p className="text-xs font-medium">Supports</p><p className="text-sm mt-1 whitespace-pre-wrap">{review.supports}</p></div> : null}
                {review.contradicts ? <div><p className="text-xs font-medium">Contradicts</p><p className="text-sm mt-1 whitespace-pre-wrap">{review.contradicts}</p></div> : null}
                {review.unresolved ? <div><p className="text-xs font-medium">Unresolved</p><p className="text-sm mt-1 whitespace-pre-wrap">{review.unresolved}</p></div> : null}
                {review.reviewer_notes ? <div><p className="text-xs font-medium">Reviewer notes</p><p className="text-sm mt-1 whitespace-pre-wrap">{review.reviewer_notes}</p></div> : null}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </CaseWorkspaceLayout>
  );
}
