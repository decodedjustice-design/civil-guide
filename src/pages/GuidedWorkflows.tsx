import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, BookOpen, CheckCircle2, ClipboardCheck, FileSearch,
  FileText, Gavel, HelpCircle, LibraryBig, RotateCcw, Scale, Shield,
  Sparkles, Users, Accessibility, Building2
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type Choice = { label: string; value: string };
type Step = { id: string; question: string; helper?: string; choices: Choice[] };
type Workflow = {
  id: string;
  title: string;
  description: string;
  icon: typeof FileText;
  steps: Step[];
  actions: (answers: Record<string, string>) => Action[];
};

type Action = {
  title: string;
  description: string;
  href: string;
  label: string;
  icon: typeof FileText;
};

const workflows: Workflow[] = [
  {
    id: "notice",
    title: "I received a notice",
    description: "Figure out what the notice is, what date matters, and what to preserve before taking action.",
    icon: FileText,
    steps: [
      { id: "notice_type", question: "What kind of notice is it?", choices: [
        { label: "Housing / landlord", value: "housing" },
        { label: "Government benefits or agency", value: "benefits" },
        { label: "Court or legal process", value: "court" },
        { label: "School, employer, or other organization", value: "other" },
        { label: "I am not sure", value: "unknown" },
      ]},
      { id: "notice_date", question: "Does the notice give you a deadline or hearing date?", choices: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
        { label: "I cannot tell", value: "unknown" },
      ]},
      { id: "notice_copy", question: "Do you have a copy of the notice?", choices: [
        { label: "Yes, I have it", value: "yes" },
        { label: "I have a photo or scan", value: "photo" },
        { label: "No", value: "no" },
      ]},
    ],
    actions: (a) => [
      { title: "Decode the notice", description: "Paste or upload confusing legal language and work through it in plain language.", href: "/legal-decoder", label: "Open Legal Decoder", icon: FileSearch },
      { title: "Prepare a checklist", description: "Track the notice, source document, deadline, questions, and next steps in your case.", href: "/cases", label: "Open Cases", icon: ClipboardCheck },
      ...(a.notice_type === "court" ? [{ title: "Court preparation", description: "Use the general court-preparation checklist and verify requirements from the court.", href: "/cases", label: "Open Case Workspace", icon: Gavel }] : []),
      { title: "Learn the underlying topic", description: "Move from the notice to plain-language education and primary-source research.", href: "/education-library", label: "Open Knowledge Center", icon: BookOpen },
    ],
  },
  {
    id: "decision",
    title: "Someone made a decision about me",
    description: "Separate the decision itself from the notice, reasons, review process, and records behind it.",
    icon: Building2,
    steps: [
      { id: "decision_maker", question: "Who made the decision?", choices: [
        { label: "Government agency", value: "government" },
        { label: "Housing provider", value: "housing" },
        { label: "School or education provider", value: "school" },
        { label: "Employer", value: "employer" },
        { label: "Other organization", value: "other" },
      ]},
      { id: "written", question: "Do you have the decision in writing?", choices: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
        { label: "I have a message or partial record", value: "partial" },
      ]},
      { id: "review", question: "Were you told about a review, appeal, hearing, or reconsideration process?", choices: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
        { label: "I am not sure", value: "unknown" },
      ]},
    ],
    actions: () => [
      { title: "Build the record", description: "Organize the decision, supporting documents, chronology, and communications in a case.", href: "/cases", label: "Open Cases", icon: ClipboardCheck },
      { title: "Find missing records", description: "Identify records you may need and turn gaps into trackable requests.", href: "/cases", label: "Open Case Workspace", icon: LibraryBig },
      { title: "Understand the process", description: "Start with plain-language guidance before researching the governing authority.", href: "/education-library", label: "Open Knowledge Center", icon: BookOpen },
    ],
  },
  {
    id: "records",
    title: "I need records",
    description: "Identify the records, likely holder, date range, and next action without guessing who should receive a request.",
    icon: LibraryBig,
    steps: [
      { id: "record_type", question: "What records are you looking for?", choices: [
        { label: "Government / public records", value: "public" },
        { label: "My agency or case file", value: "agency" },
        { label: "Court records", value: "court" },
        { label: "Medical or education records", value: "personal" },
        { label: "I am not sure", value: "unknown" },
      ]},
      { id: "holder", question: "Do you know who likely holds the records?", choices: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
        { label: "I know the agency but not the records office", value: "partial" },
      ]},
      { id: "range", question: "Can you identify a date range or event that narrows the search?", choices: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
      ]},
    ],
    actions: (a) => [
      { title: "Public Request Rights", description: "Learn how Washington public-records and federal FOIA concepts work before sending a request.", href: "/public-request-rights", label: "Review Request Rights", icon: Scale },
      { title: "Track the request", description: "Create a case record, record gap, request, and response trail instead of keeping it in a notes app.", href: "/cases", label: "Open Cases", icon: ClipboardCheck },
      ...(a.holder !== "yes" ? [{ title: "Research the record holder", description: "Use the Knowledge Center and official sources to identify the likely custodian before sending.", href: "/justice-research", label: "Open Research", icon: FileSearch }] : []),
    ],
  },
  {
    id: "investigation",
    title: "A government agency is investigating me",
    description: "Map the investigation, participants, notices, contacts, records, and unanswered questions.",
    icon: Shield,
    steps: [
      { id: "contact", question: "Have you been contacted directly by the agency?", choices: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
        { label: "I received a written notice only", value: "notice" },
      ]},
      { id: "meeting", question: "Is there an interview, meeting, hearing, or response date?", choices: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
        { label: "I cannot tell", value: "unknown" },
      ]},
      { id: "records", question: "Do you have records about the investigation?", choices: [
        { label: "Yes", value: "yes" },
        { label: "Some records", value: "partial" },
        { label: "No", value: "no" },
      ]},
    ],
    actions: () => [
      { title: "Create an investigation record", description: "Keep contacts, communications, events, documents, issues, and requests connected.", href: "/cases", label: "Open Cases", icon: ClipboardCheck },
      { title: "Prepare for the next contact", description: "Use the self-advocacy meeting checklist to organize questions, documents, and requested actions.", href: "/cases", label: "Open Case Workspace", icon: Users },
      { title: "Research the process", description: "Use topic guidance and primary-source research without treating the workflow as a legal conclusion.", href: "/education-library", label: "Open Knowledge Center", icon: BookOpen },
    ],
  },
  {
    id: "accommodation",
    title: "I need an accommodation",
    description: "Organize the request, supporting information, response, and follow-up while keeping the legal standard separate from your facts.",
    icon: Accessibility,
    steps: [
      { id: "setting", question: "Where do you need the accommodation?", choices: [
        { label: "Housing", value: "housing" },
        { label: "School", value: "school" },
        { label: "Work", value: "work" },
        { label: "Government service or program", value: "government" },
        { label: "Court or legal process", value: "court" },
      ]},
      { id: "requested", question: "Have you already made the request?", choices: [
        { label: "Yes, in writing", value: "written" },
        { label: "Yes, verbally", value: "verbal" },
        { label: "No", value: "no" },
      ]},
      { id: "response", question: "Have you received a response?", choices: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
        { label: "I received a response but do not understand it", value: "unclear" },
      ]},
    ],
    actions: () => [
      { title: "Learn the framework", description: "Review disability and access education before deciding what facts or documents are relevant.", href: "/education-library/topic/disability", label: "Open Disability Guide", icon: BookOpen },
      { title: "Organize the request", description: "Keep the request, response, supporting documents, communications, and next steps together.", href: "/cases", label: "Open Cases", icon: ClipboardCheck },
      { title: "Decode a response", description: "If the response uses legal or policy language, translate it into plain language first.", href: "/legal-decoder", label: "Open Legal Decoder", icon: FileSearch },
    ],
  },
  {
    id: "court",
    title: "I'm going to court",
    description: "Start with the case information, hearing, current order, filing requirement, and source for each deadline.",
    icon: Gavel,
    steps: [
      { id: "court_stage", question: "Where are you in the court process?", choices: [
        { label: "I have a hearing coming up", value: "hearing" },
        { label: "I need to file something", value: "filing" },
        { label: "I received an order or notice", value: "order" },
        { label: "I need to appeal or seek review", value: "appeal" },
        { label: "I am not sure", value: "unknown" },
      ]},
      { id: "case_number", question: "Do you have the case number and current court documents?", choices: [
        { label: "Yes", value: "yes" },
        { label: "Some of them", value: "partial" },
        { label: "No", value: "no" },
      ]},
      { id: "deadline", question: "Do you know the deadline or hearing date from an authoritative source?", choices: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
        { label: "I have a date but need to verify it", value: "verify" },
      ]},
    ],
    actions: () => [
      { title: "Court preparation checklist", description: "Use a structured preparation list while keeping court-specific requirements verified.", href: "/cases", label: "Open Case Workspace", icon: ClipboardCheck },
      { title: "Court and filing education", description: "Review general court terminology and filing concepts.", href: "/courts-filing-info", label: "Review Court Guide", icon: Gavel },
      { title: "Research the authority", description: "Find statutes, regulations, and decisions rather than relying on an AI-generated deadline.", href: "/justice-research", label: "Open Research", icon: Scale },
    ],
  },
  {
    id: "appeal",
    title: "I need to appeal",
    description: "Identify the decision, notice, review path, and deadline before treating an appeal as available.",
    icon: ArrowRight,
    steps: [
      { id: "decision_source", question: "What are you trying to challenge?", choices: [
        { label: "Government or benefits decision", value: "government" },
        { label: "Housing decision", value: "housing" },
        { label: "School decision", value: "school" },
        { label: "Court decision or order", value: "court" },
        { label: "Other", value: "other" },
      ]},
      { id: "notice", question: "Do you have the decision or notice that explains review rights?", choices: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
        { label: "I have a partial copy", value: "partial" },
      ]},
      { id: "deadline", question: "Is there a stated review or appeal deadline?", choices: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
        { label: "I need to verify it", value: "verify" },
      ]},
    ],
    actions: () => [
      { title: "Preserve the decision record", description: "Keep the decision, notice, reasons, communications, and relevant events together.", href: "/cases", label: "Open Cases", icon: ClipboardCheck },
      { title: "Research the review path", description: "Use official sources to verify whether review is available and which procedure applies.", href: "/justice-research", label: "Open Research", icon: Scale },
      { title: "Decode the notice", description: "Translate the notice into plain language before working from it.", href: "/legal-decoder", label: "Open Legal Decoder", icon: FileSearch },
    ],
  },
  {
    id: "understand",
    title: "I want to understand the law",
    description: "Start with a plain-language explanation, then move to the primary source and research questions.",
    icon: Scale,
    steps: [
      { id: "topic", question: "What area are you trying to understand?", choices: [
        { label: "Housing", value: "housing" },
        { label: "Family / child welfare", value: "family" },
        { label: "Police / government", value: "government" },
        { label: "Disability / access", value: "disability" },
        { label: "Courts / procedure", value: "courts" },
        { label: "Benefits / education", value: "benefits" },
      ]},
      { id: "source", question: "What are you working from?", choices: [
        { label: "A notice or letter", value: "notice" },
        { label: "A court order", value: "order" },
        { label: "A statute or regulation", value: "law" },
        { label: "A policy or agency document", value: "policy" },
        { label: "My own situation", value: "facts" },
      ]},
      { id: "goal", question: "What do you need next?", choices: [
        { label: "Understand the words", value: "decode" },
        { label: "Find the source", value: "source" },
        { label: "Organize my facts", value: "case" },
        { label: "Prepare questions", value: "questions" },
      ]},
    ],
    actions: (a) => [
      ...(a.goal === "decode" ? [{ title: "Legal Decoder", description: "Turn dense language into a plain-language explanation.", href: "/legal-decoder", label: "Open Legal Decoder", icon: FileSearch }] : []),
      ...(a.goal === "source" ? [{ title: "Justice Research", description: "Search the curated authority library and open source documents.", href: "/justice-research", label: "Open Research", icon: Scale }] : []),
      ...(a.goal === "case" ? [{ title: "Case Builder", description: "Turn your facts into an organized case record.", href: "/case-builder", label: "Open Case Builder", icon: ClipboardCheck }] : []),
      ...(a.goal === "questions" ? [{ title: "Knowledge Center", description: "Use the relevant topic guide to develop research questions.", href: "/education-library", label: "Open Knowledge Center", icon: BookOpen }] : []),
    ],
  },
];

const fallback = workflows[0];

export default function GuidedWorkflows() {
  const [params, setParams] = useSearchParams();
  const initial = params.get("type") || "notice";
  const [workflowId, setWorkflowId] = useState(workflows.some((w) => w.id === initial) ? initial : fallback.id);
  const workflow = workflows.find((w) => w.id === workflowId) ?? fallback;
  const [stepIndex, setStepIndex] = useState(-1);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const progress = stepIndex < 0 ? 0 : Math.round(((stepIndex + 1) / workflow.steps.length) * 100);
  const currentStep = workflow.steps[stepIndex];
  const finished = stepIndex >= workflow.steps.length;
  const actions = useMemo(() => workflow.actions(answers), [workflow, answers]);

  const chooseWorkflow = (id: string) => {
    setWorkflowId(id);
    setAnswers({});
    setStepIndex(-1);
    setParams({ type: id });
  };

  const chooseAnswer = (value: string) => {
    const next = { ...answers, [currentStep.id]: value };
    setAnswers(next);
    setStepIndex((valueIndex) => valueIndex + 1);
  };

  const reset = () => {
    setAnswers({});
    setStepIndex(-1);
  };

  return (
    <Layout>
      <main className="min-h-screen bg-background">
        <section className="border-b border-border/60">
          <div className="container max-w-6xl py-12 lg:py-16">
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">Guided self-advocacy</p>
              <h1 className="mt-3 font-serif text-4xl tracking-tight md:text-5xl">Start with what is happening.</h1>
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                Answer a few focused questions. Decoded Justice will route you toward the existing tools, education, records, and case-workspace actions that fit your situation.
              </p>
              <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="h-4 w-4 text-primary" />
                This is navigation and education—not a legal conclusion or prediction about your case.
              </div>
            </div>
          </div>
        </section>

        <section className="container max-w-6xl py-8">
          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            <aside className="space-y-2">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Choose a starting point</p>
              {workflows.map((item) => {
                const Icon = item.icon;
                const selected = item.id === workflow.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => chooseWorkflow(item.id)}
                    className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${selected ? "border-primary/40 bg-primary/5" : "border-border/60 hover:bg-muted/40"}`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="text-sm">{item.title}</span>
                  </button>
                );
              })}
            </aside>

            <div className="min-w-0">
              <Card className="overflow-hidden">
                <CardHeader className="border-b border-border/60">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl">{workflow.title}</CardTitle>
                      <CardDescription className="mt-2 max-w-2xl leading-6">{workflow.description}</CardDescription>
                    </div>
                    {stepIndex >= 0 && !finished && (
                      <Button variant="ghost" size="sm" onClick={reset}>
                        <RotateCcw className="mr-1.5 h-4 w-4" /> Restart
                      </Button>
                    )}
                  </div>
                  {stepIndex >= 0 && !finished && <Progress className="mt-5" value={progress} aria-label={`${progress}% complete`} />}
                </CardHeader>

                <CardContent className="p-6 md:p-8">
                  {stepIndex < 0 && (
                    <div className="max-w-2xl">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <HelpCircle className="h-6 w-6" />
                      </div>
                      <h2 className="mt-5 text-xl font-semibold">We’ll narrow this down together.</h2>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        You do not need to know the legal terminology. The questions are designed to identify the practical next step and what information may be worth preserving.
                      </p>
                      <Button className="mt-6" onClick={() => setStepIndex(0)}>
                        Start workflow <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  )}

                  {stepIndex >= 0 && !finished && currentStep && (
                    <div className="max-w-2xl">
                      <p className="text-xs font-medium text-muted-foreground">Question {stepIndex + 1} of {workflow.steps.length}</p>
                      <h2 className="mt-3 text-2xl font-semibold tracking-tight">{currentStep.question}</h2>
                      {currentStep.helper && <p className="mt-2 text-sm text-muted-foreground">{currentStep.helper}</p>}
                      <div className="mt-6 grid gap-3">
                        {currentStep.choices.map((choice) => (
                          <button
                            key={choice.value}
                            onClick={() => chooseAnswer(choice.value)}
                            className="group flex items-center justify-between rounded-xl border border-border/70 p-4 text-left transition hover:border-primary/40 hover:bg-primary/5"
                          >
                            <span className="text-sm font-medium">{choice.label}</span>
                            <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {finished && (
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold">Your next-step map</h2>
                          <p className="text-sm text-muted-foreground">Based on the answers you gave, these tools are relevant starting points.</p>
                        </div>
                      </div>

                      <div className="mt-6 grid gap-4 md:grid-cols-2">
                        {actions.map((action) => {
                          const Icon = action.icon;
                          return (
                            <Card key={action.title} className="border-border/60">
                              <CardContent className="p-5">
                                <Icon className="h-5 w-5 text-primary" />
                                <h3 className="mt-4 font-semibold">{action.title}</h3>
                                <p className="mt-2 text-sm leading-6 text-muted-foreground">{action.description}</p>
                                <Button asChild variant="outline" className="mt-4">
                                  <Link to={action.href}>{action.label} <ArrowRight className="ml-2 h-4 w-4" /></Link>
                                </Button>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>

                      <div className="mt-8 rounded-xl border border-border/60 bg-muted/20 p-5">
                        <p className="text-sm font-medium">Preserve the source material</p>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          Keep the original notice, order, message, record, or other source. The workflow does not establish that a legal violation occurred; it helps you organize what to investigate next.
                        </p>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        <Button onClick={reset} variant="ghost"><RotateCcw className="mr-1.5 h-4 w-4" /> Start over</Button>
                        <Button asChild variant="ghost"><Link to="/education-library"><BookOpen className="mr-1.5 h-4 w-4" /> Browse Knowledge Center</Link></Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
