import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FolderOpen, 
  Clock, 
  FileText, 
  ArrowRight, 
  Shield, 
  Upload,
  Scale,
  Activity,
  CheckCircle2,
  Circle,
  Feather,
  Search,
  Archive,
  Briefcase,
  Users
} from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface CaseStats {
  evidenceCount: number;
  timelineCount: number;
  notesCount: number;
  lastActivity: string | null;
  clarionCount: number;
  analyzerCount: number;
  intakeCount: number;
  attorneyContactCount: number;
}

interface PhaseInfo {
  number: number;
  title: string;
  icon: React.ElementType;
  started: boolean;
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<CaseStats>({
    evidenceCount: 0,
    timelineCount: 0,
    notesCount: 0,
    lastActivity: null,
    clarionCount: 0,
    analyzerCount: 0,
    intakeCount: 0,
    attorneyContactCount: 0,
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth?redirect=/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      const [evidenceRes, timelineRes, notesRes, clarionRes, analyzerRes, intakeRes, attorneyRes] = await Promise.all([
        supabase.from("evidence").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("timeline_entries").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("notes").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("clarion_entries").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("analyzer_results").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("intake_packets").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("attorney_contacts").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      ]);

      const { data: recentEvidence } = await supabase
        .from("evidence")
        .select("updated_at")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(1);

      const { data: recentNote } = await supabase
        .from("notes")
        .select("updated_at")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(1);

      const dates = [
        recentEvidence?.[0]?.updated_at,
        recentNote?.[0]?.updated_at,
      ].filter(Boolean).sort().reverse();

      setStats({
        evidenceCount: evidenceRes.count || 0,
        timelineCount: timelineRes.count || 0,
        notesCount: notesRes.count || 0,
        lastActivity: dates[0] || null,
        clarionCount: clarionRes.count || 0,
        analyzerCount: analyzerRes.count || 0,
        intakeCount: intakeRes.count || 0,
        attorneyContactCount: attorneyRes.count || 0,
      });
    };

    fetchStats();
  }, [user]);

  if (loading || !user) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </Layout>
    );
  }

  const displayName = user.email?.split("@")[0] || "there";

  // Phase definitions with started logic
  const phases: PhaseInfo[] = [
    {
      number: 1,
      title: "Tell Your Story",
      icon: Feather,
      started: stats.clarionCount > 0 || stats.notesCount > 0 || stats.timelineCount > 0,
    },
    {
      number: 2,
      title: "Understand Your Case",
      icon: Search,
      started: stats.analyzerCount > 0,
    },
    {
      number: 3,
      title: "Organize Your Proof",
      icon: Archive,
      started: stats.evidenceCount > 0,
    },
    {
      number: 4,
      title: "Prepare for Action",
      icon: Briefcase,
      started: stats.intakeCount > 0,
    },
    {
      number: 5,
      title: "Connect & Advocate",
      icon: Users,
      started: stats.attorneyContactCount > 0,
    },
  ];

  // Suggested next step logic
  const getSuggestedStep = () => {
    if (stats.clarionCount === 0 && stats.notesCount === 0 && stats.timelineCount === 0) {
      return { text: "Start by writing down what happened", href: "/clarion", label: "Open Clarion" };
    }
    if (stats.analyzerCount === 0) {
      return { text: "Understand what system you're dealing with", href: "/analyzer", label: "Open Analyzer" };
    }
    if (stats.evidenceCount === 0) {
      return { text: "Upload your first piece of evidence", href: "/evidence-vault", label: "Open Evidence Vault" };
    }
    if (stats.intakeCount === 0) {
      return { text: "Build your intake packet for an attorney", href: "/intake-packet", label: "Create Intake Packet" };
    }
    if (stats.attorneyContactCount === 0) {
      return { text: "Find and reach out to an attorney", href: "/find-help", label: "Find Legal Help" };
    }
    return { text: "You're making strong progress — keep building your record", href: "/justice-place", label: "Continue" };
  };

  const suggestedStep = getSuggestedStep();

  const primaryActions = [
    {
      icon: Scale,
      title: "Continue Your Record",
      description: "Return to your case workspace and pick up where you left off.",
      href: "/justice-place",
    },
    {
      icon: Upload,
      title: "Upload Evidence",
      description: "Add documents, photos, or files to your secure evidence vault.",
      href: "/evidence-vault",
    },
    {
      icon: Clock,
      title: "Build Timeline",
      description: "Add events and create a clear chronological record.",
      href: "/timeline",
    },
    {
      icon: FileText,
      title: "Request Records",
      description: "Understand your right to request public records and documents.",
      href: "/public-request-rights",
    },
  ];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Layout>
      {/* Header Section */}
      <section className="bg-espresso py-16 sm:py-20">
        <div className="container max-w-4xl px-6">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-white/95 mb-4 animate-fade-up">
            Welcome back, {displayName}.
          </h1>
          <p className="text-lg text-white/50 font-light tracking-wide animate-fade-up" style={{ animationDelay: "0.15s", opacity: 0 }}>
            Your private civil-rights documentation workspace.
          </p>
        </div>
      </section>

      {/* Phase Progress Bar */}
      <section className="bg-cream py-10 sm:py-12">
        <div className="container max-w-5xl px-6">
          <h2 className="font-serif text-xl font-medium text-foreground mb-6">Your Journey</h2>
          <div className="flex items-center gap-0">
            {phases.map((phase, index) => (
              <div key={phase.number} className="flex items-center flex-1 min-w-0">
                <div className="flex flex-col items-center text-center flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    phase.started 
                      ? "border-gold bg-gold/15 text-gold" 
                      : "border-border bg-card text-muted-foreground/40"
                  }`}>
                    {phase.started ? (
                      <CheckCircle2 className="w-5 h-5" strokeWidth={1.5} />
                    ) : (
                      <Circle className="w-5 h-5" strokeWidth={1.5} />
                    )}
                  </div>
                  <p className={`text-xs mt-2 font-medium tracking-wide leading-tight ${
                    phase.started ? "text-foreground" : "text-muted-foreground"
                  }`}>
                    {phase.title}
                  </p>
                </div>
                {index < phases.length - 1 && (
                  <div className={`h-px flex-shrink-0 w-6 sm:w-10 mt-[-1rem] ${
                    phase.started ? "bg-gold/40" : "bg-border"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Suggested Next Step */}
      <section className="bg-cream-warm py-8">
        <div className="container max-w-5xl px-6">
          <div className="bg-card border border-gold/20 rounded-lg p-6 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                <ArrowRight className="w-4 h-4 text-gold" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground tracking-wide mb-0.5">Suggested Next Step</p>
                <p className="text-sm font-medium text-foreground">{suggestedStep.text}</p>
              </div>
            </div>
            <Link
              to={suggestedStep.href}
              className="text-sm font-medium text-primary hover:text-maroon-light transition-colors whitespace-nowrap"
            >
              {suggestedStep.label} →
            </Link>
          </div>
        </div>
      </section>

      {/* Primary Action Panel */}
      <section className="bg-cream py-12 sm:py-16">
        <div className="container max-w-5xl px-6">
          <div className="grid sm:grid-cols-2 gap-5">
            {primaryActions.map((action, index) => (
              <Link
                key={action.title}
                to={action.href}
                className="group bg-card border border-border/50 rounded-lg p-7 hover:shadow-md hover:border-gold/20 transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${0.1 + index * 0.08}s`, opacity: 0 }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-lg bg-secondary flex items-center justify-center shrink-0 group-hover:bg-gold/10 transition-colors">
                    <action.icon className="w-5 h-5 text-gold opacity-70 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-lg font-medium text-foreground mb-1.5 group-hover:text-primary transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-muted-foreground font-light leading-relaxed">
                      {action.description}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Case Status Panel */}
      <section className="bg-cream-warm py-10 sm:py-14">
        <div className="container max-w-5xl px-6">
          <h2 className="font-serif text-2xl font-medium text-foreground mb-8">
            Your Progress
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-card border border-border/50 rounded-lg p-6 text-center">
              <FolderOpen className="w-5 h-5 text-gold/60 mx-auto mb-3" strokeWidth={1.5} />
              <p className="text-2xl font-serif font-medium text-foreground">{stats.evidenceCount}</p>
              <p className="text-xs text-muted-foreground mt-1 tracking-wide">Evidence Items</p>
            </div>
            <div className="bg-card border border-border/50 rounded-lg p-6 text-center">
              <Clock className="w-5 h-5 text-gold/60 mx-auto mb-3" strokeWidth={1.5} />
              <p className="text-2xl font-serif font-medium text-foreground">{stats.timelineCount}</p>
              <p className="text-xs text-muted-foreground mt-1 tracking-wide">Timeline Events</p>
            </div>
            <div className="bg-card border border-border/50 rounded-lg p-6 text-center">
              <FileText className="w-5 h-5 text-gold/60 mx-auto mb-3" strokeWidth={1.5} />
              <p className="text-2xl font-serif font-medium text-foreground">{stats.notesCount}</p>
              <p className="text-xs text-muted-foreground mt-1 tracking-wide">Notes</p>
            </div>
            <div className="bg-card border border-border/50 rounded-lg p-6 text-center">
              <Activity className="w-5 h-5 text-gold/60 mx-auto mb-3" strokeWidth={1.5} />
              <p className="text-sm font-medium text-foreground">
                {stats.lastActivity ? formatDate(stats.lastActivity) : "—"}
              </p>
              <p className="text-xs text-muted-foreground mt-1 tracking-wide">Last Activity</p>
            </div>
          </div>
        </div>
      </section>

      {/* Three Clean Sections: Guidance / Legal Prep / Support */}
      <section className="bg-cream py-12 sm:py-16">
        <div className="container max-w-5xl px-6">
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-card border border-border/50 rounded-lg p-7">
              <h3 className="font-serif text-xl font-medium text-foreground mb-4">Guidance</h3>
              <p className="text-sm text-muted-foreground font-light mb-5 leading-relaxed">
                Plain-language explanations of systems, rights, and what to expect.
              </p>
              <div className="space-y-2.5">
                <Link to="/rights-insight" className="flex items-center gap-2 text-sm text-primary hover:text-maroon-light transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                  Rights Insight
                </Link>
                <Link to="/library" className="flex items-center gap-2 text-sm text-primary hover:text-maroon-light transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                  Civil Rights Library
                </Link>
                <Link to="/courts-filing-info" className="flex items-center gap-2 text-sm text-primary hover:text-maroon-light transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                  Courts & Filing
                </Link>
              </div>
            </div>

            <div className="bg-card border border-border/50 rounded-lg p-7">
              <h3 className="font-serif text-xl font-medium text-foreground mb-4">Legal Prep</h3>
              <p className="text-sm text-muted-foreground font-light mb-5 leading-relaxed">
                Templates, case preparation tools, and attorney readiness.
              </p>
              <div className="space-y-2.5">
                <Link to="/legal-templates" className="flex items-center gap-2 text-sm text-primary hover:text-maroon-light transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                  Legal Templates
                </Link>
                <Link to="/intake-packet" className="flex items-center gap-2 text-sm text-primary hover:text-maroon-light transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                  Intake Packet
                </Link>
                <Link to="/analyzer" className="flex items-center gap-2 text-sm text-primary hover:text-maroon-light transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                  Case Analyzer
                </Link>
              </div>
            </div>

            <div className="bg-card border border-border/50 rounded-lg p-7">
              <h3 className="font-serif text-xl font-medium text-foreground mb-4">Support</h3>
              <p className="text-sm text-muted-foreground font-light mb-5 leading-relaxed">
                Find attorneys, saved contacts, and support organizations.
              </p>
              <div className="space-y-2.5">
                <Link to="/find-help" className="flex items-center gap-2 text-sm text-primary hover:text-maroon-light transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                  Find Attorneys
                </Link>
                <Link to="/attorney-contacts" className="flex items-center gap-2 text-sm text-primary hover:text-maroon-light transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                  Attorney Contact Hub
                </Link>
                <Link to="/saved-attorneys" className="flex items-center gap-2 text-sm text-primary hover:text-maroon-light transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                  Saved Attorneys
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Note */}
      <section className="bg-espresso-light py-8">
        <div className="container max-w-4xl px-6 text-center">
          <div className="flex items-center justify-center gap-3">
            <Shield className="w-4 h-4 text-gold/60" strokeWidth={1.5} />
            <span className="text-sm text-white/50 tracking-wide">Your information remains private and under your control</span>
          </div>
        </div>
      </section>
    </Layout>
  );
}
