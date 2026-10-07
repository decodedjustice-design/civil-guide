import type {
  DetectionEvent,
  ExpectedRecord,
  PatternOccurrence,
  PatternSignal,
  PatternChallenge,
  SourceReference,
  SupportAssessment,
} from "./patternSignal.ts";

const unique = <T>(items: T[]) => [...new Set(items)];

export function toDistinctOccurrences(events: DetectionEvent[]): PatternOccurrence[] {
  const byEvent = new Map<string, DetectionEvent>();
  for (const event of events) byEvent.set(event.id, event);

  return [...byEvent.values()].map((event) => ({
    occurrenceKey: event.id,
    eventId: event.id,
    occurredAt: event.occurredAt,
    summary: event.summary,
    truthStatus: "RECORD",
    sourceReferences: event.sourceReferences,
    included: true,
  }));
}

export function detectRecurrence(
  caseId: string,
  events: DetectionEvent[],
  similarityKey: string,
): PatternSignal | null {
  const candidates = events.filter((event) => event.similarityKey === similarityKey);
  const occurrences = toDistinctOccurrences(candidates);

  // A single underlying event is not recurrence.
  if (occurrences.length < 2) return null;

  const sourceReferences = occurrences.flatMap((o) => o.sourceReferences);
  const supportAssessment: SupportAssessment = {
    sourceFidelity: sourceReferences.length ? "supported" : "unknown",
    eventIdentification: occurrences.every((o) => Boolean(o.eventId)) ? "supported" : "partial",
    relationship: "partial",
    recurrence: "supported",
    evidenceCoverage: sourceReferences.length >= occurrences.length ? "adequate" : "limited",
    counterevidence: "absent",
    alternativeExplanation: "none_identified",
    overall: "needs_review",
    explanation:
      "Distinct verified event records share the selected recurrence key. " +
      "The relationship remains a candidate signal and requires review.",
  };

  return {
    caseId,
    patternType: "recurrence",
    neutralName: "Candidate recurrence identified",
    neutralDescription:
      "Distinct events may share a documented characteristic. This signal does not establish misconduct, unlawful conduct, causation, or institutional wrongdoing.",
    observationUnit: "distinct_event",
    occurrences,
    supportingEvidence: sourceReferences,
    countervailingEvidence: [],
    alternativeExplanations: [],
    missingEvidence: [],
    scope: "private_case",
    permittedUse: "private_case",
    supportAssessment,
    truthStatus: "INFERENCE",
    workflowState: "candidate",
    assessmentState: "not_assessed",
    detectionBasis: {
      detector: "recurrence",
      similarityKey,
      distinctOccurrenceCount: occurrences.length,
    },
    methodology: {
      occurrenceRule: "count_distinct_underlying_events",
      duplicateRule: "documents_or_mentions_do_not_create_new_occurrences",
    },
    legalContext: {},
    currentVersion: 1,
  };
}

export function detectPotentialInconsistency(
  caseId: string,
  events: DetectionEvent[],
  propositionKey: string,
): PatternSignal | null {
  const candidates = events.filter((event) => event.propositionKey === propositionKey);
  const statements = unique(
    candidates
      .map((event) => event.normalizedStatement?.trim())
      .filter((value): value is string => Boolean(value)),
  );

  if (candidates.length < 2 || statements.length < 2) return null;

  const contextKeys = unique(candidates.map((event) => event.contextKey).filter(Boolean));
  if (contextKeys.length > 1) {
    return null;
  }

  const occurrences = toDistinctOccurrences(candidates);
  const sourceReferences = occurrences.flatMap((o) => o.sourceReferences);

  return {
    caseId,
    patternType: "potential_inconsistency",
    neutralName: "Potentially inconsistent descriptions identified",
    neutralDescription:
      "The reviewed records contain differing descriptions of the same selected proposition. " +
      "Review dates, context, speaker/source, corrections, and superseding records before treating the difference as meaningful.",
    observationUnit: "distinct_event",
    occurrences,
    supportingEvidence: sourceReferences,
    countervailingEvidence: [],
    alternativeExplanations: [
      "The statements may reflect different context or information available at the time.",
      "A later correction or superseding record may reconcile the descriptions.",
    ],
    missingEvidence: [],
    scope: "private_case",
    permittedUse: "private_case",
    supportAssessment: {
      sourceFidelity: sourceReferences.length ? "supported" : "unknown",
      eventIdentification: occurrences.every((o) => Boolean(o.eventId)) ? "supported" : "partial",
      relationship: "partial",
      recurrence: "unknown",
      evidenceCoverage: "adequate",
      counterevidence: "absent",
      alternativeExplanation: "unresolved",
      overall: "needs_review",
      explanation:
        "Multiple source statements concern the same selected proposition and context but differ in normalized content.",
    },
    truthStatus: "INFERENCE",
    workflowState: "candidate",
    assessmentState: "not_assessed",
    detectionBasis: {
      detector: "potential_inconsistency",
      propositionKey,
      comparisonRequirements: ["same proposition", "same relevant context"],
    },
    methodology: {
      differenceIsNotAutomaticallyContradiction: true,
    },
    legalContext: {},
    currentVersion: 1,
  };
}

export function detectInformationGaps(
  caseId: string,
  expectedRecords: ExpectedRecord[],
): PatternSignal[] {
  return expectedRecords
    .filter((record) => !record.located && Boolean(record.expectationBasis.trim()))
    .map((record) => ({
      caseId,
      patternType: "information_gap" as const,
      neutralName: "Expected record not located in reviewed collection",
      neutralDescription:
        "No corresponding record was located within the reviewed collection. " +
        "This does not establish that the record was never created, sent, received, or retained.",
      observationUnit: "distinct_event" as const,
      occurrences: [],
      supportingEvidence: record.sourceReferences ?? [],
      countervailingEvidence: [],
      alternativeExplanations: [
        "The reviewed collection may be incomplete.",
        "The record may exist under a different name, system, date, or custodian.",
      ],
      missingEvidence: [record.label],
      scope: "private_case" as const,
      permittedUse: "private_case" as const,
      supportAssessment: {
        sourceFidelity: "supported" as const,
        eventIdentification: "unknown" as const,
        relationship: "unknown" as const,
        recurrence: "unknown" as const,
        evidenceCoverage: "limited" as const,
        counterevidence: "unknown" as const,
        alternativeExplanation: "unresolved" as const,
        overall: "needs_review" as const,
        explanation: record.expectationBasis,
      },
      truthStatus: "INFERENCE" as const,
      workflowState: "candidate" as const,
      assessmentState: "not_assessed" as const,
      detectionBasis: {
        detector: "information_gap",
        expectationBasis: record.expectationBasis,
        reviewedCollectionScope: "caller_supplied",
      },
      methodology: {
        absenceDoesNotProveNonexistence: true,
      },
      legalContext: {},
      currentVersion: 1,
    }));
}

export function recomputeAfterChallenges(
  signal: PatternSignal,
  challenges: PatternChallenge[],
): PatternSignal {
  const occurrenceExclusions = new Set(
    challenges
      .filter((c) => c.challengeType === "exclude_occurrence" && c.occurrenceId)
      .map((c) => c.occurrenceId as string),
  );

  const occurrences = signal.occurrences.map((occurrence) => {
    const excluded = occurrenceExclusions.has(occurrence.id ?? occurrence.occurrenceKey);
    return excluded
      ? { ...occurrence, included: false, exclusionReason: "Excluded by user challenge; source preserved." }
      : occurrence;
  });

  const alternativeExplanations = [
    ...signal.alternativeExplanations,
    ...challenges
      .filter((c) => c.challengeType === "add_alternative_explanation" && c.alternativeExplanation)
      .map((c) => c.alternativeExplanation as string),
  ];

  const counterevidence = challenges
    .filter((c) => c.challengeType === "add_counterevidence")
    .flatMap((c) => c.counterevidence ?? []);

  const includedCount = occurrences.filter((o) => o.included).length;
  const weakened = includedCount < signal.occurrences.filter((o) => o.included).length;

  let overall = signal.supportAssessment.overall;
  if (includedCount < 2 && signal.patternType === "recurrence") {
    overall = "insufficient_evidence";
  } else if (counterevidence.length > 0) {
    overall = "mixed_or_disputed";
  }

  const next: PatternSignal = {
    ...signal,
    occurrences,
    countervailingEvidence: [...signal.countervailingEvidence, ...counterevidence],
    alternativeExplanations,
    supportAssessment: {
      ...signal.supportAssessment,
      counterevidence: counterevidence.length ? "present" : signal.supportAssessment.counterevidence,
      alternativeExplanation: alternativeExplanations.length ? "unresolved" : signal.supportAssessment.alternativeExplanation,
      overall,
      explanation: weakened
        ? "The signal was recomputed after review. One or more occurrences were excluded; the current signal reflects the revised evidence."
        : signal.supportAssessment.explanation,
    },
    workflowState: weakened ? "challenged" : signal.workflowState,
    assessmentState: overall === "needs_review" ? "not_assessed" : overall,
    currentVersion: signal.currentVersion + 1,
  };

  return next;
}

export function snapshotSignal(signal: PatternSignal): Record<string, unknown> {
  return JSON.parse(JSON.stringify(signal));
}
