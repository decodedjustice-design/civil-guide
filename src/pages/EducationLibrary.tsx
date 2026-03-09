import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ArrowRight, Search, ChevronRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { libraryCategories, type LibraryCategoryCard } from "@/data/legalEducationLibrary";
import { categoryImages } from "@/assets/index";
import { cn } from "@/lib/utils";

function CategoryCard({ category }: { category: LibraryCategoryCard }) {
  const Icon = category.icon;
  const categoryImage = categoryImages[category.id];

  return (
    <Link
      to={`/guide/${category.guideId}`}
      className="group relative flex flex-col rounded-2xl border border-border bg-card overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-2 hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
    >
      {/* Large Hero Image */}
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
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent opacity-80 group-hover:opacity-70 transition-opacity duration-500" />

        {/* Floating icon badge */}
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

        {/* Quick facts preview — first 2 */}
        <div className="mt-auto space-y-1.5 mb-4">
          {category.quickFacts.slice(0, 2).map((fact, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground/80">
              <span className="w-1 h-1 rounded-full bg-primary/50 shrink-0 mt-1.5" />
              <span className="line-clamp-1">{fact}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-2 text-sm font-medium text-primary/80 group-hover:text-primary transition-colors duration-300">
          <span>Open Guide</span>
          <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
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
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
