import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ChevronDown,
  ChevronUp,
  ArrowRight,
  BookOpen,
  FolderOpen,
  Clock,
  FileText,
  Search,
  Scale,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { PrintShareModal } from "@/components/shared/PrintShareModal";
import type { PatternAnalysis } from "@/hooks/usePatternEngine";

interface ToolCardProps {
  name: string;
  purpose: string;
  relevance: string;
  link: string;
  icon: React.ElementType;
  isLocked?: boolean;
  lockReason?: string;
}

interface AnalyzerResultsProps {
  systemId: string;
  systemLabel: string;
  location?: string;
  patternStrength: 'none' | 'possible' | 'strong' | 'very_strong';
  systemControls: string;
  systemDoesNotControl: string;
  decisionMakers: string;
  commonStuckPoints: string;
  whatUsuallyHappens: string[];
  whatPeopleMisinterpret: string[];
  tools: ToolCardProps[];
  primaryGuideId?: string;
  onSaveAnalysis?: () => void;
  onStartOrganizing?: () => void;
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
  systemControls,
  systemDoesNotControl,
  decisionMakers,
  commonStuckPoints,
  whatUsuallyHappens,
  whatPeopleMisinterpret,
  tools,
  primaryGuideId,
  onSaveAnalysis,
  onStartOrganizing
}: AnalyzerResultsProps) {
  const [systemSummaryOpen, setSystemSummaryOpen] = useState(false);
  const [whatHappensOpen, setWhatHappensOpen] = useState(false);
  const [printShareOpen, setPrintShareOpen] = useState(false);

  const unlockedTools = tools.filter(t => !t.isLocked);
  const lockedTools = tools.filter(t => t.isLocked);

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="max-w-2xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <header className="mb-16 text-center">
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

        {/* Section 1: System Summary Card (Collapsed by default) */}
        <section className="mb-8">
          <Collapsible open={systemSummaryOpen} onOpenChange={setSystemSummaryOpen}>
            <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-sm">
              <CollapsibleTrigger className="w-full p-6 flex items-center justify-between text-left hover:bg-surface-hover transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg font-medium text-foreground">{systemLabel}</span>
                    {location && (
                      <span className="text-sm text-muted-foreground">• {location}</span>
                    )}
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    {patternLabels[patternStrength]}
                  </div>
                </div>
                <div className="ml-4 p-2 rounded-lg hover:bg-muted transition-colors">
                  {systemSummaryOpen ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="px-6 pb-6 pt-2 border-t border-border space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">What this system controls</h4>
                    <p className="text-foreground leading-relaxed">{systemControls}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">What it does not control</h4>
                    <p className="text-foreground leading-relaxed">{systemDoesNotControl}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">Who actually makes decisions</h4>
                    <p className="text-foreground leading-relaxed">{decisionMakers}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">Where people usually get stuck</h4>
                    <p className="text-foreground leading-relaxed">{commonStuckPoints}</p>
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground italic">
                      None of this means you did anything wrong.
                    </p>
                  </div>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        </section>

        {/* Section 2: What Usually Happens (Accordion) */}
        <section className="mb-8">
          <Collapsible open={whatHappensOpen} onOpenChange={setWhatHappensOpen}>
            <div className="rounded-2xl bg-card border border-border overflow-hidden shadow-sm">
              <CollapsibleTrigger className="w-full p-6 flex items-center justify-between text-left hover:bg-surface-hover transition-colors">
                <h3 className="text-lg font-medium text-foreground">What Usually Happens</h3>
                <div className="p-2 rounded-lg hover:bg-muted transition-colors">
                  {whatHappensOpen ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="px-6 pb-6 pt-2 border-t border-border">
                  <div className="space-y-4 mb-6">
                    {whatUsuallyHappens.map((item, i) => (
                      <p key={i} className="text-foreground leading-relaxed">
                        {item}
                      </p>
                    ))}
                  </div>
                  
                  <div className="pt-4 border-t border-border">
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
                      What people often misinterpret
                    </h4>
                    <ul className="space-y-2">
                      {whatPeopleMisinterpret.map((item, i) => (
                        <li key={i} className="text-muted-foreground text-sm leading-relaxed pl-4 border-l-2 border-accent/30">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        </section>

        {/* Section 3: Pattern Insight */}
        <section className="mb-12">
          <div className="rounded-2xl bg-accent/5 border border-accent/20 p-6">
            {patternStrength === 'none' ? (
              <>
                <p className="text-foreground leading-relaxed mb-2">
                  This may be one of the first documented cases — which makes your records especially important.
                </p>
                <p className="text-sm text-muted-foreground">
                  Without existing patterns, your documentation could help identify emerging issues.
                </p>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </section>

        {/* Section 4: How This System Really Works — Library Handoff */}
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
                to={`/rights-insight?section=hidden-rules&subsection=what-systems-assume`}
                className="flex items-center justify-between p-4 rounded-xl bg-accent/5 border border-accent/20 hover:bg-accent/10 transition-colors group"
              >
                <span className="font-medium text-foreground group-hover:text-accent transition-colors">
                  Hidden Rules in {systemLabel}
                </span>
                <ArrowRight className="w-4 h-4 text-accent" />
              </Link>
              <Link 
                to={`/rights-insight?section=systems-power&subsection=${systemId === 'cps_dcyf' ? 'cps-dcyf' : systemId}`}
                className="flex items-center justify-between p-4 rounded-xl bg-accent/5 border border-accent/20 hover:bg-accent/10 transition-colors group"
              >
                <span className="font-medium text-foreground group-hover:text-accent transition-colors">
                  Who Holds Power in {systemLabel}
                </span>
                <ArrowRight className="w-4 h-4 text-accent" />
              </Link>
              <Link 
                to={`/rights-insight?section=patterns-harm&subsection=individual-vs-systemic`}
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

        {/* Section 5: Tools That Matter Right Now */}
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

        {/* Section 6: Gentle Reality Check */}
        <section className="mb-12">
          <div className="rounded-2xl bg-muted/50 border border-border p-6">
            <p className="text-muted-foreground leading-relaxed">
              This process is rarely fast or fair. Progress usually comes from clarity, not force. 
              What you do now creates options later.
            </p>
          </div>
        </section>

        {/* Section 6: Primary Action */}
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
      label: "Police or Sheriff",
      systemControls: "Arrests, detentions, use of force, searches, traffic stops, and initial charging decisions. Officers have discretion in how they respond to calls and make on-scene decisions.",
      systemDoesNotControl: "Final charging decisions (that's the prosecutor), court outcomes, or what happens after arrest. Officers also don't control their department's policies — supervisors and elected officials do.",
      decisionMakers: "The responding officer makes immediate decisions. Internal affairs handles complaints. Civilian oversight boards (where they exist) review patterns. Prosecutors decide charges.",
      commonStuckPoints: "Waiting for internal affairs to respond. Not knowing if body camera footage exists or how to get it. Unclear deadlines for complaints. Feeling like no one is listening.",
      whatUsuallyHappens: [
        "After an incident, there's usually a period of confusion about what to do next. Many people don't realize there are formal complaint processes.",
        "If you file a complaint, the department investigates internally. This can take months. You may not receive updates during this time.",
        "Civilian oversight boards, where they exist, can provide an alternative review process."
      ],
      whatPeopleMisinterpret: [
        "Silence from internal affairs doesn't mean they found nothing — it often just means the investigation is ongoing",
        "A 'not sustained' finding doesn't mean they think you're lying — it means they couldn't prove it either way",
        "Filing a complaint doesn't automatically mean anything will happen to the officer"
      ],
      primaryGuideId: undefined
    },
    housing: {
      label: "Housing or Landlord",
      systemControls: "Lease enforcement, rent collection, eviction filings, property maintenance, and tenant selection. Landlords have significant power over your living situation within legal limits.",
      systemDoesNotControl: "Final eviction decisions (courts do), fair housing enforcement (federal/state agencies do), or building code enforcement (local inspectors do).",
      decisionMakers: "Landlords make initial decisions. Property managers act on their behalf. Courts decide evictions. Housing authorities handle subsidized housing. Fair housing agencies investigate discrimination.",
      commonStuckPoints: "Short response deadlines for evictions. Confusion about what defenses exist. Not knowing who to call for code violations. Feeling intimidated by legal-looking documents.",
      whatUsuallyHappens: [
        "Disputes often start with a notice — for rent, lease violations, or eviction. These notices have specific deadlines that matter.",
        "If you receive an eviction notice, you typically have a limited time to respond. The court process follows a set timeline.",
        "Many issues can be resolved through communication, documentation, or involving tenant advocacy organizations before they escalate."
      ],
      whatPeopleMisinterpret: [
        "An eviction notice is not the same as being evicted — it's the start of a legal process you can respond to",
        "Landlords cannot lock you out or shut off utilities, even if you owe rent — that's illegal in Washington",
        "Verbal promises from landlords are hard to enforce — get agreements in writing"
      ],
      primaryGuideId: "housing"
    },
    cps_dcyf: {
      label: "CPS / DCYF (Child Welfare)",
      systemControls: "Investigations into child safety, safety planning, case management, and recommendations to the court. They can require services and make placement decisions in emergencies.",
      systemDoesNotControl: "Final custody decisions (courts do), criminal charges (prosecutors do), or therapeutic treatment plans (providers do). They also don't control whether you have an attorney — you're entitled to one.",
      decisionMakers: "Caseworkers assess and recommend. Supervisors approve major decisions. Courts make final rulings on dependency and placement. Attorneys advocate for each party.",
      commonStuckPoints: "Not understanding the difference between 'voluntary' and 'court-ordered' services. Feeling like cooperation is the same as admitting guilt. Not knowing what's in your own case file.",
      whatUsuallyHappens: [
        "An investigation usually starts with a home visit. Workers assess safety and may ask for voluntary services or safety planning.",
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
      label: "Employer or Workplace",
      systemControls: "Hiring, firing, promotions, work assignments, scheduling, performance evaluations, and internal investigations. HR manages policies and complaints.",
      systemDoesNotControl: "Final determinations on discrimination claims (agencies like EEOC do), unemployment decisions (state agencies do), or workplace safety enforcement (OSHA does).",
      decisionMakers: "Supervisors make daily decisions. HR handles policies and complaints. Executives set direction. External agencies investigate formal complaints.",
      commonStuckPoints: "Not understanding that HR protects the company, not you. Missing EEOC deadlines (often 180-300 days). Not having documentation of incidents.",
      whatUsuallyHappens: [
        "Issues often escalate over time. What starts as one incident may become a pattern.",
        "Internal HR complaints may or may not lead to action. The company investigates itself.",
        "If you file externally (EEOC, state agency), there's a formal investigation process with specific deadlines."
      ],
      whatPeopleMisinterpret: [
        "HR's job is to protect the company — they may help you, but that's not their primary role",
        "Retaliation after a complaint is illegal, but proving it requires clear documentation",
        "You don't need a lawyer to file an EEOC charge, but deadlines are strict"
      ],
      primaryGuideId: undefined
    }
  };

  const content = systemContent[systemId] || {
    label: "System",
    systemControls: "This system has specific areas of authority that affect your situation.",
    systemDoesNotControl: "Other agencies or courts may control related decisions.",
    decisionMakers: "Different people at different levels make different decisions.",
    commonStuckPoints: "Understanding who to contact and when can be confusing.",
    whatUsuallyHappens: ["The process typically involves multiple steps and may take time."],
    whatPeopleMisinterpret: ["The process may not work the way you expect."],
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
      link: "/rights-insight",
      icon: Search,
      isLocked: false
    }
  ];

  return [...baseTools, ...patternTools];
}
