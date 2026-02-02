import { useMemo, useState, useCallback } from 'react';
import { CaseContext, SystemType, IssueType, CaseStage } from './useCaseContext';
import { legalResources, LegalResource } from '@/data/legalResources';
import { supportResources, SupportResource, SystemTag } from '@/data/supportNetworkResources';

// Matched resource with relevance info
export interface MatchedResource {
  id: string;
  name: string;
  description: string;
  relevanceReason: string;
  relevanceScore: number;
  category: 'legal_help' | 'records_accountability' | 'medical_oversight' | 'community_advocacy' | 'general';
  jurisdiction: 'washington' | 'federal';
  website?: string;
  phone?: string;
  source: 'legal' | 'support';
  originalResource: LegalResource | SupportResource;
  isDismissed?: boolean;
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
  cps_dcyf: ['education', 'disability'], // CPS uses disability rights resources and education for child welfare
  unsure: [],
};

// Special resource IDs for CPS/DCYF cases
const CPS_RESOURCE_IDS = ['ofco', 'teamchild', 'ccyj', 'treehouse', 'dcyf-ombuds'];

// Issue type to category mapping for grouping
const issueToCategoryMap: Record<IssueType, MatchedResource['category'][]> = {
  excessive_force: ['legal_help', 'records_accountability'],
  wrongful_arrest: ['legal_help', 'records_accountability'],
  discrimination: ['legal_help', 'community_advocacy'],
  retaliation: ['legal_help'],
  harassment: ['legal_help', 'community_advocacy'],
  unlawful_search: ['legal_help', 'records_accountability'],
  failure_to_render_aid: ['legal_help', 'medical_oversight'],
  eviction: ['legal_help'],
  habitability: ['legal_help'],
  accommodation_denial: ['legal_help', 'community_advocacy'],
  wrongful_termination: ['legal_help'],
  wage_theft: ['legal_help'],
  custody: ['legal_help', 'community_advocacy'],
  investigation: ['legal_help', 'community_advocacy'],
  due_process: ['legal_help'],
  medical_neglect: ['medical_oversight', 'legal_help'],
  privacy_violation: ['legal_help'],
  other: ['legal_help'],
};

// Score resources by relevance
function scoreResource(
  resource: LegalResource | SupportResource,
  context: CaseContext,
  source: 'legal' | 'support'
): { score: number; reason: string; category: MatchedResource['category'] } {
  let score = 50; // Base score
  let reasons: string[] = [];
  let category: MatchedResource['category'] = 'general';
  
  if (source === 'support') {
    const supportRes = resource as SupportResource;
    
    // System match is critical
    const tags = systemToTagMap[context.system] || [];
    const hasSystemMatch = supportRes.systemTags.some(tag => tags.includes(tag));
    
    if (hasSystemMatch) {
      score += 30;
      reasons.push(`handles ${context.systemLabel} issues`);
    } else {
      score -= 20;
    }
    
    // CPS/DCYF special handling - boost family/child welfare resources
    if (context.system === 'cps_dcyf' && CPS_RESOURCE_IDS.includes(supportRes.id)) {
      score += 35;
      reasons.push('specializes in family and child welfare');
    }
    
    // Medical involvement - boost healthcare/EMS resources
    if (context.hasMedicalInvolvement && supportRes.systemTags.includes('healthcare')) {
      score += 25;
      reasons.push('medical issues were involved');
    }
    
    // EMS-specific resource
    if (context.hasMedicalInvolvement && supportRes.id === 'wa-doh-ems') {
      score += 20;
      reasons.push('EMT/ambulance oversight');
    }
    
    // Official status bonus
    if (supportRes.officialStatus === 'official') {
      score += 10;
    }
    
    // Jurisdiction preference
    if (supportRes.jurisdiction === 'washington' && context.county) {
      score += 5;
      reasons.push('Washington State agency');
    }
    
    // Category assignment based on tags and context
    if (supportRes.systemTags.includes('police')) {
      category = 'records_accountability';
    } else if (supportRes.systemTags.includes('healthcare') && context.hasMedicalInvolvement) {
      category = 'medical_oversight';
    } else if (supportRes.systemTags.includes('disability')) {
      category = 'community_advocacy';
    } else {
      category = 'records_accountability';
    }
    
  } else {
    const legalRes = resource as LegalResource;
    
    // Legal aid always relevant for attorney search stage
    if (context.stage === 'attorney_search' && legalRes.category === 'legal-aid') {
      score += 25;
      reasons.push('you indicated interest in legal help');
    }
    
    // Civil rights orgs for discrimination
    if (context.issueTypes.includes('discrimination') && legalRes.category === 'civil-rights') {
      score += 20;
      reasons.push('handles civil rights cases');
    }
    
    // CPS/DCYF specific resources - check both legal resources and support resources
    if (context.system === 'cps_dcyf' && CPS_RESOURCE_IDS.includes(legalRes.id)) {
      score += 30;
      reasons.push('specializes in child welfare cases');
    }
    
    // Disability resources
    if (context.hasDisabilityFactor && legalRes.id === 'drw') {
      score += 25;
      reasons.push('disability rights expertise');
    }
    
    // Housing resources
    if (context.system === 'housing' && legalRes.id === 'fhc') {
      score += 25;
      reasons.push('housing discrimination focus');
    }
    
    category = legalRes.category === 'advocacy' ? 'community_advocacy' : 'legal_help';
  }
  
  // Pattern strength bonus
  if (context.patternStrength === 'strong' || context.patternStrength === 'very_strong') {
    score += 10;
    if (!reasons.some(r => r.includes('pattern'))) {
      reasons.push('pattern documentation may strengthen case');
    }
  }
  
  // Retaliation factor
  if (context.hasRetaliation) {
    score += 5;
  }
  
  // Safety risk prioritization
  if (context.hasSafetyRisk) {
    score += 5;
  }
  
  const reason = reasons.length > 0 
    ? `Shown because: ${reasons.slice(0, 2).join(', ')}`
    : 'General resource for your situation';
  
  return { score, reason, category };
}

// Main matching function
export function matchResources(context: CaseContext): MatchedResource[] {
  const results: MatchedResource[] = [];
  
  // Score and add legal resources
  legalResources.forEach(resource => {
    const { score, reason, category } = scoreResource(resource, context, 'legal');
    
    if (score > 40) { // Threshold for inclusion
      results.push({
        id: resource.id,
        name: resource.name,
        description: resource.description,
        relevanceReason: reason,
        relevanceScore: score,
        category,
        jurisdiction: 'washington',
        website: resource.website,
        phone: resource.phone,
        source: 'legal',
        originalResource: resource,
      });
    }
  });
  
  // Score and add support resources
  supportResources.forEach(resource => {
    const { score, reason, category } = scoreResource(resource, context, 'support');
    
    if (score > 45) { // Slightly higher threshold
      results.push({
        id: resource.id,
        name: resource.name,
        description: resource.whatTheyDo,
        relevanceReason: reason,
        relevanceScore: score,
        category,
        jurisdiction: resource.jurisdiction,
        website: resource.website,
        phone: resource.phone,
        source: 'support',
        originalResource: resource,
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
    dismissResource,
    undoDismiss,
    showAllGeneral,
    setShowAllGeneral,
    dismissedCount: dismissedIds.size,
  };
}
