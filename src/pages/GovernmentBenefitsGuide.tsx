import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink, FileText, Gavel, ShieldCheck } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { GuideActions } from "@/components/guides/GuideActions";
import { governmentBenefitsGuide } from "@/data/governmentBenefitsGuide";

const sections = [
  {
    number: "01",
    title: "Before You Start",
    body: [governmentBenefitsGuide.beforeYouStart.grounding, governmentBenefitsGuide.beforeYouStart.consent],
  },
  {
    number: "02",
    title: "What This System Is",
    body: [
      governmentBenefitsGuide.whatThisSystemIs.description,
      `Who runs it: ${governmentBenefitsGuide.whatThisSystemIs.whoRunsIt}`,
      `What it controls: ${governmentBenefitsGuide.whatThisSystemIs.whatItControls}`,
    ],
  },
  {
    number: "03",
    title: "Why It Feels So Confusing",
    body: [governmentBenefitsGuide.whyConfusing.explanation],
    bullets: governmentBenefitsGuide.whyConfusing.structuralReasons,
  },
  {
    number: "04",
    title: "What Usually Happens",
    bullets: governmentBenefitsGuide.whatUsuallyHappens,
  },
  {
    number: "05",
    title: "What Success Actually Looks Like",
    body: [governmentBenefitsGuide.successReframe.reality],
    bullets: governmentBenefitsGuide.successReframe.examples,
  },
  {
    number: "06",
    title: "What They Know — But You Don't",
    body: [governmentBenefitsGuide.internalKnowledge.explanation],
    bullets: governmentBenefitsGuide.internalKnowledge.examples,
  },
  {
    number: "07",
    title: "What People Often Misunderstand",
    bullets: governmentBenefitsGuide.misunderstandings.traps,
  },
  {
    number: "08",
    title: "What Actually Matters",
    bullets: governmentBenefitsGuide.whatMatters,
  },
  {
    number: "09",
    title: "What You Can Do Safely",
    bullets: governmentBenefitsGuide.safeSteps,
  },
  {
    number: "10",
    title: "When It's Time to Escalate",
    body: [governmentBenefitsGuide.escalation.explanation],
    bullets: governmentBenefitsGuide.escalation.signs,
  },
  {
    number: "11",
    title: "Closing",
    body: [governmentBenefitsGuide.closing.reassurance],
  },
];

export default function GovernmentBenefitsGuide() {
  useEffect(() => {
    const key = "dj_recently_viewed_guides";
    try {
      const recent: string[] = JSON.parse(localStorage.getItem(key) || "[]");
      localStorage.setItem(
        key,
        JSON.stringify([
          governmentBenefitsGuide.id,
          ...recent.filter((id) => id !== governmentBenefitsGuide.id),
        ].slice(0, 10)),
      );
    } catch {
      // Ignore localStorage failures.
    }
  }, []);

  return (
    <Layout>
      <div className="container py-8 lg:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between gap-3 mb-8">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/education-library">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Education Library
              </Link>
            </Button>
            <span className="text-xs text-muted-foreground">{governmentBenefitsGuide.readTime}</span>
          </div>

          <header className="rounded-2xl border border-border bg-card p-6 sm:p-8 mb-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3 py-1.5 text-xs font-medium text-primary mb-4">
              <Gavel className="w-4 h-4" />
              Government Agencies & Benefits
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              {governmentBenefitsGuide.title}
            </h1>
            <p className="text-muted-foreground mt-3 max-w-3xl leading-relaxed">
              A Washington-focused guide to agency decisions, public benefits, notices, administrative hearings, appeals, records, and escalation paths.
            </p>
            <div className="mt-6">
              <GuideActions guide={governmentBenefitsGuide} categoryTitle="Government Agencies & Benefits" />
            </div>
          </header>

          <div className="rounded-xl border border-primary/15 bg-primary/5 p-4 mb-8">
            <div className="flex gap-3">
              <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground text-sm">Start with the notice.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Agency deadlines and review routes are program-specific. Use the exact notice you received to confirm the deadline and instructions before relying on a general rule.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {sections.map((section) => (
              <section key={section.number} className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="px-5 sm:px-6 py-4 border-b border-border/60 flex items-center gap-3">
                  <span className="text-xs font-semibold tracking-widest text-primary">{section.number}</span>
                  <h2 className="font-semibold text-foreground">{section.title}</h2>
                </div>
                <div className="p-5 sm:p-6 space-y-4">
                  {section.body?.map((paragraph) => (
                    <p key={paragraph} className="text-sm leading-7 text-muted-foreground">
                      {paragraph}
                    </p>
                  ))}
                  {section.bullets && (
                    <ul className="space-y-2.5">
                      {section.bullets.map((item) => (
                        <li key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                          <span className="text-primary mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            ))}
          </div>

          <section className="mt-8 rounded-2xl border border-border bg-card p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-foreground">Washington Agency & Legal Resources</h2>
            </div>
            <div className="grid gap-3">
              {governmentBenefitsGuide.sources.map((source) => (
                <a
                  key={source.url}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 rounded-xl border border-border p-4 hover:border-primary/30 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-sm text-foreground">{source.label}</p>
                    <p className="text-xs text-muted-foreground mt-1 capitalize">{source.type} source</p>
                  </div>
                </a>
              ))}
            </div>
          </section>

          <div className="mt-8">
            <Disclaimer variant="prominent" />
          </div>

          <div className="mt-8 text-center">
            <Button variant="outline" asChild>
              <Link to="/education-library">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to All Guides
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
