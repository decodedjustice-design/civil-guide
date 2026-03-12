/**
 * useIntakePacket
 *
 * Saves, loads, and deletes attorney intake packets in the `intake_packets`
 * Supabase table. When a packet is generated for a specific attorney
 * (options.attorneyId provided), it also logs an entry in `attorney_contacts`
 * so the user can track their outreach history.
 *
 * All operations require the user to be authenticated; unauthenticated saves
 * show a toast prompting sign-in.
 *
 * Usage:
 *   const { savePacket, isSaving, savedPacket } = useIntakePacket({ attorneyId, attorneyName });
 */
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { IntakeFormData } from "@/components/intake/IntakePacketForm";

interface SavedPacket {
  id: string;
  savedAt: Date;
}

interface UseIntakePacketOptions {
  attorneyId?: string;
  attorneyName?: string;
  attorneyFirm?: string;
}

export function useIntakePacket(options: UseIntakePacketOptions = {}) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [savedPacket, setSavedPacket] = useState<SavedPacket | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const savePacket = useCallback(
    async (data: IntakeFormData): Promise<string | null> => {
      if (!user) {
        toast({
          title: "Sign in required",
          description: "Please sign in to save your intake packet.",
          variant: "destructive",
        });
        return null;
      }

      setIsSaving(true);
      setSaveError(null);

      try {
        // Parse evidence items into array
        const evidenceSnapshot = data.evidenceItems
          ? data.evidenceItems
              .split("\n")
              .map((line) => line.trim())
              .filter((line) => line.length > 0)
              .map((item) => ({ description: item }))
          : [];

        const { data: result, error } = await supabase
          .from("intake_packets")
          .insert({
            user_id: user.id,
            attorney_id: options.attorneyId || null,
            attorney_name: options.attorneyName || null,
            attorney_firm: options.attorneyFirm || null,
            case_name: data.caseName,
            county: data.county,
            incident_month_year: data.incidentMonthYear,
            issue_type: data.issueType,
            opposing_party: data.opposingParty,
            case_status: data.caseStatus,
            narrative: data.narrative,
            issues_checklist: data.issuesChecklist,
            evidence_snapshot: evidenceSnapshot,
            incident_date: data.incidentDate || null,
            statute_of_limitations_info: null,
            contact_name: data.contactName,
            contact_email: data.contactEmail || null,
            contact_phone: data.contactPhone || null,
            contact_preferred_method: data.contactPreferredMethod,
          })
          .select("id")
          .single();

        if (error) throw error;

        const packetId = result.id;

        // If this was generated for a specific attorney, log the contact
        if (options.attorneyId && options.attorneyName) {
          await supabase.from("attorney_contacts").insert({
            user_id: user.id,
            attorney_id: options.attorneyId,
            attorney_name: options.attorneyName,
            attorney_firm: options.attorneyFirm || null,
            intake_packet_id: packetId,
            contact_method: "intake_packet",
            status: "sent",
          });
        }

        setSavedPacket({
          id: packetId,
          savedAt: new Date(),
        });

        toast({
          title: "Packet saved",
          description: "Your intake packet has been saved to Exports.",
        });

        return packetId;
      } catch (err) {
        console.error("Failed to save intake packet:", err);
        setSaveError("Failed to save packet");
        toast({
          title: "Error saving packet",
          description: "Could not save your intake packet. Please try again.",
          variant: "destructive",
        });
        return null;
      } finally {
        setIsSaving(false);
      }
    },
    [user, options, toast]
  );

  const loadPacket = useCallback(
    async (packetId: string) => {
      if (!user) return null;

      try {
        const { data, error } = await supabase
          .from("intake_packets")
          .select("id, user_id, case_name, county, incident_month_year, issue_type, opposing_party, case_status, narrative, issues_checklist, evidence_snapshot, incident_date, statute_of_limitations_info, attorney_id, attorney_name, attorney_firm, contact_name, contact_email, contact_phone, contact_preferred_method, created_at, updated_at")
          .eq("id", packetId)
          .eq("user_id", user.id)
          .single();

        if (error) throw error;
        return data;
      } catch (err) {
        console.error("Failed to load packet:", err);
        return null;
      }
    },
    [user]
  );

  const deletePacket = useCallback(
    async (packetId: string) => {
      if (!user) return false;

      try {
        const { error } = await supabase
          .from("intake_packets")
          .delete()
          .eq("id", packetId)
          .eq("user_id", user.id);

        if (error) throw error;

        toast({
          title: "Packet deleted",
          description: "The intake packet has been removed.",
        });

        return true;
      } catch (err) {
        console.error("Failed to delete packet:", err);
        toast({
          title: "Error",
          description: "Could not delete the packet.",
          variant: "destructive",
        });
        return false;
      }
    },
    [user, toast]
  );

  return {
    isLoggedIn: !!user,
    isSaving,
    savedPacket,
    saveError,
    savePacket,
    loadPacket,
    deletePacket,
  };
}
