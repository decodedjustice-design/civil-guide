import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle, Copy, Check, Shield } from "lucide-react";
import { WA_COUNTIES, PRACTICE_AREAS } from "@/data/attorneyData";

interface SafeCaseSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  attorneyName: string;
  firmName: string;
}

export function SafeCaseSummaryModal({ 
  isOpen, 
  onClose, 
  attorneyName,
  firmName 
}: SafeCaseSummaryModalProps) {
  const [name, setName] = useState("");
  const [county, setCounty] = useState("");
  const [issueType, setIssueType] = useState("");
  const [opposingAgency, setOpposingAgency] = useState("");
  const [incidentMonth, setIncidentMonth] = useState("");
  const [incidentYear, setIncidentYear] = useState("");
  const [copied, setCopied] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const isFormComplete = name && county && issueType && opposingAgency && incidentMonth && incidentYear;

  const generateSummary = () => {
    return `Case Inquiry for ${firmName}

Name: ${name}
Location: ${county} County, Washington
Issue Type: ${issueType}
Opposing Party: ${opposingAgency}
Timeframe: ${incidentMonth} ${incidentYear}

---
Generated via Decoded Justice (Educational Platform)
This is an initial inquiry only. No evidence attached.`;
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generateSummary());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerate = () => {
    if (isFormComplete) {
      setShowSummary(true);
    }
  };

  const handleClose = () => {
    setName("");
    setCounty("");
    setIssueType("");
    setOpposingAgency("");
    setIncidentMonth("");
    setIncidentYear("");
    setShowSummary(false);
    setCopied(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent" />
            Generate Safe Case Summary
          </DialogTitle>
          <DialogDescription>
            Create a brief summary to share with {attorneyName} at {firmName}.
          </DialogDescription>
        </DialogHeader>

        {/* Warning Banner */}
        <div className="p-4 rounded-xl bg-warning/10 border border-warning/30">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground mb-1">
                Important Safety Reminder
              </p>
              <p className="text-xs text-muted-foreground">
                Do not send evidence until the attorney confirms there is no conflict of interest. 
                This summary contains only basic information for initial contact.
              </p>
            </div>
          </div>
        </div>

        {!showSummary ? (
          <div className="space-y-4 py-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
              />
            </div>

            {/* County */}
            <div className="space-y-2">
              <Label htmlFor="county">County</Label>
              <Select value={county} onValueChange={setCounty}>
                <SelectTrigger>
                  <SelectValue placeholder="Select county" />
                </SelectTrigger>
                <SelectContent>
                  {WA_COUNTIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Issue Type */}
            <div className="space-y-2">
              <Label htmlFor="issueType">Issue Type (High Level)</Label>
              <Select value={issueType} onValueChange={setIssueType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select issue type" />
                </SelectTrigger>
                <SelectContent>
                  {PRACTICE_AREAS.map((area) => (
                    <SelectItem key={area} value={area}>{area}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Opposing Agency */}
            <div className="space-y-2">
              <Label htmlFor="opposingAgency">Opposing Agency / Party</Label>
              <Input
                id="opposingAgency"
                value={opposingAgency}
                onChange={(e) => setOpposingAgency(e.target.value)}
                placeholder="e.g., Seattle Police Department, King County DCYF"
              />
            </div>

            {/* Incident Date */}
            <div className="space-y-2">
              <Label>Incident Month & Year</Label>
              <div className="grid grid-cols-2 gap-3">
                <Select value={incidentMonth} onValueChange={setIncidentMonth}>
                  <SelectTrigger>
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={incidentYear} onValueChange={setIncidentYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((y) => (
                      <SelectItem key={y} value={y.toString()}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={!isFormComplete}
              className="w-full"
              variant="hero"
            >
              Generate Summary
            </Button>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            {/* Generated Summary */}
            <div className="p-4 rounded-xl bg-secondary/50 border border-border">
              <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">
                {generateSummary()}
              </pre>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setShowSummary(false)}>
                Edit Information
              </Button>
              <Button onClick={handleCopy} variant="hero">
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy to Clipboard
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
