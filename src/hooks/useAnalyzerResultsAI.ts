import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface AnalyzerResultsAI {
  systemIdentification: string;
  powerDynamics: {
    whoHasControl: string[];
    whoDoesNotControl: string[];
    decisionMakers: string[];
  };
  usualProcess: string[];
  commonStuckPoints: string[];
  priorityActions: Array<{ title: string; description: string }>;
  referenceAnchors: string[];
  gentleRealityCheck: string;
  closingAffirmation: string;
}

interface GenerateInput {
  systemId: string;
  systemLabel: string;
  patternStrength: 'none' | 'possible' | 'strong' | 'very_strong';
  location?: string;
  entityName?: string;
}

interface UseAnalyzerResultsAIReturn {
  generatedResults: AnalyzerResultsAI | null;
  isGenerating: boolean;
  generateError: string | null;
  generateResults: (input: GenerateInput) => Promise<boolean>;
  resetResults: () => void;
}

export function useAnalyzerResultsAI(): UseAnalyzerResultsAIReturn {
  const [generatedResults, setGeneratedResults] = useState<AnalyzerResultsAI | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const generateResults = useCallback(async (input: GenerateInput): Promise<boolean> => {
    // Don't regenerate if we already have results for this system
    if (generatedResults && !generateError) {
      return true;
    }

    setIsGenerating(true);
    setGenerateError(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-analyzer-results', {
        body: input
      });

      if (error) {
        console.error("Edge function error:", error);
        setGenerateError("We're preparing your results. Please try again in a moment.");
        return false;
      }

      if (!data?.success || !data?.results) {
        console.error("Invalid response:", data);
        setGenerateError(data?.error || "Unable to generate results. Please try again.");
        return false;
      }

      setGeneratedResults(data.results);
      return true;

    } catch (err) {
      console.error("Generate results error:", err);
      setGenerateError("We're preparing your results. Please try again in a moment.");
      return false;
    } finally {
      setIsGenerating(false);
    }
  }, [generatedResults, generateError]);

  const resetResults = useCallback(() => {
    setGeneratedResults(null);
    setGenerateError(null);
    setIsGenerating(false);
  }, []);

  return {
    generatedResults,
    isGenerating,
    generateError,
    generateResults,
    resetResults
  };
}
