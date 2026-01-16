import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface GuideAccordionSectionProps {
  title: string;
  icon?: React.ReactNode;
  number?: number;
  variant?: "default" | "highlight" | "success" | "warning";
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function GuideAccordionSection({
  title,
  icon,
  number,
  variant = "default",
  defaultOpen = false,
  children
}: GuideAccordionSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const variantStyles = {
    default: "bg-card border-border",
    highlight: "bg-primary/5 border-primary/20",
    success: "bg-success/5 border-success/20",
    warning: "bg-accent/5 border-accent/20"
  };

  const numberStyles = {
    default: "bg-secondary text-foreground",
    highlight: "bg-primary/20 text-primary",
    success: "bg-success/20 text-success",
    warning: "bg-accent/20 text-accent"
  };

  return (
    <div className={cn("rounded-xl border overflow-hidden transition-all", variantStyles[variant])}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-surface-hover/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {number !== undefined && (
            <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold", numberStyles[variant])}>
              {number}
            </div>
          )}
          {icon && !number && (
            <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", numberStyles[variant])}>
              {icon}
            </div>
          )}
          <h3 className="font-semibold text-foreground">{title}</h3>
        </div>
        <ChevronDown className={cn(
          "w-5 h-5 text-muted-foreground transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </button>
      
      <div className={cn(
        "overflow-hidden transition-all duration-200",
        isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
      )}>
        <div className="p-4 pt-0 border-t border-border/50">
          {children}
        </div>
      </div>
    </div>
  );
}
