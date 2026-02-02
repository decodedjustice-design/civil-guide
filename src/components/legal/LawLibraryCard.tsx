import { useState } from "react";
import { ExternalLink, ChevronDown, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LawLibraryResource } from "@/data/lawLibraryResources";

interface LawLibraryCardProps {
  resource: LawLibraryResource;
}

export function LawLibraryCard({ resource }: LawLibraryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden transition-all duration-200 hover:border-accent/40">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-secondary/30 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-foreground truncate">{resource.name}</h4>
          <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
            {resource.description}
          </p>
        </div>
        <ChevronDown 
          className={cn(
            "w-5 h-5 text-muted-foreground shrink-0 ml-4 transition-transform duration-200",
            isExpanded && "rotate-180"
          )} 
        />
      </button>

      {/* Expanded Details */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-200",
          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
          {/* Description */}
          <div>
            <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              What It Is
            </h5>
            <p className="text-sm text-foreground">{resource.description}</p>
          </div>

          {/* Useful For */}
          <div>
            <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              Useful For
            </h5>
            <p className="text-sm text-foreground">{resource.usefulFor}</p>
          </div>

          {/* External Link */}
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors"
          >
            Visit Resource
            <ExternalLink className="w-4 h-4" />
          </a>

          {/* Disclaimer */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border border-border">
            <AlertCircle className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              External resource. Links and availability may change. Always verify information with official sources.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
