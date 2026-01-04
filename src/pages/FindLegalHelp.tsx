import { Link } from "react-router-dom";
import { 
  Search, 
  Scale, 
  Users, 
  Building, 
  ExternalLink,
  MapPin,
  Phone,
  Globe,
  ArrowRight,
  Heart,
  Shield,
  Home,
  Briefcase,
  Accessibility
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { useState } from "react";

const resourceTypes = [
  { id: "all", label: "All Resources" },
  { id: "civil-rights", label: "Civil Rights", icon: Shield },
  { id: "housing", label: "Housing", icon: Home },
  { id: "employment", label: "Employment", icon: Briefcase },
  { id: "disability", label: "Disability", icon: Accessibility },
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "civil-rights": return Shield;
      case "housing": return Home;
      case "employment": return Briefcase;
      case "disability": return Accessibility;
      case "trauma-informed": return Heart;
      case "legal-aid": return Users;
      default: return Scale;
    }
  };

  return (
    <Layout>
      <div className="container py-12 lg:py-20">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 mb-6">
            <Scale className="w-8 h-8 text-primary" />
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
                className="w-full h-12 pl-12 pr-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {resourceTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setActiveFilter(type.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeFilter === type.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Resources List */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {filteredResources.map((resource) => {
              const Icon = getTypeIcon(resource.type);
              return (
                <div
                  key={resource.name}
                  className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-200"
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">
                          {resource.name}
                        </h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          resource.serviceType === "legal" 
                            ? "bg-primary/20 text-primary" 
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {resource.serviceType === "legal" ? "Legal Services" : "Informational"}
                        </span>
                      </div>
                      <p className="text-muted-foreground mb-4">
                        {resource.description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {resource.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {resource.phone}
                        </span>
                        {resource.website !== "#" && (
                          <a
                            href={resource.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-primary hover:underline"
                          >
                            <Globe className="w-4 h-4" />
                            Visit Website
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

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
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Tips for Finding the Right Help
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-medium shrink-0">1</span>
              <span className="text-muted-foreground">
                <strong className="text-foreground">Know your issue area.</strong> Different attorneys specialize in different areas (civil rights, housing, employment, disability, etc.).
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-medium shrink-0">2</span>
              <span className="text-muted-foreground">
                <strong className="text-foreground">Check eligibility.</strong> Legal aid organizations often have income requirements for free services.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-medium shrink-0">3</span>
              <span className="text-muted-foreground">
                <strong className="text-foreground">Prepare your information.</strong> Having your documents organized can help attorneys understand your situation faster.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-medium shrink-0">4</span>
              <span className="text-muted-foreground">
                <strong className="text-foreground">Ask about consultations.</strong> Many attorneys offer free initial consultations to discuss your case.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-xs font-medium shrink-0">5</span>
              <span className="text-muted-foreground">
                <strong className="text-foreground">Consider trauma-informed resources.</strong> If your situation involves trauma, look for services that specialize in supportive, understanding approaches.
              </span>
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div className="max-w-2xl mx-auto mt-12 text-center">
          <p className="text-muted-foreground mb-6">
            Need help organizing your information before contacting an attorney?
          </p>
          <Button variant="hero" size="lg" asChild>
            <Link to="/self-help">
              Use Self-Help Tools
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
