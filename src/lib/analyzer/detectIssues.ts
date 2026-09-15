import { issueLibrary } from "./issueLibrary";
import { issueRules } from "./issueRules";
import type {
  AnalysisResult,
  IssueFinding,
  IssueStatus,
  MissingFactPrompt,
  TriageContext,
} from "./issueTypes";

const STATUS_RANK: Record<IssueStatus, number> = {
  stronger: 0,
  possible: 1,
  insufficient: 2,
  not_indicated: 3,
};

const uniq = (values: string[]) => Array.from(new Set(values));

/**
 * Pure, deterministic issue detection. Same triage input always yields the
 * same findings, in the same order. No network, no randomness, no clock.
 */
export function detectIssues(ctx: TriageContext, limit = 6): IssueFinding[] {
  const byIssue = new Map<string, IssueFinding>();

  for (const rule of issueRules) {
    if (rule.systems !== "*" && !rule.systems.includes(ctx.systemId)) continue;
    const outcome = rule.evaluate(ctx);
    if (!outcome) continue;
    const definition = issueLibrary[rule.issueId];
    if (!definition) continue;

    const candidate: IssueFinding = {
      definition,
      status: outcome.status,
      triggers: outcome.triggers,
      missingFacts: uniq([...definition.missingFacts, ...(outcome.missingFacts ?? [])]),
      contraryFacts: uniq([...definition.contraryFacts, ...(outcome.contraryFacts ?? [])]),
      weight: outcome.weight ?? 50,
    };

    const existing = byIssue.get(rule.issueId);
    if (!existing) {
      byIssue.set(rule.issueId, candidate);
      continue;
    }
    // Merge duplicates: keep the strongest status and the union of reasons.
    const stronger = STATUS_RANK[candidate.status] < STATUS_RANK[existing.status] ? candidate : existing;
    byIssue.set(rule.issueId, {
      ...stronger,
      triggers: [...existing.triggers, ...candidate.triggers],
      missingFacts: uniq([...existing.missingFacts, ...candidate.missingFacts]),
      contraryFacts: uniq([...existing.contraryFacts, ...candidate.contraryFacts]),
      weight: Math.max(existing.weight, candidate.weight),
    });
  }

  return Array.from(byIssue.values())
    .sort((x, y) => {
      if (x.definition.secondary !== y.definition.secondary) return x.definition.secondary ? 1 : -1;
      if (STATUS_RANK[x.status] !== STATUS_RANK[y.status]) return STATUS_RANK[x.status] - STATUS_RANK[y.status];
      if (y.weight !== x.weight) return y.weight - x.weight;
      const ux = x.definition.urgency ?? 0;
      const uy = y.definition.urgency ?? 0;
      if (uy !== ux) return uy - ux;
      return x.definition.id.localeCompare(y.definition.id);
    })
    .slice(0, limit);
}

export function buildSynthesis(ctx: TriageContext, findings: IssueFinding[]): string[] {
  if (findings.length === 0) {
    return [
      `Based on what you shared about the ${ctx.systemLabel.toLowerCase()} system, there is not yet enough detail to point to a specific category of law for closer review.`,
      "That is common early on. Writing down what happened in order, and gathering any documents you already have, usually makes the picture clearer than any questionnaire can.",
    ];
  }

  const strong = findings.filter((f) => f.status === "stronger");
  const possible = findings.filter((f) => f.status === "possible");
  const thin = findings.filter((f) => f.status === "insufficient");

  const names = (list: IssueFinding[]) =>
    list.map((f) => f.definition.title.split(" — ")[0]).join(", ");

  const first = `Your answers describe a situation in the ${ctx.systemLabel.toLowerCase()} system${
    ctx.entityName ? ` involving ${ctx.entityName}` : ""
  }. ${
    strong.length
      ? `Based on what you selected, these areas may warrant closer review: ${names(strong)}.`
      : ""
  }${
    possible.length
      ? `${strong.length ? " Also worth reviewing: " : "Based on what you selected, these areas may be worth reviewing: "}${names(possible)}.`
      : ""
  }`.trim();

  const second = `These are educational signals, not conclusions. Each one appeared because of specific choices you made in the triage, all of which are treated as user-reported rather than established. ${
    thin.length
      ? `A few areas (${names(thin)}) cannot be assessed yet because key facts are unknown.`
      : "What happens next usually depends on facts the triage has not captured yet."
  } The questions below are the ones most likely to change this picture.`;

  return [first, second];
}

export function buildMissingFactPrompts(findings: IssueFinding[], limit = 5): MissingFactPrompt[] {
  const map = new Map<string, MissingFactPrompt>();
  findings.forEach((finding, index) => {
    finding.missingFacts.slice(0, 3).forEach((fact, i) => {
      const key = fact.toLowerCase();
      const existing = map.get(key);
      if (existing) {
        if (!existing.relatedIssues.includes(finding.definition.title)) {
          existing.relatedIssues.push(finding.definition.title);
        }
        return;
      }
      map.set(key, {
        id: `${finding.definition.id}_${i}`,
        question: fact,
        whyItMatters: `This affects how the "${finding.definition.title}" category would be assessed.`,
        relatedIssues: [finding.definition.title],
      });
    });
    void index;
  });
  return Array.from(map.values())
    .sort((x, y) => y.relatedIssues.length - x.relatedIssues.length)
    .slice(0, limit);
}

export function buildEvidenceChecklist(findings: IssueFinding[], limit = 8): string[] {
  return uniq(findings.flatMap((f) => f.definition.evidenceToPreserve)).slice(0, limit);
}

export function buildNextActions(findings: IssueFinding[]): Array<{ title: string; detail: string }> {
  const ranked = [...findings].sort((x, y) => {
    const ux = (x.definition.urgency ?? 0) + (x.status === "stronger" ? 3 : 0);
    const uy = (y.definition.urgency ?? 0) + (y.status === "stronger" ? 3 : 0);
    if (uy !== ux) return uy - ux;
    return x.definition.id.localeCompare(y.definition.id);
  });

  const actions = ranked
    .filter((f) => !f.definition.secondary)
    .slice(0, 3)
    .map((f) => ({ title: f.definition.title.split(" — ")[0], detail: f.definition.nextAction }));

  const fallback = [
    { title: "Write the sequence down", detail: "Put the events in date order while details are fresh, even if some dates are approximate." },
    { title: "Gather what you already have", detail: "Collect notices, messages, photos, and paperwork into one place." },
    { title: "Note any dates that appear", detail: "Any deadline printed on paperwork usually shapes what is possible next." },
  ];

  return [...actions, ...fallback].slice(0, 3);
}

export function analyzeTriage(ctx: TriageContext): AnalysisResult {
  const findings = detectIssues(ctx);
  return {
    synthesis: buildSynthesis(ctx, findings),
    findings,
    missingFactPrompts: buildMissingFactPrompts(findings),
    evidenceChecklist: buildEvidenceChecklist(findings),
    nextActions: buildNextActions(findings),
  };
}
