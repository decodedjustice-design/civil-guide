import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, FileText, Search, Scale, Wrench } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { libraryCategories } from "@/data/legalEducationLibrary";
import { allEducationalGuides } from "@/data/educationalGuides";
import { additionalEducationalGuides } from "@/data/educationFullGuides";

const topicMeta: Record<string, {
  problems: string[];
  records: string[];
  tools: { label: string; href: string }[];
}> = {
  housing: {
    problems: ["I received a notice", "I need an accommodation", "Someone made a decision about me"],
    records: ["Lease and addenda", "Notices and correspondence", "Rent or payment records", "Repair or inspection records", "Accommodation requests and responses"],
    tools: [{ label: "Case Builder", href: "/case-builder" }, { label: "Record Requests", href: "/cases" }, { label: "Legal Templates", href: "/templates" }],
  },
  cps_dcyf: {
    problems: ["A government agency is investigating me", "Someone made a decision about me", "I need records", "I'm going to court"],
    records: ["Agency notices", "Visit and contact records", "Assessments and reports", "Placement or service records", "Court filings and orders"],
    tools: [{ label: "Case Builder", href: "/case-builder" }, { label: "Evidence & Exhibits", href: "/cases" }, { label: "Record Requests", href: "/cases" }],
  },
  police: {
    problems: ["A government agency is investigating me", "I believe my rights were violated", "I need records"],
    records: ["CAD/dispatch records", "Body-camera or other video", "Officer reports", "911 recordings", "Witness information"],
    tools: [{ label: "Analyzer", href: "/analyzer" }, { label: "Case Builder", href: "/case-builder" }, { label: "Evidence & Exhibits", href: "/cases" }],
  },
  traffic: {
    problems: ["I received a notice", "I'm going to court", "I need records"],
    records: ["Citation or infraction", "CAD/dispatch records", "Dash/body-camera video", "Officer report", "Photos or witness/video evidence"],
    tools: [{ label: "Case Builder", href: "/case-builder" }, { label: "Evidence & Exhibits", href: "/cases" }, { label: "Find Legal Help", href: "/find-help" }],
  },
  disability: {
    problems: ["I need an accommodation", "Someone made a decision about me", "I believe my rights were violated"],
    records: ["Accommodation request", "Response or denial", "Relevant policy", "Supporting documentation", "Appeal or complaint records"],
    tools: [{ label: "Analyzer", href: "/analyzer" }, { label: "Case Builder", href: "/case-builder" }, { label: "Legal Templates", href: "/templates" }],
  },
  education: {
    problems: ["Someone made a decision about me", "I need records", "I need an accommodation", "I'm going to court"],
    records: ["Education records", "IEP or 504 documents", "Evaluations", "Attendance and discipline records", "Meeting correspondence"],
    tools: [{ label: "Case Builder", href: "/case-builder" }, { label: "Record Requests", href: "/cases" }, { label: "Find Legal Help", href: "/find-help" }],
  },
  government: {
    problems: ["I received a notice", "Someone made a decision about me", "I need to appeal", "I need records"],
    records: ["Application", "Eligibility or denial notice", "Agency correspondence", "Verification documents", "Appeal and hearing records"],
    tools: [{ label: "Analyzer", href: "/analyzer" }, { label: "Case Builder", href: "/case-builder" }, { label: "Record Requests", href: "/cases" }],
  },
  courts: {
    problems: ["I received a notice", "I'm going to court", "I need to appeal"],
    records: ["Court notices", "Filed pleadings", "Orders", "Hearing information", "Service records"],
    tools: [{ label: "Case Builder", href: "/case-builder" }, { label: "Case Packets", href: "/cases" }, { label: "Find Legal Help", href: "/find-help" }],
  },
  protest: {
    problems: ["I believe my rights were violated", "I need records", "I'm going to court"],
    records: ["Video or photographs", "Officer information", "Citation or charging documents", "Witness information", "Public statements or notices"],
    tools: [{ label: "Analyzer", href: "/analyzer" }, { label: "Case Builder", href: "/case-builder" }, { label: "Find Legal Help", href: "/find-help" }],
  },
  incarceration: {
    problems: ["I need records", "I believe my rights were violated", "Someone made a decision about me"],
    records: ["Grievances and responses", "Medical requests and records", "Incident reports", "Disciplinary records", "Facility correspondence"],
    tools: [{ label: "Case Builder", href: "/case-builder" }, { label: "Evidence & Exhibits", href: "/cases" }, { label: "Find Legal Help", href: "/find-help" }],
  },
  healthcare: {
    problems: ["I need records", "I need an accommodation", "Someone made a decision about me"],
    records: ["Medical records", "Treatment and consent documents", "Insurance notices", "Bills and claim records", "Complaint or appeal records"],
    tools: [{ label: "Case Builder", href: "/case-builder" }, { label: "Evidence & Exhibits", href: "/cases" }, { label: "Find Legal Help", href: "/find-help" }],
  },
};

const problemHref = (problem: string) => `/analyzer?prompt=${encodeURIComponent(problem)}`;

export default function KnowledgeTopicHub() {
  const { slug } = useParams();
  const category = libraryCategories.find((item) => item.id === slug);
  const guide = [...allEducationalGuides, ...additionalEducationalGuides].find(
    (item) => item.id === category?.guideId
  );
  const meta = slug ? topicMeta[slug] : undefined;

  if (!category || !guide || !meta) {
    return (
      <Layout>
        <div className="min-h-[70vh] flex items-center justify-center px-6">
          <div className="text-center max-w-lg">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground mb-3">Knowledge Center</p>
            <h1 className="font-serif text-4xl text-foreground mb-4">Topic not found</h1>
            <p className="text-muted-foreground mb-7">Return to the Knowledge Center and choose a topic.</p>
            <Button asChild><Link to="/education-library">Back to Knowledge Center</Link></Button>
          </div>
        </div>
      </Layout>
    );
  }

  const authorities = guide.sources.slice(0, 4);

  return (
    <Layout>
      <main className="bg-background">
        <section className="bg-[#0D0D0E] text-[#F4F4F0]">
          <div className="container mx-auto px-6 py-8">
            <Link to="/education-library" className="inline-flex items-center gap-2 text-sm text-[#F4F4F0]/65 hover:text-[#F4F4F0]">
              <ArrowLeft className="w-4 h-4" /> Knowledge Center
            </Link>
          </div>
          <div className="container mx-auto px-6 pb-16 pt-8 max-w-6xl">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.24em] text-[#C5A880] mb-5">Topic guide</p>
              <h1 className="font-serif text-4xl md:text-6xl leading-[1.02] mb-6">{category.title}</h1>
              <p className="text-lg md:text-xl leading-relaxed text-[#F4F4F0]/70 max-w-2xl">{category.subtitle}</p>
              <div className="flex flex-wrap gap-3 mt-8">
                <Button asChild className="bg-[#C5A880] text-[#0D0D0E] hover:bg-[#d3bb98]">
                  <Link to={`/guide/${category.guideId}`}>Read the full guide <ArrowRight className="ml-2 w-4 h-4" /></Link>
                </Button>
                <Button asChild variant="outline" className="border-[#F4F4F0]/20 bg-transparent text-[#F4F4F0] hover:bg-[#F4F4F0]/10">
                  <Link to={`/analyzer?system=${category.id}`}>Research this topic</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-6 py-12 max-w-6xl">
          <section className="grid lg:grid-cols-[1.35fr_.65fr] gap-8 mb-12">
            <div className="rounded-2xl border border-border bg-card p-7 md:p-9">
              <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">In plain language</p>
              <h2 className="font-serif text-3xl text-foreground mb-4">Start with what this system does</h2>
              <p className="text-muted-foreground leading-relaxed">{guide.whatThisSystemIs.description}</p>
              <div className="grid md:grid-cols-2 gap-5 mt-7 pt-7 border-t border-border">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Who runs it</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{guide.whatThisSystemIs.whoRunsIt}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">What it controls</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{guide.whatThisSystemIs.whatItControls}</p>
                </div>
              </div>
            </div>

            <aside className="rounded-2xl border border-[#C5A880]/30 bg-[#C5A880]/[0.07] p-7">
              <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">Key facts</p>
              <div className="space-y-3">
                {category.quickFacts.map((fact) => (
                  <div key={fact} className="flex gap-3 text-sm text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span>{fact}</span>
                  </div>
                ))}
              </div>
            </aside>
          </section>

          <section className="mb-12">
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.2em] text-primary">Choose your path</p>
              <h2 className="font-serif text-3xl md:text-4xl text-foreground mt-2">What are you dealing with?</h2>
              <p className="text-muted-foreground mt-2">Start from the problem rather than trying to learn the entire system.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
              {meta.problems.map((problem) => (
                <Link key={problem} to={problemHref(problem)} className="group rounded-xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-sm transition-all">
                  <span className="text-sm font-medium text-foreground group-hover:text-primary">{problem}</span>
                  <ArrowRight className="w-4 h-4 mt-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>
          </section>

          <section className="grid lg:grid-cols-2 gap-6 mb-12">
            <div className="rounded-2xl border border-border bg-card p-7">
              <div className="flex items-center gap-3 mb-5">
                <Scale className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Research & authority</p>
                  <h2 className="font-serif text-2xl text-foreground">Follow the source trail</h2>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-5">These sources are starting points for research. Check the current text, jurisdiction, effective date, and procedural context before relying on a source.</p>
              <div className="space-y-3">
                {authorities.map((source) => (
                  <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-4 p-4 rounded-xl bg-muted/30 border border-border hover:border-primary/30">
                    <div>
                      <p className="text-xs text-primary uppercase tracking-wide">{source.type}</p>
                      <p className="text-sm font-medium text-foreground mt-1">{source.label}</p>
                    </div>
                    <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                  </a>
                ))}
              </div>
              <Button asChild variant="outline" className="mt-5 w-full">
                <Link to="/law-modules">Open legal research modules</Link>
              </Button>
            </div>

            <div className="rounded-2xl border border-border bg-card p-7">
              <div className="flex items-center gap-3 mb-5">
                <FileText className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Build your record</p>
                  <h2 className="font-serif text-2xl text-foreground">Records that may help</h2>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-5">These are evidence categories to consider, not a conclusion about what happened in your situation.</p>
              <div className="space-y-2">
                {meta.records.map((record) => (
                  <div key={record} className="flex items-start gap-3 py-2">
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <span className="text-sm text-foreground">{record}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-7 md:p-9 mb-12">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-7">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary">Take action</p>
                <h2 className="font-serif text-3xl text-foreground mt-2">Use the knowledge in your workflow</h2>
                <p className="text-muted-foreground mt-2 max-w-2xl">Move from understanding to organized records without treating general information as a finding about your case.</p>
              </div>
              <Wrench className="w-8 h-8 text-primary hidden md:block" />
            </div>
            <div className="grid md:grid-cols-3 gap-3">
              {meta.tools.map((tool) => (
                <Link key={tool.label} to={tool.href} className="rounded-xl border border-border p-5 hover:border-primary/40 transition-colors">
                  <p className="font-medium text-foreground">{tool.label}</p>
                  <p className="text-sm text-muted-foreground mt-1">Open tool</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="border-t border-border pt-10 mb-10">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Continue learning</p>
                <h2 className="font-serif text-2xl text-foreground mt-2">Related research</h2>
              </div>
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {libraryCategories.filter((item) => item.id !== category.id).slice(0, 3).map((related) => (
                <Link key={related.id} to={`/education-library/topic/${related.id}`} className="p-5 rounded-xl border border-border hover:border-primary/40 transition-colors">
                  <p className="font-medium text-foreground">{related.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{related.subtitle}</p>
                </Link>
              ))}
            </div>
          </section>

          <div className="flex justify-center">
            <Button asChild variant="ghost">
              <Link to="/education-library"><ArrowLeft className="mr-2 w-4 h-4" /> Back to Knowledge Center</Link>
            </Button>
          </div>
        </div>
      </main>
      <Disclaimer />
    </Layout>
  );
}
