import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { 
  Building2, 
  EyeOff, 
  AlertTriangle, 
  Route, 
  FileCheck, 
  Shield, 
  Scale,
  ChevronRight,
  BookOpen,
  ArrowLeft
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { libraryContent, LibrarySection, LibrarySubsection } from "@/data/libraryContent";
import { cn } from "@/lib/utils";
import { BookmarkButton } from "@/components/shared/BookmarkButton";

const iconMap: Record<string, React.ReactNode> = {
  Building2: <Building2 className="w-5 h-5" />,
  EyeOff: <EyeOff className="w-5 h-5" />,
  AlertTriangle: <AlertTriangle className="w-5 h-5" />,
  Route: <Route className="w-5 h-5" />,
  FileCheck: <FileCheck className="w-5 h-5" />,
  Shield: <Shield className="w-5 h-5" />,
  Scale: <Scale className="w-5 h-5" />
};

export default function Library() {
  const [searchParams] = useSearchParams();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [expandedSubsections, setExpandedSubsections] = useState<string[]>([]);
  
  // Check if user came from Analyzer
  const fromAnalyzer = searchParams.get("from") === "analyzer";
  
  // Handle direct linking via URL params
  useEffect(() => {
    const section = searchParams.get("section");
    const subsection = searchParams.get("subsection");
    
    if (section) {
      setExpandedSections([section]);
      if (subsection) {
        setExpandedSubsections([`${section}-${subsection}`]);
        
        // Scroll to the section after a short delay
        setTimeout(() => {
          const element = document.getElementById(`section-${section}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    }
    
    // Scroll to top on mount if no section specified
    if (!section) {
      window.scrollTo(0, 0);
    }
  }, [searchParams]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const toggleSubsection = (sectionId: string, subsectionId: string) => {
    const key = `${sectionId}-${subsectionId}`;
    setExpandedSubsections(prev => 
      prev.includes(key) 
        ? prev.filter(id => id !== key)
        : [...prev, key]
    );
  };

  return (
    <Layout>
      {/* Back to Analyzer Button - shown when coming from Analyzer */}
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

      {/* Hero Section */}
      <section className="relative py-16 md:py-20 bg-gradient-to-b from-slate-50 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
              <BookOpen className="w-4 h-4" />
              <span>Guided by Clarity</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Rights Insight
            </h1>
            
            <p className="text-lg md:text-xl text-accent font-medium mb-4">
              Rights Insight explains how systems actually operate — the rules they don't explain, the power they hold, and the patterns they follow.
            </p>
            
            <p className="text-base text-muted-foreground/80 mb-6">
              This is not legal advice. It's educational context about how institutions work — 
              the patterns they follow, the assumptions they make, and the gaps between 
              what's promised and what happens.
            </p>
            
            {/* Section Questions Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left max-w-2xl mx-auto mt-8">
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-accent font-medium shrink-0">Systems & Power:</span>
                <span>Who has control</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-accent font-medium shrink-0">Hidden Rules:</span>
                <span>What they don't tell you</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-accent font-medium shrink-0">Patterns of Harm:</span>
                <span>Repeated behaviors</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-accent font-medium shrink-0">Process Reality:</span>
                <span>What actually happens</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-accent font-medium shrink-0">Evidence Truths:</span>
                <span>What counts vs doesn't</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-accent font-medium shrink-0">Safety & Retaliation:</span>
                <span>Risks of action</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground md:col-span-2 justify-center">
                <span className="text-accent font-medium shrink-0">Rights in Practice:</span>
                <span>What rights look like in reality</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wellbeing Note */}
      <section className="py-4 border-y border-border bg-accent/5">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground">
            <span className="text-accent font-medium">Wellbeing note:</span>{" "}
            This content covers difficult realities. Take breaks as needed. You can bookmark sections and return later.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-4">
            {libraryContent.map((section) => (
              <LibrarySectionCard
                key={section.id}
                section={section}
                isExpanded={expandedSections.includes(section.id)}
                expandedSubsections={expandedSubsections}
                onToggle={() => toggleSection(section.id)}
                onToggleSubsection={(subsectionId) => toggleSubsection(section.id, subsectionId)}
                icon={iconMap[section.icon]}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Navigation Help */}
      <section className="py-12 border-t border-border bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-xl font-semibold text-foreground mb-6 text-center">
            Not sure where to start?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Link 
              to="/analyzer"
              className="p-6 bg-white rounded-xl border border-border hover:border-accent/30 hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                Use the Analyzer
              </h3>
              <p className="text-sm text-muted-foreground">
                Answer questions about your situation and receive personalized guidance about which sections are most relevant.
              </p>
            </Link>
            
            <Link 
              to="/rights-insight"
              className="p-6 bg-white rounded-xl border border-border hover:border-accent/30 hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                Browse Educational Guides
              </h3>
              <p className="text-sm text-muted-foreground">
                Explore guides organized by system type — police, housing, CPS, employment, and more.
              </p>
            </Link>
          </div>

          {/* Related Connections */}
          <div className="mt-8 p-6 rounded-xl bg-white border border-border">
            <h3 className="text-sm font-semibold text-foreground mb-4">Related Platform Areas</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <Link to="/support-network" className="flex items-center gap-2 text-accent hover:underline">
                <Scale className="w-4 h-4" />
                Support Network
              </Link>
              <Link to="/tools" className="flex items-center gap-2 text-accent hover:underline">
                <FileCheck className="w-4 h-4" />
                All Tools
              </Link>
              <Link to="/public-request-rights" className="flex items-center gap-2 text-accent hover:underline">
                <FileCheck className="w-4 h-4" />
                Public Request Rights
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

// Section Card Component
interface LibrarySectionCardProps {
  section: LibrarySection;
  isExpanded: boolean;
  expandedSubsections: string[];
  onToggle: () => void;
  onToggleSubsection: (subsectionId: string) => void;
  icon: React.ReactNode;
}

function LibrarySectionCard({
  section,
  isExpanded,
  expandedSubsections,
  onToggle,
  onToggleSubsection,
  icon
}: LibrarySectionCardProps) {
  return (
    <div id={`section-${section.id}`} className="rounded-xl border border-border bg-white overflow-hidden">
      {/* Section Header */}
      <div className="flex items-center gap-2 p-5 hover:bg-slate-50 transition-colors">
        <button
          onClick={onToggle}
          className="flex-1 flex items-center gap-4 text-left"
        >
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors",
            isExpanded ? "bg-accent text-white" : "bg-accent/10 text-accent"
          )}>
            {icon}
          </div>
          
          <div className="flex-1 min-w-0">
            <h2 className={cn(
              "font-semibold text-lg transition-colors",
              isExpanded ? "text-accent" : "text-foreground"
            )}>
              {section.title}
            </h2>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {section.description}
            </p>
          </div>
          
          <ChevronRight className={cn(
            "w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-200",
            isExpanded && "rotate-90"
          )} />
        </button>
        
        <BookmarkButton
          resourceType="library_guide"
          resourceId={section.id}
          resourceTitle={section.title}
          resourceUrl={`/library?section=${section.id}`}
          variant="icon"
        />
      </div>
      
      {/* Subsections */}
      <div className={cn(
        "overflow-hidden transition-all duration-300",
        isExpanded ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="border-t border-border">
          {section.subsections.map((subsection) => {
            const isSubExpanded = expandedSubsections.includes(`${section.id}-${subsection.id}`);
            
            return (
              <div key={subsection.id} className="border-b border-border last:border-b-0">
                {/* Subsection Header */}
                <button
                  onClick={() => onToggleSubsection(subsection.id)}
                  className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-slate-50 transition-colors"
                >
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full shrink-0",
                    isSubExpanded ? "bg-accent" : "bg-muted-foreground/30"
                  )} />
                  <span className={cn(
                    "font-medium transition-colors",
                    isSubExpanded ? "text-accent" : "text-foreground"
                  )}>
                    {subsection.title}
                  </span>
                  <ChevronRight className={cn(
                    "w-4 h-4 text-muted-foreground ml-auto shrink-0 transition-transform duration-200",
                    isSubExpanded && "rotate-90"
                  )} />
                </button>
                
                {/* Subsection Content */}
                <div className={cn(
                  "overflow-hidden transition-all duration-300",
                  isSubExpanded ? "max-h-[3000px] opacity-100" : "max-h-0 opacity-0"
                )}>
                  <div className="px-5 pb-5 pt-2 pl-9">
                    {/* Trauma Note */}
                    {subsection.traumaNote && (
                      <div className="mb-4 p-3 rounded-lg bg-accent/5 border border-accent/20">
                        <p className="text-sm text-muted-foreground">
                          <span className="text-accent font-medium">Note:</span>{" "}
                          {subsection.traumaNote}
                        </p>
                      </div>
                    )}
                    
                    {/* Content Points */}
                    <ul className="space-y-3">
                      {subsection.content.map((point, index) => (
                        <li key={index} className="flex gap-3 text-sm text-foreground/90 leading-relaxed">
                          <span className="text-accent/60 shrink-0 mt-1.5">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
