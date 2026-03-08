import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Decoded Justice Card System
 * Variants: default, elevated, stat, action, feature, glass
 */
const djCardVariants = cva(
  "rounded-xl border transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-card border-border/50 text-card-foreground",
        elevated: "bg-card border-border/40 shadow-md hover:shadow-lg",
        stat: "bg-card border-border/50 text-center",
        action: "bg-card border-border/50 hover:shadow-md hover:border-gold/20 cursor-pointer group",
        feature: "bg-cream-warm border-border/30 hover:shadow-md hover:border-gold/20",
        glass: "bg-card/70 backdrop-blur-sm border-border/30 shadow-sm",
        highlight: "bg-card border-gold/20 shadow-sm",
      },
      size: {
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface DjCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof djCardVariants> {
  href?: string;
}

const DjCard = React.forwardRef<HTMLDivElement, DjCardProps>(
  ({ className, variant, size, href, children, ...props }, ref) => {
    if (href) {
      return (
        <Link to={href} className="block">
          <div
            ref={ref}
            className={cn(djCardVariants({ variant: variant || "action", size, className }))}
            {...props}
          >
            {children}
          </div>
        </Link>
      );
    }
    return (
      <div
        ref={ref}
        className={cn(djCardVariants({ variant, size, className }))}
        {...props}
      >
        {children}
      </div>
    );
  }
);
DjCard.displayName = "DjCard";

// Card Header with optional icon
interface DjCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ElementType;
  iconClassName?: string;
}

const DjCardHeader = React.forwardRef<HTMLDivElement, DjCardHeaderProps>(
  ({ className, icon: Icon, iconClassName, children, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-start gap-4", className)} {...props}>
      {Icon && (
        <div className="w-11 h-11 rounded-lg bg-secondary flex items-center justify-center shrink-0 group-hover:bg-gold/10 transition-colors">
          <Icon className={cn("w-5 h-5 text-gold opacity-70 group-hover:opacity-100 transition-opacity", iconClassName)} strokeWidth={1.5} />
        </div>
      )}
      <div className="flex-1 min-w-0">{children}</div>
      {/* Show arrow for action cards */}
    </div>
  )
);
DjCardHeader.displayName = "DjCardHeader";

// Card Title
const DjCardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("font-serif text-lg font-medium text-foreground group-hover:text-primary transition-colors", className)}
      {...props}
    />
  )
);
DjCardTitle.displayName = "DjCardTitle";

// Card Description
const DjCardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground font-light leading-relaxed mt-1.5", className)}
      {...props}
    />
  )
);
DjCardDescription.displayName = "DjCardDescription";

// Stat Card specialized component
interface StatCardProps {
  icon: React.ElementType;
  value: string | number;
  label: string;
  className?: string;
}

function StatCard({ icon: Icon, value, label, className }: StatCardProps) {
  return (
    <DjCard variant="stat" className={className}>
      <Icon className="w-5 h-5 text-gold/60 mx-auto mb-3" strokeWidth={1.5} />
      <p className="text-2xl font-serif font-medium text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-1 tracking-wide">{label}</p>
    </DjCard>
  );
}

// Action Card with arrow
interface ActionCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
  className?: string;
  delay?: number;
}

function ActionCard({ icon: Icon, title, description, href, className, delay = 0 }: ActionCardProps) {
  return (
    <DjCard
      href={href}
      variant="action"
      className={cn("animate-fade-up", className)}
      style={{ animationDelay: `${delay}s`, opacity: 0 }}
    >
      <DjCardHeader icon={Icon}>
        <DjCardTitle>{title}</DjCardTitle>
        <DjCardDescription>{description}</DjCardDescription>
      </DjCardHeader>
    </DjCard>
  );
}

// Link List Card (for sections like Guidance, Legal Prep, Support)
interface LinkItem {
  label: string;
  href: string;
}

interface LinkListCardProps {
  title: string;
  description: string;
  links: LinkItem[];
  className?: string;
}

function LinkListCard({ title, description, links, className }: LinkListCardProps) {
  return (
    <DjCard variant="default" size="lg" className={className}>
      <h3 className="font-serif text-xl font-medium text-foreground mb-4">{title}</h3>
      <p className="text-sm text-muted-foreground font-light mb-5 leading-relaxed">{description}</p>
      <div className="space-y-2.5">
        {links.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className="flex items-center gap-2 text-sm text-primary hover:text-maroon-light transition-colors"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            {link.label}
          </Link>
        ))}
      </div>
    </DjCard>
  );
}

export {
  DjCard,
  DjCardHeader,
  DjCardTitle,
  DjCardDescription,
  StatCard,
  ActionCard,
  LinkListCard,
  djCardVariants,
};
