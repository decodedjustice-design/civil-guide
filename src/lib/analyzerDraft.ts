import type { EntityTags } from "@/hooks/useEntityTags";

export const ANALYZER_DRAFT_KEY = "decoded-justice:analyzer-draft:v1";

export interface AnalyzerDraft {
  version: 1;
  updatedAt: string;
  selectedSystem: string | null;
  answers: Record<string, string>;
  freeformNarrative: string;
  entityName: string;
  entityTags: EntityTags;
  step: number;
  showResults: boolean;
  showEntityQuestions: boolean;
  reviewedFacts: Record<string, boolean>;
  factEdits: Record<string, string>;
  clarifyingAnswers: Record<string, string>;
  pendingCaseBuildModuleId?: string;
}

export function loadAnalyzerDraft(): AnalyzerDraft | null {
  try {
    const raw = localStorage.getItem(ANALYZER_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AnalyzerDraft;
    if (parsed?.version !== 1) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveAnalyzerDraft(
  draft: Omit<AnalyzerDraft, "version" | "updatedAt"> & Partial<Pick<AnalyzerDraft, "updatedAt">>,
) {
  try {
    localStorage.setItem(
      ANALYZER_DRAFT_KEY,
      JSON.stringify({
        ...draft,
        version: 1,
        updatedAt: draft.updatedAt ?? new Date().toISOString(),
      }),
    );
  } catch {
    // Local persistence is best-effort. The Analyzer must remain usable if
    // browser storage is unavailable or full.
  }
}

export function clearAnalyzerDraft() {
  try {
    localStorage.removeItem(ANALYZER_DRAFT_KEY);
  } catch {
    // Best-effort cleanup.
  }
}
