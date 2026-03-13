import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Radar,
  AlertTriangle,
  FileSearch,
  Clock,
  Users,
  CheckCircle2,
  Loader2,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";

export interface SignalActor {
  name: string;
  role: "subject" | "witness" | "authority" | "opposing_party" | "advocate" | "other";
}

export interface SignalIssue {
  id: string;
  label: string;
  confidence: "possible" | "likely" | "strong";
  reason: string;
}

export interface SignalEvidence {
  type: string;
  why: string;
  related_issue: string;
  priority: "high" | "medium" | "low";
}

export interface SignalTimeline {
  title: string;
  description: string;
  approximate_date: string;
  iso_date?: string;
}

export interface CaseSignals {
  actors: SignalActor[];
  issues: SignalIssue[];
  evidence_suggestions: SignalEvidence[];
  timeline_suggestions: SignalTimeline[];
}

interface CaseSignalReviewProps {
  signals: CaseSignals;
  onConfirm: (selected: {
    issues: SignalIssue[];
    evidence: SignalEvidence[];
    timeline: SignalTimeline[];
  }) => void;
  onDismiss: () => void;
  isApplying?: boolean;
}

const confidenceColor: Record<string, string> = {
  strong: "bg-destructive/10 text-destructive border-destructive/30",
  likely: "bg-gold/10 text-gold border-gold/30",
  possible: "bg-muted text-muted-foreground border-border",
};

const priorityColor: Record<string, string> = {
  high: "bg-destructive/10 text-destructive",
  medium: "bg-gold/10 text-gold",
  low: "bg-muted text-muted-foreground",
};

const roleLabel: Record<string, string> = {
  subject: "You",
  witness: "Witness",
  authority: "Authority",
  opposing_party: "Opposing Party",
  advocate: "Advocate",
  other: "Mentioned",
};

export function CaseSignalReview({ signals, onConfirm, onDismiss, isApplying }: CaseSignalReviewProps) {
  const [selectedIssues, setSelectedIssues] = useState<Set<string>>(
    new Set(signals.issues.map((i) => i.id))
  );
  const [selectedEvidence, setSelectedEvidence] = useState<Set<string>>(
    new Set(signals.evidence_suggestions.map((e) => e.type))
  );
  const [selectedTimeline, setSelectedTimeline] = useState<Set<string>>(
    new Set(signals.timeline_suggestions.map((t) => t.title))
  );
  const [expandedSection, setExpandedSection] = useState<string | null>("issues");

  const toggleSection = (section: string) =>
    setExpandedSection((prev) => (prev === section ? null : section));

  const toggleItem = (set: Set<string>, key: string, setter: (s: Set<string>) => void) => {
    const next = new Set(set);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setter(next);
  };

  const handleConfirm = () => {
    onConfirm({
      issues: signals.issues.filter((i) => selectedIssues.has(i.id)),
      evidence: signals.evidence_suggestions.filter((e) => selectedEvidence.has(e.type)),
      timeline: signals.timeline_suggestions.filter((t) => selectedTimeline.has(t.title)),
    });
  };

  const totalSelected = selectedIssues.size + selectedEvidence.size + selectedTimeline.size;

  return (
    <div className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
      {/* Header */}
      <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-accent shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-foreground">Case Signal Engine — Review</p>
          <p className="text-xs text-muted-foreground mt-1">
            We identified patterns in your narrative. Review and select what applies — nothing is added until you confirm.
          </p>
        </div>
      </div>

      {/* Actors (always visible, compact) */}
      {signals.actors.length > 0 && (
        <div className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">People & Entities Mentioned</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {signals.actors.map((actor, i) => (
              <Badge key={i} variant="outline" className="text-xs py-1">
                {actor.name}
                <span className="ml-1 opacity-60">· {roleLabel[actor.role] || actor.role}</span>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Issues Section */}
      <Card className="border-border overflow-hidden">
        <button
          onClick={() => toggleSection("issues")}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-foreground">
              Possible Issues ({signals.issues.length})
            </span>
            <Badge variant="secondary" className="text-xs">
              {selectedIssues.size} selected
            </Badge>
          </div>
          {expandedSection === "issues" ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
        {expandedSection === "issues" && (
          <CardContent className="pt-0 pb-4 space-y-2">
            {signals.issues.map((issue) => (
              <label
                key={issue.id}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedIssues.has(issue.id)
                    ? "bg-accent/5 border-accent/30"
                    : "bg-card border-border/50 opacity-60"
                }`}
              >
                <Checkbox
                  checked={selectedIssues.has(issue.id)}
                  onCheckedChange={() => toggleItem(selectedIssues, issue.id, setSelectedIssues)}
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-foreground">{issue.label}</span>
                    <Badge className={`text-[10px] px-1.5 py-0 ${confidenceColor[issue.confidence]}`}>
                      {issue.confidence}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{issue.reason}</p>
                </div>
              </label>
            ))}
          </CardContent>
        )}
      </Card>

      {/* Evidence Section */}
      <Card className="border-border overflow-hidden">
        <button
          onClick={() => toggleSection("evidence")}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center gap-2">
            <FileSearch className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Evidence Suggestions ({signals.evidence_suggestions.length})
            </span>
            <Badge variant="secondary" className="text-xs">
              {selectedEvidence.size} selected
            </Badge>
          </div>
          {expandedSection === "evidence" ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
        {expandedSection === "evidence" && (
          <CardContent className="pt-0 pb-4 space-y-2">
            {signals.evidence_suggestions.map((ev, i) => (
              <label
                key={i}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedEvidence.has(ev.type)
                    ? "bg-primary/5 border-primary/30"
                    : "bg-card border-border/50 opacity-60"
                }`}
              >
                <Checkbox
                  checked={selectedEvidence.has(ev.type)}
                  onCheckedChange={() => toggleItem(selectedEvidence, ev.type, setSelectedEvidence)}
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-foreground">{ev.type}</span>
                    <Badge className={`text-[10px] px-1.5 py-0 ${priorityColor[ev.priority]}`}>
                      {ev.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{ev.why}</p>
                </div>
              </label>
            ))}
          </CardContent>
        )}
      </Card>

      {/* Timeline Section */}
      <Card className="border-border overflow-hidden">
        <button
          onClick={() => toggleSection("timeline")}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gold" />
            <span className="text-sm font-medium text-foreground">
              Timeline Suggestions ({signals.timeline_suggestions.length})
            </span>
            <Badge variant="secondary" className="text-xs">
              {selectedTimeline.size} selected
            </Badge>
          </div>
          {expandedSection === "timeline" ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
        {expandedSection === "timeline" && (
          <CardContent className="pt-0 pb-4 space-y-2">
            {signals.timeline_suggestions.map((ev, i) => (
              <label
                key={i}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedTimeline.has(ev.title)
                    ? "bg-gold/5 border-gold/30"
                    : "bg-card border-border/50 opacity-60"
                }`}
              >
                <Checkbox
                  checked={selectedTimeline.has(ev.title)}
                  onCheckedChange={() => toggleItem(selectedTimeline, ev.title, setSelectedTimeline)}
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-foreground">{ev.title}</span>
                  <p className="text-xs text-muted-foreground mt-0.5">{ev.description}</p>
                  <p className="text-[10px] text-muted-foreground/70 mt-1 italic">{ev.approximate_date}</p>
                </div>
              </label>
            ))}
          </CardContent>
        )}
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <Button variant="ghost" size="sm" onClick={onDismiss} disabled={isApplying}>
          Skip Suggestions
        </Button>
        <Button
          variant="hero"
          onClick={handleConfirm}
          disabled={totalSelected === 0 || isApplying}
        >
          {isApplying ? (
            <>
              <Loader2 className="w-4 h-4 mr-1 animate-spin" /> Applying…
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 mr-1" /> Add {totalSelected} to Case Builder
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
