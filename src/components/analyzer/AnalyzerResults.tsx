import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, FolderOpen, Share2, Check, Loader2, LogIn, AlertCircle, RefreshCw, BriefcaseBusiness, ExternalLink, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PrintShareModal } from "@/components/shared/PrintShareModal";
import { ClarifyingQuestions } from "./ClarifyingQuestions";
import { PatternAwarenessBlock } from "./PatternAwarenessBlock";
import { buildCaseContext, getRelevantQuestions, SystemType } from "@/hooks/useCaseContext";
import { usePatternAwareness } from "@/hooks/usePatternAwareness";
import { SafetyBanner } from "@/components/SafetyBanner";
import { supabase } from "@/integrations/supabase/client";
import { getLawModulesForAnalyzer, type LawModule } from "@/lib/law/issueLibrary";
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

function LawIssueCard({ module, onAdd }: { module: LawModule; onAdd: (module: LawModule) => void }) {
  const authority = module.authorities[0];
  return <div className="rounded-2xl bg-card border border-border p-5 shadow-sm">
    <div className="flex items-start gap-3">
      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"><Scale className="h-5 w-5 text-primary" /></div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1"><h3 className="font-serif text-lg text-foreground">{module.title}</h3><span className="text-[11px] rounded-full border border-border px-2 py-0.5 text-muted-foreground">Potential issue</span></div>
        <p className="text-sm text-muted-foreground leading-6">{module.definition}</p>
        <div className="mt-4 grid sm:grid-cols-2 gap-3 text-xs">
          <div className="rounded-lg bg-muted/40 p-3"><p className="font-semibold text-foreground mb-1">Elements to examine</p><p className="text-muted-foreground">{module.elements.slice(0, 2).join(" ")}</p></div>
          <div className="rounded-lg bg-muted/40 p-3"><p className="font-semibold text-foreground mb-1">Evidence to look for</p><p className="text-muted-foreground">{module.evidenceExamples.slice(0, 3).join(" · ")}</p></div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Button size="sm" onClick={() => onAdd(module)} className="gap-2"><FolderOpen className="h-4 w-4" />Add to Case</Button>
          {authority && <a href={authority.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"><ExternalLink className="h-3.5 w-3.5" />{authority.citation}</a>}
        </div>
      </div>
    </div>
  </div>;
}

export function AnalyzerResults({ systemId, systemLabel, location, patternStrength, tools, primaryGuideId, onSaveAnalysis, onStartOrganizing, isLoggedIn = false, isSaving = false, savedResult = null, saveError = null, aiResults, isGeneratingAI, aiError, onRetryGeneration, answers = {}, entityName, entityTags = {}, }: AnalyzerResultsProps) {
  const [printShareOpen, setPrintShareOpen] = useState(false);
  const [showClarifyingQuestions, setShowClarifyingQuestions] = useState(true);
  const [clarifyingAnswers, setClarifyingAnswers] = useState<Record<string, string>>({});
  const [creatingCase, setCreatingCase] = useState(false);
  const navigate = useNavigate();
  const patternAwareness = usePatternAwareness(entityTags, answers, patternStrength);
  const caseContext = useMemo(() => buildCaseContext(systemId as SystemType, systemLabel, { ...answers, ...clarifyingAnswers }, patternStrength, entityName, location), [systemId, systemLabel, answers, clarifyingAnswers, patternStrength, entityName, location]);
  const clarifyingQuestions = useMemo(() => getRelevantQuestions(caseContext), [caseContext]);
  const lawModules = useMemo(() => getLawModulesForAnalyzer(systemId), [systemId]);

  const startCaseWorkspace = async (selectedModule?: LawModule) => {
    if (!isLoggedIn) { navigate(`/auth?redirect=/analyzer`); return; }
    setCreatingCase(true);
    try {
      const { data: created, error } = await supabase.from("cases").insert({ name: `${systemLabel} case`, case_type: systemId, state: "WA", description: `Started from Analyzer for ${systemLabel}.` }).select("id").single();
      if (error) throw error;
      const caseId = created.id;
      const findings = Array.isArray((aiResults as any)?.findings) ? (aiResults as any).findings : [];
      const selected = selectedModule ? [selectedModule] : [];
      const issueRows = findings.length ? findings.map((f: any) => ({
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
      })) : [{ case_id: caseId, title: `${systemLabel} review`, category: systemId, summary: "Analyzer result saved for further review.", classification: "unknown", status: "open", origin: "analyzer", source: "Decoded Justice Analyzer" }];
      if (selected.length) issueRows.push(...selected.map((module) => ({ case_id: caseId, title: module.title, category: module.category, summary: module.definition, classification: "unknown", status: "open", origin: "issue-library", source: "Decoded Justice Law Modules", supporting_notes: module.elements.join("; "), missing_records: module.evidenceExamples.join("; "), next_action: module.questions.join("; ") })));
      const { error: issueError } = await supabase.from("case_issues").insert(issueRows);
      if (issueError) throw issueError;

      const mergedAnswers = { ...answers, ...clarifyingAnswers };
      const answerSummary = Object.entries(mergedAnswers).map(([key, value]) => `${key}: ${value}`).join("\n");
      const noteContent = [`Analyzer triage for ${systemLabel}.`, entityName ? `Subject: ${entityName}` : "", location ? `Location: ${location}` : "", answerSummary ? `Triage answers:\n${answerSummary}` : "", selected.length ? `Issue library selection: ${selected.map((m) => m.title).join(", ")}` : ""].filter(Boolean).join("\n\n");
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData.user?.id;
      if (!userId) throw new Error("Your session expired. Please sign in again.");

      const { error: noteError } = await supabase.from("notes").insert({ user_id: userId, title: `Triage notes — ${systemLabel}`, content: noteContent });
      if (noteError) throw noteError;
      const { error: timelineError } = await supabase.from("timeline_entries").insert({ user_id: userId, case_id: caseId, title: "Triage completed", description: `Analyzer triage completed for ${systemLabel}. The answers were preserved as case notes and potential issues were added for review.`, event_date: new Date().toISOString().split("T")[0], classification: "unknown" });
      if (timelineError) throw timelineError;

      const { error: evidenceError } = await supabase.from("evidence").insert({ user_id: userId, case_id: caseId, title: "Triage response record", description: answerSummary || "No free-form triage answers were recorded.", source: "Decoded Justice Analyzer", relevance_notes: "User-provided triage responses. This is a record of the intake, not independent documentary proof.", review_status: "not_reviewed", classification: "unknown", export_include: true });
      if (evidenceError) throw evidenceError;

      const packetContent = { generated_at: new Date().toISOString(), source: "analyzer", system: systemLabel, answers: mergedAnswers, selected_issue_modules: selected.map((m) => m.id), sections: ["overview", "issues", "timeline", "evidence"], note: "Draft organizational packet. It does not establish that a legal violation occurred." };
      const { error: packetError } = await supabase.from("case_packets").insert({ case_id: caseId, user_id: userId, title: `${systemLabel} triage packet`, packet_type: "triage", sections: ["overview", "issues", "timeline", "evidence"], options: { include_exhibits: true }, content: packetContent });
      if (packetError) throw packetError;

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
    <div className="mb-8 rounded-2xl border border-primary/20 bg-card/80 p-5"><div className="flex items-start gap-3"><BriefcaseBusiness className="w-5 h-5 text-primary mt-0.5" /><div className="flex-1"><h2 className="font-serif text-lg text-foreground">Turn this analysis into a case workspace</h2><p className="text-sm text-muted-foreground mt-1 mb-4">Create a case from these results. Findings enter the case as <strong>Unknown</strong> user-reported issues so you can add documents, timeline events, and your own claims as you review them.</p><Button onClick={() => startCaseWorkspace()} disabled={creatingCase} className="gap-2">{creatingCase ? <Loader2 className="h-4 w-4 animate-spin" /> : <FolderOpen className="h-4 w-4" />}{creatingCase ? "Opening workspace…" : "Open Case Workspace"}</Button></div></div></div>
    {showClarifyingQuestions && clarifyingQuestions.length > 0 && <ClarifyingQuestions questions={clarifyingQuestions} answers={clarifyingAnswers} onAnswer={(questionId, answer) => setClarifyingAnswers(prev => ({ ...prev, [questionId]: answer }))} onSkip={() => {}} onComplete={() => setShowClarifyingQuestions(false)} />}
    {patternAwareness && <PatternAwarenessBlock analysis={patternAwareness as PatternAnalysis} />}
    {lawModules.length > 0 && <section className="mb-8"><div className="mb-4"><h2 className="text-xl font-semibold text-foreground">Potential rights / issues</h2><p className="text-sm text-muted-foreground mt-1">These are research leads from the Decoded Justice issue library based on the system you selected. They are not findings that a violation occurred.</p></div><div className="space-y-4">{lawModules.map((module) => <LawIssueCard key={module.id} module={module} onAdd={(m) => startCaseWorkspace(m)} />)}</div></section>}
    <div className="space-y-6">{tools.filter(t => !t.isLocked).length > 0 && <section><h2 className="text-xl font-semibold text-foreground mb-4">Tools for your next step</h2><div className="space-y-4">{tools.filter(t => !t.isLocked).map(tool => <ToolCard key={tool.name} {...tool} />)}</div></section>}{tools.filter(t => t.isLocked).length > 0 && <section><h2 className="text-lg font-medium text-muted-foreground mb-4">Additional resources</h2><div className="space-y-4">{tools.filter(t => t.isLocked).map(tool => <ToolCard key={tool.name} {...tool} />)}</div></section>}</div>
    <PrintShareModal isOpen={printShareOpen} onClose={() => setPrintShareOpen(false)} title="Analyzer results" content={<div />} />
  </div></div>;
}

export function generateResultContent(systemId: string, patternStrength: 'none' | 'possible' | 'strong' | 'very_strong') {
  const systemLabels: Record<string, string> = { police: "Police Accountability & Prosecutorial Review", housing: "Tenant Rights & Housing Enforcement", cps_dcyf: "Child Welfare & Dependency Review", employer: "Workplace Rights & Employment Review", school: "Education Rights & School Review", healthcare: "Healthcare Rights & Records Review", courts: "Court Procedure & Access Review", jail: "Jail or Prison Conditions Review", government: "Government Agency Review", unsure: "General Rights & Procedure Review" };
  return { label: systemLabels[systemId] || "Case review", patternStrength };
}
