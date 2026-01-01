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
  ArrowRight
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { useState } from "react";

const resourceTypes = [
  { id: "all", label: "All Resources" },
  { id: "legal-aid", label: "Legal Aid" },
  { id: "bar-association", label: "Bar Associations" },
  { id: "referral", label: "Referral Services" },
  { id: "pro-bono", label: "Pro Bono Programs" },
];

const resources = [
  {
    name: "Legal Aid Society",
    type: "legal-aid",
    description: "Free legal services for low-income individuals in civil matters including housing, family, and employment law.",
    location: "Nationwide",
    website: "https://www.lsc.gov/about-lsc/what-legal-aid/get-legal-help",
    phone: "Find local office",
  },
  {
    name: "American Bar Association",
    type: "bar-association",
    description: "Resources for finding attorneys, understanding legal issues, and accessing free legal information.",
    location: "Nationwide",
    website: "https://www.americanbar.org/groups/legal_services/flh-home/",
    phone: "Varies by state",
  },
  {
    name: "State Bar Lawyer Referral",
    type: "referral",
    description: "Your state bar association can connect you with attorneys who practice in specific areas of law.",
    location: "State-specific",
    website: "#",
    phone: "Contact your state bar",
  },
  {
    name: "Pro Bono Network",
    type: "pro-bono",
    description: "Volunteer attorneys providing free legal services to those who cannot afford representation.",
    location: "Varies by program",
    website: "#",
    phone: "Find local program",
  },
  {
    name: "Law School Clinics",
    type: "legal-aid",
    description: "Law school students supervised by attorneys provide free legal services in various areas.",
    location: "University-based",
    website: "#",
    phone: "Contact local law schools",
  },
  {
    name: "ACLU",
    type: "referral",
    description: "Focuses on civil liberties cases including free speech, discrimination, and criminal justice reform.",
    location: "Nationwide",
    website: "https://www.aclu.org/",
    phone: "State affiliates vary",
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
            Find attorneys, legal aid organizations, and referral services that may be able to assist you.
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
            {filteredResources.map((resource) => (
              <div
                key={resource.name}
                className="p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-200"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                    {resource.type === "legal-aid" && <Users className="w-6 h-6 text-foreground" />}
                    {resource.type === "bar-association" && <Building className="w-6 h-6 text-foreground" />}
                    {resource.type === "referral" && <Scale className="w-6 h-6 text-foreground" />}
                    {resource.type === "pro-bono" && <Users className="w-6 h-6 text-foreground" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {resource.name}
                    </h3>
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
            ))}
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
                <strong className="text-foreground">Know your issue area.</strong> Different attorneys specialize in different areas (employment, housing, criminal defense, etc.).
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
