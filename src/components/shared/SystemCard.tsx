import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SystemCardProps {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  guideCount: number;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export function SystemCard({
  icon: Icon,
  title,
  subtitle,
  guideCount,
  isExpanded,
  onToggle,
  children,
}: SystemCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card transition-all duration-300 overflow-hidden",
        isExpanded
          ? "border-primary/30 shadow-lg"
          : "border-border hover:border-primary/20 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
      )}
    >
      <button
        onClick={onToggle}
        className="w-full p-5 sm:p-6 flex items-start gap-4 text-left"
      >
        <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center shrink-0 transition-colors group-hover:bg-primary/20">
          <Icon className="w-5 h-5 text-foreground" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-base mb-0.5">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-1">{subtitle}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-muted-foreground hidden sm:block">
            {guideCount} {guideCount === 1 ? "topic" : "topics"}
          </span>
          <ChevronDown
            className={cn(
              "w-5 h-5 text-muted-foreground transition-transform duration-300",
              isExpanded && "rotate-180"
            )}
          />
        </div>
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          isExpanded ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0 border-t border-border/50">
          {children}
        </div>
      </div>
    </div>
  );
}
