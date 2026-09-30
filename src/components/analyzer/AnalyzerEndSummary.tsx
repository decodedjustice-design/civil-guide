import type { ReactNode } from "react";
import {
  ArrowRight,
  CheckCircle2,
  CircleHelp,
  Clock3,
  ExternalLink,
  FileSearch,
  FolderOpen,
  ListChecks,
  Printer,
  Scale,
  Search,
  Share2,
  ShieldAlert,
  ShieldCheck,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AnalyzerResultsAI, PotentialViolation } from "@/hooks/useAnalyzerResultsAI";
import type { LawModule } from "@/lib/law/issueLibrary";

interface AnalyzerEndSummaryProps {
  aiResults: AnalyzerResultsAI;
  findings: PotentialViolation[];
  lawModules: LawModule[];
  policeMissingFacts: string[];
  onAddToCase: () => void;
  systemLabel?: string;
  location?: string;
}

const SectionLabel = ({ children }: { children: ReactNode }) => (
  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">{children}</p>
);

const EmptyAwareList = ({ items, fallback }: { items: string[]; fallback: string }) => (
  items.length ? (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={`${item}-${i}`} className="flex gap-3 text-sm leading-6 text-foreground/85">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  ) : <p className="text-sm leading-6 text-muted-foreground">{fallback}</p>
);

function getReviewLabel(findings: PotentialViolation[], missing: string[]) {
  if (findings.length === 0 && missing.length === 0) return { label: "Informational", icon: Search };
  if (missing.length > findings.length * 2) return { label: "More information needed", icon: CircleHelp };
  return { label: "Priority for review", icon: ShieldAlert };
}

export function AnalyzerEndSummary({
  aiResults,
  findings,
  lawModules,
  policeMissingFacts,
  onAddToCase,
  systemLabel = "Civil rights",
  location = "Washington State",
}: AnalyzerEndSummaryProps) {
  const evidence = Array.from(new Set(findings.flatMap(f => f.evidenceToLookFor))).slice(0, 12);
  const missing = Array.from(new Set([
    ...findings.flatMap(f => f.missingFacts ?? []),
    ...findings.flatMap(f => f.whatWouldNeedToBeTrue ?? []),
    ...policeMissingFacts,
  ])).slice(0, 14);
  const actions = aiResults.priorityActions.slice(0, 6);
  const authorities = aiResults.referenceAnchors.slice(0, 10);
  const review = getReviewLabel(findings, missing);
  const ReviewIcon = review.icon;
  const executiveSummary = aiResults.executiveSummary || aiResults.systemIdentification ||
    "The analyzer organized the information you provided into research leads, open questions, records to locate, and practical next steps.";
  const known = aiResults.whatWeKnow?.length ? aiResults.whatWeKnow : aiResults.usualProcess.slice(0, 4);
  const verify = aiResults.whatWeNeedToVerify?.length ? aiResults.whatWeNeedToVerify : missing.slice(0, 6);

  const printPage = () => window.print();
  const shareSafely = async () => {
    const shareData = { title: "Decoded Justice — Analyzer Results", text: "My Decoded Justice analysis", url: window.location.href };
    try {
      if (navigator.share) await navigator.share(shareData);
      else await navigator.clipboard.writeText(window.location.href);
    } catch {
      // User cancelled sharing; no action needed.
    }
  };
  const quickExit = () => {
    window.location.replace("https://www.google.com");
  };

  return (
    <section className="mt-10 mb-10" aria-label="Analyzer results report">
      <div className="overflow-hidden rounded-[30px] border border-border bg-background shadow-sm print:shadow-none print:border-0">
        {/* Phase 1 — orientation */}
        <header className="border-b border-border bg-card px-5 py-5 sm:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <SectionLabel>Legal Analyzer</SectionLabel>
              <h2 className="mt-1 font-serif text-3xl leading-tight text-foreground sm:text-4xl">Your analysis, organized</h2>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span className="rounded-full border border-border bg-background px-3 py-1.5">{location}</span>
                <span className="rounded-full border border-border bg-background px-3 py-1.5">{systemLabel}</span>
                <button type="button" className="text-primary underline-offset-4 hover:underline print:hidden">Edit analysis inputs</button>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 print:hidden">
              <Button variant="outline" size="sm" onClick={printPage} className="gap-2"><Printer className="h-4 w-4" />Save / Print</Button>
              <Button variant="outline" size="sm" onClick={shareSafely} className="gap-2"><Share2 className="h-4 w-4" />Share safely</Button>
              <Button variant="outline" size="sm" onClick={quickExit} className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10"><X className="h-4 w-4" />Quick exit</Button>
            </div>
          </div>
        </header>

        <nav className="grid border-b border-border bg-muted/20 sm:grid-cols-4 print:hidden" aria-label="Result sections">
          {[
            ["1", "Summary", "What this means"],
            ["2", "Findings", "What to examine"],
            ["3", "Authority", "What governs"],
            ["4", "Action plan", "What to do next"],
          ].map(([n, title, sub]) => (
            <a key={n} href={`#analyzer-${n}`} className="border-b border-border p-4 transition-colors hover:bg-muted/50 sm:border-b-0 sm:border-r last:border-r-0">
              <span className="text-xs font-semibold text-primary">{n}</span>
              <p className="mt-1 text-sm font-semibold text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </a>
          ))}
        </nav>

        <div className="divide-y divide-border">
          {/* Summary */}
          <section id="analyzer-1" className="scroll-mt-6 px-5 py-8 sm:px-8 sm:py-10">
            <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
              <div>
                <SectionLabel>01 · Immediate orientation</SectionLabel>
                <h3 className="mt-2 font-serif text-2xl text-foreground sm:text-3xl">What does this information mean so far?</h3>
                <p className="mt-4 max-w-3xl text-base leading-7 text-foreground/85">{executiveSummary}</p>
                <p className="mt-4 max-w-3xl text-sm leading-6 text-muted-foreground">
                  This is an organized research summary, not a determination that a legal violation occurred. The result depends on the underlying facts, records, and applicable law.
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-2">
                  <ReviewIcon className="h-5 w-5 text-primary" />
                  <p className="text-sm font-semibold text-foreground">Status</p>
                </div>
                <p className="mt-3 text-xl font-semibold text-foreground">{review.label}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Based on the amount of information currently organized. This is not a case-strength or liability score.
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                ["What we know", known.slice(0, 4), "Facts or information reflected in what you provided."],
                ["What we need to verify", verify.slice(0, 4), "Open facts that could change the analysis."],
                ["Records that could help", evidence.slice(0, 4), "Documents or other evidence worth locating."],
              ].map(([title, items, description]) => (
                <div key={title as string} className="rounded-2xl border border-border bg-card p-5">
                  <p className="text-sm font-semibold text-foreground">{title as string}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{description as string}</p>
                  <div className="mt-4"><EmptyAwareList items={items as string[]} fallback="Nothing specific identified yet." /></div>
                </div>
              ))}
            </div>
          </section>

          {/* Findings */}
          <section id="analyzer-2" className="scroll-mt-6 px-5 py-8 sm:px-8 sm:py-10">
            <SectionLabel>02 · Analysis & legal grounding</SectionLabel>
            <h3 className="mt-2 font-serif text-2xl text-foreground sm:text-3xl">Key findings & issues to examine</h3>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
              Each item below is a research lead. Expand it to see why it was flagged, what would need to be established, and what evidence could help.
            </p>
            <div className="mt-6 space-y-4">
              {findings.length ? findings.slice(0, 8).map((f, index) => (
                <details key={f.id} className="group overflow-hidden rounded-2xl border border-border bg-card">
                  <summary className="flex cursor-pointer list-none items-start gap-4 p-5 [&::-webkit-details-marker]:hidden sm:p-6">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary text-sm font-semibold">{index + 1}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-base font-semibold text-foreground">{f.title}</span>
                      <span className="mt-1 block text-sm leading-6 text-muted-foreground">{f.whyFlagged}</span>
                    </span>
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
                  </summary>
                  <div className="border-t border-border px-5 pb-6 pt-5 sm:px-6">
                    <div className="grid gap-4 lg:grid-cols-2">
                      <div className="rounded-xl border border-border bg-background p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Issue to examine</p>
                        <p className="mt-2 text-sm leading-6 text-foreground/85">{f.whyFlagged}</p>
                      </div>
                      <div className="rounded-xl border border-border bg-background p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Current legal framework</p>
                        <p className="mt-2 text-sm leading-6 text-foreground/85">{f.legalFramework.length ? f.legalFramework.slice(0, 4).join(" · ") : "Specific legal authority still needs verification."}</p>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 lg:grid-cols-2">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Facts or conditions that need to be established</p>
                        <div className="mt-3"><EmptyAwareList items={f.whatWouldNeedToBeTrue.slice(0, 8)} fallback="No additional conditions were identified." /></div>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Facts still missing</p>
                        <div className="mt-3"><EmptyAwareList items={f.missingFacts.slice(0, 8)} fallback="No additional missing facts were identified." /></div>
                      </div>
                    </div>

                    <div className="mt-4 rounded-xl border border-border bg-muted/30 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Evidence that could test the issue</p>
                      <div className="mt-3"><EmptyAwareList items={f.evidenceToLookFor.slice(0, 10)} fallback="No specific evidence was identified yet." /></div>
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-xl bg-muted/30 p-4">
                        <p className="text-xs font-semibold text-foreground">Practical next step</p>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">{f.nextStep}</p>
                      </div>
                      <div className="rounded-xl bg-muted/30 p-4">
                        <p className="text-xs font-semibold text-foreground">What could change the analysis</p>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">New records, corrected dates or identities, additional context, or a different controlling rule could change whether this issue remains relevant.</p>
                      </div>
                    </div>
                  </div>
                </details>
              )) : (
                <div className="rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">No specific research leads were generated from the current information.</div>
              )}
            </div>

            <div className="mt-8 rounded-2xl border border-border bg-card p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <FileSearch className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">Legal terms → plain language</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    The analyzer explains the terminology used in a research lead. This is not a quotation from a notice, statute, court order, or other source unless that source text was actually provided.
                  </p>
                  {findings[0] && (
                    <div className="mt-4 grid gap-3 lg:grid-cols-2">
                      <div className="rounded-xl border border-border bg-background p-4"><p className="text-xs font-semibold text-muted-foreground">Term or framework</p><p className="mt-2 text-sm font-medium text-foreground">{findings[0].legalFramework.slice(0, 3).join(" · ") || findings[0].title}</p></div>
                      <div className="rounded-xl border border-border bg-background p-4"><p className="text-xs font-semibold text-muted-foreground">Plain-language meaning</p><p className="mt-2 text-sm leading-6 text-foreground/80">{findings[0].whyFlagged}</p></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Authority */}
          <section id="analyzer-3" className="scroll-mt-6 px-5 py-8 sm:px-8 sm:py-10">
            <SectionLabel>03 · Legal grounding</SectionLabel>
            <h3 className="mt-2 font-serif text-2xl text-foreground sm:text-3xl">Research authority before drawing conclusions</h3>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
              These authorities are research anchors, not conclusions. Confirm the controlling text, effective date, jurisdiction, and procedural context before relying on any authority.
            </p>

            <div className="mt-6 space-y-4">
              {lawModules.length > 0 ? lawModules.slice(0, 10).map(module => (
                <article key={module.id} className="overflow-hidden rounded-2xl border border-border bg-card">
                  <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                        <Scale className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">Research authority</p>
                        <h4 className="mt-1 text-base font-semibold text-foreground">{module.title}</h4>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full border border-border bg-background px-3 py-1 text-[11px] font-medium text-muted-foreground">Verify before relying</span>
                  </div>

                  <div className="p-5 sm:p-6">
                    <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-primary">What it covers</p>
                        <p className="mt-2 text-sm leading-6 text-foreground/85">{module.definition}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Requirements / elements to examine</p>
                        <div className="mt-2">
                          <EmptyAwareList items={module.elements.slice(0, 6)} fallback="No elements were returned for this authority module." />
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 rounded-xl border border-border bg-muted/30 p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary">Evidence that could map to it</p>
                      <div className="mt-3">
                        <EmptyAwareList items={module.evidenceExamples.slice(0, 8)} fallback="No evidence examples were returned for this authority module." />
                      </div>
                    </div>
                  </div>
                </article>
              )) : (
                <div className="rounded-2xl border border-dashed border-border p-6 text-sm leading-6 text-muted-foreground">
                  No specific authority module was selected. Use the research leads above to identify the controlling authority for the jurisdiction, date, and proceeding involved.
                </div>
              )}
            </div>

            {authorities.length > 0 && (
              <div className="mt-6 rounded-2xl border border-border bg-muted/20 p-5 sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">Reference anchors returned by the analysis</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  These labels can point you toward further research; they are not substitutes for checking the underlying source.
                </p>
                <div className="mt-4"><EmptyAwareList items={authorities} fallback="No reference anchors returned." /></div>
              </div>
            )}

            <div className="mt-6 rounded-2xl border border-border bg-background p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <CircleHelp className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Authority check</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    A research lead may point to an authority without establishing that every element applies. Check the actual statute, regulation, case, order, policy, or agency source and compare it with the facts and records in your case.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Action plan */}
          <section id="analyzer-4" className="scroll-mt-6 px-5 py-8 sm:px-8 sm:py-10">
            <SectionLabel>04 · Guidance & action plan</SectionLabel>
            <h3 className="mt-2 font-serif text-2xl text-foreground sm:text-3xl">What you can work on next</h3>

            <div className="mt-6 rounded-2xl border border-border bg-card p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <Clock3 className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">Key deadlines</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    No verified deadline is identified by this analyzer output. Do not rely on an inferred deadline; verify dates from the actual notice, court order, statute, agency rule, or other controlling source.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              {actions.length ? actions.map((action, i) => (
                <div key={`${action.title}-${i}`} className="flex gap-4 rounded-2xl border border-border bg-card p-5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{i + 1}</span>
                  <div><p className="font-semibold text-foreground">{action.title}</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{action.description}</p></div>
                </div>
              )) : (
                <EmptyAwareList items={[]} fallback="No prioritized action was generated yet." />
              )}
            </div>

            <div className="mt-8">
              <p className="text-sm font-semibold text-foreground">Escalation roadmap</p>
              <div className="mt-4 grid gap-2 md:grid-cols-6">
                {["Understand", "Document", "Communicate", "Formalize", "Oversight", "Legal review"].map((step, i) => (
                  <div key={step} className="rounded-xl border border-border bg-card p-3">
                    <span className="text-[10px] font-semibold text-primary">0{i + 1}</span>
                    <p className="mt-1 text-xs font-semibold text-foreground">{step}</p>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs leading-5 text-muted-foreground">The roadmap shows common process stages, not a recommendation that you take every stage.</p>
            </div>
          </section>
        </div>

        {/* Tools & safeguards */}
        <section className="border-t border-border bg-muted/20 px-5 py-8 sm:px-8 sm:py-10">
          <SectionLabel>Tools, support & safeguards</SectionLabel>
          <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <button type="button" onClick={onAddToCase} className="rounded-2xl border border-border bg-card p-4 text-left transition hover:border-primary/40 hover:shadow-sm">
              <FolderOpen className="h-5 w-5 text-primary" /><p className="mt-3 text-sm font-semibold text-foreground">Add to Case Builder</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Turn this analysis into an organized case record.</p>
            </button>
            <a href="/dashboard" className="rounded-2xl border border-border bg-card p-4 transition hover:border-primary/40 hover:shadow-sm">
              <ListChecks className="h-5 w-5 text-primary" /><p className="mt-3 text-sm font-semibold text-foreground">Open Case Workspace</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Review timeline, evidence, issues, and requests.</p>
            </a>
            <a href="/find-help" className="rounded-2xl border border-border bg-card p-4 transition hover:border-primary/40 hover:shadow-sm">
              <ShieldCheck className="h-5 w-5 text-primary" /><p className="mt-3 text-sm font-semibold text-foreground">Find legal help</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Explore attorney and lower-cost support pathways.</p>
            </a>
            <a href="/education-library" className="rounded-2xl border border-border bg-card p-4 transition hover:border-primary/40 hover:shadow-sm">
              <Search className="h-5 w-5 text-primary" /><p className="mt-3 text-sm font-semibold text-foreground">Research the topic</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Continue learning before deciding what to do.</p>
            </a>
          </div>
          <div className="mt-8 border-t border-border pt-6">
            <p className="text-xs leading-5 text-muted-foreground">
              Decoded Justice provides educational information and organizational tools, not legal advice. No attorney-client relationship is created. Verify laws, deadlines, procedures, and agency requirements against authoritative sources and consider qualified legal assistance for decisions specific to your situation.
            </p>
            <a href="mailto:feedback@decodedjustice.org" className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">Report an issue <ExternalLink className="h-3 w-3" /></a>
          </div>
        </section>

        <div className="border-t border-border bg-card px-5 py-7 sm:px-8 print:hidden">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-base font-semibold text-foreground">Keep building instead of starting over</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">Your answers, research leads, and records can become an organized case workspace.</p>
            </div>
            <Button onClick={onAddToCase} className="gap-2 shrink-0"><FolderOpen className="h-4 w-4" />Open Case Workspace</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
