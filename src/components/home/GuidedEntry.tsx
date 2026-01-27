import { Link } from "react-router-dom";
import { ArrowRight, Search, BookOpen, Wrench, Users } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface EntryPathProps {
  icon: LucideIcon;
  label: string;
  href: string;
}

function EntryPath({ icon: Icon, label, href }: EntryPathProps) {
  return (
    <Link
      to={href}
      className="group flex items-center justify-between p-6 rounded-2xl bg-card border border-border/50 shadow-md hover:shadow-lg hover:border-primary/25 transition-all duration-300"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <span className="text-base font-medium text-navy group-hover:text-primary transition-colors">
          {label}
        </span>
      </div>
      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
    </Link>
  );
}

export function GuidedEntry() {
  return (
    <section className="py-20 lg:py-28 bg-gradient-to-b from-secondary/20 to-background">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <h2 className="text-2xl md:text-3xl font-semibold text-navy mb-4">
            Start where you feel safe
          </h2>
          <p className="text-lg text-muted-foreground">
            There is no wrong place to begin. Every path leads to clarity.
          </p>
        </div>

        <div className="max-w-xl mx-auto grid gap-4">
          <EntryPath icon={Search} label="Analyzer" href="/analyzer" />
          <EntryPath icon={BookOpen} label="Library" href="/library" />
          <EntryPath icon={Wrench} label="Tools" href="/tools" />
          <EntryPath icon={Users} label="Support" href="/support-network" />
        </div>
      </div>
    </section>
  );
}
