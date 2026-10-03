import { ArrowRight, ExternalLink, ShieldCheck, Scale, HeartHandshake, BookOpen, Building2 } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { AttorneyDirectory } from "@/components/legal/AttorneyDirectory";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const resourceLinks = [
  {
    title: "WSBA Legal Directory",
    description: "Search Washington legal professionals and verify licensing information through the Washington State Bar Association.",
    url: "https://wsba.org/search",
    type: "Private attorney verification",
    icon: ShieldCheck,
  },
  {
    title: "Washington LawHelp",
    description: "Find Washington civil legal-aid programs by county and access self-help information, forms, and legal-help resources.",
    url: "https://www.washingtonlawhelp.org/en/get-legal-help",
    type: "Legal aid + self-help",
    icon: HeartHandshake,
  },
  {
    title: "WSBA Qualified Legal Service Providers",
    description: "Browse qualified legal-service providers by Washington county, including civil legal-aid and pro bono organizations.",
    url: "https://wsba.org/connect-serve/pro-bono-public-service/qlsp-directory",
    type: "Legal aid + pro bono",
    icon: Building2,
  },
  {
    title: "ABA Free Legal Help",
    description: "National pathways for legal aid, pro bono assistance, ABA Free Legal Answers, and other legal-help resources.",
    url: "https://www.americanbar.org/groups/legal_services/flh-home/flh-free-legal-help/",
    type: "National legal-help routing",
    icon: Scale,
  },
  {
    title: "ABA Law School Pro Bono Directory",
    description: "Find law-school public-interest and pro bono programs that may offer clinics or other legal assistance.",
    url: "https://www.americanbar.org/groups/center-pro-bono/resources/directory_of_law_school_public_interest_pro_bono_programs/",
    type: "Law-school programs",
    icon: BookOpen,
  },
];

const focusAreas = [
  "Civil Rights",
  "Police Misconduct",
  "Government / Agency Conduct",
  "Disability Rights / ADA / §504",
  "Housing / Fair Housing",
  "DCYF / Child Welfare",
  "Family / Guardianship",
  "Education",
  "Employment",
  "Public Records",
  "Benefits / Social Security",
  "Federal Litigation",
];

export default function LegalHelp() {
  return (
    <Layout>
      <section className="container max-w-6xl py-12 md:py-16">
        <div className="max-w-3xl mb-10">
          <p className="text-sm font-medium tracking-wide text-accent uppercase mb-3">Legal Help Network</p>
          <h1 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Find legal help for the problem you actually have.
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Decoded Justice focuses on civil rights, government conduct, disability, housing,
            child welfare, benefits, education, employment, records, and related civil legal matters.
            Use the directory below to discover private attorneys, then use the verified public
            resources to find legal aid, pro bono programs, clinics, and self-help options.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-muted/40 p-5 md:p-6 mb-10">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-accent mt-0.5 shrink-0" />
            <div>
              <h2 className="font-medium text-foreground">How this works</h2>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                Listings are informational. A directory listing does not mean an attorney or
                organization has agreed to take a case. Verify current licensing, eligibility,
                practice area, availability, fees, and representation terms directly with the
                provider.
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-8 items-start">
          <div className="min-w-0">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-foreground">Private attorneys</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Search the Decoded Justice directory by practice area, county, and fee structure.
              </p>
            </div>
            <AttorneyDirectory />
          </div>

          <aside className="space-y-4 lg:sticky lg:top-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Focus areas</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {focusAreas.map((area) => (
                  <span
                    key={area}
                    className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground"
                  >
                    {area}
                  </span>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Official legal-help resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {resourceLinks.map((resource) => {
                  const Icon = resource.icon;
                  return (
                    <div key={resource.title} className="rounded-xl border border-border p-3">
                      <div className="flex gap-3">
                        <Icon className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground">{resource.title}</p>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            {resource.description}
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-2">{resource.type}</p>
                          <Button asChild variant="link" size="sm" className="px-0 h-auto mt-2">
                            <a href={resource.url} target="_blank" rel="noopener noreferrer">
                              Open resource
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="bg-accent/5 border-accent/20">
              <CardContent className="p-5">
                <h3 className="font-medium text-foreground">Already have a case?</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  Use your case workspace to organize the facts, documents, timeline, issues,
                  evidence, and records before contacting legal help.
                </p>
                <Button asChild variant="outline" className="w-full mt-4">
                  <a href="/cases">
                    Open Case Workspace
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </Layout>
  );
}
