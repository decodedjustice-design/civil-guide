/**
 * Typed models for the Decoded Justice analyzer issue-detection engine.
 *
 * Nothing in this module gives legal advice or reaches legal conclusions.
 * It produces *educational triage signals*: which categories of law may be
 * worth closer review, why they surfaced, and what facts are still unknown.
 */

export type IssueStatus =
  | "stronger"
  | "possible"
  | "insufficient"
  | "not_indicated";

export const ISSUE_STATUS_LABEL: Record<IssueStatus, string> = {
  stronger: "Stronger indication",
  possible: "Possible issue",
  insufficient: "Insufficient facts",
  not_indicated: "Not indicated",
};

/** How a piece of information entered the analysis. */
export type FactKind =
  | "user_reported"
  | "allegation"
  | "disputed"
  | "inference"
  | "unknown";

export const FACT_KIND_LABEL: Record<FactKind, string> = {
  user_reported: "User-reported fact",
  allegation: "Allegation",
  disputed: "Disputed",
  inference: "Inference by this tool",
  unknown: "Unknown",
};

export interface FactTrigger {
  /** Plain-language restatement of the selection that triggered a rule. */
  label: string;
  /** Which triage question produced it, when known. */
  questionId?: string;
  kind: FactKind;
}

export interface AuthorityRef {
  /** Authority-level citation only. Never a quotation or holding. */
  label: string;
  /** True only where the citation is a stable, well-known authority name. */
  verified: boolean;
}

export interface IssueDefinition {
  id: string;
  /** Category name shown on the card. */
  title: string;
  /** One-sentence plain-English explanation. */
  explanation: string;
  /** Authority level only — no elements, holdings, or deadlines invented. */
  authorities: AuthorityRef[];
  /** 2-5 factors that generally matter to this category of law. */
  factors: string[];
  /** Facts that commonly weigh against the issue. */
  contraryFacts: string[];
  /** Facts that are frequently missing and materially affect the analysis. */
  missingFacts: string[];
  evidenceToPreserve: string[];
  nextAction: string;
  jurisdiction: string;
  learnMoreHref: string;
  /** Secondary issues are never presented as standalone violations. */
  secondary?: boolean;
  /** Higher = more time-sensitive. Used only for ordering. */
  urgency?: number;
}

export interface TriageContext {
  systemId: string;
  systemLabel: string;
  answers: Record<string, string>;
  entityName?: string;
  location?: string;
  patternStrength: "none" | "possible" | "strong" | "very_strong";
}

export interface RuleOutcome {
  status: IssueStatus;
  triggers: FactTrigger[];
  /** Extra missing facts specific to this fact pattern. */
  missingFacts?: string[];
  /** Extra contrary facts specific to this fact pattern. */
  contraryFacts?: string[];
  /** Ordering weight; higher sorts first within a status band. */
  weight?: number;
}

export interface IssueRule {
  issueId: string;
  /** "*" applies to every system. */
  systems: string[] | "*";
  evaluate: (ctx: TriageContext) => RuleOutcome | null;
}

export interface IssueFinding {
  definition: IssueDefinition;
  status: IssueStatus;
  triggers: FactTrigger[];
  missingFacts: string[];
  contraryFacts: string[];
  weight: number;
}

export interface MissingFactPrompt {
  id: string;
  question: string;
  whyItMatters: string;
  relatedIssues: string[];
}

export interface AnalysisResult {
  synthesis: string[];
  findings: IssueFinding[];
  missingFactPrompts: MissingFactPrompt[];
  evidenceChecklist: string[];
  nextActions: Array<{ title: string; detail: string }>;
}
