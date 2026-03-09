import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ArrowRight, Search, CheckCircle2, ChevronRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { libraryCategories, type LibraryCategoryCard } from "@/data/legalEducationLibrary";
import { categoryImages } from "@/assets/index";
import { cn } from "@/lib/utils";

const colorMap = {
  maroon: {
    bg: "bg-primary/8",
    border: "border-primary/20",
    iconBg: "bg-primary/15",
    iconColor: "text-primary",
    factIcon: "text-primary/70",
    hoverBorder: "hover:border-primary/40",
  },
  gold: {
    bg: "bg-gold/8",
    border: "border-gold/20",
    iconBg: "bg-gold/15",
    iconColor: "text-gold",
    factIcon: "text-gold/70",
    hoverBorder: "hover:border-gold/40",
  },
  espresso: {
    bg: "bg-navy/5",
    border: "border-navy/15",
    iconBg: "bg-navy/10",
    iconColor: "text-navy-soft",
    factIcon: "text-navy-soft/70",
    hoverBorder: "hover:border-navy/30",
  },
};

function CategoryCard({ category }: { category: LibraryCategoryCard }) {
  const [showFacts, setShowFacts] = useState(false);
  const colors = colorMap[category.color];
  const Icon = category.icon;
  const categoryImage = categoryImages[category.id];

  return (
    <div
      className={cn(
        "group rounded-2xl border transition-all duration-300 overflow-hidden",
        colors.bg,
        colors.border,
        colors.hoverBorder,
        "hover:shadow-lg hover:-translate-y-1"
      )}
    >
      {/* Category Image */}
      {categoryImage && (
        <div className="relative h-36 overflow-hidden">
          <img
            src={categoryImage}
            alt=""
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
        </div>
      )}

      {/* Card Header */}
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", colors.iconBg)}>
            <Icon className={cn("w-6 h-6", colors.iconColor)} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-lg mb-1">{category.title}</h3>
            <p className="text-sm text-muted-foreground">{category.subtitle}</p>
          </div>
        </div>

        {/* Quick Facts Toggle */}
        <button
          onClick={() => setShowFacts(!showFacts)}
          className="mt-4 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          {showFacts ? "Hide quick facts" : "Quick facts"}
          <ChevronRight className={cn("w-3 h-3 transition-transform", showFacts && "rotate-90")} />
        </button>

        {/* Quick Facts */}
        {showFacts && (
          <ul className="mt-3 space-y-1.5 animate-fade-in">
            {category.quickFacts.map((fact, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className={cn("w-3.5 h-3.5 shrink-0 mt-0.5", colors.factIcon)} />
                <span>{fact}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Card Footer */}
      <div className="px-6 pb-5">
        <Button variant="soft" size="sm" className="w-full justify-between" asChild>
          <Link to={`/guide/${category.guideId}`}>
            Open Full Guide
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
    );
}

export default function EducationLibrary() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = libraryCategories.filter((cat) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      cat.title.toLowerCase().includes(q) ||
      cat.subtitle.toLowerCase().includes(q) ||
      cat.quickFacts.some((f) => f.toLowerCase().includes(q))
    );
  });

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
            Structured guides for 10 core areas of civil rights. Each guide walks you through what the system is, how it works, and what you can do — at your own pace.
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

        {/* Search */}
        <div className="max-w-md mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics or rights..."
              className="w-full h-11 pl-11 pr-4 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            />
          </div>
        </div>

        {/* Category Cards Grid */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No topics match your search.</p>
          </div>
        )}

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
