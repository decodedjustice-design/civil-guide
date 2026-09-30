import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { 
  BookOpen, 
  Scale, 
  Shield, 
  Building2, 
  Briefcase, 
  Home, 
  GraduationCap,
  Stethoscope,
  Heart,
  ArrowRight,
  ArrowLeft,
  Search,
  Users,
  HelpCircle,
  FileText,
  Wrench
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { categoryCourts as insightImage } from "@/assets/index";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { SystemCard } from "@/components/shared/SystemCard";
import { ScenarioCard } from "@/components/shared/ScenarioCard";
import {
  rightsInsightGuides,
  systemCategories,
  type SystemId
} from "@/data/rightsInsightContent";

type FilterId = "all" | SystemId;

const systemIcons: Record<string, React.ElementType> = {
  police: Shield,
  employment: Briefcase,
  housing: Home,
  disability: Heart,
  courts: Scale,
  incarceration: Building2,
  education: GraduationCap,
  healthcare: Stethoscope,
  government: Building2,
  cps_dcyf: Users,
};

export default function RightsInsight() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSystem, setExpandedSystem] = useState<string | null>(null);

  const fromAnalyzer = searchParams.get("from") === "analyzer";

  // Auto-expand a system if filtered via URL
  useEffect(() => {
    const filterParam = searchParams.get("filter");
    if (filterParam && filterParam !== "general" && systemCategories.some(c => c.id === filterParam)) {
      setExpandedSystem(filterParam);
    }
  }, [searchParams]);

  // Filter categories by search
  const filteredCategories = systemCategories.filter(cat => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const guidesInCat = rightsInsightGuides.filter(g => g.systemId === cat.id);
    return (
      cat.label.toLowerCase().includes(q) ||
      cat.description.toLowerCase().includes(q) ||
      guidesInCat.some(g => 
        g.title.toLowerCase().includes(q) ||
        g.orientation.whatThisSystemIs.toLowerCase().includes(q)
      )
    );
  });

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

      {/* Cinematic knowledge hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={insightImage} alt="" className="w-full h-full object-cover opacity-45" />
          <div className="absolute inset-0 bg-gradient-to-r from-espresso/95 via-espresso/75 to-espresso/35" />
        </div>
        <div className="container relative py-14 lg:py-20">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 text-white/80 text-xs font-medium mb-5">
              <BookOpen className="w-4 h-4" />
              <span>Rights Insight</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-white leading-tight max-w-3xl">
              Understand the system before you decide what to do next.
            </h1>
            <p className="text-white/70 text-base sm:text-lg max-w-2xl mt-5 leading-relaxed">
              Plain-language explanations of the systems people encounter — with paths back to the underlying rules, records, and research tools.
            </p>
          </div>
        </div>
      </section>

      <div className="container pb-16">
        {/* Wellbeing note */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="p-3 rounded-xl bg-secondary/50 border border-border">
            <p className="text-xs text-muted-foreground text-center">
              You can pause, bookmark, or return later. Understanding systems takes time.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="grid sm:grid-cols-[1fr_auto] gap-3 items-center mb-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Explore by system</p>
              <p className="text-sm text-muted-foreground mt-1">Choose a category, then open the guide closest to your situation.</p>
            </div>
            <Link to="/education-library" className="text-sm text-primary hover:underline inline-flex items-center gap-1">
              Open full education library <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="max-w-md">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics..."
              className="w-full h-11 pl-11 pr-4 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            />
          </div>
          </div>
        </div>

        {/* System Card Grid — each system is a card, guides are nested scenario cards */}
        <div className="max-w-3xl mx-auto space-y-3">
          {filteredCategories.map((category) => {
            const Icon = systemIcons[category.id] || Shield;
            const guidesForSystem = rightsInsightGuides.filter(g => g.systemId === category.id);
            
            // Also filter guides by search within expanded system
            const filteredGuides = searchQuery
              ? guidesForSystem.filter(g =>
                  g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  g.orientation.whatThisSystemIs.toLowerCase().includes(searchQuery.toLowerCase())
                )
              : guidesForSystem;

            return (
              <SystemCard
                key={category.id}
                icon={Icon}
                title={category.label}
                subtitle={category.description}
                guideCount={guidesForSystem.length}
                isExpanded={expandedSystem === category.id}
                onToggle={() => setExpandedSystem(expandedSystem === category.id ? null : category.id)}
              >
                <div className="space-y-2 pt-4">
                  {filteredGuides.map((guide) => (
                    <ScenarioCard key={guide.id} guide={guide} />
                  ))}
                  {filteredGuides.length === 0 && (
                    <p className="text-sm text-muted-foreground py-4 text-center">
                      No topics match your search in this category.
                    </p>
                  )}
                </div>
              </SystemCard>
            );
          })}

          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No topics found matching your search.</p>
            </div>
          )}
        </div>

        {/* Bottom Navigation Pathway */}
        <div className="max-w-3xl mx-auto mt-16">
          <h2 className="text-sm font-semibold text-muted-foreground mb-4 text-center">Continue exploring</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "Support Network", href: "/support-network", icon: Users },
              { label: "Find Legal Help", href: "/find-help", icon: HelpCircle },
              { label: "Analyzer", href: "/analyzer", icon: Scale },
              { label: "Documentation Tools", href: "/tools", icon: Wrench },
              { label: "Public Records", href: "/public-request-rights", icon: FileText },
              { label: "About", href: "/about", icon: BookOpen },
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
          <p className="text-sm text-muted-foreground mb-4">
            Have a specific situation?
          </p>
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
