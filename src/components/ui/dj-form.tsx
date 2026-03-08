import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

/**
 * Decoded Justice Form Components
 * Consistent styling for all form elements
 */

// Form Section - groups related fields
interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {(title || description) && (
        <div className="mb-5">
          {title && (
            <h3 className="font-serif text-lg font-medium text-foreground">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-muted-foreground font-light mt-1">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}

// Styled form field wrapper
interface FormFieldWrapperProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormFieldWrapper({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
  className,
}: FormFieldWrapperProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label
        htmlFor={htmlFor}
        className="text-sm font-medium text-foreground tracking-wide"
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {hint && (
        <p className="text-xs text-muted-foreground font-light">{hint}</p>
      )}
      {children}
      {error && (
        <p className="text-xs text-destructive font-medium">{error}</p>
      )}
    </div>
  );
}

// Styled Input
export const DjInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <Input
    ref={ref}
    className={cn(
      "h-11 bg-background border-border/60 rounded-lg text-sm placeholder:text-muted-foreground/60 focus:border-primary focus:ring-primary/20 transition-colors",
      className
    )}
    {...props}
  />
));
DjInput.displayName = "DjInput";

// Styled Textarea
export const DjTextarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <Textarea
    ref={ref}
    className={cn(
      "bg-background border-border/60 rounded-lg text-sm placeholder:text-muted-foreground/60 focus:border-primary focus:ring-primary/20 transition-colors min-h-[100px]",
      className
    )}
    {...props}
  />
));
DjTextarea.displayName = "DjTextarea";

// Form Actions (button row)
interface FormActionsProps {
  children: React.ReactNode;
  className?: string;
  align?: "left" | "right" | "center" | "between";
}

export function FormActions({ children, className, align = "right" }: FormActionsProps) {
  const alignClasses = {
    left: "justify-start",
    right: "justify-end",
    center: "justify-center",
    between: "justify-between",
  };

  return (
    <div className={cn("flex items-center gap-3 pt-4", alignClasses[align], className)}>
      {children}
    </div>
  );
}
