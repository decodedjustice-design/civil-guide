import { useState } from "react";
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
  Compass,
  Gavel,
  ChevronDown,
  Users,
  HelpCircle,
  Wrench
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

interface ToolCategory {
  id: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  tools: ToolCard[];
}

const categories: ToolCategory[] = [
  {
    id: "self-help",
    icon: Scale,
    title: "Self-Help Tools",
    subtitle: "Understand, document, and decode your situation",
    tools: [
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
    ],
  },
  {
    id: "learning",
    icon: BookOpen,
    title: "Learning Tools",
    subtitle: "Guides and references for navigating systems",
    tools: [
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
      {
        icon: Gavel,
        title: "Courts & Filing Info",
        description: "Understand where and how to file civil rights cases in Washington State and federal courts.",
        href: "/courts-filing-info",
        buttonLabel: "Open Guide",
        available: true,
      },
    ],
  },
  {
    id: "organization",
    icon: Layers,
    title: "Organization Tools",
    subtitle: "Keep everything structured and accessible",
    tools: [
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
    ],
  },
  {
    id: "ai-support",
    icon: Sparkles,
    title: "AI Support Tools",
    subtitle: "Guided assistance for research and transcription",
    tools: [
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
    ],
  },
];

function CategoryCard({ category }: { category: ToolCategory }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = category.icon;

  return (
    <div className="rounded-2xl bg-card border-2 border-border transition-all duration-300 hover:border-accent/30">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 p-5 text-left cursor-pointer"
      >
        <div className="w-11 h-11 rounded-xl bg-accent/15 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-semibold text-foreground">{category.title}</h2>
            <span className="text-xs text-muted-foreground shrink-0">
              {category.tools.length} {category.tools.length === 1 ? "tool" : "tools"}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">{category.subtitle}</p>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300 ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {expanded && (
        <div className="px-5 pb-5 pt-1 border-t border-border/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
            {category.tools.map((tool) => (
              <Link
                key={tool.title}
                to={tool.href}
                className="group flex items-start gap-3 p-4 rounded-xl bg-secondary/40 border border-border hover:border-accent/40 hover:bg-secondary/70 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-lg bg-card flex items-center justify-center shrink-0 group-hover:bg-accent/15 transition-colors">
                  <tool.icon className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
                      {tool.title}
                    </h3>
                    <ArrowRight className="w-3.5 h-3.5 text-accent opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {tool.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Tools() {
  return (
    <Layout>
      <div className="container py-12 lg:py-20">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-4">
              <Compass className="w-4 h-4" />
              <span>Platform Overview</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              What You Can Do Here
            </h1>
            <p className="text-muted-foreground">
              Understand, document, and organize your civil rights situation — all in one place.
            </p>
          </div>

          {/* Wellbeing Note */}
          <div className="p-3 rounded-xl bg-secondary/50 border border-border mb-10">
            <p className="text-xs text-muted-foreground text-center">
              <strong className="text-foreground">Go at your own pace.</strong> You don't have to use every tool. 
              Start with what feels right, and return whenever you need.
            </p>
          </div>

          {/* Category Cards */}
          <div className="space-y-3 mb-16">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>

          {/* Help CTA */}
          <div className="p-8 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border text-center mb-16">
            <h2 className="text-xl font-semibold text-foreground mb-3">
              Not sure where to start?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto text-sm">
              The Civil Rights Analyzer helps you understand your situation and shows which tools may help most.
            </p>
            <Button variant="hero" size="lg" asChild>
              <Link to="/analyzer">
                Start with the Analyzer
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>

          {/* Bottom Navigation Pathway */}
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground mb-4 text-center">Continue exploring</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: "Support Network", href: "/support-network", icon: Users },
                { label: "Find Legal Help", href: "/find-help", icon: HelpCircle },
                { label: "Library", href: "/library", icon: BookOpen },
                { label: "Self-Help Tools", href: "/self-help", icon: Wrench },
                { label: "Analyzer", href: "/analyzer", icon: Scale },
                { label: "About", href: "/about", icon: Compass },
              ].map((nav) => (
                <Link
                  key={nav.href}
                  to={nav.href}
                  className="group flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/20 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <nav.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {nav.label}
                  </span>
                </Link>
              ))}
            </div>
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
