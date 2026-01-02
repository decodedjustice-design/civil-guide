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
  ArrowRight,
  Search,
  Bookmark,
  BookmarkCheck
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/shared/Disclaimer";

type SystemFilter = "all" | "police" | "employment" | "housing" | "education" | "healthcare" | "courts" | "incarceration" | "government" | "general";

interface Category {
  id: SystemFilter;
  icon: React.ElementType;
  title: string;
  description: string;
  articles: number;
}

interface Guide {
  id: string;
  title: string;
  category: SystemFilter;
  categoryLabel: string;
  readTime: string;
  description: string;
}

const categories: Category[] = [
  {
    id: "police",
    icon: Shield,
    title: "Police & Law Enforcement",
    description: "Understanding your rights during police encounters, arrests, and investigations.",
    articles: 12,
  },
  {
    id: "employment",
    icon: Briefcase,
    title: "Workplace Rights",
    description: "Discrimination, harassment, wages, and employment protections.",
    articles: 15,
  },
  {
    id: "housing",
    icon: Home,
    title: "Housing & Tenant Rights",
    description: "Eviction procedures, fair housing, habitability, and lease rights.",
    articles: 10,
  },
  {
    id: "education",
    icon: GraduationCap,
    title: "Education & Student Rights",
    description: "Title IX, disciplinary procedures, IEP/504, and student protections.",
    articles: 8,
  },
  {
    id: "healthcare",
    icon: Stethoscope,
    title: "Healthcare Rights",
    description: "Patient rights, medical privacy, and access to care.",
    articles: 9,
  },
  {
    id: "courts",
    icon: Scale,
    title: "Courts & Legal Process",
    description: "Understanding court procedures, due process, and navigating the system.",
    articles: 14,
  },
  {
    id: "incarceration",
    icon: Building2,
    title: "Incarceration Rights",
    description: "Rights while incarcerated, grievance procedures, and reentry.",
    articles: 7,
  },
  {
    id: "government",
    icon: Building2,
    title: "Government Agencies",
    description: "Benefits, licensing, appeals, and administrative procedures.",
    articles: 6,
  },
];

const allGuides: Guide[] = [
  {
    id: "police-encounter",
    title: "What to Do After a Police Encounter",
    category: "police",
    categoryLabel: "Police & Law Enforcement",
    readTime: "8 min read",
    description: "Step-by-step guidance on documenting an incident and understanding your options."
  },
  {
    id: "police-rights",
    title: "Your Rights During Police Stops",
    category: "police",
    categoryLabel: "Police & Law Enforcement",
    readTime: "6 min read",
    description: "Know what you're required to do and what rights you can assert."
  },
  {
    id: "employment-discrimination",
    title: "Understanding Employment Discrimination",
    category: "employment",
    categoryLabel: "Workplace Rights",
    readTime: "10 min read",
    description: "Learn about protected classes, filing complaints, and workplace retaliation."
  },
  {
    id: "wrongful-termination",
    title: "Wrongful Termination Basics",
    category: "employment",
    categoryLabel: "Workplace Rights",
    readTime: "7 min read",
    description: "Understanding when termination may violate the law."
  },
  {
    id: "tenant-rights",
    title: "Tenant Rights: A Plain-Language Guide",
    category: "housing",
    categoryLabel: "Housing & Tenant Rights",
    readTime: "12 min read",
    description: "Know your rights as a renter, from security deposits to eviction procedures."
  },
  {
    id: "eviction-process",
    title: "Understanding the Eviction Process",
    category: "housing",
    categoryLabel: "Housing & Tenant Rights",
    readTime: "9 min read",
    description: "What to expect and how to respond to an eviction notice."
  },
  {
    id: "student-discipline",
    title: "Student Discipline Rights",
    category: "education",
    categoryLabel: "Education & Student Rights",
    readTime: "8 min read",
    description: "Due process rights for students facing suspension or expulsion."
  },
  {
    id: "iep-504",
    title: "IEP and 504 Plan Basics",
    category: "education",
    categoryLabel: "Education & Student Rights",
    readTime: "11 min read",
    description: "Understanding special education rights and accommodations."
  },
  {
    id: "hipaa-basics",
    title: "HIPAA and Medical Privacy",
    category: "healthcare",
    categoryLabel: "Healthcare Rights",
    readTime: "7 min read",
    description: "Your rights regarding medical records and privacy."
  },
  {
    id: "court-process",
    title: "Navigating Court: A Beginner's Guide",
    category: "courts",
    categoryLabel: "Courts & Legal Process",
    readTime: "14 min read",
    description: "Understanding court procedures, filings, and what to expect."
  },
  {
    id: "inmate-rights",
    title: "Rights While Incarcerated",
    category: "incarceration",
    categoryLabel: "Incarceration Rights",
    readTime: "10 min read",
    description: "Understanding your rights regarding conditions, medical care, and communication."
  },
  {
    id: "benefits-appeals",
    title: "Appealing a Benefits Denial",
    category: "government",
    categoryLabel: "Government Agencies",
    readTime: "9 min read",
    description: "How to challenge a denial of government benefits."
  },
];

export default function RightsInsight() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<SystemFilter>("all");
  const [bookmarkedGuides, setBookmarkedGuides] = useState<Set<string>>(new Set());

  // Read filter from URL on mount
  useEffect(() => {
    const filterParam = searchParams.get("filter");
    if (filterParam && categories.some(c => c.id === filterParam)) {
      setActiveFilter(filterParam as SystemFilter);
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

  const filteredGuides = allGuides.filter(guide => {
    const matchesFilter = activeFilter === "all" || guide.category === activeFilter;
    const matchesSearch = guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         guide.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredCategories = activeFilter === "all" 
    ? categories 
    : categories.filter(c => c.id === activeFilter);

  return (
    <Layout>
      <div className="container py-12 lg:py-20">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 mb-6">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Rights Insight
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            Learn about your rights and how different systems work — at your own pace, in plain language.
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides and resources..."
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            />
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
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveFilter(category.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  activeFilter === category.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {category.title.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Guides */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-xl font-semibold text-foreground mb-6">
            {activeFilter === "all" ? "Featured Guides" : `Guides: ${categories.find(c => c.id === activeFilter)?.title || ""}`}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGuides.slice(0, 6).map((guide) => (
              <article
                key={guide.id}
                className="group p-5 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-glow transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-xs text-primary font-medium">{guide.categoryLabel}</p>
                  <button 
                    onClick={() => toggleBookmark(guide.id)}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={bookmarkedGuides.has(guide.id) ? "Remove bookmark" : "Add bookmark"}
                  >
                    {bookmarkedGuides.has(guide.id) ? (
                      <BookmarkCheck className="w-4 h-4 text-primary" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors cursor-pointer">
                  {guide.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {guide.description}
                </p>
                <p className="text-xs text-text-softer">{guide.readTime}</p>
              </article>
            ))}
          </div>

          {filteredGuides.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No guides found matching your search.
              </p>
            </div>
          )}
        </div>

        {/* Categories */}
        {activeFilter === "all" && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold text-foreground mb-6">Browse by Topic</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveFilter(category.id)}
                  className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-glow transition-all duration-300 text-left"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                      <category.icon className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {category.title}
                        </h3>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {category.description}
                      </p>
                      <p className="text-xs text-text-softer">
                        {category.articles} articles
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="max-w-2xl mx-auto mt-16 text-center">
          <p className="text-muted-foreground mb-6">
            Have a specific question? The Analyzer can help point you to relevant resources.
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
