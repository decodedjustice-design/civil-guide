import { useMemo } from 'react';

// Core Case Context types
export type SystemType = 
  | 'police' 
  | 'employer' 
  | 'housing' 
  | 'school' 
  | 'healthcare' 
  | 'courts' 
  | 'jail' 
  | 'government' 
  | 'cps_dcyf'
  | 'unsure';

export type IssueType = 
  | 'excessive_force'
  | 'wrongful_arrest'
  | 'discrimination'
  | 'retaliation'
  | 'harassment'
  | 'unlawful_search'
  | 'failure_to_render_aid'
  | 'eviction'
  | 'habitability'
  | 'accommodation_denial'
  | 'wrongful_termination'
  | 'wage_theft'
  | 'custody'
  | 'investigation'
  | 'due_process'
  | 'medical_neglect'
  | 'privacy_violation'
  | 'other';

export type CaseStage = 
  | 'getting_oriented'
  | 'gathering_information'
  | 'pre_filing'
  | 'attorney_search'
  | 'pro_se'
  | 'post_filing';

export type PatternStrength = 'none' | 'possible' | 'strong' | 'very_strong';

export interface CaseContext {
  // Core identifiers
  system: SystemType;
  systemLabel: string;
  issueTypes: IssueType[];
  
  // Location & Jurisdiction
  jurisdiction: 'washington' | 'federal' | 'both';
  county?: string;
  city?: string;
  
  // Case characteristics
  stage: CaseStage;
  patternStrength: PatternStrength;
  entityName?: string;
  
  // Detected factors (from answers)
  hasInjury: boolean;
  hasMedicalInvolvement: boolean;
  hasCustodyIssue: boolean;
  hasRetaliation: boolean;
  hasMultipleSystems: boolean;
  hasUrgentDeadline: boolean;
  hasSafetyRisk: boolean;
  hasChildrenInvolved: boolean;
  hasDisabilityFactor: boolean;
  
  // Timing
  incidentTiming?: 'recent' | 'weeks' | 'months' | 'over_year' | 'ongoing';
  
  // User preferences (optional, skippable)
  prefersCulturalResources?: boolean;
  prefersLanguageResources?: boolean;
  prefersCommunitySupport?: boolean;
}

export interface ClarifyingQuestion {
  id: string;
  question: string;
  reason: string; // Why this question helps
  options: { id: string; label: string }[];
  skipLabel?: string;
  condition: (context: Partial<CaseContext>) => boolean;
  applyAnswer: (answer: string, context: Partial<CaseContext>) => Partial<CaseContext>;
}

// Extract issue types from answer IDs
function extractIssueTypes(answers: Record<string, string>, system: SystemType): IssueType[] {
  const issues: IssueType[] = [];
  
  const incidentType = answers['incident-type'] || answers['issue-type'];
  
  if (incidentType) {
    const mappings: Record<string, IssueType> = {
      'force': 'excessive_force',
      'arrest': 'wrongful_arrest',
      'search': 'unlawful_search',
      'stop': 'harassment',
      'retaliation': 'retaliation',
      'discrimination': 'discrimination',
      'termination': 'wrongful_termination',
      'harassment': 'harassment',
      'accommodation': 'accommodation_denial',
      'wage': 'wage_theft',
      'eviction': 'eviction',
      'habitability': 'habitability',
      'voucher': 'other',
    };
    
    if (mappings[incidentType]) {
      issues.push(mappings[incidentType]);
    }
  }
  
  // CPS/DCYF specific
  if (system === 'cps_dcyf') {
    if (answers['case-type'] === 'investigation') issues.push('investigation');
    if (answers['case-type'] === 'custody') issues.push('custody');
  }
  
  // Retaliation detection
  if (answers['retaliation-concern'] === 'already-retaliated' || 
      answers['incident-type'] === 'retaliation') {
    if (!issues.includes('retaliation')) issues.push('retaliation');
  }
  
  return issues.length > 0 ? issues : ['other'];
}

// Determine case stage from answers
function determineCaseStage(answers: Record<string, string>): CaseStage {
  const priorComplaints = answers['prior-complaints'];
  const agencyFiling = answers['agency-filing'];
  const priority = answers['priority'];
  
  if (agencyFiling === 'eeoc' || agencyFiling === 'state' || agencyFiling === 'other-agency') {
    return 'post_filing';
  }
  
  if (priority === 'legal') {
    return 'attorney_search';
  }
  
  if (priorComplaints === 'filed' || priorComplaints === 'informal') {
    return 'gathering_information';
  }
  
  if (priority === 'document' || priority === 'understand') {
    return 'getting_oriented';
  }
  
  return 'getting_oriented';
}

// Build CaseContext from Analyzer answers
export function buildCaseContext(
  system: SystemType,
  systemLabel: string,
  answers: Record<string, string>,
  patternStrength: PatternStrength,
  entityName?: string,
  county?: string
): CaseContext {
  const issueTypes = extractIssueTypes(answers, system);
  const stage = determineCaseStage(answers);
  
  // Detect factors from answers
  const injury = answers['injury'];
  const hasInjury = injury === 'serious' || injury === 'minor';
  const hasMedicalInvolvement = injury === 'serious' || answers['medical-treatment'] === 'yes';
  
  const hasCustodyIssue = system === 'cps_dcyf' || 
    answers['case-type'] === 'custody' ||
    answers['family-situation']?.includes('children');
    
  const hasRetaliation = answers['retaliation-concern'] === 'already-retaliated' ||
    answers['retaliation-concern'] === 'likely' ||
    answers['incident-type'] === 'retaliation';
    
  const timing = answers['timing'];
  const hasUrgentDeadline = timing === 'today' || 
    answers['deadline'] === 'days' ||
    answers['notice-received'] === 'eviction-notice';
    
  const hasSafetyRisk = answers['immediate-safety'] === 'not-safe' ||
    answers['safety'] === 'not-safe' ||
    answers['safety'] === 'landlord';
    
  const familyImpact = answers['family-impact'] || answers['family-situation'];
  const hasChildrenInvolved = familyImpact === 'children-present' ||
    familyImpact === 'children' ||
    system === 'cps_dcyf';
    
  const hasDisabilityFactor = answers['issue-type'] === 'accommodation' ||
    answers['family-situation'] === 'disabled' ||
    system === 'healthcare';
  
  // Map timing to enum
  let incidentTiming: CaseContext['incidentTiming'];
  if (timing === 'today') incidentTiming = 'recent';
  else if (timing === 'weeks' || timing === 'recent') incidentTiming = 'weeks';
  else if (timing === 'months') incidentTiming = 'months';
  else if (timing === 'over-year' || timing === 'over-180') incidentTiming = 'over_year';
  else if (timing === 'ongoing') incidentTiming = 'ongoing';
  
  return {
    system,
    systemLabel,
    issueTypes,
    jurisdiction: 'both', // Default to showing both WA and Federal
    county,
    stage,
    patternStrength,
    entityName,
    hasInjury,
    hasMedicalInvolvement,
    hasCustodyIssue,
    hasRetaliation,
    hasMultipleSystems: false, // Will be updated by clarifying questions
    hasUrgentDeadline,
    hasSafetyRisk,
    hasChildrenInvolved,
    hasDisabilityFactor,
    incidentTiming,
  };
}

// Define clarifying questions that only trigger when relevant
export const clarifyingQuestions: ClarifyingQuestion[] = [
  {
    id: 'medical-response',
    question: 'Was there a medical response (EMT, ambulance, hospital)?',
    reason: 'This helps identify medical oversight resources that may be relevant.',
    options: [
      { id: 'yes-emt', label: 'Yes — EMT or ambulance responded' },
      { id: 'yes-hospital', label: 'Yes — I went to the hospital' },
      { id: 'no', label: 'No medical response' },
    ],
    skipLabel: 'Skip this question',
    condition: (ctx) => ctx.hasInjury === true && ctx.hasMedicalInvolvement !== true,
    applyAnswer: (answer, ctx) => ({
      ...ctx,
      hasMedicalInvolvement: answer === 'yes-emt' || answer === 'yes-hospital',
    }),
  },
  {
    id: 'multiple-systems',
    question: 'Are multiple systems or agencies involved in your situation?',
    reason: 'This helps us prioritize which resources to show first.',
    options: [
      { id: 'police-cps', label: 'Police and CPS/DCYF' },
      { id: 'courts-cps', label: 'Courts and CPS/DCYF' },
      { id: 'housing-benefits', label: 'Housing and benefits' },
      { id: 'other-multiple', label: 'Yes — other combination' },
      { id: 'single', label: 'Just one system' },
    ],
    skipLabel: 'Skip this question',
    condition: (ctx) => ctx.system === 'unsure' || ctx.hasMultipleSystems === undefined,
    applyAnswer: (answer, ctx) => ({
      ...ctx,
      hasMultipleSystems: answer !== 'single',
    }),
  },
  {
    id: 'community-resources',
    question: 'Would you like to see community-based or culturally specific resources?',
    reason: 'We can include additional support organizations if helpful.',
    options: [
      { id: 'yes-community', label: 'Yes — show community resources' },
      { id: 'no-official', label: 'No — focus on official channels' },
    ],
    skipLabel: 'Skip this question',
    condition: (ctx) => ctx.prefersCommunitySupport === undefined,
    applyAnswer: (answer, ctx) => ({
      ...ctx,
      prefersCommunitySupport: answer === 'yes-community',
    }),
  },
];

// Get relevant clarifying questions for a context
export function getRelevantQuestions(context: Partial<CaseContext>): ClarifyingQuestion[] {
  return clarifyingQuestions.filter(q => q.condition(context));
}

// Hook to manage case context
export function useCaseContext(
  system: SystemType,
  systemLabel: string,
  answers: Record<string, string>,
  patternStrength: PatternStrength,
  entityName?: string,
  county?: string
) {
  const context = useMemo(() => 
    buildCaseContext(system, systemLabel, answers, patternStrength, entityName, county),
    [system, systemLabel, answers, patternStrength, entityName, county]
  );
  
  const relevantQuestions = useMemo(() => 
    getRelevantQuestions(context),
    [context]
  );
  
  return {
    context,
    relevantQuestions,
    hasQuestions: relevantQuestions.length > 0,
  };
}
