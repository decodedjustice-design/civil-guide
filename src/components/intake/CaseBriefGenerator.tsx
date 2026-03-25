import { Copy, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { CaseBriefData } from "@/hooks/useCaseBriefGenerator";

interface Props {
  data: CaseBriefData;
}

export function CaseBriefGenerator({ data }: Props) {
  const { toast } = useToast();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(toPlainText(data));
    toast({ title: "Copied", description: "Case brief copied to clipboard." });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button onClick={handlePrint} className="gap-2"><Download className="w-4 h-4" />Download / Print</Button>
        <Button variant="outline" onClick={handleCopy} className="gap-2"><Copy className="w-4 h-4" />Copy Text</Button>
      </div>

      <div id="case-brief-content" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" />Case Brief Generator Output</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p><strong>Generated:</strong> {data.generatedAt}</p>
            <p className="text-muted-foreground">Attorney-ready intake summary compiled from Clarion, Timeline, and Evidence Vault records.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>SECTION 1: CASE OVERVIEW</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>Matter title:</strong> {data.caseOverview.matterTitle}</p>
            <p><strong>Likely system:</strong> {data.caseOverview.likelySystem}</p>
            <p><strong>Incident date basis:</strong> {data.caseOverview.incidentDate || "Not available from existing records."}</p>
            <p className="whitespace-pre-wrap"><strong>Narrative summary:</strong> {data.caseOverview.narrativeSummary}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>SECTION 2: CHRONOLOGICAL TIMELINE</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            {data.timeline.length ? data.timeline.map((event) => (
              <div key={event.id}>
                <p>
                  <strong>{event.event_date}</strong> — {event.title}
                  <span className="text-xs text-muted-foreground ml-2">
                    ({event.evidenceCount || 0} linked evidence item{(event.evidenceCount || 0) === 1 ? "" : "s"})
                  </span>
                </p>
                {event.description && <p className="text-muted-foreground">{event.description}</p>}
              </div>
            )) : <p className="text-muted-foreground italic">No timeline events found.</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>SECTION 3: EVIDENCE INDEX</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            {data.evidenceIndex.length ? data.evidenceIndex.map((item) => (
              <div key={item.id} className="border rounded-md p-3">
                <p><strong>{item.title}</strong>{item.document_date ? ` (${item.document_date})` : ""}</p>
                {item.description && <p className="text-muted-foreground">{item.description}</p>}
                <div className="flex gap-2 mt-2 items-center">
                  <Badge variant="secondary">{item.file_type || "file"}</Badge>
                  <Badge variant="outline">{item.linkStrength === "exact" ? "Exact date link" : item.linkStrength === "nearby" ? "Nearby date link" : "No timeline link"}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Linked event: {item.linkedEventTitle || "Not linked"} ({item.linkedEventId || "no id"}). Source: {item.source || "Not provided"}.</p>
              </div>
            )) : <p className="text-muted-foreground italic">No evidence records found.</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>SECTION 4: KEY FACTS</CardTitle></CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 text-sm space-y-1">
              {data.keyFacts.map((fact, index) => <li key={`${fact}-${index}`}>{fact}</li>)}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>SECTION 5: POSSIBLE LEGAL ISSUES (NON-CONCLUSIVE)</CardTitle></CardHeader>
          <CardContent>
            <ul className="list-disc pl-6 text-sm space-y-1">
              {data.possibleLegalIssues.map((issue) => <li key={issue}>{issue}</li>)}
            </ul>
            <Alert className="mt-3">
              <AlertDescription>
                This section is issue-spotting support only and does not provide legal conclusions.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>SECTION 6: DEADLINES / STATUTE OF LIMITATIONS</CardTitle></CardHeader>
          <CardContent className="text-sm space-y-1">
            <p><strong>Incident date used:</strong> {data.deadlines.incidentDate || "Unavailable"}</p>
            <p><strong>Estimated WA tort claim notice window:</strong> {data.deadlines.tortNoticeDeadline || "Cannot calculate (missing incident date)"}</p>
            <p><strong>Estimated federal §1983 filing window:</strong> {data.deadlines.section1983Deadline || "Cannot calculate (missing incident date)"}</p>
            <p className="text-xs text-muted-foreground italic">Deadlines are informational estimates only and must be verified by counsel.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function toPlainText(data: CaseBriefData) {
  return [
    "CASE BRIEF GENERATOR OUTPUT",
    `Generated: ${data.generatedAt}`,
    "",
    "SECTION 1: CASE OVERVIEW",
    `Matter title: ${data.caseOverview.matterTitle}`,
    `Likely system: ${data.caseOverview.likelySystem}`,
    `Incident date basis: ${data.caseOverview.incidentDate || "Not available"}`,
    `Narrative summary: ${data.caseOverview.narrativeSummary}`,
    "",
    "SECTION 2: CHRONOLOGICAL TIMELINE",
    ...data.timeline.map((e) => `- ${e.event_date}: ${e.title}${e.description ? ` — ${e.description}` : ""} | linked evidence: ${e.evidenceCount || 0}`),
    "",
    "SECTION 3: EVIDENCE INDEX",
    ...data.evidenceIndex.map((e) => `- ${e.title}${e.document_date ? ` (${e.document_date})` : ""} | link: ${e.linkStrength} | eventId: ${e.linkedEventId || "none"} | event: ${e.linkedEventTitle || "none"} | source: ${e.source || "n/a"}`),
    "",
    "SECTION 4: KEY FACTS",
    ...data.keyFacts.map((f) => `- ${f}`),
    "",
    "SECTION 5: POSSIBLE LEGAL ISSUES (NON-CONCLUSIVE)",
    ...data.possibleLegalIssues.map((i) => `- ${i}`),
    "",
    "SECTION 6: DEADLINES / STATUTE OF LIMITATIONS",
    `Incident date used: ${data.deadlines.incidentDate || "Unavailable"}`,
    `Estimated WA tort claim notice window: ${data.deadlines.tortNoticeDeadline || "N/A"}`,
    `Estimated federal §1983 filing window: ${data.deadlines.section1983Deadline || "N/A"}`,
  ].join("\n");
}
