import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Lock,
  ArrowRight,
  LogOut,
  ChevronDown,
  Feather,
  Clock,
  FileText,
  FileAudio,
  Search,
  BookOpen,
  Scale,
  Library,
  FolderOpen,
  FileSearch,
  FileCheck,
  ClipboardList,
  Building2,
  Users,
  Phone,
  Heart,
  Bookmark,
  Bell,
  LayoutDashboard,
  Download,
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Phase data                                                         */
/* ------------------------------------------------------------------ */

interface PhaseTool {
  icon: React.ElementType;
  title: string;
  description: string;
  href: string;
  requiresAuth?: boolean;
  comingSoon?: boolean;
}

interface Phase {
  number: number;
  title: string;
  reassurance: string;
  tools: PhaseTool[];
}

const phases: Phase[] = [
  {
    number: 1,
    title: "Tell Your Story",
    reassurance:
      "Start wherever feels right. You don't need to have everything figured out — just begin with what you remember. Your words matter, and this is your space to put them down safely.",
    tools: [
      {
        icon: Feather,
        title: "Clarion",
        description: "Build a structured narrative from your experience.",
        href: "/clarion",
        requiresAuth: true,
      },
      {
        icon: Clock,
        title: "Timeline Creator",
        description: "Organize events chronologically so the bigger picture becomes clear.",
        href: "/timeline",
        requiresAuth: true,
      },
      {
        icon: FileText,
        title: "Notes",
        description: "Capture thoughts, observations, and strategy reflections.",
        href: "/notes",
        requiresAuth: true,
      },
      {
        icon: FileAudio,
        title: "Transcription Tool",
        description: "Upload audio or paste text to organize what was said.",
        href: "/transcription",
        requiresAuth: true,
      },
    ],
  },
  {
    number: 2,
    title: "Understand Your Case",
    reassurance:
      "Once your story is captured, the platform helps you see it through a legal lens — calmly and clearly. No jargon walls. No overwhelming lists.",
    tools: [
      {
        icon: Search,
        title: "Civil Rights Analyzer",
        description: "Identify possible claims and understand the systems involved.",
        href: "/analyzer",
        requiresAuth: true,
      },
      {
        icon: BookOpen,
        title: "Legal Decoder",
        description: "Upload legal documents and get plain-language explanations.",
        href: "/legal-decoder",
        requiresAuth: true,
      },
      {
        icon: Scale,
        title: "Rights Insight",
        description: "Educational guides to help you understand your rights.",
        href: "/rights-insight",
      },
      {
        icon: Library,
        title: "Library",
        description: "Deeper legal literacy resources and reference material.",
        href: "/library",
      },
    ],
  },
  {
    number: 3,
    title: "Organize Your Proof",
    reassurance:
      "Scattered files become structured evidence. Everything you gather is connected to your story and your case — nothing exists in isolation.",
    tools: [
      {
        icon: FolderOpen,
        title: "Evidence Vault",
        description: "Catalog documents, photos, and records in one secure place.",
        href: "/evidence-vault",
        requiresAuth: true,
      },
      {
        icon: FileSearch,
        title: "Public Request Rights",
        description: "Understand and request public records you may be entitled to.",
        href: "/public-request-rights",
        requiresAuth: true,
      },
    ],
  },
  {
    number: 4,
    title: "Prepare for Action",
    reassurance:
      "When you're ready, these tools help you turn insight into readiness — templates, packets, and procedural clarity so you feel prepared, not pressured.",
    tools: [
      {
        icon: FileCheck,
        title: "Legal Templates",
        description: "Educational templates to understand common legal documents.",
        href: "/legal-templates",
        requiresAuth: true,
      },
      {
        icon: ClipboardList,
        title: "Intake Packet",
        description: "Generate a structured summary to share with an attorney.",
        href: "/intake-packet",
        requiresAuth: true,
      },
      {
        icon: Building2,
        title: "Courts & Filing Info",
        description: "Procedural guidance for courts and filing processes.",
        href: "/courts-filing-info",
      },
      {
        icon: Bell,
        title: "Deadlines & Reminders",
        description: "Track critical dates so nothing slips through the cracks.",
        href: "#",
        comingSoon: true,
      },
    ],
  },
  {
    number: 5,
    title: "Connect & Advocate",
    reassurance:
      "You don't have to do this alone. These tools help you find the right people, track your outreach, and access support along the way.",
    tools: [
      {
        icon: Users,
        title: "Find Legal Help",
        description: "Search for attorneys and legal aid by area and issue type.",
        href: "/find-help",
      },
      {
        icon: Phone,
        title: "Attorney Contacts",
        description: "Track outreach and record consultation notes.",
        href: "/attorney-contacts",
        requiresAuth: true,
      },
      {
        icon: Bookmark,
        title: "Saved Attorneys",
        description: "Keep a shortlist of attorneys you're considering.",
        href: "/saved-attorneys",
        requiresAuth: true,
      },
      {
        icon: Heart,
        title: "Support Network",
        description: "Access community and trauma-aware support resources.",
        href: "/support-network",
      },
      {
        icon: LayoutDashboard,
        title: "Case Summary Dashboard",
        description: "Auto-generated overview of your full case status.",
        href: "#",
        comingSoon: true,
      },
      {
        icon: Download,
        title: "Export Tools",
        description: "Download your intake packet, evidence index, and timeline.",
        href: "#",
        comingSoon: true,
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  PhaseSection component                                             */
/* ------------------------------------------------------------------ */

function PhaseSection({
  phase,
  isOpen,
  onToggle,
  onToolClick,
}: {
  phase: Phase;
  isOpen: boolean;
  onToggle: () => void;
  onToolClick: (tool: PhaseTool) => void;
}) {
  return (
    <div className="relative">
      {/* Collapsible header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 p-5 rounded-2xl bg-card border border-border hover:border-accent/30 transition-all duration-300 text-left group"
      >
        <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center shrink-0 text-accent font-bold text-lg">
          {phase.number}
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
            {phase.title}
          </h2>
        </div>
        <ChevronDown
          className={cn(
            "w-5 h-5 text-muted-foreground transition-transform duration-300",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Collapsible content */}
      {isOpen && (
        <div className="mt-3 pl-4 md:pl-14 space-y-3 animate-in slide-in-from-top-2 duration-300">
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mb-4">
            {phase.reassurance}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {phase.tools.map((tool) => (
              <button
                key={tool.title}
                onClick={() => onToolClick(tool)}
                disabled={tool.comingSoon}
                className={cn(
                  "group/tool flex items-start gap-3 p-4 rounded-xl bg-secondary/50 border text-left transition-all duration-200",
                  tool.comingSoon
                    ? "opacity-50 cursor-not-allowed border-border"
                    : "border-border hover:border-accent/40 hover:bg-secondary cursor-pointer active:scale-[0.98]"
                )}
              >
                <div
                  className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                    tool.comingSoon
                      ? "bg-muted"
                      : "bg-accent/10 group-hover/tool:bg-accent/20"
                  )}
                >
                  <tool.icon
                    className={cn(
                      "w-4 h-4",
                      tool.comingSoon
                        ? "text-muted-foreground"
                        : "text-accent"
                    )}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3
                      className={cn(
                        "text-sm font-medium transition-colors",
                        tool.comingSoon
                          ? "text-muted-foreground"
                          : "text-foreground group-hover/tool:text-accent"
                      )}
                    >
                      {tool.title}
                    </h3>
                {tool.comingSoon && (
                      <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-accent/10 text-accent/70 border border-accent/20 font-medium tracking-wide uppercase">
                        In Progress
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {tool.description}
                  </p>
                </div>
                {!tool.comingSoon && (
                  <ArrowRight className="w-3.5 h-3.5 text-accent opacity-0 group-hover/tool:opacity-100 transition-opacity mt-1 shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function SelfHelpTools() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [openPhases, setOpenPhases] = useState<number[]>([1]);

  const togglePhase = (num: number) => {
    setOpenPhases((prev) =>
      prev.includes(num) ? prev.filter((n) => n !== num) : [...prev, num]
    );
  };

  const handleToolClick = (tool: PhaseTool) => {
    if (tool.comingSoon) return;
    if (!user && tool.requiresAuth) {
      navigate(`/auth?redirect=${tool.href}`);
    } else {
      navigate(tool.href);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <Layout>
      <div className="container py-12 lg:py-20">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
              <Lock className="w-4 h-4" />
              <span>Your Guided System</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Your Path to Clarity
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A connected system that moves with you — from first thoughts to informed action. Every tool supports the next.
            </p>
          </div>

          {/* User Status */}
          {user && (
            <div className="flex items-center justify-between p-4 rounded-xl bg-primary/10 border border-primary/20 mb-8">
              <p className="text-sm text-foreground">
                Signed in as <strong>{user.email}</strong>
              </p>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          )}

          {/* Wellbeing Note */}
          <div className="p-4 rounded-xl bg-muted/50 border border-border mb-10">
            <p className="text-sm text-muted-foreground text-center">
              <strong className="text-foreground">You don't have to follow every phase.</strong>{" "}
              Start wherever feels right. Take breaks when you need them, and remember you can return anytime.
            </p>
          </div>

          {/* Phases */}
          <div className="space-y-2 relative">
            {phases.map((phase, idx) => (
              <div key={phase.number}>
                <PhaseSection
                  phase={phase}
                  isOpen={openPhases.includes(phase.number)}
                  onToggle={() => togglePhase(phase.number)}
                  onToolClick={handleToolClick}
                />
                {/* Connector line */}
                {idx < phases.length - 1 && (
                  <div className="flex justify-center py-1">
                    <div className="w-px h-6 bg-accent/30" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Sign In CTA */}
          {!user && (
            <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border text-center">
              <Lock className="w-12 h-12 text-accent mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Sign in to access your tools
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Create a free account to securely store your information and access all tools across every phase.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/auth">
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/auth">Create Account</Link>
                </Button>
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-12 pt-8 border-t border-border">
            <Disclaimer className="justify-center" />
          </div>
        </div>
      </div>
    </Layout>
  );
}
