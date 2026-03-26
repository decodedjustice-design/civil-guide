import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, ExternalLink, CheckCircle2, Package } from "lucide-react";
import { CaseBuilderProgress as ProgressType } from "@/hooks/useCaseBuilder";

interface CasePacketStepProps {
  onBack: () => void;
  progress: ProgressType;
}

export function CasePacketStep({ onBack, progress }: CasePacketStepProps) {
  const readinessItems = [
    { label: "Write Your Story completed", done: progress.incidentIntakeComplete },
    { label: "Timeline events recorded", done: progress.timelineCount > 0 },
    { label: "Evidence uploaded", done: progress.evidenceCount > 0 },
    { label: "Key issues reviewed", done: progress.legalIssuesIdentified },
  ];
  const readyCount = readinessItems.filter((i) => i.done).length;

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-xl bg-muted/50 border border-border">
        <p className="text-sm text-muted-foreground text-center">
          <strong className="text-foreground">Generate your case packet.</strong> This creates a neutral, structured summary an attorney can review quickly.
        </p>
      </div>

      {/* Readiness checklist */}
      <div className="p-6 rounded-xl bg-card border border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Package className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium text-foreground">Case Readiness</h3>
            <p className="text-sm text-muted-foreground">{readyCount} of {readinessItems.length} steps completed</p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          {readinessItems.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <CheckCircle2
                className={`w-5 h-5 shrink-0 ${item.done ? "text-gold" : "text-muted-foreground/30"}`}
              />
              <span className={`text-sm ${item.done ? "text-foreground" : "text-muted-foreground"}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <Button variant="hero" asChild className="w-full" size="lg">
          <Link to="/intake-packet">
            <FileText className="w-5 h-5 mr-2" />
            Generate Attorney Intake Packet
            <ExternalLink className="w-3 h-3 ml-2 opacity-50" />
          </Link>
        </Button>

        {progress.casePacketGenerated && (
          <div className="mt-4 p-3 rounded-lg bg-gold/10 border border-gold/30 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
            <span className="text-sm text-foreground">You have a saved intake packet.</span>
          </div>
        )}
      </div>

      {/* Next steps */}
      <div className="p-5 rounded-xl bg-accent/5 border border-accent/20">
        <h3 className="text-sm font-medium text-foreground mb-3">When your packet is ready:</h3>
        <div className="space-y-2">
          <Link to="/find-help" className="flex items-center gap-2 text-sm text-primary hover:underline">
            → Find an attorney who handles your type of case
          </Link>
          <Link to="/attorney-contacts" className="flex items-center gap-2 text-sm text-primary hover:underline">
            → Track your attorney outreach
          </Link>
        </div>
      </div>

      <div className="flex justify-start pt-2">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
      </div>
    </div>
  );
}
