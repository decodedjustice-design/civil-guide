import { Link } from "react-router-dom";
import { 
  Feather, 
  Scale, 
  BookOpen, 
  Clock, 
  FileSearch, 
  FolderOpen, 
  FileText,
  ArrowRight,
  Compass,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/shared/Disclaimer";

interface Stage {
  step: number;
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
}

const stages: Stage[] = [
  {
    step: 1,
    icon: Feather,
    title: "Clarion",
    description: "Organize your thoughts, feelings, and story without pressure or panic.",
    href: "/clarion",
  },
  {
    step: 2,
    icon: Scale,
    title: "Analyzer",
    description: "Understand what may matter in your situation and bring structure to it.",
    href: "/analyzer",
  },
  {
    step: 3,
    icon: BookOpen,
    title: "Guides",
    description: "Learn how the systems involved actually operate and what typically matters inside them.",
    href: "/rights-insight",
  },
  {
    step: 4,
    icon: Clock,
    title: "Timeline",
    description: "Place events in order so the full picture becomes visible.",
    href: "/timeline",
  },
  {
    step: 5,
    icon: FileSearch,
    title: "Decoder",
    description: "Translate paperwork, forms, and legal language into plain meaning.",
    href: "/legal-decoder",
  },
  {
    step: 6,
    icon: FolderOpen,
    title: "Evidence Vault",
    description: "Bring documents and records into one organized place.",
    href: "/evidence-vault",
  },
  {
    step: 7,
    icon: FileText,
    title: "Notes & Transcription",
    description: "Capture details and conversations as they happen.",
    href: "/notes",
  },
];

export default function Tools() {
  return (
    <Layout>
      <div className="container py-12 lg:py-20">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-4">
              <Compass className="w-4 h-4" />
              <span>The Process</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              How Decoded Justice Works With You
            </h1>
            <div className="space-y-4 text-muted-foreground max-w-2xl mx-auto">
              <p>
                When something feels confusing or overwhelming, this system brings structure to it.
              </p>
              <p>
                It works with you to move from scattered thoughts to clear understanding through a connected process.
              </p>
            </div>
          </div>

          {/* Wellbeing Note */}
          <div className="p-3 rounded-xl bg-secondary/50 border border-border mb-12">
            <p className="text-xs text-muted-foreground text-center">
              <strong className="text-foreground">Go at your own pace.</strong> You don't have to move through every stage. Start with what feels right, and return whenever you need.
            </p>
          </div>

          {/* Stages */}
          <div className="space-y-4 mb-16">
            {stages.map((stage, i) => {
              const Icon = stage.icon;
              return (
                <Link
                  key={stage.step}
                  to={stage.href}
                  className="group relative flex items-start gap-5 p-5 rounded-2xl bg-card border-2 border-border hover:border-accent/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  {/* Step number + connector */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-11 h-11 rounded-xl bg-accent/15 flex items-center justify-center group-hover:bg-accent/25 transition-colors">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    {i < stages.length - 1 && (
                      <div className="w-px h-4 bg-border/50 mt-2 hidden sm:block" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 pt-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h2 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                        <span className="text-muted-foreground font-normal text-sm mr-2">Step {stage.step}</span>
                        {stage.title}
                      </h2>
                      <ArrowRight className="w-4 h-4 text-accent opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {stage.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* When You're Ready */}
          <div className="p-8 rounded-2xl bg-card border-2 border-border mb-16">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              When You're Ready to Move Forward
            </h2>
            <p className="text-muted-foreground mb-5 text-sm">
              Once your situation is clearer and more organized, you may choose to:
            </p>
            <ul className="space-y-2.5 text-sm text-muted-foreground mb-6">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">•</span>
                Explore oversight or complaint pathways
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">•</span>
                Seek legal support
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">•</span>
                Prepare structured information for conversations
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">•</span>
                Continue organizing as new details emerge
              </li>
            </ul>
            <p className="text-sm text-muted-foreground">
              Support and legal tools exist to assist that next step — when and if you decide to take it.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Button variant="outline" size="sm" asChild>
                <Link to="/find-help">Find Legal Help</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/support-network">Support Network</Link>
              </Button>
            </div>
          </div>

          {/* Closing Statement */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="space-y-3 text-muted-foreground text-sm leading-relaxed">
              <p>
                This process is designed to reduce confusion, connect the pieces, and replace reaction with understanding.
              </p>
              <p>
                It doesn't tell you what to do.
              </p>
              <p className="text-foreground/80 font-medium">
                It helps you see clearly, choose your direction, and organize your move forward.
              </p>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="pt-8 border-t border-border">
            <Disclaimer className="justify-center" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
