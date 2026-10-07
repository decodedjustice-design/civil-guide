/**
 * Pattern Intelligence v1 — canonical domain contract.
 *
 * This file is intentionally independent of Supabase generated types. Pattern
 * Signals are derived analytical objects, never evidence records.
 */

export const TRUTH_STATUSES = [
  "RECORD",
  "INFERENCE",
  "USER_ASSESSMENT",
  "AUTHORIZED_DETERMINATION",
  "UNKNOWN",
  "INSUFFICIENT_EVIDENCE",
] as const;

export type TruthStatus = typeof TRUTH_STATUSES[number];

export const WORKFLOW_STATES = [
  "candidate",
  "under_review",
  "accepted",
  "challenged",
  "action_taken",
  "closed_by_user",
  "archived",
] as const;

export type WorkflowState = typeof WORKFLOW_STATES[number];

export const ASSESSMENT_STATES = [
  "not_assessed",
  "insufficient_evidence",
  "supported_within_available_materials",
  "mixed_or_disputed",
  "not_supported_after_review",
  "formal_determination_recorded",
] as const;

export type AssessmentState = typeof ASSESSMENT_STATES[number];

export type PatternType =
  | "recurrence"
  | "potential_inconsistency"
  | "information_gap";

export interface SourceReference {
  caseId: string;
  documentId?: string;
  documentVersionId?: string;
  evidenceLocatorId?: string;
  location?: string;
  extractedStatement?: string;
  context?: string;
  extractionMethod?: string;
  truthStatus: TruthStatus;
}

export interface PatternOccurrence {
  id?: string;
  occurrenceKey: string;
  eventId?: string;
  occurredAt?: string;
  summary: string;
  truthStatus: TruthStatus;
  sourceReferences: SourceReference[];
  included: boolean;
}

export interface SupportAssessment {
  sourceFidelity: "supported" | "partial" | "unsupported" | "unknown";
  eventIdentification: "supported" | "partial" | "unsupported" | "unknown";
  relationship: "supported" | "partial" | "unsupported" | "unknown";
  recurrence: "supported" | "partial" | "unsupported" | "unknown";
  evidenceCoverage: "broad" | "adequate" | "limited" | "unknown";
  counterevidence: "absent" | "present" | "substantial" | "unknown";
  alternativeExplanation: "none_identified" | "present" | "unresolved" | "unknown";
  overall:
    | "needs_review"
    | "supported_within_available_materials"
    | "mixed_or_disputed"
    | "insufficient_evidence"
    | "not_supported_after_review";
  explanation: string;
}

export interface PatternSignal {
  id?: string;
  caseId: string;
  patternType: PatternType;
  neutralName: string;
  neutralDescription: string;
  observationUnit: "distinct_event";
  occurrences: PatternOccurrence[];
  supportingEvidence: SourceReference[];
  countervailingEvidence: SourceReference[];
  alternativeExplanations: string[];
  missingEvidence: string[];
  scope: "private_case";
  permittedUse: "private_case";
  supportAssessment: SupportAssessment;
  truthStatus: TruthStatus;
  workflowState: WorkflowState;
  assessmentState: AssessmentState;
  detectionBasis: Record<string, unknown>;
  methodology: Record<string, unknown>;
  legalContext: Record<string, unknown>;
  currentVersion: number;
}

export interface PatternChallenge {
  id?: string;
  patternSignalId: string;
  occurrenceId?: string;
  challengeType:
    | "dispute_extraction"
    | "correct_extraction"
    | "dispute_relationship"
    | "exclude_occurrence"
    | "add_counterevidence"
    | "add_alternative_explanation"
    | "request_recomputation";
  explanation: string;
  correction?: Record<string, unknown>;
  counterevidence?: SourceReference[];
  alternativeExplanation?: string;
  createdBy: string;
}

export interface DetectionEvent {
  id: string;
  occurredAt?: string;
  summary: string;
  similarityKey?: string;
  propositionKey?: string;
  contextKey?: string;
  normalizedStatement?: string;
  sourceReferences: SourceReference[];
}

export interface ExpectedRecord {
  id: string;
  label: string;
  expectationBasis: string;
  located: boolean;
  sourceReferences?: SourceReference[];
}

export const isTruthStatus = (value: string): value is TruthStatus =>
  (TRUTH_STATUSES as readonly string[]).includes(value);

export const isUnsupportedStatus = (value: TruthStatus) =>
  value === "UNKNOWN" || value === "INSUFFICIENT_EVIDENCE";
