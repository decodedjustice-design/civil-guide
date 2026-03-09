import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BookOpen, ArrowRight, Search, ChevronRight, Bookmark, Clock, Star, BookmarkCheck } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { libraryCategories, type LibraryCategoryCard } from "@/data/legalEducationLibrary";
import { categoryImages } from "@/assets/index";
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
const recommendedIds = ["housing-rights", "police-encounters", "cps-dcyf", "education-rights", "disability-rights", "traffic-stops"];

/* ─── Category Card ─── */
function CategoryCard({ category, index, isSaved, onToggleSave }: {
  category: LibraryCategoryCard;
  index: number;
  isSaved?: boolean;
  onToggleSave?: () => void;
}) {
  const Icon = category.icon;
  const categoryImage = categoryImages[category.id];

  return (
    <div
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: "both" }}
      className="group relative flex flex-col rounded-2xl border border-border bg-card overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-2 hover:border-primary/30 animate-fade-in"
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
        {/* Hero Image */}
        <div className="relative h-52 sm:h-56 overflow-hidden">
          {categoryImage ? (
            <img
              src={categoryImage}
              alt={category.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-secondary" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-500" />
          <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-card/90 backdrop-blur-sm border border-border/50 flex items-center justify-center shadow-sm group-hover:bg-primary/15 group-hover:border-primary/30 transition-all duration-300">
            <Icon className="w-5 h-5 text-primary transition-colors duration-300" />
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5 pt-3">
          <h3 className="font-semibold text-foreground text-lg leading-tight mb-1.5 group-hover:text-primary transition-colors duration-300">
            {category.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
            {category.subtitle}
          </p>
          <div className="mt-auto space-y-1.5 mb-4">
            {category.quickFacts.slice(0, 2).map((fact, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground/80">
                <span className="w-1 h-1 rounded-full bg-primary/50 shrink-0 mt-1.5" />
                <span className="line-clamp-1">{fact}</span>
              </div>
            ))}
          </div>
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
            Structured guides for core areas of civil rights. Each guide walks you through what the system is, how it works, and what you can do — at your own pace.
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
