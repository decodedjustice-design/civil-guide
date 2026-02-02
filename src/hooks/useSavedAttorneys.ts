import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "decoded-justice-saved-attorneys";

export function useSavedAttorneys() {
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync to localStorage whenever savedIds changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIds));
    } catch (e) {
      console.error("Failed to save attorneys to localStorage:", e);
    }
  }, [savedIds]);

  const saveAttorney = useCallback((id: string) => {
    setSavedIds((prev) => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
  }, []);

  const removeAttorney = useCallback((id: string) => {
    setSavedIds((prev) => prev.filter((savedId) => savedId !== id));
  }, []);

  const toggleSaved = useCallback((id: string) => {
    setSavedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((savedId) => savedId !== id);
      }
      return [...prev, id];
    });
  }, []);

  const isSaved = useCallback((id: string) => {
    return savedIds.includes(id);
  }, [savedIds]);

  return {
    savedIds,
    saveAttorney,
    removeAttorney,
    toggleSaved,
    isSaved,
    count: savedIds.length,
  };
}
