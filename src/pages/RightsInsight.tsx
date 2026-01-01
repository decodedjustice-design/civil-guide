import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Scale, 
  Shield, 
  Building2, 
  Briefcase, 
  Home, 
  GraduationCap,
  ArrowRight,
  Search
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { useState } from "react";

const categories = [
  {
    icon: Building2,
    title: "Police & Law Enforcement",
    description: "Understanding your rights during police encounters, arrests, and investigations.",
    articles: 12,
    href: "#police"
  },
  {
    icon: Briefcase,
    title: "Workplace Rights",
    description: "Discrimination, harassment, wages, and employment protections.",
    articles: 15,
    href: "#workplace"
  },
  {
    icon: Home,
    title: "Housing & Tenant Rights",
    description: "Eviction procedures, fair housing, habitability, and lease rights.",
    articles: 10,
    href: "#housing"
  },
  {
    icon: GraduationCap,
    title: "Education & Student Rights",
    description: "Title IX, disciplinary procedures, IEP/504, and student protections.",
    articles: 8,
    href: "#education"
  },
  {
    icon: Scale,
    title: "Courts & Legal Process",
    description: "Understanding court procedures, due process, and navigating the system.",
    articles: 14,
    href: "#courts"
  },
  {
    icon: Shield,
    title: "Civil Rights Fundamentals",
    description: "Constitutional protections and foundational civil rights concepts.",
    articles: 11,
    href: "#fundamentals"
  },
];

const featuredGuides = [
  {
    title: "What to Do After a Police Encounter",
    category: "Police & Law Enforcement",
    readTime: "8 min read",
    description: "Step-by-step guidance on documenting an incident and understanding your options."
  },
  {
    title: "Understanding Employment Discrimination",
    category: "Workplace Rights",
    readTime: "10 min read",
    description: "Learn about protected classes, filing complaints, and workplace retaliation."
  },
  {
    title: "Tenant Rights: A Plain-Language Guide",
    category: "Housing & Tenant Rights",
    readTime: "12 min read",
    description: "Know your rights as a renter, from security deposits to eviction procedures."
  },
];

export default function RightsInsight() {
  const [searchQuery, setSearchQuery] = useState("");

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

        {/* Featured Guides */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-xl font-semibold text-foreground mb-6">Featured Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredGuides.map((guide) => (
              <article
                key={guide.title}
                className="group p-5 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-glow transition-all duration-300 cursor-pointer"
              >
                <p className="text-xs text-primary font-medium mb-2">{guide.category}</p>
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {guide.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {guide.description}
                </p>
                <p className="text-xs text-text-softer">{guide.readTime}</p>
              </article>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold text-foreground mb-6">Browse by Topic</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((category) => (
              <Link
                key={category.title}
                to={category.href}
                className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-glow transition-all duration-300"
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
              </Link>
            ))}
          </div>
        </div>

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
