import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { 
  Building2, 
  Users, 
  Globe, 
  ExternalLink, 
  Phone,
  Search,
  Shield,
  Scale,
  Briefcase,
  Home,
  GraduationCap,
  Stethoscope,
  Heart,
  FileText,
  ArrowRight,
  Info,
  MapPin
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { 
  supportResources, 
  systemFilterOptions,
  type SupportResource,
  type SystemTag 
} from "@/data/supportNetworkResources";

type FilterId = "all" | SystemTag;

const filterIcons: Record<string, React.ElementType> = {
  all: Shield,
  police: Shield,
  employment: Briefcase,
  housing: Home,
  disability: Heart,
  courts: Scale,
  incarceration: Building2,
  education: GraduationCap,
  healthcare: Stethoscope,
  government: Building2,
  "public-records": FileText,
};

export default function SupportNetwork() {
  const [searchParams] = useSearchParams();
  const [activeFilter, setActiveFilter] = useState<FilterId>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Read filter from URL on mount
  useEffect(() => {
    const filterParam = searchParams.get("filter");
    // Handle "general" filter from Analyzer as "all"
    if (filterParam === "general") {
      setActiveFilter("all");
    } else if (filterParam && systemFilterOptions.some(f => f.id === filterParam)) {
      setActiveFilter(filterParam as FilterId);
    }
  }, [searchParams]);

  const filteredResources = supportResources.filter(resource => {
    const matchesFilter = activeFilter === "all" || 
      resource.systemTags.includes(activeFilter as SystemTag);
    const matchesSearch = 
      resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.whatTheyDo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.whenToContact.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const officialResources = filteredResources.filter(r => r.officialStatus === "official");
  const informationalResources = filteredResources.filter(r => r.officialStatus === "informational");

  const activeFilterLabel = systemFilterOptions.find(f => f.id === activeFilter)?.label || "All Resources";

  return (
    <Layout>
      <div className="container py-12 lg:py-20">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 mb-6">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Support Network
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Oversight agencies, enforcement bodies, and complaint offices that may help with your situation. 
            Washington State and federal resources.
          </p>
        </div>

        {/* Wellbeing Note */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="p-4 rounded-xl bg-secondary/50 border border-border">
            <p className="text-sm text-muted-foreground text-center">
              You don't need to have everything figured out before reaching out. 
              Many of these offices can help you understand if your concern falls under their authority.
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-8">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search agencies and organizations..."
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {systemFilterOptions.map((filter) => {
              const Icon = filterIcons[filter.id] || Shield;
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id as FilterId)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    activeFilter === filter.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  {filter.label.split(" / ")[0]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Active filter indicator */}
        {activeFilter !== "all" && (
          <div className="max-w-4xl mx-auto mb-6">
            <p className="text-sm text-muted-foreground">
              Showing resources for: <span className="text-foreground font-medium">{activeFilterLabel}</span>
            </p>
          </div>
        )}

        {/* Resources */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Official Resources */}
          {officialResources.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Official Oversight & Complaint Bodies</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Government agencies with authority to investigate complaints, enforce laws, or require corrective action.
              </p>
              <div className="space-y-4">
                {officialResources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            </div>
          )}

          {/* Informational Resources */}
          {informationalResources.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Info className="w-5 h-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold text-foreground">Informational & Advocacy Resources</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Organizations that provide information, guidance, or advocacy but may not have direct enforcement authority.
              </p>
              <div className="space-y-4">
                {informationalResources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            </div>
          )}

          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No resources found matching your search.
              </p>
            </div>
          )}
        </div>

        {/* Related Connections */}
        <div className="max-w-4xl mx-auto mt-12 p-6 rounded-xl bg-card border border-border">
          <h3 className="text-sm font-semibold text-foreground mb-4">Related Platform Areas</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <Link to="/library" className="flex items-center gap-2 text-primary hover:underline">
              <Info className="w-4 h-4" />
              Rights Insight
            </Link>
            <Link to="/rights-insight" className="flex items-center gap-2 text-primary hover:underline">
              <FileText className="w-4 h-4" />
              Library Guides
            </Link>
            <Link to="/tools" className="flex items-center gap-2 text-primary hover:underline">
              <Building2 className="w-4 h-4" />
              All Tools
            </Link>
            <Link to="/public-request-rights" className="flex items-center gap-2 text-primary hover:underline">
              <FileText className="w-4 h-4" />
              Public Request Rights
            </Link>
          </div>
        </div>

        {/* CTA */}
        <div className="max-w-2xl mx-auto mt-12 text-center">
          <p className="text-muted-foreground mb-6">
            Not sure which agencies apply to your situation?
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="hero" size="lg" asChild>
              <Link to="/analyzer">
                Start the Analyzer
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="soft" size="lg" asChild>
              <Link to="/rights-insight">
                Learn About Systems
              </Link>
            </Button>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="max-w-4xl mx-auto mt-12 pt-8 border-t border-border">
          <Disclaimer className="justify-center" />
        </div>
      </div>
    </Layout>
  );
}

function ResourceCard({ resource }: { resource: SupportResource }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-200">
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
          resource.officialStatus === "official" ? "bg-primary/20" : "bg-secondary"
        }`}>
          {resource.officialStatus === "official" ? (
            <Building2 className="w-5 h-5 text-primary" />
          ) : (
            <Globe className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-medium text-foreground">{resource.name}</h3>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                resource.jurisdiction === "washington" 
                  ? "bg-accent/20 text-accent-foreground" 
                  : "bg-secondary text-muted-foreground"
              }`}>
                {resource.jurisdiction === "washington" ? "WA" : "Federal"}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                resource.officialStatus === "official" 
                  ? "bg-primary/20 text-primary" 
                  : "bg-secondary text-muted-foreground"
              }`}>
                {resource.officialStatus === "official" ? "Official" : "Informational"}
              </span>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3">
            {resource.whatTheyDo}
          </p>

          {/* Contact info */}
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
            {resource.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {resource.phone}
              </span>
            )}
            {resource.website && (
              <a
                href={resource.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary hover:underline"
              >
                <Globe className="w-3 h-3" />
                Visit Website
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
          </div>

          {/* Expand/Collapse */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-primary hover:underline"
          >
            {expanded ? "Show less" : "Show more details"}
          </button>

          {/* Expanded content */}
          {expanded && (
            <div className="mt-4 pt-4 border-t border-border space-y-3">
              <div>
                <h4 className="text-xs font-medium text-foreground mb-1">When to Contact</h4>
                <p className="text-sm text-muted-foreground">{resource.whenToContact}</p>
              </div>
              <div>
                <h4 className="text-xs font-medium text-foreground mb-1">What They Can Do</h4>
                <p className="text-sm text-muted-foreground">{resource.whatTheyCan}</p>
              </div>
              <div>
                <h4 className="text-xs font-medium text-foreground mb-1">What They Cannot Do</h4>
                <p className="text-sm text-muted-foreground">{resource.whatTheyCannot}</p>
              </div>
              {resource.notes && (
                <div className="p-3 rounded-lg bg-secondary/50">
                  <p className="text-xs text-muted-foreground italic">{resource.notes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
