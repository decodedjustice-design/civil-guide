import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
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
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { PrintShareModal } from "@/components/shared/PrintShareModal";
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
}

const patternLabels = {
  none: "Appears isolated",
  possible: "Possible pattern",
  strong: "Pattern detected",
  very_strong: "Pattern detected"
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
}: AnalyzerResultsProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [printShareOpen, setPrintShareOpen] = useState(false);
  const navigate = useNavigate();

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

// Helper function to generate result content based on system
export function generateResultContent(systemId: string, patternStrength: 'none' | 'possible' | 'strong' | 'very_strong') {
  const systemContent: Record<string, {
    label: string;
    systemControls: string;
    systemDoesNotControl: string;
    decisionMakers: string;
    commonStuckPoints: string;
    whatUsuallyHappens: string[];
    whatPeopleMisinterpret: string[];
    primaryGuideId?: string;
  }> = {
    police: {
      label: "Police Accountability & Prosecutorial Review",
      systemControls: "Arrests, detentions, use of force, searches, traffic stops, and initial charging decisions. Officers have discretion in how they respond to calls and make on-scene decisions.",
      systemDoesNotControl: "Final charging decisions (that's the prosecutor), court outcomes, or what happens after arrest. Officers also don't control their department's policies — supervisors and elected officials do.",
      decisionMakers: "The responding officer makes immediate decisions. Internal affairs handles complaints. Civilian oversight boards (where they exist) review patterns. Prosecutors decide charges.",
      commonStuckPoints: "People lose options because they assume verbal reports are enough, deadlines are flexible, or 'under review' means active work. Waiting for internal affairs to respond without understanding their timeline leads to frustration.",
      whatUsuallyHappens: [
        "After an incident, you'll often experience confusion about what to do next. Most people don't realize there are formal complaint processes with specific deadlines.",
        "If you file a complaint, the department investigates internally. This can take months. You may not receive updates during this time — silence is common, not necessarily meaningful.",
        "Long investigative delays occur. 'Under review' does not mean someone is actively working on your case right now."
      ],
      whatPeopleMisinterpret: [
        "Silence from internal affairs doesn't mean they found nothing — it often just means the investigation is ongoing",
        "A 'not sustained' finding doesn't mean they think you're lying — it means they couldn't prove it either way",
        "Filing a complaint doesn't automatically mean anything will happen to the officer"
      ],
      primaryGuideId: undefined
    },
    housing: {
      label: "Tenant Rights & Housing Enforcement",
      systemControls: "Lease enforcement, rent collection, eviction filings, property maintenance, and tenant selection. Landlords have significant power over your living situation within legal limits.",
      systemDoesNotControl: "Final eviction decisions (courts do), fair housing enforcement (federal/state agencies do), or building code enforcement (local inspectors do).",
      decisionMakers: "Landlords make initial decisions. Property managers act on their behalf. Courts decide evictions. Housing authorities handle subsidized housing. Fair housing agencies investigate discrimination.",
      commonStuckPoints: "Short response deadlines for evictions catch people off guard. Confusion about what defenses exist leads to missed opportunities. Many people don't know who to call for code violations.",
      whatUsuallyHappens: [
        "Disputes often start with a notice — for rent, lease violations, or eviction. These notices have specific deadlines that matter legally.",
        "If you receive an eviction notice, you typically have a limited time to respond. The court process follows a set timeline that won't wait.",
        "Many issues can be resolved through communication, documentation, or involving tenant advocacy organizations before they escalate to court."
      ],
      whatPeopleMisinterpret: [
        "An eviction notice is not the same as being evicted — it's the start of a legal process you can respond to",
        "Landlords cannot lock you out or shut off utilities, even if you owe rent — that's illegal in Washington",
        "Verbal promises from landlords are hard to enforce — get agreements in writing"
      ],
      primaryGuideId: "housing"
    },
    cps_dcyf: {
      label: "CPS / DCYF Child Welfare System",
      systemControls: "Investigations into child safety, safety planning, case management, and recommendations to the court. They can require services and make placement decisions in emergencies.",
      systemDoesNotControl: "Final custody decisions (courts do), criminal charges (prosecutors do), or therapeutic treatment plans (providers do). They also don't control whether you have an attorney — you're entitled to one.",
      decisionMakers: "Caseworkers assess and recommend. Supervisors approve major decisions. Courts make final rulings on dependency and placement. Attorneys advocate for each party.",
      commonStuckPoints: "People confuse 'voluntary' with 'optional.' They don't understand what's in their own case file. They think cooperation means admitting guilt, or that caseworkers are allies.",
      whatUsuallyHappens: [
        "An investigation usually starts with a home visit. Workers assess safety and may ask for 'voluntary' services or safety planning — but these requests carry significant weight.",
        "If concerns remain, the case may go to court. At that point, you'll have opportunities to respond, and you're entitled to an attorney.",
        "The goal of most cases is reunification — but the process can feel adversarial even when everyone shares that goal."
      ],
      whatPeopleMisinterpret: [
        "Agreeing to services doesn't mean you're admitting wrongdoing — it often shows engagement",
        "Caseworkers aren't 'on your side' or 'against you' — their job is to assess safety, not represent you",
        "What you say can appear in court documents — be thoughtful about what you share without legal advice"
      ],
      primaryGuideId: "cps_dcyf"
    },
    employer: {
      label: "Employment Rights & Workplace Enforcement",
      systemControls: "Hiring, firing, promotions, work assignments, scheduling, performance evaluations, and internal investigations. HR manages policies and complaints.",
      systemDoesNotControl: "Final determinations on discrimination claims (agencies like EEOC do), unemployment decisions (state agencies do), or workplace safety enforcement (OSHA does).",
      decisionMakers: "Supervisors make daily decisions. HR handles policies and complaints. Executives set direction. External agencies investigate formal complaints.",
      commonStuckPoints: "People believe HR is there to help them — HR protects the company. They miss EEOC deadlines (often 180-300 days). They don't document incidents as they happen.",
      whatUsuallyHappens: [
        "Issues often escalate over time. What starts as one incident may become a pattern that only becomes visible when you look back.",
        "Internal HR complaints may or may not lead to action. The company investigates itself and decides what happened.",
        "If you file externally (EEOC, state agency), there's a formal investigation process with specific deadlines and procedures."
      ],
      whatPeopleMisinterpret: [
        "HR's job is to protect the company — they may help you, but that's not their primary role",
        "Retaliation after a complaint is illegal, but proving it requires clear documentation",
        "You don't need a lawyer to file an EEOC charge, but deadlines are strict"
      ],
      primaryGuideId: undefined
    },
    courts: {
      label: "Court System & Legal Procedures",
      systemControls: "Scheduling hearings, ruling on motions, interpreting law, and issuing judgments. Courts control the procedural timeline once a case is filed.",
      systemDoesNotControl: "What claims you bring (you decide), evidence you present (you gather), or whether you have an attorney (though some situations provide one).",
      decisionMakers: "Judges make rulings. Court clerks manage paperwork. Attorneys know procedures. In criminal cases, prosecutors represent the state.",
      commonStuckPoints: "Self-represented parties don't know procedural rules. Deadlines feel arbitrary but are absolute. The formality is intimidating.",
      whatUsuallyHappens: [
        "Court processes follow specific procedural rules that differ by court type. What works in one court may not apply in another.",
        "Deadlines are generally absolute. Missing a filing deadline can result in losing your case regardless of the merits.",
        "Judges expect both parties to follow the same rules, even when one has an attorney and one doesn't."
      ],
      whatPeopleMisinterpret: [
        "Being 'right' doesn't matter if you don't follow procedures — you can lose a valid claim on technicalities",
        "Judges don't investigate — they decide based on what's presented to them",
        "Verbal explanations don't substitute for written filings in most situations"
      ],
      primaryGuideId: undefined
    },
    school: {
      label: "Education Rights & Student Protections",
      systemControls: "Enrollment, discipline, grades, accommodations processes (IEP/504), and day-to-day school operations.",
      systemDoesNotControl: "Final decisions on disability services (federal law does), discrimination findings (OCR does), or criminal matters involving students.",
      decisionMakers: "Teachers make classroom decisions. Principals handle discipline. District offices set policy. IEP teams decide accommodations. State agencies enforce civil rights.",
      commonStuckPoints: "Parents don't know they can disagree with IEP decisions. Students don't understand due process for discipline. Records follow students between schools.",
      whatUsuallyHappens: [
        "Issues often surface during discipline or when accommodations aren't working. Schools have internal processes that must usually be tried first.",
        "For special education, there's a formal dispute process including mediation and due process hearings.",
        "Documentation of communications and decisions matters significantly in education disputes."
      ],
      whatPeopleMisinterpret: [
        "An IEP meeting is a collaborative process — you don't have to agree with everything proposed",
        "Discipline records can affect future opportunities — understanding your rights before signing matters",
        "Schools must follow specific timelines for evaluations and meetings — delays may be violations"
      ],
      primaryGuideId: undefined
    },
    healthcare: {
      label: "Healthcare Rights & Patient Protections",
      systemControls: "Treatment decisions (with your consent), medical records, billing, and compliance with health regulations.",
      systemDoesNotControl: "Insurance coverage decisions (insurers do), licensing complaints (state boards do), or civil rights enforcement (OCR does).",
      decisionMakers: "Providers recommend treatment. Insurers approve coverage. Hospital administration sets policies. State boards handle licensing. You make final treatment decisions.",
      commonStuckPoints: "Medical records contain characterizations that follow you. Insurance denials seem final but can be appealed. Bills appear long after care.",
      whatUsuallyHappens: [
        "Healthcare disputes often involve multiple parties: providers, insurers, and billing companies. Each has different processes.",
        "Insurance denials can be appealed internally, then externally. Many people give up too early.",
        "Medical records can be amended if they contain errors, though the original entries remain visible."
      ],
      whatPeopleMisinterpret: [
        "A treatment recommendation is not a requirement — you can decline or seek second opinions",
        "An insurance denial is often the start of a process, not the end",
        "HIPAA has many exceptions — your information may be shared more than you expect"
      ],
      primaryGuideId: undefined
    },
    government: {
      label: "Government Agency & Benefits",
      systemControls: "Benefits eligibility, licensing, permits, and administrative decisions within their mandate.",
      systemDoesNotControl: "Policies set by legislature, court interpretations of law, or decisions by other agencies.",
      decisionMakers: "Case workers assess eligibility. Supervisors review decisions. Hearing officers decide appeals. Courts review agency actions.",
      commonStuckPoints: "Appeals processes exist but aren't explained. Overpayment claims appear years later. Documentation requirements seem endless.",
      whatUsuallyHappens: [
        "Benefits decisions can be appealed through administrative hearings. These are less formal than court but still have rules.",
        "Agencies track their own metrics — case closures, processing times — not whether outcomes are just.",
        "Written requests and appeals create records that protect you better than phone calls."
      ],
      whatPeopleMisinterpret: [
        "A denial letter is not the final answer — appeals processes exist and often succeed",
        "Overpayment claims can sometimes be waived if you weren't at fault and repayment would be hardship",
        "You can request your complete file to understand how decisions were made"
      ],
      primaryGuideId: undefined
    },
    jail: {
      label: "Incarceration & Corrections",
      systemControls: "Daily conditions, discipline, programming access, and classification decisions within the facility.",
      systemDoesNotControl: "Sentencing (courts do), parole decisions (parole boards do), or conditions at other facilities.",
      decisionMakers: "Corrections officers make immediate decisions. Administrators handle grievances. Courts review conditions claims. Ombudsman offices provide oversight.",
      commonStuckPoints: "Grievance processes feel futile but are often required before court. Medical care access is limited. Retaliation fears are real.",
      whatUsuallyHappens: [
        "Grievances must usually be exhausted before courts will hear conditions claims. Filing creates a record even if denied.",
        "Medical care complaints follow a specific process. Documenting requests and denials matters.",
        "Family members can contact oversight offices like the Office of the Corrections Ombuds."
      ],
      whatPeopleMisinterpret: [
        "Constitutional rights are limited but not eliminated during incarceration",
        "Grievance denials don't mean your concerns are invalid — they're often required steps",
        "Outside advocates and oversight offices can receive complaints when internal processes fail"
      ],
      primaryGuideId: undefined
    }
  };

  const content = systemContent[systemId] || {
    label: "System",
    systemControls: "This system has specific areas of authority that affect your situation.",
    systemDoesNotControl: "Other agencies or courts may control related decisions.",
    decisionMakers: "Different people at different levels make different decisions.",
    commonStuckPoints: "Understanding who to contact and when can be confusing. Deadlines may be shorter than expected.",
    whatUsuallyHappens: [
      "The process typically involves multiple steps and may take longer than expected.",
      "Documentation and written communication tend to matter more than verbal exchanges.",
      "There are usually appeal or review processes, though they may not be clearly explained."
    ],
    whatPeopleMisinterpret: [
      "Silence from agencies doesn't necessarily mean no action — it often just means slow processing",
      "Initial denials or negative responses are often the start of a process, not the end",
      "Understanding the actual decision-makers helps focus your efforts"
    ],
    primaryGuideId: undefined
  };

  // Define tools based on pattern strength and system
  const tools = getToolsForSystem(systemId, patternStrength);

  return {
    ...content,
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
      name: "Records Request Guide",
      purpose: "Learn how to request official records and files.",
      relevance: "Understanding what they know helps you prepare.",
      link: "/rights-insight?section=evidence-truths&subsection=what-counts&from=analyzer",
      icon: Search,
      isLocked: false
    }
  ];

  return [...baseTools, ...patternTools];
}
