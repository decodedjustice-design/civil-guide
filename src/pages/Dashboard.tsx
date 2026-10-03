import { Link } from "react-router-dom";
import { ArrowRight, CalendarClock, ClipboardList, FileSearch, FolderArchive, ListTree, MessageSquare, Plus, ScanSearch, Users } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EducationalNotice } from "@/components/shared/EducationalNotice";
import { Disclaimer } from "@/components/shared/Disclaimer";
import { useCases } from "@/hooks/useCases";
import { useCaseSnapshot } from "@/hooks/useCaseSnapshot";

const ACTIVE_CASE_KEY = "dj:active-case-id";

export default function Dashboard() {
  const { cases, isLoading } = useCases();
  const storedActiveId = typeof window !== "undefined" ? window.localStorage.getItem(ACTIVE_CASE_KEY) : null;
  const activeCase = cases.find((item) => item.id === storedActiveId) ?? cases[0] ?? null;
  const { snapshot, isLoading: snapshotLoading } = useCaseSnapshot(activeCase?.id);

  const timelineCount = snapshot.timeline.length;
  const evidenceCount = snapshot.evidence.length;
  const issueCount = snapshot.issues.length;
  const peopleCount = snapshot.people.length + snapshot.organizations.length;
  const communicationCount = snapshot.communications.length;
  const requestCount = snapshot.requests.length;
  const recordGapCount = snapshot.record_gaps.filter((gap) => !["received", "resolved"].includes(gap.status)).length;
  const reviewCount = [
    ...snapshot.timeline, ...snapshot.evidence, ...snapshot.issues,
    ...snapshot.people, ...snapshot.organizations, ...snapshot.communications, ...snapshot.record_gaps,
  ].filter((item) => item.review_status === "needs_review").length;
  const totalRecordItems = timelineCount + evidenceCount + issueCount + peopleCount + communicationCount + requestCount;
  const lastUpdated = activeCase?.updated_at ? new Date(activeCase.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : null;

  if (isLoading) return <Layout><div className="container max-w-6xl mx-auto px-4 py-20 text-center text-muted-foreground">Loading your cases…</div></Layout>;

  if (!activeCase) {
    return (
      <Layout>
        <div className="container max-w-5xl mx-auto px-4 py-8 sm:py-12">
          <EducationalNotice />
          <div className="max-w-3xl mx-auto py-10 text-center">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-3">Case command center</p>
            <h1 className="font-serif text-4xl sm:text-5xl font-medium text-foreground">Start with your story.</h1>
            <p className="text-muted-foreground max-w-xl mx-auto mt-4 leading-relaxed">
              Your dashboard is built around one connected case record. Write what happened, and Decoded Justice can organize the timeline, people, evidence, issues, and missing records as you go.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
              <Button asChild size="lg"><Link to="/case-builder">Start a case <ArrowRight className="w-4 h-4 ml-2" /></Link></Button>
              <Button asChild size="lg" variant="outline"><Link to="/cases"><FolderArchive className="w-4 h-4 mr-2" />Open case list</Link></Button>
            </div>
          </div>
          <Disclaimer variant="prominent" />
        </div>
      </Layout>
    );
  }

  const primaryHref = totalRecordItems === 0 ? "/case-builder" : recordGapCount > 0 ? "/cases/" + activeCase.id + "/record-gaps" : "/cases/" + activeCase.id;
  const primaryLabel = totalRecordItems === 0 ? "Continue your story" : recordGapCount > 0 ? "Review record gaps" : "Open case overview";
  const statusLabel = activeCase.status?.replace(/_/g, " ") || "open";

  const sections = [
    { label: "Timeline", count: timelineCount, icon: CalendarClock, to: "/cases/" + activeCase.id + "/timeline", detail: "What happened and when" },
    { label: "Evidence", count: evidenceCount, icon: FolderArchive, to: "/cases/" + activeCase.id + "/evidence", detail: "Documents and exhibits" },
    { label: "Issues", count: issueCount, icon: ListTree, to: "/cases/" + activeCase.id + "/issues", detail: "Questions and issues to review" },
    { label: "People & organizations", count: peopleCount, icon: Users, to: "/cases/" + activeCase.id + "/people", detail: "Who is connected to the record" },
    { label: "Communications", count: communicationCount, icon: MessageSquare, to: "/cases/" + activeCase.id + "/communications", detail: "Calls, messages, letters, and contacts" },
    { label: "Requests", count: requestCount, icon: FileSearch, to: "/cases/" + activeCase.id + "/requests", detail: "Records requested and deadlines" },
  ];

  return (
    <Layout>
      <div className="container max-w-6xl mx-auto px-4 py-6 sm:py-8">
        <EducationalNotice />
        <section className="relative overflow-hidden rounded-3xl bg-espresso text-white mt-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,hsl(var(--gold)/0.16),transparent_34%)]" />
          <div className="relative p-7 sm:p-10 lg:p-12">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-7">
              <div className="max-w-3xl">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-3">Case command center</p>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h1 className="font-serif text-3xl sm:text-4xl font-medium">{activeCase.name}</h1>
                  <Badge variant="outline" className="border-white/20 text-white/70 capitalize">{statusLabel}</Badge>
                </div>
                <p className="text-white/65 max-w-2xl leading-relaxed">
                  Your case record in one place. Nothing here is a legal conclusion; it is a working record you can review, correct, and build over time.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="secondary"><Link to="/case-builder"><Plus className="w-4 h-4 mr-2" />Continue building</Link></Button>
                <Button asChild variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10"><Link to="/cases">Switch case</Link></Button>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-9">
              {[
                ["Timeline events", timelineCount], ["Evidence items", evidenceCount], ["Issues to review", issueCount], ["Open record gaps", recordGapCount],
              ].map(([label, count]) => (
                <div key={label} className="rounded-2xl bg-white/5 border border-white/10 p-4">
                  <p className="text-2xl font-serif">{count}</p><p className="text-xs text-white/50 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6 mt-6">
          <Card><CardContent className="p-6 sm:p-7">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Continue where you left off</p>
            <h2 className="font-serif text-2xl text-foreground">{primaryLabel}</h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-xl">
              {snapshotLoading ? "Loading your current record…" : totalRecordItems === 0 ? "Your case is ready for the narrative-first workspace." : recordGapCount > 0 ? recordGapCount + " record gap" + (recordGapCount === 1 ? "" : "s") + " are still open." : "Your core case sections are available to review and expand."}
            </p>
            <Button asChild className="mt-5"><Link to={primaryHref}>{primaryLabel}<ArrowRight className="w-4 h-4 ml-2" /></Link></Button>
            {lastUpdated && <p className="text-xs text-muted-foreground/70 mt-4">Case updated {lastUpdated}</p>}
          </CardContent></Card>

          <Card><CardContent className="p-6 sm:p-7">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-2">Review queue</p>
            <h2 className="font-serif text-2xl">Keep the record accurate</h2>
            <p className="text-sm text-muted-foreground mt-2">
              {reviewCount > 0 ? reviewCount + " item" + (reviewCount === 1 ? "" : "s") + " changed or need review after narrative updates." : "No automatically flagged updates right now. You can still review any section manually."}
            </p>
            <Button asChild variant="outline" className="mt-5"><Link to={"/cases/" + activeCase.id + "/content-check"}><ScanSearch className="w-4 h-4 mr-2" />{reviewCount > 0 ? "Review flagged items" : "Run content check"}</Link></Button>
          </CardContent></Card>
        </div>

        <section className="mt-8">
          <div className="flex items-end justify-between gap-4 mb-4">
            <div><p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Your record</p><h2 className="font-serif text-2xl mt-1">Everything stays connected</h2></div>
            <Link to={"/cases/" + activeCase.id} className="text-sm text-primary hover:underline hidden sm:inline-flex items-center gap-1">Open full overview <ArrowRight className="w-3.5 h-3.5" /></Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {sections.map((section) => (
              <Link key={section.label} to={section.to} className="group">
                <Card className="h-full transition-all hover:border-primary/30 hover:shadow-sm"><CardContent className="p-5">
                  <section.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" strokeWidth={1.5} />
                  <div className="flex items-end justify-between gap-3 mt-5"><div><p className="font-medium text-foreground">{section.label}</p><p className="text-xs text-muted-foreground mt-1">{section.detail}</p></div><span className="text-2xl font-serif text-foreground">{section.count}</span></div>
                </CardContent></Card>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link to={"/cases/" + activeCase.id + "/record-gaps"} className="rounded-2xl border border-border bg-card p-5 hover:border-primary/30 transition-colors"><ClipboardList className="w-5 h-5 text-muted-foreground mb-4" /><p className="font-medium">Record gaps</p><p className="text-xs text-muted-foreground mt-1">See what records may still be missing.</p></Link>
          <Link to={"/cases/" + activeCase.id + "/relationships"} className="rounded-2xl border border-border bg-card p-5 hover:border-primary/30 transition-colors"><Users className="w-5 h-5 text-muted-foreground mb-4" /><p className="font-medium">Record relationships</p><p className="text-xs text-muted-foreground mt-1">Connect people, events, evidence, and issues.</p></Link>
          <Link to={"/cases/" + activeCase.id + "/packets"} className="rounded-2xl border border-border bg-card p-5 hover:border-primary/30 transition-colors"><FolderArchive className="w-5 h-5 text-muted-foreground mb-4" /><p className="font-medium">Packet builder</p><p className="text-xs text-muted-foreground mt-1">Prepare an organized packet from the canonical record.</p></Link>
          <Link to="/find-help" className="rounded-2xl border border-border bg-card p-5 hover:border-primary/30 transition-colors"><FileSearch className="w-5 h-5 text-muted-foreground mb-4" /><p className="font-medium">Find help</p><p className="text-xs text-muted-foreground mt-1">Explore legal and support resources when you're ready.</p></Link>
        </section>

        <div className="mt-8"><Disclaimer variant="prominent" /></div>
      </div>
    </Layout>
  );
}
