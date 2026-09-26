import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useActiveCaseId, useCases } from "@/hooks/useCases";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { sanitizeSafetyLanguage } from "@/legal/applySafetyLanguage";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  FileSearch,
  Loader2,
  MessageCircleQuestion,
  MessageSquareText,
  Network,
  Pencil,
  Send,
  Sparkles,
  UserRound,
  Users,
  X,
} from "lucide-react";
import type {
  CaseSignals,
} from "./CaseSignalReview";

interface NarrativeCaseBuilderProps {
  onCaseReady?: (caseId: string) => void;
}

type SaveState = "saved" | "saving" | "idle" | "error";

interface ExtractedItem {
  key: string;
  label: string;
  detail?: string;
  href?: string;
}

const STORY_NOTE_TITLE = "Your Story";

function normalize(value: string | null | undefined) {
  return (value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

function deriveTitle(story: string) {
  const firstSentence = story.trim().split(/(?<=[.!?])\s+/)[0]?.trim();
  if (!firstSentence) return "Untitled case";
  return firstSentence.length > 72 ? `${firstSentence.slice(0, 69)}…` : firstSentence;
}

function safeDate(value?: string | null) {
  return value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
}

export function NarrativeCaseBuilder({ onCaseReady }: NarrativeCaseBuilderProps) {
  const { user } = useAuth();
  const { cases, createCase, updateCase } = useCases();
  const { activeId, select: selectActiveCase } = useActiveCaseId();
  const [caseId, setCaseId] = useState<string | null>(null);
  const [story, setStory] = useState("");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [isExtracting, setIsExtracting] = useState(false);
  const [lastAnalyzedLength, setLastAnalyzedLength] = useState(0);
  const [signals, setSignals] = useState<CaseSignals | null>(null);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [questionAnswer, setQuestionAnswer] = useState("");
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
  const [skippedQuestions, setSkippedQuestions] = useState<Set<string>>(new Set());
  const [isSavingAnswer, setIsSavingAnswer] = useState(false);
  const [caseCounts, setCaseCounts] = useState({ timeline: 0, people: 0, organizations: 0, issues: 0, communications: 0, evidence: 0, evidenceMentions: 0, recordGaps: 0 });
  const [error, setError] = useState<string | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const extractionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadOrCreateCase = useCallback(async () => {
    if (!user) return;

    let activeCaseId = activeId && cases.some((item) => item.id === activeId) ? activeId : null;

    if (!activeCaseId) {
      const created = await createCase.mutateAsync({
        title: "Untitled case",
        matter_type: "general",
        jurisdiction: "Washington",
      });
      activeCaseId = created.id;
    }

    setCaseId(activeCaseId);
    selectActiveCase(activeCaseId);
    onCaseReady?.(activeCaseId);

    const { data: storyNote, error: noteError } = await supabase
      .from("notes")
      .select("id,content")
      .eq("user_id", user.id)
      .eq("case_id", activeCaseId)
      .eq("title", STORY_NOTE_TITLE)
      .limit(1)
      .maybeSingle();

    if (noteError) throw noteError;
    setStory(storyNote?.content ?? "");
  }, [activeId, cases, createCase, onCaseReady, selectActiveCase, user]);

  useEffect(() => {
    loadOrCreateCase().catch((err) => {
      console.error("Case Builder initialization error:", err);
      setError("We couldn't open your case. Please refresh and try again.");
    });
  }, [loadOrCreateCase]);

  const persistStory = useCallback(async (nextStory: string) => {
    if (!user || !caseId) return;

    setSaveState("saving");

    try {
      const { data: existingNote, error: findError } = await supabase
        .from("notes")
        .select("id")
        .eq("user_id", user.id)
        .eq("case_id", caseId)
        .eq("title", STORY_NOTE_TITLE)
        .limit(1)
        .maybeSingle();

      if (findError) throw findError;

      if (existingNote) {
        const { error: updateError } = await supabase
          .from("notes")
          .update({ content: nextStory })
          .eq("id", existingNote.id)
          .eq("user_id", user.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase.from("notes").insert({
          user_id: user.id,
          case_id: caseId,
          title: STORY_NOTE_TITLE,
          content: nextStory,
        });

        if (insertError) throw insertError;
      }

      const title = deriveTitle(nextStory);
      await updateCase.mutateAsync({ id: caseId, title });

      setSaveState("saved");
    } catch (err) {
      console.error("Story save error:", err);
      setSaveState("error");
    }
  }, [caseId, updateCase, user]);

  const scheduleSave = useCallback((nextStory: string) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaveState("saving");
    saveTimer.current = setTimeout(() => {
      void persistStory(nextStory);
    }, 800);
  }, [persistStory]);

  const refreshCaseCounts = useCallback(async () => {
    if (!caseId) return;
    const tables = [
      ["events", "timeline"],
      ["people", "people"],
      ["organizations", "organizations"],
      ["issues", "issues"],
      ["communications", "communications"],
      ["documents", "evidence"],
      ["evidence_mentions", "evidenceMentions"],
      ["tasks", "recordGaps"],
    ] as const;

    const results = await Promise.all(
      tables.map(async ([table, key]) => {
        const query = (supabase as any).from(table).select("id", { count: "exact", head: true }).eq("case_id", caseId);
        if (table === "tasks") query.eq("task_type", "record_gap");
        const { count } = await query;
        return [key, count ?? 0] as const;
      })
    );

    setCaseCounts((current) => {
      const next = Object.fromEntries(results) as Partial<typeof current>;
      return {
        ...current,
        ...next,
        evidence: (next.evidence ?? current.evidence) + (next.evidenceMentions ?? current.evidenceMentions),
      };
    });
  }, [caseId]);

  useEffect(() => {
    void refreshCaseCounts();
  }, [refreshCaseCounts]);

  const applySignals = useCallback(async (nextSignals: CaseSignals) => {
    if (!user || !caseId) return;

    const [
      { data: existingPeople },
      { data: existingOrganizations },
      { data: existingIssues },
      { data: existingEvents },
    ] = await Promise.all([
      (supabase as any).from("people").select("id,display_name,role_label").eq("case_id", caseId),
      (supabase as any).from("organizations").select("id,name").eq("case_id", caseId),
      (supabase as any).from("issues").select("id,title").eq("case_id", caseId),
      (supabase as any).from("events").select("id,title,description,occurred_at,source_type,reviewed,reason").eq("case_id", caseId),
    ]);

    let people = existingPeople ?? [];
    let organizations = existingOrganizations ?? [];
    let issues = existingIssues ?? [];
    const events = existingEvents ?? [];

    for (const actor of nextSignals.actors) {
      if (!actor.name.trim()) continue;
      const exists = people.some((p) => normalize(p.display_name) === normalize(actor.name) && normalize(p.role_label) === normalize(actor.role));
      if (!exists) {
        await (supabase as any).from("people").insert({
          case_id: caseId,
          display_name: actor.name.trim(),
          role_label: actor.role,
          notes: "Extracted from the user's narrative. Review before relying on this entry.",
        });
      }
    }

    for (const actor of nextSignals.actors) {
      if (!actor.name.trim() || !["authority", "opposing_party"].includes(actor.role)) continue;
      const exists = organizations.some((o) => normalize(o.name) === normalize(actor.name));
      if (!exists) {
        await (supabase as any).from("organizations").insert({
          case_id: caseId,
          name: actor.name.trim(),
          org_type: actor.role === "authority" ? "Authority / agency" : "Opposing organization",
          notes: "Mentioned in the user's narrative. Confirm the organization's identity and role.",
        });
      }
    }

    for (const issue of nextSignals.issues) {
      if (!issue.label.trim()) continue;
      const exists = issues.some((i) => normalize(i.title) === normalize(issue.label));
      if (!exists) {
        await (supabase as any).from("issues").insert({
          case_id: caseId,
          title: issue.label.trim(),
          category: issue.id,
          description: issue.reason,
          classification: "unknown",
          status: "open",
          source: "Case Signal Engine",
          origin: "narrative",
          supporting_notes: "AI-organized possibility from the user's narrative. Review and edit before treating it as a case fact.",
        });
      }
    }

    for (const event of nextSignals.timeline_suggestions) {
      const eventDate = safeDate(event.iso_date);
      const title = event.title.trim();
      if (!title) continue;

      // Reconcile an existing narrative-derived event by title instead of
      // inserting another row when the user edits its date or description.
      // Only unreviewed narrative-derived rows are eligible for automatic updates.
      const existingNarrativeEvent = events.find(
        (e) =>
          normalize(e.title) === normalize(title) &&
          e.source_type === "user_narrative" &&
          e.reviewed === false
      );

      if (existingNarrativeEvent) {
        await (supabase as any)
          .from("events")
          .update({
            description: event.description,
            occurred_at: eventDate,
            reason: event.approximate_date,
          })
          .eq("id", existingNarrativeEvent.id)
          .eq("case_id", caseId);
      } else {
        const duplicate = events.some(
          (e) =>
            normalize(e.title) === normalize(title) &&
            (eventDate ? e.occurred_at === eventDate : !e.occurred_at)
        );

        if (!duplicate) {
          await (supabase as any).from("events").insert({
            case_id: caseId,
            title,
            description: event.description,
            occurred_at: eventDate,
            classification: "unknown",
            category: "narrative",
            importance: "Medium",
            source_type: "user_narrative",
            reviewed: false,
            disputed: false,
            reason: event.approximate_date,
          });
        }
      }
    }

    // Refresh canonical actors and issues after inserts so newly extracted records
    // can be linked to communications, record gaps, and evidence mentions in this pass.
    const [
      { data: refreshedPeople },
      { data: refreshedOrganizations },
      { data: refreshedIssues },
    ] = await Promise.all([
      (supabase as any).from("people").select("id,display_name,role_label").eq("case_id", caseId),
      (supabase as any).from("organizations").select("id,name").eq("case_id", caseId),
      (supabase as any).from("issues").select("id,title").eq("case_id", caseId),
    ]);

    people = refreshedPeople ?? people;
    organizations = refreshedOrganizations ?? organizations;
    issues = refreshedIssues ?? issues;

    const issueBySignalId = new Map<string, string>();
    for (const issue of nextSignals.issues) {
      const match = issues.find((i) => normalize(i.title) === normalize(issue.label));
      if (match) issueBySignalId.set(issue.id, match.id);
    }

    for (const gap of nextSignals.record_gaps ?? []) {
      if (!gap.title.trim()) continue;
      const { data: existingGap } = await (supabase as any)
        .from("tasks")
        .select("id")
        .eq("case_id", caseId)
        .eq("task_type", "record_gap")
        .eq("title", gap.title.trim())
        .limit(1)
        .maybeSingle();

      if (!existingGap) {
        await (supabase as any).from("tasks").insert({
          case_id: caseId,
          title: gap.title.trim(),
          description: gap.description,
          task_type: "record_gap",
          record_holder: gap.record_holder?.trim() || null,
          related_issue_id: issueBySignalId.get(gap.related_issue || "") ?? null,
          identified_at: new Date().toISOString().slice(0, 10),
          notes: "Identified from the user narrative. Confirm the gap before requesting the record.",
        });
      }
    }

    for (const communication of nextSignals.communications ?? []) {
      if (!communication.summary.trim()) continue;
      let personId: string | null = null;
      if (communication.person_name?.trim()) {
        const match = people.find((p) => normalize(p.display_name) === normalize(communication.person_name));
        personId = match?.id ?? null;
      }
      let organizationId: string | null = null;
      if (communication.organization_name?.trim()) {
        const match = organizations.find((o) => normalize(o.name) === normalize(communication.organization_name));
        organizationId = match?.id ?? null;
      }
      const occurredAt = safeDate(communication.iso_date);
      const subject = communication.subject?.trim() || "Communication";
      const duplicate = await (supabase as any)
        .from("communications")
        .select("id")
        .eq("case_id", caseId)
        .eq("method", communication.method.trim())
        .eq("subject", subject)
        .eq("summary", communication.summary.trim())
        .limit(1)
        .maybeSingle();
      if (!duplicate.data) {
        await (supabase as any).from("communications").insert({
          case_id: caseId,
          occurred_at: occurredAt ? occurredAt + "T00:00:00.000Z" : null,
          person_id: personId,
          organization_id: organizationId,
          method: communication.method.trim(),
          subject,
          summary: communication.summary.trim(),
          follow_up_required: communication.follow_up_required,
        });
      }
    }

    for (const mention of nextSignals.evidence_mentions ?? []) {
      if (!mention.type.trim() || !mention.description.trim()) continue;
      const duplicate = await (supabase as any)
        .from("evidence_mentions")
        .select("id")
        .eq("case_id", caseId)
        .eq("evidence_type", mention.type.trim())
        .eq("description", mention.description.trim())
        .limit(1)
        .maybeSingle();
      if (!duplicate.data) {
        await (supabase as any).from("evidence_mentions").insert({
          case_id: caseId,
          evidence_type: mention.type.trim(),
          description: mention.description.trim(),
          approximate_date: mention.approximate_date?.trim() || "unknown",
          related_issue_id: issueBySignalId.get(mention.related_issue || "") ?? null,
          priority: mention.priority,
          status: "mentioned",
          source_type: "user_narrative",
        });
      }
    }
  }, [caseId, user]);

  const extractStory = useCallback(async (force = false, narrativeOverride?: string) => {
    const narrativeToAnalyze = narrativeOverride ?? story;
    if (!user || !caseId || narrativeToAnalyze.trim().length < 40 || isExtracting) return;
    if (!force && narrativeToAnalyze.trim().length - lastAnalyzedLength < 60) return;

    setIsExtracting(true);
    setError(null);

    try {
      const { data, error: invokeError } = await supabase.functions.invoke("case-signal-engine", {
        body: {
          narrative: narrativeToAnalyze,
          issueType: "unknown",
          opposingParty: "",
        },
      });

      if (invokeError) throw invokeError;
      if (data?.error) throw new Error(data.error);

      const nextSignals = sanitizeSafetyLanguage(data as CaseSignals);
      setSignals(nextSignals);
      setLastAnalyzedLength(narrativeToAnalyze.trim().length);
      await applySignals(nextSignals);
      await refreshCaseCounts();
      setShowReview(true);
    } catch (err) {
      console.error("Narrative extraction error:", err);
      setError("We couldn't organize the latest part of your story yet. Your writing is still saved.");
    } finally {
      setIsExtracting(false);
    }
  }, [applySignals, caseId, isExtracting, lastAnalyzedLength, refreshCaseCounts, story, user]);

  const scheduleExtraction = useCallback(() => {
    if (extractionTimer.current) clearTimeout(extractionTimer.current);
    extractionTimer.current = setTimeout(() => {
      void extractStory();
    }, 2500);
  }, [extractStory]);

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      if (extractionTimer.current) clearTimeout(extractionTimer.current);
    };
  }, []);

  const handleStoryChange = (value: string) => {
    setStory(value);
    scheduleSave(value);
    if (value.trim().length >= 40) scheduleExtraction();
  };

  const dismissItem = (key: string) => {
    setDismissed((current) => new Set([...current, key]));
  };

  const clarifyingQuestions = useMemo(() => {
    if (!signals?.clarifying_questions) return [];
    return signals.clarifying_questions.filter(
      (question) => !answeredQuestions.has(question.id) && !skippedQuestions.has(question.id)
    );
  }, [answeredQuestions, signals, skippedQuestions]);

  const activeQuestion = clarifyingQuestions.find((question) => question.id === activeQuestionId) ?? null;

  const openQuestion = (questionId: string) => {
    setActiveQuestionId(questionId);
    setQuestionAnswer("");
  };

  const skipQuestion = (questionId: string) => {
    setSkippedQuestions((current) => new Set([...current, questionId]));
    setActiveQuestionId(null);
    setQuestionAnswer("");
  };

  const answerQuestion = async () => {
    if (!activeQuestion || !questionAnswer.trim() || isSavingAnswer) return;

    setIsSavingAnswer(true);
    setError(null);
    try {
      const clarification = `\n\nClarification added while building this case:\n${questionAnswer.trim()}`;
      const nextStory = `${story.trimEnd()}${clarification}`.trim();
      setStory(nextStory);
      await persistStory(nextStory);
      setAnsweredQuestions((current) => new Set([...current, activeQuestion.id]));
      setActiveQuestionId(null);
      setQuestionAnswer("");
      setLastAnalyzedLength(0);
      await extractStory(true, nextStory);
    } catch (err) {
      console.error("Question answer save error:", err);
      setError("We couldn't save that clarification yet. Your answer is still in this window; please try again.");
    } finally {
      setIsSavingAnswer(false);
    }
  };

  const extractedItems = useMemo<ExtractedItem[]>(() => {
    if (!signals) return [];

    const items: ExtractedItem[] = [];

    signals.actors.forEach((actor, index) => {
      items.push({
        key: `actor-${normalize(actor.name)}-${actor.role}`,
        label: actor.name,
        detail: actor.role.replace("_", " "),
        href: caseId ? `/cases/${caseId}/people` : undefined,
      });
    });

    signals.timeline_suggestions.forEach((event, index) => {
      items.push({
        key: `event-${normalize(event.title)}-${normalize(event.iso_date ?? event.approximate_date)}`,
        label: event.title,
        detail: event.approximate_date,
        href: caseId ? `/cases/${caseId}/timeline` : undefined,
      });
    });

    signals.issues.forEach((issue, index) => {
      items.push({
        key: `issue-${issue.id}`,
        label: issue.label,
        detail: "Possible issue area",
        href: caseId ? `/cases/${caseId}/issues` : undefined,
      });
    });

    (signals.evidence_mentions ?? []).forEach((mention, index) => {
      items.push({
        key: `evidence-${mention.id}`,
        label: mention.type,
        detail: mention.approximate_date || "Evidence mentioned",
        href: caseId ? `/cases/${caseId}/evidence` : undefined,
      });
    });

    (signals.record_gaps ?? []).forEach((gap, index) => {
      items.push({
        key: `gap-${gap.id}`,
        label: gap.title,
        detail: "Record gap",
        href: caseId ? `/cases/${caseId}/record-gaps` : undefined,
      });
    });

    return items.filter((item) => !dismissed.has(item.key));
  }, [dismissed, signals]);

  const stats = [
    { label: "Timeline", value: caseCounts.timeline, icon: Clock3, href: caseId ? `/cases/${caseId}/timeline` : "/cases" },
    { label: "People", value: caseCounts.people + caseCounts.organizations, icon: Users, href: caseId ? `/cases/${caseId}/people` : "/cases" },
    { label: "Issues to review", value: caseCounts.issues, icon: Network, href: caseId ? `/cases/${caseId}/issues` : "/cases" },
    { label: "Evidence", value: caseCounts.evidence, icon: FileSearch, href: caseId ? `/cases/${caseId}/evidence` : "/cases" },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] items-start pb-36">
      <div className="space-y-5">
        <Card className="overflow-hidden border-border/70 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <Badge variant="secondary" className="mb-3 gap-1">
                  <Sparkles className="w-3 h-3" />
                  Narrative-first
                </Badge>
                <CardTitle className="text-2xl font-serif">Tell your story</CardTitle>
                <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
                  Start anywhere. You do not need the legal terms, exact dates, names, or categories figured out first.
                  Your story saves automatically while we help organize it.
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                {saveState === "saving" && <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…</>}
                {saveState === "saved" && <><Check className="w-3.5 h-3.5" /> Saved</>}
                {saveState === "error" && <><X className="w-3.5 h-3.5 text-destructive" /> Save issue</>}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={story}
              onChange={(event) => handleStoryChange(event.target.value)}
              placeholder="Write what happened in your own words… You can start with the first thing you remember and keep adding details."
              className="min-h-[420px] resize-y text-base leading-7 border-0 bg-muted/20 focus-visible:ring-1 focus-visible:ring-primary/30 p-5"
              aria-label="Your story"
            />
            <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
              <p className="text-xs text-muted-foreground">
                {story.trim().length} characters · Your original story is preserved.
              </p>
              <Button
                variant="soft"
                size="sm"
                onClick={() => void extractStory(true)}
                disabled={isExtracting || story.trim().length < 40}
              >
                {isExtracting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                Organize what I wrote
              </Button>
            </div>
          </CardContent>
        </Card>

        {showReview && signals && extractedItems.length > 0 && (
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Here’s what I picked up
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    These are organized from your story. Review them in the linked section, or hide an item from this review without deleting it from your case.
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowReview(false)} aria-label="Close review">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {extractedItems.map((item) => (
                <div key={item.key} className="flex items-center gap-3 rounded-lg border border-border/60 p-3">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-foreground truncate">{item.label}</p>
                    <p className="text-xs text-muted-foreground capitalize">{item.detail}</p>
                  </div>
                  {item.href ? (
                    <Button asChild variant="ghost" size="sm" className="shrink-0">
                      <Link to={item.href}>
                        <Pencil className="w-3.5 h-3.5 mr-1.5" />
                        Review
                      </Link>
                    </Button>
                  ) : null}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => dismissItem(item.key)}
                    aria-label={`Hide ${item.label} from review`}
                    title="Hide from this review"
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="p-4">
              <p className="text-xs text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {isExtracting && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground px-1">
            <Loader2 className="w-4 h-4 animate-spin" />
            Organizing the latest part of your story…
          </div>
        )}
      </div>

      <aside className="lg:sticky lg:top-6 space-y-4">
        <Card className="border-border/70">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquareText className="w-4 h-4 text-primary" />
              Case so far
            </CardTitle>
            <p className="text-xs text-muted-foreground">This grows as you write.</p>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Link key={stat.label} to={stat.href} className="rounded-xl border border-border/60 p-3 hover:bg-muted/40 transition-colors">
                  <Icon className="w-4 h-4 text-muted-foreground mb-2" />
                  <p className="text-xl font-semibold text-foreground">{stat.value}</p>
                  <p className="text-[11px] text-muted-foreground leading-tight">{stat.label}</p>
                </Link>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border-border/70">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Keep building</CardTitle>
            <p className="text-xs text-muted-foreground">
              You can move into any part of the case without completing a checklist first.
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to={caseId ? `/cases/${caseId}/timeline` : "/cases"}><Clock3 className="w-4 h-4 mr-2" /> Timeline <ArrowRight className="w-3 h-3 ml-auto" /></Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to={caseId ? `/cases/${caseId}` : "/cases"}><Users className="w-4 h-4 mr-2" /> Case Workspace <ArrowRight className="w-3 h-3 ml-auto" /></Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/analyzer"><Network className="w-4 h-4 mr-2" /> Analyzer <ArrowRight className="w-3 h-3 ml-auto" /></Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/70 bg-muted/20">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <UserRound className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-5">
                Your story stays yours. Decoded Justice organizes information for you to review; it does not decide what happened or give legal advice.
              </p>
            </div>
          </CardContent>
        </Card>
      </aside>

      {clarifyingQuestions.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 px-3 pb-3 sm:px-6">
          <div className="mx-auto max-w-5xl rounded-2xl border border-primary/20 bg-background/95 p-3 shadow-2xl backdrop-blur supports-[backdrop-filter]:bg-background/85">
            {activeQuestion && (
              <div className="mb-3 rounded-xl border border-primary/20 bg-primary/5 p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-primary/10 p-2 text-primary">
                    <MessageCircleQuestion className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{activeQuestion.question}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{activeQuestion.why}</p>
                    <Textarea
                      autoFocus
                      value={questionAnswer}
                      onChange={(event) => setQuestionAnswer(event.target.value)}
                      placeholder="Add what you know. It’s okay to be approximate or say you don’t know."
                      className="mt-3 min-h-[92px] resize-none bg-background text-sm"
                      aria-label={activeQuestion.question}
                    />
                    <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => skipQuestion(activeQuestion.id)} disabled={isSavingAnswer}>
                        Skip for now
                      </Button>
                      <Button size="sm" onClick={() => void answerQuestion()} disabled={!questionAnswer.trim() || isSavingAnswer}>
                        {isSavingAnswer ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        Add clarification
                      </Button>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="shrink-0" onClick={() => setActiveQuestionId(null)} aria-label="Close question">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
              <div className="mr-1 hidden shrink-0 items-center gap-2 text-xs font-medium text-muted-foreground sm:flex">
                <MessageCircleQuestion className="h-4 w-4 text-primary" />
                A few details could help
              </div>
              {clarifyingQuestions.map((question) => (
                <button
                  key={question.id}
                  type="button"
                  onClick={() => openQuestion(question.id)}
                  className="group flex min-w-max items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-4 py-2 text-left text-xs font-medium text-foreground transition hover:border-primary/50 hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <MessageCircleQuestion className="h-3.5 w-3.5 text-primary" />
                  <span>{question.question}</span>
                  <span className="rounded-full bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground">clarify</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
