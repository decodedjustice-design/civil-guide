import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileText, Sparkles, HelpCircle, Copy, Check, BookOpen, Upload, Calendar, ArrowRight, Save, FileBox, Bookmark, Eye, EyeOff, Lightbulb, Heart } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { SafetyBanner } from "@/components/SafetyBanner";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import heroImage from "@/assets/hero-analysis.png";
import { sanitizeSafetyLanguage } from "@/legal/applySafetyLanguage";

interface DecodedResult {
  plainLanguageSummary: string;
  bulletPoints: string[];
  documentType: string;
  keyTerms: { term: string; explanation: string }[];
  datesAndDeadlines: { phrase: string; context: string }[];
  systemInsights: string[];
  questionsForProfessional: string[];
}

export default function LegalDecoder() {
  const [inputText, setInputText] = useState("");
  const [isDecoding, setIsDecoding] = useState(false);
  const [result, setResult] = useState<DecodedResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [showExtractedText, setShowExtractedText] = useState(false);
  const [extractedFromPdf, setExtractedFromPdf] = useState(false);
  const [selectedPdfName, setSelectedPdfName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    // Allow selecting the same file again later
    e.target.value = "";

    if (!file) return;

    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
      return;
    }

    setSelectedPdfName(file.name);
    setExtractedFromPdf(false);
    setShowExtractedText(false);

    toast({ title: "PDF selected", description: `Reading “${file.name}”…` });

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

      const trimmed = fullText.trim();
      setInputText(trimmed);
      setExtractedFromPdf(true);
      setShowExtractedText(true);

      toast({
        title: "PDF processed",
        description: trimmed
          ? "Text extracted successfully. You can now decode the document."
          : "We couldn’t extract readable text from this PDF (it may be scanned).",
        variant: trimmed ? "default" : "destructive",
      });
    } catch (err) {
      toast({
        title: "PDF error",
        description: "Could not extract text from this PDF.",
        variant: "destructive",
      });
    }
  };

  const handleDecode = async () => {
    if (!inputText.trim()) {
      toast({ title: "Nothing to decode", description: "Paste text or upload a PDF first." });
      return;
    }

    // Require login to use the decoder (avoid silent failure / 401)
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to decode a document." });
      navigate("/auth?redirect=/legal-decoder");
      return;
    }

    setIsDecoding(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("decode-document", {
        body: { documentText: inputText },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setResult(sanitizeSafetyLanguage(data));
    } catch (err: any) {
      console.error("Decode error:", err);
      toast({
        title: "Analysis failed",
        description: err?.message || "Could not analyze the document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDecoding(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    
    const text = `
JUSTICE DECODER SUMMARY
=======================

Plain Language Summary:
${result.plainLanguageSummary}

Key Points:
${result.bulletPoints.map(p => `• ${p}`).join('\n')}

Document Type: ${result.documentType}

Dates & Deadline Phrases Found:
${result.datesAndDeadlines.length > 0 
  ? result.datesAndDeadlines.map(d => `• "${d.phrase}" — ${d.context}`).join('\n')
  : '• No specific dates detected'}

Key Terms:
${result.keyTerms.map(t => `• ${t.term}: ${t.explanation}`).join('\n')}

What the System Knows (But People Often Don't):
${result.systemInsights.map(i => `• ${i}`).join('\n')}

Questions You May Want to Ask a Professional:
${result.questionsForProfessional.map((q, i) => `${i + 1}. ${q}`).join('\n')}

---
Educational use only. Not legal advice.
    `.trim();
    
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast({ title: "Copied", description: "Summary copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToNotes = async () => {
    if (!user) {
      navigate("/auth?redirect=/legal-decoder");
      return;
    }
    if (!result) return;

    const noteContent = `
## Document Type: ${result.documentType}

### Summary
${result.plainLanguageSummary}

### Key Points
${result.bulletPoints.map(p => `- ${p}`).join('\n')}

### Key Terms
${result.keyTerms.map(t => `**${t.term}**: ${t.explanation}`).join('\n\n')}

### Dates & Deadlines
${result.datesAndDeadlines.length > 0 
  ? result.datesAndDeadlines.map(d => `- "${d.phrase}" — ${d.context}`).join('\n')
  : 'No specific dates detected'}

### Questions for a Professional
${result.questionsForProfessional.map((q, i) => `${i + 1}. ${q}`).join('\n')}

---
*Decoded on ${new Date().toLocaleDateString()}*
    `.trim();

    try {
      const { error } = await supabase.from("notes").insert({
        user_id: user.id,
        title: `Decoded: ${result.documentType}`,
        content: noteContent,
      });

      if (error) throw error;
      toast({ title: "Saved", description: "Summary saved to your Notes" });
    } catch (err) {
      toast({ title: "Error", description: "Could not save to Notes", variant: "destructive" });
    }
  };

  const handleAddToEvidence = () => {
    if (!user) {
      navigate("/auth?redirect=/legal-decoder");
      return;
    }
    navigate("/evidence-vault");
  };

  const handleBookmark = () => {
    setBookmarked(true);
    toast({ title: "Bookmarked", description: "Explanation saved for this session" });
  };

  const handleClear = () => {
    setInputText("");
    setResult(null);
    setExtractedFromPdf(false);
    setBookmarked(false);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="" 
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-background/40" />
        </div>
        
        <div className="container relative py-12 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-4">
                <FileText className="w-4 h-4" />
                <span>Guided by Clarity</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Justice Decoder
              </h1>
              <p className="text-muted-foreground max-w-xl">
                Paste text or upload a PDF to get plain-language explanations, key terms, and preparation questions for professionals.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-12 lg:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Wellbeing Note */}
          <div className="mb-8 p-4 rounded-xl bg-accent/5 border border-accent/20 flex items-start gap-3">
            <Heart className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Built with empathy.</span> You can pause at any time. This is educational only, and there's no pressure to act right now.
            </p>
          </div>

          {/* Input Section */}
          <div className="mb-8">
            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="flex items-center justify-between mb-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-foreground">
                    Paste your text or upload a PDF
                  </label>
                  {selectedPdfName && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Selected PDF: <span className="font-medium text-foreground">{selectedPdfName}</span>
                    </p>
                  )}
                </div>

                <div className="shrink-0">
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
                    className="hover:border-primary/50"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="w-4 h-4" />
                    Upload PDF
                  </Button>
                </div>
              </div>
              
              {/* Extracted Text Preview (for PDF uploads) */}
              {extractedFromPdf && inputText && (
                <Collapsible open={showExtractedText} onOpenChange={setShowExtractedText} className="mb-4">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-full justify-between">
                      <span className="text-muted-foreground text-xs">Extracted text preview</span>
                      {showExtractedText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-2 p-3 rounded-lg bg-secondary/50 max-h-32 overflow-y-auto">
                      <p className="text-xs text-muted-foreground whitespace-pre-wrap">{inputText.slice(0, 1000)}{inputText.length > 1000 && "..."}</p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}

              <textarea
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  setExtractedFromPdf(false);
                  setSelectedPdfName(null);
                }}
                onKeyDown={(e) => {
                  // Avoid misleading "press Enter" expectations in a textarea.
                  // Provide a reliable shortcut instead.
                  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                    e.preventDefault();
                    void handleDecode();
                  }
                }}
                placeholder="Paste a legal document, notice, contract clause, or any official language you'd like explained in plain terms..."
                className="w-full h-48 p-4 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              />
              <div className="flex items-center justify-between mt-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">{inputText.length} characters</p>
                  <p className="text-xs text-muted-foreground">
                    Tip: press <span className="font-medium text-foreground">Ctrl/⌘ + Enter</span> to decode.
                  </p>
                </div>
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
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Decode Document
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
              <SafetyBanner />
              {/* Plain Language Summary */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Plain-Language Summary
                  </h2>
                </div>
                <p className="text-foreground leading-relaxed mb-4">
                  {result.plainLanguageSummary}
                </p>
                {result.bulletPoints.length > 0 && (
                  <ul className="space-y-2 mt-4">
                    {result.bulletPoints.map((point, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        <span className="text-muted-foreground">{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Document Type */}
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  What This Document Is
                </h2>
                <p className="text-foreground">{result.documentType}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  This is a best-effort classification based on the document's content and language.
                </p>
              </div>

              {/* Key Terms */}
              {result.keyTerms.length > 0 && (
                <div className="p-6 rounded-2xl bg-card border border-border">
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-primary" />
                    Key Terms & Phrases
                  </h2>
                  <div className="space-y-4">
                    {result.keyTerms.map((item, index) => (
                      <div key={index} className="p-4 rounded-xl bg-secondary/50">
                        <p className="font-medium text-foreground mb-1">{item.term}</p>
                        <p className="text-sm text-muted-foreground">{item.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dates and Deadlines */}
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-warning" />
                  Dates & Time-Sensitive Language
                </h2>
                <p className="text-xs text-muted-foreground mb-4">
                  These phrases may indicate important dates. We do not calculate deadlines — always verify in the original document.
                </p>
                {result.datesAndDeadlines.length > 0 ? (
                  <div className="space-y-3">
                    {result.datesAndDeadlines.map((item, index) => (
                      <div key={index} className="p-4 rounded-xl bg-warning/10 border border-warning/20">
                        <p className="font-medium text-foreground">"{item.phrase}"</p>
                        <p className="text-sm text-muted-foreground mt-1">{item.context}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No specific dates or deadline phrases detected in this document.</p>
                )}
              </div>

              {/* System Insights */}
              {result.systemInsights.length > 0 && (
                <div className="p-6 rounded-2xl bg-card border border-border">
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-primary" />
                    What the System Knows (But People Often Don't)
                  </h2>
                  <p className="text-xs text-muted-foreground mb-4">
                    Educational context about how these processes typically work.
                  </p>
                  <ul className="space-y-3">
                    {result.systemInsights.map((insight, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        <span className="text-muted-foreground">{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Questions to Ask */}
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Questions You May Want to Ask a Professional
                </h2>
                <p className="text-xs text-muted-foreground mb-4">
                  Neutral, preparation-focused questions to help you have informed conversations.
                </p>
                <ul className="space-y-3">
                  {result.questionsForProfessional.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-medium shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Organization Actions */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Suggested Organization Actions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    variant="hero"
                    className="justify-start gap-2"
                    onClick={handleSaveToNotes}
                  >
                    <Save className="w-4 h-4" />
                    Save summary to Notes
                  </Button>
                  <Button
                    variant="default"
                    className="justify-start gap-2"
                    onClick={handleAddToEvidence}
                  >
                    <FileBox className="w-4 h-4" />
                    Add document to Evidence Vault
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start gap-2"
                    onClick={handleBookmark}
                    disabled={bookmarked}
                  >
                    <Bookmark className="w-4 h-4" />
                    {bookmarked ? "Bookmarked" : "Bookmark explanation"}
                  </Button>
                  <Button
                    variant="outline"
                    className="justify-start gap-2"
                    onClick={handleCopy}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied" : "Copy summary"}
                  </Button>
                </div>
              </div>

              {/* Next Steps Navigation */}
              <div className="p-6 rounded-2xl bg-card border border-border">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Continue Your Research
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Link
                    to="/rights-insight"
                    className="flex items-center justify-between p-4 rounded-xl bg-secondary hover:bg-secondary/80 border-2 border-transparent hover:border-primary/50 transition-all group"
                  >
                    <span className="text-foreground font-medium group-hover:text-primary transition-colors">Learn about your rights</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </Link>
                  <Link
                    to="/find-help"
                    className="flex items-center justify-between p-4 rounded-xl bg-secondary hover:bg-secondary/80 border-2 border-transparent hover:border-primary/50 transition-all group"
                  >
                    <span className="text-foreground font-medium group-hover:text-primary transition-colors">Find legal help</span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </Link>
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
