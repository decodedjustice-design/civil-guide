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
  Search,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  Users,
  HelpCircle
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/shared/Disclaimer";
import {
  rightsInsightGuides,
  systemCategories,
  type RightsInsightGuide,
  type SystemId
} from "@/data/rightsInsightContent";
import heroImage from "@/assets/hero-paperwork.png";

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
};

export default function RightsInsight() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const [bookmarkedGuides, setBookmarkedGuides] = useState<Set<string>>(new Set());
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null);

  // Read filter from URL on mount
  useEffect(() => {
    const filterParam = searchParams.get("filter");
    // Handle "general" filter from Analyzer as "all"
    if (filterParam === "general") {
      setActiveFilter("all");
    } else if (filterParam && systemCategories.some(c => c.id === filterParam)) {
      setActiveFilter(filterParam as FilterId);
    }
  }, [searchParams]);

  // Load bookmarks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("bookmarkedGuides");
    if (saved) {
      setBookmarkedGuides(new Set(JSON.parse(saved)));
    }
  }, []);

  const toggleBookmark = (guideId: string) => {
    setBookmarkedGuides(prev => {
      const newSet = new Set(prev);
      if (newSet.has(guideId)) {
        newSet.delete(guideId);
      } else {
        newSet.add(guideId);
      }
      localStorage.setItem("bookmarkedGuides", JSON.stringify([...newSet]));
      return newSet;
    });
  };

  const filteredGuides = rightsInsightGuides.filter(guide => {
    const matchesFilter = activeFilter === "all" || guide.systemId === activeFilter;
    const matchesSearch = 
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.orientation.whatThisSystemIs.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const activeCategory = systemCategories.find(c => c.id === activeFilter);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="" 
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-background/30" />
        </div>
        
        <div className="container relative py-12 lg:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-4">
              <BookOpen className="w-4 h-4" />
              <span>Guided by Clarity</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Library
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Understand how different systems work, what usually matters, and where people often lose time or focus. 
              Plain language, at your pace.
            </p>
          </div>
        </div>
      </section>

      <div className="container py-12 lg:py-16">
        {/* Search */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides..."
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            />
          </div>
        </div>

        {/* Wellbeing Note */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="p-4 rounded-xl bg-secondary/50 border border-border">
            <p className="text-sm text-muted-foreground text-center">
              Some of this information may relate to difficult experiences. You can pause, bookmark, or return later. 
              Understanding systems takes time, and that's okay.
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                activeFilter === "all"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              All Topics
            </button>
            {systemCategories.map((category) => {
              const Icon = systemIcons[category.id] || Shield;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveFilter(category.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    activeFilter === category.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {category.label.split(" & ")[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active filter context */}
        {activeCategory && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="p-4 rounded-xl bg-card border border-border">
              <h2 className="font-semibold text-foreground mb-1">{activeCategory.label}</h2>
              <p className="text-sm text-muted-foreground">{activeCategory.description}</p>
            </div>
          </div>
        )}

        {/* Guides */}
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredGuides.map((guide) => (
            <GuideCard
              key={guide.id}
              guide={guide}
              isBookmarked={bookmarkedGuides.has(guide.id)}
              isExpanded={expandedGuide === guide.id}
              onToggleBookmark={() => toggleBookmark(guide.id)}
              onToggleExpand={() => setExpandedGuide(expandedGuide === guide.id ? null : guide.id)}
            />
          ))}

          {filteredGuides.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No guides found matching your search.
              </p>
            </div>
          )}
        </div>

        {/* Browse by Topic (when showing all) */}
        {activeFilter === "all" && (
          <div className="max-w-4xl mx-auto mt-16">
            <h2 className="text-xl font-semibold text-accent mb-6 border-l-4 border-accent pl-4">Browse by Topic</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {systemCategories.map((category) => {
                const Icon = systemIcons[category.id] || Shield;
                const guideCount = rightsInsightGuides.filter(g => g.systemId === category.id).length;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveFilter(category.id)}
                    className="group p-5 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-glow transition-all duration-300 text-left"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors mb-1">
                          {category.label}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {category.description}
                        </p>
                        <p className="text-xs text-text-softer">
                          {guideCount} {guideCount === 1 ? "guide" : "guides"}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Related links when filtered */}
        {activeFilter !== "all" && (
          <div className="max-w-4xl mx-auto mt-12 p-6 rounded-xl bg-card border border-border">
            <h3 className="font-semibold text-accent mb-4 border-l-4 border-accent pl-3">Related Resources</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="soft" size="sm" asChild>
                <Link to={`/support-network?filter=${activeFilter}`}>
                  <Users className="w-4 h-4 mr-2" />
                  Find Agencies for {activeCategory?.label}
                </Link>
              </Button>
              <Button variant="soft" size="sm" asChild>
                <Link to="/find-help">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Find Legal Help
                </Link>
              </Button>
              <Button variant="soft" size="sm" asChild>
                <Link to="/analyzer">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Start the Analyzer
                </Link>
              </Button>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="max-w-2xl mx-auto mt-16 text-center">
          <p className="text-muted-foreground mb-6">
            Have a specific situation? The Analyzer can help point you to relevant resources.
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

function GuideCard({ 
  guide, 
  isBookmarked, 
  isExpanded,
  onToggleBookmark,
  onToggleExpand 
}: { 
  guide: RightsInsightGuide;
  isBookmarked: boolean;
  isExpanded: boolean;
  onToggleBookmark: () => void;
  onToggleExpand: () => void;
}) {
  const Icon = systemIcons[guide.systemId] || Shield;
  const categoryLabel = systemCategories.find(c => c.id === guide.systemId)?.label || "";

  return (
    <article className="rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-200 overflow-hidden">
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
              <Icon className="w-4 h-4 text-foreground" />
            </div>
            <span className="text-xs text-primary font-medium">{categoryLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{guide.readTime}</span>
            <button 
              onClick={onToggleBookmark}
              className="text-muted-foreground hover:text-primary transition-colors p-1"
              aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-4 h-4 text-primary" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <h3 className="font-semibold text-foreground text-lg mb-2">
          {guide.title}
        </h3>

        {/* Quick Orientation Summary */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {guide.orientation.whatThisSystemIs}
        </p>

        <button
          onClick={onToggleExpand}
          className="flex items-center gap-1 text-sm text-primary hover:underline"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Show less
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Read full guide
            </>
          )}
        </button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-5 pb-5 pt-0 space-y-6 border-t border-border mt-0 pt-5">
          {/* Quick Orientation */}
          <section>
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center">1</span>
              Quick Orientation
            </h4>
            <div className="space-y-3 pl-8">
              <div>
                <h5 className="text-xs font-medium text-foreground mb-1">What this system is</h5>
                <p className="text-sm text-muted-foreground">{guide.orientation.whatThisSystemIs}</p>
              </div>
              <div>
                <h5 className="text-xs font-medium text-foreground mb-1">Who holds power</h5>
                <p className="text-sm text-muted-foreground">{guide.orientation.whoHoldsPower}</p>
              </div>
              <div>
                <h5 className="text-xs font-medium text-foreground mb-1">Why it feels confusing</h5>
                <p className="text-sm text-muted-foreground">{guide.orientation.whyItFeelsConfusing}</p>
              </div>
            </div>
          </section>

          {/* Common Situations */}
          <section>
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center">2</span>
              Common Situations
            </h4>
            <ul className="space-y-1.5 pl-8">
              {guide.commonSituations.map((situation, idx) => (
                <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  {situation}
                </li>
              ))}
            </ul>
          </section>

          {/* What Usually Matters */}
          <section>
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center">3</span>
              What Usually Matters
            </h4>
            <ul className="space-y-1.5 pl-8">
              {guide.whatMatters.map((item, idx) => (
                <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* What Often Doesn't */}
          <section>
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-secondary text-muted-foreground text-xs flex items-center justify-center">4</span>
              What Often Doesn't Matter (as much as people think)
            </h4>
            <ul className="space-y-1.5 pl-8">
              {guide.whatDoesntMatter.map((item, idx) => (
                <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-muted-foreground mt-1">○</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Key Deadlines */}
          {guide.keyDeadlines && (
            <section className="p-4 rounded-lg bg-secondary/50 border border-border">
              <h4 className="text-xs font-semibold text-foreground mb-2">⏱ Key Deadlines</h4>
              <p className="text-sm text-muted-foreground">{guide.keyDeadlines}</p>
            </section>
          )}

          {/* Trauma-Aware Note */}
          {guide.traumaAwareNote && (
            <section className="p-4 rounded-lg bg-accent/10 border border-accent/20">
              <p className="text-sm text-muted-foreground italic">{guide.traumaAwareNote}</p>
            </section>
          )}

          {/* Related Links */}
          <section className="pt-4 border-t border-border">
            <h4 className="text-xs font-semibold text-foreground mb-3">Related Resources</h4>
            <div className="flex flex-wrap gap-2">
              <Button variant="soft" size="sm" asChild>
                <Link to={`/support-network?filter=${guide.systemId}`}>
                  <Users className="w-3 h-3 mr-1.5" />
                  Find Agencies
                </Link>
              </Button>
              <Button variant="soft" size="sm" asChild>
                <Link to="/find-help">
                  <HelpCircle className="w-3 h-3 mr-1.5" />
                  Legal Help
                </Link>
              </Button>
              <Button variant="soft" size="sm" asChild>
                <Link to="/analyzer">
                  <ArrowRight className="w-3 h-3 mr-1.5" />
                  Analyzer
                </Link>
              </Button>
            </div>
          </section>
        </div>
      )}
    </article>
  );
}
