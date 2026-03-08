import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FolderOpen,
  Clock,
  FileText,
  Upload,
  Scale,
  Activity,
  Feather,
  Search,
  Archive,
  Briefcase,
  Users,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DjPageHeader } from "@/components/ui/dj-page-header";
import { PhaseProgress } from "@/components/ui/dj-progress";
import { StatCard, ActionCard, LinkListCard } from "@/components/ui/dj-card";
import { SuggestedAction, PrivacyBadge } from "@/components/ui/dj-widget";
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
      <DashboardLayout pageTitle="Dashboard">
        <div className="container py-20 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </DashboardLayout>
    );
  }

  const displayName = user.email?.split("@")[0] || "there";

  const phases = [
    { number: 1, title: "Tell Your Story", icon: Feather, started: stats.clarionCount > 0 || stats.notesCount > 0 || stats.timelineCount > 0 },
    { number: 2, title: "Understand Your Case", icon: Search, started: stats.analyzerCount > 0 },
    { number: 3, title: "Organize Your Proof", icon: Archive, started: stats.evidenceCount > 0 },
    { number: 4, title: "Prepare for Action", icon: Briefcase, started: stats.intakeCount > 0 },
    { number: 5, title: "Connect & Advocate", icon: Users, started: stats.attorneyContactCount > 0 },
  ];

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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <DashboardLayout pageTitle="Dashboard">
      {/* Header */}
      <DjPageHeader
        title={`Welcome back, ${displayName}.`}
        subtitle="Your private civil-rights documentation workspace."
      />

      {/* Phase Progress */}
      <section className="bg-cream py-10 sm:py-12">
        <div className="container max-w-5xl px-6">
          <h2 className="font-serif text-xl font-medium text-foreground mb-6">Your Journey</h2>
          <PhaseProgress phases={phases} />
        </div>
      </section>

      {/* Suggested Next Step */}
      <section className="bg-cream-warm py-8">
        <div className="container max-w-5xl px-6">
          <SuggestedAction
            text={suggestedStep.text}
            href={suggestedStep.href}
            label={suggestedStep.label}
          />
        </div>
      </section>

      {/* Quick Actions */}
      <section className="bg-cream py-12 sm:py-16">
        <div className="container max-w-5xl px-6">
          <div className="grid sm:grid-cols-2 gap-5">
            <ActionCard icon={Scale} title="Continue Your Record" description="Return to your case workspace and pick up where you left off." href="/justice-place" delay={0.1} />
            <ActionCard icon={Upload} title="Upload Evidence" description="Add documents, photos, or files to your secure evidence vault." href="/evidence-vault" delay={0.18} />
            <ActionCard icon={Clock} title="Build Timeline" description="Add events and create a clear chronological record." href="/timeline" delay={0.26} />
            <ActionCard icon={FileText} title="Request Records" description="Understand your right to request public records and documents." href="/public-request-rights" delay={0.34} />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-cream-warm py-10 sm:py-14">
        <div className="container max-w-5xl px-6">
          <h2 className="font-serif text-2xl font-medium text-foreground mb-8">Your Progress</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCard icon={FolderOpen} value={stats.evidenceCount} label="Evidence Items" />
            <StatCard icon={Clock} value={stats.timelineCount} label="Timeline Events" />
            <StatCard icon={FileText} value={stats.notesCount} label="Notes" />
            <StatCard icon={Activity} value={stats.lastActivity ? formatDate(stats.lastActivity) : "—"} label="Last Activity" />
          </div>
        </div>
      </section>

      {/* Three Sections */}
      <section className="bg-cream py-12 sm:py-16">
        <div className="container max-w-5xl px-6">
          <div className="grid sm:grid-cols-3 gap-6">
            <LinkListCard
              title="Guidance"
              description="Plain-language explanations of systems, rights, and what to expect."
              links={[
                { label: "Rights Insight", href: "/rights-insight" },
                { label: "Civil Rights Library", href: "/library" },
                { label: "Courts & Filing", href: "/courts-filing-info" },
              ]}
            />
            <LinkListCard
              title="Legal Prep"
              description="Templates, case preparation tools, and attorney readiness."
              links={[
                { label: "Legal Templates", href: "/legal-templates" },
                { label: "Intake Packet", href: "/intake-packet" },
                { label: "Case Analyzer", href: "/analyzer" },
              ]}
            />
            <LinkListCard
              title="Support"
              description="Find attorneys, saved contacts, and support organizations."
              links={[
                { label: "Find Attorneys", href: "/find-help" },
                { label: "Attorney Contact Hub", href: "/attorney-contacts" },
                { label: "Saved Attorneys", href: "/saved-attorneys" },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section className="py-8">
        <div className="container max-w-5xl px-6">
          <PrivacyBadge />
        </div>
      </section>
    </DashboardLayout>
  );
}
