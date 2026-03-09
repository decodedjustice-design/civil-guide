import { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  BookOpen,
  Bookmark,
  TrendingUp,
  ArrowRight,
  Shield,
  Mic,
  Heart,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DjPageHeader } from "@/components/ui/dj-page-header";
import { PhaseProgress } from "@/components/ui/dj-progress";
import { StatCard, ActionCard, LinkListCard } from "@/components/ui/dj-card";
import { SuggestedAction, PrivacyBadge, Widget } from "@/components/ui/dj-widget";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

/* ─── Types ─── */
interface CaseStats {
  evidenceCount: number;
  timelineCount: number;
  notesCount: number;
  lastActivity: string | null;
  clarionCount: number;
  analyzerCount: number;
  intakeCount: number;
  attorneyContactCount: number;
  bookmarkCount: number;
}

interface ActivityItem {
  id: string;
  type: "evidence" | "timeline" | "note" | "clarion" | "analyzer" | "intake" | "attorney";
  title: string;
  date: string;
}

interface AnalyzerInsight {
  id: string;
  system_label: string;
  pattern_strength: string;
  created_at: string;
}

/* ─── Helpers ─── */
const typeIcons: Record<ActivityItem["type"], React.ElementType> = {
  evidence: FolderOpen,
  timeline: Clock,
  note: FileText,
  clarion: Feather,
  analyzer: Search,
  intake: Briefcase,
  attorney: Users,
};

const typeLabels: Record<ActivityItem["type"], string> = {
  evidence: "Evidence",
  timeline: "Timeline",
  note: "Note",
  clarion: "Clarion",
  analyzer: "Analyzer",
  intake: "Intake Packet",
  attorney: "Attorney Contact",
};

const strengthColor: Record<string, string> = {
  none: "text-muted-foreground",
  possible: "text-gold",
  strong: "text-primary",
  very_strong: "text-destructive",
};

function relativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/* ─── Dashboard ─── */
export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<CaseStats>({
    evidenceCount: 0, timelineCount: 0, notesCount: 0, lastActivity: null,
    clarionCount: 0, analyzerCount: 0, intakeCount: 0, attorneyContactCount: 0, bookmarkCount: 0,
  });
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [analyzerInsights, setAnalyzerInsights] = useState<AnalyzerInsight[]>([]);
  const [justiceCase, setJusticeCase] = useState<{
    case_name: string;
    case_status: string;
    issue_type: string;
    state: string;
    county: string;
    created_at: string;
  } | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth?redirect=/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchAll = async () => {
      // Stats counts
      const [evidenceRes, timelineRes, notesRes, clarionRes, analyzerRes, intakeRes, attorneyRes, bookmarkRes] = await Promise.all([
        supabase.from("evidence").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("timeline_entries").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("notes").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("clarion_entries").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("analyzer_results").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("intake_packets").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("attorney_contacts").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("justice_place_bookmarks").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      ]);

      // Recent activity feed — pull latest 3 from each source
      const [recentEv, recentTl, recentNt, recentCl, recentAn, justiceCaseRes] = await Promise.all([
        supabase.from("evidence").select("id, title, updated_at").eq("user_id", user.id).order("updated_at", { ascending: false }).limit(3),
        supabase.from("timeline_entries").select("id, title, updated_at").eq("user_id", user.id).order("updated_at", { ascending: false }).limit(3),
        supabase.from("notes").select("id, title, updated_at").eq("user_id", user.id).order("updated_at", { ascending: false }).limit(3),
        supabase.from("clarion_entries").select("id, content, updated_at").eq("user_id", user.id).order("updated_at", { ascending: false }).limit(3),
        supabase.from("analyzer_results").select("id, system_label, pattern_strength, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5),
        supabase.from("justice_place_cases").select("case_name, case_status, issue_type, state, county, created_at").eq("user_id", user.id).maybeSingle(),
      ]);

      // Build activity feed
      const activities: ActivityItem[] = [];
      recentEv.data?.forEach((r) => activities.push({ id: r.id, type: "evidence", title: r.title, date: r.updated_at }));
      recentTl.data?.forEach((r) => activities.push({ id: r.id, type: "timeline", title: r.title, date: r.updated_at }));
      recentNt.data?.forEach((r) => activities.push({ id: r.id, type: "note", title: r.title, date: r.updated_at }));
      recentCl.data?.forEach((r) => activities.push({ id: r.id, type: "clarion", title: r.content.slice(0, 60) + (r.content.length > 60 ? "…" : ""), date: r.updated_at }));
      activities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      const allDates = activities.map((a) => a.date);

      setStats({
        evidenceCount: evidenceRes.count || 0,
        timelineCount: timelineRes.count || 0,
        notesCount: notesRes.count || 0,
        lastActivity: allDates[0] || null,
        clarionCount: clarionRes.count || 0,
        analyzerCount: analyzerRes.count || 0,
        intakeCount: intakeRes.count || 0,
        attorneyContactCount: attorneyRes.count || 0,
        bookmarkCount: bookmarkRes.count || 0,
      });
      setRecentActivity(activities.slice(0, 8));
      setAnalyzerInsights(recentAn.data || []);
      setJusticeCase(justiceCaseRes.data || null);
    };

    fetchAll();
  }, [user]);

  /* Chart data */
  const chartData = useMemo(() => [
    { name: "Evidence", value: stats.evidenceCount, fill: "hsl(var(--primary))" },
    { name: "Timeline", value: stats.timelineCount, fill: "hsl(var(--gold))" },
    { name: "Notes", value: stats.notesCount, fill: "hsl(var(--navy))" },
    { name: "Clarion", value: stats.clarionCount, fill: "hsl(var(--accent-strong))" },
    { name: "Analyses", value: stats.analyzerCount, fill: "hsl(var(--teal))" },
  ], [stats]);

  if (loading || !user) {
    return (
      <DashboardLayout pageTitle="Dashboard">
        <div className="container py-20 text-center">
          <p className="text-muted-foreground">Loading…</p>
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

  const totalItems = stats.evidenceCount + stats.timelineCount + stats.notesCount + stats.clarionCount + stats.analyzerCount;

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
          <SuggestedAction text={suggestedStep.text} href={suggestedStep.href} label={suggestedStep.label} />
        </div>
      </section>

      {/* ── Main Grid: Stats + Chart + Activity + Insights ── */}
      <section className="bg-cream py-12 sm:py-16">
        <div className="container max-w-5xl px-6">
          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <StatCard icon={FolderOpen} value={stats.evidenceCount} label="Evidence Items" />
            <StatCard icon={Clock} value={stats.timelineCount} label="Timeline Events" />
            <StatCard icon={FileText} value={stats.notesCount} label="Notes" />
            <StatCard icon={Bookmark} value={stats.bookmarkCount} label="Saved Resources" />
          </div>

          <div className="grid lg:grid-cols-5 gap-6">
            {/* Left column — chart + quick actions (3/5) */}
            <div className="lg:col-span-3 space-y-6">
              {/* Case Progress Chart */}
              <Widget title="Case Documentation" action={{ label: "Case Builder", href: "/case-builder" }}>
                {totalItems > 0 ? (
                  <div className="h-52">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} barCategoryGap="20%">
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                          allowDecimals={false}
                        />
                        <Tooltip
                          contentStyle={{
                            background: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: 8,
                            fontSize: 12,
                          }}
                        />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                          {chartData.map((entry, idx) => (
                            <Cell key={idx} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-52 flex flex-col items-center justify-center text-center">
                    <TrendingUp className="w-8 h-8 text-muted-foreground/30 mb-3" />
                    <p className="text-sm text-muted-foreground">Your documentation chart will appear here as you add entries.</p>
                    <Link to="/clarion" className="text-xs text-primary mt-2 hover:underline">Start with Clarion →</Link>
                  </div>
                )}
              </Widget>

              {/* Quick Actions */}
              <div className="grid sm:grid-cols-2 gap-4">
                <ActionCard icon={Scale} title="Continue Your Record" description="Return to your case workspace." href="/justice-place" delay={0.1} />
                <ActionCard icon={Upload} title="Upload Evidence" description="Add documents to your vault." href="/evidence-vault" delay={0.15} />
                <ActionCard icon={Clock} title="Build Timeline" description="Add chronological events." href="/timeline" delay={0.2} />
                <ActionCard icon={Briefcase} title="Case Builder" description="Step-by-step case assembly." href="/case-builder" delay={0.25} />
              </div>
            </div>

            {/* Right column — phase chart + activity feed + analyzer insights (2/5) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Phase Progress Donut Chart */}
              <Widget title="Progress by Phase">
                {(() => {
                  const phaseChartData = [
                    { name: "Tell Your Story", value: 1, fill: phases[0].started ? "hsl(var(--primary))" : "hsl(var(--muted))" },
                    { name: "Understand", value: 1, fill: phases[1].started ? "hsl(var(--gold))" : "hsl(var(--muted))" },
                    { name: "Organize Proof", value: 1, fill: phases[2].started ? "hsl(var(--teal))" : "hsl(var(--muted))" },
                    { name: "Prepare", value: 1, fill: phases[3].started ? "hsl(var(--accent-strong))" : "hsl(var(--muted))" },
                    { name: "Connect", value: 1, fill: phases[4].started ? "hsl(var(--navy))" : "hsl(var(--muted))" },
                  ];
                  const startedCount = phases.filter(p => p.started).length;
                  return (
                    <div className="h-48 relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={phaseChartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={70}
                            paddingAngle={3}
                            dataKey="value"
                            stroke="none"
                          >
                            {phaseChartData.map((entry, idx) => (
                              <Cell key={idx} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              background: "hsl(var(--card))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: 8,
                              fontSize: 12,
                            }}
                            formatter={(value: number, name: string) => [
                              value === 1 ? "Started" : "Not started",
                              name
                            ]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="text-center">
                          <p className="text-2xl font-serif font-medium text-foreground">{startedCount}/5</p>
                          <p className="text-[10px] text-muted-foreground">phases</p>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </Widget>

              {/* Activity Feed */}
              <Widget title="Recent Activity" action={{ label: "All Notes", href: "/notes" }}>
                {recentActivity.length > 0 ? (
                  <div className="space-y-1">
                    {recentActivity.map((item) => {
                      const Icon = typeIcons[item.type];
                      return (
                        <div key={item.id} className="flex items-start gap-3 py-2.5 border-b border-border/30 last:border-0">
                          <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-0.5">
                            <Icon className="w-3.5 h-3.5 text-gold/70" strokeWidth={1.5} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground truncate">{item.title}</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              {typeLabels[item.type]} · {relativeTime(item.date)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <Activity className="w-6 h-6 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No activity yet.</p>
                  </div>
                )}
              </Widget>

              {/* Analyzer Insights */}
              <Widget title="Analyzer Insights" action={{ label: "Run Analysis", href: "/analyzer" }}>
                {analyzerInsights.length > 0 ? (
                  <div className="space-y-2">
                    {analyzerInsights.map((insight) => (
                      <div key={insight.id} className="p-3 rounded-lg bg-muted/30 border border-border/50">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium text-foreground truncate">{insight.system_label}</span>
                          <span className={cn("text-[11px] capitalize font-medium", strengthColor[insight.pattern_strength] || "text-muted-foreground")}>
                            {insight.pattern_strength.replace("_", " ")}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1">
                          {relativeTime(insight.created_at)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center">
                    <Search className="w-6 h-6 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No analyses yet.</p>
                    <Link to="/analyzer" className="text-xs text-primary mt-1 inline-block hover:underline">Start an analysis →</Link>
                  </div>
                )}
              </Widget>

              {/* Saved Resources / Guides */}
              <Widget title="Saved Guides & Resources" action={{ label: "Library", href: "/education-library" }}>
                <div className="space-y-2">
                  <Link to="/education-library" className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 border border-border/40 hover:border-gold/30 transition-colors group">
                    <BookOpen className="w-4 h-4 text-gold/60 group-hover:text-gold transition-colors" strokeWidth={1.5} />
                    <span className="text-sm text-foreground">Legal Education Library</span>
                    <ArrowRight className="w-3 h-3 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                  <Link to="/rights-insight" className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 border border-border/40 hover:border-gold/30 transition-colors group">
                    <Shield className="w-4 h-4 text-gold/60 group-hover:text-gold transition-colors" strokeWidth={1.5} />
                    <span className="text-sm text-foreground">Rights Insight</span>
                    <ArrowRight className="w-3 h-3 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                  <Link to="/library" className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 border border-border/40 hover:border-gold/30 transition-colors group">
                    <BookOpen className="w-4 h-4 text-gold/60 group-hover:text-gold transition-colors" strokeWidth={1.5} />
                    <span className="text-sm text-foreground">Civil Rights Library</span>
                    <ArrowRight className="w-3 h-3 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </div>
                {stats.bookmarkCount > 0 && (
                  <Link to="/justice-place" className="mt-3 text-xs text-primary hover:underline flex items-center gap-1">
                    <Bookmark className="w-3 h-3" />
                    {stats.bookmarkCount} saved bookmark{stats.bookmarkCount !== 1 ? "s" : ""}
                  </Link>
                )}
              </Widget>
            </div>
          </div>
        </div>
      </section>

      {/* Three Sections */}
      <section className="bg-cream-warm py-12 sm:py-16">
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
                { label: "Support Network", href: "/support-network" },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Wellbeing + Privacy */}
      <section className="py-8">
        <div className="container max-w-5xl px-6 space-y-4">
          <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 flex items-start gap-3">
            <Heart className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              You can pause anytime. Your progress is saved automatically. Understanding takes time — and that's okay.
            </p>
          </div>
          <PrivacyBadge />
        </div>
      </section>
    </DashboardLayout>
  );
}
