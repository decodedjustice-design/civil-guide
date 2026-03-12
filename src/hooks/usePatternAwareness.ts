/**
 * usePatternAwareness
 *
 * Cross-references a user's EntityTags and questionnaire answers against a
 * predefined set of known patterns (use of force, delayed medical care in
 * custody, CPS child removal, etc.) to surface contextual "pattern blocks" —
 * short copy snippets grounded in public records language.
 *
 * Safety rules enforced in code:
 *   - Pattern blocks only appear when patternStrength >= 'possible' AND at
 *     least 2 entity flags align (or strength is 'strong'/'very_strong').
 *   - Three mandatory disclaimer blocks are ALWAYS appended whenever any
 *     pattern block is shown (no wrongdoing assertion, not legal advice,
 *     individual case caveat).
 *   - All language is probabilistic ("has been reported", "may experience") —
 *     never conclusory about the user's specific case.
 *
 * Returns `{ hasPattern, patternBlocks }`.
 */
import { useMemo } from 'react';
import { EntityTags } from './useEntityTags';

export interface PatternCopyBlock {
  id: string;
  type: 'context' | 'caution' | 'disclaimer';
  text: string;
}

export interface PatternAwarenessResult {
  hasPattern: boolean;
  patternBlocks: PatternCopyBlock[];
}

// Allowed patterns (probabilistic language only)
const ALLOWED_PATTERNS = {
  use_of_force_pursuit: {
    requiredFlags: ['use_of_force_flag'],
    requiredAnswers: { 'incident-type': ['force'] },
    blocks: [
      {
        id: 'force_context',
        type: 'context' as const,
        text: 'This type of situation has been reported by others in similar contexts.',
      },
      {
        id: 'force_records',
        type: 'context' as const,
        text: 'Public records show concerns about use of force have been raised before in similar settings.',
      },
    ],
  },
  delayed_medical_custody: {
    requiredFlags: ['medical_involved', 'custody_status'],
    requiredAnswers: {},
    blocks: [
      {
        id: 'medical_delay_context',
        type: 'context' as const,
        text: 'Situations involving delayed medical care after detention have been documented in various settings.',
      },
      {
        id: 'medical_delay_records',
        type: 'context' as const,
        text: 'Public oversight bodies have noted similar concerns in the past.',
      },
    ],
  },
  protected_speech_arrest: {
    requiredFlags: ['law_enforcement_present'],
    requiredAnswers: { 'incident-type': ['retaliation'], 'prior-complaints': ['filed', 'informal'] },
    blocks: [
      {
        id: 'speech_context',
        type: 'context' as const,
        text: 'Others have reported similar experiences involving protected speech or complaints.',
      },
    ],
  },
  disproportionate_impact: {
    requiredFlags: ['vulnerable_person_flag'],
    requiredAnswers: {},
    blocks: [
      {
        id: 'disproportionate_context',
        type: 'context' as const,
        text: 'Research and public records indicate that certain groups may experience disproportionate impact in similar situations.',
      },
    ],
  },
  public_complaints_pattern: {
    requiredFlags: [],
    requiredAnswers: { 'prior-complaints': ['filed'], 'retaliation-concern': ['already-retaliated', 'active-case'] },
    blocks: [
      {
        id: 'complaints_context',
        type: 'context' as const,
        text: 'Public records show this issue has been raised before.',
      },
    ],
  },
  cps_child_removal: {
    requiredFlags: ['child_removed'],
    requiredAnswers: {},
    blocks: [
      {
        id: 'cps_context',
        type: 'context' as const,
        text: 'Concerns about procedural issues in child welfare cases have been documented in various jurisdictions.',
      },
    ],
  },
  medical_care_denial: {
    requiredFlags: ['care_issue_type'],
    requiredAnswers: {},
    blocks: [
      {
        id: 'care_denial_context',
        type: 'context' as const,
        text: 'Similar concerns about access to medical care have been reported in comparable situations.',
      },
    ],
  },
  eviction_vulnerable: {
    requiredFlags: ['eviction_pending', 'vulnerable_person_flag'],
    requiredAnswers: {},
    blocks: [
      {
        id: 'eviction_context',
        type: 'context' as const,
        text: 'Eviction actions affecting vulnerable household members have been subject to public attention and advocacy.',
      },
    ],
  },
  school_discipline_disparity: {
    requiredFlags: ['discipline_action', 'vulnerable_person_flag'],
    requiredAnswers: {},
    blocks: [
      {
        id: 'discipline_context',
        type: 'context' as const,
        text: 'Research has documented disparities in school discipline practices affecting certain student groups.',
      },
    ],
  },
  washington_deps_reporting: {
    requiredFlags: ['use_of_force_flag'],
    requiredEntityType: 'police',
    requiredAnyFlags: ['custody_status', 'medical_involved'],
    blocks: [
      {
        id: 'deps_reporting_context',
        type: 'context' as const,
        text: 'Washington requires reporting of certain use-of-force incidents under statewide data collection requirements.',
      },
      {
        id: 'deps_dashboard_context',
        type: 'context' as const,
        text: 'Public dashboards exist to track statewide trends in use-of-force reporting.',
      },
      {
        id: 'deps_contextual_label',
        type: 'caution' as const,
        text: 'This information is contextual, not a determination about any specific incident.',
      },
    ],
  },
};

// Required disclaimers that ALWAYS appear when any pattern is detected
const REQUIRED_DISCLAIMERS: PatternCopyBlock[] = [
  {
    id: 'no_wrongdoing_disclaimer',
    type: 'disclaimer',
    text: 'This does not mean wrongdoing occurred in your case.',
  },
  {
    id: 'not_legal_advice',
    type: 'disclaimer',
    text: 'This information is educational and does not constitute legal advice or any prediction of outcomes.',
  },
  {
    id: 'individual_case',
    type: 'disclaimer',
    text: 'Every situation is unique. General patterns do not determine what happened in any individual case.',
  },
];

// Check if entity tags match required flags
function checkFlags(entityTags: EntityTags, requiredFlags: string[]): boolean {
  if (requiredFlags.length === 0) return true;
  
  return requiredFlags.every(flag => {
    switch (flag) {
      case 'use_of_force_flag':
        return entityTags.use_of_force_flag === true;
      case 'medical_involved':
        return entityTags.medical_involved === true;
      case 'custody_status':
        return entityTags.custody_status === 'detained' || entityTags.custody_status === 'arrested';
      case 'vulnerable_person_flag':
        return entityTags.vulnerable_person_flag === true;
      case 'law_enforcement_present':
        return entityTags.law_enforcement_present === true;
      case 'child_removed':
        return entityTags.child_removed === true;
      case 'care_issue_type':
        return entityTags.care_issue_type === 'delayed' || entityTags.care_issue_type === 'denied' || entityTags.care_issue_type === 'interrupted';
      case 'eviction_pending':
        return entityTags.eviction_pending === true;
      case 'discipline_action':
        return entityTags.discipline_action === true;
      case 'special_education_involved':
        return entityTags.special_education_involved === true;
      case 'court_order_exists':
        return entityTags.court_order_exists === true;
      default:
        return false;
    }
  });
}

// Check if answers match required patterns
function checkAnswers(
  answers: Record<string, string>,
  requiredAnswers: Record<string, string[]>
): boolean {
  const answerKeys = Object.keys(requiredAnswers);
  if (answerKeys.length === 0) return true;
  
  // Need at least one matching answer (OR logic for answer requirements)
  return answerKeys.some(key => {
    const userAnswer = answers[key];
    const acceptedAnswers = requiredAnswers[key];
    return userAnswer && acceptedAnswers.includes(userAnswer);
  });
}

export function usePatternAwareness(
  entityTags: EntityTags,
  answers: Record<string, string>,
  patternStrength: 'none' | 'possible' | 'strong' | 'very_strong'
): PatternAwarenessResult {
  return useMemo(() => {
    const detectedBlocks: PatternCopyBlock[] = [];
    
    // Only show pattern blocks when pattern strength is 'possible' or higher
    // AND when multiple flags align
    if (patternStrength === 'none') {
      return { hasPattern: false, patternBlocks: [] };
    }
    
    // Count aligned flags
    let alignedFlagCount = 0;
    if (entityTags.use_of_force_flag) alignedFlagCount++;
    if (entityTags.medical_involved) alignedFlagCount++;
    if (entityTags.custody_status && entityTags.custody_status !== 'not_detained' && entityTags.custody_status !== 'unknown') alignedFlagCount++;
    if (entityTags.vulnerable_person_flag) alignedFlagCount++;
    if (entityTags.law_enforcement_present) alignedFlagCount++;
    if (entityTags.child_removed) alignedFlagCount++;
    if (entityTags.care_issue_type && entityTags.care_issue_type !== 'none') alignedFlagCount++;
    if (entityTags.eviction_pending) alignedFlagCount++;
    if (entityTags.discipline_action) alignedFlagCount++;
    if (entityTags.special_education_involved) alignedFlagCount++;
    
    // Need at least 2 aligned flags OR pattern strength >= 'strong'
    const meetsThreshold = alignedFlagCount >= 2 || patternStrength === 'strong' || patternStrength === 'very_strong';
    
    if (!meetsThreshold) {
      return { hasPattern: false, patternBlocks: [] };
    }
    
    // Check each allowed pattern
    for (const [_patternId, pattern] of Object.entries(ALLOWED_PATTERNS)) {
      const flagsMatch = checkFlags(entityTags, pattern.requiredFlags);
      const answersMatch = 'requiredAnswers' in pattern ? checkAnswers(answers, pattern.requiredAnswers) : true;
      
      // Check entity type requirement if present
      const entityTypeMatch = 'requiredEntityType' in pattern 
        ? entityTags.entity_type === pattern.requiredEntityType 
        : true;
      
      // Check requiredAnyFlags - at least one must be true
      const anyFlagsMatch = 'requiredAnyFlags' in pattern
        ? (pattern.requiredAnyFlags as string[]).some(flag => {
            if (flag === 'custody_status') {
              return entityTags.custody_status === 'detained' || entityTags.custody_status === 'arrested';
            }
            if (flag === 'medical_involved') {
              return entityTags.medical_involved === true;
            }
            return false;
          })
        : true;
      
      if (flagsMatch && answersMatch && entityTypeMatch && anyFlagsMatch) {
        // Add pattern blocks if not already present
        for (const block of pattern.blocks) {
          if (!detectedBlocks.some(b => b.id === block.id)) {
            detectedBlocks.push(block);
          }
        }
      }
    }
    
    // If we have any context blocks, add the required disclaimers
    if (detectedBlocks.length > 0) {
      detectedBlocks.push(...REQUIRED_DISCLAIMERS);
    }
    
    return {
      hasPattern: detectedBlocks.length > 0,
      patternBlocks: detectedBlocks,
    };
  }, [entityTags, answers, patternStrength]);
}
