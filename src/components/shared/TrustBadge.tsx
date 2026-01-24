import { Shield, Lock, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrustBadgeProps {
  variant: "privacy" | "personal" | "educational" | "secure";
  className?: string;
}

const variants = {
  privacy: {
    icon: EyeOff,
    label: "Private to you",
    description: "Your files are not shared with anyone. Only you can access your data.",
  },
  personal: {
    icon: Lock,
    label: "Personal documentation",
    description: "This tool is for your own records and clarity.",
  },
  educational: {
    icon: Eye,
    label: "Educational content",
    description: "This is educational information, not legal advice.",
  },
  secure: {
    icon: Shield,
    label: "Secure storage",
    description: "Your data is stored securely and protected.",
  },
};

export function TrustBadge({ variant, className }: TrustBadgeProps) {
  const config = variants[variant];
  const Icon = config.icon;

  return (
    <div className={cn("flex items-start gap-3 p-4 rounded-xl bg-accent/5 border border-accent/20", className)}>
      <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-accent" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{config.label}</p>
        <p className="text-xs text-muted-foreground">{config.description}</p>
      </div>
    </div>
  );
}
