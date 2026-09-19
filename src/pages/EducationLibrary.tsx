import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BookOpen, ArrowRight, Search, ChevronRight, Bookmark, Clock, Star, BookmarkCheck } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { libraryCategories, type LibraryCategoryCard } from "@/data/legalEducationLibrary";
import { additionalEducationalGuides } from "@/data/educationFullGuides";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

/* ─── Recently Viewed (localStorage) ─── */
const RECENTLY_VIEWED_KEY = "dj_recently_viewed_guides";
const MAX_RECENT = 10;

function getRecentlyViewed(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || "[]");
  } catch {
    return [];
  }
}

/* ─── Recommended guides (static logic based on popular topics) ─── */
const authorityResources: Record<string, { label: string; type: string; url: string }[]> = {
  police: [
    { label: "Washington Constitution, Article I §7", type: "State Constitution", url: "https://app.leg.wa.gov/const/default.aspx?cite=1%20-%207" },
    { label: "U.S. Constitution — Fourth Amendment", type: "Federal law", url: "https://constitution.congress.gov/constitution/amendment-4/" },
    { label: "42 U.S.C. § 1983", type: "Federal civil-rights law", url: "https://uscode.house.gov/view.xhtml?req=granuleid:USC-prelim-title42-section1983" },
    { label: "Washington CJTC", type: "State agency / training", url: "https://cjtc.wa.gov/" },
  ],
  traffic: [
    { label: "RCW Title 46 — Motor Vehicles", type: "Washington law", url: "https://app.leg.wa.gov/RCW/default.aspx?cite=46" },
    { label: "Washington Constitution, Article I §7", type: "State Constitution", url: "https://app.leg.wa.gov/const/default.aspx?cite=1%20-%207" },
    { label: "U.S. Constitution — Fourth Amendment", type: "Federal law", url: "https://constitution.congress.gov/constitution/amendment-4/" },
    { label: "Washington State Patrol", type: "State agency", url: "https://wsp.wa.gov/" },
  ],
  housing: [
    { label: "RCW 59.18 — Residential Landlord-Tenant Act", type: "Washington law", url: "https://app.leg.wa.gov/RCW/default.aspx?cite=59.18" },
    { label: "RCW 49.60 — Law Against Discrimination", type: "Washington law", url: "https://app.leg.wa.gov/RCW/default.aspx?cite=49.60" },
    { label: "Fair Housing Act", type: "Federal law", url: "https://www.hud.gov/fair-housing" },
    { label: "HUD laws & regulations", type: "Federal agency", url: "https://www.hud.gov/laws-and-regulations" },
  ],
  disability: [
    { label: "RCW 49.60 — Law Against Discrimination", type: "Washington law", url: "https://app.leg.wa.gov/RCW/default.aspx?cite=49.60" },
    { label: "Americans with Disabilities Act", type: "Federal law", url: "https://www.ada.gov/law-and-regs/" },
    { label: "Section 504", type: "Federal law", url: "https://www.hhs.gov/civil-rights/for-individuals/disability/index.html" },
  ],
  public_records: [
    { label: "RCW 42.56 — Public Records Act", type: "Washington law", url: "https://app.leg.wa.gov/RCW/default.aspx?cite=42.56" },
    { label: "Washington Attorney General — Public Records", type: "State guidance", url: "https://www.atg.wa.gov/public-records-act" },
  ],
  education: [
    { label: "RCW Title 28A — Common Schools", type: "Washington law", url: "https://app.leg.wa.gov/RCW/default.aspx?cite=28A" },
    { label: "RCW 28A.225 — Attendance", type: "Washington law", url: "https://app.leg.wa.gov/RCW/default.aspx?cite=28A.225" },
    { label: "FERPA — 34 CFR Part 99", type: "Federal law", url: "https://www.ecfr.gov/current/title-34/subtitle-A/part-99" },
    { label: "IDEA", type: "Federal law", url: "https://sites.ed.gov/idea/" },
  ],
  benefits: [
    { label: "RCW Title 74 — Public Assistance", type: "Washington law", url: "https://app.leg.wa.gov/RCW/default.aspx?cite=74" },
    { label: "Social Security Act", type: "Federal law", url: "https://www.ssa.gov/OP_Home/ssact/ssact.htm" },
  ],
  cps_dcyf: [
    { label: "DCYF Child Welfare Policies & Procedures", type: "Agency policy manual", url: "https://www.dcyf.wa.gov/practices-and-procedures" },
    { label: "DCYF Policy, Laws & Rules", type: "Agency policy hub", url: "https://dcyf.wa.gov/practice/policy-laws-rules" },
    { label: "Chapter 13.34 RCW — Dependency", type: "Washington law", url: "https://app.leg.wa.gov/RCW/default.aspx?cite=13.34" },
    { label: "Chapter 26.44 RCW — Abuse of Children", type: "Washington law", url: "https://app.leg.wa.gov/RCW/default.aspx?cite=26.44" },
    { label: "Chapter 74.13 RCW — Child Welfare Services", type: "Washington law", url: "https://app.leg.wa.gov/RCW/default.aspx?cite=74.13" },
    { label: "Chapter 110-30 WAC — CPS", type: "Washington administrative rule", url: "https://app.leg.wa.gov/WAC/default.aspx?cite=110-30" },
    { label: "Federal child-welfare laws", type: "Federal law", url: "https://www.acf.hhs.gov/cb/laws-policies" },
  ],
};

const recommendedIds = ["housing-rights", "police-encounters", "cps-dcyf", "education-rights", "disability-rights", "traffic-stops"];

/* ─── Category Card ─── */
function CategoryCard({ category, index, isSaved, onToggleSave }: {
  category: LibraryCategoryCard;
  index: number;
  isSaved?: boolean;
  onToggleSave?: () => void;
}) {
  const Icon = category.icon;
  const guide = additionalEducationalGuides.find((item) => item.id === category.guideId);
  const sources = guide?.sources?.filter((source) => source.type === "official" || source.type === "agency").slice(0, 2) || [];
  const authorities = authorityResources[guide?.systemId || category.id] || [];

  return (
    <div
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: "both" }}
      className="group relative flex flex-col rounded-2xl border border-border bg-card overflow-hidden transition-all duration-300 hover:shadow-warm-sm hover:border-primary/30 animate-fade-in"
    >
      {/* Save button overlay */}
      {onToggleSave && (
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleSave(); }}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-lg bg-card/90 backdrop-blur-sm border border-border/50 flex items-center justify-center hover:bg-primary/15 hover:border-primary/30 transition-all"
          title={isSaved ? "Remove from saved" : "Save guide"}
        >
          {isSaved ? (
            <BookmarkCheck className="w-4 h-4 text-primary" />
          ) : (
            <Bookmark className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
      )}

      <Link to={`/guide/${category.guideId}`} className="flex flex-col flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50">
          {/* Content */}
        <div className="flex flex-col flex-1 p-6">
          <h3 className="font-semibold text-foreground text-lg leading-tight mb-1.5 group-hover:text-primary transition-colors duration-300">
            {category.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {guide?.whatThisSystemIs.description || category.subtitle}
          </p>
          <div className="mb-4 rounded-lg bg-secondary/40 border border-border/60 p-3">
            <p className="text-[10px] uppercase tracking-[0.16em] text-gold mb-2">Know the basics</p>
            <div className="space-y-1.5">
              {category.quickFacts.slice(0, 4).map((fact, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <span className="w-1 h-1 rounded-full bg-primary/60 shrink-0 mt-1.5" />
                  <span>{fact}</span>
                </div>
              ))}
            </div>
          </div>
          {sources.length > 0 && (
            <div className="mb-4">
              <p className="text-[10px] uppercase tracking-[0.16em] text-gold mb-1.5">Primary resources</p>
              <div className="space-y-1">
                {sources.map((source) => (
                  <span key={source.url} className="block text-[11px] text-muted-foreground truncate">{source.label}</span>
                ))}
              </div>
            </div>
          )}
          {authorities.length > 0 && (
            <div className="mb-4 rounded-lg border border-primary/20 bg-primary/5 p-3">
              <p className="text-[10px] uppercase tracking-[0.16em] text-gold mb-1.5">Authority & policy trail</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed mb-2">Go from the guide to the underlying authority: agency policy or manual, Washington law or rule, and federal law.</p>
              <div className="space-y-1.5">
                {authorities.map((resource) => (
                  <a key={resource.url} href={resource.url} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-2 text-xs text-foreground hover:text-primary">
                    <span className="truncate">{resource.label}</span>
                    <span className="text-[9px] uppercase tracking-wide text-muted-foreground shrink-0">{resource.type}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm font-medium text-primary/80 group-hover:text-primary transition-colors duration-300">
            <span>Open Guide</span>
            <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </Link>
    </div>
  );
}

/* ─── Empty state ─── */
function EmptyState({ icon: Icon, title, description, actionLabel, actionHref }: {
  icon: React.ElementType;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="text-center py-16">
      <Icon className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      {actionLabel && actionHref && (
        <Button variant="soft" size="sm" asChild>
          <Link to={actionHref}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
}

export default function EducationLibrary() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "all";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();

  // Saved guide IDs from DB
  const [savedGuideIds, setSavedGuideIds] = useState<Set<string>>(new Set());
  const [savedLoaded, setSavedLoaded] = useState(false);

  // Recently viewed
  const [recentIds] = useState(() => getRecentlyViewed());

  useEffect(() => {
    if (!user) return;
    supabase
      .from("justice_place_bookmarks")
      .select("resource_id")
      .eq("user_id", user.id)
      .eq("resource_type", "guide")
      .then(({ data }) => {
        setSavedGuideIds(new Set((data || []).map((d) => d.resource_id)));
        setSavedLoaded(true);
      });
  }, [user]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === "all") {
      searchParams.delete("tab");
    } else {
      searchParams.set("tab", tab);
    }
    setSearchParams(searchParams, { replace: true });
  };

  const toggleSave = async (guideId: string, title: string) => {
    if (!user) return;
    const newSet = new Set(savedGuideIds);
    if (newSet.has(guideId)) {
      newSet.delete(guideId);
      setSavedGuideIds(newSet);
      await supabase
        .from("justice_place_bookmarks")
        .delete()
        .eq("user_id", user.id)
        .eq("resource_type", "guide")
        .eq("resource_id", guideId);
    } else {
      newSet.add(guideId);
      setSavedGuideIds(newSet);
      await supabase.from("justice_place_bookmarks").insert({
        user_id: user.id,
        resource_type: "guide",
        resource_id: guideId,
        resource_title: title,
        resource_url: `/guide/${guideId}`,
      });
    }
  };

  // Filtered categories for search
  const allFiltered = useMemo(() => {
    return libraryCategories.filter((cat) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        cat.title.toLowerCase().includes(q) ||
        cat.subtitle.toLowerCase().includes(q) ||
        cat.quickFacts.some((f) => f.toLowerCase().includes(q))
      );
    });
  }, [searchQuery]);

  const savedCategories = libraryCategories.filter((c) => savedGuideIds.has(c.guideId));
  const recentCategories = recentIds
    .map((id) => libraryCategories.find((c) => c.guideId === id))
    .filter(Boolean) as LibraryCategoryCard[];
  const recommendedCategories = libraryCategories.filter((c) => recommendedIds.includes(c.guideId));

  return (
    <Layout>
      {/* Hero */}
      <div className="container pt-12 lg:pt-16 pb-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4" />
            <span>Legal Education Library</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Know Your Rights
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            These guides contain substantive explanations of the systems you may have to navigate — who has authority, what rules commonly apply, what happens next, what to document, and where to verify the law. Start with the topic closest to your situation.
          </p>
        </div>
      </div>

      <div className="container pb-16">
        {/* Wellbeing note */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="p-3 rounded-xl bg-secondary/50 border border-border">
            <p className="text-xs text-muted-foreground text-center">
              You can pause anytime. Bookmark what matters. Come back when you're ready. Understanding takes time — and that's okay.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <TabsList className="h-auto p-1 bg-secondary/50 border border-border rounded-xl w-full sm:w-auto">
                <TabsTrigger value="all" className="rounded-lg py-2 px-4 text-sm data-[state=active]:bg-card data-[state=active]:shadow-sm gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  All Guides
                </TabsTrigger>
                <TabsTrigger value="saved" className="rounded-lg py-2 px-4 text-sm data-[state=active]:bg-card data-[state=active]:shadow-sm gap-1.5">
                  <Bookmark className="w-3.5 h-3.5" />
                  Saved
                  {savedGuideIds.size > 0 && (
                    <span className="ml-1 text-[10px] bg-primary/15 text-primary rounded-full px-1.5 py-0.5 font-medium">
                      {savedGuideIds.size}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="recent" className="rounded-lg py-2 px-4 text-sm data-[state=active]:bg-card data-[state=active]:shadow-sm gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Recent
                </TabsTrigger>
                <TabsTrigger value="recommended" className="rounded-lg py-2 px-4 text-sm data-[state=active]:bg-card data-[state=active]:shadow-sm gap-1.5">
                  <Star className="w-3.5 h-3.5" />
                  Recommended
                </TabsTrigger>
              </TabsList>

              {/* Search — only on All tab */}
              {activeTab === "all" && (
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search topics..."
                    className="w-full h-10 pl-10 pr-4 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                  />
                </div>
              )}
            </div>

            {/* All Guides */}
            <TabsContent value="all">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {allFiltered.map((category, i) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    index={i}
                    isSaved={savedGuideIds.has(category.guideId)}
                    onToggleSave={user ? () => toggleSave(category.guideId, category.title) : undefined}
                  />
                ))}
              </div>
              {allFiltered.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No topics match your search.</p>
                </div>
              )}
            </TabsContent>

            {/* Saved Guides */}
            <TabsContent value="saved">
              {!user ? (
                <EmptyState
                  icon={Bookmark}
                  title="Sign in to see saved guides"
                  description="Save guides to your case for quick access later."
                  actionLabel="Sign In"
                  actionHref="/auth?redirect=/education-library?tab=saved"
                />
              ) : savedCategories.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedCategories.map((category, i) => (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      index={i}
                      isSaved
                      onToggleSave={() => toggleSave(category.guideId, category.title)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Bookmark}
                  title="No saved guides yet"
                  description="Use the bookmark icon on any guide to save it here for quick access."
                />
              )}
            </TabsContent>

            {/* Recently Viewed */}
            <TabsContent value="recent">
              {recentCategories.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentCategories.map((category, i) => (
                    <CategoryCard
                      key={category.id}
                      category={category}
                      index={i}
                      isSaved={savedGuideIds.has(category.guideId)}
                      onToggleSave={user ? () => toggleSave(category.guideId, category.title) : undefined}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Clock}
                  title="No recently viewed guides"
                  description="Guides you open will appear here for easy return."
                />
              )}
            </TabsContent>

            {/* Recommended */}
            <TabsContent value="recommended">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedCategories.map((category, i) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    index={i}
                    isSaved={savedGuideIds.has(category.guideId)}
                    onToggleSave={user ? () => toggleSave(category.guideId, category.title) : undefined}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* CTA */}
        <div className="max-w-2xl mx-auto mt-16 text-center">
          <p className="text-sm text-muted-foreground mb-4">Have a specific situation?</p>
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
