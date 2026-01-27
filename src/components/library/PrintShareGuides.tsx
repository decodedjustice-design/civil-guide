import { useState } from "react";
import { FileText, BookOpen, Eye, Download, Printer, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { TopicGuideGenerator } from "./TopicGuideGenerator";

interface GuideOption {
  id: string;
  title: string;
  description: string;
  whenUseful: string[];
  icon: React.ReactNode;
  popular?: boolean;
  previewContent: string;
}

const guideOptions: GuideOption[] = [
  {
    id: "one-page-summary",
    title: "One-Page Summary",
    description: "A concise overview of your rights and key steps, designed for quick reference.",
    whenUseful: [
      "Bringing to a CPS visit or police interaction",
      "Posting on your fridge for quick reference",
      "Giving to a trusted advocate or family member",
      "Reviewing before a court date"
    ],
    icon: <FileText className="w-6 h-6" />,
    popular: true,
    previewContent: `
ONE-PAGE RIGHTS SUMMARY
━━━━━━━━━━━━━━━━━━━━━━

YOUR CORE RIGHTS
• You have the right to remain silent
• You have the right to an attorney
• You have the right to refuse consent to searches
• You have the right to record interactions (in most states)

KEY STEPS TO PROTECT YOURSELF
1. Stay calm and composed
2. Document everything immediately after
3. Get names and badge numbers when possible
4. Contact an attorney before signing documents
5. Request copies of all paperwork

IMPORTANT REMINDERS
• You can pause and take breaks
• You can ask for clarification
• You can request time to consult with someone

EMERGENCY CONTACTS
[Add your attorney, advocate, or trusted contact here]

━━━━━━━━━━━━━━━━━━━━━━
This document is for educational purposes only.
It is not legal advice.
    `
  },
  {
    id: "full-guide",
    title: "Full Multi-Page Guide",
    description: "A comprehensive guide covering rights, processes, timelines, and evidence strategies.",
    whenUseful: [
      "Preparing for a hearing or trial",
      "Understanding a complex system in depth",
      "Building your case documentation",
      "Training advocates or support network"
    ],
    icon: <BookOpen className="w-6 h-6" />,
    previewContent: `
COMPREHENSIVE RIGHTS GUIDE
━━━━━━━━━━━━━━━━━━━━━━

TABLE OF CONTENTS
1. Understanding Your Rights
2. System Overview & Power Structures
3. Timeline & Deadlines
4. Evidence Documentation
5. Key Players & Their Roles
6. Common Pitfalls to Avoid
7. Step-by-Step Action Plan
8. Templates & Checklists
9. Resources & References

SECTION 1: UNDERSTANDING YOUR RIGHTS
[Detailed content about constitutional and statutory rights...]

SECTION 2: SYSTEM OVERVIEW
[How the system operates, who makes decisions...]

SECTION 3: TIMELINES & DEADLINES
[Critical dates and filing requirements...]

[Additional sections continue...]

━━━━━━━━━━━━━━━━━━━━━━
This document is for educational purposes only.
It is not legal advice.
    `
  }
];

export function PrintShareGuides() {
  const [previewOpen, setPreviewOpen] = useState<string | null>(null);

  const handlePrint = (guideId: string) => {
    const guide = guideOptions.find(g => g.id === guideId);
    if (!guide) return;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${guide.title} - Decoded Justice</title>
          <style>
            body {
              font-family: 'Georgia', serif;
              line-height: 1.6;
              max-width: 8.5in;
              margin: 0 auto;
              padding: 0.5in;
              color: #1F2933;
            }
            pre {
              white-space: pre-wrap;
              font-family: inherit;
            }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <pre>${guide.previewContent}</pre>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleDownload = (guideId: string) => {
    const guide = guideOptions.find(g => g.id === guideId);
    if (!guide) return;

    const blob = new Blob([guide.previewContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${guide.id}-decoded-justice.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Guide downloaded successfully");
  };

  const handleShare = async (guideId: string) => {
    const guide = guideOptions.find(g => g.id === guideId);
    if (!guide) return;

    const shareUrl = `${window.location.origin}/library?guide=${guideId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${guide.title} - Decoded Justice`,
          text: guide.description,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or share failed, copy to clipboard instead
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard");
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard");
    }
  };

  return (
    <div>
      {/* Quick Reference Guides */}
      <section className="py-12 bg-soft-slate/30 rounded-2xl mb-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3">
              Quick Reference Guides
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Take your rights with you. These guides are designed to be calm, clear, and printer-friendly — 
              perfect for court, CPS visits, housing meetings, and advocacy.
            </p>
            <p className="text-sm text-muted-foreground/70 mt-2">
              You can pause anytime. These resources will be here when you're ready.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
            {guideOptions.map((guide) => (
              <Card 
                key={guide.id} 
                className="relative bg-white border-border hover:border-primary/30 hover:shadow-warm transition-all"
              >
                {guide.popular && (
                  <div className="absolute -top-3 left-4">
                    <span className="bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {guide.icon}
                    </div>
                  </div>
                  <CardTitle className="text-lg text-foreground">
                    {guide.title}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {guide.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs font-medium text-primary uppercase tracking-wide mb-2">
                      When it's useful
                    </p>
                    <ul className="space-y-1">
                      {guide.whenUseful.map((use, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{use}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-border space-y-2">
                    {/* Preview Button */}
                    <Dialog open={previewOpen === guide.id} onOpenChange={(open) => setPreviewOpen(open ? guide.id : null)}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start gap-2 text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          Preview
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-primary">{guide.title}</DialogTitle>
                          <DialogDescription>
                            Preview of what will be printed or downloaded
                          </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 p-6 bg-white border border-border rounded-lg font-serif">
                          <pre className="whitespace-pre-wrap text-sm text-charcoal leading-relaxed">
                            {guide.previewContent}
                          </pre>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button 
                            onClick={() => handlePrint(guide.id)}
                            className="flex-1 gap-2"
                          >
                            <Printer className="w-4 h-4" />
                            Print
                          </Button>
                          <Button 
                            variant="outline"
                            onClick={() => handleDownload(guide.id)}
                            className="flex-1 gap-2"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Action Buttons Row */}
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1 gap-1.5 text-xs"
                        onClick={() => handleDownload(guide.id)}
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1 gap-1.5 text-xs"
                        onClick={() => handlePrint(guide.id)}
                      >
                        <Printer className="w-3.5 h-3.5" />
                        Print
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1 gap-1.5 text-xs"
                        onClick={() => handleShare(guide.id)}
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        Share
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground/60 max-w-xl mx-auto">
              These materials are for educational purposes only and do not constitute legal advice. 
              For legal guidance, please consult with a qualified attorney.
            </p>
          </div>
        </div>
      </section>

      {/* Topic Guide Generator */}
      <TopicGuideGenerator />
    </div>
  );
}
