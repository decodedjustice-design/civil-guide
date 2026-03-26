import { useRef } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  AlertTriangle, 
  Download, 
  Copy, 
  FileText,
  Calendar,
  MapPin,
  User,
  Mail,
  Phone,
  CheckCircle2,
  Clock,
  FileWarning
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { IntakeFormData } from "./IntakePacketForm";

interface IntakePacketPreviewProps {
  data: IntakeFormData;
  attorneyName?: string;
  attorneyFirm?: string;
  onExportPDF: () => void;
  onCopyText: () => void;
  onSaveAndClose: () => void;
  isExporting?: boolean;
  isSaving?: boolean;
  packetId?: string;
}

const ISSUE_TYPE_LABELS: Record<string, string> = {
  police: "Police / Law Enforcement",
  housing: "Housing Discrimination",
  cps_dcyf: "Child Welfare / CPS / DCYF",
  schools: "Education / Schools",
  healthcare: "Healthcare",
  benefits: "Government Benefits",
  employment: "Employment",
  other: "Other Civil Rights",
};

export function IntakePacketPreview({
  data,
  attorneyName,
  attorneyFirm,
  onExportPDF,
  onCopyText,
  onSaveAndClose,
  isExporting = false,
  isSaving = false,
  packetId,
}: IntakePacketPreviewProps) {
  const { toast } = useToast();
  const contentRef = useRef<HTMLDivElement>(null);

  const handleCopy = () => {
    const text = generatePlainText(data, attorneyName, attorneyFirm);
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "Packet text copied successfully",
      });
      onCopyText();
    });
  };

  const formatIncidentDate = () => {
    if (!data.incidentMonthYear) return "Not specified";
    try {
      const [year, month] = data.incidentMonthYear.split("-");
      return format(new Date(parseInt(year), parseInt(month) - 1), "MMMM yyyy");
    } catch {
      return data.incidentMonthYear;
    }
  };

  const getStatuteInfo = () => {
    if (!data.incidentDate) return null;
    
    try {
      const incident = new Date(data.incidentDate);
      const tortDeadline = new Date(incident);
      tortDeadline.setDate(tortDeadline.getDate() + 60);
      
      const section1983Deadline = new Date(incident);
      section1983Deadline.setFullYear(section1983Deadline.getFullYear() + 3);
      
      return {
        tortDeadline: format(tortDeadline, "MMMM d, yyyy"),
        section1983Deadline: format(section1983Deadline, "MMMM d, yyyy"),
        incidentDate: format(incident, "MMMM d, yyyy"),
      };
    } catch {
      return null;
    }
  };

  const statuteInfo = getStatuteInfo();

  return (
    <div className="space-y-6">
      {/* Export Actions Bar */}
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-xl border border-border">
        <Button onClick={onExportPDF} disabled={isExporting} className="gap-2">
          <Download className="w-4 h-4" />
          {isExporting ? "Generating PDF..." : "Download PDF"}
        </Button>
        <Button variant="outline" onClick={handleCopy} className="gap-2">
          <Copy className="w-4 h-4" />
          Copy Text
        </Button>
        <Button 
          variant="secondary" 
          onClick={onSaveAndClose} 
          disabled={isSaving}
          className="gap-2 ml-auto"
        >
          <CheckCircle2 className="w-4 h-4" />
          {isSaving ? "Saving..." : "Save & Close"}
        </Button>
      </div>

      {/* Packet Content */}
      <div ref={contentRef} className="space-y-6" id="intake-packet-content">
        {/* Header Warning */}
        <div className="p-4 rounded-xl bg-warning/10 border border-warning/30 flex items-start gap-3 print:bg-yellow-50">
          <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground">
              INITIAL INQUIRY ONLY — CONFLICT CHECK REQUIRED
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              This packet is for initial attorney consultation purposes only. 
              Do not send evidence, documents, or confidential information until the 
              attorney confirms there is no conflict of interest.
            </p>
          </div>
        </div>

        {/* Title */}
        <div className="text-center py-4">
          <h1 className="text-2xl font-bold text-foreground">Attorney Intake Packet</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Generated {format(new Date(), "MMMM d, yyyy 'at' h:mm a")}
          </p>
          {attorneyName && (
            <p className="text-sm text-accent mt-2">
              Prepared for: {attorneyName}{attorneyFirm ? `, ${attorneyFirm}` : ""}
            </p>
          )}
        </div>

        <Separator />

        {/* Section 1: Case Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              1. Case Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-muted-foreground">Case Name</dt>
                <dd className="font-medium">{data.caseName}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">County</dt>
                <dd className="font-medium flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {data.county} County, Washington
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Incident Month/Year</dt>
                <dd className="font-medium flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatIncidentDate()}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Issue Type</dt>
                <dd className="font-medium">{ISSUE_TYPE_LABELS[data.issueType] || data.issueType}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Opposing Party</dt>
                <dd className="font-medium">{data.opposingParty}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-muted-foreground">Parties Involved (Full Names)</dt>
                <dd className="font-medium whitespace-pre-wrap">{data.partiesInvolved}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Agencies Involved</dt>
                <dd className="font-medium">{data.agenciesInvolved}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Jurisdiction / Location</dt>
                <dd className="font-medium">{data.jurisdictionLocation}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Case Status</dt>
                <dd className="font-medium">{data.caseStatus}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Section 2: Narrative */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              2. Factual Narrative (Neutral Summary)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none text-foreground">
              <p className="whitespace-pre-wrap">{data.narrative}</p>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Issues Checklist */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              3. Applicable Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.issuesChecklist.map((issue) => (
                <Badge key={issue} variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                  {issue}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Section 4: Evidence Snapshot */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileWarning className="w-5 h-5" />
              4. Evidence Snapshot (List Only)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.evidenceItems ? (
              <div className="prose prose-sm max-w-none text-foreground">
                <p className="whitespace-pre-wrap">{data.evidenceItems}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">No evidence items listed</p>
            )}
            <p className="text-xs text-muted-foreground mt-4 italic">
              Note: No files or documents are attached. Evidence will be provided only after conflict clearance.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              5. Injuries / Damages and Requested Outcome
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Injuries / Damages</p>
              <p className="text-sm whitespace-pre-wrap">{data.injuriesDamages}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Requested Outcome</p>
              <p className="text-sm whitespace-pre-wrap">{data.requestedOutcome}</p>
            </div>
          </CardContent>
        </Card>

        {/* Section 6: Deadlines Awareness */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              6. Deadline Awareness
            </CardTitle>
          </CardHeader>
          <CardContent>
            {statuteInfo ? (
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Incident Date: </span>
                  <span className="font-medium">{statuteInfo.incidentDate}</span>
                </div>
                <div className="p-3 rounded-lg bg-warning/5 border border-warning/20">
                  <p className="font-medium text-sm mb-2">Estimated Deadline Windows:</p>
                  <ul className="text-xs space-y-1 text-muted-foreground">
                    <li>• WA State Tort Claim Notice: <strong>{statuteInfo.tortDeadline}</strong> (60 days)</li>
                    <li>• Federal §1983 Claim: <strong>{statuteInfo.section1983Deadline}</strong> (3 years)</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-2 italic">
                    These are estimates only. Actual deadlines depend on specific circumstances.
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Specific incident date not provided. Please consult an attorney to determine applicable deadlines.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Section 7: Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              7. Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-muted-foreground">Name</dt>
                <dd className="font-medium flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {data.contactName}
                </dd>
              </div>
              {data.contactEmail && (
                <div>
                  <dt className="text-muted-foreground">Email</dt>
                  <dd className="font-medium flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {data.contactEmail}
                  </dd>
                </div>
              )}
              {data.contactPhone && (
                <div>
                  <dt className="text-muted-foreground">Phone</dt>
                  <dd className="font-medium flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {data.contactPhone}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-muted-foreground">Preferred Contact Method</dt>
                <dd className="font-medium capitalize">{data.contactPreferredMethod}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        {/* Footer Disclaimer */}
        <div className="p-4 rounded-xl bg-muted/50 border border-border text-center">
          <p className="text-xs text-muted-foreground">
            This document is for educational and informational purposes only. 
            It does not constitute legal advice and does not create an attorney-client relationship. 
            Consult with a licensed attorney for legal guidance specific to your situation.
          </p>
        </div>
      </div>
    </div>
  );
}

function generatePlainText(
  data: IntakeFormData, 
  attorneyName?: string, 
  attorneyFirm?: string
): string {
  const lines: string[] = [];
  
  lines.push("═".repeat(60));
  lines.push("ATTORNEY INTAKE PACKET");
  lines.push("═".repeat(60));
  lines.push("");
  lines.push("⚠️  INITIAL INQUIRY ONLY — CONFLICT CHECK REQUIRED");
  lines.push("Do not send evidence until attorney confirms no conflict of interest.");
  lines.push("");
  lines.push(`Generated: ${format(new Date(), "MMMM d, yyyy 'at' h:mm a")}`);
  if (attorneyName) {
    lines.push(`Prepared for: ${attorneyName}${attorneyFirm ? `, ${attorneyFirm}` : ""}`);
  }
  lines.push("");
  
  lines.push("─".repeat(60));
  lines.push("1. CASE OVERVIEW");
  lines.push("─".repeat(60));
  lines.push(`Case Name: ${data.caseName}`);
  lines.push(`County: ${data.county} County, Washington`);
  lines.push(`Incident Month/Year: ${data.incidentMonthYear}`);
  lines.push(`Issue Type: ${ISSUE_TYPE_LABELS[data.issueType] || data.issueType}`);
  lines.push(`Opposing Party: ${data.opposingParty}`);
  lines.push(`Parties Involved (Full Names): ${data.partiesInvolved}`);
  lines.push(`Agencies Involved: ${data.agenciesInvolved}`);
  lines.push(`Jurisdiction / Location: ${data.jurisdictionLocation}`);
  lines.push(`Case Status: ${data.caseStatus}`);
  lines.push("");
  
  lines.push("─".repeat(60));
  lines.push("2. FACTUAL NARRATIVE (NEUTRAL SUMMARY)");
  lines.push("─".repeat(60));
  lines.push(data.narrative);
  lines.push("");
  
  lines.push("─".repeat(60));
  lines.push("3. APPLICABLE ISSUES");
  lines.push("─".repeat(60));
  data.issuesChecklist.forEach((issue) => lines.push(`• ${issue}`));
  lines.push("");
  
  lines.push("─".repeat(60));
  lines.push("4. EVIDENCE SNAPSHOT (List Only)");
  lines.push("─".repeat(60));
  lines.push(data.evidenceItems || "No evidence items listed");
  lines.push("Note: No files attached. Evidence provided after conflict clearance.");
  lines.push("");
  
  lines.push("─".repeat(60));
  lines.push("5. INJURIES / DAMAGES AND REQUESTED OUTCOME");
  lines.push("─".repeat(60));
  lines.push(`Injuries / Damages: ${data.injuriesDamages}`);
  lines.push(`Requested Outcome: ${data.requestedOutcome}`);
  lines.push("");

  lines.push("─".repeat(60));
  lines.push("6. DEADLINE AWARENESS");
  lines.push("─".repeat(60));
  if (data.incidentDate) {
    lines.push(`Incident Date: ${data.incidentDate}`);
    lines.push("See attorney for specific deadline calculations.");
  } else {
    lines.push("Specific incident date not provided.");
  }
  lines.push("");
  
  lines.push("─".repeat(60));
  lines.push("7. CONTACT INFORMATION");
  lines.push("─".repeat(60));
  lines.push(`Name: ${data.contactName}`);
  if (data.contactEmail) lines.push(`Email: ${data.contactEmail}`);
  if (data.contactPhone) lines.push(`Phone: ${data.contactPhone}`);
  lines.push(`Preferred Contact: ${data.contactPreferredMethod}`);
  lines.push("");
  
  lines.push("═".repeat(60));
  lines.push("DISCLAIMER: This document is for educational and informational");
  lines.push("purposes only. It does not constitute legal advice.");
  lines.push("═".repeat(60));
  
  return lines.join("\n");
}
