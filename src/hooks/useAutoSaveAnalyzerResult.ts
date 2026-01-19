import { useCallback, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AnalyzerResultData {
  system: string;
  systemLabel: string;
  patternStrength: string;
  answers: Record<string, string>;
  entityName?: string;
  systemControls?: string;
  systemDoesNotControl?: string;
  decisionMakers?: string;
  commonStuckPoints?: string;
  whatUsuallyHappens?: string[];
  whatPeopleMisinterpret?: string[];
  linkedGuideId?: string;
}

interface SavedResult {
  id: string;
  savedAt: Date;
}

export function useAutoSaveAnalyzerResult() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [savedResult, setSavedResult] = useState<SavedResult | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const saveAttempted = useRef(false);

  const saveAnalyzerResult = useCallback(async (data: AnalyzerResultData): Promise<boolean> => {
    // Prevent duplicate saves
    if (saveAttempted.current || !user) {
      return false;
    }

    saveAttempted.current = true;
    setIsSaving(true);
    setSaveError(null);

    try {
      const { data: result, error } = await supabase
        .from('analyzer_results')
        .insert({
          user_id: user.id,
          system: data.system,
          system_label: data.systemLabel,
          pattern_strength: data.patternStrength,
          answers: data.answers,
          entity_name: data.entityName || null,
          system_controls: data.systemControls || null,
          system_does_not_control: data.systemDoesNotControl || null,
          decision_makers: data.decisionMakers || null,
          common_stuck_points: data.commonStuckPoints || null,
          what_usually_happens: data.whatUsuallyHappens || [],
          what_people_misinterpret: data.whatPeopleMisinterpret || [],
          linked_guide_id: data.linkedGuideId || null,
        })
        .select('id')
        .single();

      if (error) {
        throw error;
      }

      setSavedResult({
        id: result.id,
        savedAt: new Date(),
      });

      return true;
    } catch (err) {
      console.error('Failed to save analyzer result:', err);
      setSaveError('Failed to save result');
      saveAttempted.current = false; // Allow retry on error
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [user]);

  const resetSaveState = useCallback(() => {
    saveAttempted.current = false;
    setSavedResult(null);
    setSaveError(null);
  }, []);

  return {
    isLoggedIn: !!user,
    isSaving,
    savedResult,
    saveError,
    saveAnalyzerResult,
    resetSaveState,
  };
}
