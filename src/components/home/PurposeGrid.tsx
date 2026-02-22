import { Link } from "react-router-dom";
import { 
  Lightbulb, 
  BookMarked, 
  FolderOpen,
  Clock,
  Brain,
  Users
} from "lucide-react";
import { LucideIcon } from "lucide-react";

interface PathwayCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
}

function PathwayCard({ icon: Icon, title, description, href }: PathwayCardProps) {
  return (
    <Link
      to={href}
      className="group relative p-8 rounded-2xl bg-card border border-border/50 shadow-md hover:shadow-lg hover:border-primary/20 transition-all duration-300 overflow-hidden"
    >
      {/* Subtle hover glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-all duration-500" />
      
      <div className="relative">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-accent-soft flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300">
          <Icon className="w-7 h-7 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-navy mb-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </Link>
  );
}

export function PurposeGrid() {
  const pathways = [
    {
      icon: Lightbulb,
      title: "Understand your situation",
      description: "Identify which systems apply and what patterns typically emerge.",
      href: "/analyzer"
    },
    {
      icon: BookMarked,
      title: "Learn your rights and systems",
      description: "Educational resources about how different systems work.",
      href: "/rights-insight"
    },
    {
      icon: FolderOpen,
      title: "Organize your documents",
      description: "Securely store and categorize important files and evidence.",
      href: "/evidence-vault"
    },
    {
      icon: Clock,
      title: "Track your timeline",
      description: "Create a chronological record of events and interactions.",
      href: "/timeline"
    },
    {
      icon: Brain,
      title: "See how it works",
      description: "Understand the connected process that brings clarity to your situation.",
      href: "/tools"
    },
    {
      icon: Users,
      title: "Get support resources",
      description: "Connect with organizations and services that can help.",
      href: "/support-network"
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-secondary/20">
      <div className="container">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-6">
            <span className="text-sm font-medium text-primary">Guided Pathways</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold text-navy mb-4">
            How this space can help
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Choose a path that feels right. There's no wrong place to start.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pathways.map((pathway) => (
            <PathwayCard key={pathway.title} {...pathway} />
          ))}
        </div>
      </div>
    </section>
  );
}
