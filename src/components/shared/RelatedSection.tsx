import { Link } from "react-router-dom";
import { ArrowRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface RelatedLink {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

interface RelatedSectionProps {
  title: string;
  links: RelatedLink[];
  className?: string;
}

export function RelatedSection({ title, links, className }: RelatedSectionProps) {
  return (
    <div className={cn("p-6 rounded-xl bg-card border border-border", className)}>
      <h3 className="text-sm font-semibold text-foreground mb-4">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {links.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className="group flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
              <link.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {link.label}
              </p>
              <p className="text-xs text-muted-foreground line-clamp-1">
                {link.description}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0 mt-0.5 transition-colors" />
          </Link>
        ))}
      </div>
    </div>
  );
}
