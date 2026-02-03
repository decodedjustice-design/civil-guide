import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ArrowRight,
  BookOpen,
  FolderOpen,
  Clock,
  FileText,
  Search,
  Scale,
  Share2,
  Check,
  Loader2,
  LogIn,
  AlertCircle,
  RefreshCw,
  ChevronDown,
  FileQuestion
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { PrintShareModal } from "@/components/shared/PrintShareModal";
import { ClarifyingQuestions } from "./ClarifyingQuestions";
import { SmartResourceList } from "./SmartResourceList";
import { PatternAwarenessBlock } from "./PatternAwarenessBlock";
import { buildCaseContext, getRelevantQuestions, CaseContext, SystemType } from "@/hooks/useCaseContext";
import { usePatternAwareness } from "@/hooks/usePatternAwareness";
import type { EntityTags } from "@/hooks/useEntityTags";
import type { PatternAnalysis } from "@/hooks/usePatternEngine";
import type { AnalyzerResultsAI } from "@/hooks/useAnalyzerResultsAI";

interface ToolCardProps {
  name: string;
  purpose: string;
  relevance: string;
  link: string;
  icon: React.ElementType;
  isLocked?: boolean;
  lockReason?: string;
}

interface SavedResult {
  id: string;
  savedAt: Date;
}

interface AnalyzerResultsProps {
  systemId: string;
  systemLabel: string;
  location?: string;
  patternStrength: 'none' | 'possible' | 'strong' | 'very_strong';
  tools: ToolCardProps[];
  primaryGuideId?: string;
  onSaveAnalysis?: () => void;
  onStartOrganizing?: () => void;
  // Auto-save status props
  isLoggedIn?: boolean;
  isSaving?: boolean;
  savedResult?: SavedResult | null;
  saveError?: string | null;
  // AI-generated results
  aiResults: AnalyzerResultsAI | null;
  isGeneratingAI: boolean;
  aiError: string | null;
  onRetryGeneration?: () => void;
  // Answers for context building
  answers?: Record<string, string>;
  entityName?: string;
  // Entity tags for pattern awareness
  entityTags?: EntityTags;
}

const patternLabels = {
  none: "Appears isolated",
  possible: "Possible pattern",
  strong: "Pattern detected",
  very_strong: "Pattern detected"
};

// System-specific sources for optional reference
const systemSources: Record<string, string[]> = {
  police: [
    "RCW 43.101 — Law Enforcement Training and Certification",
    "RCW 10.93 — Mutual Aid Peace Officer Powers",
    "WAC 139-12 — Peace Officer Certification Standards",
    "Washington State Criminal Justice Training Commission Policies",
    "Municipal Police Department General Orders (varies by jurisdiction)"
  ],
  housing: [
    "RCW 59.18 — Residential Landlord-Tenant Act",
    "RCW 49.60 — Washington Law Against Discrimination (Housing)",
    "WAC 162-32 — Fair Housing Practices",
    "Fair Housing Act (42 U.S.C. § 3601 et seq.)",
    "HUD Handbook 4350.3 — Occupancy Requirements"
  ],
  cps_dcyf: [
    "RCW 26.44 — Abuse of Children",
    "RCW 13.34 — Juvenile Court Act (Dependency)",
    "WAC 110-30 — Child Welfare Services Standards",
    "DCYF Policy Manual — Practices and Procedures Guide",
    "Indian Child Welfare Act (25 U.S.C. § 1901 et seq.)"
  ],
  employer: [
    "RCW 49.60 — Washington Law Against Discrimination",
    "RCW 49.46 — Minimum Wage Act",
    "WAC 296-126 — Employment Standards",
    "Title VII of the Civil Rights Act (42 U.S.C. § 2000e)",
    "EEOC Compliance Manual"
  ],
  courts: [
    "Washington Court Rules (CR, CrR, RAP)",
    "RCW Title 4 — Civil Procedure",
    "RCW Title 10 — Criminal Procedure",
    "Washington State Court Forms and Instructions",
    "Administrative Office of the Courts — Procedural Guidelines"
  ],
  school: [
    "RCW 28A — Common School Provisions",
    "WAC 392-400 — Student Discipline",
    "Individuals with Disabilities Education Act (IDEA)",
    "Section 504 of the Rehabilitation Act",
    "Family Educational Rights and Privacy Act (FERPA)"
  ],
  healthcare: [
    "RCW 70.02 — Medical Records — Health Care Information Access and Disclosure",
    "WAC 246-320 — Hospital Licensing",
    "HIPAA Privacy Rule (45 CFR Part 164)",
    "Emergency Medical Treatment and Labor Act (EMTALA)",
    "Patient Bill of Rights — CMS Guidelines"
  ],
  government: [
    "RCW 42.56 — Public Records Act",
    "RCW 34.05 — Administrative Procedure Act",
    "WAC 44-14 — Public Records Act Rules",
    "Social Security Act (42 U.S.C. § 301 et seq.)",
    "Code of Federal Regulations — Agency-Specific Rules"
  ],
  benefits: [
    "RCW 74.04 — Public Assistance Programs",
    "WAC 388 — DSHS Economic Services Administration Rules",
    "Social Security Act (42 U.S.C. § 301 et seq.)",
    "Supplemental Nutrition Assistance Program (SNAP) Regulations",
    "Medicaid/Medicare Coverage Determinations"
  ],
  jail: [
    "RCW 72.09 — Department of Corrections",
    "WAC 137 — Department of Corrections Rules",
    "Prison Rape Elimination Act (PREA) Standards",
    "Eighth Amendment — Cruel and Unusual Punishment Precedents",
    "ACA Standards for Adult Correctional Institutions"
  ],
  unsure: [
    "Washington State Constitution — Article I (Declaration of Rights)",
    "RCW 42.56 — Public Records Act",
    "RCW 34.05 — Administrative Procedure Act",
    "U.S. Constitution — Bill of Rights",
    "Administrative Procedures for State Agencies"
  ]
};

const ToolCard = ({ name, purpose, relevance, link, icon: Icon, isLocked, lockReason }: ToolCardProps) => {
  if (isLocked) {
    return (
      <div className="p-6 rounded-2xl bg-muted/60 border border-border/50 opacity-60">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center shrink-0">
            <Icon className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-medium text-muted-foreground mb-1">{name}</h4>
            <p className="text-sm text-muted-foreground mb-3">{purpose}</p>
            <p className="text-xs text-muted-foreground italic">{lockReason}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Link 
      to={link}
      className="block p-6 rounded-2xl bg-card border border-border hover:border-accent/50 hover:shadow-lg transition-all duration-300 group"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-accent/10 group-hover:bg-accent/20 flex items-center justify-center shrink-0 transition-colors">
          <Icon className="w-6 h-6 text-accent" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-lg font-medium text-foreground group-hover:text-accent transition-colors">{name}</h4>
            <ArrowRight className="w-4 h-4 text-accent opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
          </div>
          <p className="text-sm text-muted-foreground mb-3">{purpose}</p>
          <div className="pt-3 border-t border-border">
            <p className="text-xs text-accent font-medium">
              Shown because: {relevance}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export function AnalyzerResults({
  systemId,
  systemLabel,
  location,
  patternStrength,
  tools,
  primaryGuideId,
  onSaveAnalysis,
  onStartOrganizing,
  isLoggedIn = false,
  isSaving = false,
  savedResult = null,
  saveError = null,
  aiResults,
  isGeneratingAI,
  aiError,
  onRetryGeneration,
  answers = {},
  entityName,
  entityTags = {},
}: AnalyzerResultsProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [printShareOpen, setPrintShareOpen] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [showClarifyingQuestions, setShowClarifyingQuestions] = useState(true);
  const [clarifyingAnswers, setClarifyingAnswers] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  // Pattern awareness - detect aligned flags
  const patternAwareness = usePatternAwareness(entityTags, answers, patternStrength);

  // Build case context from answers
  const caseContext = useMemo(() => {
    return buildCaseContext(
      systemId as SystemType,
      systemLabel,
      { ...answers, ...clarifyingAnswers },
      patternStrength,
      entityName,
      location
    );
  }, [systemId, systemLabel, answers, clarifyingAnswers, patternStrength, entityName, location]);

  // Get relevant clarifying questions
  const clarifyingQuestions = useMemo(() => {
    return getRelevantQuestions(caseContext);
  }, [caseContext]);

  const handleClarifyingAnswer = (questionId: string, answer: string) => {
    setClarifyingAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSkipQuestion = (questionId: string) => {
    // Just move on, don't save anything
  };

  const handleCompleteClarifying = () => {
    setShowClarifyingQuestions(false);
  };

  const unlockedTools = tools.filter(t => !t.isLocked);
  const lockedTools = tools.filter(t => t.isLocked);

  // Format save time
  const formatSaveTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    if (diffSecs < 60) return 'just now';
    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins < 60) return `${diffMins}m ago`;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Create back-to-analyzer URL for deep-links
  const createDeepLink = (section: string, subsection: string) => {
    return `/rights-insight?section=${section}&subsection=${subsection}&from=analyzer`;
  };

  // Show loading state while AI generates
  if (isGeneratingAI) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center p-8">
          <Loader2 className="w-12 h-12 animate-spin text-accent mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Preparing Your Results</h2>
          <p className="text-muted-foreground max-w-md">
            We're analyzing your situation to provide personalized guidance. This takes just a moment.
          </p>
        </div>
      </div>
    );
  }

  // Show error state with retry option
  if (aiError && !aiResults) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">We're Preparing Your Results</h2>
          <p className="text-muted-foreground mb-6">
            {aiError}
          </p>
          {onRetryGeneration && (
            <Button onClick={onRetryGeneration} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          )}
        </div>
      </div>
    );
  }

  // If no AI results yet, show minimal fallback (shouldn't normally happen)
  if (!aiResults) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center p-8">
          <Loader2 className="w-12 h-12 animate-spin text-accent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="max-w-2xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        
        {/* Save Status Banner */}
        {isLoggedIn ? (
          <div className="mb-6 flex items-center justify-center">
            {isSaving && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/60 text-muted-foreground text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving to your file...</span>
              </div>
            )}
            {savedResult && !isSaving && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium">
                <Check className="w-4 h-4" />
                <span>Saved to your file · {formatSaveTime(savedResult.savedAt)}</span>
              </div>
            )}
            {saveError && !isSaving && !savedResult && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 text-destructive text-sm">
                <span>Could not save · Please try again later</span>
              </div>
            )}
          </div>
        ) : (
          <div className="mb-6 flex items-center justify-center">
            <Link 
              to="/auth?redirect=/analyzer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign in to save this result</span>
            </Link>
          </div>
        )}
        
        {/* Page Header */}
        <header className="mb-12 text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-4 tracking-tight">
            What This Means for Your Situation
          </h1>
          <p className="text-muted-foreground text-base max-w-lg mx-auto leading-relaxed mb-6">
            Based on what you shared, here's how this system usually works — and what matters next.
          </p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setPrintShareOpen(true)}
            className="gap-2"
          >
            <Share2 className="w-4 h-4" />
            Print or Share
          </Button>
        </header>

        {/* SECTION 1: What system you are actually in */}
        <section className="mb-8">
          <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-accent" />
              <h2 className="text-lg font-semibold text-accent">What System You Are Actually In</h2>
            </div>
            <p className="text-foreground leading-relaxed">
              You are navigating the <span className="font-semibold text-accent">{systemLabel}</span> system
              {location && <span>, specifically in {location}</span>}.
            </p>
            <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
              This is not just "{systemLabel.toLowerCase()}" in general — it's a specific set of agencies, decision-makers, 
              and processes with their own rules and timelines.
            </p>
          </div>
        </section>

        {/* SECTION 2: Who has power (and who does not) */}
        <section className="mb-8">
          <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-accent" />
              <h2 className="text-lg font-semibold text-accent">Who Has Power (And Who Does Not)</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">What this system controls:</h4>
                <ul className="space-y-1">
                  {aiResults.powerDynamics.whoHasControl.map((item, i) => (
                    <li key={i} className="text-muted-foreground text-sm leading-relaxed">• {item}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">What it does NOT control:</h4>
                <ul className="space-y-1">
                  {aiResults.powerDynamics.whoDoesNotControl.map((item, i) => (
                    <li key={i} className="text-muted-foreground text-sm leading-relaxed">• {item}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Who actually makes decisions:</h4>
                <ul className="space-y-1">
                  {aiResults.powerDynamics.decisionMakers.map((item, i) => (
                    <li key={i} className="text-muted-foreground text-sm leading-relaxed">• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: What usually happens next */}
        <section className="mb-8">
          <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-accent" />
              <h2 className="text-lg font-semibold text-accent">What Usually Happens Next</h2>
            </div>
            
            <div className="space-y-4">
              {aiResults.usualProcess.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-accent font-semibold shrink-0">{i + 1}.</span>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4: Where people get stuck */}
        <section className="mb-8">
          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <h2 className="text-lg font-semibold text-amber-800">Where People Get Stuck</h2>
            </div>
            
            <ul className="space-y-2">
              {aiResults.commonStuckPoints.map((item, i) => (
                <li key={i} className="text-amber-900/80 text-sm leading-relaxed pl-4 border-l-2 border-amber-300">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* SECTION 5: What matters first (If You Do Nothing Else) - AI Generated */}
        <section className="mb-12">
          <div className="rounded-2xl bg-accent/5 border-2 border-accent/30 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-accent">If You Do Nothing Else</h2>
            </div>
            
            <p className="text-muted-foreground text-sm mb-4">
              These three things matter most right now — not everything, just these:
            </p>
            
            <div className="space-y-3">
              {aiResults.priorityActions.map((action, i) => (
                <div key={i} className="flex gap-3 items-start p-3 rounded-lg bg-white border border-border">
                  <span className="w-6 h-6 rounded-full bg-accent/20 text-accent text-sm font-semibold flex items-center justify-center shrink-0">{i + 1}</span>
                  <div>
                    <p className="font-medium text-foreground text-sm">{action.title}</p>
                    <p className="text-muted-foreground text-xs mt-1">{action.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 6: Reference Anchors */}
        <section className="mb-8">
          <div className="rounded-2xl bg-card border border-border p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-accent" />
              <h2 className="text-lg font-semibold text-accent">Reference Anchors</h2>
            </div>
            <p className="text-muted-foreground text-sm mb-3">
              These concepts can help orient your understanding:
            </p>
            <ul className="space-y-2">
              {aiResults.referenceAnchors.map((anchor, i) => (
                <li key={i} className="text-muted-foreground text-sm leading-relaxed pl-4 border-l-2 border-accent/30">
                  {anchor}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Pattern Insight */}
        {patternStrength !== 'none' && (
          <section className="mb-12">
            <div className="rounded-2xl bg-accent/5 border border-accent/20 p-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-3">
                <span className="w-2 h-2 rounded-full bg-accent" />
                {patternLabels[patternStrength]}
              </div>
              <p className="text-foreground leading-relaxed mb-3">
                Other people have reported similar issues with this system.
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                {patternStrength === 'possible' && "There are some indications of a broader pattern, though more information would help confirm this."}
                {patternStrength === 'strong' && "This pattern has been documented in multiple cases, which can strengthen your position."}
                {patternStrength === 'very_strong' && "This is a well-documented pattern with significant supporting evidence."}
              </p>
              <div className="text-sm text-accent">
                <span className="font-medium">Why this matters:</span> Documented patterns can influence which attorneys take interest, 
                which escalation paths make sense, and how you organize your evidence.
              </div>
            </div>
          </section>
        )}

        {/* Pattern Awareness Copy Blocks - appears when multiple flags align */}
        {patternAwareness.hasPattern && (
          <PatternAwarenessBlock blocks={patternAwareness.patternBlocks} />
        )}

        {/* How This System Really Works — Deep Links to Rights Insight */}
        <section className="mb-12">
          <div className="rounded-2xl bg-white border border-border overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-accent mb-3">
                How This System Really Works
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Most systems do not explain their internal rules, deadlines, or power structures. 
                These sections explain what is usually happening behind the scenes.
              </p>
            </div>
            <div className="p-6 space-y-3">
              <Link 
                to={createDeepLink("hidden-rules", "what-systems-assume")}
                className="flex items-center justify-between p-4 rounded-xl bg-accent/5 border border-accent/20 hover:bg-accent/10 transition-colors group"
              >
                <span className="font-medium text-foreground group-hover:text-accent transition-colors">
                  Hidden Rules in {systemLabel}
                </span>
                <ArrowRight className="w-4 h-4 text-accent" />
              </Link>
              <Link 
                to={createDeepLink("systems-power", systemId === 'cps_dcyf' ? 'cps-dcyf' : (systemId === 'employer' ? 'employment' : systemId))}
                className="flex items-center justify-between p-4 rounded-xl bg-accent/5 border border-accent/20 hover:bg-accent/10 transition-colors group"
              >
                <span className="font-medium text-foreground group-hover:text-accent transition-colors">
                  Who Holds Power in {systemLabel}
                </span>
                <ArrowRight className="w-4 h-4 text-accent" />
              </Link>
              <Link 
                to={createDeepLink("patterns-harm", "individual-vs-systemic")}
                className="flex items-center justify-between p-4 rounded-xl bg-accent/5 border border-accent/20 hover:bg-accent/10 transition-colors group"
              >
                <span className="font-medium text-foreground group-hover:text-accent transition-colors">
                  Patterns Seen in Similar Cases
                </span>
                <ArrowRight className="w-4 h-4 text-accent" />
              </Link>
            </div>
          </div>
        </section>

        {/* Optional Clarifying Questions - Only shown if relevant */}
        {showClarifyingQuestions && clarifyingQuestions.length > 0 && (
          <section className="mb-12">
            <ClarifyingQuestions
              questions={clarifyingQuestions}
              context={caseContext}
              onAnswer={handleClarifyingAnswer}
              onSkip={handleSkipQuestion}
              onComplete={handleCompleteClarifying}
            />
          </section>
        )}

        {/* Smart Resource List - Context-aware */}
        <section className="mb-12">
          <SmartResourceList
            context={caseContext}
            showExplanation={true}
          />
        </section>

        {/* Tools That Matter Right Now */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Tools That Matter Right Now
          </h2>
          
          <div className="space-y-4">
            {unlockedTools.map((tool, i) => (
              <ToolCard key={i} {...tool} />
            ))}
          </div>
          
          {lockedTools.length > 0 && (
            <div className="mt-6 space-y-4">
              {lockedTools.map((tool, i) => (
                <ToolCard key={i} {...tool} />
              ))}
            </div>
          )}
        </section>

        {/* SECTION 7: Gentle Reality Check + Closing Affirmation */}
        <section className="mb-12">
          <div className="rounded-2xl bg-muted/50 border border-border p-6">
            <p className="text-muted-foreground leading-relaxed mb-4">
              {aiResults.gentleRealityCheck}
            </p>
            <p className="text-foreground text-sm font-medium italic">
              {aiResults.closingAffirmation}
            </p>
          </div>
        </section>

        {/* View Sources (Optional) - Inline Collapsible */}
        <section className="mb-12">
          <Collapsible open={sourcesOpen} onOpenChange={setSourcesOpen}>
            <CollapsibleTrigger className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm group cursor-pointer">
              <FileQuestion className="w-4 h-4" />
              <span>View sources (optional)</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${sourcesOpen ? 'rotate-180' : ''}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <div className="rounded-xl bg-muted/30 border border-border/50 p-5">
                <p className="text-muted-foreground text-xs mb-4 italic">
                  These sources are provided for orientation only. They are not instructions or legal advice.
                </p>
                <ul className="space-y-2">
                  {(systemSources[systemId] || systemSources.unsure).map((source, i) => (
                    <li key={i} className="text-muted-foreground text-sm leading-relaxed">
                      • {source}
                    </li>
                  ))}
                </ul>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </section>

        {/* Primary Action */}
        <section className="text-center">
          <Button 
            onClick={onStartOrganizing}
            variant="hero"
            size="lg"
            className="px-8 py-6 text-base"
            asChild
          >
            <Link to="/self-help">
              Organize My Case
            </Link>
          </Button>
          
          {primaryGuideId && (
            <div className="mt-6">
              <Link 
                to={`/guide/${primaryGuideId}`}
                className="inline-flex items-center gap-2 text-accent hover:text-accent/80 text-sm font-medium transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                Read the full guide for this system
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
          
          <div className="mt-4">
            <Link 
              to="/rights-insight"
              className="inline-flex items-center gap-2 text-accent hover:text-accent/80 text-sm font-medium transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Explore Rights Insight
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </section>

      </div>

      {/* Print/Share Modal */}
      <PrintShareModal
        open={printShareOpen}
        onOpenChange={setPrintShareOpen}
        title={`${systemLabel} - Analysis Results`}
        savedResultId={savedResult?.id}
        systemId={systemId}
        systemLabel={systemLabel}
      />
    </div>
  );
}

// Helper function to get system label and tools - content is now AI-generated
export function generateResultContent(systemId: string, patternStrength: 'none' | 'possible' | 'strong' | 'very_strong') {
  const systemLabels: Record<string, string> = {
    police: "Police Accountability & Prosecutorial Review",
    housing: "Tenant Rights & Housing Enforcement",
    cps_dcyf: "CPS / DCYF Child Welfare System",
    employer: "Employment Rights & Workplace Enforcement",
    courts: "Court System & Legal Procedures",
    school: "Education Rights & Student Protections",
    healthcare: "Healthcare Rights & Patient Protections",
    government: "Government Agency & Benefits",
    jail: "Incarceration & Corrections",
    unsure: "System Identification"
  };

  const primaryGuides: Record<string, string | undefined> = {
    police: undefined,
    housing: "housing",
    cps_dcyf: "cps_dcyf",
    employer: undefined,
    courts: undefined,
    school: undefined,
    healthcare: undefined,
    government: undefined,
    jail: undefined,
    unsure: undefined
  };

  // Define tools based on pattern strength and system
  const tools = getToolsForSystem(systemId, patternStrength);

  return {
    label: systemLabels[systemId] || "System",
    primaryGuideId: primaryGuides[systemId],
    patternStrength,
    tools
  };
}

function getToolsForSystem(systemId: string, patternStrength: 'none' | 'possible' | 'strong' | 'very_strong') {
  const baseTools = [
    {
      name: "Evidence Vault",
      purpose: "Helps you store records in a way others can understand later.",
      relevance: "Documentation is what protects you if this escalates.",
      link: "/evidence-vault",
      icon: FolderOpen,
      isLocked: false
    },
    {
      name: "Timeline Creator",
      purpose: "Build a clear sequence of what happened and when.",
      relevance: "Patterns are easier to see when events are organized chronologically.",
      link: "/timeline",
      icon: Clock,
      isLocked: false
    },
    {
      name: "Notes",
      purpose: "Record details while they're fresh in your mind.",
      relevance: "Memory fades — capture what you remember now.",
      link: "/notes",
      icon: FileText,
      isLocked: false
    }
  ];

  const patternTools = [
    {
      name: "Attorney Matching",
      purpose: "Connect with attorneys who handle cases like yours.",
      relevance: "Documented patterns help attorneys assess your case.",
      link: "/find-legal-help",
      icon: Scale,
      isLocked: patternStrength === 'none',
      lockReason: "Available if more pattern evidence appears."
    },
    {
      name: "Public Request Rights",
      purpose: "Understand, request, and organize public records.",
      relevance: "Understanding what they know helps you prepare.",
      link: "/public-request-rights?from=analyzer",
      icon: Search,
      isLocked: false
    }
  ];

  return [...baseTools, ...patternTools];
}
