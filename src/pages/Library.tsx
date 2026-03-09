import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { bannerLibrary } from "@/assets/index";
import { 
  Building2, 
  EyeOff, 
  AlertTriangle,
  Route, 
  FileCheck, 
  Shield, 
  Scale,
  ChevronDown,
  BookOpen,
  ArrowLeft,
  Users,
  HelpCircle,
  Wrench,
  FileText,
  ArrowRight
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { DepthToggle, type DepthLevel } from "@/components/shared/DepthToggle";
import { libraryContent, type LibrarySection, type LibrarySubsection } from "@/data/libraryContent";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  Building2,
  EyeOff,
  AlertTriangle,
  Route,
  FileCheck,
  Shield,
  Scale,
};

export default function Library() {
  const [searchParams] = useSearchParams();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const fromAnalyzer = searchParams.get("from") === "analyzer";

  // Handle direct linking via URL params
  useEffect(() => {
    const section = searchParams.get("section");
    if (section) {
      setExpandedSection(section);
      setTimeout(() => {
        const el = document.getElementById(`section-${section}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [searchParams]);

  return (
    <Layout>
      {/* Back to Analyzer */}
      {fromAnalyzer && (
        <div className="bg-accent/5 border-b border-accent/20">
          <div className="container mx-auto px-4 py-3">
            <Link
              to="/analyzer"
              className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to my Analyzer Results
            </Link>
          </div>
        </div>
      )}

      {/* Hero Banner */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={bannerLibrary}
            alt=""
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
        </div>
        
        {/* Header — short orientation */}
        <div className="container relative pt-12 lg:pt-16 pb-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-4">
              <BookOpen className="w-4 h-4" />
              <span>Rights Insight</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Rights Insight
            </h1>
            <p className="text-muted-foreground">
              How systems actually operate. Plain language. At your pace.
            </p>
          </div>
        </div>
      </div>

      <div className="container pb-16">
        {/* Wellbeing note */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="p-3 rounded-xl bg-secondary/50 border border-border">
            <p className="text-xs text-muted-foreground text-center">
              This content covers difficult realities. Take breaks as needed. You can bookmark sections and return later.
            </p>
          </div>
        </div>

        {/* Section Card Grid */}
        <div className="max-w-3xl mx-auto space-y-3">
          {libraryContent.map((section) => {
            const Icon = iconMap[section.icon] || Shield;
            const isExpanded = expandedSection === section.id;

            return (
              <div
                key={section.id}
                id={`section-${section.id}`}
                className={cn(
                  "rounded-xl border bg-card transition-all duration-300 overflow-hidden",
                  isExpanded
                    ? "border-primary/30 shadow-lg"
                    : "border-border hover:border-primary/20 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                )}
              >
                {/* Section header */}
                <button
                  onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                  className="w-full p-5 sm:p-6 flex items-start gap-4 text-left"
                >
                  <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-foreground text-base mb-0.5">{section.title}</h2>
                    <p className="text-sm text-muted-foreground line-clamp-1">{section.description}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-muted-foreground hidden sm:block">
                      {section.subsections.length} topics
                    </span>
                    <ChevronDown
                      className={cn(
                        "w-5 h-5 text-muted-foreground transition-transform duration-300",
                        isExpanded && "rotate-180"
                      )}
                    />
                  </div>
                </button>

                {/* Expanded: subsection cards */}
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300",
                    isExpanded ? "max-h-[8000px] opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0 border-t border-border/50 space-y-2 pt-4">
                    {section.subsections.map((sub) => (
                      <SubsectionCard key={sub.id} subsection={sub} />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Navigation Pathway */}
        <div className="max-w-3xl mx-auto mt-16">
          <h2 className="text-sm font-semibold text-muted-foreground mb-4 text-center">Continue exploring</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Educational Guides", href: "/rights-insight", icon: BookOpen },
              { label: "Support Network", href: "/support-network", icon: Users },
              { label: "Find Legal Help", href: "/find-help", icon: HelpCircle },
              { label: "Analyzer", href: "/analyzer", icon: Scale },
              { label: "Documentation Tools", href: "/tools", icon: Wrench },
              { label: "Public Records", href: "/public-request-rights", icon: FileText },
            ].map((nav) => (
              <Link
                key={nav.href}
                to={nav.href}
                className="group flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/20 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <nav.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {nav.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-2xl mx-auto mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">Not sure where to start?</p>
          <Button variant="hero" size="lg" asChild>
            <Link to="/analyzer">
              Start the Analyzer
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>

        {/* Disclaimer */}
        <div className="max-w-4xl mx-auto mt-12 pt-8 border-t border-border">
          <Disclaimer className="justify-center" />
        </div>
      </div>
    </Layout>
  );
}

/** Subsection card with depth toggle */
function SubsectionCard({ subsection }: { subsection: LibrarySubsection }) {
  const [isOpen, setIsOpen] = useState(false);
  const [depth, setDepth] = useState<DepthLevel>("quick");

  // Split content into depth buckets
  const quickPoints = subsection.content.slice(0, 2);
  const understandPoints = subsection.content.slice(0, 4);
  const fullPoints = subsection.content;

  return (
    <div
      className={cn(
        "rounded-lg border bg-card/50 transition-all duration-200 overflow-hidden",
        isOpen
          ? "border-primary/20"
          : "border-border/70 hover:border-border hover:bg-card cursor-pointer"
      )}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left"
      >
        <span className="text-sm font-medium text-foreground">{subsection.title}</span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="px-4 pb-4 pt-0 border-t border-border/50 space-y-4 animate-fade-in">
          {/* Trauma note */}
          {subsection.traumaNote && (
            <div className="mt-3 p-3 rounded-lg bg-accent/5 border border-accent/10">
              <p className="text-xs text-muted-foreground italic">{subsection.traumaNote}</p>
            </div>
          )}

          {/* Depth toggle */}
          <DepthToggle value={depth} onChange={setDepth} className="mt-3" />

          {/* Content by depth */}
          <ul className="space-y-2 animate-fade-in">
            {(depth === "quick" ? quickPoints : depth === "understand" ? understandPoints : fullPoints).map(
              (point, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-muted-foreground leading-relaxed">
                  <span className="text-primary/60 shrink-0 mt-1">•</span>
                  <span>{point}</span>
                </li>
              )
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
