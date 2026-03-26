import type {
  CaseDataBundle,
  CasePacketData,
  EvidenceIndexItem,
  ReadinessResult,
  TimelineEvent,
} from "@/features/decoded-justice/types";

export function generateCaseSummary(data: CaseDataBundle): string {
  const firstNote = data.notes[0]?.content?.trim();
  const incidentDate = new Date(data.case.incident_date).toLocaleDateString();

  const eventCount = data.timelineEvents.length;
  const evidenceCount = data.evidence.length;
  const issueCount = data.issues.length;

  const noteSummary =
    firstNote && firstNote.length > 0
      ? `Narrative context: ${firstNote.slice(0, 500)}`
      : "Narrative context has not been added yet.";

  return [
    `This case record documents reported events connected to ${data.case.location} on or around ${incidentDate}.`,
    `The record includes ${eventCount} timeline event(s), ${evidenceCount} evidence item(s), and ${issueCount} issue tag(s).`,
    noteSummary,
    "This summary is informational and does not determine legal conclusions.",
  ].join(" ");
}

export function buildTimeline(data: CaseDataBundle): TimelineEvent[] {
  return [...data.timelineEvents].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
}

export function buildEvidenceIndex(data: CaseDataBundle): EvidenceIndexItem[] {
  return [...data.evidence]
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .map((item, index) => ({
      ...item,
      label: `EV-${String(index + 1).padStart(2, "0")}`,
    }));
}

export function calculateReadiness(data: CaseDataBundle): ReadinessResult {
  const missing: string[] = [];
  let score = 0;

  if (data.notes.some((n) => n.content.trim().length > 0)) {
    score += 25;
  } else {
    missing.push("Add what happened in your own words.");
  }

  if (data.timelineEvents.length >= 2) {
    score += 25;
  } else {
    missing.push("Add more timeline details.");
  }

  if (data.evidence.length >= 1) {
    score += 25;
  } else {
    missing.push("Upload at least one piece of evidence.");
  }

  if (data.issues.length >= 1) {
    score += 25;
  } else {
    missing.push("Select at least one issue area.");
  }

  return {
    score,
    missing,
  };
}

export function generateCasePacket(data: CaseDataBundle): CasePacketData {
  const summary = generateCaseSummary(data);
  const timeline = buildTimeline(data);
  const evidenceIndex = buildEvidenceIndex(data);
  const readiness = calculateReadiness(data);

  return {
    caseId: data.case.id,
    title: data.case.title,
    location: data.case.location,
    incidentDate: data.case.incident_date,
    createdAt: data.case.created_at,
    summary,
    timeline,
    evidenceIndex,
    issues: data.issues,
    notes: data.notes,
    readiness,
  };
}
