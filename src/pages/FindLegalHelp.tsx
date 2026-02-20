import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Scale, 
  Users, 
  Search,
  ArrowRight,
  Briefcase,
  Heart,
  HandHeart,
  BookOpen,
  Library,
  Building2,
  FileText,
  ScrollText,
  Globe,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  FileSearch,
  Lightbulb
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { Input } from "@/components/ui/input";
import { AttorneyDirectory } from "@/components/legal/AttorneyDirectory";
import { LegalResourceCard } from "@/components/legal/LegalResourceCard";
import { LawLibraryCard } from "@/components/legal/LawLibraryCard";
import { legalResources, RESOURCE_CATEGORIES } from "@/data/legalResources";
import { lawLibraryResources, LAW_LIBRARY_CATEGORIES } from "@/data/lawLibraryResources";

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "legal-aid": return Users;
    case "civil-rights": return Scale;
    case "advocacy": return HandHeart;
    default: return Briefcase;
  }
};

const getCategoryDescription = (category: string) => {
  switch (category) {
    case "legal-aid": return "Free and low-cost legal services";
    case "civil-rights": return "Organizations focused on civil liberties";
    case "advocacy": return "Support and system navigation help";
    default: return "";
  }
};

const getLibraryCategoryIcon = (category: string) => {
  switch (category) {
    case "state-law-libraries": return Library;
    case "county-law-libraries": return Building2;
    case "municipal-law-libraries": return Building2;
    case "court-forms": return FileText;
    case "bar-association": return ScrollText;
    case "public-records": return Globe;
    default: return BookOpen;
  }
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function ResourceCategoryCard({ 
  categoryId, 
  label, 
  resources, 
  expanded, 
  onToggle 
}: { 
  categoryId: string; 
  label: string; 
  resources: typeof legalResources; 
  expanded: boolean; 
  onToggle: () => void;
}) {
  const Icon = getCategoryIcon(categoryId);
  const description = getCategoryDescription(categoryId);

  return (
    <div className="rounded-2xl bg-card border border-border overflow-hidden transition-all duration-300">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-secondary/30 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-accent/15 flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{label}</h3>
            <p className="text-sm text-muted-foreground">{description} · {resources.length} resources</p>
          </div>
        </div>
        <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform duration-300 shrink-0 ${expanded ? "rotate-90" : ""}`} />
      </button>

      {expanded && (
        <div className="px-6 pb-5 space-y-4 border-t border-border/50 pt-4">
          {resources.map((resource) => (
            <LegalResourceCard key={resource.id} resource={resource} expanded />
          ))}
        </div>
      )}
    </div>
  );
}

function LibraryCategoryCard({ 
  categoryId, 
  label, 
  resources, 
  expanded, 
  onToggle 
}: { 
  categoryId: string; 
  label: string; 
  resources: typeof lawLibraryResources; 
  expanded: boolean; 
  onToggle: () => void;
}) {
  const Icon = getLibraryCategoryIcon(categoryId);

  return (
    <div className="rounded-2xl bg-card border border-border overflow-hidden transition-all duration-300">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-secondary/30 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-accent/15 flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{label}</h3>
            <p className="text-sm text-muted-foreground">
              {resources.length} {resources.length === 1 ? 'resource' : 'resources'}
            </p>
          </div>
        </div>
        <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform duration-300 shrink-0 ${expanded ? "rotate-90" : ""}`} />
      </button>

      {expanded && (
        <div className="px-6 pb-5 space-y-3 border-t border-border/50 pt-4">
          {resources.map((resource) => (
            <LawLibraryCard key={resource.id} resource={resource} />
          ))}
        </div>
      )}
    </div>
  );
}

function TipCard({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary/30 border border-border/50">
      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-accent/20 text-accent text-xs font-bold shrink-0">{number}</span>
      <p className="text-sm text-muted-foreground">
        <strong className="text-foreground">{title}</strong> — {description}
      </p>
    </div>
  );
}

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function FindLegalHelp() {
  const [resourceFilter, setResourceFilter] = useState("all");
  const [resourceSearch, setResourceSearch] = useState("");
  const [expandedResourceCat, setExpandedResourceCat] = useState<string | null>(null);
  const [expandedLibraryCat, setExpandedLibraryCat] = useState<string | null>(null);
  const [showTips, setShowTips] = useState(false);

  // Filter resources
  const filteredResources = legalResources.filter(resource => {
    const matchesCategory = resourceFilter === "all" || resource.category === resourceFilter;
    const searchLower = resourceSearch.toLowerCase();
    const matchesSearch = !resourceSearch || 
      resource.name.toLowerCase().includes(searchLower) ||
      resource.description.toLowerCase().includes(searchLower) ||
      resource.serviceType.toLowerCase().includes(searchLower);
    return matchesCategory && matchesSearch;
  });

  // Group resources by category
  const groupedResources = filteredResources.reduce((acc, resource) => {
    if (!acc[resource.category]) {
      acc[resource.category] = [];
    }
    acc[resource.category].push(resource);
    return acc;
  }, {} as Record<string, typeof legalResources>);

  return (
    <Layout>
      <div className="container py-12 lg:py-20">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Find Legal Help
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Attorneys, legal aid, and official resources — organized and searchable. Take your time.
            </p>
          </div>

          <div className="max-w-3xl mx-auto mb-12">
            <Disclaimer variant="prominent" />
          </div>

          {/* ── Attorney Directory Card ── */}
          <section className="mb-10">
            <div className="rounded-2xl bg-card border border-border overflow-hidden">
              <div className="flex items-center gap-4 px-6 py-5 border-b border-border/50">
                <div className="w-11 h-11 rounded-xl bg-accent/15 flex items-center justify-center shrink-0">
                  <Briefcase className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Attorney Directory</h2>
                  <p className="text-sm text-muted-foreground">Washington State civil rights attorneys</p>
                </div>
              </div>
              <div className="p-6">
                <AttorneyDirectory />
              </div>
            </div>
          </section>

          {/* ── Legal Aid & Advocacy Cards ── */}
          <section className="mb-10">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-11 h-11 rounded-xl bg-accent/15 flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Legal Aid & Advocacy</h2>
                <p className="text-sm text-muted-foreground">Free resources, civil rights orgs, and support services</p>
              </div>
            </div>

            {/* Search & Filters */}
            <div className="max-w-4xl mb-5 space-y-3">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  value={resourceSearch}
                  onChange={(e) => setResourceSearch(e.target.value)}
                  placeholder="Search organizations..."
                  className="pl-12 h-12 rounded-xl"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {RESOURCE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setResourceFilter(cat.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer active:scale-[0.98] ${
                      resourceFilter === cat.id
                        ? "bg-accent text-accent-foreground shadow-glow"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-2 border-transparent hover:border-accent/30"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Cards */}
            <div className="max-w-4xl space-y-4">
              {resourceFilter === "all" ? (
                Object.entries(groupedResources).map(([category, categoryResources]) => {
                  const categoryLabel = RESOURCE_CATEGORIES.find(c => c.id === category)?.label || category;
                  return (
                    <ResourceCategoryCard
                      key={category}
                      categoryId={category}
                      label={categoryLabel}
                      resources={categoryResources}
                      expanded={expandedResourceCat === category}
                      onToggle={() => setExpandedResourceCat(expandedResourceCat === category ? null : category)}
                    />
                  );
                })
              ) : (
                <div className="space-y-4">
                  {filteredResources.map((resource) => (
                    <LegalResourceCard key={resource.id} resource={resource} expanded />
                  ))}
                </div>
              )}

              {filteredResources.length === 0 && (
                <div className="text-center py-12 rounded-2xl bg-card border border-border">
                  <p className="text-muted-foreground mb-1">No resources found matching your search.</p>
                  <p className="text-sm text-muted-foreground/70 mb-4">Civil rights cases can be hard to place. This is not your fault.</p>
                  <Button 
                    variant="outline" 
                    onClick={() => { setResourceFilter("all"); setResourceSearch(""); }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </section>

          {/* ── Law Libraries Cards ── */}
          <section className="mb-10">
            <div className="flex items-center gap-4 mb-5">
              <div className="w-11 h-11 rounded-xl bg-accent/15 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Official Legal Resources & Law Libraries</h2>
                <p className="text-sm text-muted-foreground">Public law libraries, court forms, and records portals</p>
              </div>
            </div>

            <div className="max-w-4xl space-y-4">
              {LAW_LIBRARY_CATEGORIES.map((category) => {
                const categoryResources = lawLibraryResources.filter(r => r.category === category.id);
                if (categoryResources.length === 0) return null;
                return (
                  <LibraryCategoryCard
                    key={category.id}
                    categoryId={category.id}
                    label={category.label}
                    resources={categoryResources}
                    expanded={expandedLibraryCat === category.id}
                    onToggle={() => setExpandedLibraryCat(expandedLibraryCat === category.id ? null : category.id)}
                  />
                );
              })}
            </div>
          </section>

          {/* ── Tips Card (Progressive Reveal) ── */}
          <section className="mb-10">
            <div className="max-w-3xl mx-auto rounded-2xl bg-card border border-border overflow-hidden">
              <button
                onClick={() => setShowTips(!showTips)}
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-secondary/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-accent/15 flex items-center justify-center shrink-0">
                    <Lightbulb className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Tips for Finding the Right Help</h2>
                    <p className="text-sm text-muted-foreground">5 things to know before reaching out</p>
                  </div>
                </div>
                <ChevronRight className={`w-5 h-5 text-muted-foreground transition-transform duration-300 shrink-0 ${showTips ? "rotate-90" : ""}`} />
              </button>

              {showTips && (
                <div className="px-6 pb-5 space-y-3 border-t border-border/50 pt-4">
                  <TipCard number={1} title="Start with legal aid organizations" description="they can often provide free consultations and help you understand your options." />
                  <TipCard number={2} title="Prepare before you call" description="have dates, names, and a brief summary of what happened ready." />
                  <TipCard number={3} title="Ask about fees upfront" description="many civil rights attorneys work on contingency (no fee unless you win)." />
                  <TipCard number={4} title="Know your deadlines" description="civil rights claims often have strict filing deadlines (sometimes as short as 180 days)." />
                  <TipCard number={5} title="Don't send evidence immediately" description="wait until an attorney confirms no conflict of interest before sharing sensitive documents." />
                </div>
              )}
            </div>
          </section>

          {/* ── Bottom Navigation Pathway ── */}
          <section className="mb-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {[
                { to: "/analyzer", icon: FileSearch, label: "Analyzer", sub: "Understand your situation" },
                { to: "/support-network", icon: ShieldCheck, label: "Support Network", sub: "Advocacy & crisis help" },
                { to: "/rights-insight", icon: Scale, label: "Rights Insight", sub: "Know your rights" },
              ].map((nav) => (
                <Link
                  key={nav.to}
                  to={nav.to}
                  className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-accent/40 hover:bg-secondary/30 transition-all group"
                >
                  <nav.icon className="w-5 h-5 text-accent shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">{nav.label}</p>
                    <p className="text-xs text-muted-foreground truncate">{nav.sub}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Footer Disclaimer */}
          <div className="pt-8 border-t border-border text-center">
            <Disclaimer className="justify-center" />
          </div>

        </div>
      </div>
    </Layout>
  );
}
