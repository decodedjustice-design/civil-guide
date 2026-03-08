import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Standardized page header for tool/dashboard pages
 */
interface DjPageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  variant?: "espresso" | "cream" | "default";
  children?: React.ReactNode;
}

export function DjPageHeader({
  title,
  subtitle,
  className,
  variant = "espresso",
  children,
}: DjPageHeaderProps) {
  const bgClasses = {
    espresso: "bg-espresso text-white/95",
    cream: "bg-cream text-foreground",
    default: "bg-background text-foreground",
  };

  const subtitleClasses = {
    espresso: "text-white/50",
    cream: "text-muted-foreground",
    default: "text-muted-foreground",
  };

  return (
    <section className={cn("py-14 sm:py-18", bgClasses[variant], className)}>
      <div className="container max-w-5xl px-6">
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium mb-3 animate-fade-up">
          {title}
        </h1>
        {subtitle && (
          <p
            className={cn(
              "text-base sm:text-lg font-light tracking-wide animate-fade-up",
              subtitleClasses[variant]
            )}
            style={{ animationDelay: "0.15s", opacity: 0 }}
          >
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}
