export type UUID = string;

export interface CaseRecord {
  id: UUID;
  title: string;
  location: string;
  incident_date: string;
  created_at: string;
}

export interface TimelineEvent {
  id: UUID;
  case_id: UUID;
  date: string;
  title: string;
  description: string;
}

export interface Evidence {
  id: UUID;
  case_id: UUID;
  type: "document" | "photo" | "video" | "audio" | "message" | "other";
  description: string;
  file_url: string;
  created_at: string;
}

export interface Issue {
  id: UUID;
  case_id: UUID;
  type: "housing" | "employment" | "education" | "disability" | "policing" | "other";
  description: string;
}

export interface Note {
  id: UUID;
  case_id: UUID;
  content: string;
}

export interface CaseDataBundle {
  case: CaseRecord;
  timelineEvents: TimelineEvent[];
  evidence: Evidence[];
  issues: Issue[];
  notes: Note[];
}

export interface ReadinessResult {
  score: number;
  missing: string[];
}

export interface EvidenceIndexItem extends Evidence {
  label: string;
}

export interface CasePacketData {
  caseId: UUID;
  title: string;
  location: string;
  incidentDate: string;
  createdAt: string;
  summary: string;
  timeline: TimelineEvent[];
  evidenceIndex: EvidenceIndexItem[];
  issues: Issue[];
  notes: Note[];
  readiness: ReadinessResult;
}
