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
      className="group flex items-center justify-between p-5 rounded-xl bg-card border border-border/50 shadow-sm hover:shadow-md hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
    >
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-navy/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
          <Icon className="w-5 h-5 text-navy group-hover:text-primary transition-colors" />
        </div>
        <span className="text-base font-medium text-foreground group-hover:text-primary transition-colors">
          {label}
        </span>
      </div>
      <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
    </Link>
  );
}

export function GuidedEntry() {
  return (
    <section className="py-20 lg:py-24 bg-gradient-to-b from-background to-secondary/30">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-navy mb-4">
            Start where you feel safe
          </h2>
          <p className="text-lg text-muted-foreground">
            There is no wrong place to begin. Every path leads to clarity.
          </p>
        </div>

        <div className="max-w-xl mx-auto grid gap-3">
          <EntryPath icon={Search} label="Analyzer" href="/analyzer" />
          <EntryPath icon={BookOpen} label="Library" href="/library" />
          <EntryPath icon={Wrench} label="Tools" href="/tools" />
          <EntryPath icon={Users} label="Support" href="/support-network" />
        </div>
      </div>
    </section>
  );
}
