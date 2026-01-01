import { Link } from "react-router-dom";
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
  ArrowRight
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Disclaimer } from "@/components/shared/Disclaimer";

const tools = [
  {
    icon: FolderOpen,
    title: "Evidence Vault",
    description: "Securely store and organize documents, photos, audio, and video related to your situation.",
    status: "available"
  },
  {
    icon: Clock,
    title: "Timeline Creator",
    description: "Build a chronological record of events to help you and professionals understand what happened.",
    status: "available"
  },
  {
    icon: FileText,
    title: "Notes",
    description: "Keep detailed notes about conversations, observations, and important details.",
    status: "available"
  },
  {
    icon: Bell,
    title: "Deadlines & Reminders",
    description: "Track important dates and set reminders so you don't miss critical deadlines.",
    status: "available"
  },
  {
    icon: LayoutDashboard,
    title: "Case Summary Dashboard",
    description: "See an overview of your situation with editable summaries and key information.",
    status: "available"
  },
  {
    icon: Bookmark,
    title: "Bookmarks",
    description: "Save and organize helpful resources, guides, and references from the platform.",
    status: "available"
  },
  {
    icon: FileCheck,
    title: "Templates & Checklists",
    description: "Access pre-made templates and checklists to help you stay organized.",
    status: "available"
  },
  {
    icon: Download,
    title: "Export Tools",
    description: "Download your information in organized formats to share with attorneys or agencies.",
    status: "available"
  },
];

export default function SelfHelpTools() {
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
              Organize your evidence, track timelines, and prepare your information — all in one secure place.
            </p>
          </div>

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
              <div
                key={tool.title}
                className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-glow transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <tool.icon className="w-6 h-6 text-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sign In CTA */}
          <div className="p-8 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border text-center">
            <Lock className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Sign in to access your tools
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Create a free account to securely store your information and access all self-help tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" asChild>
                <Link to="/signin">
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/signup">
                  Create Account
                </Link>
              </Button>
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
