import * as React from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Dashboard Widget System
 * Modular widgets for the dashboard sidebar and main area
 */

// Widget container
interface WidgetProps {
  title?: string;
  action?: { label: string; href: string };
  children: React.ReactNode;
  className?: string;
}

export function Widget({ title, action, children, className }: WidgetProps) {
  return (
    <div className={cn("bg-card border border-border/50 rounded-xl", className)}>
      {(title || action) && (
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          {title && (
            <h3 className="text-sm font-medium text-foreground tracking-wide">{title}</h3>
          )}
          {action && (
            <Link
              to={action.href}
              className="text-xs text-primary hover:text-maroon-light transition-colors flex items-center gap-1"
            >
              {action.label}
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      )}
      <div className="px-5 pb-5">{children}</div>
    </div>
  );
}

// Suggested Action Widget
interface SuggestedActionProps {
  text: string;
  href: string;
  label: string;
  className?: string;
}

export function SuggestedAction({ text, href, label, className }: SuggestedActionProps) {
  return (
    <div
      className={cn(
        "bg-card border border-gold/20 rounded-xl p-5 flex items-center justify-between gap-4 flex-wrap",
        className
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
          <ArrowRight className="w-4 h-4 text-gold" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-xs text-muted-foreground tracking-wide mb-0.5">
            Suggested Next Step
          </p>
          <p className="text-sm font-medium text-foreground">{text}</p>
        </div>
      </div>
      <Link
        to={href}
        className="text-sm font-medium text-primary hover:text-maroon-light transition-colors whitespace-nowrap"
      >
        {label} →
      </Link>
    </div>
  );
}

// Quick stat inline
interface QuickStatProps {
  label: string;
  value: string | number;
  icon?: React.ElementType;
}

export function QuickStat({ label, value, icon: Icon }: QuickStatProps) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-border/30 last:border-0">
      <div className="flex items-center gap-2.5">
        {Icon && <Icon className="w-4 h-4 text-gold/60" strokeWidth={1.5} />}
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

// Privacy badge
export function PrivacyBadge({ className }: { className?: string }) {
  return (
    <div className={cn("bg-espresso-light rounded-xl py-4 px-5 text-center", className)}>
      <span className="text-xs text-white/50 tracking-wide">
        🔒 Your information remains private and under your control
      </span>
    </div>
  );
}
