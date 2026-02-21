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
  ChevronRight,
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

/* ── Icon map ── */
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
  "public-records": FileText,
};

/* ── System descriptions ── */
const systemDescriptions: Record<string, string> = {
  police: "Law enforcement oversight, complaint offices, and civilian review",
  employment: "Workplace discrimination, wage issues, and labor rights",
  housing: "Fair housing enforcement and discrimination complaints",
  disability: "Disability rights advocacy and accommodation enforcement",
  courts: "Court procedural information and systemic oversight",
  incarceration: "Prison and jail oversight, corrections complaints",
  education: "School civil rights, discipline, and accommodation issues",
  healthcare: "Healthcare provider complaints and medical rights",
  government: "Government agency navigation and constituent services",
  "public-records": "Public records access and open government guidance",
};

export default function SupportNetwork() {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedSystem, setExpandedSystem] = useState<string | null>(null);
  const [expandedResource, setExpandedResource] = useState<string | null>(null);

  // Auto-expand from URL param
  useEffect(() => {
    const filterParam = searchParams.get("filter");
    if (filterParam && filterParam !== "all" && filterParam !== "general") {
      setExpandedSystem(filterParam);
    }
  }, [searchParams]);

  // Group resources by system tag (a resource can appear in multiple systems)
  const systemGroups = useMemo(() => {
    const systems = systemFilterOptions.filter(f => f.id !== "all");
    const q = searchQuery.toLowerCase();

    return systems.map(sys => {
      const resources = supportResources.filter(r => {
        const inSystem = r.systemTags.includes(sys.id as SystemTag);
        if (!inSystem) return false;
        if (!q) return true;
        return (
          r.name.toLowerCase().includes(q) ||
          r.whatTheyDo.toLowerCase().includes(q) ||
          r.whenToContact.toLowerCase().includes(q)
        );
      });
      return { ...sys, resources };
    }).filter(g => g.resources.length > 0);
  }, [searchQuery]);

  // Auto-expand all when searching
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

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search topics, agencies, or organizations..."
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
            />
          </div>

          {/* Wellbeing note */}
          <div className="p-3 rounded-xl bg-secondary/50 border border-border mb-8">
            <p className="text-xs text-muted-foreground text-center">
              You don't need to have everything figured out before reaching out. Many of these offices can help you understand if your concern falls under their authority.
            </p>
          </div>

          {/* System Category Cards */}
          <div className="space-y-3 mb-16">
            {systemGroups.map((group) => {
              const isExpanded = isSearching || expandedSystem === group.id;
              const Icon = systemIcons[group.id] || Shield;
              const description = systemDescriptions[group.id] || "";

              return (
                <div
                  key={group.id}
                  className="rounded-2xl bg-card border border-border overflow-hidden transition-all duration-300"
                >
                  {/* Category header */}
                  <button
                    onClick={() => {
                      if (!isSearching) {
                        setExpandedSystem(expandedSystem === group.id ? null : group.id);
                        setExpandedResource(null);
                      }
                    }}
                    className="w-full flex items-center justify-between px-5 py-5 text-left hover:bg-secondary/30 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-accent/15 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <h2 className="font-semibold text-foreground">{group.label}</h2>
                        <p className="text-sm text-muted-foreground">
                          {description} · {group.resources.length} {group.resources.length === 1 ? "resource" : "resources"}
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      className={cn(
                        "w-5 h-5 text-muted-foreground transition-transform duration-300 shrink-0",
                        isExpanded && "rotate-90"
                      )}
                    />
                  </button>

                  {/* Expanded resource list */}
                  {isExpanded && (
                    <div className="px-5 pb-5 space-y-2 border-t border-border/50 pt-4">
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
                  )}
                </div>
              );
            })}

            {systemGroups.length === 0 && (
              <div className="text-center py-12 rounded-2xl bg-card border border-border">
                <p className="text-muted-foreground mb-1">No agencies found matching your search.</p>
                <p className="text-sm text-muted-foreground/70 mb-4">Try a broader term like "police" or "housing."</p>
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
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
        "rounded-xl border overflow-hidden transition-all duration-200",
        isExpanded
          ? "border-accent/30 shadow-md bg-secondary/40"
          : "border-border/50 bg-secondary/20 hover:border-accent/20 hover:shadow-sm hover:-translate-y-0.5 cursor-pointer"
      )}
    >
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-start gap-3 text-left cursor-pointer"
      >
        <div className={cn(
          "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
          resource.officialStatus === "official" ? "bg-accent/15" : "bg-card"
        )}>
          {resource.officialStatus === "official" ? (
            <Building2 className="w-4 h-4 text-accent" />
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
            "text-[10px] px-2 py-0.5 rounded-full font-medium",
            resource.jurisdiction === "washington"
              ? "bg-accent/20 text-accent-foreground"
              : "bg-secondary text-muted-foreground"
          )}>
            {resource.jurisdiction === "washington" ? "WA" : "Federal"}
          </span>
          <ChevronRight className={cn(
            "w-4 h-4 text-muted-foreground transition-transform duration-200",
            isExpanded && "rotate-90"
          )} />
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-border/30 space-y-3 pt-3">
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
