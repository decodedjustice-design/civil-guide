import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormSection, FormFieldWrapper, DjInput, DjTextarea } from "@/components/ui/dj-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Heart, Radar, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { CaseSignalReview, type CaseSignals, type SignalIssue, type SignalEvidence, type SignalTimeline } from "./CaseSignalReview";

const issueTypes = [
  { value: "police", label: "Police / Law Enforcement" },
  { value: "housing", label: "Housing / Landlord" },
  { value: "courts", label: "Courts / Legal System" },
  { value: "healthcare", label: "Healthcare" },
  { value: "schools", label: "Schools / Education" },
  { value: "benefits", label: "Government Benefits" },
  { value: "cps_dcyf", label: "CPS / DCYF" },
  { value: "other", label: "Other" },
];

const waCounties = [
  "King", "Pierce", "Snohomish", "Spokane", "Clark", "Thurston", "Kitsap",
  "Yakima", "Whatcom", "Benton", "Skagit", "Cowlitz", "Grant", "Lewis",
  "Grays Harbor", "Mason", "Chelan", "Clallam", "Franklin", "Walla Walla",
  "Island", "Stevens", "Whitman", "Douglas", "Okanogan", "Jefferson",
  "Kittitas", "San Juan", "Pacific", "Adams", "Asotin", "Columbia",
  "Ferry", "Garfield", "Klickitat", "Lincoln", "Pend Oreille", "Skamania", "Wahkiakum",
];

interface IncidentIntakeStepProps {
  onComplete: () => void;
  isAlreadyComplete: boolean;
}

export function IncidentIntakeStep({ onComplete, isAlreadyComplete }: IncidentIntakeStepProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [signals, setSignals] = useState<CaseSignals | null>(null);

  const [caseName, setCaseName] = useState("");
  const [issueType, setIssueType] = useState("");
  const [county, setCounty] = useState("");
  const [incidentMonth, setIncidentMonth] = useState("");
  const [description, setDescription] = useState("");
  const [opposingParty, setOpposingParty] = useState("");

  const runSignalEngine = async () => {
    if (!description.trim() || description.trim().length < 10) {
      toast({ title: "More detail needed", description: "Please write at least a couple sentences about what happened.", variant: "destructive" });
      return;
    }
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("case-signal-engine", {
        body: { narrative: description, issueType, opposingParty },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setSignals(data as CaseSignals);
    } catch (err: any) {
      console.error("Signal engine error:", err);
      toast({ title: "Analysis error", description: err.message || "Could not analyze narrative.", variant: "destructive" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applySignals = async (selected: {
    issues: SignalIssue[];
    evidence: SignalEvidence[];
    timeline: SignalTimeline[];
  }) => {
    if (!user) return;
    setIsApplying(true);
    try {
      const promises: Promise<any>[] = [];

      // Add evidence suggestions as evidence items
      if (selected.evidence.length > 0) {
        const evidenceRows = selected.evidence.map((ev) => ({
          user_id: user.id,
          title: ev.type,
          description: ev.why,
          source: "Case Signal Engine suggestion",
          relevance_notes: `Related to: ${ev.related_issue} (${ev.priority} priority)`,
        }));
        promises.push(supabase.from("evidence").insert(evidenceRows));
      }

      // Add timeline suggestions as timeline entries
      if (selected.timeline.length > 0) {
        const timelineRows = selected.timeline.map((t) => ({
          user_id: user.id,
          title: t.title,
          description: `${t.description} (approx: ${t.approximate_date})`,
          event_date: new Date().toISOString().split("T")[0], // placeholder date
        }));
        promises.push(supabase.from("timeline_entries").insert(timelineRows));
      }

      await Promise.all(promises);

      const parts: string[] = [];
      if (selected.issues.length) parts.push(`${selected.issues.length} issue(s)`);
      if (selected.evidence.length) parts.push(`${selected.evidence.length} evidence suggestion(s)`);
      if (selected.timeline.length) parts.push(`${selected.timeline.length} timeline event(s)`);

      toast({ title: "Signals applied", description: `Added ${parts.join(", ")} to your case.` });
      setSignals(null);
    } catch (err) {
      console.error("Apply signals error:", err);
      toast({ title: "Error", description: "Could not apply some suggestions.", variant: "destructive" });
    } finally {
      setIsApplying(false);
    }
  };

  const handleSubmit = async () => {
    if (!user || !issueType || !county) return;

    setIsSaving(true);
    try {
      const { data: existing } = await supabase
        .from("justice_place_cases")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("justice_place_cases")
          .update({
            case_name: caseName || "My Case",
            issue_type: issueType,
            county,
            incident_month_year: incidentMonth || null,
          })
          .eq("id", existing.id);
      } else {
        await supabase.from("justice_place_cases").insert({
          user_id: user.id,
          case_name: caseName || "My Case",
          issue_type: issueType,
          county,
          incident_month_year: incidentMonth || null,
          state: "WA",
        });
      }

      if (description.trim()) {
        await supabase.from("clarion_entries").insert({
          user_id: user.id,
          content: `Case Description: ${description}${opposingParty ? `\nOpposing Party: ${opposingParty}` : ""}`,
        });
      }

      toast({ title: "Intake saved", description: "Your incident details have been recorded." });
      onComplete();
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Could not save intake.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isAlreadyComplete) {
    return (
      <div className="space-y-6">
        <div className="p-5 rounded-xl bg-gold/10 border border-gold/30 flex items-start gap-3">
          <Heart className="w-5 h-5 text-gold shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Intake already completed</p>
            <p className="text-sm text-muted-foreground mt-1">
              You've already recorded your incident details. You can proceed to the next step or update your information below.
            </p>
          </div>
        </div>
        <Button variant="hero" onClick={onComplete}>
          Continue to Evidence Vault <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Wellbeing note */}
      <div className="p-4 rounded-xl bg-muted/50 border border-border">
        <p className="text-sm text-muted-foreground text-center">
          <strong className="text-foreground">Take your time.</strong> You don't need to have everything figured out. Start with what you know.
        </p>
      </div>

      <FormSection title="About Your Situation" description="Help us understand the basics so we can guide you through the right steps.">
        <FormFieldWrapper label="Case Name" hint="A short name for your reference (e.g., 'Housing Dispute 2024')">
          <DjInput value={caseName} onChange={(e) => setCaseName(e.target.value)} placeholder="My case..." />
        </FormFieldWrapper>

        <FormFieldWrapper label="Type of Issue" required>
          <Select value={issueType} onValueChange={setIssueType}>
            <SelectTrigger className="h-11"><SelectValue placeholder="Select the system involved..." /></SelectTrigger>
            <SelectContent>
              {issueTypes.map((t) => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormFieldWrapper>

        <FormFieldWrapper label="County" required hint="Washington State county where this occurred.">
          <Select value={county} onValueChange={setCounty}>
            <SelectTrigger className="h-11"><SelectValue placeholder="Select county..." /></SelectTrigger>
            <SelectContent>
              {waCounties.map((c) => (
                <SelectItem key={c} value={c}>{c} County</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormFieldWrapper>

        <FormFieldWrapper label="When did this happen?" hint="Approximate month and year is fine.">
          <DjInput type="month" value={incidentMonth} onChange={(e) => setIncidentMonth(e.target.value)} />
        </FormFieldWrapper>
      </FormSection>

      <FormSection title="What Happened" description="In your own words, briefly describe what happened. You can add more detail later.">
        <FormFieldWrapper label="Opposing Party" hint="Person, agency, or organization involved.">
          <DjInput value={opposingParty} onChange={(e) => setOpposingParty(e.target.value)} placeholder="e.g., Seattle PD, landlord name..." />
        </FormFieldWrapper>

        <FormFieldWrapper label="Brief Description">
          <DjTextarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what happened in a few sentences..."
            rows={5}
          />
        </FormFieldWrapper>

        {/* Signal Engine trigger */}
        {description.trim().length >= 10 && !signals && (
          <Button
            variant="soft"
            size="sm"
            onClick={runSignalEngine}
            disabled={isAnalyzing}
            className="mt-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-1 animate-spin" /> Analyzing your narrative…
              </>
            ) : (
              <>
                <Radar className="w-4 h-4 mr-1" /> Detect Issues & Evidence
              </>
            )}
          </Button>
        )}
      </FormSection>

      {/* Signal Review */}
      {signals && (
        <CaseSignalReview
          signals={signals}
          onConfirm={applySignals}
          onDismiss={() => setSignals(null)}
          isApplying={isApplying}
        />
      )}

      <div className="flex justify-end gap-3 pt-2">
        <Button
          variant="hero"
          size="lg"
          onClick={handleSubmit}
          disabled={!issueType || !county || isSaving}
        >
          {isSaving ? "Saving..." : "Save & Continue"}
          <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
