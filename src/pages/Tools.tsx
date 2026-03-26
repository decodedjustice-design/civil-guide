import { Link } from "react-router-dom";
import { 
  Feather, 
  Clock, 
  FolderOpen, 
  FileText,
  ArrowRight,
  Scale,
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
    title: "Write Your Story",
    description: "Describe what happened in your own words. Focus on people, actions, and impact.",
    href: "/clarion",
  },
  {
    step: 2,
    icon: Clock,
    title: "Build Timeline",
    description: "Put key events in order with dates, times, and locations.",
    href: "/timeline",
  },
  {
    step: 3,
    icon: FolderOpen,
    title: "Upload Evidence",
    description: "Add photos, documents, audio, and records in one organized place.",
    href: "/evidence-vault",
  },
  {
    step: 4,
    icon: Scale,
    title: "Review Key Issues",
    description: "Identify possible legal issue areas and factual gaps to address.",
    href: "/analyzer",
  },
  {
    step: 5,
    icon: FileText,
    title: "Generate Case Packet",
    description: "Create a structured packet you can send to an attorney.",
    href: "/intake-packet",
  },
];

export default function Tools() {
  return (
    <Layout>
      <div className="container py-12 lg:py-20">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              One Clear Path to an Attorney-Ready Case Packet
            </h1>
            <div className="space-y-4 text-muted-foreground max-w-2xl mx-auto">
              <p>
                Decoded Justice now uses one guided flow from start to finish.
              </p>
              <p>
                Most people complete a strong first draft packet in 30 to 60 minutes, then refine it over time.
              </p>
            </div>
          </div>

          {/* Wellbeing Note */}
          <div className="p-3 rounded-xl bg-secondary/50 border border-border mb-12">
            <p className="text-xs text-muted-foreground text-center">
              <strong className="text-foreground">Go at your own pace.</strong> You can pause anytime and return without losing progress.
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

          {/* Supporting tools */}
          <div className="p-8 rounded-2xl bg-card border-2 border-border mb-16">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Supporting Tools
            </h2>
            <p className="text-muted-foreground mb-5 text-sm">
              These tools support the main case packet flow:
            </p>
            <ul className="space-y-2.5 text-sm text-muted-foreground mb-6">
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">•</span>
                Understand Documents (Decoder)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">•</span>
                Learn Your Rights guides
              </li>
              <li className="flex items-start gap-2">
                <span className="text-accent mt-0.5">•</span>
                Find Help directory
              </li>
            </ul>
            <p className="text-sm text-muted-foreground">
              You only need to choose from many options after your packet is generated.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Button variant="outline" size="sm" asChild>
                <Link to="/legal-decoder">Understand Documents</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/education-library">Learn Your Rights</Link>
              </Button>
            </div>
          </div>

          {/* Closing Statement */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="space-y-3 text-muted-foreground text-sm leading-relaxed">
              <p>
                This flow is designed to reduce overwhelm and keep you focused on one outcome.
              </p>
              <p>
                You stay in control of what to include and when to share.
              </p>
              <p className="text-foreground/80 font-medium">
                The goal is simple: a clear packet an attorney can review quickly.
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
