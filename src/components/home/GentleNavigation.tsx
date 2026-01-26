import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface PathOptionProps {
  label: string;
  description: string;
  href: string;
}

function PathOption({ label, description, href }: PathOptionProps) {
  return (
    <Link
      to={href}
      className="group flex items-center justify-between p-4 rounded-xl border border-border/50 bg-card/30 hover:border-primary/30 hover:bg-card/60 transition-all"
    >
      <div>
        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
          {label}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {description}
        </p>
      </div>
      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 ml-4" />
    </Link>
  );
}

export function GentleNavigation() {
  return (
    <section className="py-12 lg:py-16">
      <div className="container max-w-2xl">
        <div className="text-center mb-8">
          <p className="text-sm text-muted-foreground">
            You can start anywhere. There's no required order.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <PathOption
            label="I want to understand my situation"
            description="Start with the Analyzer"
            href="/analyzer"
          />
          <PathOption
            label="I want to learn about my rights"
            description="Explore Rights Insight"
            href="/rights-insight"
          />
          <PathOption
            label="I need to organize documents"
            description="Use the Evidence Vault"
            href="/evidence-vault"
          />
          <PathOption
            label="I want to find help"
            description="Browse Support Network"
            href="/support-network"
          />
        </div>
      </div>
    </section>
  );
}
