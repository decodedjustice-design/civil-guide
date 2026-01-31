import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Scale, 
  Users, 
  Search,
  ArrowRight,
  Briefcase,
  Heart,
  HandHeart
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AttorneyDirectory } from "@/components/legal/AttorneyDirectory";
import { LegalResourceCard } from "@/components/legal/LegalResourceCard";
import { legalResources, RESOURCE_CATEGORIES } from "@/data/legalResources";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

// ============================================================================
// MAIN PAGE
// ============================================================================

export default function FindLegalHelp() {
  const [resourceFilter, setResourceFilter] = useState("all");
  const [resourceSearch, setResourceSearch] = useState("");

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

  // Group resources by category for accordion
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
          
          {/* ================================================================
              SECTION 1: Header
          ================================================================ */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
              <Scale className="w-4 h-4" />
              <span>Clarity · Justice · Empathy</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Find Legal Help
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Search attorneys, legal aid organizations, and advocacy groups in Washington State. 
              Take your time — finding the right support is an important step.
            </p>
          </div>

          {/* ================================================================
              SECTION 2: Prominent Disclaimer
          ================================================================ */}
          <div className="max-w-3xl mx-auto mb-12">
            <Disclaimer variant="prominent" />
          </div>

          {/* ================================================================
              SECTION 3: Attorney Search Directory
          ================================================================ */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Attorney Directory</h2>
                <p className="text-sm text-muted-foreground">Washington State civil rights attorneys</p>
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-border">
              <AttorneyDirectory />
            </div>
          </section>

          {/* ================================================================
              SECTION 4: Other Legal Resources
          ================================================================ */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                <Heart className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Legal Aid & Advocacy Organizations</h2>
                <p className="text-sm text-muted-foreground">Free resources, civil rights orgs, and support services</p>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="max-w-4xl mb-6 space-y-4">
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

              {/* Category Filters */}
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

            {/* Resources Accordion / List */}
            <div className="max-w-4xl">
              {resourceFilter === "all" ? (
                <Accordion type="multiple" className="space-y-4">
                  {Object.entries(groupedResources).map(([category, categoryResources]) => {
                    const Icon = getCategoryIcon(category);
                    const categoryLabel = RESOURCE_CATEGORIES.find(c => c.id === category)?.label || category;
                    return (
                      <AccordionItem 
                        key={category} 
                        value={category}
                        className="rounded-2xl bg-card border border-border overflow-hidden"
                      >
                        <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-secondary/30 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                              <Icon className="w-5 h-5 text-accent" />
                            </div>
                            <div className="text-left">
                              <h3 className="font-semibold text-foreground">{categoryLabel}</h3>
                              <p className="text-sm text-muted-foreground">
                                {getCategoryDescription(category)} · {categoryResources.length} resources
                              </p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-4">
                          <div className="space-y-4 pt-2">
                            {categoryResources.map((resource) => (
                              <LegalResourceCard key={resource.id} resource={resource} />
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              ) : (
                <div className="space-y-4">
                  {filteredResources.map((resource) => (
                    <LegalResourceCard key={resource.id} resource={resource} expanded />
                  ))}
                </div>
              )}

              {filteredResources.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No resources found matching your search.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setResourceFilter("all");
                      setResourceSearch("");
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </section>

          {/* ================================================================
              SECTION 5: Guidance / Tips
          ================================================================ */}
          <section className="mb-16">
            <div className="max-w-3xl mx-auto p-8 rounded-2xl bg-card border border-border">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-accent rounded-full" />
                Tips for Finding the Right Help
              </h2>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/20 text-accent text-xs font-medium shrink-0">1</span>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Start with legal aid organizations</strong> — they can often provide free consultations and help you understand your options.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/20 text-accent text-xs font-medium shrink-0">2</span>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Prepare before you call</strong> — have dates, names, and a brief summary of what happened ready.
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/20 text-accent text-xs font-medium shrink-0">3</span>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Ask about fees upfront</strong> — many civil rights attorneys work on contingency (no fee unless you win).
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/20 text-accent text-xs font-medium shrink-0">4</span>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Know your deadlines</strong> — civil rights claims often have strict filing deadlines (sometimes as short as 180 days).
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/20 text-accent text-xs font-medium shrink-0">5</span>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Don't send evidence immediately</strong> — wait until an attorney confirms no conflict of interest before sharing sensitive documents.
                  </p>
                </li>
              </ul>
            </div>
          </section>

          {/* ================================================================
              SECTION 6: CTA + Footer Disclaimer
          ================================================================ */}
          <section className="text-center">
            <div className="max-w-2xl mx-auto mb-12">
              <p className="text-muted-foreground mb-6">
                Not sure what kind of help you need? The Analyzer can help you understand your situation.
              </p>
              <Button variant="hero" size="lg" asChild>
                <Link to="/analyzer">
                  Start the Analyzer
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>

            <div className="pt-8 border-t border-border">
              <Disclaimer className="justify-center" />
            </div>
          </section>

        </div>
      </div>
    </Layout>
  );
}
