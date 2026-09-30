import type { ReactNode } from "react";
import { ArrowRight, CheckCircle2, CircleHelp, FileSearch, FolderOpen, ListChecks, Scale, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AnalyzerResultsAI, PotentialViolation } from "@/hooks/useAnalyzerResultsAI";
import type { LawModule } from "@/lib/law/issueLibrary";

interface AnalyzerEndSummaryProps {
  aiResults: AnalyzerResultsAI;
  findings: PotentialViolation[];
  lawModules: LawModule[];
  policeMissingFacts: string[];
  onAddToCase: () => void;
}

const SectionLabel = ({ children }: { children: ReactNode }) => (
  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">{children}</p>
);

const EmptyAwareList = ({ items, fallback }: { items: string[]; fallback: string }) => (
  items.length ? (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={`${item}-${i}`} className="flex gap-3 text-sm leading-6 text-foreground/80">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  ) : <p className="text-sm leading-6 text-muted-foreground">{fallback}</p>
);

export function AnalyzerEndSummary({ aiResults, findings, lawModules, policeMissingFacts, onAddToCase }: AnalyzerEndSummaryProps) {
  const evidence = Array.from(new Set(findings.flatMap(f => f.evidenceToLookFor))).slice(0, 12);
  const missing = Array.from(new Set([
    ...findings.flatMap(f => f.missingFacts ?? []),
    ...findings.flatMap(f => f.whatWouldNeedToBeTrue ?? []),
    ...policeMissingFacts,
  ])).slice(0, 14);
  const actions = aiResults.priorityActions.slice(0, 6);
  const authorities = aiResults.referenceAnchors.slice(0, 10);

  return (
    <section className="mt-10 mb-10" aria-label="Analyzer case map">
      <div className="rounded-[28px] border border-border bg-card shadow-sm overflow-hidden">
        <div className="border-b border-border bg-muted/30 px-5 py-7 sm:px-8">
          <SectionLabel>Your results, organized</SectionLabel>
          <h2 className="mt-2 font-serif text-3xl leading-tight text-foreground sm:text-4xl">
            Your situation at a glance
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
            Instead of making you read a long list of findings, we’ve organized the analysis into five questions:
            what we heard, what it may raise, what is still unknown, what records could help, and what you can do next.
          </p>
        </div>

        <div className="grid border-b border-border sm:grid-cols-4">
          {[
            ["1", "What we heard", "Your information"],
            ["2", "What it raises", "Research leads"],
            ["3", "What is missing", "Open questions"],
            ["4", "What to do next", "Practical steps"],
          ].map(([n, title, sub]) => (
            <a key={n} href={`#analyzer-${n}`} className="border-b border-border p-4 transition-colors hover:bg-muted/40 sm:border-b-0 sm:border-r last:border-r-0">
              <span className="text-xs font-semibold text-primary">{n}</span>
              <p className="mt-1 text-sm font-semibold text-foreground">{title}</p>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </a>
          ))}
        </div>

        <div className="divide-y divide-border">
          <div id="analyzer-1" className="p-5 sm:p-8 scroll-mt-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <SectionLabel>01 · What we heard</SectionLabel>
                <h3 className="mt-1 text-xl font-semibold text-foreground">How this system appears to work</h3>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">{aiResults.systemIdentification}</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {aiResults.usualProcess.slice(0, 6).map((step, i) => (
                    <div key={`${step}-${i}`} className="rounded-2xl border border-border bg-background p-4">
                      <div className="flex gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">{i + 1}</span>
                        <p className="text-sm leading-6 text-foreground/80">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div id="analyzer-2" className="p-5 sm:p-8 scroll-mt-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Scale className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <SectionLabel>02 · What it raises</SectionLabel>
                <h3 className="mt-1 text-xl font-semibold text-foreground">Questions worth investigating</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  These are research leads, not findings that a violation occurred. The underlying record still has to be examined.
                </p>
                <div className="mt-5 space-y-3">
                  {findings.length ? findings.slice(0, 8).map((f) => (
                    <details key={f.id} className="group rounded-2xl border border-border bg-background">
                      <summary className="flex cursor-pointer list-none items-center gap-3 p-4 [&::-webkit-details-marker]:hidden">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground"><CircleHelp className="h-4 w-4" /></span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold text-foreground">{f.title}</span>
                          <span className="mt-0.5 block text-xs text-muted-foreground">Why it was flagged: {f.whyFlagged}</span>
                        </span>
                        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
                      </summary>
                      <div className="border-t border-border px-4 pb-5 pt-4 sm:px-5">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <p className="text-xs font-semibold text-foreground">Evidence that could help</p>
                            <EmptyAwareList items={f.evidenceToLookFor.slice(0, 8)} fallback="No specific evidence was identified." />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-foreground">What still needs to be established</p>
                            <EmptyAwareList items={f.whatWouldNeedToBeTrue.slice(0, 8)} fallback="No additional condition was identified." />
                          </div>
                        </div>
                        <div className="mt-4 rounded-xl bg-muted/40 p-4">
                          <p className="text-xs font-semibold text-foreground">Suggested next step</p>
                          <p className="mt-1 text-sm leading-6 text-muted-foreground">{f.nextStep}</p>
                        </div>
                      </div>
                    </details>
                  )) : (
                    <div className="rounded-2xl border border-dashed border-border p-5 text-sm text-muted-foreground">
                      No specific research leads were generated from the information provided.
                    </div>
                  )}
                </div>
                {lawModules.length > 0 && (
                  <div className="mt-6 rounded-2xl border border-border bg-muted/20 p-5">
                    <p className="text-sm font-semibold text-foreground">Related legal topics to verify</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {lawModules.slice(0, 10).map(m => <span key={m.id} className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-foreground">{m.title}</span>)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div id="analyzer-3" className="p-5 sm:p-8 scroll-mt-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <SectionLabel>03 · What is missing</SectionLabel>
                <h3 className="mt-1 text-xl font-semibold text-foreground">Facts and records that could change the picture</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  A missing item is not evidence that something happened. It simply identifies information that would help verify, contradict, or better understand the account.
                </p>
                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <div className="flex items-center gap-2"><CircleHelp className="h-4 w-4 text-primary" /><p className="text-sm font-semibold text-foreground">Open questions</p></div>
                    <div className="mt-4"><EmptyAwareList items={missing} fallback="No major missing facts were identified from the current answers." /></div>
                  </div>
                  <div className="rounded-2xl border border-border bg-background p-5">
                    <div className="flex items-center gap-2"><FileSearch className="h-4 w-4 text-primary" /><p className="text-sm font-semibold text-foreground">Records worth locating</p></div>
                    <div className="mt-4"><EmptyAwareList items={evidence} fallback="No specific records were identified yet." /></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div id="analyzer-4" className="p-5 sm:p-8 scroll-mt-6">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <ListChecks className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <SectionLabel>04 · What to do next</SectionLabel>
                <h3 className="mt-1 text-xl font-semibold text-foreground">A practical work plan</h3>
                <div className="mt-5 space-y-3">
                  {actions.map((action, i) => (
                    <div key={`${action.title}-${i}`} className="flex gap-4 rounded-2xl border border-border bg-background p-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">{i + 1}</span>
                      <div><p className="text-sm font-semibold text-foreground">{action.title}</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{action.description}</p></div>
                    </div>
                  ))}
                </div>
                {authorities.length > 0 && (
                  <details className="mt-5 rounded-2xl border border-border bg-muted/20 group">
                    <summary className="flex cursor-pointer list-none items-center gap-2 p-4 text-sm font-semibold text-foreground [&::-webkit-details-marker]:hidden">
                      <Scale className="h-4 w-4 text-primary" /> Reference authorities to verify
                      <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground transition-transform group-open:rotate-90" />
                    </summary>
                    <div className="border-t border-border p-4"><EmptyAwareList items={authorities} fallback="No reference anchors were returned." /></div>
                  </details>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border bg-muted/30 px-5 py-7 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-base font-semibold text-foreground">Keep building instead of starting over</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">Your answers, questions, research leads, and records can become an organized case workspace.</p>
            </div>
            <Button onClick={onAddToCase} className="gap-2 shrink-0"><FolderOpen className="h-4 w-4" />Open Case Workspace</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
