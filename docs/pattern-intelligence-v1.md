# Decoded Justice — Pattern Intelligence v1 Implementation Specification

**Status:** Governing product standard  
**Scope:** Private-case intelligence only  
**Research:** Explicitly out of scope for v1

## Trust contract

Pattern Intelligence must preserve these truth layers:
- RECORD — what a source says or contains.
- INFERENCE — what the system proposes from available information.
- USER_ASSESSMENT — the user's interpretation or verification.
- AUTHORIZED_DETERMINATION — a conclusion made by an identified authority/reviewer.
- UNKNOWN
- INSUFFICIENT_EVIDENCE

No API, UI, model response, export, or packet may silently convert one layer into another.

## Provenance contract

A substantive observation must resolve to:

Case → Document → Version → Location → Extract/Statement

The canonical Pattern Signal stores source links through pattern_signal_evidence, with optional document, document version, evidence locator, extracted statement, and context. A Pattern Signal is derived analysis; it is not evidence.

## Occurrence rule

Frequency means distinct underlying events.

If three records describe one event, the system stores one occurrence with three supporting records. It must never count document mentions as independent events.

## V1 detectors

### Recurrence

Produces a Candidate recurrence identified signal only when at least two distinct events share the selected recurrence key.

### Potential inconsistency

Compares statements only after checking the same proposition and relevant context. Differing text alone is not a contradiction.

### Information gap

May identify a missing record only when there is an evidence-based expectation that the record should exist in the reviewed collection.

Required wording:

> No corresponding record was located within the reviewed collection.

Never:

> The record was never created.

### Abstention

Insufficient evidence is a successful result. The detector must return no reliable signal rather than manufacture one.

## Support assessment

V1 uses separate qualitative dimensions rather than a single confidence score:
- source fidelity
- event identification
- relationship support
- recurrence support
- evidence coverage
- counterevidence
- alternative explanation
- overall assessment
- explanation

## Challenge/recomputation

Challenges are append-only records. They can:
- dispute an extraction
- correct an extraction
- dispute a relationship
- exclude an occurrence
- add counterevidence
- add an alternative explanation
- request recomputation

Recomputation creates a new Pattern Signal version. Earlier versions remain preserved. Source documents are never modified by a challenge.

## Withdrawal behavior

A signal may become weaker, mixed/disputed, insufficient, unsupported, superseded, or withdrawn from active analysis. Current presentation must be based on the latest recomputed version.

## Export

Exports preserve:
- truth status
- occurrence status
- provenance
- supporting evidence
- counterevidence
- alternative explanations
- missing evidence
- workflow state
- assessment state
- current version

Exports must never flatten an inference into a factual finding.

## Research boundary

V1 Pattern Signal rows are structurally restricted to:

scope = private_case
permitted_use = private_case

There is no research dataset reference, aggregate scope, public publication state, or cross-case query path in the V1 schema.

Future governed research requires a separate authorization and data-governance architecture. Research access is not publication authorization.

## Acceptance suite

The executable suite covers:
- AT-01 duplicate suppression
- AT-02 source fidelity
- AT-03 contradiction qualification
- AT-04 missing-record scope
- AT-05 counterevidence
- AT-06 challenge propagation
- AT-07 hypothesis weakening
- AT-08 abstention
- AT-09 export integrity
- AT-10 research isolation
- AT-11 versioned recomputation
- AT-12 provenance/unsupported-source behavior

Run: npm run test:pattern

The suite is deterministic and operates on synthetic in-memory case material. It does not access production data.

## V1 release gate

Pattern Intelligence v1 is not accepted because it finds many patterns.

It passes only if it can:
1. Detect — identify a potentially meaningful relationship.
2. Explain — show the exact evidence basis and limitations.
3. Withdraw — weaken, revise, or withdraw the relationship when challenged by new evidence.

The system must be as capable of showing that a proposed connection is unsupported as it is of identifying a potentially meaningful one.