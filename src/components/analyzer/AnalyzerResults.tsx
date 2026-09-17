import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, FolderOpen, Share2, Check, Loader2, LogIn, AlertCircle, RefreshCw, BriefcaseBusiness } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PrintShareModal } from "@/components/shared/PrintShareModal";
import { ClarifyingQuestions } from "./ClarifyingQuestions";
import { PatternAwarenessBlock } from "./PatternAwarenessBlock";
import { buildCaseContext, getRelevantQuestions, SystemType } from "@/hooks/useCaseContext";
import { usePatternAwareness } from "@/hooks/usePatternAwareness";
import { SafetyBanner } from "@/components/SafetyBanner";
import { supabase } from "@/integrations/supabase/client";
import type { EntityTags } from "@/hooks/useEntityTags";
import type { PatternAnalysis } from "@/hooks/usePatternEngine";
import type { AnalyzerResultsAI } from "@/hooks/useAnalyzerResultsAI";

interface ToolCardProps { name: string; purpose: string; relevance: string; link: string; icon: React.ElementType; isLocked?: boolean; lockReason?: string; }
interface SavedResult { id: string; savedAt: Date; }
interface AnalyzerResultsProps {
  systemId: string; systemLabel: string; location?: string; patternStrength: 'none' | 'possible' | 'strong' | 'very_strong'; tools: ToolCardProps[]; primaryGuideId?: string;
  onSaveAnalysis?: () => void; onStartOrganizing?: () => void; isLoggedIn?: boolean; isSaving?: boolean; savedResult?: SavedResult | null; saveError?: string | null;
  aiResults: AnalyzerResultsAI | null; isGeneratingAI: boolean; aiError: string | null; onRetryGeneration?: () => void; answers?: Record<string, string>; entityName?: string; entityTags?: EntityTags;
}
const ToolCard = ({ name, purpose, relevance, link, icon: Icon, isLocked, lockReason }: ToolCardProps) => isLocked ? <div className="p-6 rounded-2xl bg-muted/60 border border-border/50 opacity-60"><div className="flex items-start gap-4"><div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0"><Icon className="w-6 h-6 text-muted-foreground" /></div><div className="flex-1"><h4 className="text-lg font-medium text-muted-foreground mb-1">{name}</h4><p className="text-sm text-muted-foreground mb-3">{purpose}</p><p className="text-xs text-muted-foreground italic">{lockReason}</p></div></div></div> : <Link to={link} className="block p-6 rounded-2xl bg-card border border-border hover:border-accent/50 hover:shadow-lg transition-all duration-300 group"><div className="flex items-start gap-4"><div className="w-12 h-12 rounded-xl bg-accent/10 group-hover:bg-accent/20 flex items-center justify-center shrink-0 transition-colors"><Icon className="w-6 h-6 text-accent" /></div><div className="flex-1"><div className="flex items-center justify-between mb-1"><h4 className="text-lg font-medium text-foreground group-hover:text-accent transition-colors">{name}</h4><ArrowRight className="w-4 h-4 text-accent opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" /></div><p className="text-sm text-muted-foreground mb-3">{purpose}</p><div className="pt-3 border-t border-border"><p className="text-xs text-accent font-medium">Shown because: {relevance}</p></div></div></div></Link>;

export function AnalyzerResults({ systemId, systemLabel, location, patternStrength, tools, primaryGuideId, onSaveAnalysis, onStartOrganizing, isLoggedIn = false, isSaving = false, savedResult = null, saveError = null, aiResults, isGeneratingAI, aiError, onRetryGeneration, answers = {}, entityName, entityTags = {}, }: AnalyzerResultsProps) {
  const [printShareOpen, setPrintShareOpen] = useState(false);
  const [showClarifyingQuestions, setShowClarifyingQuestions] = useState(true);
  const [clarifyingAnswers, setClarifyingAnswers] = useState<Record<string, string>>({});
  const [creatingCase, setCreatingCase] = useState(false);
  const navigate = useNavigate();
  const patternAwareness = usePatternAwareness(entityTags, answers, patternStrength);
  const caseContext = useMemo(() => buildCaseContext(systemId as SystemType, systemLabel, { ...answers, ...clarifyingAnswers }, patternStrength, entityName, location), [systemId, systemLabel, answers, clarifyingAnswers, patternStrength, entityName, location]);
  const clarifyingQuestions = useMemo(() => getRelevantQuestions(caseContext), [caseContext]);
  const startCaseWorkspace = async () => {
    if (!isLoggedIn) { navigate(`/auth?redirect=/analyzer`); return; }
    setCreatingCase(true);
    try {
      const { data: created, error } = await supabase.from("cases").insert({ name: `${systemLabel} case`, case_type: systemId, state: "WA", description: `Started from Analyzer for ${systemLabel}.` }).select("id").single();
      if (error) throw error;
      const caseId = created.id;
      const findings = Array.isArray((aiResults as any)?.findings) ? (aiResults as any).findings : [];
      if (findings.length) {
        const rows = findings.map((f: any) => ({
          case_id: caseId,
          title: f.definition?.title ?? f.title ?? "Analyzer finding",
          category: f.definition?.category ?? systemLabel,
          summary: f.definition?.description ?? f.summary ?? null,
          classification: "unknown",
          status: "open",
          origin: "analyzer",
          source: "Decoded Justice Analyzer",
          supporting_notes: Array.isArray(f.triggers) ? f.triggers.join("; ") : null,
          missing_records: Array.isArray(f.missingFacts) ? f.missingFacts.join("; ") : null,
          next_action: f.definition?.nextAction ?? null,
        }));
        const { error: issueError } = await supabase.from("case_issues").insert(rows);
        if (issueError) throw issueError;
      } else {
        const { error: issueError } = await supabase.from("case_issues").insert({ case_id: caseId, title: `${systemLabel} review`, category: systemId, summary: "Analyzer result saved for further review.", classification: "unknown", status: "open", origin: "analyzer", source: "Decoded Justice Analyzer" });
        if (issueError) throw issueError;
      }
      onStartOrganizing?.();
      navigate(`/cases/${caseId}`);
    } catch (e: any) {
      console.error("Unable to create case from analyzer", e);
    } finally { setCreatingCase(false); }
  };
  if (isGeneratingAI) return <div className="min-h-screen bg-gradient-hero flex items-center justify-center"><div className="text-center p-8"><Loader2 className="w-12 h-12 animate-spin text-accent mx-auto mb-4" /><h2 className="text-xl font-semibold text-foreground mb-2">Preparing Your Results</h2><p className="text-muted-foreground max-w-md">We're analyzing your situation to provide personalized guidance. This takes just a moment.</p></div></div>;
  if (aiError && !aiResults) return <div className="min-h-screen bg-gradient-hero flex items-center justify-center"><div className="text-center p-8 max-w-md"><AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" /><h2 className="text-xl font-semibold text-foreground mb-2">We're Preparing Your Results</h2><p className="text-muted-foreground mb-6">{aiError}</p>{onRetryGeneration && <Button onClick={onRetryGeneration} variant="outline" className="gap-2"><RefreshCw className="w-4 h-4" />Try Again</Button>}</div></div>;
  if (!aiResults) return <div className="min-h-screen bg-gradient-hero flex items-center justify-center"><div className="text-center p-8"><Loader2 className="w-12 h-12 animate-spin text-accent mx-auto mb-4" /><p className="text-muted-foreground">Loading results...</p></div></div>;
  return <div className="min-h-screen bg-gradient-hero"><div className="max-w-2xl mx-auto px-4 py-16 sm:px-6 lg:px-8"><SafetyBanner />
    {isLoggedIn ? <div className="mb-6 flex items-center justify-center">{isSaving && <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/60 text-muted-foreground text-sm"><Loader2 className="w-4 h-4 animate-spin" /><span>Saving to your file...</span></div>}{savedResult && !isSaving && <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium"><Check className="w-4 h-4" /><span>Saved to your file</span></div>}{saveError && !isSaving && !savedResult && <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive text-sm"><span>Could not save · Please try again later</span></div>}</div> : <div className="mb-6 flex items-center justify-center"><Link to="/auth?redirect=/analyzer" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"><LogIn className="w-4 h-4" /><span>Sign in to save this result</span></Link></div>}
    <header className="mb-8 text-center"><h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-4 tracking-tight">What This Means for Your Situation</h1><p className="text-muted-foreground text-base max-w-lg mx-auto leading-relaxed mb-6">Based on what you shared, here's how this system usually works — and what matters next.</p><Button variant="outline" size="sm" onClick={() => setPrintShareOpen(true)} className="gap-2"><Share2 className="w-4 h-4" />Print or Share</Button></header>
    <div className="mb-8 rounded-2xl border border-primary/20 bg-card/80 p-5"><div className="flex items-start gap-3"><BriefcaseBusiness className="w-5 h-5 text-primary mt-0.5" /><div className="flex-1"><h2 className="font-serif text-lg text-foreground">Turn this analysis into a case workspace</h2><p className="text-sm text-muted-foreground mt-1 mb-4">Create a case from these results. Findings enter the case as <strong>Unknown</strong> user-reported issues so you can add documents, timeline events, and your own claims as you review them.</p><Button onClick={startCaseWorkspace} disabled={creatingCase} className="gap-2">{creatingCase ? <Loader2 className="h-4 w-4 animate-spin" /> : <FolderOpen className="h-4 w-4" />}{creatingCase ? "Opening workspace…" : "Open Case Workspace"}</Button></div></div></div>
    {showClarifyingQuestions && clarifyingQuestions.length > 0 && <ClarifyingQuestions questions={clarifyingQuestions} answers={clarifyingAnswers} onAnswer={(questionId, answer) => setClarifyingAnswers(prev => ({ ...prev, [questionId]: answer }))} onSkip={() => {}} onComplete={() => setShowClarifyingQuestions(false)} />}
    {patternAwareness && <PatternAwarenessBlock analysis={patternAwareness as PatternAnalysis} />}
    <div className="space-y-6">{tools.filter(t => !t.isLocked).length > 0 && <section><h2 className="text-xl font-semibold text-foreground mb-4">Tools for your next step</h2><div className="space-y-4">{tools.filter(t => !t.isLocked).map(tool => <ToolCard key={tool.name} {...tool} />)}</div></section>}{tools.filter(t => t.isLocked).length > 0 && <section><h2 className="text-lg font-medium text-muted-foreground mb-4">Additional resources</h2><div className="space-y-4">{tools.filter(t => t.isLocked).map(tool => <ToolCard key={tool.name} {...tool} />)}</div></section>}</div>
    <PrintShareModal isOpen={printShareOpen} onClose={() => setPrintShareOpen(false)} title="Analyzer results" content={<div />} />
  </div></div>;
}

export function generateResultContent(systemId: string, patternStrength: 'none' | 'possible' | 'strong' | 'very_strong') {
  const systemLabels: Record<string, string> = { police: "Police Accountability & Prosecutorial Review", housing: "Tenant Rights & Housing Enforcement", cps_dcyf: "Child Welfare & Dependency Review", employer: "Workplace Rights & Employment Review", school: "Education Rights & School Review", healthcare: "Healthcare Rights & Records Review", courts: "Court Procedure & Access Review", jail: "Jail or Prison Conditions Review", government: "Government Agency Review", unsure: "General Rights & Procedure Review" };
  return { label: systemLabels[systemId] || "Case review", patternStrength };
}
