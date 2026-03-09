import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Clock, Plus, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface TimelineBuilderStepProps {
  onNext: () => void;
  onBack: () => void;
  timelineCount: number;
}

export function TimelineBuilderStep({ onNext, onBack, timelineCount }: TimelineBuilderStepProps) {
  const { user } = useAuth();
  const [recentEntries, setRecentEntries] = useState<{ id: string; title: string; event_date: string }[]>([]);

  useEffect(() => {
    if (user) {
      supabase
        .from("timeline_entries")
        .select("id, title, event_date")
        .eq("user_id", user.id)
        .order("event_date", { ascending: true })
        .limit(5)
        .then(({ data }) => setRecentEntries(data || []));
    }
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-muted/50 border border-border">
        <p className="text-sm text-muted-foreground text-center">
          <strong className="text-foreground">Build your timeline.</strong> A clear chronology helps professionals understand your situation quickly.
        </p>
      </div>

      <div className="p-6 rounded-xl bg-card border border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">Your Timeline</h3>
            <p className="text-sm text-muted-foreground">
              {timelineCount === 0
                ? "No events added yet."
                : `${timelineCount} event${timelineCount !== 1 ? "s" : ""} recorded.`}
            </p>
          </div>
        </div>

        {recentEntries.length > 0 && (
          <div className="space-y-2 mb-4">
            {recentEntries.map((entry) => (
              <div key={entry.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-xs text-muted-foreground shrink-0">
                  {new Date(entry.event_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
                <span className="text-sm text-foreground flex-1 truncate">{entry.title}</span>
              </div>
            ))}
          </div>
        )}

        <Button variant="outline" asChild className="w-full">
          <Link to="/timeline">
            <Plus className="w-4 h-4 mr-2" />
            {timelineCount === 0 ? "Add Your First Event" : "Edit Timeline"}
            <ExternalLink className="w-3 h-3 ml-2 opacity-50" />
          </Link>
        </Button>
      </div>

      <div className="flex justify-between gap-3 pt-2">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <Button variant="hero" onClick={onNext}>
          Continue to Legal Issues <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
