import { Link, useSearchParams } from "react-router-dom";
import { 
  FileText, 
  Shield, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Scale, 
  Users, 
  Home, 
  Gavel,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Info
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/shared/Disclaimer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const systemTypes = [
  {
    id: "police",
    icon: Shield,
    label: "Police / Law Enforcement",
    examples: ["Incident reports", "Body camera footage", "911 call records", "Arrest records", "Internal investigation files"],
    agencies: ["Local police departments", "Sheriff's offices", "State patrol"],
  },
  {
    id: "government",
    icon: Building2,
    label: "Government Agencies",
    examples: ["Agency correspondence", "Decision records", "Meeting minutes", "Permits and licenses", "Contracts"],
    agencies: ["City and county offices", "State agencies", "Federal agencies (via FOIA)"],
  },
  {
    id: "courts",
    icon: Gavel,
    label: "Courts & Legal System",
    examples: ["Case files", "Court orders", "Hearing transcripts", "Judgments", "Filings"],
    agencies: ["Municipal courts", "Superior courts", "Court clerks"],
  },
  {
    id: "cps_dcyf",
    icon: Users,
    label: "CPS / DCYF / Family Services",
    examples: ["Case files (your own)", "Investigation reports", "Service plans", "Correspondence"],
    agencies: ["Department of Children, Youth, and Families", "Child Protective Services"],
  },
  {
    id: "housing",
    icon: Home,
    label: "Housing & Public Agencies",
    examples: ["Inspection records", "Permit applications", "Code violation records", "Housing authority files"],
    agencies: ["Housing authorities", "Building departments", "Code enforcement"],
  },
  {
    id: "jails",
    icon: Scale,
    label: "Jails & Corrections",
    examples: ["Inmate records", "Medical records", "Disciplinary records", "Grievance files"],
    agencies: ["County jails", "State Department of Corrections", "Federal Bureau of Prisons"],
  },
];

const keyPrinciples = [
  {
    icon: CheckCircle2,
    title: "You Have Rights",
    description: "Public records laws exist to give you access to government documents. In Washington State, this is the Public Records Act (PRA). At the federal level, it's the Freedom of Information Act (FOIA).",
  },
  {
    icon: Clock,
    title: "Agencies Have Deadlines",
    description: "Agencies are required to respond within specific timeframes. In Washington, agencies must respond within 5 business days (though they may request extensions).",
  },
  {
    icon: FileText,
    title: "Put Everything in Writing",
    description: "Written requests create a paper trail. Always keep copies of your requests and any responses you receive.",
  },
  {
    icon: AlertCircle,
    title: "Some Records Are Exempt",
    description: "Certain records may be exempt from disclosure (like ongoing investigations or personal privacy). Agencies must explain which exemption applies if they deny your request.",
  },
];

const whatYouCanRequest = [
  "Police reports and incident reports",
  "Body camera and dash camera footage",
  "911 call recordings and dispatch logs",
  "Emails and correspondence between officials",
  "Meeting minutes and agendas",
  "Contracts and financial records",
  "Inspection and investigation reports",
  "Your own case files (in many situations)",
  "Policies and procedures",
  "Training materials and manuals",
];

const organizingTips = [
  {
    title: "Create a Request Log",
    description: "Keep a record of every request you make: date sent, agency, what you requested, and responses received.",
  },
  {
    title: "Save All Correspondence",
    description: "Keep copies of everything — emails, letters, and any documents you receive.",
  },
  {
    title: "Note Deadlines",
    description: "Track when agencies must respond. If they don't respond in time, that itself is important to document.",
  },
  {
    title: "Compare Records",
    description: "When you receive records, compare them to your own documentation. Note any discrepancies.",
  },
  {
    title: "Store Securely",
    description: "Use the Evidence Vault to organize and store important documents in one place.",
  },
];

export default function PublicRequestRights() {
  const [searchParams] = useSearchParams();
  const fromAnalyzer = searchParams.get("from") === "analyzer";
  const systemFilter = searchParams.get("system");

  return (
    <Layout>
      <div className="container py-12 lg:py-20">
        <div className="max-w-4xl mx-auto">
          {/* Back to Analyzer Button */}
          {fromAnalyzer && (
            <div className="mb-6">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/analyzer">
                  <ArrowLeft className="w-4 h-4" />
                  Back to my Analyzer Results
                </Link>
              </Button>
            </div>
          )}

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
              <FileText className="w-4 h-4" />
              <span>Self-Help Tool</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Public Request Rights
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Understand, request, and organize public records and documents. Knowledge about what's in official files can be powerful.
            </p>
          </div>

          {/* Wellbeing Note */}
          <div className="p-4 rounded-xl bg-muted/50 border border-border mb-10">
            <p className="text-sm text-muted-foreground text-center">
              <strong className="text-foreground">You can take your time.</strong> Requesting records can feel overwhelming. 
              Start with one request and build from there. There's no rush.
            </p>
          </div>

          {/* Key Principles */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-foreground mb-6">What You Should Know</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {keyPrinciples.map((principle) => (
                <div
                  key={principle.title}
                  className="p-5 rounded-2xl bg-card border border-border"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
                      <principle.icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{principle.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {principle.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* What You Can Request */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-foreground mb-6">Types of Records You Can Request</h2>
            <div className="p-6 rounded-2xl bg-card border border-border">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {whatYouCanRequest.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* System-Specific Guidance */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-foreground mb-6">Records by System</h2>
            <p className="text-muted-foreground mb-6">
              Different agencies hold different types of records. Expand a section to learn more about what you might request.
            </p>
            
            <Accordion 
              type="single" 
              collapsible 
              className="space-y-3"
              defaultValue={systemFilter || undefined}
            >
              {systemTypes.map((system) => (
                <AccordionItem 
                  key={system.id} 
                  value={system.id}
                  className="border border-border rounded-xl px-5 data-[state=open]:border-accent/50 transition-colors"
                >
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                        <system.icon className="w-5 h-5 text-foreground" />
                      </div>
                      <span className="font-semibold text-foreground">{system.label}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-5">
                    <div className="pl-13 space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-2">Common Records to Request:</h4>
                        <ul className="space-y-1">
                          {system.examples.map((example) => (
                            <li key={example} className="text-sm text-muted-foreground flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                              {example}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-2">Where to Send Requests:</h4>
                        <ul className="space-y-1">
                          {system.agencies.map((agency) => (
                            <li key={agency} className="text-sm text-muted-foreground flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground shrink-0" />
                              {agency}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* Organizing Your Requests */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-foreground mb-6">Organizing Your Requests</h2>
            <div className="space-y-4">
              {organizingTips.map((tip, index) => (
                <div
                  key={tip.title}
                  className="p-5 rounded-2xl bg-card border border-border"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0 text-sm font-semibold text-foreground">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{tip.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {tip.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Related Tools */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-foreground mb-6">Related Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                to="/evidence-vault"
                className="group p-5 rounded-2xl bg-card border border-border hover:border-accent/50 hover:shadow-glow transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary group-hover:bg-accent/20 flex items-center justify-center transition-colors">
                      <FileText className="w-5 h-5 text-foreground group-hover:text-accent transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">Evidence Vault</h3>
                      <p className="text-sm text-muted-foreground">Store records you receive</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
              
              <Link
                to="/timeline"
                className="group p-5 rounded-2xl bg-card border border-border hover:border-accent/50 hover:shadow-glow transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary group-hover:bg-accent/20 flex items-center justify-center transition-colors">
                      <Clock className="w-5 h-5 text-foreground group-hover:text-accent transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">Timeline Builder</h3>
                      <p className="text-sm text-muted-foreground">Track request dates and responses</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            </div>
          </section>

          {/* Learn More */}
          <section className="mb-12 p-6 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
                <BookOpen className="w-6 h-6 text-accent" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-2">Learn More in the Library</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Our detailed guides explain records request processes, exemptions, and what to do if a request is denied.
                </p>
                <Button variant="soft" size="sm" asChild>
                  <Link to="/library">
                    Open Library
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Educational Disclaimer */}
          <div className="p-4 rounded-xl bg-muted/30 border border-border mb-8">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Educational use only.</strong> This tool helps you understand your rights and organize information. 
                It does not provide legal advice, submit requests on your behalf, or guarantee outcomes.
              </p>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="pt-8 border-t border-border">
            <Disclaimer className="justify-center" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
