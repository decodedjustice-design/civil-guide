import type { PatternChallenge, PatternSignal } from "./patternSignal.ts";
import { recomputeAfterChallenges, snapshotSignal } from "./patternDetectors.ts";

export interface PatternSignalVersion {
  patternSignalId: string;
  versionNo: number;
  versionReason: string;
  snapshot: Record<string, unknown>;
  generatedFromChallengeId?: string;
}

export function applyChallenges(
  signal: PatternSignal,
  challenges: PatternChallenge[],
): { current: PatternSignal; version: PatternSignalVersion } {
  const current = recomputeAfterChallenges(signal, challenges);
  return {
    current,
    version: {
      patternSignalId: signal.id ?? "unsaved",
      versionNo: current.currentVersion,
      versionReason: challenges.length
        ? "Recomputed after review challenge(s)."
        : "Recomputed from current evidence.",
      snapshot: snapshotSignal(current),
      generatedFromChallengeId: challenges.at(-1)?.id,
    },
  };
}
