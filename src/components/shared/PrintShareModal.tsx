import { useState, useMemo } from "react";
import { Printer, Download, Link2, Check, FileText, BookOpen, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { educationalGuides } from "@/data/educationalGuides";
import { libraryContent } from "@/data/libraryContent";

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

interface TopicOption {
  id: string;
  title: string;
  url: string;
  source: "rights-insight" | "library";
}

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
  const [selectedTopic, setSelectedTopic] = useState<TopicOption | null>(null);

  const currentUrl = pageUrl || window.location.href;
  const isFromAnalyzer = !!savedResultId || !!systemId;

  // Generate available topics based on selected source
  const availableTopics = useMemo((): TopicOption[] => {
    if (selectedSource === "rights-insight") {
      // Generate topics from library content sections (Rights Insight uses libraryContent)
      const topics: TopicOption[] = [];
      libraryContent.forEach(section => {
        section.subsections.forEach(subsection => {
          topics.push({
            id: `${section.id}-${subsection.id}`,
            title: `${section.title}: ${subsection.title}`,
            url: `/rights-insight?section=${section.id}&subsection=${subsection.id}`,
            source: "rights-insight"
          });
        });
      });
      return topics;
    } else if (selectedSource === "library") {
      // Generate topics from educational guides
      return educationalGuides.map(guide => ({
        id: guide.id,
        title: guide.title,
        url: `/guide/${guide.id}`,
        source: "library" as const
      }));
    }
    return [];
  }, [selectedSource]);

  // Determine if topic selection is required and if we can proceed
  const isTopicRequired = selectedSource !== "analyzer";
  const canProceed = !isTopicRequired || selectedTopic !== null;

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

  // Reset topic selection when source changes
  const handleSourceChange = (sourceId: SourceType) => {
    setSelectedSource(sourceId);
    setSelectedTopic(null);
  };

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
    } else if (selectedSource === "rights-insight" && selectedTopic) {
      const baseUrl = window.location.origin;
      content = `
RIGHTS INSIGHT
Topic: ${selectedTopic.title}
Generated: ${now}

---

This document contains educational information from Decoded Justice's Rights Insight section.

View full interactive version:
${baseUrl}${selectedTopic.url}

---

This document is for educational purposes only.
It is not legal advice. Consult an attorney for legal guidance.
      `;
    } else if (selectedSource === "library" && selectedTopic) {
      const baseUrl = window.location.origin;
      content = `
LIBRARY GUIDE
Topic: ${selectedTopic.title}
Generated: ${now}

---

This document contains educational information from Decoded Justice's Library.

View full interactive version:
${baseUrl}${selectedTopic.url}

---

This document is for educational purposes only.
It is not legal advice. Consult an attorney for legal guidance.
      `;
    }

    return content.trim();
  };

  const handlePrint = () => {
    if (!canProceed) return;
    
    const content = printContent || generatePrintContent();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const printTitle = selectedTopic?.title || title;
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${printTitle} - Decoded Justice</title>
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
    if (!canProceed) return;
    
    const content = printContent || generatePrintContent();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const downloadTitle = selectedTopic?.title || title;
    const fileName = `${downloadTitle.toLowerCase().replace(/\s+/g, '-')}-${selectedFormat}-decoded-justice.txt`;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Downloaded successfully");
    onOpenChange(false);
  };

  const handleCopyLink = async () => {
    if (!canProceed) return;
    
    try {
      const linkUrl = selectedTopic 
        ? `${window.location.origin}${selectedTopic.url}` 
        : currentUrl;
      await navigator.clipboard.writeText(linkUrl);
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy link");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
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
                onClick={() => !source.disabled && handleSourceChange(source.id)}
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

        {/* Step 2: Choose Topic (Required for Rights Insight / Library) */}
        {isTopicRequired && (
          <div className="space-y-3 pt-2">
            <h4 className="text-sm font-medium text-foreground">
              2. Choose a specific topic <span className="text-destructive">*</span>
            </h4>
            
            {availableTopics.length === 0 ? (
              <p className="text-sm text-muted-foreground p-3 bg-muted/30 rounded-lg">
                No topics available. Open a topic or guide first to enable printing.
              </p>
            ) : (
              <select
                className="w-full border border-border rounded-lg p-3 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent"
                value={selectedTopic?.id || ""}
                onChange={(e) => {
                  const topic = availableTopics.find(t => t.id === e.target.value);
                  setSelectedTopic(topic || null);
                }}
              >
                <option value="">Select a topic…</option>
                {availableTopics.map(topic => (
                  <option key={topic.id} value={topic.id}>
                    {topic.title}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        {/* Step 3: Choose Format */}
        <div className="space-y-3 pt-2">
          <h4 className="text-sm font-medium text-foreground">
            {isTopicRequired ? "3. Choose format" : "2. Choose format"}
          </h4>
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

        {/* Step 4: Actions */}
        <div className="space-y-2 pt-4 border-t border-border">
          <button
            onClick={handlePrint}
            disabled={!canProceed}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left group ${
              canProceed 
                ? "border-border bg-card hover:bg-muted/50 hover:border-accent/30 cursor-pointer" 
                : "border-border bg-muted/30 opacity-50 cursor-not-allowed"
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
              canProceed ? "bg-accent/10 group-hover:bg-accent/20" : "bg-muted"
            }`}>
              <Printer className={`w-5 h-5 ${canProceed ? "text-accent" : "text-muted-foreground"}`} />
            </div>
            <div>
              <p className={`font-medium ${canProceed ? "text-foreground" : "text-muted-foreground"}`}>Print</p>
              <p className="text-sm text-muted-foreground">Opens print dialog</p>
            </div>
          </button>

          <button
            onClick={handleDownload}
            disabled={!canProceed}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left group ${
              canProceed 
                ? "border-border bg-card hover:bg-muted/50 hover:border-accent/30 cursor-pointer" 
                : "border-border bg-muted/30 opacity-50 cursor-not-allowed"
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
              canProceed ? "bg-accent/10 group-hover:bg-accent/20" : "bg-muted"
            }`}>
              <Download className={`w-5 h-5 ${canProceed ? "text-accent" : "text-muted-foreground"}`} />
            </div>
            <div>
              <p className={`font-medium ${canProceed ? "text-foreground" : "text-muted-foreground"}`}>Download</p>
              <p className="text-sm text-muted-foreground">Save as text file</p>
            </div>
          </button>

          <button
            onClick={handleCopyLink}
            disabled={!canProceed}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left group ${
              canProceed 
                ? "border-border bg-card hover:bg-muted/50 hover:border-accent/30 cursor-pointer" 
                : "border-border bg-muted/30 opacity-50 cursor-not-allowed"
            }`}
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
              canProceed ? "bg-accent/10 group-hover:bg-accent/20" : "bg-muted"
            }`}>
              {copied ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <Link2 className={`w-5 h-5 ${canProceed ? "text-accent" : "text-muted-foreground"}`} />
              )}
            </div>
            <div>
              <p className={`font-medium ${canProceed ? "text-foreground" : "text-muted-foreground"}`}>
                {copied ? "Copied!" : "Share Link"}
              </p>
              <p className="text-sm text-muted-foreground">Copy private link</p>
            </div>
          </button>

          {/* Inline explanation when actions are blocked */}
          {!canProceed && (
            <p className="text-sm text-muted-foreground text-center pt-2 px-4">
              Please select a specific topic or guide to print or share.
            </p>
          )}
        </div>

        <p className="text-xs text-muted-foreground/70 text-center pt-2">
          These materials are for educational purposes only.
        </p>
      </DialogContent>
    </Dialog>
  );
}
