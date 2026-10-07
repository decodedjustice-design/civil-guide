import type { PatternSignal, TruthStatus, SourceReference } from "./patternSignal.ts";

export interface PatternSignalExport {
  pattern_signal: {
    id?: string;
    case_id: string;
    neutral_name: string;
    neutral_description: string;
    pattern_type: string;
    truth_status: TruthStatus;
    workflow_state: string;
    assessment_state: string;
    current_version: number;
    scope: "private_case";
    permitted_use: "private_case";
  };
  occurrences: Array<{
    occurrence_key: string;
    event_id?: string;
    included: boolean;
    truth_status: TruthStatus;
    summary: string;
    source_references: SourceReference[];
  }>;
  supporting_evidence: SourceReference[];
  countervailing_evidence: SourceReference[];
  alternative_explanations: string[];
  missing_evidence: string[];
  support_assessment: PatternSignal["supportAssessment"];
  provenance_warning: string;
}

export function exportPatternSignal(signal: PatternSignal): PatternSignalExport {
  return {
    pattern_signal: {
      id: signal.id,
      case_id: signal.caseId,
      neutral_name: signal.neutralName,
      neutral_description: signal.neutralDescription,
      pattern_type: signal.patternType,
      truth_status: signal.truthStatus,
      workflow_state: signal.workflowState,
      assessment_state: signal.assessmentState,
      current_version: signal.currentVersion,
      scope: signal.scope,
      permitted_use: signal.permittedUse,
    },
    occurrences: signal.occurrences.map((occurrence) => ({
      occurrence_key: occurrence.occurrenceKey,
      event_id: occurrence.eventId,
      included: occurrence.included,
      truth_status: occurrence.truthStatus,
      summary: occurrence.summary,
      source_references: occurrence.sourceReferences,
    })),
    supporting_evidence: signal.supportingEvidence,
    countervailing_evidence: signal.countervailingEvidence,
    alternative_explanations: signal.alternativeExplanations,
    missing_evidence: signal.missingEvidence,
    support_assessment: signal.supportAssessment,
    provenance_warning:
      "This export preserves the distinction between source records, system inference, user assessment, and authorized determination. A Pattern Signal is a derived analytical observation, not evidence itself.",
  };
}
