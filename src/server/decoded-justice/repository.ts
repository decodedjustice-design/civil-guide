import type {
  CaseDataBundle,
  CaseRecord,
  Evidence,
  Issue,
  Note,
  TimelineEvent,
  UUID,
} from "@/features/decoded-justice/types";

export interface DecodedJusticeRepository {
  getCaseById(caseId: UUID): Promise<CaseRecord | null>;
  getTimelineEvents(caseId: UUID): Promise<TimelineEvent[]>;
  getEvidence(caseId: UUID): Promise<Evidence[]>;
  getIssues(caseId: UUID): Promise<Issue[]>;
  getNotes(caseId: UUID): Promise<Note[]>;
}

export async function getCaseData(
  caseId: UUID,
  repository: DecodedJusticeRepository,
): Promise<CaseDataBundle> {
  const [caseRecord, timelineEvents, evidence, issues, notes] = await Promise.all([
    repository.getCaseById(caseId),
    repository.getTimelineEvents(caseId),
    repository.getEvidence(caseId),
    repository.getIssues(caseId),
    repository.getNotes(caseId),
  ]);

  if (!caseRecord) {
    throw new Error(`Case ${caseId} was not found.`);
  }

  return {
    case: caseRecord,
    timelineEvents,
    evidence,
    issues,
    notes,
  };
}
