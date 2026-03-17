import { AlertCircle, Copy, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { CaseBriefData, useCaseBriefGenerator } from "@/hooks/useCaseBriefGenerator";

const URGENCY_DAYS = 45;

export function CaseBriefViewer() {
  const { toast } = useToast();
  const { data, isLoading, error } = useCaseBriefGenerator();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(toPlainText(data));
    toast({ title: "Copied", description: "Case brief copied to clipboard." });
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          Compiling Clarion, Timeline, Evidence Vault, and incident date data...
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-destructive">{error}</CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 print:space-y-2">
      <div className="flex gap-2 print:hidden">
        <Button onClick={handlePrint} className="gap-2">
          <Download className="w-4 h-4" />
          Download / Print
        </Button>
        <Button variant="outline" onClick={handleCopy} className="gap-2">
          <Copy className="w-4 h-4" />
          Copy Text
        </Button>
      </div>

      <div id="case-brief-content" className="space-y-4 print:space-y-2">
        <Card className="print:shadow-none print:border-black/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-balance">
              <FileText className="w-5 h-5" />
              Case Brief Viewer
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>
              <strong>Generated:</strong> {data.generatedAt}
            </p>
            <p className="text-muted-foreground">
              Attorney-ready summary compiled from Clarion, Timeline, and Evidence Vault records.
            </p>
          </CardContent>
        </Card>

        <Card className="print:shadow-none print:border-black/30">
          <CardHeader>
            <CardTitle>1. Case Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <strong>Matter title:</strong> {data.caseOverview.matterTitle || "Not enough details yet."}
            </p>
            <p>
              <strong>Likely system:</strong> {data.caseOverview.likelySystem || "Not identified"}
            </p>
            <p>
              <strong>Incident date basis:</strong> {data.caseOverview.incidentDate || "Not available from existing records."}
            </p>
            <div className="space-y-1">
              <p>
                <strong>Narrative summary:</strong>
              </p>
              <p className="whitespace-pre-wrap text-muted-foreground">{data.caseOverview.narrativeSummary || "No narrative entries available."}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="print:shadow-none print:border-black/30">
          <CardHeader>
            <CardTitle>2. Chronological Timeline</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            {data.timeline.length ? (
              <ul className="list-disc pl-6 space-y-2">
                {data.timeline.map((event) => (
                  <li key={event.id}>
                    <span className="font-medium">{event.event_date}</span>: {event.title}
                    {event.description ? <p className="text-muted-foreground mt-1">{event.description}</p> : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground italic">No timeline events found yet.</p>
            )}
          </CardContent>
        </Card>

        <Card className="print:shadow-none print:border-black/30">
          <CardHeader>
            <CardTitle>3. Evidence Index</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {data.evidenceIndex.length ? (
              data.evidenceIndex.map((item) => (
                <div key={item.id} className="border rounded-md p-3 break-inside-avoid">
                  <p>
                    <strong>{item.title || "Untitled evidence"}</strong>
                    {item.document_date ? ` (${item.document_date})` : ""}
                  </p>
                  {item.description ? <p className="text-muted-foreground">{item.description}</p> : null}
                  <div className="flex flex-wrap gap-2 mt-2 items-center">
                    <Badge variant="secondary">{item.file_type || "file"}</Badge>
                    <Badge variant="outline">
                      {item.linkStrength === "exact"
                        ? "Exact date link"
                        : item.linkStrength === "nearby"
                          ? "Nearby date link"
                          : "No timeline link"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Linked event: {item.linkedEventTitle || "Not linked"}. Source: {item.source || "Not provided"}.
                  </p>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground italic">No evidence records found yet.</p>
            )}
          </CardContent>
        </Card>

        <Card className="print:shadow-none print:border-black/30">
          <CardHeader>
            <CardTitle>4. Key Facts</CardTitle>
          </CardHeader>
          <CardContent>
            {data.keyFacts.length ? (
              <ul className="list-disc pl-6 text-sm space-y-1">
                {data.keyFacts.map((fact, index) => (
                  <li key={`${fact}-${index}`}>{fact}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground italic">No key facts could be generated yet.</p>
            )}
          </CardContent>
        </Card>

        <Card className="print:shadow-none print:border-black/30">
          <CardHeader>
            <CardTitle>5. Possible Legal Issues (non-conclusive)</CardTitle>
          </CardHeader>
          <CardContent>
            {data.possibleLegalIssues.length ? (
              <ul className="list-disc pl-6 text-sm space-y-1">
                {data.possibleLegalIssues.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground italic">No issues identified from current records.</p>
            )}
            <Alert className="mt-3">
              <AlertDescription>
                This section is issue-spotting support only and does not provide legal conclusions.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card className="print:shadow-none print:border-black/30">
          <CardHeader>
            <CardTitle>6. Deadlines</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>
              <strong>Incident date used:</strong> {data.deadlines.incidentDate || "Unavailable"}
            </p>
            <DeadlineRow label="Estimated WA tort claim notice window" deadline={data.deadlines.tortNoticeDeadline} />
            <DeadlineRow label="Estimated federal §1983 filing window" deadline={data.deadlines.section1983Deadline} />
            <p className="text-xs text-muted-foreground italic">
              Deadlines are informational estimates only and must be verified by counsel.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DeadlineRow({ label, deadline }: { label: string; deadline: string | null }) {
  const urgency = getUrgency(deadline);

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <p>
        <strong>{label}:</strong> {deadline || "Cannot calculate (missing incident date)"}
      </p>
      {urgency ? (
        <Badge variant="destructive" className="gap-1">
          <AlertCircle className="w-3 h-3" />
          {urgency}
        </Badge>
      ) : null}
    </div>
  );
}

function getUrgency(deadline: string | null) {
  if (!deadline) return null;

  const deadlineDate = new Date(deadline);
  if (Number.isNaN(deadlineDate.getTime())) return null;

  const msRemaining = deadlineDate.getTime() - Date.now();
  const daysRemaining = Math.ceil(msRemaining / (1000 * 60 * 60 * 24));

  if (daysRemaining < 0) return "Past estimated deadline";
  if (daysRemaining <= URGENCY_DAYS) return `Urgent: ${daysRemaining} day${daysRemaining === 1 ? "" : "s"} left`;
  return null;
}

function toPlainText(data: CaseBriefData) {
  return [
    "CASE BRIEF VIEWER OUTPUT",
    `Generated: ${data.generatedAt}`,
    "",
    "1. CASE OVERVIEW",
    `Matter title: ${data.caseOverview.matterTitle}`,
    `Likely system: ${data.caseOverview.likelySystem}`,
    `Incident date basis: ${data.caseOverview.incidentDate || "Not available"}`,
    `Narrative summary: ${data.caseOverview.narrativeSummary}`,
    "",
    "2. CHRONOLOGICAL TIMELINE",
    ...(data.timeline.length
      ? data.timeline.map((e) => `- ${e.event_date}: ${e.title}${e.description ? ` — ${e.description}` : ""}`)
      : ["- No timeline events found."]),
    "",
    "3. EVIDENCE INDEX",
    ...(data.evidenceIndex.length
      ? data.evidenceIndex.map(
          (e) =>
            `- ${e.title}${e.document_date ? ` (${e.document_date})` : ""} | link: ${e.linkStrength} | event: ${e.linkedEventTitle || "none"} | source: ${e.source || "n/a"}`,
        )
      : ["- No evidence records found."]),
    "",
    "4. KEY FACTS",
    ...(data.keyFacts.length ? data.keyFacts.map((f) => `- ${f}`) : ["- No key facts available."]),
    "",
    "5. POSSIBLE LEGAL ISSUES (NON-CONCLUSIVE)",
    ...(data.possibleLegalIssues.length ? data.possibleLegalIssues.map((i) => `- ${i}`) : ["- No issues identified."]),
    "",
    "6. DEADLINES",
    `Incident date used: ${data.deadlines.incidentDate || "Unavailable"}`,
    `Estimated WA tort claim notice window: ${data.deadlines.tortNoticeDeadline || "N/A"}`,
    `Estimated federal §1983 filing window: ${data.deadlines.section1983Deadline || "N/A"}`,
  ].join("\n");
}
