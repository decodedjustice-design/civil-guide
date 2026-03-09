import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Scale, Search, ExternalLink, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const commonIssues = [
  { id: "excessive-force", label: "Excessive Force", system: "police" },
  { id: "unlawful-search", label: "Unlawful Search & Seizure", system: "police" },
  { id: "false-arrest", label: "False Arrest / Detention", system: "police" },
  { id: "discrimination-housing", label: "Housing Discrimination", system: "housing" },
  { id: "retaliation", label: "Retaliation", system: "other" },
  { id: "due-process", label: "Due Process Violation", system: "courts" },
  { id: "equal-protection", label: "Equal Protection Violation", system: "other" },
  { id: "disability-rights", label: "Disability Rights Violation", system: "healthcare" },
  { id: "free-speech", label: "Free Speech Suppression", system: "other" },
  { id: "wrongful-removal", label: "Wrongful Child Removal", system: "cps_dcyf" },
  { id: "medical-neglect", label: "Medical Neglect in Custody", system: "healthcare" },
  { id: "benefit-denial", label: "Wrongful Benefit Denial", system: "benefits" },
];

interface LegalIssueMappingStepProps {
  onNext: () => void;
  onBack: () => void;
  isComplete: boolean;
}

export function LegalIssueMappingStep({ onNext, onBack, isComplete }: LegalIssueMappingStepProps) {
  const { user } = useAuth();
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [analyzerResults, setAnalyzerResults] = useState<{ system_label: string; pattern_strength: string }[]>([]);

  useEffect(() => {
    if (user) {
      supabase
        .from("analyzer_results")
        .select("system_label, pattern_strength")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5)
        .then(({ data }) => setAnalyzerResults(data || []));
    }
  }, [user]);

  const toggleIssue = (id: string) => {
    setSelectedIssues((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-muted/50 border border-border">
        <p className="text-sm text-muted-foreground text-center">
          <strong className="text-foreground">Identify your legal issues.</strong> This helps attorneys understand what kind of help you need. You can also use the Analyzer for deeper insight.
        </p>
      </div>

      {/* Analyzer results if any */}
      {analyzerResults.length > 0 && (
        <div className="p-5 rounded-xl bg-gold/5 border border-gold/20">
          <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
            <Search className="w-4 h-4 text-gold" />
            From Your Analyzer Results
          </h3>
          <div className="space-y-2">
            {analyzerResults.map((r, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border/50">
                <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                <span className="text-sm text-foreground">{r.system_label}</span>
                <span className="text-xs text-muted-foreground ml-auto capitalize">{r.pattern_strength.replace("_", " ")} pattern</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Manual issue selection */}
      <div className="p-6 rounded-xl bg-card border border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Scale className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">Common Civil Rights Issues</h3>
            <p className="text-sm text-muted-foreground">Select any that may apply to your situation.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {commonIssues.map((issue) => (
            <button
              key={issue.id}
              onClick={() => toggleIssue(issue.id)}
              className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all text-sm ${
                selectedIssues.includes(issue.id)
                  ? "bg-primary/10 border-primary/40 text-primary font-medium"
                  : "bg-muted/20 border-border/50 text-foreground hover:border-border"
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                selectedIssues.includes(issue.id) ? "border-primary bg-primary" : "border-muted-foreground/30"
              }`}>
                {selectedIssues.includes(issue.id) && (
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                )}
              </div>
              {issue.label}
            </button>
          ))}
        </div>

        <div className="mt-4">
          <Button variant="soft" asChild size="sm">
            <Link to="/analyzer">
              <Search className="w-4 h-4 mr-2" />
              Run Full Analysis
              <ExternalLink className="w-3 h-3 ml-2 opacity-50" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex justify-between gap-3 pt-2">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <Button variant="hero" onClick={onNext}>
          Continue to Case Packet <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
