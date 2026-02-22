import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface EducationalNoticeProps {
  className?: string;
}

export function EducationalNotice({ className }: EducationalNoticeProps) {
  return (
    <div
      className={cn(
        "w-full bg-secondary/60 border border-border/60 rounded-lg px-4 py-3 flex items-start gap-3",
        className
      )}
    >
      <ShieldCheck className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
      <p className="text-xs text-muted-foreground leading-relaxed">
        <span className="font-medium text-foreground/80">Educational Notice:</span>{" "}
        This platform provides structured documentation and general information about how systems
        operate. It does not provide legal advice, legal representation, or legal analysis. Use of
        this platform does not create an attorney-client relationship.
      </p>
    </div>
  );
}
