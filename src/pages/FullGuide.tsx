import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  BookOpen, 
  ArrowLeft, 
  ArrowRight,
  Home,
  Users,
  ExternalLink,
  Heart,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Scale,
  FileText,
  Wrench,
  ChevronDown,
  Share2
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { GuideAccordionSection } from "@/components/guides/GuideAccordionSection";
import { PrintShareModal } from "@/components/shared/PrintShareModal";
import { allEducationalGuides, type EducationalGuide } from "@/data/educationalGuides";

export default function FullGuide() {
  const { guideId } = useParams<{ guideId: string }>();
  const [printShareOpen, setPrintShareOpen] = useState(false);
  
  const guide = educationalGuides.find(g => g.id === guideId);
  
  if (!guide) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Guide Not Found</h1>
          <p className="text-muted-foreground mb-8">The guide you're looking for doesn't exist.</p>
          <Button variant="hero" asChild>
            <Link to="/rights-insight">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Rights Insight
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/60" />
        <div className="container relative py-12 lg:py-16">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <Link 
                to="/rights-insight" 
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Rights Insight
              </Link>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPrintShareOpen(true)}
                className="gap-2"
              >
                <Share2 className="w-4 h-4" />
                Print or Share
              </Button>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
              <BookOpen className="w-4 h-4" />
              <span>Full Educational Guide</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {guide.title}
            </h1>
            <p className="text-muted-foreground">
              {guide.readTime} • Comprehensive guide with sources
            </p>
          </div>
        </div>
      </section>

      <div className="container py-12 lg:py-16">
        <div className="max-w-3xl mx-auto space-y-4">
          
          {/* Before You Start - Always visible */}
          <div className="p-6 rounded-2xl bg-secondary/30 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Before You Start</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {guide.beforeYouStart.grounding}
            </p>
            <p className="text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-4">
              {guide.beforeYouStart.consent}
            </p>
          </div>

          {/* Section 1: What This System Is */}
          <GuideAccordionSection 
            title="What This System Is" 
            number={1} 
            variant="highlight"
            defaultOpen={true}
          >
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                {guide.whatThisSystemIs.description}
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-card border border-border">
                  <h3 className="text-sm font-semibold text-foreground mb-2">Who Runs It</h3>
                  <p className="text-sm text-muted-foreground">{guide.whatThisSystemIs.whoRunsIt}</p>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border">
                  <h3 className="text-sm font-semibold text-foreground mb-2">What It Controls</h3>
                  <p className="text-sm text-muted-foreground">{guide.whatThisSystemIs.whatItControls}</p>
                </div>
              </div>
            </div>
          </GuideAccordionSection>

          {/* Section 2: Why It Feels Confusing */}
          <GuideAccordionSection 
            title="Why It Feels So Confusing" 
            number={2}
          >
            <p className="text-muted-foreground leading-relaxed mb-4">
              {guide.whyConfusing.explanation}
            </p>
            <div className="p-4 rounded-xl bg-muted/30 border border-border">
              <h3 className="text-sm font-semibold text-foreground mb-3">This confusion is structural, not personal:</h3>
              <ul className="space-y-2">
                {guide.whyConfusing.structuralReasons.map((reason, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-muted-foreground mt-1">•</span>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          </GuideAccordionSection>

          {/* Section 3: What Usually Happens */}
          <GuideAccordionSection 
            title="What Usually Happens" 
            number={3}
          >
            <p className="text-sm text-muted-foreground mb-4">The common real-world pattern people experience:</p>
            <div className="space-y-3">
              {guide.whatUsuallyHappens.map((step, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <span className="text-xs text-primary font-medium">{i + 1}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{step}</span>
                </div>
              ))}
            </div>
          </GuideAccordionSection>

          {/* Section 4: What Success Actually Looks Like */}
          <GuideAccordionSection 
            title="What Success Actually Looks Like" 
            number={4}
            variant="success"
          >
            <p className="text-muted-foreground leading-relaxed mb-4">
              {guide.successReframe.reality}
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {guide.successReframe.examples.map((example, i) => (
                <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-success/10 border border-success/20">
                  <CheckCircle className="w-4 h-4 text-success shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{example}</span>
                </div>
              ))}
            </div>
          </GuideAccordionSection>

          {/* Section 5: What They Know — But You Don't */}
          <GuideAccordionSection 
            title="What They Know — But You Don't" 
            number={5}
            variant="warning"
            icon={<Eye className="w-4 h-4" />}
          >
            <p className="text-muted-foreground leading-relaxed mb-4">
              {guide.internalKnowledge.explanation}
            </p>
            <div className="space-y-2">
              {guide.internalKnowledge.examples.map((example, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <AlertTriangle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{example}</span>
                </div>
              ))}
            </div>
          </GuideAccordionSection>

          {/* Section 6: What People Often Misunderstand */}
          <GuideAccordionSection 
            title="What People Often Misunderstand" 
            number={6}
          >
            <p className="text-sm text-muted-foreground mb-4">Common traps and misconceptions:</p>
            <div className="space-y-3">
              {guide.misunderstandings.traps.map((trap, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                  <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">{trap}</span>
                </div>
              ))}
            </div>
          </GuideAccordionSection>

          {/* Section 7: What Actually Matters */}
          <GuideAccordionSection 
            title="What Actually Matters" 
            number={7}
            variant="highlight"
          >
            <div className="grid sm:grid-cols-2 gap-3">
              {guide.whatMatters.map((item, i) => (
                <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </GuideAccordionSection>

          {/* Section 8: What You Can Do Safely */}
          <GuideAccordionSection 
            title="What You Can Do Safely" 
            number={8}
            variant="success"
            icon={<Shield className="w-4 h-4" />}
          >
            <p className="text-sm text-muted-foreground mb-4">
              Low-risk steps that help even if you never escalate:
            </p>
            <ul className="space-y-3">
              {guide.safeSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center shrink-0">
                    <span className="text-xs text-success font-medium">{i + 1}</span>
                  </div>
                  <span className="text-muted-foreground">{step}</span>
                </li>
              ))}
            </ul>
          </GuideAccordionSection>

          {/* Section 9: When It's Time to Escalate */}
          <GuideAccordionSection 
            title="When It's Time to Escalate" 
            number={9}
            icon={<Scale className="w-4 h-4" />}
          >
            <p className="text-muted-foreground leading-relaxed mb-4">
              {guide.escalation.explanation}
            </p>
            <div className="p-4 rounded-xl bg-muted/30 border border-border">
              <h3 className="text-sm font-semibold text-foreground mb-3">Signs it may be time:</h3>
              <ul className="space-y-2">
                {guide.escalation.signs.map((sign, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <ArrowRight className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    {sign}
                  </li>
                ))}
              </ul>
            </div>
          </GuideAccordionSection>

          {/* Section 10: Trauma-Aware Closing */}
          <GuideAccordionSection 
            title="A Final Note" 
            number={10}
            variant="highlight"
            icon={<Heart className="w-4 h-4" />}
          >
            <p className="text-muted-foreground leading-relaxed">
              {guide.closing.reassurance}
            </p>
          </GuideAccordionSection>

          {/* Section 11: Templates & Tools (Collapsible) */}
          <GuideAccordionSection 
            title="Templates & Tools" 
            icon={<Wrench className="w-4 h-4" />}
          >
            <p className="text-sm text-muted-foreground mb-4">
              Practical resources to help you organize your situation:
            </p>
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-card border border-border">
                <h4 className="font-medium text-foreground mb-2">Timeline Template</h4>
                <p className="text-sm text-muted-foreground">Document events in chronological order with dates, people involved, and outcomes.</p>
              </div>
              <div className="p-4 rounded-lg bg-card border border-border">
                <h4 className="font-medium text-foreground mb-2">Evidence Log</h4>
                <p className="text-sm text-muted-foreground">Track documents, photos, and communications with notes on relevance.</p>
              </div>
              <div className="p-4 rounded-lg bg-card border border-border">
                <h4 className="font-medium text-foreground mb-2">Communication Tracker</h4>
                <p className="text-sm text-muted-foreground">Record who said what, when, and how (in-person, phone, email, text).</p>
              </div>
            </div>
            <div className="mt-4">
              <Button variant="soft" size="sm" asChild>
                <Link to="/self-help">
                  <Wrench className="w-4 h-4 mr-2" />
                  Access All Self-Help Tools
                </Link>
              </Button>
            </div>
          </GuideAccordionSection>

          {/* Sources & References (Collapsible) */}
          <GuideAccordionSection 
            title="Sources & References" 
            icon={<FileText className="w-4 h-4" />}
          >
            <p className="text-sm text-muted-foreground mb-4">
              Official sources for verification and further reading:
            </p>
            <div className="space-y-3">
              {guide.sources.map((source, i) => (
                <a
                  key={i}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-glow transition-all group"
                >
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0 mt-0.5 transition-colors" />
                  <div className="flex-1">
                    <p className="text-foreground font-medium group-hover:text-primary transition-colors">
                      {source.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {source.type === "official" && "Official guidance (plain language)"}
                      {source.type === "agency" && "Agency rules"}
                      {source.type === "oversight" && "Public oversight information"}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </GuideAccordionSection>

          {/* Related Resources */}
          <section className="p-6 rounded-2xl bg-card border border-border">
            <h3 className="font-semibold text-foreground mb-4">Related Resources</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="soft" size="sm" asChild>
                <Link to={`/support-network?filter=${guide.systemId}`}>
                  <Users className="w-4 h-4 mr-2" />
                  Find Organizations
                </Link>
              </Button>
              <Button variant="soft" size="sm" asChild>
                <Link to="/find-help">
                  <Scale className="w-4 h-4 mr-2" />
                  Find Legal Help
                </Link>
              </Button>
              <Button variant="soft" size="sm" asChild>
                <Link to="/self-help">
                  <Home className="w-4 h-4 mr-2" />
                  Self-Help Tools
                </Link>
              </Button>
            </div>
          </section>

          {/* Disclaimer */}
          <Disclaimer variant="prominent" />

          {/* Back to Guides */}
          <div className="text-center">
            <Button variant="outline" asChild>
              <Link to="/rights-insight">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to All Guides
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Print/Share Modal */}
      <PrintShareModal
        open={printShareOpen}
        onOpenChange={setPrintShareOpen}
        title={guide.title}
      />
    </Layout>
  );
}
