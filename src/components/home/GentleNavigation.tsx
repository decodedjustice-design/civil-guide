import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface PathOptionProps {
  label: string;
  href: string;
}

function PathOption({ label, href }: PathOptionProps) {
  return (
    <Link
      to={href}
      className="group flex items-center justify-between px-4 py-3 rounded-lg border border-border/50 hover:border-primary/30 hover:bg-muted/50 transition-all"
    >
      <span className="text-sm text-foreground group-hover:text-primary transition-colors">
        {label}
      </span>
      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
    </Link>
  );
}

export function GentleNavigation() {
  return (
    <section className="py-10">
      <div className="container max-w-xl">
        <div className="text-center mb-6">
          <p className="text-xs text-muted-foreground">
            Start anywhere. No required order.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <PathOption label="Analyzer" href="/analyzer" />
          <PathOption label="How It Works" href="/tools" />
          <PathOption label="Library" href="/library" />
          <PathOption label="Support" href="/support-network" />
        </div>
      </div>
    </section>
  );
}
