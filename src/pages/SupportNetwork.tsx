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
  ArrowRight,
  Info
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/shared/Disclaimer";

type SystemFilter = "all" | "police" | "employment" | "housing" | "education" | "healthcare" | "courts" | "incarceration" | "government" | "general";

interface Resource {
  name: string;
  type: "official" | "informational";
  category: SystemFilter[];
  description: string;
  website?: string;
  phone?: string;
}

const filterOptions: { id: SystemFilter; label: string; icon: React.ElementType }[] = [
  { id: "all", label: "All", icon: Shield },
  { id: "police", label: "Police", icon: Shield },
  { id: "employment", label: "Employment", icon: Briefcase },
  { id: "housing", label: "Housing", icon: Home },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "healthcare", label: "Healthcare", icon: Stethoscope },
  { id: "courts", label: "Courts", icon: Scale },
  { id: "incarceration", label: "Incarceration", icon: Building2 },
  { id: "government", label: "Government", icon: Building2 },
];

const resources: Resource[] = [
  // Police & Law Enforcement
  {
    name: "Department of Justice - Civil Rights Division",
    type: "official",
    category: ["police", "general"],
    description: "Federal oversight of civil rights violations, pattern-or-practice investigations of police departments.",
    website: "https://www.justice.gov/crt",
    phone: "202-514-4609",
  },
  {
    name: "Police Civilian Oversight Boards",
    type: "official",
    category: ["police"],
    description: "Local civilian review boards that investigate complaints against police officers.",
    website: "#",
    phone: "Contact your local agency",
  },
  {
    name: "ACLU - Police Practices",
    type: "informational",
    category: ["police", "general"],
    description: "Resources on police accountability, know your rights guides, and legal advocacy.",
    website: "https://www.aclu.org/issues/criminal-law-reform/reforming-police",
  },
  
  // Employment
  {
    name: "Equal Employment Opportunity Commission (EEOC)",
    type: "official",
    category: ["employment"],
    description: "Federal agency that enforces laws against workplace discrimination.",
    website: "https://www.eeoc.gov",
    phone: "1-800-669-4000",
  },
  {
    name: "Department of Labor - Wage & Hour Division",
    type: "official",
    category: ["employment"],
    description: "Enforces federal labor laws including minimum wage, overtime, and family leave.",
    website: "https://www.dol.gov/agencies/whd",
    phone: "1-866-487-9243",
  },
  {
    name: "National Labor Relations Board",
    type: "official",
    category: ["employment"],
    description: "Protects employees' rights to organize and to decide whether to have unions.",
    website: "https://www.nlrb.gov",
  },
  
  // Housing
  {
    name: "HUD - Fair Housing Office",
    type: "official",
    category: ["housing"],
    description: "Investigates housing discrimination complaints under the Fair Housing Act.",
    website: "https://www.hud.gov/program_offices/fair_housing_equal_opp",
    phone: "1-800-669-9777",
  },
  {
    name: "Local Tenant Rights Organizations",
    type: "informational",
    category: ["housing"],
    description: "Community organizations that help tenants understand their rights and options.",
  },
  
  // Education
  {
    name: "Office for Civil Rights (OCR) - Department of Education",
    type: "official",
    category: ["education"],
    description: "Investigates discrimination complaints in schools receiving federal funding.",
    website: "https://www2.ed.gov/about/offices/list/ocr/index.html",
    phone: "1-800-421-3481",
  },
  {
    name: "Parent Training & Information Centers",
    type: "informational",
    category: ["education"],
    description: "Help parents of children with disabilities understand their rights under IDEA.",
    website: "https://www.parentcenterhub.org",
  },
  
  // Healthcare
  {
    name: "HHS Office for Civil Rights",
    type: "official",
    category: ["healthcare"],
    description: "Enforces civil rights laws in healthcare, including HIPAA and Section 1557.",
    website: "https://www.hhs.gov/ocr",
    phone: "1-800-368-1019",
  },
  {
    name: "State Medical Boards",
    type: "official",
    category: ["healthcare"],
    description: "License and discipline physicians; handle complaints about medical practice.",
  },
  
  // Courts
  {
    name: "State Bar Associations",
    type: "informational",
    category: ["courts"],
    description: "Can address attorney misconduct and provide lawyer referral services.",
  },
  {
    name: "Court Self-Help Centers",
    type: "informational",
    category: ["courts"],
    description: "Many courts offer free assistance navigating court procedures.",
  },
  
  // Incarceration
  {
    name: "Prison Policy Initiative",
    type: "informational",
    category: ["incarceration"],
    description: "Research and advocacy organization focused on mass incarceration issues.",
    website: "https://www.prisonpolicy.org",
  },
  {
    name: "State Departments of Corrections - Ombudsman",
    type: "official",
    category: ["incarceration"],
    description: "Many states have ombudsman offices that investigate complaints about incarceration conditions.",
  },
  
  // Government
  {
    name: "State/Federal Ombudsman Offices",
    type: "official",
    category: ["government", "general"],
    description: "Independent offices that investigate complaints about government agencies.",
  },
  {
    name: "Administrative Law Judge Offices",
    type: "official",
    category: ["government"],
    description: "Handle appeals of agency decisions on benefits, licenses, and other matters.",
  },
];

export default function SupportNetwork() {
  const [searchParams] = useSearchParams();
  const [activeFilter, setActiveFilter] = useState<SystemFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Read filter from URL on mount
  useEffect(() => {
    const filterParam = searchParams.get("filter");
    if (filterParam && filterOptions.some(f => f.id === filterParam)) {
      setActiveFilter(filterParam as SystemFilter);
    }
  }, [searchParams]);

  const filteredResources = resources.filter(resource => {
    const matchesFilter = activeFilter === "all" || 
      resource.category.includes(activeFilter) || 
      resource.category.includes("general");
    const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const officialResources = filteredResources.filter(r => r.type === "official");
  const informationalResources = filteredResources.filter(r => r.type === "informational");

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
            Oversight agencies, complaint bodies, and support organizations that may be relevant to your situation.
          </p>
        </div>

        {/* Disclaimer at top */}
        <div className="max-w-4xl mx-auto mb-8">
          <Disclaimer variant="prominent" />
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
            {filterOptions.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  activeFilter === filter.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Official Resources */}
          {officialResources.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Official Oversight & Complaint Bodies</h2>
              </div>
              <div className="space-y-3">
                {officialResources.map((resource) => (
                  <ResourceCard key={resource.name} resource={resource} />
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
              <div className="space-y-3">
                {informationalResources.map((resource) => (
                  <ResourceCard key={resource.name} resource={resource} />
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

        {/* CTA */}
        <div className="max-w-2xl mx-auto mt-16 text-center">
          <p className="text-muted-foreground mb-6">
            Not sure which agencies apply to your situation?
          </p>
          <Button variant="hero" size="lg" asChild>
            <Link to="/analyzer">
              Start the Analyzer
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>

        {/* Bottom Disclaimer */}
        <div className="max-w-4xl mx-auto mt-12 pt-8 border-t border-border">
          <Disclaimer className="justify-center" />
        </div>
      </div>
    </Layout>
  );
}

function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <div className="p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-200">
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
          resource.type === "official" ? "bg-primary/20" : "bg-secondary"
        }`}>
          {resource.type === "official" ? (
            <Building2 className="w-5 h-5 text-primary" />
          ) : (
            <Globe className="w-5 h-5 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-medium text-foreground">{resource.name}</h3>
            <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${
              resource.type === "official" 
                ? "bg-primary/20 text-primary" 
                : "bg-secondary text-muted-foreground"
            }`}>
              {resource.type === "official" ? "Official" : "Informational"}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            {resource.description}
          </p>
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
            {resource.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {resource.phone}
              </span>
            )}
            {resource.website && resource.website !== "#" && (
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
        </div>
      </div>
    </div>
  );
}
