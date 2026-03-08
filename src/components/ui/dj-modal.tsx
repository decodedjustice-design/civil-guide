import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

/**
 * Decoded Justice Modal System
 * Wraps shadcn Dialog with consistent branding
 */
interface DjModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

function DjModal({ open, onOpenChange, children }: DjModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog>
  );
}

const DjModalTrigger = DialogTrigger;

interface DjModalContentProps {
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "default" | "lg" | "xl";
}

function DjModalContent({ children, className, size = "default" }: DjModalContentProps) {
  const sizeClasses = {
    sm: "max-w-md",
    default: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <DialogContent
      className={cn(
        "bg-card border-border/50 rounded-xl shadow-lg p-0 gap-0",
        sizeClasses[size],
        className
      )}
    >
      {children}
    </DialogContent>
  );
}

interface DjModalHeaderProps {
  children: React.ReactNode;
  className?: string;
  icon?: React.ElementType;
}

function DjModalHeader({ children, className, icon: Icon }: DjModalHeaderProps) {
  return (
    <DialogHeader className={cn("px-6 pt-6 pb-4 border-b border-border/30", className)}>
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
            <Icon className="w-5 h-5 text-gold" strokeWidth={1.5} />
          </div>
        )}
        <div>{children}</div>
      </div>
    </DialogHeader>
  );
}

const DjModalTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <DialogTitle
      ref={ref}
      className={cn("font-serif text-xl font-medium text-foreground", className)}
      {...props}
    />
  )
);
DjModalTitle.displayName = "DjModalTitle";

const DjModalDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <DialogDescription
      ref={ref}
      className={cn("text-sm text-muted-foreground font-light mt-1", className)}
      {...props}
    />
  )
);
DjModalDescription.displayName = "DjModalDescription";

function DjModalBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("px-6 py-5", className)}>{children}</div>;
}

function DjModalFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <DialogFooter className={cn("px-6 pb-6 pt-4 border-t border-border/30 flex gap-3", className)}>
      {children}
    </DialogFooter>
  );
}

const DjModalClose = DialogClose;

export {
  DjModal,
  DjModalTrigger,
  DjModalContent,
  DjModalHeader,
  DjModalTitle,
  DjModalDescription,
  DjModalBody,
  DjModalFooter,
  DjModalClose,
};
