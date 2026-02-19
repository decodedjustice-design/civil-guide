import { useState } from "react";
import { ChevronDown, CheckCircle2, AlertCircle, Clock, BookOpen, Users, HelpCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { DepthToggle, type DepthLevel } from "./DepthToggle";
import { Button } from "@/components/ui/button";
import type { RightsInsightGuide } from "@/data/rightsInsightContent";

interface ScenarioCardProps {
  guide: RightsInsightGuide;
}

export function ScenarioCard({ guide }: ScenarioCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [depth, setDepth] = useState<DepthLevel>("quick");

  return (
    <div
      className={cn(
        "rounded-lg border bg-card/50 transition-all duration-200 overflow-hidden",
        isOpen
          ? "border-primary/20"
          : "border-border/70 hover:border-border hover:bg-card cursor-pointer"
      )}
    >
      {/* Collapsed: minimal text */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left"
      >
        <span className="text-sm font-medium text-foreground">{guide.title}</span>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-muted-foreground hidden sm:block">{guide.readTime}</span>
          <ChevronDown
            className={cn(
              "w-4 h-4 text-muted-foreground transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </div>
      </button>

      {/* Expanded: progressive depth */}
      {isOpen && (
        <div className="px-4 pb-4 pt-0 border-t border-border/50 space-y-4 animate-fade-in">
          {/* One-line orientation */}
          <p className="text-sm text-muted-foreground pt-3 line-clamp-2">
            {guide.orientation.whatThisSystemIs.split(".")[0]}.
          </p>

          {/* Depth toggle */}
          <DepthToggle value={depth} onChange={setDepth} />

          {/* Quick view */}
          {depth === "quick" && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  What to focus on
                </h4>
                <ul className="space-y-1 pl-5">
                  {guide.whatMatters.slice(0, 4).map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground list-disc">{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-muted-foreground" />
                  Common situations
                </h4>
                <ul className="space-y-1 pl-5">
                  {guide.commonSituations.slice(0, 4).map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground list-disc">{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Understand view */}
          {depth === "understand" && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h4 className="text-xs font-semibold text-foreground mb-1.5">What this system is</h4>
                <p className="text-sm text-muted-foreground">{guide.orientation.whatThisSystemIs}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-foreground mb-1.5">Who holds power</h4>
                <p className="text-sm text-muted-foreground">{guide.orientation.whoHoldsPower}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-foreground mb-1.5">Why it feels confusing</h4>
                <p className="text-sm text-muted-foreground">{guide.orientation.whyItFeelsConfusing}</p>
              </div>
              {guide.traumaAwareNote && (
                <div className="p-3 rounded-lg bg-accent/5 border border-accent/10">
                  <p className="text-sm text-muted-foreground italic">{guide.traumaAwareNote}</p>
                </div>
              )}
            </div>
          )}

          {/* Full guide view */}
          {depth === "full" && (
            <div className="space-y-4 animate-fade-in">
              <div>
                <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                  What usually matters
                </h4>
                <ul className="space-y-1 pl-5">
                  {guide.whatMatters.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground list-disc">{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-foreground mb-2">Common situations</h4>
                <ul className="space-y-1 pl-5">
                  {guide.commonSituations.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground list-disc">{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-foreground mb-2">What often doesn't matter (as much as people think)</h4>
                <ul className="space-y-1 pl-5">
                  {guide.whatDoesntMatter.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground list-disc">{item}</li>
                  ))}
                </ul>
              </div>
              {guide.keyDeadlines && (
                <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                  <h4 className="text-xs font-semibold text-foreground mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Key deadlines
                  </h4>
                  <p className="text-sm text-muted-foreground">{guide.keyDeadlines}</p>
                </div>
              )}
              {guide.traumaAwareNote && (
                <div className="p-3 rounded-lg bg-accent/5 border border-accent/10">
                  <p className="text-sm text-muted-foreground italic">{guide.traumaAwareNote}</p>
                </div>
              )}
              {/* Related resource links */}
              <div className="pt-3 border-t border-border/50 flex flex-wrap gap-2">
                <Button variant="soft" size="sm" asChild>
                  <Link to={`/support-network?filter=${guide.systemId}`}>
                    <Users className="w-3 h-3 mr-1.5" />
                    Find Agencies
                  </Link>
                </Button>
                <Button variant="soft" size="sm" asChild>
                  <Link to="/find-help">
                    <HelpCircle className="w-3 h-3 mr-1.5" />
                    Legal Help
                  </Link>
                </Button>
                <Button variant="soft" size="sm" asChild>
                  <Link to="/analyzer">
                    <ArrowRight className="w-3 h-3 mr-1.5" />
                    Analyzer
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
