import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FileText, Sparkles, HelpCircle, AlertTriangle, Copy, Check, BookOpen, Upload, Calendar, ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { useToast } from "@/hooks/use-toast";

interface DecodedResult {
  plainLanguage: string;
  keyTerms: { term: string; definition: string }[];
  documentType: string;
  datesAndDeadlines: string[];
  commonMisunderstandings: string[];
  questionsToAsk: string[];
  nextActions: { label: string; href: string }[];
}

export default function LegalDecoder() {
  const [inputText, setInputText] = useState("");
  const [isDecoding, setIsDecoding] = useState(false);
  const [result, setResult] = useState<DecodedResult | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast({ title: "Invalid file", description: "Please upload a PDF file", variant: "destructive" });
      return;
    }

    toast({ title: "Processing PDF", description: "Extracting text from your document..." });

    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(" ");
        fullText += pageText + "\n\n";
      }

      setInputText(fullText.trim());
      toast({ title: "PDF processed", description: "Text extracted successfully. Click 'Decode Text' to analyze." });
    } catch (err) {
      toast({ title: "Error", description: "Could not extract text from PDF", variant: "destructive" });
    }
  };

  const handleDecode = async () => {
    if (!inputText.trim()) return;
    
    setIsDecoding(true);
    
    // Simulate decoding with enhanced output
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Extract potential dates from text
    const datePatterns = inputText.match(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}|\w+ \d{1,2},? \d{4}|within \d+ days?|by \w+ \d{1,2})/gi) || [];
    const deadlinePhrases = inputText.match(/(must respond|deadline|due date|within \d+ days|no later than|expires?|by \w+ \d{1,2})/gi) || [];
    
    setResult({
      plainLanguage: "This document appears to be a formal notice regarding your legal rights. It outlines specific timelines and procedures you may need to follow. The language indicates this is likely an official document from a government agency or court.",
      keyTerms: [
        { term: "Due Process", definition: "Your right to fair treatment through the judicial system, including notice and an opportunity to be heard." },
        { term: "Statute of Limitations", definition: "The time limit within which legal action must be taken." },
        { term: "Notice", definition: "Formal communication informing you of something important." },
        { term: "Service", definition: "The legal delivery of documents to a person or party involved in a case." },
      ],
      documentType: "Official Legal Notice",
      datesAndDeadlines: datePatterns.length > 0 || deadlinePhrases.length > 0
        ? [...new Set([...datePatterns, ...deadlinePhrases])].slice(0, 5)
        : ["No specific dates detected — review carefully for any mentioned deadlines"],
      commonMisunderstandings: [
        "This notice does not mean you've lost your case — it's informing you of a process.",
        "Timelines in legal documents are usually strict deadlines, not suggestions.",
        "Receiving this document does not mean you need to hire an attorney immediately, but you may want to consult one.",
      ],
      questionsToAsk: [
        "What is the deadline mentioned in this document?",
        "What happens if I don't respond by the deadline?",
        "Is there a way to request an extension?",
        "Should I respond in writing or is there another method?",
        "Are there any costs or fees associated with responding?",
      ],
      nextActions: [
        { label: "Document your response notes", href: "/notes" },
        { label: "Add to your timeline", href: "/timeline" },
        { label: "Learn about your rights", href: "/rights-insight" },
        { label: "Find legal help", href: "/find-help" },
      ],
    });
    
    setIsDecoding(false);
  };

  const handleCopy = () => {
    if (!result) return;
    
    const text = `
LEGAL DECODER SUMMARY
=====================

Plain Language Explanation:
${result.plainLanguage}

Document Type: ${result.documentType}

Dates & Deadline Phrases Found:
${result.datesAndDeadlines.map(d => `• ${d}`).join('\n')}

Key Terms:
${result.keyTerms.map(t => `• ${t.term}: ${t.definition}`).join('\n')}

Common Misunderstandings:
${result.commonMisunderstandings.map(m => `• ${m}`).join('\n')}

Questions to Ask a Professional:
${result.questionsToAsk.map(q => `• ${q}`).join('\n')}

---
Educational use only. Not legal advice.
    `.trim();
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInputText("");
    setResult(null);
  };

  return (
    <Layout>
      <div className="container py-12 lg:py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 mb-6">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Legal Decoder
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Paste text or upload a PDF to get plain-English explanations, key terms, and questions to ask professionals.
            </p>
          </div>

          {/* Input Section */}
          <div className="mb-8">
            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-foreground">
                  Paste your text or upload a PDF
                </label>
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".pdf"
                    onChange={handlePdfUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4" />
                    Upload PDF
                  </Button>
                </div>
              </div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste a legal document, notice, contract clause, or any official language you'd like explained in plain terms..."
                className="w-full h-48 p-4 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              />
              <div className="flex items-center justify-between mt-4">
                <p className="text-xs text-muted-foreground">
                  {inputText.length} characters
                </p>
                <div className="flex gap-3">
                  {inputText && (
                    <Button variant="ghost" size="sm" onClick={handleClear}>
                      Clear
                    </Button>
                  )}
                  <Button 
                    variant="hero" 
                    onClick={handleDecode}
                    disabled={!inputText.trim() || isDecoding}
                  >
                    {isDecoding ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-pulse" />
                        Decoding...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Decode Text
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          {result && (
            <div className="space-y-6 animate-fade-up">
              {/* Plain Language */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    In Plain Language
                  </h2>
                  <Button variant="ghost" size="sm" onClick={handleCopy}>
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Summary
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-foreground leading-relaxed">
                  {result.plainLanguage}
                </p>
                <p className="mt-4 text-sm text-muted-foreground">
                  <strong>Document Type:</strong> {result.documentType}
                </p>
              </div>

              {/* Dates and Deadlines */}
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-warning" />
                  Dates & Deadline Phrases Found
                </h2>
                <p className="text-xs text-muted-foreground mb-4">
                  These are phrases that may indicate important dates. Always verify exact deadlines in the original document.
                </p>
                <div className="space-y-2">
                  {result.datesAndDeadlines.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-warning/10 border border-warning/20">
                      <span className="text-warning">•</span>
                      <span className="text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Terms */}
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-primary" />
                  Key Terms Explained
                </h2>
                <div className="space-y-4">
                  {result.keyTerms.map((item, index) => (
                    <div key={index} className="p-4 rounded-xl bg-secondary/50">
                      <p className="font-medium text-foreground mb-1">{item.term}</p>
                      <p className="text-sm text-muted-foreground">{item.definition}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Common Misunderstandings */}
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  Common Misunderstandings
                </h2>
                <ul className="space-y-3">
                  {result.commonMisunderstandings.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-warning mt-2 shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Questions to Ask */}
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Questions to Ask a Professional
                </h2>
                <ul className="space-y-3">
                  {result.questionsToAsk.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-medium shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Next Actions */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Suggested Next Steps
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.nextActions.map((action, index) => (
                    <Link
                      key={index}
                      to={action.href}
                      className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors group"
                    >
                      <span className="text-foreground group-hover:text-primary transition-colors">{action.label}</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Disclaimer */}
              <Disclaimer variant="prominent" />
            </div>
          )}

          {/* Empty State */}
          {!result && !isDecoding && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Paste text or upload a PDF above to see a plain-language explanation.
              </p>
            </div>
          )}

          {/* Bottom Disclaimer */}
          <div className="mt-12 pt-8 border-t border-border">
            <Disclaimer className="justify-center" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
