import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export type PatternStrength = 'none' | 'possible' | 'strong' | 'very_strong';
export type CivilRightsSystem = 'police' | 'housing' | 'cps_dcyf' | 'schools' | 'healthcare' | 'benefits' | 'courts' | 'other';

export interface CaseProfile {
  id?: string;
  system: CivilRightsSystem;
  entity: string;
  entityType?: string;
  claimTags: string[];
  dateStart?: string;
  dateEnd?: string;
  locationCity?: string;
  locationCounty?: string;
  description?: string;
}

export interface PatternMatch {
  id: string;
  entity: string;
  entityType?: string;
  patternType: string;
  claimTags: string[];
  caseCount: number;
  description?: string;
  source?: string;
  isVerified: boolean;
}

export interface PatternAnalysis {
  strength: PatternStrength;
  matches: PatternMatch[];
  entityPatterns: PatternMatch[];
  claimPatterns: PatternMatch[];
  totalRelatedCases: number;
  notes: string;
}

// Map Analyzer system IDs to database enum values
const systemMapping: Record<string, CivilRightsSystem> = {
  police: 'police',
  housing: 'housing',
  school: 'schools',
  healthcare: 'healthcare',
  government: 'benefits',
  courts: 'courts',
  jail: 'other',
  employer: 'other',
  unsure: 'other',
};

// Map answer IDs to claim tags
const claimTagMapping: Record<string, string[]> = {
  // Police
  force: ['excessive_force', 'use_of_force'],
  arrest: ['wrongful_arrest', 'false_imprisonment'],
  search: ['unlawful_search', 'fourth_amendment'],
  stop: ['harassment', 'racial_profiling'],
  retaliation: ['retaliation', 'first_amendment'],
  // Housing
  discrimination: ['discrimination', 'fair_housing'],
  eviction: ['wrongful_eviction', 'due_process'],
  habitability: ['habitability', 'unsafe_conditions'],
  accommodation: ['ada_violation', 'reasonable_accommodation'],
  // CPS/DCYF related
  'due-process': ['due_process', 'procedural_violation'],
  // Schools
  discipline: ['discipline_disparity', 'due_process'],
  iep: ['special_education', 'idea_violation'],
  harassment: ['harassment', 'title_ix'],
  // Healthcare
  access: ['denied_care', 'medical_neglect'],
  privacy: ['hipaa_violation', 'privacy'],
  billing: ['billing_fraud', 'insurance_denial'],
  // General
  injury: ['physical_injury', 'excessive_force'],
  ongoing: ['pattern_ongoing'],
  past: ['pattern_past'],
};

export function usePatternEngine() {
  const { user } = useAuth();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<PatternAnalysis | null>(null);

  const mapSystemToEnum = useCallback((systemId: string): CivilRightsSystem => {
    return systemMapping[systemId] || 'other';
  }, []);

  const extractClaimTags = useCallback((answers: Record<string, string>): string[] => {
    const tags: string[] = [];
    Object.values(answers).forEach(answerId => {
      const mappedTags = claimTagMapping[answerId];
      if (mappedTags) {
        tags.push(...mappedTags);
      }
    });
    return [...new Set(tags)]; // Remove duplicates
  }, []);

  const calculatePatternStrength = useCallback((matches: PatternMatch[], totalCases: number): PatternStrength => {
    if (matches.length === 0 || totalCases === 0) return 'none';
    
    const hasVerified = matches.some(m => m.isVerified);
    const highCaseCount = totalCases >= 10;
    const multipleSources = new Set(matches.map(m => m.source)).size > 1;
    
    if (hasVerified && highCaseCount) return 'very_strong';
    if (hasVerified || (highCaseCount && multipleSources)) return 'strong';
    if (totalCases >= 3 || matches.length >= 2) return 'possible';
    return 'none';
  }, []);

  const analyzePatterns = useCallback(async (
    systemId: string,
    entity: string,
    answers: Record<string, string>
  ): Promise<PatternAnalysis> => {
    setIsAnalyzing(true);
    
    try {
      const system = mapSystemToEnum(systemId);
      const claimTags = extractClaimTags(answers);
      
      // Query known patterns for matching entity
      const { data: entityMatches, error: entityError } = await supabase
        .from('known_patterns')
        .select('*')
        .eq('system', system)
        .ilike('entity', `%${entity}%`);
      
      if (entityError) throw entityError;
      
      // Query patterns by claim tags (using overlap)
      const { data: claimMatches, error: claimError } = await supabase
        .from('known_patterns')
        .select('*')
        .eq('system', system)
        .overlaps('claim_tags', claimTags);
      
      if (claimError) throw claimError;
      
      // Transform matches
      const transformMatch = (row: any): PatternMatch => ({
        id: row.id,
        entity: row.entity,
        entityType: row.entity_type,
        patternType: row.pattern_type,
        claimTags: row.claim_tags || [],
        caseCount: row.case_count || 1,
        description: row.description,
        source: row.source,
        isVerified: row.is_verified,
      });
      
      const entityPatterns = (entityMatches || []).map(transformMatch);
      const claimPatterns = (claimMatches || [])
        .filter(m => !entityMatches?.some(e => e.id === m.id))
        .map(transformMatch);
      
      const allMatches = [...entityPatterns, ...claimPatterns];
      const totalCases = allMatches.reduce((sum, m) => sum + m.caseCount, 0);
      const strength = calculatePatternStrength(allMatches, totalCases);
      
      // Generate analysis notes
      let notes = '';
      if (strength === 'very_strong') {
        notes = `Strong documented pattern found. ${entityPatterns.length > 0 ? `${entity} has ${totalCases}+ related cases on record.` : ''} This strengthens escalation options.`;
      } else if (strength === 'strong') {
        notes = `Pattern evidence detected. Similar complaints have been filed. This may support broader action.`;
      } else if (strength === 'possible') {
        notes = `Some related cases exist. More documentation may reveal a clearer pattern.`;
      } else {
        notes = `No established pattern detected yet. Your case may be the first documented, or data is limited. Focus on thorough documentation.`;
      }
      
      const analysisResult: PatternAnalysis = {
        strength,
        matches: allMatches,
        entityPatterns,
        claimPatterns,
        totalRelatedCases: totalCases,
        notes,
      };
      
      setAnalysis(analysisResult);
      return analysisResult;
    } catch (error) {
      console.error('Pattern analysis error:', error);
      toast.error('Could not complete pattern analysis');
      
      const fallback: PatternAnalysis = {
        strength: 'none',
        matches: [],
        entityPatterns: [],
        claimPatterns: [],
        totalRelatedCases: 0,
        notes: 'Analysis unavailable. Continue with documentation.',
      };
      setAnalysis(fallback);
      return fallback;
    } finally {
      setIsAnalyzing(false);
    }
  }, [mapSystemToEnum, extractClaimTags, calculatePatternStrength]);

  const saveCaseProfile = useCallback(async (profile: CaseProfile): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to save your case profile');
      return false;
    }
    
    try {
      const { error } = await supabase.from('case_profiles').insert({
        user_id: user.id,
        system: profile.system,
        entity: profile.entity,
        entity_type: profile.entityType,
        claim_tags: profile.claimTags,
        date_start: profile.dateStart,
        date_end: profile.dateEnd,
        location_city: profile.locationCity,
        location_county: profile.locationCounty,
        description: profile.description,
        pattern_strength: analysis?.strength || 'none',
        pattern_notes: analysis?.notes,
      });
      
      if (error) throw error;
      
      toast.success('Case profile saved');
      return true;
    } catch (error) {
      console.error('Save case profile error:', error);
      toast.error('Could not save case profile');
      return false;
    }
  }, [user, analysis]);

  return {
    isAnalyzing,
    analysis,
    analyzePatterns,
    saveCaseProfile,
    mapSystemToEnum,
    extractClaimTags,
  };
}
