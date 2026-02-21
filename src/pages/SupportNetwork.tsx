import { useState, useEffect, useMemo } from "react";
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
  ChevronDown,
  BookOpen,
  HelpCircle,
  Wrench
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
import { cn } from "@/lib/utils";

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
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [expandedResource, setExpandedResource] = useState<string | null>(null);

  useEffect(() => {
    const filterParam = searchParams.get("filter");
    if (filterParam === "general") {
      setActiveFilter("all");
    } else if (filterParam && systemFilterOptions.some(f => f.id === filterParam)) {
      setActiveFilter(filterParam as FilterId);
    }
  }, [searchParams]);

  // Auto-expand groups when searching
  useEffect(() => {
    if (searchQuery) {
      setExpandedGroup(null); // let both show inline
    }
  }, [searchQuery]);

  const filteredResources = useMemo(() => {
    return supportResources.filter(resource => {
      const matchesFilter = activeFilter === "all" || 
        resource.systemTags.includes(activeFilter as SystemTag);
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q ||
        resource.name.toLowerCase().includes(q) ||
        resource.whatTheyDo.toLowerCase().includes(q) ||
        resource.whenToContact.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  const officialResources = filteredResources.filter(r => r.officialStatus === "official");
  const informationalResources = filteredResources.filter(r => r.officialStatus === "informational");

  const groups = [
    {
      id: "official",
      icon: Building2,
      title: "Official Oversight & Complaint Bodies",
      subtitle: "Government agencies with authority to investigate, enforce, or require corrective action.",
      resources: officialResources,
    },
    {
      id: "informational",
      icon: Info,
      title: "Informational & Advocacy Resources",
      subtitle: "Organizations that provide information, guidance, or advocacy.",
      resources: informationalResources,
    },
  ].filter(g => g.resources.length > 0);

  const isSearching = !!searchQuery;

  return (
    <Layout>
      <div className="container py-12 lg:py-20">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
              <Users className="w-4 h-4" />
              <span>Support Network</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Support Network
            </h1>
            <p className="text-muted-foreground">
              Oversight agencies and complaint offices. Washington State and federal.
            </p>
          </div>

          {/* Search — prominent at top */}
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
          <div className="flex flex-wrap gap-2 mb-4">
            {systemFilterOptions.map((filter) => {
              const Icon = filterIcons[filter.id] || Shield;
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id as FilterId)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5",
                    activeFilter === filter.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  <Icon className="w-3 h-3" />
                  {filter.label.split(" / ")[0]}
                </button>
              );
            })}
          </div>

          {/* Wellbeing note */}
          <div className="p-3 rounded-xl bg-secondary/50 border border-border mb-8">
            <p className="text-xs text-muted-foreground text-center">
              You don't need to have everything figured out before reaching out. Many of these offices can help you understand if your concern falls under their authority.
            </p>
          </div>

          {/* Resource Group Cards — progressive reveal */}
          <div className="space-y-3 mb-16">
            {groups.map((group) => {
              const isExpanded = isSearching || expandedGroup === group.id;
              const Icon = group.icon;

              return (
                <div
                  key={group.id}
                  className="rounded-2xl bg-card border-2 border-border transition-all duration-300 hover:border-primary/30"
                >
                  {/* Group header */}
                  <button
                    onClick={() => {
                      if (!isSearching) {
                        setExpandedGroup(expandedGroup === group.id ? null : group.id);
                        setExpandedResource(null);
                      }
                    }}
                    className="w-full flex items-center gap-4 p-5 text-left cursor-pointer"
                  >
                    <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h2 className="font-semibold text-foreground text-sm sm:text-base">{group.title}</h2>
                        <span className="text-xs text-muted-foreground shrink-0">
                          {group.resources.length} {group.resources.length === 1 ? "resource" : "resources"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{group.subtitle}</p>
                    </div>
                    {!isSearching && (
                      <ChevronDown
                        className={cn(
                          "w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300",
                          isExpanded && "rotate-180"
                        )}
                      />
                    )}
                  </button>

                  {/* Expanded resource list */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 border-t border-border/50">
                      <div className="space-y-2 pt-3">
                        {group.resources.map((resource) => (
                          <ResourceCard
                            key={resource.id}
                            resource={resource}
                            isExpanded={expandedResource === resource.id}
                            onToggle={() =>
                              setExpandedResource(expandedResource === resource.id ? null : resource.id)
                            }
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {filteredResources.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No resources found matching your search.</p>
              </div>
            )}
          </div>

          {/* CTA */}
          <div className="p-8 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border text-center mb-16">
            <h2 className="text-xl font-semibold text-foreground mb-3">
              Not sure which agencies apply?
            </h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-lg mx-auto">
              The Civil Rights Analyzer helps you understand your situation and shows which agencies may be relevant.
            </p>
            <Button variant="hero" size="lg" asChild>
              <Link to="/analyzer">
                Start the Analyzer
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>

          {/* Bottom Navigation Pathway */}
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground mb-4 text-center">Continue exploring</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: "Rights Insight", href: "/library", icon: BookOpen },
                { label: "Educational Guides", href: "/rights-insight", icon: FileText },
                { label: "Find Legal Help", href: "/find-help", icon: HelpCircle },
                { label: "Analyzer", href: "/analyzer", icon: Scale },
                { label: "Documentation Tools", href: "/tools", icon: Wrench },
                { label: "Public Records", href: "/public-request-rights", icon: FileText },
              ].map((nav) => (
                <Link
                  key={nav.href}
                  to={nav.href}
                  className="group flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/20 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <nav.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {nav.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-12 pt-8 border-t border-border">
            <Disclaimer className="justify-center" />
          </div>
        </div>
      </div>
    </Layout>
  );
}

/* ── Resource Card (nested progressive reveal) ── */
function ResourceCard({
  resource,
  isExpanded,
  onToggle,
}: {
  resource: SupportResource;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-secondary/30 transition-all duration-200 overflow-hidden",
        isExpanded
          ? "border-primary/30 shadow-md bg-secondary/50"
          : "border-border/50 hover:border-primary/20 hover:shadow-sm hover:-translate-y-0.5 cursor-pointer"
      )}
    >
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-start gap-3 text-left cursor-pointer"
      >
        <div className={cn(
          "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
          resource.officialStatus === "official" ? "bg-primary/15" : "bg-card"
        )}>
          {resource.officialStatus === "official" ? (
            <Building2 className="w-4 h-4 text-primary" />
          ) : (
            <Globe className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground text-sm">{resource.name}</h3>
          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{resource.whatTheyDo}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={cn(
            "text-[10px] px-2 py-0.5 rounded-full",
            resource.jurisdiction === "washington"
              ? "bg-accent/20 text-accent-foreground"
              : "bg-secondary text-muted-foreground"
          )}>
            {resource.jurisdiction === "washington" ? "WA" : "Federal"}
          </span>
          <ChevronDown className={cn(
            "w-4 h-4 text-muted-foreground transition-transform duration-200",
            isExpanded && "rotate-180"
          )} />
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 pt-0 border-t border-border/30 space-y-3 pt-3">
          {/* Contact */}
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
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

          {/* Detail sub-cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <DetailSubCard title="When to Contact" content={resource.whenToContact} />
            <DetailSubCard title="What They Can Do" content={resource.whatTheyCan} />
            <DetailSubCard title="What They Cannot Do" content={resource.whatTheyCannot} />
          </div>

          {resource.notes && (
            <div className="p-3 rounded-lg bg-card/60">
              <p className="text-xs text-muted-foreground italic">{resource.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DetailSubCard({ title, content }: { title: string; content: string }) {
  return (
    <div className="p-3 rounded-lg bg-card/50 border border-border/30">
      <h4 className="text-[11px] font-semibold text-foreground mb-1">{title}</h4>
      <p className="text-xs text-muted-foreground leading-relaxed">{content}</p>
    </div>
  );
}
