import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, FolderOpen, Plus, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface EvidenceVaultStepProps {
  onNext: () => void;
  onBack: () => void;
  evidenceCount: number;
}

export function EvidenceVaultStep({ onNext, onBack, evidenceCount }: EvidenceVaultStepProps) {
  const { user } = useAuth();
  const [recentEvidence, setRecentEvidence] = useState<{ id: string; title: string; file_type: string | null; created_at: string }[]>([]);

  useEffect(() => {
    if (user) {
      supabase
        .from("evidence")
        .select("id, title, file_type, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5)
        .then(({ data }) => setRecentEvidence(data || []));
    }
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-muted/50 border border-border">
        <p className="text-sm text-muted-foreground text-center">
          <strong className="text-foreground">Gather what you have.</strong> Documents, photos, emails, recordings — anything that supports your situation.
        </p>
      </div>

      {/* Current status */}
      <div className="p-6 rounded-xl bg-card border border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <FolderOpen className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">Your Evidence Vault</h3>
            <p className="text-sm text-muted-foreground">
              {evidenceCount === 0
                ? "No evidence uploaded yet."
                : `${evidenceCount} item${evidenceCount !== 1 ? "s" : ""} in your vault.`}
            </p>
          </div>
        </div>

        {recentEvidence.length > 0 && (
          <div className="space-y-2 mb-4">
            {recentEvidence.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                <div className="w-2 h-2 rounded-full bg-gold" />
                <span className="text-sm text-foreground flex-1 truncate">{item.title}</span>
                <span className="text-xs text-muted-foreground">{item.file_type || "document"}</span>
              </div>
            ))}
          </div>
        )}

        <Button variant="outline" asChild className="w-full">
          <Link to="/evidence-vault">
            <Plus className="w-4 h-4 mr-2" />
            {evidenceCount === 0 ? "Upload Your First Evidence" : "Add More Evidence"}
            <ExternalLink className="w-3 h-3 ml-2 opacity-50" />
          </Link>
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex justify-between gap-3 pt-2">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <Button variant="hero" onClick={onNext}>
          Continue to Timeline <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
