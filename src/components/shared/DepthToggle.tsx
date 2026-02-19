import { cn } from "@/lib/utils";

export type DepthLevel = "quick" | "understand" | "full";

interface DepthToggleProps {
  value: DepthLevel;
  onChange: (level: DepthLevel) => void;
  className?: string;
}

const levels: { id: DepthLevel; label: string }[] = [
  { id: "quick", label: "Quick" },
  { id: "understand", label: "Understand" },
  { id: "full", label: "Full Guide" },
];

export function DepthToggle({ value, onChange, className }: DepthToggleProps) {
  return (
    <div className={cn("inline-flex rounded-lg bg-secondary/70 p-0.5 border border-border", className)}>
      {levels.map((level) => (
        <button
          key={level.id}
          onClick={() => onChange(level.id)}
          className={cn(
            "px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200",
            value === level.id
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {level.label}
        </button>
      ))}
    </div>
  );
}
