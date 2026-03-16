import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface IntakePrefillData {
  narrative: string;
  incidentDate: string;
  incidentMonthYear: string;
  evidenceItems: string;
  issueType: string;
  hasClarion: boolean;
  hasTimeline: boolean;
  hasEvidence: boolean;
  hasAnalyzer: boolean;
}

/**
 * Fetches the user's existing Clarion entries, Timeline entries,
 * Evidence Vault items, and most recent Analyzer result, then
 * returns suggested pre-fill values for the Intake Packet form.
 *
 * All fields are optional suggestions — the user can edit or clear
 * any of them before generating the packet.
 */
export function useIntakePrefill() {
  const { user } = useAuth();
  const [prefillData, setPrefillData] = useState<IntakePrefillData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    async function fetchPrefillData() {
      setIsLoading(true);
      try {
        // Fetch in parallel for speed
        const [clarionRes, timelineRes, evidenceRes, analyzerRes] = await Promise.all([
          supabase
            .from("clarion_entries")
            .select("content, created_at")
            .eq("user_id", user!.id)
            .order("created_at", { ascending: false })
            .limit(5),
          supabase
            .from("timeline_entries")
            .select("title, description, event_date")
            .eq("user_id", user!.id)
            .order("event_date", { ascending: true }),
          supabase
            .from("evidence")
            .select("title, description, document_date, source")
            .eq("user_id", user!.id)
            .order("created_at", { ascending: false }),
          supabase
            .from("analyzer_results")
            .select("system, system_label, entity_name, created_at")
            .eq("user_id", user!.id)
            .order("created_at", { ascending: false })
            .limit(1),
        ]);

        if (cancelled) return;

        // ── Narrative: combine Clarion entries into a single block ──
        const clarionEntries = clarionRes.data || [];
        const hasClarion = clarionEntries.length > 0;
        let narrative = "";
        if (hasClarion) {
          // Use the most recent entry as the primary narrative
          // Older entries are appended as additional context
          narrative = clarionEntries
            .map((e) => e.content.trim())
            .filter(Boolean)
            .join("\n\n")
            .slice(0, 3900); // Stay within the 4000 char limit with room to spare
        }

        // ── Incident date: earliest timeline event ──
        const timelineEntries = timelineRes.data || [];
        const hasTimeline = timelineEntries.length > 0;
        let incidentDate = "";
        let incidentMonthYear = "";
        if (hasTimeline && timelineEntries[0]?.event_date) {
          const earliest = timelineEntries[0].event_date;
          incidentDate = earliest; // YYYY-MM-DD format for the date input
          // Convert to YYYY-MM for the month input
          incidentMonthYear = earliest.slice(0, 7);
        }

        // ── Evidence: build a plain-text list ──
        const evidenceItems = evidenceRes.data || [];
        const hasEvidence = evidenceItems.length > 0;
        let evidenceText = "";
        if (hasEvidence) {
          evidenceText = evidenceItems
            .map((item) => {
              let line = `- ${item.title}`;
              if (item.description) line += `: ${item.description}`;
              if (item.document_date) line += ` (${item.document_date})`;
              if (item.source) line += ` [Source: ${item.source}]`;
              return line;
            })
            .join("\n");
        }

        // ── Issue type: from most recent analyzer result ──
        const analyzerResults = analyzerRes.data || [];
        const hasAnalyzer = analyzerResults.length > 0;
        let issueType = "";
        if (hasAnalyzer && analyzerResults[0]?.system) {
          // The analyzer system values match the intake issueType select values exactly
          // (police, housing, cps_dcyf, schools, healthcare, benefits, courts, other)
          // Map analyzer system values to intake form issueType select values
          const systemMap: Record<string, string> = {
            police: "police",
            housing: "housing",
            cps_dcyf: "cps_dcyf",
            schools: "schools",
            healthcare: "healthcare",
            benefits: "benefits",
            courts: "other",
            employment: "employment",
            other: "other",
          };
          issueType = systemMap[analyzerResults[0].system] || "";
        }

        if (!cancelled) {
          setPrefillData({
            narrative,
            incidentDate,
            incidentMonthYear,
            evidenceItems: evidenceText,
            issueType,
            hasClarion,
            hasTimeline,
            hasEvidence,
            hasAnalyzer,
          });
        }
      } catch (err) {
        console.error("useIntakePrefill: failed to fetch prefill data", err);
        // Fail silently — the form will just start empty
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchPrefillData();
    return () => {
      cancelled = true;
    };
  }, [user]);

  return { prefillData, isLoading };
}
