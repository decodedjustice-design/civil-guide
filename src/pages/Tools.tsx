import { Link } from "react-router-dom";
import { 
  Scale, 
  FolderOpen, 
  Clock, 
  FileAudio, 
  FileSearch, 
  BookOpen, 
  Map, 
  Layers, 
  FileText, 
  Sparkles, 
  Mic,
  ArrowRight,
  Compass
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/shared/Disclaimer";

interface ToolCard {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
  buttonLabel: string;
  available: boolean;
}

const selfHelpTools: ToolCard[] = [
  {
    icon: Scale,
    title: "Civil Rights Analyzer",
    description: "Understand what system you are in and what patterns may be present.",
    href: "/analyzer",
    buttonLabel: "Open Analyzer",
    available: true,
  },
  {
    icon: FileText,
    title: "Public Request Rights",
    description: "Understand, request, and organize public records and documents.",
    href: "/public-request-rights",
    buttonLabel: "Open Tool",
    available: true,
  },
  {
    icon: FolderOpen,
    title: "Evidence Vault",
    description: "Store and organize documents, files, and records securely.",
    href: "/evidence-vault",
    buttonLabel: "Open Vault",
    available: true,
  },
  {
    icon: Clock,
    title: "Timeline Builder",
    description: "Build a clear timeline of events to help you and others understand what happened.",
    href: "/timeline",
    buttonLabel: "Open Timeline",
    available: true,
  },
  {
    icon: FileAudio,
    title: "Transcription Tool",
    description: "Upload audio or text to create transcripts for personal documentation.",
    href: "/transcription",
    buttonLabel: "Open Transcriber",
    available: true,
  },
  {
    icon: FileSearch,
    title: "Justice Decoder",
    description: "Translate complex legal language into plain English.",
    href: "/legal-decoder",
    buttonLabel: "Open Decoder",
    available: true,
  },
];

const learningTools: ToolCard[] = [
  {
    icon: BookOpen,
    title: "Civil Rights Library",
    description: "Learn how systems work and what rights exist through step-by-step guides.",
    href: "/library",
    buttonLabel: "Open Library",
    available: true,
  },
  {
    icon: Map,
    title: "System Guides",
    description: "Understand how different systems operate — police, courts, housing, CPS, and more.",
    href: "/rights-insight",
    buttonLabel: "Open Guides",
    available: true,
  },
];

const organizationTools: ToolCard[] = [
  {
    icon: Layers,
    title: "Case Organization",
    description: "Group evidence, timelines, and notes together in one place.",
    href: "/self-help",
    buttonLabel: "Open Organizer",
    available: true,
  },
  {
    icon: FileText,
    title: "Notes",
    description: "Keep detailed notes about conversations, observations, and important details.",
    href: "/notes",
    buttonLabel: "Open Notes",
    available: true,
  },
];

const aiSupportTools: ToolCard[] = [
  {
    icon: Sparkles,
    title: "Research Assistance",
    description: "Help organizing information and understanding patterns — safely and clearly.",
    href: "/guide/ai-prompt-guide",
    buttonLabel: "Open AI Guide",
    available: true,
  },
  {
    icon: Mic,
    title: "Transcription AI",
    description: "Convert audio into structured text with speaker separation.",
    href: "/transcription",
    buttonLabel: "Open Transcription",
    available: true,
  },
];

interface ToolSectionProps {
  icon: React.ElementType;
  title: string;
  tools: ToolCard[];
}

function ToolSection({ icon: Icon, title, tools }: ToolSectionProps) {
  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
          <Icon className="w-5 h-5 text-accent" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tools.map((tool) => (
          <div
            key={tool.title}
            className={`group p-6 rounded-2xl bg-card border-2 transition-all duration-300 ${
              tool.available 
                ? "border-border hover:border-accent/50 hover:shadow-glow" 
                : "border-border opacity-60"
            }`}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                  tool.available 
                    ? "bg-secondary group-hover:bg-accent/20 group-hover:scale-105" 
                    : "bg-muted"
                }`}>
                  <tool.icon className={`w-6 h-6 transition-colors ${
                    tool.available 
                      ? "text-foreground group-hover:text-accent" 
                      : "text-muted-foreground"
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold mb-1 transition-colors ${
                    tool.available 
                      ? "text-foreground group-hover:text-accent" 
                      : "text-muted-foreground"
                  }`}>
                    {tool.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              </div>
              
              <div className="mt-auto pt-4">
                {tool.available ? (
                  <Button variant="soft" size="sm" className="w-full" asChild>
                    <Link to={tool.href}>
                      {tool.buttonLabel}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" className="w-full" disabled>
                    Coming Soon
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Tools() {
  return (
    <Layout>
      <div className="container py-12 lg:py-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
              <Compass className="w-4 h-4" />
              <span>Platform Overview</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What You Can Do Here
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Decoded Justice gives you tools to understand, document, and organize your civil rights situation — in one place.
            </p>
          </div>

          {/* Wellbeing Note */}
          <div className="p-4 rounded-xl bg-muted/50 border border-border mb-12 max-w-2xl mx-auto">
            <p className="text-sm text-muted-foreground text-center">
              <strong className="text-foreground">Go at your own pace.</strong> You don't have to use every tool. 
              Start with what feels right, and return whenever you need.
            </p>
          </div>

          {/* Tool Sections */}
          <ToolSection 
            icon={Scale} 
            title="Self-Help Tools" 
            tools={selfHelpTools} 
          />
          
          <ToolSection 
            icon={BookOpen} 
            title="Learning Tools" 
            tools={learningTools} 
          />
          
          <ToolSection 
            icon={Layers} 
            title="Organization Tools" 
            tools={organizationTools} 
          />
          
          <ToolSection 
            icon={Sparkles} 
            title="AI Support Tools" 
            tools={aiSupportTools} 
          />

          {/* Help Section */}
          <div className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border text-center">
            <h2 className="text-xl font-semibold text-foreground mb-3">
              Not sure where to start?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              The Civil Rights Analyzer helps you understand your situation and shows which tools may help most.
            </p>
            <Button variant="hero" size="lg" asChild>
              <Link to="/analyzer">
                Start with the Analyzer
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="mt-12 pt-8 border-t border-border">
            <Disclaimer className="justify-center" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
