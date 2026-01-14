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
  Lightbulb,
  Scale,
  FileText
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { educationalGuides, type EducationalGuide } from "@/data/educationalGuides";

export default function FullGuide() {
  const { guideId } = useParams<{ guideId: string }>();
  
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
            <Link 
              to="/rights-insight" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Rights Insight
            </Link>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4 ml-4">
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
        <div className="max-w-3xl mx-auto space-y-12">
          
          {/* Section 1: Before You Start */}
          <section className="p-6 rounded-2xl bg-secondary/30 border border-border">
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
          </section>

          {/* Section 2: What This System Is */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold">1</span>
              </div>
              <h2 className="text-xl font-semibold text-foreground">What This System Is</h2>
            </div>
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
          </section>

          {/* Section 3: Why It Feels Confusing */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                <span className="text-accent font-bold">2</span>
              </div>
              <h2 className="text-xl font-semibold text-foreground">Why It Feels So Confusing</h2>
            </div>
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
          </section>

          {/* Section 4: What Usually Happens */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold">3</span>
              </div>
              <h2 className="text-xl font-semibold text-foreground">What Usually Happens</h2>
            </div>
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
          </section>

          {/* Section 5: What Success Actually Looks Like */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                <span className="text-success font-bold">4</span>
              </div>
              <h2 className="text-xl font-semibold text-foreground">What Success Actually Looks Like</h2>
            </div>
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
          </section>

          {/* Section 6: What They Know — But You Don't */}
          <section className="p-6 rounded-2xl bg-card border-2 border-accent/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                <Eye className="w-5 h-5 text-accent" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">What They Know — But You Don't</h2>
            </div>
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
          </section>

          {/* Section 7: What People Often Misunderstand */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-destructive/20 flex items-center justify-center">
                <span className="text-destructive font-bold">5</span>
              </div>
              <h2 className="text-xl font-semibold text-foreground">What People Often Misunderstand</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">Common traps and misconceptions:</p>
            <div className="space-y-3">
              {guide.misunderstandings.traps.map((trap, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                  <XCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">{trap}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Section 8: What Actually Matters */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-bold">6</span>
              </div>
              <h2 className="text-xl font-semibold text-foreground">What Actually Matters</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {guide.whatMatters.map((item, i) => (
                <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{item}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Section 9: What You Can Do Safely */}
          <section className="p-6 rounded-2xl bg-success/5 border border-success/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-success" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">What You Can Do Safely</h2>
            </div>
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
          </section>

          {/* Section 10: When It's Time to Escalate */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                <Scale className="w-5 h-5 text-accent" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">When It's Time to Escalate</h2>
            </div>
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
          </section>

          {/* Section 11: Closing */}
          <section className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">A Final Note</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {guide.closing.reassurance}
            </p>
          </section>

          {/* Sources & References */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                <FileText className="w-5 h-5 text-foreground" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">Sources & References</h2>
            </div>
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
          </section>

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
    </Layout>
  );
}
