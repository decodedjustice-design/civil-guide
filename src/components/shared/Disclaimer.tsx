import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface DisclaimerProps {
  variant?: "subtle" | "prominent";
  className?: string;
}

export function Disclaimer({ variant = "subtle", className }: DisclaimerProps) {
  if (variant === "prominent") {
    return (
      <div className={cn(
        "p-4 rounded-xl bg-muted/50 border border-border flex items-start gap-3",
        className
      )}>
        <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-foreground mb-1">
            Educational Use Only
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            This platform does not provide legal advice. The information is for educational purposes only. 
            For legal concerns, please consult with a qualified attorney.
          </p>
        </div>
      </div>
    );
  }

  return (
    <p className={cn(
      "text-xs text-text-softer flex items-center gap-1.5",
      className
    )}>
      <AlertCircle className="w-3 h-3" />
      <span>Educational use only. Not legal advice.</span>
    </p>
  );
}
