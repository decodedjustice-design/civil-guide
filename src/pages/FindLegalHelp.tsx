import { Link } from "react-router-dom";
import { 
  Search, 
  Scale, 
  Users, 
  ExternalLink,
  MapPin,
  Phone,
  Globe,
  ArrowRight,
  Heart,
  Shield,
  Home,
  Briefcase,
  Accessibility,
  Clock,
  ChevronDown
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const resourceTypes = [
  { id: "all", label: "All Resources" },
  { id: "civil-rights", label: "Civil Rights", icon: Shield },
  { id: "housing", label: "Housing", icon: Home },
  { id: "employment", label: "Employment", icon: Briefcase },
  { id: "disability", label: "Disability", icon: Accessibility },
  { id: "family-cps", label: "Family / CPS", icon: Users },
  { id: "trauma-informed", label: "Trauma-Informed", icon: Heart },
  { id: "legal-aid", label: "Legal Aid", icon: Users },
];

const resources = [
  // Civil Rights
  {
    name: "ACLU of Washington",
    type: "civil-rights",
    serviceType: "legal",
    description: "Legal advocacy and representation for civil liberties cases including police misconduct, discrimination, and constitutional rights.",
    location: "Washington State",
    website: "https://www.aclu-wa.org/",
    phone: "(206) 624-2184",
  },
  {
    name: "Northwest Justice Project",
    type: "civil-rights",
    serviceType: "legal",
    description: "Free civil legal aid for low-income people in Washington, covering housing, family, benefits, and civil rights.",
    location: "Washington State",
    website: "https://nwjustice.org/",
    phone: "1-888-201-1014",
  },
  {
    name: "Columbia Legal Services",
    type: "civil-rights",
    serviceType: "legal",
    description: "Impact litigation and advocacy for systemic change in civil rights, housing, and economic justice.",
    location: "Washington State",
    website: "https://columbialegal.org/",
    phone: "(206) 464-5911",
  },
  {
    name: "U.S. Department of Justice - Civil Rights Division",
    type: "civil-rights",
    serviceType: "informational",
    description: "Federal agency that enforces civil rights laws. File complaints about discrimination, police misconduct, or voting rights violations.",
    location: "Federal",
    website: "https://www.justice.gov/crt",
    phone: "(202) 514-4609",
  },
  // Housing
  {
    name: "Fair Housing Center of Washington",
    type: "housing",
    serviceType: "legal",
    description: "Investigates housing discrimination complaints and provides legal assistance for fair housing violations.",
    location: "Washington State",
    website: "https://fhcwashington.org/",
    phone: "(253) 274-9523",
  },
  {
    name: "Tenant Law Center",
    type: "housing",
    serviceType: "legal",
    description: "Legal assistance for tenants facing eviction, habitability issues, or landlord disputes.",
    location: "Washington State",
    website: "https://www.tenantlawcenter.org/",
    phone: "(206) 324-6890",
  },
  {
    name: "HUD Fair Housing (Region X)",
    type: "housing",
    serviceType: "legal",
    description: "Federal agency handling housing discrimination complaints based on race, color, religion, sex, disability, familial status, or national origin.",
    location: "Federal (WA, OR, ID, AK)",
    website: "https://www.hud.gov/program_offices/fair_housing_equal_opp/online-complaint",
    phone: "1-800-877-0246",
  },
  // Employment
  {
    name: "Washington State Human Rights Commission",
    type: "employment",
    serviceType: "legal",
    description: "Investigates employment discrimination complaints and enforces the Washington Law Against Discrimination.",
    location: "Washington State",
    website: "https://www.hum.wa.gov/",
    phone: "1-800-233-3247",
  },
  {
    name: "U.S. Equal Employment Opportunity Commission (Seattle)",
    type: "employment",
    serviceType: "legal",
    description: "Federal agency that investigates workplace discrimination based on protected characteristics.",
    location: "Federal",
    website: "https://www.eeoc.gov/",
    phone: "1-800-669-4000",
  },
  {
    name: "Legal Aid at Work",
    type: "employment",
    serviceType: "legal",
    description: "Free employment law clinics and resources for workers facing wage theft, discrimination, or retaliation.",
    location: "Nationwide",
    website: "https://legalaidatwork.org/",
    phone: "(415) 864-8848",
  },
  // Disability
  {
    name: "Disability Rights Washington",
    type: "disability",
    serviceType: "legal",
    description: "Legal advocacy for people with disabilities, including discrimination, access, education, and institutional issues.",
    location: "Washington State",
    website: "https://www.disabilityrightswa.org/",
    phone: "1-800-562-2702",
  },
  {
    name: "Northwest ADA Center",
    type: "disability",
    serviceType: "informational",
    description: "Information and guidance on ADA rights and responsibilities. Not legal representation but provides education.",
    location: "Pacific Northwest",
    website: "https://nwadacenter.org/",
    phone: "1-800-949-4232",
  },
  // Trauma-Informed
  {
    name: "Washington State Crime Victim Service Center",
    type: "trauma-informed",
    serviceType: "informational",
    description: "Support services for victims of crime, including advocacy, counseling referrals, and system navigation.",
    location: "Washington State",
    website: "https://www.waspc.org/crime-victims",
    phone: "1-800-822-1067",
  },
  {
    name: "Harborview Center for Sexual Assault & Traumatic Stress",
    type: "trauma-informed",
    serviceType: "informational",
    description: "Trauma-informed care, counseling, and support for survivors of violence and abuse.",
    location: "Seattle / King County",
    website: "https://www.uwmedicine.org/locations/harborview-center-sexual-assault-traumatic-stress",
    phone: "(206) 744-1600",
  },
  {
    name: "National Domestic Violence Hotline",
    type: "trauma-informed",
    serviceType: "informational",
    description: "24/7 confidential support, resources, and safety planning for survivors of domestic violence.",
    location: "Nationwide",
    website: "https://www.thehotline.org/",
    phone: "1-800-799-7233",
  },
  {
    name: "RAINN (Rape, Abuse & Incest National Network)",
    type: "trauma-informed",
    serviceType: "informational",
    description: "24/7 hotline and online chat for survivors of sexual violence. Connects to local service providers.",
    location: "Nationwide",
    website: "https://www.rainn.org/",
    phone: "1-800-656-4673",
  },
  // Family / CPS / DCYF
  {
    name: "TeamChild",
    type: "family-cps",
    serviceType: "legal",
    description: "Legal advocacy for youth in foster care, juvenile justice, and education systems. Helps with dependency cases and youth rights.",
    location: "Washington State",
    website: "https://teamchild.org/",
    phone: "(206) 322-2444",
  },
  {
    name: "Office of the Family and Children's Ombuds (OFCO)",
    type: "family-cps",
    serviceType: "informational",
    description: "Independent state agency that investigates complaints about DCYF/CPS. Can help families understand their rights and the system.",
    location: "Washington State",
    website: "https://ofco.wa.gov/",
    phone: "1-800-571-7321",
  },
  {
    name: "Center for Children & Youth Justice",
    type: "family-cps",
    serviceType: "informational",
    description: "Advocacy and system reform for youth in foster care and juvenile justice. Resources for families navigating the system.",
    location: "Washington State",
    website: "https://ccyj.org/",
    phone: "(206) 696-7503",
  },
  {
    name: "Washington State DCYF - Family Rights",
    type: "family-cps",
    serviceType: "informational",
    description: "Information about parent and family rights during CPS investigations and dependency proceedings.",
    location: "Washington State",
    website: "https://www.dcyf.wa.gov/",
    phone: "1-866-363-4276",
  },
  {
    name: "Treehouse",
    type: "family-cps",
    serviceType: "informational",
    description: "Support services for youth in foster care including education advocacy, housing, and graduation support.",
    location: "Washington State",
    website: "https://treehouseforkids.org/",
    phone: "(206) 767-7000",
  },
  // Legal Aid
  {
    name: "Washington LawHelp",
    type: "legal-aid",
    serviceType: "informational",
    description: "Self-help legal information and resources. Find forms, guides, and legal aid organizations.",
    location: "Washington State",
    website: "https://www.washingtonlawhelp.org/",
    phone: "Various",
  },
  {
    name: "King County Bar Association Lawyer Referral",
    type: "legal-aid",
    serviceType: "legal",
    description: "Low-cost attorney consultations ($45 for 30 minutes) with attorneys in various practice areas.",
    location: "King County, WA",
    website: "https://www.kcba.org/For-the-Public/Lawyer-Referral-Service",
    phone: "(206) 267-7100",
  },
  {
    name: "Washington State Bar Lawyer Referral",
    type: "legal-aid",
    serviceType: "legal",
    description: "Statewide referral service to connect with attorneys offering reduced-fee initial consultations.",
    location: "Washington State",
    website: "https://www.wsba.org/for-the-public/find-legal-help",
    phone: "(206) 443-9722",
  },
];

export default function FindLegalHelp() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredResources = resources.filter(resource => {
    const matchesFilter = activeFilter === "all" || resource.type === activeFilter;
    const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Group resources by type for accordion display
  const groupedResources = filteredResources.reduce((acc, resource) => {
    if (!acc[resource.type]) {
      acc[resource.type] = [];
    }
    acc[resource.type].push(resource);
    return acc;
  }, {} as Record<string, typeof resources>);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "civil-rights": return Shield;
      case "housing": return Home;
      case "employment": return Briefcase;
      case "disability": return Accessibility;
      case "family-cps": return Users;
      case "trauma-informed": return Heart;
      case "legal-aid": return Users;
      default: return Scale;
    }
  };

  const getTypeLabel = (type: string) => {
    const typeObj = resourceTypes.find(t => t.id === type);
    return typeObj?.label || type;
  };

  return (
    <Layout>
      <div className="container py-12 lg:py-20">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
            <Scale className="w-4 h-4" />
            <span>Rooted in Justice</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Find Legal Help
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Find attorneys, legal aid organizations, and support services in Washington State and beyond.
          </p>
        </div>

        {/* Disclaimer at top */}
        <div className="max-w-4xl mx-auto mb-8">
          <Disclaimer variant="prominent" />
        </div>

        {/* Attorney Search Coming Soon */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="p-6 rounded-2xl bg-gradient-to-br from-accent/10 to-transparent border border-accent/20">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-accent" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground mb-2">
                  Attorney Search — Coming Soon
                </h2>
                <p className="text-muted-foreground mb-3">
                  We're building a searchable directory of civil rights attorneys, including those who specialize in 
                  police misconduct, housing discrimination, employment law, and disability rights. 
                </p>
                <p className="text-sm text-muted-foreground">
                  In the meantime, use the resources below to find legal aid organizations and referral services 
                  that can help connect you with an attorney.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search resources..."
                className="w-full h-12 pl-12 pr-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {resourceTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setActiveFilter(type.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer active:scale-[0.98] ${
                  activeFilter === type.id
                    ? "bg-accent text-accent-foreground shadow-glow"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-2 border-transparent hover:border-accent/30"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Resources by Category - Accordion View */}
        <div className="max-w-4xl mx-auto">
          {activeFilter === "all" ? (
            // Show grouped by category with accordions
            <Accordion type="multiple" className="space-y-4">
              {Object.entries(groupedResources).map(([type, typeResources]) => {
                const Icon = getTypeIcon(type);
                return (
                  <AccordionItem 
                    key={type} 
                    value={type}
                    className="rounded-2xl bg-card border border-border overflow-hidden"
                  >
                    <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-secondary/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-accent" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-foreground">{getTypeLabel(type)}</h3>
                          <p className="text-sm text-muted-foreground">{typeResources.length} resources</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 pb-4">
                      <div className="space-y-4 pt-2">
                        {typeResources.map((resource) => (
                          <ResourceCard key={resource.name} resource={resource} />
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          ) : (
            // Show flat list when filtered
            <div className="space-y-4">
              {filteredResources.map((resource) => (
                <ResourceCard key={resource.name} resource={resource} expanded />
              ))}
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

        {/* Guidance Section */}
        <div className="max-w-3xl mx-auto mt-16 p-8 rounded-2xl bg-card border border-border">
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
          </ul>
        </div>

        {/* CTA */}
        <div className="max-w-2xl mx-auto mt-16 text-center">
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

        {/* Disclaimer */}
        <div className="max-w-4xl mx-auto mt-12 pt-8 border-t border-border">
          <Disclaimer className="justify-center" />
        </div>
      </div>
    </Layout>
  );
}

// Resource Card Component
function ResourceCard({ resource, expanded = false }: { resource: typeof resources[0]; expanded?: boolean }) {
  const [isOpen, setIsOpen] = useState(expanded);
  
  return (
    <div className="p-4 rounded-xl bg-secondary/30 border border-border hover:border-accent/30 transition-all">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left flex items-start justify-between gap-3"
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-foreground">{resource.name}</h4>
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
              resource.serviceType === "legal" 
                ? "bg-accent/20 text-accent border border-accent/30" 
                : "bg-muted text-muted-foreground border border-border"
            }`}>
              {resource.serviceType === "legal" ? "Legal Services" : "Informational"}
            </span>
          </div>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {resource.location}
          </p>
        </div>
        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      
      {isOpen && (
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
          <div className="flex flex-wrap gap-3 text-sm">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Phone className="w-4 h-4" />
              {resource.phone}
            </span>
            {resource.website !== "#" && (
              <a
                href={resource.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-accent font-medium hover:underline px-3 py-1 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors"
              >
                <Globe className="w-4 h-4" />
                Visit Website
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
