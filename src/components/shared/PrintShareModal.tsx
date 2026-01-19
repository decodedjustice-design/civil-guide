import { useState } from "react";
import { Printer, Download, Link2, Check, FileText, BookOpen, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface PrintShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  pageUrl?: string;
  printContent?: string;
  // For Analyzer integration
  savedResultId?: string;
  systemId?: string;
  systemLabel?: string;
}

type SourceType = "analyzer" | "rights-insight" | "library";
type FormatType = "summary" | "full" | "handout";

export function PrintShareModal({
  open,
  onOpenChange,
  title,
  pageUrl,
  printContent,
  savedResultId,
  systemId,
  systemLabel
}: PrintShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [selectedSource, setSelectedSource] = useState<SourceType>(savedResultId ? "analyzer" : "rights-insight");
  const [selectedFormat, setSelectedFormat] = useState<FormatType>("summary");

  const currentUrl = pageUrl || window.location.href;
  const isFromAnalyzer = !!savedResultId || !!systemId;

  const sources = [
    { id: "analyzer" as SourceType, label: "My Analyzer Result", icon: BarChart3, disabled: !isFromAnalyzer },
    { id: "rights-insight" as SourceType, label: "Rights Insight topic", icon: BookOpen, disabled: false },
    { id: "library" as SourceType, label: "Library guide", icon: FileText, disabled: false },
  ];

  const formats = [
    { id: "summary" as FormatType, label: "Page Summary", description: "Key points only" },
    { id: "full" as FormatType, label: "Full Guide", description: "Complete content" },
    { id: "handout" as FormatType, label: "Resource Handout", description: "For sharing with others" },
  ];

  const generatePrintContent = () => {
    let content = "";
    const now = new Date().toLocaleDateString();

    if (selectedSource === "analyzer" && systemLabel) {
      content = `
ANALYZER RESULTS
Generated: ${now}

SYSTEM: ${systemLabel}
${savedResultId ? `Reference ID: ${savedResultId}` : ""}

---

This document summarizes your Analyzer results from Decoded Justice.
It is for educational purposes only and is not legal advice.

For the full interactive version with all details and tools, visit:
${currentUrl}

---

KEY TAKEAWAYS:

1. Preserve your records
   Write down what happened. Save any documents, messages, or photos.

2. Track any deadlines  
   Many systems have short windows to respond. Missing them can close options.

3. Take care of yourself
   This process is stressful. Pausing to regroup is okay.

---

NEXT STEPS:

• Review the full analysis at decodedjustice.lovable.app/analyzer
• Explore Rights Insight for system intelligence
• Use the Evidence Vault to organize your documentation

---

This document is for educational purposes only. 
It is not legal advice. Consult an attorney for legal guidance.
      `;
    } else if (selectedSource === "rights-insight") {
      content = `
RIGHTS INSIGHT
Topic: ${title}
Generated: ${now}

---

This document contains educational information from Decoded Justice's Rights Insight section.

Visit ${currentUrl} for the full interactive content.

---

This document is for educational purposes only.
It is not legal advice. Consult an attorney for legal guidance.
      `;
    } else {
      content = `
LIBRARY GUIDE
Topic: ${title}
Generated: ${now}

---

This document contains educational information from Decoded Justice's Library.

Visit ${currentUrl} for the full interactive content.

---

This document is for educational purposes only.
It is not legal advice. Consult an attorney for legal guidance.
      `;
    }

    return content.trim();
  };

  const handlePrint = () => {
    const content = printContent || generatePrintContent();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${title} - Decoded Justice</title>
          <style>
            body {
              font-family: 'Georgia', serif;
              line-height: 1.8;
              max-width: 7.5in;
              margin: 0 auto;
              padding: 0.75in;
              color: #1F2933;
            }
            h1 { font-size: 1.5rem; margin-bottom: 1rem; }
            pre { white-space: pre-wrap; font-family: inherit; }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <pre>${content}</pre>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
    onOpenChange(false);
  };

  const handleDownload = () => {
    const content = printContent || generatePrintContent();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const fileName = `${title.toLowerCase().replace(/\s+/g, '-')}-${selectedFormat}-decoded-justice.txt`;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Downloaded successfully");
    onOpenChange(false);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy link");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-foreground">
            Print or Share
          </DialogTitle>
        </DialogHeader>
        
        {/* Step 1: Choose Source */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">1. Choose what to print</h4>
          <div className="space-y-2">
            {sources.map((source) => (
              <button
                key={source.id}
                onClick={() => !source.disabled && setSelectedSource(source.id)}
                disabled={source.disabled}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                  selectedSource === source.id
                    ? "border-accent bg-accent/5"
                    : source.disabled
                    ? "border-border bg-muted/30 opacity-50 cursor-not-allowed"
                    : "border-border hover:border-accent/50"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  selectedSource === source.id ? "bg-accent/20" : "bg-muted"
                }`}>
                  <source.icon className={`w-4 h-4 ${
                    selectedSource === source.id ? "text-accent" : "text-muted-foreground"
                  }`} />
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${
                    selectedSource === source.id ? "text-accent" : "text-foreground"
                  }`}>
                    {source.label}
                  </span>
                  {selectedSource === source.id && (
                    <Check className="w-4 h-4 text-accent" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Choose Format */}
        <div className="space-y-3 pt-2">
          <h4 className="text-sm font-medium text-foreground">2. Choose format</h4>
          <div className="grid grid-cols-3 gap-2">
            {formats.map((format) => (
              <button
                key={format.id}
                onClick={() => setSelectedFormat(format.id)}
                className={`p-3 rounded-lg border transition-all text-center ${
                  selectedFormat === format.id
                    ? "border-accent bg-accent/5"
                    : "border-border hover:border-accent/50"
                }`}
              >
                <span className={`text-sm font-medium block ${
                  selectedFormat === format.id ? "text-accent" : "text-foreground"
                }`}>
                  {format.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  {format.description}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Actions */}
        <div className="space-y-2 pt-4 border-t border-border">
          <button
            onClick={handlePrint}
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-muted/50 hover:border-accent/30 transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
              <Printer className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="font-medium text-foreground">Print</p>
              <p className="text-sm text-muted-foreground">Opens print dialog</p>
            </div>
          </button>

          <button
            onClick={handleDownload}
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-muted/50 hover:border-accent/30 transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
              <Download className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="font-medium text-foreground">Download PDF</p>
              <p className="text-sm text-muted-foreground">Save as text file</p>
            </div>
          </button>

          <button
            onClick={handleCopyLink}
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-muted/50 hover:border-accent/30 transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
              {copied ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <Link2 className="w-5 h-5 text-accent" />
              )}
            </div>
            <div>
              <p className="font-medium text-foreground">
                {copied ? "Copied!" : "Share Link"}
              </p>
              <p className="text-sm text-muted-foreground">Copy private link</p>
            </div>
          </button>
        </div>

        <p className="text-xs text-muted-foreground/70 text-center pt-2">
          These materials are for educational purposes only.
        </p>
      </DialogContent>
    </Dialog>
  );
}
