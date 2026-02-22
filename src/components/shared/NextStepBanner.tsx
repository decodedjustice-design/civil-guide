import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface NextStep {
  label: string;
  description: string;
  href: string;
}

interface NextStepBannerProps {
  steps: NextStep[];
  heading?: string;
}

export function NextStepBanner({ steps, heading = "Ready for the next step?" }: NextStepBannerProps) {
  if (steps.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t border-border/30">
      <p className="text-sm font-medium text-foreground mb-4">{heading}</p>
      <div className={`grid gap-3 ${steps.length > 1 ? "sm:grid-cols-2" : ""}`}>
        {steps.map((step) => (
          <Link
            key={step.href}
            to={step.href}
            className="group flex items-center gap-3 p-4 rounded-lg bg-card border border-border/50 hover:border-gold/20 hover:shadow-sm transition-all"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {step.label}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}
