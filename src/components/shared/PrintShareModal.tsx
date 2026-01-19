import { useState } from "react";
import { Printer, Download, Link2, X, Check } from "lucide-react";
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
}

export function PrintShareModal({
  open,
  onOpenChange,
  title,
  pageUrl,
  printContent
}: PrintShareModalProps) {
  const [copied, setCopied] = useState(false);

  const currentUrl = pageUrl || window.location.href;

  const handlePrint = () => {
    if (printContent) {
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
              @media print {
                body { padding: 0; }
              }
            </style>
          </head>
          <body>
            <h1>${title}</h1>
            <div>${printContent}</div>
            <hr style="margin-top: 2rem; border: none; border-top: 1px solid #ccc;">
            <p style="font-size: 0.75rem; color: #666; margin-top: 1rem;">
              This document is for educational purposes only. It is not legal advice.
            </p>
          </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    } else {
      window.print();
    }
    onOpenChange(false);
  };

  const handleDownload = () => {
    const content = printContent || `${title}\n\nVisit: ${currentUrl}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}-decoded-justice.txt`;
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-foreground">
            Print or Share
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 pt-2">
          <button
            onClick={handlePrint}
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-muted/50 hover:border-accent/30 transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
              <Printer className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="font-medium text-foreground">Print-friendly version</p>
              <p className="text-sm text-muted-foreground">Opens print dialog</p>
            </div>
          </button>

          <button
            onClick={handleCopyLink}
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-muted/50 hover:border-accent/30 transition-all text-left group"
          >
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
              {copied ? (
                <Check className="w-5 h-5 text-success" />
              ) : (
                <Link2 className="w-5 h-5 text-accent" />
              )}
            </div>
            <div>
              <p className="font-medium text-foreground">
                {copied ? "Copied!" : "Copy private link"}
              </p>
              <p className="text-sm text-muted-foreground">Share this page</p>
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
              <p className="font-medium text-foreground">Download text version</p>
              <p className="text-sm text-muted-foreground">Save as .txt file</p>
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