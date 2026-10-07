import test from "node:test";
import assert from "node:assert/strict";
import {
  detectInformationGaps,
  detectPotentialInconsistency,
  detectRecurrence,
  recomputeAfterChallenges,
} from "../src/lib/pattern-intelligence/patternDetectors.ts";
import type { DetectionEvent, PatternChallenge } from "../src/lib/pattern-intelligence/patternSignal.ts";

const source = (text: string) => ({
  caseId: "case-1",
  documentId: "doc-1",
  documentVersionId: "ver-1",
  evidenceLocatorId: "loc-1",
  location: "p. 2",
  extractedStatement: text,
  truthStatus: "RECORD" as const,
});

test("AT-01 duplicate suppression: one event described by three records remains one occurrence", () => {
  const events: DetectionEvent[] = [
    { id: "event-1", summary: "Decision occurred", similarityKey: "notice-process", sourceReferences: [source("A")] },
    { id: "event-1", summary: "Decision occurred", similarityKey: "notice-process", sourceReferences: [source("B")] },
    { id: "event-1", summary: "Decision occurred", similarityKey: "notice-process", sourceReferences: [source("C")] },
  ];
  const signal = detectRecurrence("case-1", events, "notice-process");
  assert.equal(signal?.occurrences.length, 1);
});

test("AT-02 source fidelity: explanation stays tied to source-backed observations", () => {
  const events: DetectionEvent[] = [
    { id: "event-1", summary: "Notice dated March 1", similarityKey: "notice", sourceReferences: [source("Notice dated March 1")] },
    { id: "event-2", summary: "Notice dated April 1", similarityKey: "notice", sourceReferences: [source("Notice dated April 1")] },
  ];
  const signal = detectRecurrence("case-1", events, "notice");
  assert.equal(signal?.supportAssessment.sourceFidelity, "supported");
  assert.match(signal?.supportAssessment.explanation ?? "", /distinct verified event records/i);
});

test("AT-03 contradiction qualification: different context does not become a contradiction", () => {
  const events: DetectionEvent[] = [
    { id: "event-1", summary: "Initial statement", propositionKey: "decision-x", contextKey: "phase-1", normalizedStatement: "approved", sourceReferences: [source("approved")] },
    { id: "event-2", summary: "Later statement", propositionKey: "decision-x", contextKey: "phase-2", normalizedStatement: "denied", sourceReferences: [source("denied")] },
  ];
  assert.equal(detectPotentialInconsistency("case-1", events, "decision-x"), null);
});

test("AT-04 missing-record scope: gap wording does not claim nonexistence", () => {
  const [signal] = detectInformationGaps("case-1", [{
    id: "notice",
    label: "notice record",
    expectationBasis: "A notice is expected by the selected procedure.",
    located: false,
  }]);
  assert.match(signal.neutralDescription, /reviewed collection/i);
  assert.doesNotMatch(signal.neutralDescription, /never created|never sent|does not exist/i);
});

test("AT-05 counterevidence changes assessment", () => {
  const signal = detectRecurrence("case-1", [
    { id: "event-1", summary: "A", similarityKey: "x", sourceReferences: [source("A")] },
    { id: "event-2", summary: "B", similarityKey: "x", sourceReferences: [source("B")] },
  ])!;
  const challenge: PatternChallenge = {
    patternSignalId: "signal-1",
    challengeType: "add_counterevidence",
    explanation: "Record shows the second event used a different process.",
    counterevidence: [source("Different process")],
    createdBy: "user-1",
  };
  const recomputed = recomputeAfterChallenges(signal, [challenge]);
  assert.equal(recomputed.supportAssessment.overall, "mixed_or_disputed");
  assert.equal(recomputed.countervailingEvidence.length, 1);
});

test("AT-06 challenge propagation: excluding an occurrence recomputes dependent signal", () => {
  const signal = detectRecurrence("case-1", [
    { id: "event-1", summary: "A", similarityKey: "x", sourceReferences: [source("A")] },
    { id: "event-2", summary: "B", similarityKey: "x", sourceReferences: [source("B")] },
  ])!;
  const challenge: PatternChallenge = {
    patternSignalId: "signal-1",
    occurrenceId: "event-2",
    challengeType: "exclude_occurrence",
    explanation: "Event 2 is unrelated.",
    createdBy: "user-1",
  };
  const recomputed = recomputeAfterChallenges(signal, [challenge]);
  assert.equal(recomputed.occurrences.filter((o) => o.included).length, 1);
  assert.equal(recomputed.supportAssessment.overall, "insufficient_evidence");
});

test("AT-07 hypothesis weakening: prior signal is preserved while current version weakens", () => {
  const signal = detectRecurrence("case-1", [
    { id: "event-1", summary: "A", similarityKey: "x", sourceReferences: [source("A")] },
    { id: "event-2", summary: "B", similarityKey: "x", sourceReferences: [source("B")] },
    { id: "event-3", summary: "C", similarityKey: "x", sourceReferences: [source("C")] },
  ])!;
  const challenge: PatternChallenge = {
    patternSignalId: "signal-1",
    occurrenceId: "event-3",
    challengeType: "exclude_occurrence",
    explanation: "Event 3 concerns another process.",
    createdBy: "user-1",
  };
  const recomputed = recomputeAfterChallenges(signal, [challenge]);
  assert.equal(recomputed.currentVersion, 2);
  assert.equal(recomputed.occurrences.find((o) => o.occurrenceKey === "event-3")?.included, false);
  assert.equal(signal.currentVersion, 1);
});

test("AT-08 abstention: insufficient recurrence does not generate a signal", () => {
  const signal = detectRecurrence("case-1", [
    { id: "event-1", summary: "Only event", similarityKey: "x", sourceReferences: [source("Only event")] },
  ], "x");
  assert.equal(signal, null);
});

test("AT-09 export integrity: signal retains truth status and provenance", () => {
  const signal = detectRecurrence("case-1", [
    { id: "event-1", summary: "A", similarityKey: "x", sourceReferences: [source("A")] },
    { id: "event-2", summary: "B", similarityKey: "x", sourceReferences: [source("B")] },
  ])!;
  assert.equal(signal.truthStatus, "INFERENCE");
  assert.equal(signal.occurrences[0].truthStatus, "RECORD");
  assert.equal(signal.occurrences[0].sourceReferences[0].evidenceLocatorId, "loc-1");
});

test("AT-10 research isolation: v1 detector output is private-case only", () => {
  const signal = detectRecurrence("case-1", [
    { id: "event-1", summary: "A", similarityKey: "x", sourceReferences: [source("A")] },
    { id: "event-2", summary: "B", similarityKey: "x", sourceReferences: [source("B")] },
  ])!;
  assert.equal(signal.scope, "private_case");
  assert.equal(signal.permittedUse, "private_case");
});
