import { Link, useNavigate } from "react-router-dom";
import { 
  FolderOpen, 
  Clock, 
  FileText, 
  Bell, 
  LayoutDashboard, 
  Bookmark, 
  FileCheck, 
  Download,
  Lock,
  ArrowRight,
  LogOut,
  ChevronRight,
  BookOpen
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { useAuth } from "@/contexts/AuthContext";
import { educationalGuides } from "@/data/educationalGuides";

const tools = [
  {
    icon: FileText,
    title: "Notes",
    description: "Keep detailed notes about conversations, observations, and important details.",
    href: "/notes",
    status: "available"
  },
  {
    icon: FolderOpen,
    title: "Evidence Vault",
    description: "Securely catalog and organize documents, photos, and records related to your situation.",
    href: "/evidence-vault",
    status: "available"
  },
  {
    icon: Clock,
    title: "Timeline Creator",
    description: "Build a chronological record of events to help you and professionals understand what happened.",
    href: "/timeline",
    status: "available"
  },
  {
    icon: Bell,
    title: "Deadlines & Reminders",
    description: "Track important dates and set reminders so you don't miss critical deadlines.",
    href: "#",
    status: "coming-soon"
  },
  {
    icon: LayoutDashboard,
    title: "Case Summary Dashboard",
    description: "See an overview of your situation with editable summaries and key information.",
    href: "#",
    status: "coming-soon"
  },
  {
    icon: Bookmark,
    title: "Bookmarks",
    description: "Save and organize helpful resources, guides, and references from the platform.",
    href: "/rights-insight",
    status: "available"
  },
  {
    icon: FileCheck,
    title: "Templates & Checklists",
    description: "Access pre-made templates and checklists to help you stay organized.",
    href: "#",
    status: "coming-soon"
  },
  {
    icon: Download,
    title: "Export Tools",
    description: "Download your information in organized formats to share with attorneys or agencies.",
    href: "#",
    status: "coming-soon"
  },
];

export default function SelfHelpTools() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleToolClick = (tool: typeof tools[0]) => {
    if (tool.status === "coming-soon") return;
    
    if (!user && tool.href !== "/rights-insight") {
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
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border text-muted-foreground text-sm font-medium mb-6">
              <Lock className="w-4 h-4" />
              <span>Member Area</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Self-Help Tools
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Organize your evidence, track timelines, and prepare your information — all in one secure space.
            </p>
          </div>

          {/* User Status */}
          {user && (
            <div className="flex items-center justify-between p-4 rounded-xl bg-primary/10 border border-primary/20 mb-8">
              <div>
                <p className="text-sm text-foreground">
                  Signed in as <strong>{user.email}</strong>
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          )}

          {/* Wellbeing Note */}
          <div className="p-4 rounded-xl bg-muted/50 border border-border mb-10">
            <p className="text-sm text-muted-foreground text-center">
              <strong className="text-foreground">Go at your own pace.</strong> Revisiting difficult experiences can be hard. 
              Take breaks when you need them, and remember you can return anytime.
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            {tools.map((tool) => (
              <button
                key={tool.title}
                onClick={() => handleToolClick(tool)}
                disabled={tool.status === "coming-soon"}
                className={`group p-6 rounded-2xl bg-card border-2 text-left transition-all duration-300 ${
                  tool.status === "coming-soon" 
                    ? "opacity-60 cursor-not-allowed border-border" 
                    : "border-border hover:border-primary/50 hover:shadow-glow cursor-pointer active:scale-[0.98]"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                    tool.status === "coming-soon" 
                      ? "bg-muted" 
                      : "bg-secondary group-hover:bg-primary/20 group-hover:scale-105"
                  }`}>
                    <tool.icon className={`w-6 h-6 transition-colors ${
                      tool.status === "coming-soon" 
                        ? "text-muted-foreground" 
                        : "text-foreground group-hover:text-primary"
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className={`font-semibold transition-colors ${
                        tool.status === "coming-soon" 
                          ? "text-muted-foreground" 
                          : "text-foreground group-hover:text-primary"
                      }`}>
                        {tool.title}
                      </h3>
                      {tool.status === "coming-soon" ? (
                        <span className="px-2 py-0.5 text-xs rounded bg-muted text-muted-foreground">
                          Coming Soon
                        </span>
                      ) : (
                        <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Educational Guides Section */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Educational Guides</h2>
                  <p className="text-sm text-muted-foreground">In-depth guides for navigating specific systems</p>
                </div>
              </div>
              <Button variant="soft" size="sm" asChild>
                <Link to="/rights-insight">
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {educationalGuides.slice(0, 2).map((guide) => (
                <Link
                  key={guide.id}
                  to={`/full-guide/${guide.id}`}
                  className="group p-5 rounded-2xl bg-card border border-border hover:border-accent/30 hover:shadow-glow transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">
                      {guide.title}
                    </h3>
                    <span className="text-xs text-muted-foreground shrink-0">{guide.readTime}</span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {guide.whatThisSystemIs.description.slice(0, 120)}...
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-accent">
                    Read Guide
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Sign In CTA - only show if not logged in */}
          {!user && (
            <div className="mt-10 p-8 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border text-center">
              <Lock className="w-12 h-12 text-accent mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Sign in to access your tools
              </h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Create a free account to securely store your information and access all self-help tools.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/auth">
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/auth">
                    Create Account
                  </Link>
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
