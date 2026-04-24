import { applyToolkitLanguageGuard } from "@/lib/pro-se/languageGuard";

interface CaseInsightsInput {
  outreachCount: number;
  legalAidCount: number;
  intakeData: Record<string, string>;
}

interface CaseInsights {
  completenessLevel: string;
  areasNeedingDetail: string[];
  generalConsiderations: string[];
}

export function generateCaseInsights(input: CaseInsightsInput): CaseInsights {
  const intakeFields = Object.values(input.intakeData || {});
  const completedIntakeFields = intakeFields.filter((value) => value?.trim()).length;
  const intakeCompleteness = intakeFields.length ? completedIntakeFields / intakeFields.length : 0;

  const overall = (Math.min(input.outreachCount / 10, 1) + Math.min(input.legalAidCount / 2, 1) + intakeCompleteness) / 3;

  const completenessLevel =
    overall >= 0.85 ? "High" : overall >= 0.5 ? "Moderate" : "Early stage";

  const areasNeedingDetail: string[] = [];
  if (input.outreachCount < 10) {
    areasNeedingDetail.push(`Attorney outreach log is incomplete (${input.outreachCount} of 10 entries).`);
  }
  if (input.legalAidCount < 2) {
    areasNeedingDetail.push(`Legal aid outreach is incomplete (${input.legalAidCount} of 2 entries).`);
  }
  if (intakeCompleteness < 0.75) {
    areasNeedingDetail.push("Case intake details may need more context around timeline, impact, and requested support.");
  }

  const generalConsiderations = [
    "Keep all communications and records in one place for consistency.",
    "You should continue documenting events and outreach attempts as they occur.",
    "Your case is better organized when updates are dated and clearly labeled.",
  ].map(applyToolkitLanguageGuard);

  return {
    completenessLevel,
    areasNeedingDetail,
    generalConsiderations,
  };
}
