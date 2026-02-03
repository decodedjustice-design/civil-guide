import { useMemo, useState, useCallback } from 'react';
import { CaseContext, SystemType, IssueType, CaseStage, ProtectedClass, LanguagePreference, IssueCategory } from './useCaseContext';
import { legalResources, LegalResource, CulturalTag, LanguageService } from '@/data/legalResources';
import { supportResources, SupportResource, SystemTag } from '@/data/supportNetworkResources';

// Matched resource with relevance info (internal scoring only)
export interface MatchedResource {
  id: string;
  name: string;
  description: string;
  relevanceScore: number; // Internal only - never exposed to UI
  category: 'legal_help' | 'records_accountability' | 'medical_oversight' | 'community_advocacy' | 'additional_support' | 'general';
  jurisdiction: 'washington' | 'federal';
  website?: string;
  phone?: string;
  source: 'legal' | 'support';
  originalResource: LegalResource | SupportResource;
  isDismissed?: boolean;
  isCulturalResource?: boolean; // For grouping as "additional support"
}

// System ID to Support Network tag mapping
const systemToTagMap: Record<SystemType, SystemTag[]> = {
  police: ['police'],
  employer: ['employment'],
  housing: ['housing'],
  school: ['education'],
  healthcare: ['healthcare', 'disability'],
  courts: ['courts'],
  jail: ['incarceration'],
  government: ['government'],
  cps_dcyf: ['education', 'disability'],
  unsure: [],
};

// Special resource IDs for CPS/DCYF cases
const CPS_RESOURCE_IDS = ['ofco', 'teamchild', 'ccyj', 'treehouse', 'dcyf-ombuds'];

// Map protected class to cultural tags
const protectedClassToCulturalTags: Partial<Record<ProtectedClass, CulturalTag[]>> = {
  race_black: ['black_african_american'],
  race_hispanic_latino: ['hispanic_latino'],
  race_asian: ['asian_pacific_islander'],
  race_native_american: ['native_american'],
  race_pacific_islander: ['asian_pacific_islander'],
  lgbtq: ['lgbtq'],
  disability: ['disability'],
  veteran: ['veteran'],
};

// Map language preference to language service
const languageToService: Partial<Record<LanguagePreference, LanguageService>> = {
  spanish: 'spanish',
  chinese: 'chinese',
  vietnamese: 'vietnamese',
  korean: 'korean',
  russian: 'russian',
  somali: 'somali',
};

// Issue category to resource category mapping
const issueCategoryToResourceCategory: Record<IssueCategory, MatchedResource['category'][]> = {
  force: ['legal_help', 'records_accountability'],
  housing: ['legal_help', 'community_advocacy'],
  discrimination: ['legal_help', 'community_advocacy'],
  medical: ['medical_oversight', 'legal_help'],
  employment: ['legal_help', 'records_accountability'],
  education: ['legal_help', 'community_advocacy'],
  custody: ['legal_help', 'community_advocacy'],
  other: ['legal_help'],
};

// Score resources by relevance (internal only - never exposed)
function scoreResource(
  resource: LegalResource | SupportResource,
  context: CaseContext,
  source: 'legal' | 'support'
): { score: number; category: MatchedResource['category']; isCultural: boolean } {
  let score = 50; // Base score
  let category: MatchedResource['category'] = 'general';
  let isCultural = false;
  
  if (source === 'support') {
    const supportRes = resource as SupportResource;
    
    // System match is critical
    const tags = systemToTagMap[context.system] || [];
    const hasSystemMatch = supportRes.systemTags.some(tag => tags.includes(tag));
    
    if (hasSystemMatch) {
      score += 30;
    } else {
      score -= 20;
    }
    
    // CPS/DCYF special handling
    if (context.system === 'cps_dcyf' && CPS_RESOURCE_IDS.includes(supportRes.id)) {
      score += 35;
    }
    
    // Medical involvement
    if (context.hasMedicalInvolvement && supportRes.systemTags.includes('healthcare')) {
      score += 25;
    }
    
    // EMS-specific resource
    if (context.hasMedicalInvolvement && supportRes.id === 'wa-doh-ems') {
      score += 20;
    }
    
    // Official status bonus
    if (supportRes.officialStatus === 'official') {
      score += 10;
    }
    
    // Geographic match - county level
    if (supportRes.jurisdiction === 'washington' && context.county) {
      score += 5;
      // Additional boost for county-specific resources
      if (supportRes.id.includes(context.county.toLowerCase().replace(' ', '-'))) {
        score += 15;
      }
    }
    
    // Issue category alignment
    const relevantCategories = issueCategoryToResourceCategory[context.issueCategory] || ['legal_help'];
    
    // Category assignment
    if (supportRes.systemTags.includes('police')) {
      category = 'records_accountability';
    } else if (supportRes.systemTags.includes('healthcare') && context.hasMedicalInvolvement) {
      category = 'medical_oversight';
    } else if (supportRes.systemTags.includes('disability')) {
      category = 'community_advocacy';
    } else if (relevantCategories.includes('records_accountability')) {
      category = 'records_accountability';
    } else {
      category = 'legal_help';
    }
    
  } else {
    const legalRes = resource as LegalResource;
    
    // Legal aid relevance for attorney search stage
    if (context.stage === 'attorney_search' && legalRes.category === 'legal-aid') {
      score += 25;
    }
    
    // Civil rights orgs for discrimination
    if (context.issueCategory === 'discrimination' && legalRes.category === 'civil-rights') {
      score += 20;
    }
    
    // CPS/DCYF specific resources
    if (context.system === 'cps_dcyf' && CPS_RESOURCE_IDS.includes(legalRes.id)) {
      score += 30;
    }
    
    // Disability resources
    if (context.hasDisabilityFactor && legalRes.id === 'drw') {
      score += 25;
    }
    
    // Housing resources for housing issues
    if (context.issueCategory === 'housing' && legalRes.id === 'fhc') {
      score += 25;
    }
    
    // Geographic match - county-specific legal resources
    if (legalRes.counties && legalRes.counties.length > 0 && context.county) {
      if (legalRes.counties.includes(context.county)) {
        score += 20;
      } else {
        score -= 10; // Slight penalty for non-matching county-specific resources
      }
    }
    
    // Language preference matching
    if (context.languagePreference && context.languagePreference !== 'english') {
      const langService = languageToService[context.languagePreference];
      if (langService && legalRes.languageServices?.includes(langService)) {
        score += 15;
      }
    }
    
    // Cultural/identity resource matching
    if (context.protectedClass && context.protectedClass !== 'prefer_not_to_say') {
      const culturalTags = protectedClassToCulturalTags[context.protectedClass] || [];
      if (legalRes.culturalTags && culturalTags.some(tag => legalRes.culturalTags?.includes(tag))) {
        score += 20;
        isCultural = true;
        category = 'additional_support'; // Cultural resources go to additional support
      }
    }
    
    // Default category based on resource type
    if (!isCultural) {
      category = legalRes.category === 'advocacy' ? 'community_advocacy' : 'legal_help';
    }
  }
  
  // Pattern strength bonus
  if (context.patternStrength === 'strong' || context.patternStrength === 'very_strong') {
    score += 10;
  }
  
  // Retaliation factor
  if (context.hasRetaliation) {
    score += 5;
  }
  
  // Safety risk prioritization
  if (context.hasSafetyRisk) {
    score += 5;
  }
  
  // Entity type matching for police-specific resources
  if (context.entityType === 'police' && source === 'support') {
    const supportRes = resource as SupportResource;
    if (supportRes.systemTags.includes('police')) {
      score += 10;
    }
  }
  
  return { score, category, isCultural };
}

// Main matching function
export function matchResources(context: CaseContext): MatchedResource[] {
  const results: MatchedResource[] = [];
  
  // Score and add legal resources
  legalResources.forEach(resource => {
    const { score, category, isCultural } = scoreResource(resource, context, 'legal');
    
    // Never exclude general resources - all get included but sorted by score
    if (score > 30) {
      results.push({
        id: resource.id,
        name: resource.name,
        description: resource.description,
        relevanceScore: score,
        category,
        jurisdiction: 'washington',
        website: resource.website,
        phone: resource.phone,
        source: 'legal',
        originalResource: resource,
        isCulturalResource: isCultural,
      });
    }
  });
  
  // Score and add support resources
  supportResources.forEach(resource => {
    const { score, category, isCultural } = scoreResource(resource, context, 'support');
    
    if (score > 35) {
      results.push({
        id: resource.id,
        name: resource.name,
        description: resource.whatTheyDo,
        relevanceScore: score,
        category,
        jurisdiction: resource.jurisdiction,
        website: resource.website,
        phone: resource.phone,
        source: 'support',
        originalResource: resource,
        isCulturalResource: isCultural,
      });
    }
  });
  
  // Sort by relevance score descending
  results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  
  return results;
}

// Group resources by category
export function groupResourcesByCategory(resources: MatchedResource[]): Record<MatchedResource['category'], MatchedResource[]> {
  const groups: Record<MatchedResource['category'], MatchedResource[]> = {
    legal_help: [],
    records_accountability: [],
    medical_oversight: [],
    community_advocacy: [],
    additional_support: [],
    general: [],
  };
  
  resources.forEach(resource => {
    if (!resource.isDismissed) {
      groups[resource.category].push(resource);
    }
  });
  
  return groups;
}

// Category labels for display
export const categoryLabels: Record<MatchedResource['category'], string> = {
  legal_help: 'Legal Help',
  records_accountability: 'Records & Accountability',
  medical_oversight: 'Medical / EMT Oversight',
  community_advocacy: 'Community & Advocacy',
  additional_support: 'Additional Support',
  general: 'General Resources',
};

// Hook for resource matching with state management
export function useResourceMatching(context: CaseContext | null) {
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [showAllGeneral, setShowAllGeneral] = useState(false);
  
  const allResources = useMemo(() => {
    if (!context) return [];
    return matchResources(context);
  }, [context]);
  
  const resources = useMemo(() => {
    return allResources.map(r => ({
      ...r,
      isDismissed: dismissedIds.has(r.id),
    }));
  }, [allResources, dismissedIds]);
  
  const groupedResources = useMemo(() => 
    groupResourcesByCategory(resources),
    [resources]
  );
  
  const topResources = useMemo(() => 
    resources.filter(r => !r.isDismissed).slice(0, 6),
    [resources]
  );
  
  // Separate cultural/identity resources for "additional support" display
  const additionalSupportResources = useMemo(() =>
    resources.filter(r => r.isCulturalResource && !r.isDismissed),
    [resources]
  );
  
  const dismissResource = useCallback((id: string) => {
    setDismissedIds(prev => new Set([...prev, id]));
  }, []);
  
  const undoDismiss = useCallback((id: string) => {
    setDismissedIds(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);
  
  return {
    resources,
    groupedResources,
    topResources,
    additionalSupportResources,
    dismissResource,
    undoDismiss,
    showAllGeneral,
    setShowAllGeneral,
    dismissedCount: dismissedIds.size,
  };
}
